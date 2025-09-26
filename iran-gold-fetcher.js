const CACHE_KEY = 'devhub_ir_gold18_fetch_v2';
const TTL_MS = 60_000;
const MILLI_API_KEY = 'BIEljeVp6rRnPUllvpTXhNRbZqcMEY9R';
const MILLI_API_URL = `https://BrsApi.ir/Api/Market/Gold_Currency.php?key=${MILLI_API_KEY}`;

function toEngDigits(s) {
  const map = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9' };
  return String(s || '').replace(/[۰-۹]/g, d => map[d] ?? d);
}

function validIRR(n) { return Number.isFinite(n) && n >= 10_000_000 && n <= 200_000_000; }

export async function fetchIranGold18k() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached._ts < TTL_MS) {
      return { ...cached, cache: true };
    }
  } catch {}

  let price = null;
  let source = null;
  const fetched_at = new Date().toISOString();

  // 1. First try the official API
  try {
    const res = await fetch(MILLI_API_URL);
    if (res.ok) {
      const data = await res.json();
      if (data && data.Gram18K) {
        const parsedPrice = Number(data.Gram18K);
        if (validIRR(parsedPrice)) {
          price = parsedPrice;
          source = { name: 'Milli API', url: MILLI_API_URL, value: price, timestamp: fetched_at };
        }
      }
    }
  } catch (e) { console.warn('Milli API failed', e.message); }

  // 2. Fallback: HTML scraping
  if (!price) {
    try {
      const htmlRes = await fetch('https://milli.gold/landing/geram18/');
      if (htmlRes.ok) {
        const htmlText = toEngDigits(await htmlRes.text());
        // Look for a number followed by "تومان"
        const match = htmlText.match(/([\d,]+)\s*تومان/);
        if (match && match[1]) {
          const parsedPrice = Number(match[1].replace(/,/g, '')) * 10; // Convert Toman -> IRR
          if (validIRR(parsedPrice)) {
            price = parsedPrice;
            source = { name: 'Milli Gold (HTML)', url: 'https://milli.gold/landing/geram18/', value: price, timestamp: fetched_at };
          }
        }
      }
    } catch (e) { console.warn('Milli HTML scrape failed', e.message); }
  }

  // 3. Finalization or cache fallback
  if (!price) {
    const last = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (last?.price) {
      return { ...last, fetched_at, warnings: ['Using cached price — API and HTML unavailable'] };
    }
    return { error: 'Could not fetch price', fetched_at };
  }
  
  // 4. Return final output with simulated history
  const now = Date.now();
  const history = {
      daily: Array.from({length:30}, (_,i)=>({ t: now - (29-i)*24*3600*1000, v: price*(1 + (Math.random()-0.5)*0.03) })),
      weekly: Array.from({length:26}, (_,i)=>({ t: now - (25-i)*7*24*3600*1000, v: price*(1 + (Math.random()-0.5)*0.06) })),
      monthly: Array.from({length:12}, (_,i)=>({ t: now - (11-i)*30*24*3600*1000, v: price*(1 + (Math.random()-0.5)*0.1) }))
  };

  const output = {
    source: source.name,
    country: 'IR',
    unit: 'gram_18k',
    price: price,
    min: price * 0.99,
    max: price * 1.01,
    average: price,
    currency: 'IRR',
    primarySource: source,
    sources: [source],
    online: true,
    history,
    fetched_at,
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...output, _ts: Date.now() }));
  } catch {}

  return output;
}