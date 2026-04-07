"""
BuyBox Ads Report — Monthly Data Generator
===========================================

FOLDER STRUCTURE:
-----------------
C:\\Projects\\buybox\\data\\
├── combined_product_master.csv   ← Shared master for both brands: FBA SKU / Model / Category / DP / NLC
├── Audio array\\
│   ├── Jan\\
│   │   ├── business_report.csv   ← Business Report from Amazon
│   │   ├── sales_asin.csv        ← Sales by ASIN from Amazon
│   │   ├── sp_ads.xlsx           ← Sponsored Products report
│   │   └── sd_ads.xlsx           ← Sponsored Display report
│   ├── Feb\\  (same 4 files)
│   └── Mar\\  (same 4 files)
└── Nexlev\\
    ├── Jan\\  (same 4 files)
    ├── Feb\\  (same 4 files)
    └── Mar\\  (same 4 files)

HOW TO USE EVERY MONTH:
------------------------
1. Download 4 files from Amazon for each brand
2. Rename them exactly as shown above
3. Put them in the correct brand/month folder
4. Maintain data\\combined_product_master.csv for both Nexlev and Audio Array DP/NLC
5. Open terminal in C:\\Projects\\buybox\\data\\
6. Run the generator
7. Refresh browser → dashboard updated!
"""

import pandas as pd
import numpy as np
import json, re, os, sys, glob

# ── CONFIG ────────────────────────────────────────────────────────────────────
DATA_ROOT = os.path.dirname(os.path.abspath(__file__))
JSX_PATH  = os.path.join(DATA_ROOT, '..', 'src', 'nexlev_ads_dashboard.jsx')

BRANDS = {
    'Nexlev':      'Nexlev',
    'Audio array': 'Audio Array',
}

COMBINED_MASTER_PATH = os.path.join(DATA_ROOT, 'combined_product_master.csv')
NEXLEV_MASTER_GLOB = os.path.join(DATA_ROOT, 'Nexlev BuyBox Master*.xlsx')
AUDIO_MASTER_GLOB = os.path.join(DATA_ROOT, 'Audio Array Buybox Analysis*.xlsx')

# ── Helpers ───────────────────────────────────────────────────────────────────
def clean_money(val):
    if pd.isna(val): return 0.0
    return float(re.sub(r'[₹,\s]', '', str(val)) or 0)

def clean_num(val):
    if pd.isna(val): return 0.0
    return float(re.sub(r'[,\s]', '', str(val)) or 0)

def clean_pct(val):
    if pd.isna(val): return 0.0
    return float(str(val).replace('%', '').strip() or 0) / 100

def clean_optional_text(val, default=''):
    if pd.isna(val):
        return default
    text = str(val).strip()
    return text if text else default

def clean_optional_money(val):
    if pd.isna(val) or str(val).strip() == '':
        return np.nan
    return clean_money(val)

def first_existing_file(pattern):
    matches = sorted(glob.glob(pattern))
    return matches[0] if matches else None

# ── Readers ───────────────────────────────────────────────────────────────────
def read_business(path):
    df = pd.read_csv(path)
    rename_map = {
        '(Child) ASIN':              'ASIN',
        'Title':                     'Title',
        'Sessions - Total':          'Sessions',
        'Featured Offer Percentage': 'BuyboxPct',
        'Units Ordered':             'NetUnits',
        'Ordered Product Sales':     'TotalNetSalesValue',
    }
    for col in df.columns:
        cl = str(col).lower().strip()
        if cl in ('fba sku', 'fbasku', 'fba_sku', 'sku', 'seller sku', 'seller_sku', 'merchant sku', 'merchant_sku'):
            rename_map[col] = 'fbaSku'
    df = df.rename(columns=rename_map)
    df['Sessions']           = df['Sessions'].apply(clean_num)
    df['BuyboxPct']          = df['BuyboxPct'].apply(clean_pct)
    df['NetUnits']           = df['NetUnits'].apply(clean_num)
    df['TotalNetSalesValue'] = df['TotalNetSalesValue'].apply(clean_money)
    df['Title']              = df['Title'].fillna('').astype(str)
    if 'fbaSku' not in df.columns:
        df['fbaSku'] = ''
    df['fbaSku'] = df['fbaSku'].apply(clean_optional_text)
    return df[['ASIN', 'Title', 'Sessions', 'BuyboxPct', 'NetUnits', 'TotalNetSalesValue', 'fbaSku']].copy()

def read_sp(path):
    df = pd.read_excel(path, engine='openpyxl')
    df = df.rename(columns={
        'Advertised ASIN':         'ASIN',
        'Spend':                   'Spend',
        '14 Day Total Sales (₹)':  'AdsSales',
        '14 Day Total Orders (#)': 'Orders',
    })
    for col in ['Spend', 'AdsSales', 'Orders', 'Impressions', 'Clicks']:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    return df.groupby('ASIN', as_index=False).agg(
        SP_Impressions=('Impressions', 'sum'),
        SP_Clicks     =('Clicks',      'sum'),
        SP_Spend      =('Spend',       'sum'),
        SP_Sales      =('AdsSales',    'sum'),
        SP_Orders     =('Orders',      'sum'),
    )

def read_sd(path):
    df = pd.read_excel(path, engine='openpyxl')
    df = df.rename(columns={
        'Advertised ASIN':         'ASIN',
        'Spend':                   'Spend',
        '14 Day Total Sales (₹)':  'AdsSales',
        '14 Day Total Orders (#)': 'Orders',
    })
    for col in ['Spend', 'AdsSales', 'Orders', 'Impressions', 'Clicks']:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    return df.groupby('ASIN', as_index=False).agg(
        SD_Impressions=('Impressions', 'sum'),
        SD_Clicks     =('Clicks',      'sum'),
        SD_Spend      =('Spend',       'sum'),
        SD_Sales      =('AdsSales',    'sum'),
        SD_Orders     =('Orders',      'sum'),
    )

def read_sales_asin(path):
    # Row 0 = metadata, Row 1 = real headers, Row 2+ = data
    df = pd.read_csv(path, skiprows=1, dtype=str)
    # Strip whitespace from column names
    df.columns = df.columns.str.strip()
    print(f"     📋 sales_asin columns: {list(df.columns[:6])}")

    # Find ASIN, Ordered Revenue, Ordered Units columns (case-insensitive)
    col_map = {}
    for col in df.columns:
        cl = col.lower().strip()
        if cl == 'asin':
            col_map['ASIN'] = col
        elif cl in ('fba sku', 'fbasku', 'fba_sku', 'sku', 'seller sku', 'seller_sku', 'merchant sku', 'merchant_sku'):
            col_map['fbaSku'] = col
        elif 'ordered revenue' in cl:
            col_map['OrderedRevenue'] = col
        elif 'ordered units' in cl:
            col_map['OrderedUnits'] = col

    if 'ASIN' not in col_map:
        print(f"     ⚠️  Could not find ASIN column in sales_asin.csv")
        return None

    df = df.rename(columns=col_map)
    df = df[df['ASIN'].notna() & (df['ASIN'].str.strip() != '')]

    if 'OrderedRevenue' in df.columns:
        df['OrderedRevenue'] = df['OrderedRevenue'].apply(clean_money)
    else:
        df['OrderedRevenue'] = 0.0

    if 'OrderedUnits' in df.columns:
        df['OrderedUnits'] = df['OrderedUnits'].apply(clean_num)
    else:
        df['OrderedUnits'] = 0.0

    if 'fbaSku' in df.columns:
        df['fbaSku'] = df['fbaSku'].apply(clean_optional_text)
    else:
        df['fbaSku'] = ''

    return df[['ASIN', 'OrderedRevenue', 'OrderedUnits', 'fbaSku']].groupby('ASIN', as_index=False).agg(
        OrderedRevenue=('OrderedRevenue', 'sum'),
        OrderedUnits  =('OrderedUnits',   'sum'),
        fbaSku        =('fbaSku',         'last'),
    )

def read_combined_master(path):
    if not os.path.exists(path):
        print(f"  ℹ️  Combined master not found: {path}")
        return pd.DataFrame(columns=['Brand', 'ASIN', 'fbaSku', 'model', 'category', 'mainCat', 'dp', 'nlc'])

    df = pd.read_csv(path, dtype=str)
    df.columns = [str(col).strip() for col in df.columns]

    rename_map = {}
    for col in df.columns:
        cl = col.lower().strip()
        if cl == 'brand':
            rename_map[col] = 'Brand'
        elif cl == 'asin':
            rename_map[col] = 'ASIN'
        elif cl in ('fba sku', 'fbasku', 'fba_sku'):
            rename_map[col] = 'fbaSku'
        elif cl == 'model':
            rename_map[col] = 'model'
        elif cl == 'category':
            rename_map[col] = 'category'
        elif cl in ('main category', 'maincat', 'main_cat'):
            rename_map[col] = 'mainCat'
        elif cl == 'dp':
            rename_map[col] = 'dp'
        elif cl == 'nlc':
            rename_map[col] = 'nlc'

    df = df.rename(columns=rename_map)

    if 'Brand' not in df.columns or 'ASIN' not in df.columns:
        print(f"  ⚠️  Combined master skipped — Brand/ASIN column missing in {path}")
        return pd.DataFrame(columns=['Brand', 'ASIN', 'fbaSku', 'model', 'category', 'mainCat', 'dp', 'nlc'])

    for col in ['fbaSku', 'model', 'category', 'mainCat']:
        if col not in df.columns:
            df[col] = ''
        df[col] = df[col].apply(clean_optional_text)

    for col in ['dp', 'nlc']:
        if col not in df.columns:
            df[col] = np.nan
        df[col] = df[col].apply(clean_optional_money)

    df['Brand'] = df['Brand'].apply(clean_optional_text)
    df['ASIN'] = df['ASIN'].apply(clean_optional_text)
    df = df[(df['Brand'] != '') & (df['ASIN'] != '')]

    print(f"  ✅ Loaded combined master: {len(df)} rows")
    return df[['Brand', 'ASIN', 'fbaSku', 'model', 'category', 'mainCat', 'dp', 'nlc']].drop_duplicates(subset=['Brand', 'ASIN'], keep='last')

def read_excel_master(path, brand_label):
    df = pd.read_excel(path, sheet_name='AMS Review', skiprows=2, dtype=str, engine='openpyxl')
    df.columns = [str(col).strip() for col in df.columns]
    df = df.dropna(how='all')

    if brand_label == 'Nexlev':
        rename_map = {
            'FBA SKU': 'fbaSku',
            'Model': 'model',
            'ASIN': 'ASIN',
            'Category': 'mainCat',
            'Main Category': 'category',
            'DP': 'dp',
            'NLC': 'nlc',
        }
    else:
        rename_map = {
            'Asin': 'ASIN',
            'SKU': 'fbaSku',
            'Product Code': 'model',
            'Category': 'mainCat',
            'Sub-Category': 'category',
            'NLC': 'nlc',
        }

    df = df.rename(columns=rename_map)

    if 'ASIN' not in df.columns:
        print(f"  ⚠️  Master skipped — ASIN column missing in {path}")
        return pd.DataFrame(columns=['Brand', 'ASIN', 'fbaSku', 'model', 'category', 'mainCat', 'dp', 'nlc'])

    for col in ['fbaSku', 'model', 'category', 'mainCat']:
        if col not in df.columns:
            df[col] = ''
        df[col] = df[col].apply(clean_optional_text)

    if 'dp' not in df.columns:
        df['dp'] = np.nan
    if 'nlc' not in df.columns:
        df['nlc'] = np.nan

    df['dp'] = df['dp'].apply(clean_optional_money)
    df['nlc'] = df['nlc'].apply(clean_optional_money)
    df['ASIN'] = df['ASIN'].apply(clean_optional_text)
    df = df[df['ASIN'] != '']
    df['Brand'] = brand_label

    print(f"  ✅ Loaded {brand_label} workbook master: {len(df)} rows")
    return df[['Brand', 'ASIN', 'fbaSku', 'model', 'category', 'mainCat', 'dp', 'nlc']].drop_duplicates(subset=['Brand', 'ASIN'], keep='first')

def load_master_data():
    masters = []

    nexlev_master_path = first_existing_file(NEXLEV_MASTER_GLOB)
    if nexlev_master_path:
        masters.append(read_excel_master(nexlev_master_path, 'Nexlev'))

    audio_master_path = first_existing_file(AUDIO_MASTER_GLOB)
    if audio_master_path:
        masters.append(read_excel_master(audio_master_path, 'Audio Array'))

    if os.path.exists(COMBINED_MASTER_PATH):
        masters.append(read_combined_master(COMBINED_MASTER_PATH))

    masters = [df for df in masters if df is not None and not df.empty]
    if not masters:
        return pd.DataFrame(columns=['Brand', 'ASIN', 'fbaSku', 'model', 'category', 'mainCat', 'dp', 'nlc'])

    combined = pd.concat(masters, ignore_index=True)
    combined = combined.drop_duplicates(subset=['Brand', 'ASIN'], keep='first')
    print(f"  ✅ Total master rows available: {len(combined)}")
    return combined

# ── Process one brand + month ─────────────────────────────────────────────────
def process_month(folder, brand_label, month_label):
    biz_path   = os.path.join(folder, 'business_report.csv')
    sp_path    = os.path.join(folder, 'sp_ads.xlsx')
    sd_path    = os.path.join(folder, 'sd_ads.xlsx')
    sales_path = os.path.join(folder, 'sales_asin.csv')

    missing = [name for p, name in [
        (biz_path, 'business_report.csv'),
        (sp_path,  'sp_ads.xlsx'),
        (sd_path,  'sd_ads.xlsx'),
    ] if not os.path.exists(p)]

    if missing:
        print(f"  ⚠️  Skipping {brand_label} {month_label} — missing: {', '.join(missing)}")
        return None

    print(f"  ✅ Reading {brand_label} — {month_label}")

    biz = read_business(biz_path)
    sp  = read_sp(sp_path)
    sd  = read_sd(sd_path)

    df = biz.merge(sp, on='ASIN', how='outer').merge(sd, on='ASIN', how='outer').fillna(0)
    df['Title'] = df['Title'].replace(0, '')

    # Merge sales_asin if available (optional file)
    if os.path.exists(sales_path):
        sales = read_sales_asin(sales_path)
        df = df.merge(sales, on='ASIN', how='left')
        df['OrderedRevenue'] = df['OrderedRevenue'].fillna(0).round(2)
        df['OrderedUnits']   = df['OrderedUnits'].fillna(0)
        df['fbaSku'] = df['fbaSku'].fillna('')
    else:
        print(f"     ℹ️  sales_asin.csv not found for {brand_label} {month_label} — OrderedRevenue/Units will be 0")
        df['OrderedRevenue'] = 0.0
        df['OrderedUnits']   = 0.0

    df['Impressions']   = df['SP_Impressions'] + df['SD_Impressions']
    df['Clicks']        = df['SP_Clicks']      + df['SD_Clicks']
    df['TotalAdsSpend'] = df['SP_Spend']       + df['SD_Spend']
    df['TotalAdsSales'] = df['SP_Sales']       + df['SD_Sales']
    df['AmsOrders']     = df['SP_Orders']      + df['SD_Orders']
    df['OrganiSales']   = (df['NetUnits'] - df['AmsOrders']).clip(lower=0)
    df['OrganicSalesValue'] = (df['TotalNetSalesValue'] - df['TotalAdsSales']).clip(lower=0)
    df['OrganicSalesPct'] = np.where(
        df['TotalNetSalesValue'] > 0,
        df['OrganicSalesValue'] / df['TotalNetSalesValue'],
        0
    )
    df['AttributedSalesValue'] = df['TotalAdsSales']
    df['AttributedNumber'] = df['AmsOrders']
    df['AmazonSalesValue'] = df['OrderedRevenue']
    df['AmazonUnits'] = df['OrderedUnits']

    df['ACOS']          = np.where(df['TotalAdsSales']      > 0, df['TotalAdsSpend'] / df['TotalAdsSales'],      0)
    df['TACOS']         = np.where(df['TotalNetSalesValue'] > 0, df['TotalAdsSpend'] / df['TotalNetSalesValue'], 0)
    df['CAC']           = np.where(df['AmsOrders']          > 0, df['TotalAdsSpend'] / df['AmsOrders'],          0)
    df['ConversionPct'] = np.where(df['Sessions']           > 0, df['NetUnits']      / df['Sessions'],           0)
    df['AttributedPct'] = np.where(df['NetUnits']           > 0, df['AmsOrders']     / df['NetUnits'],           0)
    df['OrganicPct']    = np.where(df['NetUnits']           > 0, df['OrganiSales']   / df['NetUnits'],           0)

    df['Brand'] = brand_label
    df['Month'] = month_label

    for col in ['ACOS', 'TACOS', 'CAC', 'ConversionPct', 'AttributedPct', 'OrganicPct', 'OrganicSalesPct', 'BuyboxPct']:
        df[col] = df[col].round(4)
    for col in ['TotalAdsSpend', 'TotalAdsSales', 'TotalNetSalesValue', 'OrganicSalesValue', 'AttributedSalesValue', 'AmazonSalesValue']:
        df[col] = df[col].round(2)

    return df[['ASIN', 'Title', 'Sessions', 'BuyboxPct', 'NetUnits', 'TotalNetSalesValue',
               'Impressions', 'Clicks', 'TotalAdsSpend', 'TotalAdsSales', 'AmsOrders',
               'Brand', 'Month', 'OrganiSales', 'OrganicSalesValue', 'OrganicSalesPct',
               'AttributedSalesValue', 'AttributedNumber', 'AmazonSalesValue', 'AmazonUnits', 'ACOS', 'TACOS', 'CAC',
               'ConversionPct', 'AttributedPct', 'OrganicPct',
               'OrderedRevenue', 'OrderedUnits']]

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("\n BuyBox Ads Report - Data Generator")
    print("=" * 40)

    frames = []
    months_found = []
    combined_master = load_master_data()

    for brand_folder_name, brand_label in BRANDS.items():
        brand_path = os.path.join(DATA_ROOT, brand_folder_name)
        if not os.path.exists(brand_path):
            print(f"\n  Brand folder not found: {brand_path}")
            continue

        month_folders = sorted([
            d for d in os.listdir(brand_path)
            if os.path.isdir(os.path.join(brand_path, d))
        ])

        print(f"\n  Brand: {brand_label}")
        for month in month_folders:
            month_path = os.path.join(brand_path, month)
            df = process_month(month_path, brand_label, month)
            if df is not None:
                frames.append(df)
                print(f"     → {len(df)} ASINs")
                if month not in months_found:
                    months_found.append(month)

    if not frames:
        print("\n No data found! Check folder structure and file names.")
        sys.exit(1)

    final = pd.concat(frames, ignore_index=True)

    if not combined_master.empty:
        final = final.merge(combined_master, on=['Brand', 'ASIN'], how='left')
        if 'fbaSku_x' in final.columns or 'fbaSku_y' in final.columns:
            final['fbaSku'] = final.get('fbaSku_y', '').fillna('').astype(str)
            feed_fba = final.get('fbaSku_x', '').fillna('').astype(str)
            final['fbaSku'] = final['fbaSku'].where(final['fbaSku'].str.strip() != '', feed_fba)
            final = final.drop(columns=[col for col in ['fbaSku_x', 'fbaSku_y'] if col in final.columns])
    else:
        final['model'] = ''
        final['category'] = ''
        final['mainCat'] = ''
        final['dp'] = np.nan
        final['nlc'] = np.nan

    if 'fbaSku' not in final.columns:
        final['fbaSku'] = ''

    for col in ['fbaSku', 'model', 'category', 'mainCat']:
        final[col] = final[col].fillna('')

    print(f"\n Total rows: {len(final)}")
    print(f" Months   : {months_found}")

    records = []
    for _, row in final.iterrows():
        r = {}
        for col in final.columns:
            v = row[col]
            if isinstance(v, float):
                r[col] = 0 if (np.isnan(v) or np.isinf(v)) else round(float(v), 4)
            elif isinstance(v, (np.integer,)):
                r[col] = int(v)
            else:
                r[col] = str(v) if v else ''
        records.append(r)

    json_str = json.dumps(records, ensure_ascii=False)

    jsx_path = os.path.abspath(JSX_PATH)
    if not os.path.exists(jsx_path):
        print(f"\n JSX not found: {jsx_path}")
        sys.exit(1)

    with open(jsx_path, 'r', encoding='utf-8') as f:
        jsx = f.read()

    new_jsx = re.sub(
        r'const RAW_DATA = \[.*?\];',
        f'const RAW_DATA = {json_str};',
        jsx, flags=re.DOTALL
    )

    # Dynamically update the months dropdown array
    month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    months_found_sorted = sorted(months_found, key=lambda m: month_order.index(m) if m in month_order else 99)
    months_js = '["All", ' + ', '.join(f'"{m}"' for m in months_found_sorted) + ']'
    new_jsx = re.sub(
        r'const months = \[.*?\];',
        f'const months = {months_js};',
        new_jsx
    )

    # Always ensure React is imported correctly on line 1
    new_jsx = re.sub(
        r'^import \{',
        'import React, {',
        new_jsx
    )
    # Ensure useDeferredValue is imported
    if 'useDeferredValue' not in new_jsx.split('\n')[0]:
        new_jsx = re.sub(
            r'(import React,\s*\{[^}]*)(useEffect)(\s*\})',
            r'\1useEffect, useDeferredValue\3',
            new_jsx
        )

    with open(jsx_path, 'w', encoding='utf-8') as f:
        f.write(new_jsx)

    print(f"\n Done! Refresh localhost:5173 to see updated dashboard.")

if __name__ == '__main__':
    main()
