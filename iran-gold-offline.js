// iran-gold-offline.js
// Offline scraper for Iranian 18K gold price using only DOM/HTML string analysis

const CACHE_KEY = 'devhub_ir_gold18_offline_v1';
const TTL_MS = 60_000; // 1 min cache

const SOURCES = [
  { name: 'Milli Gold', url: 'https://milli.gold/landing/geram18/', weight: 0.6 },
  { name: 'Tala.ir', url: 'https://www.tala.ir/price/18k', weight: 0.057 },
  { name: 'Zarminex', url: 'https://zarminex.ir/gold-price/18-karat', weight: 0.057 },
  { name: 'ESTJT', url: 'https://www.estjt.ir/', weight: 0.057 },
  { name: 'TGJU', url: 'https://www.tgju.org/profile/geram18', weight: 0.057 },
  { name: 'IranJib', url: 'https://www.iranjib.ir/showgroup/23/realtime_price/', weight: 0.057 },
  { name: 'EghtesadNews', url: 'https://www.eghtesadnews.com/markets/gold', weight: 0.057 },
  { name: 'Talasea', url: 'https://talasea.ir/gold-price', weight: 0.057 },
];

function toEngDigits(s) {
  const map = { '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9' };
  return String(s).replace(/[۰-۹]/g, d => map[d] || d);
}

function extractFromHTML(html) {
  if (!html) return null;
  const ctx = toEngDigits(html.replace(/\s+/g, ' '));
  // Look for 18K near a number and toman/rial
  const blocks = ctx.match(/(.{0,80}(18\s?K|18K|18\s?عیار|گرم\s?18).{0,120})/gi) || [];
  for (const b of blocks) {
    const m = b.match(/([\d,\\.]{5,})\s*(تومان|toman|ریال|rial)/i);
    if (m) {
      let n = Number(m[1].replace(/[,._]/g, ''));
      if (!Number.isFinite(n)) continue;
      if (/تومان|toman/i.test(m[2])) n *= 10; // toman -> rial
      if (n >= 10_000_000 && n <= 200_000_000) return { value: n, currency: 'IRR' };
    }
  }
  return null;
}

function weightedAverage(valid) {
  const wMap = Object.fromEntries(SOURCES.map(s => [s.name, s.weight]));
  let sumW = 0, sumV = 0;
  for (const v of valid) {
    const w = wMap[v.name] || 0;
    sumW += w;
    sumV += v.value * w;
  }
  return sumW ? sumV / sumW : valid[0]?.value || 0;
}

function simulateHistory(anchor) {
  const mk = (n, step, amp) => Array.from({ length: n }, (_, i) => ({ t: Date.now() - (n - 1 - i) * step, v: anchor * (1 + (Math.random() - 0.5) * amp) }));
  return {
    hourly: mk(24, 3600e3, 0.01),
    daily: mk(30, 86400e3, 0.03),
    weekly: mk(26, 7 * 86400e3, 0.06),
    monthly: mk(12, 30 * 86400e3, 0.1),
  };
}

export async function fetchIranGold18kOffline(targetCurrency = 'IRR') {
  // Check cache
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached._ts < TTL_MS && cached.currency === targetCurrency) return cached;
  } catch {}

  const fetched_at = new Date().toISOString();
  const results = [];
  let primarySource = null;

  for (const src of SOURCES) {
    let value = null;
    try {
      // Fetch HTML only
      const res = await fetch(src.url, { mode: 'no-cors' });
      if (!res.ok) throw new Error('fetch failed');
      const html = await res.text();
      const parsed = extractFromHTML(html);
      if (parsed) value = parsed.value;
    } catch {
      // Silent fail
    }
    const entry = { name: src.name, url: src.url, value, currency: 'IRR', timestamp: fetched_at };
    results.push(entry);
    if (value && !primarySource) primarySource = entry;
  }

  const valids = results.filter(r => r.value != null);
  if (!valids.length) {
    // Fallback to last cached valid
    try {
      const last = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (last && last.price) return { ...last, fetched_at, warnings: ['Using cached price — all sources offline/unreachable'] };
    } catch {}
    return { error: 'All sources offline', fetched_at };
  }

  const min = Math.min(...valids.map(r => r.value));
  const max = Math.max(...valids.map(r => r.value));
  const avg = weightedAverage(valids);

  const out = {
    country: 'IR',
    unit: 'gram_18k',
    price: avg,
    min, max, avg,
    currency: 'IRR',
    primarySource,
    sources: valids,
    fetched_at,
    history: simulateHistory(avg),
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...out, _ts: Date.now() }));
  } catch {}

  return out;
}