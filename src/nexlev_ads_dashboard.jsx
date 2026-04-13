import React, { useState, useMemo, useCallback, useTransition, useRef, useEffect, useDeferredValue } from "react";
import RAW_DATA from "./raw_data.json";

// ── ASIN Master: FBA SKU · Model · Category · DP · NLC ──────────────────────
const ASIN_MASTER = {
  "B0CYSLCRQS": { fbaSku:"FBA79263", model:"MR-01", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:908.87,  nlc:1072.47 },
  "B0CYSMBCB8": { fbaSku:"FBA79262", model:"SC-02", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:1088.32, nlc:1284.22 },
  "B0CDPP45BM": { fbaSku:"FBA78981", model:"SC-01", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:1439.27, nlc:1698.34 },
  "B0D2LGR3GG": { fbaSku:"FBA79266", model:"T-01",  category:"Trimmers & Body Groomers",mainCat:"HPC",            dp:416.40,  nlc:491.35  },
  "B0D63DTKQB": { fbaSku:"FBA79333", model:"HM-02", category:"Hair Care",               mainCat:"HPC",            dp:544.84,  nlc:642.91  },
  "B0DTK4FY1G": { fbaSku:"FBA79451", model:"SS-01", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:1219.76, nlc:1439.32 },
  "B0D2LD6BYJ": { fbaSku:"FBA79267", model:"T-02",  category:"Trimmers & Body Groomers",mainCat:"HPC",            dp:488.96,  nlc:576.97  },
  "B0DCK7ZH5P": { fbaSku:"FBA79439", model:"MR-02", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:999.76,  nlc:1179.72 },
  "B0D67727VG": { fbaSku:"FBA79350", model:"EA-01", category:"Hair Care",               mainCat:"HPC",            dp:574.03,  nlc:677.35  },
  "B0DCGHVN81": { fbaSku:"FBA79452", model:"VC-01", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:832.34,  nlc:982.16  },
  "B0CDPMX152": { fbaSku:"FBA78980", model:"GS-02", category:"Fabric Care",             mainCat:"Home & Kitchen", dp:1001.17, nlc:1181.38 },
  "B0D8445KJN": { fbaSku:"FBA79279", model:"LR-01", category:"Fabric Care",             mainCat:"Home & Kitchen", dp:362.77,  nlc:428.07  },
  "B0D9KDQCCM": { fbaSku:"FBA79349", model:"SW-01", category:"Fabric Care",             mainCat:"Home & Kitchen", dp:308.74,  nlc:364.31  },
  "B0D845B2DG": { fbaSku:"FBA79280", model:"LR-02", category:"Fabric Care",             mainCat:"Home & Kitchen", dp:521.19,  nlc:614.80  },
  "B0D383WQPB": { fbaSku:"FBA79281", model:"GS-05", category:"Fabric Care",             mainCat:"Home & Kitchen", dp:1017.50, nlc:1200.65 },
  "B0D2LJSQXZ": { fbaSku:"FBA79282", model:"SM-01", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:1320.34, nlc:1558.00 },
  "B0DKJXRXKM": { fbaSku:"FBA79283", model:"BR-01", category:"Beauty & Skincare",       mainCat:"HPC",            dp:535.44,  nlc:631.82  },
  "B0DFCDKMWR": { fbaSku:"FBA79284", model:"CM-01", category:"Health & Wellness",       mainCat:"HPC",            dp:459.66,  nlc:542.40  },
  "B0DFCDZWND": { fbaSku:"FBA79285", model:"CM-02", category:"Health & Wellness",       mainCat:"HPC",            dp:459.66,  nlc:542.40  },
  "B0D9KFZYG8": { fbaSku:"FBA79286", model:"FS-01", category:"Health & Wellness",       mainCat:"Home & Kitchen", dp:627.12,  nlc:740.00  },
  "B0DNJS23HS": { fbaSku:"FBA79287", model:"SC-04", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:2074.58, nlc:2447.99 },
  "B0DQCWRG3H": { fbaSku:"FBA79288", model:"V-03",  category:"Hair Care",               mainCat:"HPC",            dp:727.50,  nlc:858.45  },
  "B0DCK3N2JJ": { fbaSku:"FBA79289", model:"HSB-04",category:"Hair Care",               mainCat:"HPC",            dp:762.71,  nlc:900.00  },
  "B0D9KFP4MG": { fbaSku:"FBA79290", model:"HSB-03",category:"Hair Care",               mainCat:"HPC",            dp:543.22,  nlc:641.00  },
  "B0DVC7VJP1": { fbaSku:"FBA79291", model:"ST-01", category:"Kitchen Appliances",      mainCat:"Home & Kitchen", dp:1728.81, nlc:2040.00 },
  "B0DM6BB3VT": { fbaSku:"FBA79292", model:"CFM-01",category:"Health & Wellness",       mainCat:"HPC",            dp:1000.00, nlc:1180.00 },
  "B0FT8R24QM": { fbaSku:"FBA79293", model:"LR-03", category:"Fabric Care",             mainCat:"Home & Kitchen", dp:237.29,  nlc:279.99  },
  "B0DFCG2VGS": { fbaSku:"FBA79294", model:"KE-01", category:"Kitchen Appliances",      mainCat:"Home & Kitchen", dp:465.30,  nlc:549.05  },
  "B0DFD123P5": { fbaSku:"FBA79295", model:"KE-02", category:"Kitchen Appliances",      mainCat:"Home & Kitchen", dp:413.56,  nlc:488.00  },
  "B0F43P6D23": { fbaSku:"FBA79296", model:"SC-05", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:848.64,  nlc:1001.38 },
  "B0DVC9PRSD": { fbaSku:"FBA79297", model:"A6",    category:"Air Purifiers",           mainCat:"Home & Kitchen", dp:4250.85, nlc:5016.00 },
  "B0DVC58QPZ": { fbaSku:"FBA79298", model:"AP220", category:"Air Purifiers",           mainCat:"Home & Kitchen", dp:1271.19, nlc:1500.00 },
  "B0FS6TB7CP": { fbaSku:"FBA79299", model:"PB-01", category:"Kitchen Appliances",      mainCat:"Home & Kitchen", dp:632.20,  nlc:746.00  },
  "B0DKJSCLBD": { fbaSku:"FBA79300", model:"VC-05", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:664.41,  nlc:784.00  },
  "B0DM66B2DW": { fbaSku:"FBA79301", model:"KM-01", category:"Health & Wellness",       mainCat:"HPC",            dp:830.59,  nlc:980.00  },
  "B0DNJP9T35": { fbaSku:"FBA79302", model:"SS-02", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:627.54,  nlc:740.50  },
  "B0DVC968P1": { fbaSku:"FBA79303", model:"HU-01", category:"Home Environment",        mainCat:"Home & Kitchen", dp:373.05,  nlc:440.40  },
  "B0DVC8NYY2": { fbaSku:"FBA79304", model:"HU-02", category:"Home Environment",        mainCat:"Home & Kitchen", dp:287.29,  nlc:339.00  },
  "B0DCGHKRXX": { fbaSku:"FBA79305", model:"LE-02", category:"Beauty & Skincare",       mainCat:"HPC",            dp:576.69,  nlc:680.50  },
  "B0DCK4DR1B": { fbaSku:"FBA79306", model:"LE-04", category:"Beauty & Skincare",       mainCat:"HPC",            dp:440.68,  nlc:520.00  },
  "B0DKJZDY72": { fbaSku:"FBA79307", model:"VC-04", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:745.76,  nlc:880.00  },
  "B0DVSZ2VVJ": { fbaSku:"FBA79308", model:"CFM-02",category:"Health & Wellness",       mainCat:"HPC",            dp:1525.42, nlc:1800.00 },
  "B0DDC3GVZW": { fbaSku:"FBA79309", model:"VC-03", category:"Cleaning & Vacuuming",    mainCat:"Home & Kitchen", dp:576.69,  nlc:680.50  },
  "B0D9KFQG8Q": { fbaSku:"FBA79310", model:"LE-03", category:"Beauty & Skincare",       mainCat:"HPC",            dp:508.47,  nlc:600.00  },
  "B0DNJJKBKG": { fbaSku:"FBA79311", model:"BM-02", category:"Health & Wellness",       mainCat:"HPC",            dp:559.32,  nlc:660.00  },
  "B0DFMRG2K4": { fbaSku:"FBA79312", model:"TM-02", category:"Trimmers & Body Groomers",mainCat:"HPC",            dp:610.17,  nlc:720.00  },
  "B0DK9NRBWJ": { fbaSku:"FBA79313", model:"TM-03", category:"Trimmers & Body Groomers",mainCat:"HPC",            dp:559.32,  nlc:660.00  },
  "B0FPGDVVCX": { fbaSku:"FBA79314", model:"CFM-03",category:"Health & Wellness",       mainCat:"HPC",            dp:2161.02, nlc:2550.00 },
};

function splitCsvRow(line) {
  const cells = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell);
  return cells.map((value) => value.trim());
}

function parseCsvNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const cleaned = String(value).replace(/[₹,%"]/g, "").replace(/,/g, "").trim();
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCsvPercent(value) {
  if (!value) return 0;
  return parseCsvNumber(value) / 100;
}

function inferAudioCategory(title = "") {
  const text = title.toLowerCase();

  if (text.includes("headphone")) return { category: "Headphones", mainCat: "Audio Equipment" };
  if (text.includes("sound bar") || text.includes("soundbar") || text.includes("speaker")) return { category: "Speakers", mainCat: "Audio Equipment" };
  if (text.includes("microphone") || text.includes("mic ")) return { category: "Microphones", mainCat: "Audio Equipment" };
  if (text.includes("mixer") || text.includes("interface") || text.includes("soundcard")) return { category: "Mixers & Interfaces", mainCat: "Audio Equipment" };
  if (text.includes("bundle")) return { category: "Studio Bundles", mainCat: "Audio Equipment" };
  if (text.includes("cable") || text.includes("stand") || text.includes("adapter")) return { category: "Audio Accessories", mainCat: "Audio Equipment" };

  return { category: "Audio Gear", mainCat: "Audio Equipment" };
}

function inferAudioModel(title = "") {
  const match = title.match(/\b(?:AH|AM|AI|AA|AC|SB|PB)-[A-Z0-9-]+\b/i);
  return match ? match[0].toUpperCase() : "AA";
}

function parseAudioArrayCsv(raw, month) {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitCsvRow(lines[0]);
  const headerIndex = Object.fromEntries(headers.map((header, index) => [header, index]));

  return lines.slice(1).map((line) => {
    const values = splitCsvRow(line);
    const title = values[headerIndex.Title] || "Audio Array Product";
    const categoryMeta = inferAudioCategory(title);
    const units = parseCsvNumber(values[headerIndex["Units Ordered"]]);
    const orders = parseCsvNumber(values[headerIndex["Total Order Items"]]);

    return {
      ASIN: values[headerIndex["(Parent) ASIN"]] || values[headerIndex["(Child) ASIN"]],
      Title: title,
      Sessions: parseCsvNumber(values[headerIndex["Sessions - Total"]]),
      BuyboxPct: parseCsvPercent(values[headerIndex["Featured Offer Percentage"]]),
      NetUnits: units,
      TotalNetSalesValue: parseCsvNumber(values[headerIndex["Ordered Product Sales"]]),
      Impressions: 0,
      Clicks: 0,
      TotalAdsSpend: 0,
      TotalAdsSales: 0,
      AmsOrders: 0,
      Brand: "Audio Array",
      Month: month,
      OrganiSales: orders || units,
      ACOS: 0,
      TACOS: 0,
      CAC: 0,
      ConversionPct: parseCsvPercent(values[headerIndex["Unit Session Percentage"]]),
      AttributedPct: 0,
      OrganicPct: 1,
      fbaSku: "—",
      model: inferAudioModel(title),
      category: categoryMeta.category,
      mainCat: categoryMeta.mainCat,
      dp: null,
      nlc: null,
    };
  }).filter((row) => row.ASIN);
}

const AUDIO_ARRAY_MASTER = Object.fromEntries(
  RAW_DATA
    .filter((row) => row.Brand === "Audio Array" && typeof row.Title === "string" && row.Title.trim())
    .map((row) => {
      const categoryMeta = inferAudioCategory(row.Title);
      return [
        row.ASIN,
        {
          fbaSku: row.fbaSku || "—",
          model: row.model || inferAudioModel(row.Title),
          category: row.category || categoryMeta.category,
          mainCat: row.mainCat || categoryMeta.mainCat,
          dp: row.dp ?? null,
          nlc: row.nlc ?? null,
        },
      ];
    })
);

const MASTER_DATA = { ...ASIN_MASTER, ...AUDIO_ARRAY_MASTER };
let ACTIVE_MASTER_DATA = {};

const THEME = {
  pageBg: "#E5E7EB",
  shellBg: "#F3F4F6",
  panelBg: "#F8FAFC",
  panelBgAlt: "#EEF2F7",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F4F6",
  surfaceSoft: "#E5E7EB",
  surfaceTint: "#EDF2F7",
  border: "#CBD5E1",
  borderStrong: "#94A3B8",
  text: "#111111",
  textSoft: "#334155",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
  headerBg: "#D1D5DB",
  headerBgActive: "#C4CAD3",
  headerText: "#111111",
  headerShadow: "0 6px 16px rgba(15,23,42,0.10)",
  stickyShadow: "12px 0 18px -18px rgba(15,23,42,0.16)",
  hover: "#E5E7EB",
};

// ── Column definitions ─────────────────────────────────────────────────────
const COLS = [
  { key:"ASIN",            label:"ASIN",           fmt:"str",  w:132 },
  { key:"fbaSku",          label:"FBA SKU",        fmt:"str",  w:90,  master:true },
  { key:"model",           label:"Model",          fmt:"str",  w:72,  master:true },
  { key:"category",        label:"Category",       fmt:"str",  w:130, master:true },
  // Product column removed
  { key:"Sessions",        label:"Sessions",       fmt:"num",  w:80  },
  { key:"BuyboxPct",       label:"Buybox%",        fmt:"pct",  w:78  },
  { key:"NetUnits",        label:"Net Units",      fmt:"num",  w:72  },
  { key:"TotalNetSalesValue",label:"Net Sales",    fmt:"inr",  w:100 },
  { key:"dp",              label:"DP ₹",           fmt:"inr2", w:80,  master:true },
  { key:"Impressions",     label:"Impressions",    fmt:"num",  w:92  },
  { key:"Clicks",          label:"Clicks",         fmt:"num",  w:62  },
  { key:"AmsOrders",       label:"AMS Orders",     fmt:"num",  w:85  },
  { key:"OrganiSales",     label:"Organic Sales",  fmt:"num",  w:95  },
  { key:"TotalAdsSpend",   label:"Ad Spend",      fmt:"inr",  w:90  },
  { key:"TotalAdsSales",   label:"Ad Sales",      fmt:"inr",  w:90  },
  { key:"ACOS",            label:"ACOS",           fmt:"pct",  w:72  },
  { key:"TACOS",           label:"TACOS",          fmt:"pct",  w:72  },
  { key:"CAC",             label:"CAC ₹",          fmt:"inr",  w:80  },
  { key:"ConversionPct",   label:"CVR%",           fmt:"pct",  w:76  },
  { key:"OrganicPct",      label:"Organic%",       fmt:"pct",  w:84  },
];

const STICKY_COLUMN_COUNT = 4;
const STICKY_LEFT_OFFSETS = COLS.slice(0, STICKY_COLUMN_COUNT).reduce((acc, col, index) => {
  acc[col.key] = COLS.slice(0, index).reduce((sum, current) => sum + current.w, 0);
  return acc;
}, {});

const SMART_VIEW_TABS = [
  {
    key: "low-buybox",
    label: "Low Buybox",
    description: "Buybox under 70%",
    matches: (row) => (row.BuyboxPct ?? 0) > 0 && (row.BuyboxPct ?? 0) < 0.7,
  },
  {
    key: "high-acos",
    label: "High ACOS",
    description: "ACOS above 35%",
    matches: (row) => (row.TotalAdsSales ?? 0) > 0 && (row.ACOS ?? 0) > 0.35,
  },
  {
    key: "high-spend-low-sales",
    label: "High Spend Low Sales",
    description: "High spend with weak ad return",
    matches: (row) => (row.TotalAdsSpend ?? 0) >= 5000 && (row.TotalAdsSales ?? 0) <= (row.TotalAdsSpend ?? 0) * 1.5,
  },
  {
    key: "high-sessions-low-units",
    label: "High Sessions Low Units",
    description: "Traffic high, units low",
    matches: (row) => (row.Sessions ?? 0) >= 100 && (row.NetUnits ?? 0) <= 3,
  },
  {
    key: "zero-ams-orders",
    label: "Zero AMS Orders",
    description: "No AMS orders",
    matches: (row) => (row.AmsOrders ?? 0) === 0,
  },
];

function inr(n) {
  if (!n) return "₹0";
  if (n >= 1e7) return "₹" + (n/1e7).toFixed(2) + "Cr";
  if (n >= 1e5) return "₹" + (n/1e5).toFixed(1) + "L";
  if (n >= 1e3) return "₹" + (n/1e3).toFixed(1) + "K";
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function getMasterValue(row, key) {
  const master = ACTIVE_MASTER_DATA[row.ASIN] ?? {};

  if (key === "fbaSku") {
    return master.fbaSku || row.fbaSku || row.ASIN || null;
  }

  if (key === "model") {
    return master.model || row.model || null;
  }

  if (key === "category") {
    return master.category || row.category || null;
  }

  if (key === "dp" || key === "nlc") {
    return master[key] ?? row[key] ?? null;
  }

  return master[key] ?? row[key] ?? null;
}

function getCategoryBucket(row, masterData = ACTIVE_MASTER_DATA) {
  const master = masterData[row.ASIN] ?? {};

  if (row.Brand === "Audio Array") {
    return master.category || row.category || master.mainCat || row.mainCat || "";
  }

  return master.mainCat || row.mainCat || master.category || row.category || "";
}

function fmtCell(row, col) {
  let v = col.master ? getMasterValue(row, col.key) : row[col.key];
  if (v === null || v === undefined || v === 0 || v === "") {
    if (col.fmt === "str" || col.fmt === "title") return v || "—";
    return null;
  }
  switch (col.fmt) {
    case "num":   return v.toLocaleString("en-IN");
    case "inr":   return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    case "inr2":  return "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "pct":   return (v * 100).toFixed(1) + "%";
    case "title": return typeof v === "string" && v.length > 45 ? v.slice(0, 45) + "…" : (v || "—");
    default: return v;
  }
}

function pctColor(key, v) {
  if (!v) return "#374151";
  if (key === "BuyboxPct")     return v >= 0.9 ? "#34D399" : v >= 0.6 ? "#FBBF24" : "#F87171";
  if (key === "ACOS")          return v < 0.15 ? "#34D399" : v < 0.30 ? "#FBBF24" : "#F87171";
  if (key === "TACOS")         return v < 0.10 ? "#34D399" : v < 0.20 ? "#FBBF24" : "#F87171";
  if (key === "ConversionPct") return v > 0.05 ? "#34D399" : v > 0.02 ? "#FBBF24" : "#F87171";
  if (key === "OrganicPct")    return v > 0.6  ? "#34D399" : v > 0.3  ? "#FBBF24" : "#F87171";
  return "#60A5FA";
}

function compareValues(a, b, direction = -1) {
  const aEmpty = a === null || a === undefined || a === "";
  const bEmpty = b === null || b === undefined || b === "";

  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  if (typeof a === "number" && typeof b === "number") {
    return direction * (b - a);
  }

  return direction * String(b).localeCompare(String(a), undefined, { numeric: true, sensitivity: "base" });
}

function csvSafe(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportRowsToCsv(filename, rows, columns) {
  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvSafe(row[column])).join(",")),
  ].join("\n");

  downloadBlob(filename, new Blob([csv], { type: "text/csv;charset=utf-8;" }));
}

function exportSvgNode(svgNode, filename) {
  if (!svgNode) return;
  const serializer = new XMLSerializer();
  const svgMarkup = serializer.serializeToString(svgNode);
  downloadBlob(filename, new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8;" }));
}

function getAmazonProductUrl(asin) {
  if (!asin) return "#";
  return `https://www.amazon.in/dp/${encodeURIComponent(asin)}`;
}

// ── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, trend }) {
  const isPos = trend > 0;
  const isNeg = trend < 0;
  return (
    <div style={{
      background: THEME.surface, border: `1px solid ${THEME.border}`,
      borderRadius: 10, padding: "10px 16px", minWidth: 140, flex: "0 0 auto",
      borderTop: `2px solid ${accent}`, display:"flex", flexDirection:"column", gap:2,
    }}>
      <div style={{ fontSize: 9, color: THEME.textMuted, fontFamily: "'DM Mono',monospace", letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: THEME.text, letterSpacing: -0.5, lineHeight: 1.2 }}>{value}</div>
      {trend !== undefined && trend !== null && (
        <div style={{ fontSize: 10, display:"flex", alignItems:"center", gap:2,
          color: isPos ? "#059669" : isNeg ? "#DC2626" : THEME.textMuted, fontWeight:700 }}>
          {isPos ? "▲" : isNeg ? "▼" : "—"} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function Panel({ title, subtitle, right, children }) {
  const hasHeader = title || subtitle || right;
  return (
    <section style={{ borderRadius: 22, border: `1px solid ${THEME.border}`, background: `linear-gradient(180deg, ${THEME.surface}, ${THEME.panelBg})`, boxShadow: "0 18px 48px rgba(15,23,42,0.06)", overflow: "hidden" }}>
      {hasHeader && (
        <div style={{ padding: "18px 20px 12px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            {title && <div style={{ fontSize: 16, fontWeight: 700, color: THEME.text }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 12, color: THEME.textMuted, marginTop: 4 }}>{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div style={{ padding: hasHeader ? "0 20px 20px" : "20px" }}>{children}</div>
    </section>
  );
}

function formatMetricValue(value, type) {
  if (!value) return type === "currency" ? "₹0" : "0";
  if (type === "currency") return inr(value);
  return value.toLocaleString("en-IN");
}

function MiniMonthBars({ jan = 0, feb = 0, colorA = "#38BDF8", colorB = "#A78BFA", type = "number" }) {
  const max = Math.max(jan, feb, 1);
  const bars = [
    { label: "Jan", value: jan, color: colorA },
    { label: "Feb", value: feb, color: colorB },
  ];

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {bars.map((bar) => (
        <div key={bar.label} style={{ display: "grid", gridTemplateColumns: "38px 1fr auto", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 10, color: THEME.textMuted, fontFamily: "'DM Mono',monospace" }}>{bar.label}</div>
          <div style={{ height: 10, borderRadius: 999, background: THEME.surfaceSoft, overflow: "hidden" }}>
            <div style={{ width: `${(bar.value / max) * 100}%`, minWidth: bar.value ? 8 : 0, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${bar.color}, ${bar.color}CC)` }} />
          </div>
          <div style={{ fontSize: 12, color: THEME.text, fontWeight: 600 }}>{formatMetricValue(bar.value, type)}</div>
        </div>
      ))}
    </div>
  );
}

function TrendLineChart({ points, color = "#38BDF8", valueType = "number", svgRef }) {
  const width = 520;
  const height = 180;
  const padding = 18;
  const values = points.map((point) => point.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const coords = points.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 200 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((tick) => {
          const y = padding + (tick * (height - padding * 2)) / 3;
          return <line key={tick} x1={padding} x2={width - padding} y1={y} y2={y} stroke={THEME.border} strokeWidth="1" />;
        })}
        <path d={`${path} L ${coords.at(-1)?.x ?? padding} ${height - padding} L ${coords[0]?.x ?? padding} ${height - padding} Z`} fill="url(#trendFill)" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill={THEME.surface} stroke={color} strokeWidth="2.5" />
            <text x={point.x} y={height - 2} textAnchor="middle" fill={THEME.textMuted} fontSize="10" fontFamily="'DM Mono', monospace">{point.label}</text>
            <text x={point.x} y={point.y - 10} textAnchor="middle" fill={THEME.text} fontSize="10">{formatMetricValue(point.value, valueType)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dataRows] = useState(RAW_DATA);
  const [masterData] = useState(MASTER_DATA);
  const [brand, setBrand]   = useState("");
  const [month, setMonth]   = useState("All");
  const [cat, setCat]       = useState("");
  const [compareAsin, setCompareAsin] = useState("");
  const [compareM1, setCompareM1] = useState("Jan");
  const [compareM2, setCompareM2] = useState("Feb");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiEndRef = React.useRef(null);
  const [detailAsin, setDetailAsin] = useState("");
  const [compareTabAsin, setCompareTabAsin] = useState("");
  const [topTenView, setTopTenView] = useState("ASIN");
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [sortKey, setSortKey] = useState("NetUnits");
  const [sortDir, setSortDir] = useState(-1);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [tableScrollTop, setTableScrollTop] = useState(0);
  const [ctTab, setCtTab] = useState("Overview");
  const [ctM1, setCtM1] = useState("Jan");
  const [ctM2, setCtM2] = useState("Feb");
  const [ctAsin, setCtAsin] = useState("");
  const [smartViewTab, setSmartViewTab] = useState("low-buybox");
  const [ctTop10View, setCtTop10View] = useState("ASIN");
  const [ctTop10Brand, setCtTop10Brand] = useState("");
  const [ctTop10MonthMode, setCtTop10MonthMode] = useState("selected");
  const [ctSearch, setCtSearch] = useState("");
  const [smartViewPage, setSmartViewPage] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const TABLE_PAGE_SIZE = 25;
  const [, startT]          = useTransition();
  const timer               = useRef(null);
  const tableScrollerRef    = useRef(null);
  const detailChartRef      = useRef(null);
  const comparisonChartRef  = useRef(null);
  const deferredSearch      = useDeferredValue(debSearch);

  ACTIVE_MASTER_DATA = masterData;

  useEffect(() => {
    if (compareTabAsin) {
      // Use URL hash params first, then fall back to global compareM1/M2 selection
      setCtM1(hashParams.m1 || compareM1 || "Jan");
      setCtM2(hashParams.m2 || compareM2 || "Feb");
      setCtAsin(compareTabAsin);
      setCtTab("Overview");
    }
  }, [compareTabAsin, compareM1, compareM2]);

  useEffect(() => {
    const syncDetailFromHash = () => {
      const hash = window.location.hash;
      // Parse #asin/<ASIN>?m1=Jan&m2=Feb
      const asinMatch = hash.match(/^#asin\/([^?]+)(?:\?m1=([^&]+)&m2=(.+))?$/);
      // Parse #compare/<ASIN>?m1=Jan&m2=Feb
      const compareMatch = hash.match(/^#compare\/([^?]+)(?:\?m1=([^&]+)&m2=(.+))?$/);
      const smartViewMatch = hash.match(/^#smart-views(?:\/([^?]+))?$/);

      if (asinMatch) {
        setDetailAsin(decodeURIComponent(asinMatch[1]));
        if (asinMatch[2]) setCompareM1(asinMatch[2]);
        if (asinMatch[3]) setCompareM2(asinMatch[3]);
      } else {
        setDetailAsin("");
      }

      if (compareMatch) {
        setCompareTabAsin(decodeURIComponent(compareMatch[1]));
        if (compareMatch[2]) setCompareM1(compareMatch[2]);
        if (compareMatch[3]) setCompareM2(compareMatch[3]);
      } else {
        setCompareTabAsin("");
      }

      if (smartViewMatch) {
        const nextTab = smartViewMatch[1] || SMART_VIEW_TABS[0].key;
        setSmartViewPage(true);
        setSmartViewTab(nextTab);
      } else {
        setSmartViewPage(false);
      }
    };

    syncDetailFromHash();
    window.addEventListener("hashchange", syncDetailFromHash);

    return () => window.removeEventListener("hashchange", syncDetailFromHash);
  }, []);

  const brands = useMemo(() => [...new Set(dataRows.map((row) => row.Brand))].sort(), [dataRows]);
  const months = ["All", "Jan", "Feb", "Mar"];
  const brandScopedRows = useMemo(
    () => dataRows.filter((row) => !brand || row.Brand === brand),
    [dataRows, brand]
  );
  const cats   = useMemo(() => [...new Set(brandScopedRows.map((row) => getCategoryBucket(row, masterData)).filter(Boolean))].sort(), [brandScopedRows, masterData]);
  const categoryCounts = useMemo(() => {
    const counts = new Map();
    brandScopedRows.forEach((row) => {
      const key = getCategoryBucket(row, masterData);
      if (!key) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [brandScopedRows, masterData]);

  const onSearch = useCallback(e => {
    const v = e.target.value; setSearch(v);
    setTablePage(1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => startT(() => setDebSearch(v)), 250);
  }, []);

  const handleSort = k => { if (sortKey === k) setSortDir(d => -d); else { setSortKey(k); setSortDir(-1); } };

  const enriched = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (let i = 0; i < dataRows.length; i++) {
      const r = dataRows[i];
      const key = r.ASIN + "|" + r.Month;
      if (seen.has(key)) continue;
      seen.add(key);
      const m = masterData[r.ASIN];
      out.push(m ? Object.assign(Object.create(null), r, m) : r);
    }
    return out;
  }, [dataRows, masterData]);

  const filtered = useMemo(() => {
    const q = deferredSearch.toLowerCase();
    return enriched.filter(r =>
      (!brand  || r.Brand === brand) &&
      (month === "All" || r.Month === month) &&
      (!cat    || getCategoryBucket(r, masterData) === cat) &&
      (!q || (r.ASIN||"").toLowerCase().includes(q) || (typeof r.Title==="string"&&r.Title.toLowerCase().includes(q)) || (r.fbaSku||"").toLowerCase().includes(q) || (r.model||"").toLowerCase().includes(q))
    );
  }, [enriched, brand, month, cat, deferredSearch, masterData]);

  const comparePool = useMemo(() => {
    return enriched.filter((row) =>
      (!brand || row.Brand === brand) &&
      (!deferredSearch || (row.ASIN || "").toLowerCase().includes(deferredSearch.toLowerCase()) || String(row.Title || "").toLowerCase().includes(deferredSearch.toLowerCase()))
    );
  }, [enriched, brand, deferredSearch]);

  const compareOptions = useMemo(() => {
    const map = new Map();
    comparePool.forEach((row) => {
      if (!map.has(row.ASIN)) map.set(row.ASIN, row);
    });
    return [...map.values()].sort((a, b) => (b.TotalNetSalesValue ?? 0) - (a.TotalNetSalesValue ?? 0));
  }, [comparePool]);

  const activeCompareAsin = useMemo(() => {
    if (compareAsin && compareOptions.some((row) => row.ASIN === compareAsin)) return compareAsin;
    return compareOptions[0]?.ASIN ?? "";
  }, [compareAsin, compareOptions]);

  const compareRows = useMemo(() => {
    return comparePool
      .filter((row) => row.ASIN === activeCompareAsin)
      .sort((a, b) => months.indexOf(a.Month) - months.indexOf(b.Month));
  }, [comparePool, activeCompareAsin]);

  const comparison = useMemo(() => {
    const m1row = compareRows.find((row) => row.Month === compareM1) ?? null;
    const m2row = compareRows.find((row) => row.Month === compareM2) ?? null;
    const selectedMeta = compareOptions.find((row) => row.ASIN === activeCompareAsin) ?? m1row ?? m2row ?? null;
    return { m1: m1row, m2: m2row, selectedMeta };
  }, [compareRows, compareOptions, activeCompareAsin, compareM1, compareM2]);

  const comparisonCards = useMemo(() => ([
    { label: "Net Units", jan: comparison.m1?.NetUnits ?? 0, feb: comparison.m2?.NetUnits ?? 0, type: "number", colorA: "#34D399", colorB: "#2DD4BF" },
    { label: "Net Sales", jan: comparison.m1?.TotalNetSalesValue ?? 0, feb: comparison.m2?.TotalNetSalesValue ?? 0, type: "currency", colorA: "#A78BFA", colorB: "#F472B6" },
    { label: "Sessions", jan: comparison.m1?.Sessions ?? 0, feb: comparison.m2?.Sessions ?? 0, type: "number", colorA: "#38BDF8", colorB: "#60A5FA" },
    { label: "Buybox", jan: (comparison.m1?.BuyboxPct ?? 0) * 100, feb: (comparison.m2?.BuyboxPct ?? 0) * 100, type: "number", colorA: "#FBBF24", colorB: "#FB7185" },
    { label: "Ad Sales", jan: comparison.m1?.TotalAdsSales ?? 0, feb: comparison.m2?.TotalAdsSales ?? 0, type: "currency", colorA: "#EC4899", colorB: "#FB7185" },
    { label: "Ad Spend", jan: comparison.m1?.TotalAdsSpend ?? 0, feb: comparison.m2?.TotalAdsSpend ?? 0, type: "currency", colorA: "#FB7185", colorB: "#EF4444" },
    { label: "Clicks", jan: comparison.m1?.Clicks ?? 0, feb: comparison.m2?.Clicks ?? 0, type: "number", colorA: "#0EA5E9", colorB: "#2563EB" },
    { label: "AMS Orders", jan: comparison.m1?.AmsOrders ?? 0, feb: comparison.m2?.AmsOrders ?? 0, type: "number", colorA: "#8B5CF6", colorB: "#7C3AED" },
    { label: "ACOS", jan: (comparison.m1?.ACOS ?? 0) * 100, feb: (comparison.m2?.ACOS ?? 0) * 100, type: "number", colorA: "#F59E0B", colorB: "#F97316" },
    { label: "TACOS", jan: (comparison.m1?.TACOS ?? 0) * 100, feb: (comparison.m2?.TACOS ?? 0) * 100, type: "number", colorA: "#10B981", colorB: "#059669" },
    { label: "Organic Units", jan: comparison.m1?.OrganiSales ?? 0, feb: comparison.m2?.OrganiSales ?? 0, type: "number", colorA: "#38BDF8", colorB: "#60A5FA" },
    { label: "Impressions", jan: comparison.m1?.Impressions ?? 0, feb: comparison.m2?.Impressions ?? 0, type: "number", colorA: "#A78BFA", colorB: "#8B5CF6" },
  ]), [comparison]);

  const brandMonthTotals = useMemo(() => {
    const sourceRows = enriched.filter((row) => !brand || row.Brand === brand);
    const summarizeMonth = (targetMonth) => sourceRows
      .filter((row) => row.Month === targetMonth)
      .reduce((acc, row) => ({
        sessions: acc.sessions + (row.Sessions ?? 0),
        units: acc.units + (row.NetUnits ?? 0),
        sales: acc.sales + (row.TotalNetSalesValue ?? 0),
        spend: acc.spend + (row.TotalAdsSpend ?? 0),
        adsSales: acc.adsSales + (row.TotalAdsSales ?? 0),
        orders: acc.orders + (row.AmsOrders ?? 0),
      }), { sessions: 0, units: 0, sales: 0, spend: 0, adsSales: 0, orders: 0 });

    return {
      m1: summarizeMonth(compareM1),
      m2: summarizeMonth(compareM2),
    };
  }, [enriched, brand, compareM1, compareM2]);

  const detailRows = useMemo(
    () => enriched.filter((row) => row.ASIN === detailAsin).sort((a, b) => months.indexOf(a.Month) - months.indexOf(b.Month)),
    [enriched, detailAsin]
  );
  const detailMeta = detailRows[0] ?? null;
  // Use compareM1/compareM2 directly — no hardcoded Jan/Feb fallback
  const detailM1 = detailRows.find((row) => row.Month === compareM1) ?? null;
  const detailM2 = detailRows.find((row) => row.Month === compareM2) ?? null;
  const detailGrowth = useMemo(() => {
    const metrics = [
      { key: "sales", label: "Sales Growth", jan: detailM1?.TotalNetSalesValue ?? 0, feb: detailM2?.TotalNetSalesValue ?? 0 },
      { key: "ads", label: "Ad Sales Growth", jan: detailM1?.TotalAdsSales ?? 0, feb: detailM2?.TotalAdsSales ?? 0 },
      { key: "units", label: "Units Growth", jan: detailM1?.NetUnits ?? 0, feb: detailM2?.NetUnits ?? 0 },
      { key: "buybox", label: "Buybox Growth", jan: detailM1?.BuyboxPct ?? 0, feb: detailM2?.BuyboxPct ?? 0 },
    ];

    return metrics.map((metric) => {
      const delta = metric.feb - metric.jan;
      const growthPct = metric.jan > 0 ? (delta / metric.jan) * 100 : metric.feb > 0 ? 100 : 0;
      return { ...metric, delta, growthPct };
    });
  }, [detailM1, detailM2]);

  const compareTabRows = useMemo(
    () => enriched.filter((row) => row.ASIN === compareTabAsin).sort((a, b) => months.indexOf(a.Month) - months.indexOf(b.Month)),
    [enriched, compareTabAsin]
  );
  // Parse compareM1/M2 from URL hash if present
  // hashParams reads from compareM1/compareM2 state which are kept in sync by the hash listener
  const hashParams = useMemo(() => {
    return { m1: compareM1 || "Jan", m2: compareM2 || "Feb" };
  }, [compareM1, compareM2]);
  const compareTabMeta = compareTabRows[0] ?? null;
  const compareTabM1 = compareTabRows.find((row) => row.Month === hashParams.m1) ?? null;
  const compareTabM2 = compareTabRows.find((row) => row.Month === hashParams.m2) ?? null;
  const compareTabMetrics = useMemo(() => ([
    { key: "sales", label: "Net Sales", jan: compareTabM1?.TotalNetSalesValue ?? 0, feb: compareTabM2?.TotalNetSalesValue ?? 0, type: "currency", colorA: "#2563EB", colorB: "#7C3AED" },
    { key: "units", label: "Net Units", jan: compareTabM1?.NetUnits ?? 0, feb: compareTabM2?.NetUnits ?? 0, type: "number", colorA: "#10B981", colorB: "#059669" },
    { key: "sessions", label: "Sessions", jan: compareTabM1?.Sessions ?? 0, feb: compareTabM2?.Sessions ?? 0, type: "number", colorA: "#06B6D4", colorB: "#0284C7" },
    { key: "buybox", label: "Buybox %", jan: (compareTabM1?.BuyboxPct ?? 0) * 100, feb: (compareTabM2?.BuyboxPct ?? 0) * 100, type: "number", colorA: "#F59E0B", colorB: "#F97316" },
    { key: "adsSales", label: "Ad Sales", jan: compareTabM1?.TotalAdsSales ?? 0, feb: compareTabM2?.TotalAdsSales ?? 0, type: "currency", colorA: "#EC4899", colorB: "#FB7185" },
    { key: "adsSpend", label: "Ad Spend", jan: compareTabM1?.TotalAdsSpend ?? 0, feb: compareTabM2?.TotalAdsSpend ?? 0, type: "currency", colorA: "#FB7185", colorB: "#EF4444" },
    { key: "clicks", label: "Clicks", jan: compareTabM1?.Clicks ?? 0, feb: compareTabM2?.Clicks ?? 0, type: "number", colorA: "#0EA5E9", colorB: "#2563EB" },
    { key: "orders", label: "AMS Orders", jan: compareTabM1?.AmsOrders ?? 0, feb: compareTabM2?.AmsOrders ?? 0, type: "number", colorA: "#8B5CF6", colorB: "#7C3AED" },
    { key: "impressions", label: "Impressions", jan: compareTabM1?.Impressions ?? 0, feb: compareTabM2?.Impressions ?? 0, type: "number", colorA: "#38BDF8", colorB: "#60A5FA" },
    { key: "acos", label: "ACOS", jan: (compareTabM1?.ACOS ?? 0) * 100, feb: (compareTabM2?.ACOS ?? 0) * 100, type: "number", colorA: "#F59E0B", colorB: "#F97316" },
    { key: "tacos", label: "TACOS", jan: (compareTabM1?.TACOS ?? 0) * 100, feb: (compareTabM2?.TACOS ?? 0) * 100, type: "number", colorA: "#10B981", colorB: "#059669" },
    { key: "organic", label: "Organic Units", jan: compareTabM1?.OrganiSales ?? 0, feb: compareTabM2?.OrganiSales ?? 0, type: "number", colorA: "#34D399", colorB: "#2DD4BF" },
    { key: "cac", label: "CAC ₹", jan: compareTabM1?.CAC ?? 0, feb: compareTabM2?.CAC ?? 0, type: "currency", colorA: "#A78BFA", colorB: "#8B5CF6" },
    { key: "cvr", label: "Conversion %", jan: (compareTabM1?.ConversionPct ?? 0) * 100, feb: (compareTabM2?.ConversionPct ?? 0) * 100, type: "number", colorA: "#34D399", colorB: "#10B981" },
    { key: "organicpct", label: "Organic %", jan: (compareTabM1?.OrganicPct ?? 0) * 100, feb: (compareTabM2?.OrganicPct ?? 0) * 100, type: "number", colorA: "#0EA5E9", colorB: "#2563EB" },
  ].map((metric) => {
    const delta = metric.feb - metric.jan;
    const growthPct = metric.jan > 0 ? (delta / metric.jan) * 100 : metric.feb > 0 ? 100 : 0;
    return { ...metric, delta, growthPct };
  })), [compareTabM1, compareTabM2]);

  const sorted = useMemo(() => {
    const col = COLS.find(c => c.key === sortKey);
    const isMaster = col?.master;
    return [...filtered].sort((a, b) => {
      const av = isMaster ? getMasterValue(a, sortKey) : (a[sortKey] ?? null);
      const bv = isMaster ? getMasterValue(b, sortKey) : (b[sortKey] ?? null);
      return compareValues(av, bv, sortDir);
    });
  }, [filtered, sortKey, sortDir]);

  const visibleRows = sorted;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / TABLE_PAGE_SIZE));
  const currentPage = Math.min(tablePage, totalPages);
  const pagedRows = visibleRows.slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE);
  const rankingMetricKey = useMemo(() => {
    const currentCol = COLS.find((column) => column.key === sortKey);
    return currentCol && currentCol.fmt !== "str" && currentCol.fmt !== "title" ? sortKey : "TotalNetSalesValue";
  }, [sortKey]);
  const topTenRows = useMemo(() => {
    const groups = new Map();

    filtered.forEach((row) => {
      const masterModel = getMasterValue(row, "model") || "Unmapped";
      const groupKey = topTenView === "ASIN" ? row.ASIN : masterModel;
      if (!groupKey) return;

      const current = groups.get(groupKey) ?? {
        key: groupKey,
        asin: row.ASIN,
        model: masterModel,
        title: row.Title,
        value: 0,
        brand: row.Brand,
      };

      const increment = Number(row[rankingMetricKey] ?? getMasterValue(row, rankingMetricKey) ?? 0) || 0;
      current.value += increment;
      groups.set(groupKey, current);
    });

    return [...groups.values()]
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filtered, topTenView, rankingMetricKey]);
  const compareSelectedLabel = useMemo(() => {
    const row = compareOptions.find((item) => item.ASIN === activeCompareAsin) ?? null;
    if (!row) return "No ASIN selected";
    return `${row.ASIN} - ${String(row.Title || "Product").slice(0, 48)}`;
  }, [compareOptions, activeCompareAsin]);

  const activeSmartView = useMemo(
    () => SMART_VIEW_TABS.find((view) => view.key === smartViewTab) ?? SMART_VIEW_TABS[0],
    [smartViewTab]
  );
  const smartViewRows = useMemo(() => (
    enriched.filter((row) => {
      const q = deferredSearch.toLowerCase();
      return (
        (!brand || row.Brand === brand) &&
        (month === "All" || row.Month === month) &&
        (!cat || getCategoryBucket(row, masterData) === cat) &&
        (!q || (row.ASIN || "").toLowerCase().includes(q) || String(row.Title || "").toLowerCase().includes(q) || (row.fbaSku || "").toLowerCase().includes(q) || (row.model || "").toLowerCase().includes(q)) &&
        activeSmartView.matches(row)
      );
    })
  ), [enriched, brand, month, cat, deferredSearch, masterData, activeSmartView]);
  const smartViewSortedRows = useMemo(() => {
    const col = COLS.find((column) => column.key === sortKey);
    const isMaster = col?.master;
    return [...smartViewRows].sort((a, b) => {
      const av = isMaster ? getMasterValue(a, sortKey) : (a[sortKey] ?? null);
      const bv = isMaster ? getMasterValue(b, sortKey) : (b[sortKey] ?? null);
      return compareValues(av, bv, sortDir);
    });
  }, [smartViewRows, sortKey, sortDir]);
  const smartViewTotals = useMemo(() => smartViewRows.reduce((acc, row) => ({
    rows: acc.rows + 1,
    sales: acc.sales + (row.TotalNetSalesValue ?? 0),
    spend: acc.spend + (row.TotalAdsSpend ?? 0),
    sessions: acc.sessions + (row.Sessions ?? 0),
  }), { rows: 0, sales: 0, spend: 0, sessions: 0 }), [smartViewRows]);
  const smartViewAvgBuybox = smartViewRows.length > 0
    ? smartViewRows.reduce((sum, row) => sum + (row.BuyboxPct ?? 0), 0) / smartViewRows.length
    : 0;

  // Totals
  const totals = useMemo(() => filtered.reduce((acc, r) => ({
    sessions: acc.sessions + (r.Sessions || 0),
    units:    acc.units    + (r.NetUnits || 0),
    sales:    acc.sales    + (r.TotalNetSalesValue || 0),
    spend:    acc.spend    + (r.TotalAdsSpend || 0),
    adsSales: acc.adsSales + (r.TotalAdsSales || 0),
    orders:   acc.orders   + (r.AmsOrders || 0),
  }), { sessions:0, units:0, sales:0, spend:0, adsSales:0, orders:0 }), [filtered]);

  const avgAcos  = totals.adsSales > 0 ? totals.spend / totals.adsSales : 0;
  const avgTacos = totals.sales    > 0 ? totals.spend / totals.sales    : 0;
  const activeFilterCount = [brand, month !== "All" ? month : "", cat, debSearch].filter(Boolean).length;

  // Prev month totals for trend indicators
  const monthOrder = ["Jan","Feb","Mar"];
  const prevMonth = month !== "All" ? monthOrder[monthOrder.indexOf(month) - 1] : null;
  const prevFiltered = useMemo(() => prevMonth ? enriched.filter(r =>
    (!brand || r.Brand === brand) && r.Month === prevMonth && (!cat || getCategoryBucket(r, masterData) === cat)
  ) : [], [enriched, brand, prevMonth, cat, masterData]);
  const prevTotals = useMemo(() => prevFiltered.reduce((acc, r) => ({
    sessions: acc.sessions + r.Sessions,
    units:    acc.units    + r.NetUnits,
    sales:    acc.sales    + r.TotalNetSalesValue,
    spend:    acc.spend    + r.TotalAdsSpend,
    adsSales: acc.adsSales + r.TotalAdsSales,
    orders:   acc.orders   + r.AmsOrders,
  }), { sessions:0, units:0, sales:0, spend:0, adsSales:0, orders:0 }), [prevFiltered]);
  const trendPct = (curr, prev) => prev > 0 ? ((curr - prev) / prev) * 100 : null;

  const ACCENT = "#3B82F6";
  const openDetailPage = (asin) => {
    if (!asin) return;
    const detailUrl = `${window.location.pathname}${window.location.search}#asin/${encodeURIComponent(asin)}?m1=${compareM1}&m2=${compareM2}`;
    window.open(detailUrl, "_blank", "noopener,noreferrer");
  };
  const openComparePage = (asin) => {
    if (!asin) return;
    const compareUrl = `${window.location.pathname}${window.location.search}#compare/${encodeURIComponent(asin)}?m1=${compareM1}&m2=${compareM2}`;
    window.open(compareUrl, "_blank", "noopener,noreferrer");
  };
  const openSmartViewPage = (tabKey = SMART_VIEW_TABS[0].key) => {
    const smartUrl = `${window.location.pathname}${window.location.search}#smart-views/${tabKey}`;
    window.open(smartUrl, "_blank", "noopener,noreferrer");
  };
  const switchSmartViewTab = (tabKey) => {
    setSmartViewTab(tabKey);
    window.location.hash = `smart-views/${tabKey}`;
  };
  const closeDetailPage = () => {
    const dashboardUrl = `${window.location.pathname}${window.location.search}`;
    if (window.location.hash.startsWith("#smart-views")) {
      window.location.href = dashboardUrl;
      return;
    }
    if (window.opener) {
      window.close();
      return;
    }
    if (window.location.hash.startsWith("#asin/") || window.location.hash.startsWith("#compare/")) {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = dashboardUrl;
      return;
    }
    window.location.href = dashboardUrl;
  };
  const exportFilteredData = () => {
    const exportColumns = [
      "ASIN", "fbaSku", "model", "category", "mainCat", "Title", "Brand", "Month",
      "Sessions", "BuyboxPct", "NetUnits", "TotalNetSalesValue", "Impressions", "Clicks",
      "AmsOrders", "OrganiSales", "TotalAdsSpend", "TotalAdsSales", "ACOS", "TACOS", "CAC", "ConversionPct",
    ];

    const sourceRows = smartViewPage ? smartViewRows : filtered;
    const rows = sourceRows.map((row) => ({
      ...row,
      fbaSku: getMasterValue(row, "fbaSku"),
      model: getMasterValue(row, "model"),
      category: getMasterValue(row, "category"),
      mainCat: row.mainCat || getMasterValue(row, "mainCat"),
    }));
    const brandPart = brand || "all-brands";
    const monthPart = month || "all-months";
    const smartPart = smartViewPage ? `${activeSmartView.key}-` : "";
    exportRowsToCsv(`buybox-${smartPart}table-${brandPart}-${monthPart}.csv`, rows, exportColumns);
    setShowExportMenu(false);
  };

  const exportTopTenData = () => {
    const rows = topTenRows.map((item, index) => ({
      Rank: index + 1,
      View: topTenView,
      Key: item.key,
      ASIN: item.asin,
      Brand: item.brand,
      Title: item.title,
      Metric: COLS.find((column) => column.key === rankingMetricKey)?.label || rankingMetricKey,
      Value: item.value,
    }));
    exportRowsToCsv(`buybox-top10-${topTenView.toLowerCase()}.csv`, rows, ["Rank", "View", "Key", "ASIN", "Brand", "Title", "Metric", "Value"]);
    setShowExportMenu(false);
  };

  const exportDetailData = () => {
    if (!detailRows.length) return;
    const rows = detailRows.map((row) => ({
      Month: row.Month,
      ASIN: row.ASIN,
      Brand: row.Brand,
      Title: row.Title,
      FbaSku: getMasterValue(row, "fbaSku"),
      Model: getMasterValue(row, "model"),
      Category: getMasterValue(row, "category"),
      Sessions: row.Sessions,
      BuyboxPct: row.BuyboxPct,
      NetUnits: row.NetUnits,
      NetSales: row.TotalNetSalesValue,
      AdsSpend: row.TotalAdsSpend,
      AdsSales: row.TotalAdsSales,
      AmsOrders: row.AmsOrders,
      Impressions: row.Impressions,
      Clicks: row.Clicks,
    }));
    exportRowsToCsv(`buybox-asin-${detailMeta.ASIN}.csv`, rows, ["Month", "ASIN", "Brand", "Title", "FbaSku", "Model", "Category", "Sessions", "BuyboxPct", "NetUnits", "NetSales", "AdsSpend", "AdsSales", "AmsOrders", "Impressions", "Clicks"]);
  };

  const printCurrentView = () => {
    window.print();
    setShowExportMenu(false);
  };

  if (smartViewPage) {
    return (
      <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", background:THEME.pageBg, minHeight:"100vh", color:THEME.text }}>
        <div style={{ background:THEME.surface, borderBottom:`1px solid ${THEME.border}`, padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={closeDetailPage} style={{ background:THEME.surfaceMuted, color:THEME.textSoft, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              ← Back
            </button>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:THEME.text, letterSpacing:-0.3 }}>Smart Views</div>
              <div style={{ fontSize:10, color:THEME.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:0.8 }}>BUYBOX ACTION WORKBENCH</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:THEME.textMuted }}>{smartViewRows.length} matching rows</span>
            <button onClick={exportFilteredData} style={{ background:THEME.panelBg, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"7px 12px", fontSize:11, color:THEME.textSoft, fontWeight:600, cursor:"pointer" }}>
              Export CSV
            </button>
          </div>
        </div>

        <div style={{ background:THEME.surface, borderBottom:`1px solid ${THEME.border}`, padding:"0 24px", display:"flex", gap:8, overflowX:"auto" }}>
          {SMART_VIEW_TABS.map((view) => (
            <button
              key={view.key}
              onClick={() => switchSmartViewTab(view.key)}
              title={view.description}
              style={{
                padding:"12px 16px",
                border:"none",
                borderBottom: smartViewTab === view.key ? "2px solid #2563EB" : "2px solid transparent",
                background:"transparent",
                color: smartViewTab === view.key ? "#1D4ED8" : THEME.textSoft,
                fontSize:12,
                fontWeight:700,
                cursor:"pointer",
                whiteSpace:"nowrap",
              }}
            >
              {view.label}
            </button>
          ))}
        </div>

        <div style={{ background:THEME.shellBg, borderBottom:`1px solid ${THEME.border}`, padding:"12px 24px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:"0 0 auto" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:THEME.textFaint, fontSize:13 }}>⌕</span>
            <input
              placeholder={`Search inside ${activeSmartView.label.toLowerCase()}…`}
              value={search}
              onChange={onSearch}
              style={{ background: search ? "#EFF6FF" : THEME.surface, border: search ? "1px solid #3B82F6" : `1px solid ${THEME.border}`, borderRadius:8, color:THEME.text, padding:"9px 14px 9px 34px", fontSize:12, width:260, outline:"none" }}
            />
          </div>
          {[
            { label:"Brand", val:brand, set:(value)=>{ setBrand(value); setTablePage(1); }, opts:[{v:"",l:"All Brands"},...brands.map((item)=>({v:item,l:item}))] },
            { label:"Month", val:month, set:(value)=>{ setMonth(value); setTablePage(1); }, opts:months.map((item)=>({v:item,l:item})) },
            { label:"Category", val:cat, set:(value)=>{ setCat(value); setTablePage(1); }, opts:[{v:"",l:"All Categories"},...cats.map((item)=>({v:item,l:item}))] },
          ].map((filter) => (
            <div key={filter.label} style={{ display:"flex", gap:6, alignItems:"center", padding:"7px 10px", borderRadius:8, background:THEME.surface, border:`1px solid ${THEME.border}` }}>
              <span style={{ fontSize:10, color:THEME.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:0.8, textTransform:"uppercase", fontWeight:600 }}>{filter.label}</span>
              <select value={filter.val} onChange={(e)=>filter.set(e.target.value)} style={{ background:"transparent", border:"none", color:THEME.text, padding:"1px 20px 1px 2px", fontSize:12, cursor:"pointer", appearance:"none", outline:"none" }}>
                {filter.opts.map((option)=><option key={option.v} value={option.v}>{option.l}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ padding:"18px 24px 12px", display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:12 }}>
          <KpiCard label="Matching Rows" value={smartViewTotals.rows.toLocaleString("en-IN")} accent="#2563EB" />
          <KpiCard label="Net Sales" value={inr(smartViewTotals.sales)} accent="#A78BFA" />
          <KpiCard label="Ad Spend" value={inr(smartViewTotals.spend)} accent="#FBBF24" />
          <KpiCard label="Avg Buybox" value={`${(smartViewAvgBuybox * 100).toFixed(1)}%`} accent="#34D399" />
        </div>

        <div style={{ padding:"0 24px 10px" }}>
          <div style={{ background:THEME.surface, border:`1px solid ${THEME.border}`, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:10, color:THEME.textMuted, fontFamily:"'DM Mono',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>View Summary</div>
            <div style={{ fontSize:17, fontWeight:800, color:THEME.text, marginBottom:6 }}>{activeSmartView.label}</div>
            <div style={{ fontSize:13, color:THEME.textSoft, lineHeight:1.6 }}>{activeSmartView.description}. Use this view to spot products that need immediate buybox or ads action.</div>
          </div>
        </div>

        <div style={{ padding:"0 24px 32px", overflowX:"auto" }}>
          <div style={{ borderRadius:12, border:`1px solid ${THEME.border}`, overflow:"hidden", minWidth:1800, background:THEME.surface, boxShadow:"0 4px 16px rgba(15,23,42,0.04)" }}>
            <div style={{ overflow:"auto", maxHeight:"calc(100vh - 310px)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
                <thead>
                  <tr style={{ background:THEME.headerBg }}>
                    {COLS.map((col) => (
                      <th key={col.key} onClick={()=>handleSort(col.key)} style={{
                        padding:"10px 10px",
                        textAlign: col.fmt==="str"||col.fmt==="title"?"left":"right",
                        color: sortKey===col.key ? "#1D4ED8" : THEME.headerText,
                        fontFamily:"'DM Mono',monospace",
                        fontSize:9.5,
                        fontWeight:500,
                        letterSpacing:0.7,
                        textTransform:"uppercase",
                        cursor:"pointer",
                        whiteSpace:"nowrap",
                        userSelect:"none",
                        minWidth:col.w,
                        background: sortKey===col.key ? THEME.headerBgActive : THEME.headerBg,
                        borderBottom:`1px solid ${THEME.borderStrong}`,
                        position:"sticky",
                        top:0,
                        left:STICKY_LEFT_OFFSETS[col.key],
                        zIndex: STICKY_LEFT_OFFSETS[col.key] !== undefined ? 8 : 5,
                        borderRight: STICKY_LEFT_OFFSETS[col.key] !== undefined ? `1px solid ${THEME.borderStrong}` : undefined,
                        boxShadow:`inset 0 -1px 0 ${THEME.borderStrong}, ${THEME.headerShadow}`,
                      }}>
                        {col.label}{sortKey===col.key&&<span style={{marginLeft:3}}>{sortDir===-1?"↓":"↑"}</span>}
                      </th>
                    ))}
                    {/* Brand and Month columns removed */}
                    <th style={{ minWidth:190, padding:"10px 12px", color:THEME.headerText, fontFamily:"'DM Mono',monospace", fontSize:9.5, textTransform:"uppercase", position:"sticky", top:0, zIndex:5, background:THEME.headerBg, borderBottom:`1px solid ${THEME.borderStrong}`, boxShadow:`inset 0 -1px 0 ${THEME.borderStrong}, ${THEME.headerShadow}` }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {smartViewSortedRows.map((row, index) => {
                    const rowBackground = index % 2 === 0 ? THEME.surface : THEME.panelBg;
                    return (
                      <tr key={`${row.ASIN}-${row.Month}-${index}`} style={{ borderBottom:"1px solid #F1F5F9", background:rowBackground }}>
                        {COLS.map((col) => {
                          const v = col.master ? getMasterValue(row, col.key) : row[col.key];
                          const disp = fmtCell(row, col);
                          const isPct = col.fmt === "pct";
                          const accentColor = isPct ? pctColor(col.key, v) : col.key === "Title" ? THEME.text : THEME.textSoft;
                          const isEmpty = v === null || v === undefined || v === 0 || v === "";
                          return (
                            <td key={col.key} style={{
                              padding:"5px 10px",
                              textAlign: col.fmt==="str"||col.fmt==="title"?"left":"right",
                              fontFamily: col.key==="ASIN"||col.key==="fbaSku"||col.key==="model" ? "'DM Mono',monospace" : "inherit",
                              fontSize: col.key==="ASIN" ? 12 : col.key==="fbaSku" ? 10.8 : 11.5,
                              maxWidth: col.fmt==="title" ? 140 : undefined,
                              overflow:"hidden",
                              textOverflow:"ellipsis",
                              whiteSpace:"nowrap",
                              background: STICKY_LEFT_OFFSETS[col.key] !== undefined ? rowBackground : col.master ? (isEmpty ? THEME.surfaceMuted : "#F0F4FF") : "transparent",
                              color: isEmpty ? "#CBD5E1" : col.key==="ASIN" ? "#1D4ED8" : accentColor,
                              letterSpacing: col.key==="ASIN" ? 0.3 : 0,
                              fontWeight: col.key==="ASIN" ? 800 : col.key==="model" ? 600 : col.key==="TotalNetSalesValue" ? 700 : col.key==="dp" ? 600 : 400,
                              position: STICKY_LEFT_OFFSETS[col.key] !== undefined ? "sticky" : "static",
                              left: STICKY_LEFT_OFFSETS[col.key],
                              zIndex: STICKY_LEFT_OFFSETS[col.key] !== undefined ? 4 : 1,
                              borderRight: STICKY_LEFT_OFFSETS[col.key] !== undefined ? `1px solid ${THEME.border}` : undefined,
                              boxShadow: STICKY_LEFT_OFFSETS[col.key] === STICKY_LEFT_OFFSETS.category ? THEME.stickyShadow : undefined,
                            }}>
                              {col.key === "ASIN" && !isEmpty ? (
                                <a href={getAmazonProductUrl(row.ASIN)} target="_blank" rel="noreferrer" style={{ color:"#1D4ED8", fontWeight:800, textDecoration:"underline", textUnderlineOffset:"2px" }}>
                                  {disp}
                                </a>
                              ) : disp}
                            </td>
                          );
                        })}
                        {/* Brand and Month cells removed */}
                        <td style={{ padding:"5px 12px" }}>
                          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                            <a
                              href={getAmazonProductUrl(row.ASIN)}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding:"5px 8px", borderRadius:999, background:"#EFF6FF", border:"1px solid #BFDBFE", color:"#1D4ED8", fontSize:10, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}
                            >
                              Open Amazon
                            </a>
                            <button
                              onClick={() => openDetailPage(row.ASIN)}
                              style={{ padding:"5px 8px", borderRadius:999, background:THEME.surface, border:`1px solid ${THEME.border}`, color:THEME.textSoft, fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}
                            >
                              Detail View
                            </button>
                            <button
                              onClick={() => openComparePage(row.ASIN)}
                              style={{ padding:"5px 8px", borderRadius:999, background:"#2563EB", border:"none", color:"#FFFFFF", fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}
                            >
                              Compare
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {smartViewSortedRows.length === 0 && (
                    <tr>
                      <td colSpan={COLS.length + 1} style={{ padding:"28px 18px", textAlign:"center", color:THEME.textMuted, background:THEME.surface }}>
                        No rows match this smart view with the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compareTabMeta) {
    const ctMonths = ["Jan","Feb","Mar"];
    const activectAsin = ctAsin || compareTabMeta.ASIN;

    // All ASINs available
    const ctAllAsins = [...new Set(enriched.map(r => r.ASIN))].map(asin => {
      const row = enriched.find(r => r.ASIN === asin);
      return { asin, title: row?.Title || asin, brand: row?.Brand || "" };
    });

    const ctRows = enriched.filter(r => r.ASIN === activectAsin);
    const ctR1 = ctRows.find(r => r.Month === ctM1);
    const ctR2 = ctRows.find(r => r.Month === ctM2);
    const ctMeta = ctRows[0] || compareTabMeta;

    const pct = (a, b) => a > 0 ? (((b - a) / a) * 100).toFixed(1) : b > 0 ? "100.0" : "0.0";
    const growthColor = (a, b) => Number(pct(a,b)) >= 0 ? "#059669" : "#DC2626";
    const compareInsights = (() => {
      const metrics = [
        { key: "sales", label: "net sales", prev: ctR1?.TotalNetSalesValue ?? 0, curr: ctR2?.TotalNetSalesValue ?? 0, better: "up" },
        { key: "units", label: "net units", prev: ctR1?.NetUnits ?? 0, curr: ctR2?.NetUnits ?? 0, better: "up" },
        { key: "sessions", label: "sessions", prev: ctR1?.Sessions ?? 0, curr: ctR2?.Sessions ?? 0, better: "up" },
        { key: "buybox", label: "buybox", prev: ctR1?.BuyboxPct ?? 0, curr: ctR2?.BuyboxPct ?? 0, better: "up", format: "pct" },
        { key: "adsSales", label: "ads sales", prev: ctR1?.TotalAdsSales ?? 0, curr: ctR2?.TotalAdsSales ?? 0, better: "up" },
        { key: "adsSpend", label: "ads spend", prev: ctR1?.TotalAdsSpend ?? 0, curr: ctR2?.TotalAdsSpend ?? 0, better: "down" },
        { key: "organicUnits", label: "organic units", prev: ctR1?.OrganiSales ?? 0, curr: ctR2?.OrganiSales ?? 0, better: "up" },
        { key: "acos", label: "ACOS", prev: ctR1?.ACOS ?? 0, curr: ctR2?.ACOS ?? 0, better: "down", format: "pct" },
        { key: "tacos", label: "TACOS", prev: ctR1?.TACOS ?? 0, curr: ctR2?.TACOS ?? 0, better: "down", format: "pct" },
      ].map((metric) => {
        const delta = metric.curr - metric.prev;
        const pctChange = metric.prev > 0 ? (delta / metric.prev) * 100 : metric.curr > 0 ? 100 : 0;
        const improved = metric.better === "down" ? delta <= 0 : delta >= 0;
        return { ...metric, delta, pctChange, improved, magnitude: Math.abs(pctChange) };
      });

      const strongestPositive = [...metrics]
        .filter((metric) => metric.improved && metric.magnitude > 0)
        .sort((a, b) => b.magnitude - a.magnitude)[0];
      const strongestNegative = [...metrics]
        .filter((metric) => !metric.improved && metric.magnitude > 0)
        .sort((a, b) => b.magnitude - a.magnitude)[0];

      const formatMetricValue = (metric, value) => {
        if (metric.format === "pct") return `${(value * 100).toFixed(1)}%`;
        if (metric.key === "sales" || metric.key === "adsSales" || metric.key === "adsSpend") return inr(value);
        return value.toLocaleString("en-IN");
      };

      const highlights = [];
      if (strongestPositive) {
        highlights.push(`${strongestPositive.label} improved from ${formatMetricValue(strongestPositive, strongestPositive.prev)} to ${formatMetricValue(strongestPositive, strongestPositive.curr)} (${strongestPositive.pctChange >= 0 ? "+" : ""}${strongestPositive.pctChange.toFixed(1)}%).`);
      }
      if (strongestNegative) {
        highlights.push(`${strongestNegative.label} weakened from ${formatMetricValue(strongestNegative, strongestNegative.prev)} to ${formatMetricValue(strongestNegative, strongestNegative.curr)} (${strongestNegative.pctChange >= 0 ? "+" : ""}${strongestNegative.pctChange.toFixed(1)}%).`);
      }

      const overallSales = metrics.find((metric) => metric.key === "sales");
      const overallOrganic = metrics.find((metric) => metric.key === "organicUnits");
      const overallBuybox = metrics.find((metric) => metric.key === "buybox");

      const summaryParts = [];
      if (overallSales) {
        summaryParts.push(`Net sales ${overallSales.delta >= 0 ? "rose" : "fell"} ${Math.abs(overallSales.pctChange).toFixed(1)}% from ${ctM1} to ${ctM2}.`);
      }
      if (overallOrganic && overallOrganic.magnitude > 0) {
        summaryParts.push(`Organic units ${overallOrganic.delta >= 0 ? "moved up" : "dropped"} ${Math.abs(overallOrganic.pctChange).toFixed(1)}%.`);
      }
      if (overallBuybox && overallBuybox.magnitude > 0) {
        summaryParts.push(`Buybox ${overallBuybox.delta >= 0 ? "improved" : "slipped"} to ${(overallBuybox.curr * 100).toFixed(1)}%.`);
      }

      const improvedText = strongestPositive
        ? `${strongestPositive.label} improved from ${formatMetricValue(strongestPositive, strongestPositive.prev)} to ${formatMetricValue(strongestPositive, strongestPositive.curr)} (${strongestPositive.pctChange >= 0 ? "+" : ""}${strongestPositive.pctChange.toFixed(1)}%).`
        : "No major positive movement stood out in this comparison.";

      const worsenedText = strongestNegative
        ? `${strongestNegative.label} weakened from ${formatMetricValue(strongestNegative, strongestNegative.prev)} to ${formatMetricValue(strongestNegative, strongestNegative.curr)} (${strongestNegative.pctChange >= 0 ? "+" : ""}${strongestNegative.pctChange.toFixed(1)}%).`
        : "No major deterioration stood out in this comparison.";

      let actionText = "Keep monitoring this ASIN before making a pricing or ads change.";
      if ((metrics.find((metric) => metric.key === "organicUnits")?.delta ?? 0) < 0 && (metrics.find((metric) => metric.key === "adsSales")?.delta ?? 0) > 0) {
        actionText = "Organic contribution is weakening while paid sales are rising, so review listing quality and buybox protection before increasing ad budgets further.";
      } else if ((metrics.find((metric) => metric.key === "buybox")?.delta ?? 0) < 0) {
        actionText = "Buybox slipped in the selected comparison, so check pricing, stock health, and seller competition first.";
      } else if ((metrics.find((metric) => metric.key === "adsSpend")?.delta ?? 0) > 0 && (metrics.find((metric) => metric.key === "sales")?.delta ?? 0) < 0) {
        actionText = "Ads spend is rising while net sales are under pressure, so tighten campaign targeting and review wasted spend.";
      } else if ((metrics.find((metric) => metric.key === "sales")?.delta ?? 0) > 0) {
        actionText = "Sales improved in the selected months, so preserve the current setup and look for similar ASINs to scale.";
      }

      return {
        title: `${ctM1} to ${ctM2} summary`,
        summary: summaryParts.join(" "),
        highlights,
        improvedText,
        worsenedText,
        actionText,
      };
    })();

    // Export filtered comparison CSV
    const exportCtCsv = () => {
      const rows = ctRows.filter(r => r.Month === ctM1 || r.Month === ctM2).map(r => ({
        Month: r.Month, ASIN: r.ASIN, Brand: r.Brand, Title: r.Title,
        Model: getMasterValue(r,"model"), Sessions: r.Sessions, NetUnits: r.NetUnits,
        NetSales: r.TotalNetSalesValue, AdsSpend: r.TotalAdsSpend, AdsSales: r.TotalAdsSales,
        Clicks: r.Clicks, AmsOrders: r.AmsOrders, BuyboxPct: r.BuyboxPct,
        ACOS: r.ACOS, TACOS: r.TACOS, Impressions: r.Impressions, CAC: r.CAC,
      }));
      exportRowsToCsv(`comparison-${activectAsin}-${ctM1}-vs-${ctM2}.csv`, rows,
        ["Month","ASIN","Brand","Title","Model","Sessions","NetUnits","NetSales","AdsSpend","AdsSales","Clicks","AmsOrders","BuyboxPct","ACOS","TACOS","Impressions","CAC"]);
    };

    const TABS = ["Overview","Sales","Ads","Traffic","Efficiency","Monthly Split","Top 10","ASIN Compare"];
    const TAB_ICONS = {"Overview":"📊","Sales":"💰","Ads":"📢","Traffic":"🚦","Efficiency":"⚡","Monthly Split":"📅","Top 10":"🏆","ASIN Compare":"🔍"};

    const MetricCard = ({label, v1, v2, fmt="num", pctKeys=[]}) => {
      const val1 = v1 ?? 0, val2 = v2 ?? 0;
      const g = pct(val1, val2);
      const isPos = Number(g) >= 0;
      const fmt1 = fmt==="cur" ? inr(val1) : fmt==="pct" ? `${(val1*100).toFixed(1)}%` : val1.toLocaleString("en-IN");
      const fmt2 = fmt==="cur" ? inr(val2) : fmt==="pct" ? `${(val2*100).toFixed(1)}%` : val2.toLocaleString("en-IN");
      return (
        <div style={{padding:"14px",borderRadius:14,
          background: isPos ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)",
          border:`1px solid ${isPos?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"}`,
          borderLeft:`4px solid ${isPos?"#10B981":"#EF4444"}`}}>
          <div style={{fontSize:10,color:THEME.textMuted,marginBottom:4,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:0.8}}>{label}</div>
          <div style={{fontSize:20,fontWeight:800,color:isPos?"#059669":"#DC2626"}}>{isPos?"+":""}{g}%</div>
          <div style={{fontSize:11,color:THEME.textMuted,marginTop:4}}>
            <span style={{color:THEME.text,fontWeight:600}}>{ctM1}:</span> {fmt1} &nbsp;→&nbsp; <span style={{color:THEME.text,fontWeight:600}}>{ctM2}:</span> {fmt2}
          </div>
        </div>
      );
    };

    const renderTab = () => {
      if (ctTab === "Overview") return (
        <div style={{display:"grid",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
            <MetricCard label="Net Sales" v1={ctR1?.TotalNetSalesValue} v2={ctR2?.TotalNetSalesValue} fmt="cur"/>
            <MetricCard label="Net Units" v1={ctR1?.NetUnits} v2={ctR2?.NetUnits}/>
            <MetricCard label="Sessions" v1={ctR1?.Sessions} v2={ctR2?.Sessions}/>
            <MetricCard label="Buybox %" v1={ctR1?.BuyboxPct} v2={ctR2?.BuyboxPct} fmt="pct"/>
            <MetricCard label="AMS Orders" v1={ctR1?.AmsOrders} v2={ctR2?.AmsOrders}/>
            <MetricCard label="Ad Sales" v1={ctR1?.TotalAdsSales} v2={ctR2?.TotalAdsSales} fmt="cur"/>
            <MetricCard label="Ad Spend" v1={ctR1?.TotalAdsSpend} v2={ctR2?.TotalAdsSpend} fmt="cur"/>
            <MetricCard label="ACOS" v1={ctR1?.ACOS} v2={ctR2?.ACOS} fmt="pct"/>
            <MetricCard label="TACOS" v1={ctR1?.TACOS} v2={ctR2?.TACOS} fmt="pct"/>
            <MetricCard label="Impressions" v1={ctR1?.Impressions} v2={ctR2?.Impressions}/>
            <MetricCard label="Clicks" v1={ctR1?.Clicks} v2={ctR2?.Clicks}/>
            <MetricCard label="CAC" v1={ctR1?.CAC} v2={ctR2?.CAC} fmt="cur"/>
            <MetricCard label="CVR %" v1={ctR1?.ConversionPct} v2={ctR2?.ConversionPct} fmt="pct"/>
            <MetricCard label="Organic %" v1={ctR1?.OrganicPct} v2={ctR2?.OrganicPct} fmt="pct"/>
            <MetricCard label="Organic Units" v1={ctR1?.OrganiSales} v2={ctR2?.OrganiSales}/>
          </div>
          {/* Monthly split summary below */}
          <div style={{background:THEME.surface,border:`1px solid ${THEME.border}`,borderRadius:14,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:`2fr repeat(${["Jan","Feb","Mar"].length},1fr)`,background:THEME.surfaceMuted,padding:"10px 16px",borderBottom:`1px solid ${THEME.border}`}}>
              <div style={{fontSize:10,color:THEME.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:0.8,fontWeight:700}}>METRIC</div>
              {["Jan","Feb","Mar"].map(m=><div key={m} style={{fontSize:10,color: m===ctM1||m===ctM2?"#2563EB":THEME.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:0.8,textAlign:"right",fontWeight: m===ctM1||m===ctM2?700:400}}>{m} 2026{m===ctM1?" ←":m===ctM2?" →":""}</div>)}
            </div>
            {[
              {label:"Net Sales",key:"TotalNetSalesValue",fmt:"cur"},
              {label:"Net Units",key:"NetUnits",fmt:"num"},
              {label:"Sessions",key:"Sessions",fmt:"num"},
              {label:"Ad Spend",key:"TotalAdsSpend",fmt:"cur"},
              {label:"ACOS",key:"ACOS",fmt:"pct"},
            ].map((metric,i)=>{
              const allMonths = [...new Set(enriched.filter(r=>r.ASIN===activectAsin).map(r=>r.Month))].sort((a,b)=>["Jan","Feb","Mar"].indexOf(a)-["Jan","Feb","Mar"].indexOf(b));
              const rows2 = enriched.filter(r=>r.ASIN===activectAsin);
              const vals = allMonths.map(m=>rows2.find(r=>r.Month===m)?.[metric.key]??null);
              const fmtV = (v) => v===null?"—":metric.fmt==="cur"?inr(v):metric.fmt==="pct"?`${(v*100).toFixed(1)}%`:v.toLocaleString("en-IN");
              return (
                <div key={metric.key} style={{display:"grid",gridTemplateColumns:`2fr repeat(${allMonths.length},1fr)`,padding:"9px 16px",background:i%2===0?THEME.surface:THEME.panelBg,borderBottom:`1px solid ${THEME.surfaceSoft}`,alignItems:"center"}}>
                  <div style={{fontSize:12,color:THEME.textSoft,fontWeight:600}}>{metric.label}</div>
                  {vals.map((v,vi)=>(
                    <div key={vi} style={{fontSize:12,fontWeight: allMonths[vi]===ctM1||allMonths[vi]===ctM2?700:500, color:v===null?"#CBD5E1":allMonths[vi]===ctM1||allMonths[vi]===ctM2?THEME.text:THEME.textFaint,textAlign:"right"}}>{fmtV(v)}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      );
      if (ctTab === "Sales") return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          <MetricCard label="Net Sales" v1={ctR1?.TotalNetSalesValue} v2={ctR2?.TotalNetSalesValue} fmt="cur"/>
          <MetricCard label="Net Units" v1={ctR1?.NetUnits} v2={ctR2?.NetUnits}/>
          <MetricCard label="AMS Orders" v1={ctR1?.AmsOrders} v2={ctR2?.AmsOrders}/>
          <MetricCard label="Ad Sales" v1={ctR1?.TotalAdsSales} v2={ctR2?.TotalAdsSales} fmt="cur"/>
          <MetricCard label="Organic Units" v1={ctR1?.OrganiSales} v2={ctR2?.OrganiSales}/>
          <MetricCard label="Organic %" v1={ctR1?.OrganicPct} v2={ctR2?.OrganicPct} fmt="pct"/>
        </div>
      );
      if (ctTab === "Ads") return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          <MetricCard label="Ad Spend" v1={ctR1?.TotalAdsSpend} v2={ctR2?.TotalAdsSpend} fmt="cur"/>
          <MetricCard label="Ad Sales" v1={ctR1?.TotalAdsSales} v2={ctR2?.TotalAdsSales} fmt="cur"/>
          <MetricCard label="ACOS" v1={ctR1?.ACOS} v2={ctR2?.ACOS} fmt="pct"/>
          <MetricCard label="TACOS" v1={ctR1?.TACOS} v2={ctR2?.TACOS} fmt="pct"/>
          <MetricCard label="Impressions" v1={ctR1?.Impressions} v2={ctR2?.Impressions}/>
          <MetricCard label="Clicks" v1={ctR1?.Clicks} v2={ctR2?.Clicks}/>
          <MetricCard label="AMS Orders" v1={ctR1?.AmsOrders} v2={ctR2?.AmsOrders}/>
          <MetricCard label="CAC" v1={ctR1?.CAC} v2={ctR2?.CAC} fmt="cur"/>
        </div>
      );
      if (ctTab === "Traffic") return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          <MetricCard label="Sessions" v1={ctR1?.Sessions} v2={ctR2?.Sessions}/>
          <MetricCard label="Clicks" v1={ctR1?.Clicks} v2={ctR2?.Clicks}/>
          <MetricCard label="Impressions" v1={ctR1?.Impressions} v2={ctR2?.Impressions}/>
          <MetricCard label="CVR %" v1={ctR1?.ConversionPct} v2={ctR2?.ConversionPct} fmt="pct"/>
          <MetricCard label="Buybox %" v1={ctR1?.BuyboxPct} v2={ctR2?.BuyboxPct} fmt="pct"/>
        </div>
      );
      if (ctTab === "Efficiency") return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          <MetricCard label="ACOS" v1={ctR1?.ACOS} v2={ctR2?.ACOS} fmt="pct"/>
          <MetricCard label="TACOS" v1={ctR1?.TACOS} v2={ctR2?.TACOS} fmt="pct"/>
          <MetricCard label="CAC" v1={ctR1?.CAC} v2={ctR2?.CAC} fmt="cur"/>
          <MetricCard label="CVR %" v1={ctR1?.ConversionPct} v2={ctR2?.ConversionPct} fmt="pct"/>
          <MetricCard label="Organic %" v1={ctR1?.OrganicPct} v2={ctR2?.OrganicPct} fmt="pct"/>
          <MetricCard label="Buybox %" v1={ctR1?.BuyboxPct} v2={ctR2?.BuyboxPct} fmt="pct"/>
        </div>
      );
      if (ctTab === "Monthly Split") {
        const allMonthRows = ctRows.sort((a,b) => ["Jan","Feb","Mar"].indexOf(a.Month) - ["Jan","Feb","Mar"].indexOf(b.Month));
        return (
          <div style={{display:"grid",gap:12}}>
            {allMonthRows.map(row => (
              <div key={row.Month} style={{background:THEME.surface,border:`1px solid ${THEME.border}`,borderRadius:16,padding:"16px"}}>
                <div style={{fontWeight:800,fontSize:15,color:THEME.text,marginBottom:12}}>{row.Month} 2026</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,fontSize:12}}>
                  {[
                    ["Net Sales", inr(row.TotalNetSalesValue||0)],
                    ["Net Units", (row.NetUnits||0).toLocaleString("en-IN")],
                    ["Sessions", (row.Sessions||0).toLocaleString("en-IN")],
                    ["Ad Spend", inr(row.TotalAdsSpend||0)],
                    ["Ad Sales", inr(row.TotalAdsSales||0)],
                    ["ACOS", `${((row.ACOS||0)*100).toFixed(1)}%`],
                    ["TACOS", `${((row.TACOS||0)*100).toFixed(1)}%`],
                    ["Buybox", `${((row.BuyboxPct||0)*100).toFixed(1)}%`],
                    ["Clicks", (row.Clicks||0).toLocaleString("en-IN")],
                    ["AMS Orders", (row.AmsOrders||0).toLocaleString("en-IN")],
                  ].map(([label, val]) => (
                    <div key={label} style={{padding:"10px",background:THEME.panelBg,borderRadius:12}}>
                      <div style={{fontSize:10,color:THEME.textMuted,marginBottom:4,fontFamily:"'DM Mono',monospace"}}>{label}</div>
                      <div style={{fontWeight:700,color:THEME.text}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }
      if (ctTab === "Top 10") {
        const monthSequence = ["Jan", "Feb", "Mar"];
        const top10BrandOptions = ["", ...new Set(enriched.map((row) => row.Brand).filter(Boolean))];
        const top10SourceRows = enriched.filter((row) => !ctTop10Brand || row.Brand === ctTop10Brand);
        const top10Data = (() => {
          if (ctTop10View === "ASIN") {
            const asinMap = {};
            top10SourceRows.forEach((r) => {
              if (!asinMap[r.ASIN]) asinMap[r.ASIN] = { asin: r.ASIN, title: r.Title, brand: r.Brand, model: getMasterValue(r,"model"), months: {} };
              asinMap[r.ASIN].months[r.Month] = r;
            });
            return Object.values(asinMap)
              .filter((x) => x.months[ctM1] || x.months[ctM2])
              .sort((a,b) => (((b.months[ctM2]?.TotalNetSalesValue||0) + (b.months[ctM1]?.TotalNetSalesValue||0)) - ((a.months[ctM2]?.TotalNetSalesValue||0) + (a.months[ctM1]?.TotalNetSalesValue||0))))
              .slice(0, 10);
          }
          // Group by model
          const modelMap = {};
          top10SourceRows.forEach(r => {
            const model = getMasterValue(r,"model") || "Unmapped";
            if (!modelMap[model]) modelMap[model] = { key: model, brand: r.Brand, title: r.Title, asin: r.ASIN, months: {} };
            if (!modelMap[model].months[r.Month]) modelMap[model].months[r.Month] = { TotalNetSalesValue: 0, NetUnits: 0 };
            modelMap[model].months[r.Month].TotalNetSalesValue += r.TotalNetSalesValue || 0;
            modelMap[model].months[r.Month].NetUnits += r.NetUnits || 0;
          });
          return Object.values(modelMap)
            .sort((a,b)=>(((b.months[ctM2]?.TotalNetSalesValue||0) + (b.months[ctM1]?.TotalNetSalesValue||0)) - ((a.months[ctM2]?.TotalNetSalesValue||0) + (a.months[ctM1]?.TotalNetSalesValue||0))))
            .slice(0,10)
            .map(m => ({ asin: m.asin, title: m.title, brand: m.brand, model: m.key, months: m.months }));
        })();
        const showAllMonths = ctTop10MonthMode === "all";
        const visibleMonths = showAllMonths ? monthSequence : [ctM1, ctM2];
        const gridTemplateColumns = `2fr 1fr repeat(${visibleMonths.length},1fr) 1fr repeat(${visibleMonths.length},1fr)`;
        return (
          <div style={{display:"grid",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,color:"#64748B"}}>Top 10 by Net Sales — {showAllMonths ? "Jan, Feb, Mar" : `${ctM1} vs ${ctM2}`}</div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{ display:"flex", gap:6, alignItems:"center", padding:"6px 10px", borderRadius:999, background:THEME.surface, border:`1px solid ${THEME.border}` }}>
                  <span style={{ fontSize:10, color:THEME.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:0.8, textTransform:"uppercase", fontWeight:600 }}>Brand</span>
                  <select
                    value={ctTop10Brand}
                    onChange={(e)=>setCtTop10Brand(e.target.value)}
                    style={{ background:"transparent", border:"none", color:THEME.text, fontSize:12, outline:"none", cursor:"pointer", fontWeight:600 }}
                  >
                    {top10BrandOptions.map((brandOption) => (
                      <option key={brandOption || "all"} value={brandOption}>
                        {brandOption || "All Brands"}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center", padding:"6px 10px", borderRadius:999, background:THEME.surface, border:`1px solid ${THEME.border}` }}>
                  <span style={{ fontSize:10, color:THEME.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:0.8, textTransform:"uppercase", fontWeight:600 }}>Months</span>
                  <select
                    value={ctTop10MonthMode}
                    onChange={(e)=>setCtTop10MonthMode(e.target.value)}
                    style={{ background:"transparent", border:"none", color:THEME.text, fontSize:12, outline:"none", cursor:"pointer", fontWeight:600 }}
                  >
                    <option value="selected">Selected Months</option>
                    <option value="all">All 3 Months</option>
                  </select>
                </div>
                {["ASIN","Model"].map(v=>(
                  <button key={v} onClick={()=>setCtTop10View(v)} style={{padding:"6px 14px",borderRadius:999,border:`1px solid ${ctTop10View===v?THEME.borderStrong:THEME.border}`,background:ctTop10View===v?THEME.headerBg:THEME.surface,color:THEME.text,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    Top 10 {v}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:gridTemplateColumns,gap:0,background:THEME.headerBg,borderRadius:"12px 12px 0 0",padding:"10px 14px",fontSize:10,color:THEME.headerText,fontFamily:"'DM Mono',monospace",letterSpacing:0.8}}>
              {[
                ctTop10View==="ASIN"?"ASIN":"MODEL",
                "BRAND",
                ...visibleMonths.map((monthLabel) => `${monthLabel} SALES`),
                "GROWTH",
                ...visibleMonths.map((monthLabel) => `${monthLabel} UNITS`),
              ].map(h=><div key={h}>{h}</div>)}
            </div>
            {top10Data.map((item, i) => {
              const s1 = item.months?.[ctM1]?.TotalNetSalesValue||0;
              const s2 = item.months?.[ctM2]?.TotalNetSalesValue||0;
              const g = pct(s1, s2);
              const amazonUrl = getAmazonProductUrl(item.asin);
              return (
                <div key={item.asin+i} style={{display:"grid",gridTemplateColumns:gridTemplateColumns,gap:0,padding:"12px 14px",background:i%2===0?THEME.surface:THEME.panelBg,border:`1px solid ${THEME.border}`,borderTop:"none",fontSize:12,alignItems:"center"}}>
                  <div>
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={`Open ${item.asin} on Amazon.in`}
                      style={{fontWeight:700,color:"#1D4ED8",textDecoration:"underline",textUnderlineOffset:"2px"}}
                    >
                      {ctTop10View==="ASIN"?item.asin:item.model}
                    </a>
                    <div style={{fontSize:10,color:"#64748B"}}>
                      <a
                        href={amazonUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`Open ${item.asin} on Amazon.in`}
                        style={{color:"inherit",textDecoration:"none"}}
                      >
                        {ctTop10View==="ASIN"?String(item.title).slice(0,40):item.asin}
                      </a>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:"#475569"}}>{item.brand}</div>
                  {visibleMonths.map((monthLabel) => (
                    <div key={`${item.asin}-${monthLabel}-sales`} style={{fontWeight:600}}>
                      {inr(item.months?.[monthLabel]?.TotalNetSalesValue || 0)}
                    </div>
                  ))}
                  <div style={{fontWeight:700,color:Number(g)>=0?"#059669":"#DC2626"}}>{Number(g)>=0?"+":""}{g}%</div>
                  {visibleMonths.map((monthLabel) => (
                    <div key={`${item.asin}-${monthLabel}-units`}>
                      {(item.months?.[monthLabel]?.NetUnits || 0).toLocaleString("en-IN")}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      }
      if (ctTab === "ASIN Compare") {
        const filteredAsins = ctAllAsins.filter(a =>
          !ctSearch || a.asin.toLowerCase().includes(ctSearch.toLowerCase()) ||
          a.title.toLowerCase().includes(ctSearch.toLowerCase()) ||
          a.brand.toLowerCase().includes(ctSearch.toLowerCase())
        ).slice(0, 50);
        const allMonthsList = ["Jan","Feb","Mar"];
        const selectedRows = enriched.filter(r => r.ASIN === activectAsin);
        const metrics = [
          { label:"Net Sales", key:"TotalNetSalesValue", fmt:"cur" },
          { label:"Net Units", key:"NetUnits", fmt:"num" },
          { label:"Sessions", key:"Sessions", fmt:"num" },
          { label:"Buybox %", key:"BuyboxPct", fmt:"pct" },
          { label:"Ad Sales", key:"TotalAdsSales", fmt:"cur" },
          { label:"Ad Spend", key:"TotalAdsSpend", fmt:"cur" },
          { label:"ACOS", key:"ACOS", fmt:"pct" },
          { label:"TACOS", key:"TACOS", fmt:"pct" },
          { label:"Clicks", key:"Clicks", fmt:"num" },
          { label:"AMS Orders", key:"AmsOrders", fmt:"num" },
          { label:"Impressions", key:"Impressions", fmt:"num" },
          { label:"CAC", key:"CAC", fmt:"cur" },
          { label:"CVR %", key:"ConversionPct", fmt:"pct" },
          { label:"Organic %", key:"OrganicPct", fmt:"pct" },
          { label:"Organic Units", key:"OrganiSales", fmt:"num" },
        ];
        const fmtVal = (val, fmt) => fmt==="cur" ? inr(val||0) : fmt==="pct" ? `${((val||0)*100).toFixed(1)}%` : (val||0).toLocaleString("en-IN");
        return (
          <div style={{display:"grid",gap:16}}>
            {/* Search */}
            <div style={{position:"relative",maxWidth:480}}>
              <input
                value={ctSearch} onChange={e=>setCtSearch(e.target.value)}
                placeholder="Search ASIN, product name, brand..."
                style={{width:"100%",padding:"10px 14px 10px 36px",border:`1px solid ${THEME.border}`,borderRadius:12,fontSize:12,outline:"none",background:THEME.panelBg,color:THEME.text}}
              />
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:THEME.textFaint,fontSize:14}}>⌕</span>
            </div>
            {/* ASIN list */}
            {ctSearch && (
              <div style={{background:THEME.surface,border:`1px solid ${THEME.border}`,borderRadius:12,overflow:"hidden",maxHeight:200,overflowY:"auto"}}>
                {filteredAsins.map(a=>(
                  <div key={a.asin} onClick={()=>{ setCtAsin(a.asin); setCtSearch(""); }}
                    style={{padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${THEME.surfaceSoft}`,background:activectAsin===a.asin?"#EFF6FF":THEME.surface,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,color:"#1D4ED8",fontSize:12}}>{a.asin}</div>
                      <div style={{fontSize:11,color:"#64748B"}}>{String(a.title).slice(0,60)}</div>
                    </div>
                    <span style={{fontSize:11,color:THEME.textFaint,marginLeft:8}}>{a.brand}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Selected ASIN info */}
            {activectAsin && (
              <div style={{background:THEME.headerBg,border:`1px solid ${THEME.borderStrong}`,borderRadius:12,padding:"12px 16px",display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{color:THEME.text,fontWeight:700,fontSize:13}}>{activectAsin}</span>
                <span style={{color:THEME.textSoft,fontSize:12}}>{String(ctMeta?.Title||"").slice(0,60)}</span>
                <span style={{color:THEME.textMuted,fontSize:11,marginLeft:"auto"}}>{ctMeta?.Brand}</span>
              </div>
            )}
            {/* All months side by side table */}
            {activectAsin && (
              <div style={{background:THEME.surface,border:`1px solid ${THEME.border}`,borderRadius:16,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:`2fr repeat(${allMonthsList.length},1fr)`,background:THEME.surfaceMuted,padding:"10px 16px",gap:0,borderBottom:`1px solid ${THEME.border}`}}>
                  <div style={{fontSize:10,color:THEME.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:0.8,fontWeight:700}}>METRIC</div>
                  {allMonthsList.map(m=>(
                    <div key={m} style={{fontSize:10,color:THEME.textSoft,fontFamily:"'DM Mono',monospace",letterSpacing:0.8,textAlign:"right",fontWeight:700}}>{m} 2026</div>
                  ))}
                </div>
                {metrics.map((metric,i) => {
                  const vals = allMonthsList.map(m => selectedRows.find(r=>r.Month===m)?.[metric.key] ?? null);
                  return (
                    <div key={metric.key} style={{display:"grid",gridTemplateColumns:`2fr repeat(${allMonthsList.length},1fr)`,padding:"10px 16px",background:i%2===0?THEME.surface:THEME.panelBg,borderBottom:`1px solid ${THEME.surfaceSoft}`,alignItems:"center"}}>
                      <div style={{fontSize:12,color:THEME.textSoft,fontWeight:600}}>{metric.label}</div>
                      {vals.map((val,vi) => (
                        <div key={vi} style={{fontSize:12,fontWeight:700,color:val===null?"#CBD5E1":THEME.text,textAlign:"right"}}>
                          {val===null ? "—" : fmtVal(val, metric.fmt)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
    };

    return (
      <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", background:THEME.pageBg, minHeight:"100vh", color:THEME.text }}>
        {/* Header */}
        <div style={{ background:THEME.surface, borderBottom:`1px solid ${THEME.border}`, padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <button onClick={closeDetailPage} style={{ background:THEME.surfaceMuted, color:THEME.textSoft, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
              ← Back
            </button>
            <div>
              <div style={{ fontSize:16, fontWeight:800, letterSpacing:-0.3, color:THEME.text }}>Month Comparison</div>
              <div style={{ fontSize:10, color:THEME.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:0.8 }}>{ctMeta?.Brand || ""} · {getMasterValue(ctMeta,"model")||activectAsin}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            {/* Month filter */}
            <div style={{ display:"flex", gap:4, alignItems:"center", background:THEME.panelBg, padding:"7px 12px", borderRadius:8, border:`1px solid ${THEME.border}` }}>
              <select value={ctM1} onChange={e=>setCtM1(e.target.value)} style={{ background:"transparent", border:"none", color:THEME.text, fontSize:12, outline:"none", cursor:"pointer", fontWeight:600 }}>
                {ctMonths.map(m=><option key={m} value={m} style={{color:THEME.text,background:THEME.surface}}>{m} 2026</option>)}
              </select>
              <span style={{ color:THEME.textFaint, fontSize:10, fontFamily:"'DM Mono',monospace" }}>VS</span>
              <select value={ctM2} onChange={e=>setCtM2(e.target.value)} style={{ background:"transparent", border:"none", color:THEME.text, fontSize:12, outline:"none", cursor:"pointer", fontWeight:600 }}>
                {ctMonths.map(m=><option key={m} value={m} style={{color:THEME.text,background:THEME.surface}}>{m} 2026</option>)}
              </select>
            </div>
            <button onClick={exportCtCsv} style={{ background:THEME.panelBg, color:THEME.textSoft, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:600, cursor:"pointer" }}>
              Export CSV ↓
            </button>
          </div>
        </div>

        {/* Tabs with icons */}
        <div style={{ background:THEME.surface, borderBottom:`2px solid ${THEME.border}`, padding:"0 24px", display:"flex", gap:2, overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setCtTab(t)} style={{ background:"none", border:"none", color: ctTab===t ? THEME.text : THEME.textFaint, fontSize:11, fontWeight: ctTab===t ? 700 : 400, padding:"11px 14px", cursor:"pointer", borderBottom: ctTab===t ? "2px solid #2563EB" : "2px solid transparent", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5, transition:"all 0.1s" }}>
              <span style={{fontSize:13}}>{TAB_ICONS[t]}</span> {t}
            </button>
          ))}
        </div>

        {/* ASIN info bar - truncated title */}
        <div style={{ background:THEME.surface, borderBottom:`1px solid ${THEME.border}`, padding:"10px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:13, fontWeight:700, color:THEME.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"60%", cursor:"default" }}
            title={ctMeta?.Title||""}>
            {ctMeta?.Title||""}
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            {[ctMeta?.ASIN, ctMeta?.Brand, getMasterValue(ctMeta,"model")||"—", ctMeta?.mainCat||"—"].filter(Boolean).map((v,i) => (
              <span key={i} style={{ padding:"3px 8px", borderRadius:6, background:THEME.surfaceMuted, color:THEME.textSoft, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{v}</span>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ padding:"24px" }}>
          {ctTab === "Overview" && (
            <div style={{ marginBottom:16, background:THEME.surface, border:`1px solid ${THEME.border}`, borderRadius:16, padding:"16px 18px", boxShadow:"0 10px 24px rgba(15,23,42,0.04)" }}>
              <div style={{ fontSize:10, color:THEME.textMuted, fontFamily:"'DM Mono',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Summary Insight</div>
              <div style={{ fontSize:18, fontWeight:800, color:THEME.text, marginBottom:8 }}>{compareInsights.title}</div>
              <div style={{ fontSize:13, color:THEME.textSoft, lineHeight:1.6, marginBottom:10 }}>{compareInsights.summary}</div>
              <div style={{ display:"grid", gap:8 }}>
                {[
                  { title: "What Improved", body: compareInsights.improvedText, tone: "#059669" },
                  { title: "What Worsened", body: compareInsights.worsenedText, tone: "#DC2626" },
                  { title: "What To Do Next", body: compareInsights.actionText, tone: "#2563EB" },
                ].map((item) => (
                  <div key={item.title} style={{ background:THEME.panelBg, borderRadius:10, padding:"10px 12px", border:`1px solid ${THEME.surfaceSoft}` }}>
                    <div style={{ fontSize:10, color:item.tone, fontFamily:"'DM Mono',monospace", letterSpacing:0.9, textTransform:"uppercase", marginBottom:4 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:THEME.textSoft, lineHeight:1.55 }}>{item.body}</div>
                  </div>
                ))}
                {compareInsights.highlights.length > 0 && (
                  <div style={{ fontSize:11, color:THEME.textMuted, marginTop:2 }}>
                    Key highlight: {compareInsights.highlights[0]}
                  </div>
                )}
              </div>
            </div>
          )}
          {renderTab()}
        </div>
      </div>
    );
  }

  if (detailMeta) {
    return (
      <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: `linear-gradient(180deg, ${THEME.pageBg} 0%, ${THEME.shellBg} 52%, ${THEME.panelBg} 100%)`, minHeight: "100vh", color: THEME.text }}>
        <div style={{ background:`linear-gradient(90deg, ${THEME.headerBg} 0%, ${THEME.surfaceSoft} 100%)`, color:THEME.text, padding:"16px 24px", borderBottom:`1px solid ${THEME.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:24, fontWeight:800, letterSpacing:-0.7 }}>{getMasterValue(detailMeta, "model") || detailMeta.ASIN} Drilldown</div>
              <div style={{ fontSize:11, color:THEME.textMuted, marginTop:4, fontFamily:"'DM Mono', monospace", letterSpacing:1.1 }}>ASIN DETAIL · SMART PRODUCT VIEW</div>
            </div>
            <div style={{ fontSize:11, fontFamily:"'DM Mono', monospace", color:THEME.textMuted }}>{detailMeta.Brand} · {compareM1} vs {compareM2}</div>
          </div>
        </div>
        <div style={{ padding:"10px 24px", background:THEME.surfaceMuted, borderBottom:`1px solid ${THEME.border}`, display:"flex", gap:12, flexWrap:"wrap" }}>
          {["Overview", "Sales Trend", "Ads", "Units", "Monthly Drill"].map((tabLabel, index) => (
            <div key={tabLabel} style={{ color:index === 0 ? THEME.text : THEME.textMuted, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999, background:index === 0 ? THEME.headerBg : "transparent", fontFamily:"'DM Mono', monospace", letterSpacing:0.7 }}>
              {tabLabel}
            </div>
          ))}
        </div>
        <div style={{ padding: "24px" }}>
        <Panel
          title={detailMeta.Title}
          subtitle={`${detailMeta.ASIN} • ${detailMeta.Brand} • ${detailMeta.mainCat || detailMeta.category || "Category not mapped"}`}
          right={
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
              <button onClick={exportDetailData} style={{ background:"#FFFFFF", color:"#1D4ED8", border:"1px solid #BFDBFE", borderRadius:999, padding:"10px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Export ASIN CSV
              </button>
              <button onClick={() => exportSvgNode(detailChartRef.current, `buybox-asin-${detailMeta.ASIN}-sales-chart.svg`)} style={{ background:"#FFFFFF", color:"#0F172A", border:"1px solid #D8E1EC", borderRadius:999, padding:"10px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Export Chart
              </button>
              <button onClick={printCurrentView} style={{ background:"#FFFFFF", color:"#0F172A", border:"1px solid #D8E1EC", borderRadius:999, padding:"10px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Save PDF
              </button>
              <button onClick={closeDetailPage} style={{ background:"#2563EB", color:"#FFFFFF", border:"none", borderRadius:999, padding:"10px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {window.opener ? "Close tab" : "← Back to dashboard"}
              </button>
            </div>
          }
        >
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5, minmax(0, 1fr))", gap:12, marginBottom:18 }}>
            <div style={{
              background: "linear-gradient(180deg, #FFFFFF, #F8FAFC)",
              border: "1px solid #D8E1EC",
              boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
              borderRadius: 16,
              padding: "16px 18px",
              minWidth: 152,
              flex: "0 0 auto",
              borderLeft: "3px solid #2563EB",
            }}>
              <div style={{ fontSize: 9.5, color: "#64748B", fontFamily: "'DM Mono',monospace", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>ASIN</div>
              <a
                href={getAmazonProductUrl(detailMeta.ASIN)}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 23, fontWeight: 700, color: "#2563EB", letterSpacing: -1, lineHeight: 1, textDecoration: "underline", textUnderlineOffset: "4px" }}
                title={`Open ${detailMeta.ASIN} on Amazon`}
              >
                {detailMeta.ASIN}
              </a>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 6 }}>Open Amazon product page</div>
            </div>
            <KpiCard label="FBA SKU" value={getMasterValue(detailMeta, "fbaSku") || "—"} accent="#0EA5E9" />
            <KpiCard label="Brand" value={detailMeta.Brand} accent="#0EA5E9" />
            <KpiCard label="Model" value={getMasterValue(detailMeta, "model") || "—"} accent="#8B5CF6" />
            <KpiCard label="Category" value={detailMeta.mainCat || getMasterValue(detailMeta, "category") || "—"} accent="#F59E0B" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:12, marginBottom:16 }}>
            {detailGrowth.map((metric) => (
              <div key={metric.key} style={{ padding:"14px", borderRadius:18, background:"#FFFFFF", border:"1px solid #D8E1EC", boxShadow:"0 10px 24px rgba(15,23,42,0.04)", borderLeft:`4px solid ${metric.growthPct >= 0 ? "#10B981" : "#EF4444"}` }}>
                <div style={{ fontSize:10, color:"#64748B", marginBottom:8, fontFamily:"'DM Mono', monospace", letterSpacing:0.8, textTransform:"uppercase" }}>{metric.label}</div>
                <div style={{ fontSize:22, fontWeight:800, color:metric.growthPct >= 0 ? "#059669" : "#DC2626" }}>
                  {metric.growthPct >= 0 ? "+" : ""}{metric.growthPct.toFixed(1)}%
                </div>
                <div style={{ fontSize:11, color:"#64748B", marginTop:6 }}>
                  {detailM1?.Month ?? compareM1} {metric.key === "buybox" ? `${(metric.jan * 100).toFixed(1)}%` : metric.key === "units" ? (metric.jan || 0).toLocaleString("en-IN") : inr(metric.jan || 0).replace(".0L", "L")}
                  {" → "}
                  {detailM2?.Month ?? compareM2} {metric.key === "buybox" ? `${(metric.feb * 100).toFixed(1)}%` : metric.key === "units" ? (metric.feb || 0).toLocaleString("en-IN") : inr(metric.feb || 0).replace(".0L", "L")}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:12, marginBottom:16 }}>
            {[
              {
                title: "Traffic Module",
                accent: "#5B8DEF",
                rows: [
                  `${detailM1?.Month ?? compareM1} Sessions: ${(detailM1?.Sessions ?? 0).toLocaleString("en-IN")}`,
                  `${detailM2?.Month ?? compareM2} Sessions: ${(detailM2?.Sessions ?? 0).toLocaleString("en-IN")}`,
                  `Total Clicks: ${((detailM1?.Clicks ?? 0) + (detailM2?.Clicks ?? 0)).toLocaleString("en-IN")}`,
                ],
              },
              {
                title: "Sales Module",
                accent: "#16A34A",
                rows: [
                  `${detailM1?.Month ?? compareM1} Sales: ${inr(detailM1?.TotalNetSalesValue ?? 0)}`,
                  `${detailM2?.Month ?? compareM2} Sales: ${inr(detailM2?.TotalNetSalesValue ?? 0)}`,
                  `Ads Sales: ${inr((detailM1?.TotalAdsSales ?? 0) + (detailM2?.TotalAdsSales ?? 0))}`,
                ],
              },
              {
                title: "Unit Module",
                accent: "#8B5CF6",
                rows: [
                  `${detailM1?.Month ?? compareM1} Units: ${(detailM1?.NetUnits ?? 0).toLocaleString("en-IN")}`,
                  `${detailM2?.Month ?? compareM2} Units: ${(detailM2?.NetUnits ?? 0).toLocaleString("en-IN")}`,
                  `AMS Orders: ${((detailM1?.AmsOrders ?? 0) + (detailM2?.AmsOrders ?? 0)).toLocaleString("en-IN")}`,
                ],
              },
              {
                title: "Efficiency Module",
                accent: "#F59E0B",
                rows: [
                  `ACOS: ${((((detailM1?.TotalAdsSpend ?? 0) + (detailM2?.TotalAdsSpend ?? 0)) / Math.max((detailM1?.TotalAdsSales ?? 0) + (detailM2?.TotalAdsSales ?? 0), 1)) * 100).toFixed(1)}%`,
                  `TACOS: ${((((detailM1?.TotalAdsSpend ?? 0) + (detailM2?.TotalAdsSpend ?? 0)) / Math.max((detailM1?.TotalNetSalesValue ?? 0) + (detailM2?.TotalNetSalesValue ?? 0), 1)) * 100).toFixed(1)}%`,
                  `CAC: ${inr((((detailM1?.TotalAdsSpend ?? 0) + (detailM2?.TotalAdsSpend ?? 0)) / Math.max((detailM1?.AmsOrders ?? 0) + (detailM2?.AmsOrders ?? 0), 1)) || 0)}`,
                ],
              },
            ].map((module) => (
              <div key={module.title} style={{ background:"#FFFFFF", border:"1px solid #D8E1EC", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 28px rgba(15,23,42,0.05)" }}>
                <div style={{ padding:"10px 14px", background:`linear-gradient(90deg, ${module.accent}18, transparent)`, borderBottom:`1px solid ${module.accent}22`, fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:0.9, textTransform:"uppercase", color:"#334155", fontWeight:700 }}>{module.title}</div>
                <div style={{ padding:"14px", display:"grid", gap:8 }}>
                  {module.rows.map((text) => (
                    <div key={text} style={{ display:"flex", justifyContent:"space-between", gap:12, fontSize:12, color:"#0F172A" }}>
                      <span>{text.split(":")[0]}</span>
                      <strong style={{ color:module.accent }}>{text.split(": ").slice(1).join(": ")}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:16, alignItems:"start" }}>
            <div style={{ display:"grid", gap:16 }}>
              <div style={{ padding:"14px", borderRadius:18, background:"#FFFFFF", border:"1px solid #D8E1EC", boxShadow:"0 12px 28px rgba(15,23,42,0.05)" }}>
                <div style={{ color:"#334155", fontSize:10, marginBottom:10, fontFamily:"'DM Mono', monospace", letterSpacing:0.8, textTransform:"uppercase" }}>Month-wise net sales</div>
                <TrendLineChart
                  svgRef={detailChartRef}
                  valueType="currency"
                  color="#2563EB"
                  points={detailRows.map((row) => ({ label: row.Month, value: row.TotalNetSalesValue ?? 0 }))}
                />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:12 }}>
                <div style={{ padding:"14px", borderRadius:18, background:"#FFFFFF", border:"1px solid #D8E1EC", boxShadow:"0 12px 28px rgba(15,23,42,0.05)" }}>
                  <div style={{ color:"#334155", fontSize:10, marginBottom:10, fontFamily:"'DM Mono', monospace", letterSpacing:0.8, textTransform:"uppercase" }}>Ad trend</div>
                  <MiniMonthBars jan={detailM1?.TotalAdsSales ?? 0} feb={detailM2?.TotalAdsSales ?? 0} type="currency" colorA="#F472B6" colorB="#FB7185" />
                </div>
                <div style={{ padding:"14px", borderRadius:18, background:"#FFFFFF", border:"1px solid #D8E1EC", boxShadow:"0 12px 28px rgba(15,23,42,0.05)" }}>
                  <div style={{ color:"#334155", fontSize:10, marginBottom:10, fontFamily:"'DM Mono', monospace", letterSpacing:0.8, textTransform:"uppercase" }}>Unit trend</div>
                  <MiniMonthBars jan={detailM1?.NetUnits ?? 0} feb={detailM2?.NetUnits ?? 0} colorA="#34D399" colorB="#10B981" />
                </div>
                <div style={{ padding:"14px", borderRadius:18, background:"#FFFFFF", border:"1px solid #D8E1EC", boxShadow:"0 12px 28px rgba(15,23,42,0.05)" }}>
                  <div style={{ color:"#334155", fontSize:10, marginBottom:10, fontFamily:"'DM Mono', monospace", letterSpacing:0.8, textTransform:"uppercase" }}>Buybox trend</div>
                  <MiniMonthBars jan={(detailM1?.BuyboxPct ?? 0) * 100} feb={(detailM2?.BuyboxPct ?? 0) * 100} colorA="#FBBF24" colorB="#F59E0B" />
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gap:12 }}>
              {detailRows.map((row) => (
                <div key={row.Month} style={{ padding:"14px", borderRadius:18, background:"#FFFFFF", border:"1px solid #D8E1EC", boxShadow:"0 12px 28px rgba(15,23,42,0.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>{row.Month} 2026</div>
                    <span style={{ padding:"4px 8px", borderRadius:999, background:"#EEF2FF", color:"#4338CA", fontSize:11, fontWeight:700 }}>{row.Brand}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0, 1fr))", gap:8, color:"#334155", fontSize:12 }}>
                    <div>Sessions: <strong>{(row.Sessions ?? 0).toLocaleString("en-IN")}</strong></div>
                    <div>Net Units: <strong>{(row.NetUnits ?? 0).toLocaleString("en-IN")}</strong></div>
                    <div>Net Sales: <strong>{inr(row.TotalNetSalesValue ?? 0)}</strong></div>
                    <div>Ads Sales: <strong>{inr(row.TotalAdsSales ?? 0)}</strong></div>
                    <div>Ads Spend: <strong>{inr(row.TotalAdsSpend ?? 0)}</strong></div>
                    <div>AMS Orders: <strong>{(row.AmsOrders ?? 0).toLocaleString("en-IN")}</strong></div>
                    <div>Clicks: <strong>{(row.Clicks ?? 0).toLocaleString("en-IN")}</strong></div>
                    <div>Impressions: <strong>{(row.Impressions ?? 0).toLocaleString("en-IN")}</strong></div>
                    <div>Buybox: <strong>{((row.BuyboxPct || 0) * 100).toFixed(1)}%</strong></div>
                    <div>Organic Units: <strong>{(row.OrganiSales ?? 0).toLocaleString("en-IN")}</strong></div>
                    <div>ACOS: <strong>{((row.ACOS || 0) * 100).toFixed(1)}%</strong></div>
                    <div>TACOS: <strong>{((row.TACOS || 0) * 100).toFixed(1)}%</strong></div>
                    <div>CVR: <strong>{((row.ConversionPct || 0) * 100).toFixed(2)}%</strong></div>
                    <div>Organic %: <strong>{((row.OrganicPct || 0) * 100).toFixed(1)}%</strong></div>
                    <div>CAC: <strong>{inr(row.CAC ?? 0)}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        </div>
      </div>
    );
  }

  const aiSuggestions = [
    "Give me a full performance overview",
    "Which ASIN has the best ACOS?",
    "Top 5 ASINs by Net Sales",
    "Which brand spent most on ads?",
    "Compare all 4 brands: Nexlev, Audio Array, Tonor, White Mulberry",
    "Which ASINs have Buybox below 50%?",
    "Show me high TACOS ASINs to fix",
  ];

  const buildAiContext = () => {
    try {
      const brandTotals = brands.map(b => {
        const rows = enriched.filter(r => r.Brand === b);
        const sales = rows.reduce((s,r) => s+(r.TotalNetSalesValue||0),0);
        const spend = rows.reduce((s,r) => s+(r.TotalAdsSpend||0),0);
        const units = rows.reduce((s,r) => s+(r.NetUnits||0),0);
        const orders = rows.reduce((s,r) => s+(r.AmsOrders||0),0);
        const adsSales = rows.reduce((s,r) => s+(r.TotalAdsSales||0),0);
        return `${b}: Sales=₹${(sales/100000).toFixed(1)}L, Spend=₹${(spend/100000).toFixed(1)}L, Units=${units}, Orders=${orders}, AdsSales=₹${(adsSales/100000).toFixed(1)}L`;
      }).join("\n");
      const top10 = [...filtered].sort((a,b)=>(b.TotalNetSalesValue||0)-(a.TotalNetSalesValue||0)).slice(0,10).map(r=>
        `${r.ASIN}(${r.Brand},${r.Month}): Sales=₹${((r.TotalNetSalesValue||0)/1000).toFixed(0)}K, Units=${r.NetUnits||0}, ACOS=${((r.ACOS||0)*100).toFixed(1)}%, Buybox=${((r.BuyboxPct||0)*100).toFixed(1)}%, Sessions=${r.Sessions||0}`
      ).join("\n");
      return `You are an expert Amazon performance analyst AI for BrandIQ Hub dashboard.\n\nBRAND TOTALS:\n${brandTotals}\n\nTOP 10 ASINs (filter: Brand=${brand||"All"}, Month=${month}):\n${top10}\n\nOVERALL: Sessions=${totals.sessions.toLocaleString()}, Units=${totals.units.toLocaleString()}, Sales=₹${(totals.sales/10000000).toFixed(2)}Cr, Spend=₹${(totals.spend/100000).toFixed(1)}L, AvgACOS=${(avgAcos*100).toFixed(1)}%, AvgTACOS=${(avgTacos*100).toFixed(1)}%\n\nBe concise and business-focused. Use bullet points and bold key numbers with ₹ signs.`;
    } catch(err) {
      console.error("buildAiContext error:", err);
      return "You are an expert Amazon performance analyst AI for BrandIQ Hub dashboard. Data could not be loaded.";
    }
  };

  const sendAiMessage = async (text) => {
    const msg = text || aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput("");
    const newMessages = [...aiMessages, { role:"user", content:msg }];
    setAiMessages(newMessages);
    setAiLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer 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"},
        body:JSON.stringify({ model:"meta-llama/llama-3.1-8b-instruct:free", max_tokens:1000, messages:[{role:"system",content:buildAiContext()},...newMessages] }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, couldn't get a response.";
      setAiMessages([...newMessages, { role:"assistant", content:reply }]);
    } catch(e) {
      setAiMessages([...newMessages, { role:"assistant", content:"Error: " + e.message }]);
    }
    setAiLoading(false);
    setTimeout(() => aiEndRef.current?.scrollIntoView({behavior:"smooth"}), 100);
  };

  const fmtAi = (text) => text.split("\n").map((line,i) => {
    if (line.startsWith("## ")) return <div key={i} style={{fontWeight:800,fontSize:14,color:"#0F172A",margin:"8px 0 2px"}}>{line.slice(3)}</div>;
    if (line.startsWith("# ")) return <div key={i} style={{fontWeight:800,fontSize:15,color:"#1D4ED8",margin:"8px 0 2px"}}>{line.slice(2)}</div>;
    if (line.startsWith("- ")||line.startsWith("• ")) return <div key={i} style={{display:"flex",gap:6,margin:"2px 0"}}><span style={{color:"#2563EB",flexShrink:0}}>•</span><span dangerouslySetInnerHTML={{__html:line.slice(2).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/></div>;
    if (!line.trim()) return <div key={i} style={{height:5}}/>;
    return <div key={i} style={{margin:"2px 0"}} dangerouslySetInnerHTML={{__html:line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/>;
  });

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#FFFFFF", minHeight: "100vh", color: "#0F172A" }}>

      {/* AI Floating Button + Chat */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:12}}>
        {aiOpen && (
          <div style={{width:380,background:"#FFFFFF",borderRadius:24,boxShadow:"0 24px 64px rgba(15,23,42,0.2)",border:"1px solid #E2E8F0",display:"flex",flexDirection:"column",overflow:"hidden",maxHeight:"80vh"}}>
            <div style={{background:"linear-gradient(135deg,#4338CA 0%,#2563EB 100%)",padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:36,height:36,borderRadius:999,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
                <div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:14}}>BuyBox AI</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontFamily:"'DM Mono',monospace",letterSpacing:0.8}}>AMAZON PERFORMANCE ANALYST</div>
                </div>
              </div>
              <button onClick={()=>setAiOpen(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:999,color:"#fff",width:28,height:28,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10,minHeight:0,maxHeight:380}}>
              {aiMessages.length===0 && (
                <div>
                  <div style={{background:"linear-gradient(135deg,#EEF2FF,#F0F9FF)",borderRadius:16,padding:"14px",fontSize:13,color:"#334155",marginBottom:10,border:"1px solid #C7D2FE"}}>
                    Hi! I have access to all your Amazon data — ASINs, brands, months, metrics. Ask me anything! 🚀
                  </div>
                  <div style={{fontSize:10,color:"#94A3B8",marginBottom:8,fontFamily:"'DM Mono',monospace",letterSpacing:0.8}}>TRY ASKING:</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {aiSuggestions.map(s=>(
                      <button key={s} onClick={()=>sendAiMessage(s)} style={{background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:999,padding:"8px 14px",fontSize:12,color:"#4338CA",cursor:"pointer",textAlign:"left",fontWeight:600,transition:"all 0.15s"}}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {aiMessages.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"88%",padding:"10px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,#4338CA,#2563EB)":"#F8FAFC",color:m.role==="user"?"#fff":"#0F172A",fontSize:13,lineHeight:1.55,border:m.role==="assistant"?"1px solid #E2E8F0":"none"}}>
                    {m.role==="assistant"?fmtAi(m.content):m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{display:"flex",gap:5,padding:"12px 14px",background:"#F8FAFC",borderRadius:"18px 18px 18px 4px",width:"fit-content",border:"1px solid #E2E8F0"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:999,background:"#94A3B8",animation:`aiBounce 1s ease-in-out ${i*0.15}s infinite`}}/>)}
                </div>
              )}
              <div ref={aiEndRef}/>
            </div>
            {aiMessages.length>0 && (
              <div style={{padding:"6px 14px",borderTop:"1px solid #F1F5F9",flexShrink:0}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {aiSuggestions.slice(0,3).map(s=>(
                    <button key={s} onClick={()=>sendAiMessage(s)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:999,padding:"4px 10px",fontSize:11,color:"#475569",cursor:"pointer"}}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{padding:"12px 14px",borderTop:"1px solid #E2E8F0",display:"flex",gap:8,flexShrink:0}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendAiMessage()} placeholder="Ask about sales, ASINs, trends..." style={{flex:1,border:"1px solid #D8E1EC",borderRadius:999,padding:"9px 14px",fontSize:12,outline:"none",color:"#0F172A",background:"#F8FAFC"}}/>
              <button onClick={()=>sendAiMessage()} disabled={aiLoading||!aiInput.trim()} style={{background:"linear-gradient(135deg,#4338CA,#2563EB)",border:"none",borderRadius:999,width:36,height:36,cursor:aiInput.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",opacity:aiInput.trim()?1:0.4,flexShrink:0}}>
                <span style={{color:"#fff",fontSize:16}}>↑</span>
              </button>
            </div>
          </div>
        )}
        <button onClick={()=>setAiOpen(o=>!o)} style={{width:56,height:56,borderRadius:999,background:"linear-gradient(135deg,#4338CA,#2563EB)",border:"none",boxShadow:"0 8px 28px rgba(67,56,202,0.45)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,transition:"transform 0.2s"}}>
          {aiOpen?"✕":"🤖"}
        </button>
      </div>
      <style>{`@keyframes aiBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      <div style={{ background: THEME.surface, borderBottom: `1px solid ${THEME.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#38BDF8,#2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>N</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: THEME.text, letterSpacing: -0.4 }}>BrandIQ Hub</div>
            <div style={{ fontSize: 9, color: THEME.textFaint, fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>AMAZON PERFORMANCE INTELLIGENCE</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={exportFilteredData}
            style={{ background:THEME.panelBg, border:`1px solid ${THEME.border}`, borderRadius:8, padding:"7px 12px", fontSize:11, color:THEME.textSoft, fontWeight:600, cursor:"pointer" }}
          >
            Export CSV
          </button>
          <span style={{ fontSize: 10, color: THEME.textFaint, fontFamily: "'DM Mono',monospace" }}>{filtered.length} rows</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: THEME.shellBg, borderBottom: `1px solid ${THEME.border}`, padding: "12px 24px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, fontSize: 13 }}>⌕</span>
          <input
            placeholder="Search ASIN, SKU, model, product…"
            value={search} onChange={onSearch}
            style={{ background: search?"#EFF6FF":THEME.surface, border: search?"1px solid #3B82F6":`1px solid ${THEME.border}`, borderRadius: 8, color: THEME.text, padding: "9px 14px 9px 34px", fontSize: 12, width: 260, outline: "none", transition:"all 0.15s" }}
          />
        </div>
        {[
          { label:"Brand", val:brand, set:(value)=>{ setBrand(value); setCompareAsin(""); setTablePage(1); }, opts:[{v:"",l:"All Brands"},...brands.map(b=>({v:b,l:b}))] },
          { label:"Month", val:month, set:(v)=>{ setMonth(v); setTablePage(1); }, opts:months.map(m=>({v:m,l:m})) },
          { label:"Category", val:cat, set:(value)=>{ setCat(value); setCompareAsin(""); setTablePage(1); }, opts:[{v:"",l:"All Categories"},...cats.map(c=>({v:c,l:c}))] },
        ].map(f=>(
          <div key={f.label} style={{ display:"flex", gap:6, alignItems:"center", padding:"7px 10px", borderRadius:8,
            background: f.val && f.val !== "All" ? "#EFF6FF" : THEME.surface,
            border: f.val && f.val !== "All" ? "1px solid #3B82F6" : `1px solid ${THEME.border}`,
            transition:"all 0.15s" }}>
            <span style={{ fontSize:10, color: f.val && f.val !== "All" ? "#2563EB" : THEME.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:0.8, textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{f.label}</span>
            <select value={f.val} onChange={e=>{f.set(e.target.value);}} style={{ background:"transparent", border:"none", color: THEME.text, padding:"1px 20px 1px 2px", fontSize:12, cursor:"pointer", appearance:"none", outline:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 4px center" }}>
              {f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color: activeFilterCount > 0 ? "#2563EB" : THEME.textFaint, fontFamily:"'DM Mono',monospace" }}>
            {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount>1?"s":""} active` : `${filtered.length} rows`}
          </span>
          <div style={{ display:"flex", gap:6, alignItems:"center", padding:"7px 10px", borderRadius:8, background:THEME.surface, border:`1px solid ${THEME.border}` }}>
            <span style={{ fontSize:10, color:THEME.textFaint, fontFamily:"'DM Mono',monospace", fontWeight:600 }}>SORT</span>
            <select value={sortKey} onChange={e=>{setSortKey(e.target.value); setTablePage(1);}} style={{ background:"transparent", border:"none", color:THEME.text, padding:"1px 20px 1px 2px", fontSize:12, outline:"none", appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 4px center" }}>
            {COLS.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div style={{ background: THEME.shellBg, borderBottom: `1px solid ${THEME.border}`, padding: "0 24px 12px" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <button
            onClick={() => openSmartViewPage()}
            style={{
              padding:"9px 16px",
              borderRadius:"12px 12px 0 0",
              border:"none",
              borderBottom:"2px solid #2563EB",
              background:THEME.surface,
              color:"#1D4ED8",
              fontSize:11,
              fontWeight:700,
              cursor:"pointer",
              boxShadow:"0 -1px 0 rgba(255,255,255,0.7) inset",
            }}
          >
            Smart View
          </button>
          <button
            onClick={() => openComparePage(activeCompareAsin)}
            disabled={!activeCompareAsin}
            style={{ background: activeCompareAsin ? "#2563EB" : THEME.surfaceSoft, border:"none", borderRadius:8, padding:"7px 14px", fontSize:11, color:activeCompareAsin ? "#FFFFFF" : THEME.textMuted, fontWeight:700, cursor:activeCompareAsin?"pointer":"not-allowed", whiteSpace:"nowrap" }}
          >
            Compare View →
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ padding:"12px 24px", display:"flex", gap:10, overflowX:"auto", flexWrap:"nowrap", WebkitOverflowScrolling:"touch", background:THEME.surface, borderBottom:`1px solid ${THEME.surfaceSoft}` }}>
        <KpiCard label="Sessions"   value={totals.sessions.toLocaleString("en-IN")}    accent="#38BDF8" trend={trendPct(totals.sessions, prevTotals.sessions)} />
        <KpiCard label="Net Units"  value={totals.units.toLocaleString("en-IN")}        accent="#34D399" trend={trendPct(totals.units, prevTotals.units)} />
        <KpiCard label="Net Sales"  value={inr(totals.sales)}   accent="#A78BFA" trend={trendPct(totals.sales, prevTotals.sales)} />
        <KpiCard label="Ad Spend"  value={inr(totals.spend)}   accent="#FBBF24" trend={trendPct(totals.spend, prevTotals.spend)} />
        <KpiCard label="Ad Sales"  value={inr(totals.adsSales)} accent="#F9A8D4" trend={trendPct(totals.adsSales, prevTotals.adsSales)} />
        <KpiCard label="AMS Orders" value={totals.orders.toLocaleString("en-IN")}       accent="#FB923C" trend={trendPct(totals.orders, prevTotals.orders)} />
        <KpiCard label="Avg ACoS"   value={(avgAcos*100).toFixed(1)+"%"}  accent={avgAcos<0.2?"#34D399":avgAcos<0.35?"#FBBF24":"#F87171"} />
        <KpiCard label="Avg TACoS"  value={(avgTacos*100).toFixed(1)+"%"} accent={avgTacos<0.1?"#34D399":avgTacos<0.2?"#FBBF24":"#F87171"} />
      </div>

      {/* Table */}
      <div style={{ padding:"0 24px 32px", overflowX:"auto" }}>
        <div style={{ borderRadius:12, border:`1px solid ${THEME.border}`, overflow:"hidden", minWidth:1800, background:THEME.surface, boxShadow:"0 4px 16px rgba(15,23,42,0.04)" }}>
          <div ref={tableScrollerRef} style={{ overflow:"auto", maxHeight:"calc(100vh - 240px)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead>
              <tr style={{ background:THEME.headerBg }}>
                {COLS.map(col => (
                  <th key={col.key} onClick={()=>handleSort(col.key)} style={{
                    padding:"10px 10px", textAlign: col.fmt==="str"||col.fmt==="title"?"left":"right",
                    color: sortKey===col.key?"#1D4ED8":THEME.headerText,
                    fontFamily:"'DM Mono',monospace", fontSize:9.5, fontWeight:500,
                    letterSpacing:0.7, textTransform:"uppercase", cursor:"pointer",
                    whiteSpace:"nowrap", userSelect:"none", minWidth:col.w,
                    background: sortKey===col.key ? THEME.headerBgActive : THEME.headerBg,
                    borderBottom: `1px solid ${THEME.borderStrong}`,
                    position:"sticky", top:0,
                    left: STICKY_LEFT_OFFSETS[col.key],
                    zIndex: STICKY_LEFT_OFFSETS[col.key] !== undefined ? 8 : 5,
                    borderRight: STICKY_LEFT_OFFSETS[col.key] !== undefined ? `1px solid ${THEME.borderStrong}` : undefined,
                    boxShadow: `inset 0 -1px 0 ${THEME.borderStrong}, ${THEME.headerShadow}`,
                  }}>
                    {col.label}{sortKey===col.key&&<span style={{marginLeft:3}}>{sortDir===-1?"↓":"↑"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, index) => {
                const i = (currentPage - 1) * TABLE_PAGE_SIZE + index;
                const rowBackground = i % 2 === 0 ? THEME.surface : THEME.panelBg;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #F1F5F9", background: rowBackground }}
                    onMouseEnter={e=>{
                      e.currentTarget.style.background=THEME.hover;
                      e.currentTarget.querySelectorAll("[data-sticky='true']").forEach((cell) => {
                        cell.style.background = THEME.hover;
                      });
                    }}
                    onMouseLeave={e=>{
                      e.currentTarget.style.background=rowBackground;
                      e.currentTarget.querySelectorAll("[data-sticky='true']").forEach((cell) => {
                        cell.style.background = rowBackground;
                      });
                    }}
                  >
                    {COLS.map(col => {
                      const v    = col.master ? getMasterValue(row, col.key) : row[col.key];
                      const disp = fmtCell(row, col);
                      const isPct = col.fmt === "pct";
                      const accentColor = isPct ? pctColor(col.key, v) : col.key === "Title" ? THEME.text : THEME.textSoft;
                      const isEmpty = v === null || v === undefined || v === 0 || v === "";

                      return (
                        <td key={col.key} data-sticky={STICKY_LEFT_OFFSETS[col.key] !== undefined ? "true" : "false"} style={{
                          padding:"5px 10px",
                          textAlign: col.fmt==="str"||col.fmt==="title"?"left":"right",
                          fontFamily: col.key==="ASIN"||col.key==="fbaSku"||col.key==="model" ? "'DM Mono',monospace" : "inherit",
                          fontSize: col.key==="ASIN" ? 12 : col.key==="fbaSku" ? 10.8 : 11.5,
                          maxWidth: col.fmt==="title" ? 140 : undefined,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                          background: STICKY_LEFT_OFFSETS[col.key] !== undefined ? rowBackground : col.master ? (isEmpty?THEME.surfaceMuted:"#F0F4FF") : "transparent",
                          color: isEmpty ? "#CBD5E1" : col.key==="ASIN" ? "#1D4ED8" : accentColor,
                          letterSpacing: col.key==="ASIN" ? 0.3 : 0,
                          fontWeight: col.key==="ASIN" ? 800 : col.key==="model" ? 600 : col.key==="TotalNetSalesValue" ? 700 : col.key==="dp"||col.key==="nlc" ? 600 : 400,
                          position: STICKY_LEFT_OFFSETS[col.key] !== undefined ? "sticky" : "static",
                          left: STICKY_LEFT_OFFSETS[col.key],
                          zIndex: STICKY_LEFT_OFFSETS[col.key] !== undefined ? 4 : 1,
                          borderRight: STICKY_LEFT_OFFSETS[col.key] !== undefined ? `1px solid ${THEME.border}` : undefined,
                          boxShadow: STICKY_LEFT_OFFSETS[col.key] === STICKY_LEFT_OFFSETS.category ? THEME.stickyShadow : undefined,
                        }}>
                          {col.key === "ASIN" && !isEmpty ? (
                            <a
                              href={`https://www.amazon.in/dp/${encodeURIComponent(row.ASIN)}`}
                              target="_blank"
                              rel="noreferrer"
                              title={`Open ${row.ASIN} in new tab`}
                              style={{ color:"#1D4ED8", fontFamily:"inherit", fontSize:"inherit", cursor:"pointer", fontWeight:800, textDecoration:"underline", textUnderlineOffset:"2px" }}
                            >
                              {disp}
                            </a>
                          ) : col.key === "Title" && !isEmpty ? (
                            <button
                              onClick={null}
                              title={String(row.Title)}
                              style={{ background:"none", border:"none", padding:0, color:THEME.text, fontFamily:"inherit", fontSize:"inherit", cursor:"pointer", textAlign:"left", fontWeight:600, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}
                            >
                              {String(row.Title).split("|")[0].split(",")[0].trim().slice(0,32)}
                            </button>
                          ) : isPct && v > 0
                            ? <span style={{
                                display:"inline-block",
                                background: accentColor+"12",
                                border: `1px solid ${accentColor}33`,
                                borderRadius:4, padding:"1px 6px",
                                color: accentColor, fontSize:11,
                              }}>{disp}</span>
                            : (isEmpty ? <span style={{color:"#2D3139"}}>—</span> : disp)
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {visibleRows.length===0&&(
                <tr>
                  <td colSpan={COLS.length} style={{ padding:"42px 24px" }}>
                    <div style={{ maxWidth:420, margin:"0 auto", textAlign:"center", padding:"22px 24px", borderRadius:18, background:`linear-gradient(180deg, ${THEME.surface}, ${THEME.panelBg})`, border:"1px solid #BFDBFE" }}>
                      <div style={{ fontSize:12, color:"#2563EB", fontFamily:"'DM Mono',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>No matching rows</div>
                      <div style={{ fontSize:20, fontWeight:700, color:THEME.text, marginBottom:8 }}>No results for this combination</div>
                      <div style={{ fontSize:13, color:THEME.textMuted, lineHeight:1.6, marginBottom:16 }}>
                        Try another brand, month or search term to find results.
                      </div>
                      <button
                        onClick={() => { setBrand(""); setMonth("All"); setSearch(""); setDebSearch(""); }}
                        style={{ background:"linear-gradient(135deg,#2563EB,#38BDF8)", border:"none", borderRadius:999, color:"#EFF6FF", padding:"10px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:16, padding:"12px 16px 16px", background:THEME.surface }}>
            <button
              onClick={() => setTablePage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              style={{ padding:"7px 20px", border:`1px solid ${THEME.border}`, borderRadius:8, background:currentPage===1?THEME.panelBg:THEME.surface, color:currentPage===1?"#CBD5E1":THEME.textSoft, fontSize:12, fontWeight:600, cursor:currentPage===1?"not-allowed":"pointer" }}
            >
              ← Prev
            </button>
            <span style={{ fontSize:12, color:THEME.textMuted, fontFamily:"'DM Mono',monospace" }}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setTablePage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              style={{ padding:"7px 20px", border:`1px solid ${THEME.border}`, borderRadius:8, background:currentPage===totalPages?THEME.panelBg:THEME.headerBg, color:currentPage===totalPages?"#CBD5E1":THEME.text, fontSize:12, fontWeight:600, cursor:currentPage===totalPages?"not-allowed":"pointer" }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
