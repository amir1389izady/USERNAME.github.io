// Iran/gold.js

const IR_CACHE_KEY = 'devhub_ir_gold18_v1';
const TTL_MS = 45000;

// سورس‌ها: فقط API اصلی (تو می‌تونی Tala.ir یا milli.gold رو هم نگه داری به عنوان fallback)
const SOURCES = [
  {
    id: 'api',
    name: 'BrsApi Gold API',
    url: 'https://BrsApi.ir/Api/Market/Gold_Currency.php?key=BIEljeVp6rRnPUllvpTXhNRbZqcMEY9R&type=1',
    weight: 1.0, // کل وزن بدیم به API اصلی
  },
];

async function fetchGoldPrice() {
  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // بررسی خروجی API (باید ببینیم فرمت دقیقش چیه)
      // فرض: data.Gold18 یا چیزی شبیه این مقدار قیمت رو برمی‌گردونه
      const price = data?.Gold18 || data?.price || null;

      if (price) {
        return {
          source: source.name,
          price: price,
          time: Date.now(),
        };
      }
    } catch (err) {
      console.error(`❌ خطا در گرفتن داده از ${source.name}:`, err);
    }
  }
  return null;
}

export async function getIranGoldPrice() {
  // کش ساده برای جلوگیری از فشار روی API
  if (!globalThis.__goldCache) globalThis.__goldCache = {};
  const cache = globalThis.__goldCache[IR_CACHE_KEY];

  if (cache && Date.now() - cache.time < TTL_MS) {
    return cache;
  }

  const fresh = await fetchGoldPrice();
  if (fresh) {
    globalThis.__goldCache[IR_CACHE_KEY] = fresh;
  }
  return fresh;
}