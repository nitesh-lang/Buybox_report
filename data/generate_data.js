const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const DATA_ROOT = __dirname;
const JSX_PATH = path.join(DATA_ROOT, "..", "src", "nexlev_ads_dashboard.jsx");

const BRANDS = {
  Nexlev: "Nexlev",
  "Audio array": "Audio Array",
};

const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function cleanMoney(value) {
  if (value === undefined || value === null || value === "") return 0;
  const text = String(value).replace(/[₹,\s]/g, "").trim();
  const num = Number(text || 0);
  return Number.isFinite(num) ? num : 0;
}

function cleanNum(value) {
  if (value === undefined || value === null || value === "") return 0;
  const text = String(value).replace(/[,\s]/g, "").trim();
  const num = Number(text || 0);
  return Number.isFinite(num) ? num : 0;
}

function cleanPct(value) {
  if (value === undefined || value === null || value === "") return 0;
  const text = String(value).replace("%", "").trim();
  const num = Number(text || 0);
  return Number.isFinite(num) ? num / 100 : 0;
}

function cleanText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function cleanOptionalMoney(value) {
  const text = cleanText(value, "");
  return text ? cleanMoney(text) : null;
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function readSheetRows(filePath, sheetName = null) {
  const workbook = XLSX.readFile(filePath, { raw: false });
  const targetSheet = sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[targetSheet];
  return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
}

function rowsToObjects(rows, headerRowIndex) {
  const headers = (rows[headerRowIndex] || []).map((cell) => cleanText(cell));
  return rows.slice(headerRowIndex + 1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function aggregateByAsin(rows, asinKey, builder) {
  const map = new Map();
  rows.forEach((row) => {
    const asin = cleanText(row[asinKey]);
    if (!asin) return;
    const current = map.get(asin) || builder();
    map.set(asin, current);
    current.__rows.push(row);
  });
  return map;
}

function readBusiness(filePath) {
  const rows = rowsToObjects(readSheetRows(filePath), 0);
  const map = new Map();
  rows.forEach((row) => {
    const asin = cleanText(row["(Child) ASIN"] || row["(Parent) ASIN"]);
    if (!asin) return;
    map.set(asin, {
      ASIN: asin,
      Title: cleanText(row["Title"]),
      Sessions: cleanNum(row["Sessions - Total"]),
      BuyboxPct: cleanPct(row["Featured Offer Percentage"]),
      NetUnits: cleanNum(row["Units Ordered"]),
      TotalNetSalesValue: cleanMoney(row["Ordered Product Sales"]),
      fbaSku: cleanText(row["FBA SKU"] || row["SKU"] || row["Seller SKU"] || row["Merchant SKU"]),
    });
  });
  return map;
}

function readAds(filePath, prefix) {
  const workbook = XLSX.readFile(filePath, { raw: false });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: 0, raw: false });
  const map = new Map();
  rows.forEach((row) => {
    const asin = cleanText(row["Advertised ASIN"]);
    if (!asin) return;
    const current = map.get(asin) || {
      [`${prefix}_Impressions`]: 0,
      [`${prefix}_Clicks`]: 0,
      [`${prefix}_Spend`]: 0,
      [`${prefix}_Sales`]: 0,
      [`${prefix}_Orders`]: 0,
    };
    current[`${prefix}_Impressions`] += cleanNum(row["Impressions"]);
    current[`${prefix}_Clicks`] += cleanNum(row["Clicks"]);
    current[`${prefix}_Spend`] += cleanMoney(row["Spend"]);
    current[`${prefix}_Sales`] += cleanMoney(row["14 Day Total Sales (₹)"]);
    current[`${prefix}_Orders`] += cleanNum(row["14 Day Total Orders (#)"]);
    map.set(asin, current);
  });
  return map;
}

function readSalesAsin(filePath, brandLabel) {
  const rows = rowsToObjects(readSheetRows(filePath), 1);
  const map = new Map();
  rows.forEach((row) => {
    const asin = cleanText(row["ASIN"]);
    if (!asin) return;
    const rowBrand = cleanText(row["Brand"]).toLowerCase();
    if (rowBrand && rowBrand !== brandLabel.toLowerCase()) return;
    const current = map.get(asin) || { OrderedRevenue: 0, OrderedUnits: 0, fbaSku: "" };
    current.OrderedRevenue += cleanMoney(row["Ordered Revenue"]);
    current.OrderedUnits += cleanNum(row["Ordered Units"]);
    current.fbaSku = current.fbaSku || cleanText(row["FBA SKU"] || row["SKU"] || row["Seller SKU"] || row["Merchant SKU"]);
    map.set(asin, current);
  });
  return map;
}

function firstMatchingFile(prefix) {
  return fs.readdirSync(DATA_ROOT).find((name) => name.startsWith(prefix) && name.endsWith(".xlsx")) || null;
}

function readWorkbookMaster(fileName, brandLabel) {
  if (!fileName) return [];
  const filePath = path.join(DATA_ROOT, fileName);
  const rows = rowsToObjects(readSheetRows(filePath, "AMS Review"), 2);

  return rows
    .map((row) => {
      if (brandLabel === "Nexlev") {
        return {
          Brand: brandLabel,
          ASIN: cleanText(row["ASIN"]),
          fbaSku: cleanText(row["FBA SKU"] || row["SKU"]),
          model: cleanText(row["Model"]),
          category: cleanText(row["Main Category"]),
          mainCat: cleanText(row["Category"]),
          dp: cleanOptionalMoney(row["DP"]),
          nlc: cleanOptionalMoney(row["NLC"]),
        };
      }
      return {
        Brand: brandLabel,
        ASIN: cleanText(row["Asin"]),
        fbaSku: cleanText(row["SKU"]),
        model: cleanText(row["Product Code"]),
        category: cleanText(row["Sub-Category"]),
        mainCat: cleanText(row["Category"]),
        dp: null,
        nlc: cleanOptionalMoney(row["NLC"]),
      };
    })
    .filter((row) => row.ASIN);
}

function readCombinedMasterCsv() {
  const filePath = path.join(DATA_ROOT, "combined_product_master.csv");
  if (!fs.existsSync(filePath)) return [];
  const rows = rowsToObjects(readSheetRows(filePath), 0);
  return rows
    .map((row) => ({
      Brand: cleanText(row["Brand"]),
      ASIN: cleanText(row["ASIN"] || row["Asin"]),
      fbaSku: cleanText(row["fbaSku"] || row["FBA SKU"] || row["SKU"]),
      model: cleanText(row["model"] || row["Model"]),
      category: cleanText(row["category"] || row["Category"]),
      mainCat: cleanText(row["mainCat"] || row["Main Category"]),
      dp: cleanOptionalMoney(row["dp"] || row["DP"]),
      nlc: cleanOptionalMoney(row["nlc"] || row["NLC"]),
    }))
    .filter((row) => row.Brand && row.ASIN);
}

function loadMasterData() {
  const masters = [
    ...readWorkbookMaster(firstMatchingFile("Nexlev BuyBox Master"), "Nexlev"),
    ...readWorkbookMaster(firstMatchingFile("Audio Array Buybox Analysis"), "Audio Array"),
    ...readCombinedMasterCsv(),
  ];
  const map = new Map();
  masters.forEach((row) => {
    const key = `${row.Brand}::${row.ASIN}`;
    if (!map.has(key)) map.set(key, row);
  });
  return map;
}

function processMonth(folderPath, brandLabel, monthLabel) {
  const businessPath = path.join(folderPath, "business_report.csv");
  const spPath = path.join(folderPath, "sp_ads.xlsx");
  const sdPath = path.join(folderPath, "sd_ads.xlsx");
  const salesPath = path.join(folderPath, "sales_asin.csv");

  if (![businessPath, spPath, sdPath].every((file) => fs.existsSync(file))) {
    return [];
  }

  const business = readBusiness(businessPath);
  const sp = readAds(spPath, "SP");
  const sd = readAds(sdPath, "SD");
  const sales = fs.existsSync(salesPath) ? readSalesAsin(salesPath, brandLabel) : new Map();

  const asins = new Set([...business.keys(), ...sp.keys(), ...sd.keys(), ...sales.keys()]);
  const rows = [];

  asins.forEach((asin) => {
    const biz = business.get(asin) || { ASIN: asin, Title: "", Sessions: 0, BuyboxPct: 0, NetUnits: 0, TotalNetSalesValue: 0, fbaSku: "" };
    const spRow = sp.get(asin) || { SP_Impressions: 0, SP_Clicks: 0, SP_Spend: 0, SP_Sales: 0, SP_Orders: 0 };
    const sdRow = sd.get(asin) || { SD_Impressions: 0, SD_Clicks: 0, SD_Spend: 0, SD_Sales: 0, SD_Orders: 0 };
    const salesRow = sales.get(asin) || { OrderedRevenue: 0, OrderedUnits: 0, fbaSku: "" };

    const impressions = spRow.SP_Impressions + sdRow.SD_Impressions;
    const clicks = spRow.SP_Clicks + sdRow.SD_Clicks;
    const totalAdsSpend = spRow.SP_Spend + sdRow.SD_Spend;
    const totalAdsSales = spRow.SP_Sales + sdRow.SD_Sales;
    const amsOrders = spRow.SP_Orders + sdRow.SD_Orders;
    const organicUnits = Math.max(0, biz.NetUnits - amsOrders);
    const organicSalesValue = Math.max(0, biz.TotalNetSalesValue - totalAdsSales);
    const amazonSalesValue = Math.max(0, salesRow.OrderedRevenue);
    const amazonUnits = Math.max(0, salesRow.OrderedUnits);

    rows.push({
      ASIN: asin,
      Title: biz.Title,
      Sessions: round(biz.Sessions),
      BuyboxPct: round(biz.BuyboxPct),
      NetUnits: round(biz.NetUnits),
      TotalNetSalesValue: round(biz.TotalNetSalesValue, 2),
      Impressions: round(impressions),
      Clicks: round(clicks),
      TotalAdsSpend: round(totalAdsSpend, 2),
      TotalAdsSales: round(totalAdsSales, 2),
      AmsOrders: round(amsOrders),
      Brand: brandLabel,
      Month: monthLabel,
      OrganiSales: round(organicUnits),
      OrganicSalesValue: round(organicSalesValue, 2),
      OrganicSalesPct: round(biz.TotalNetSalesValue > 0 ? organicSalesValue / biz.TotalNetSalesValue : 0),
      AttributedSalesValue: round(totalAdsSales, 2),
      AttributedNumber: round(amsOrders),
      AmazonSalesValue: round(amazonSalesValue, 2),
      AmazonUnits: round(amazonUnits),
      ACOS: round(totalAdsSales > 0 ? totalAdsSpend / totalAdsSales : 0),
      TACOS: round(biz.TotalNetSalesValue > 0 ? totalAdsSpend / biz.TotalNetSalesValue : 0),
      CAC: round(amsOrders > 0 ? totalAdsSpend / amsOrders : 0),
      ConversionPct: round(biz.Sessions > 0 ? biz.NetUnits / biz.Sessions : 0),
      AttributedPct: round(biz.NetUnits > 0 ? amsOrders / biz.NetUnits : 0),
      OrganicPct: round(biz.NetUnits > 0 ? organicUnits / biz.NetUnits : 0),
      OrderedRevenue: round(amazonSalesValue, 2),
      OrderedUnits: round(amazonUnits),
      fbaSku: cleanText(salesRow.fbaSku || biz.fbaSku),
    });
  });

  return rows;
}

function main() {
  const masterData = loadMasterData();
  const records = [];
  const monthsFound = [];

  Object.entries(BRANDS).forEach(([folderName, brandLabel]) => {
    const brandPath = path.join(DATA_ROOT, folderName);
    if (!fs.existsSync(brandPath)) return;
    fs.readdirSync(brandPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .forEach((entry) => {
        const month = entry.name;
        const rows = processMonth(path.join(brandPath, month), brandLabel, month);
        if (!rows.length) return;
        if (!monthsFound.includes(month)) monthsFound.push(month);
        rows.forEach((row) => {
          const master = masterData.get(`${brandLabel}::${row.ASIN}`) || {};
          records.push({
            ...row,
            fbaSku: cleanText(master.fbaSku || row.fbaSku),
            model: cleanText(master.model),
            category: cleanText(master.category),
            mainCat: cleanText(master.mainCat),
            dp: master.dp ?? null,
            nlc: master.nlc ?? null,
          });
        });
      });
  });

  const jsx = fs.readFileSync(JSX_PATH, "utf8");
  const jsonString = JSON.stringify(records);
  let nextJsx = jsx.replace(/const RAW_DATA = \[.*?\];/s, `const RAW_DATA = ${jsonString};`);

  const monthsSorted = monthsFound.sort((a, b) => {
    const ai = monthOrder.indexOf(a);
    const bi = monthOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  nextJsx = nextJsx.replace(/const months = \[.*?\];/, `const months = ["All", ${monthsSorted.map((month) => `"${month}"`).join(", ")}];`);

  fs.writeFileSync(JSX_PATH, nextJsx, "utf8");
  console.log(`Updated dashboard data with ${records.length} rows.`);
}

module.exports = { processMonth, readAds, readSalesAsin, readBusiness, loadMasterData, main };

if (require.main === module) {
  main();
}
