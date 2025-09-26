// iran-gold-offline.js
import { escapeHTML } from './utils.js';

const CACHE_KEY = 'iran_gold_18k_cache';
const SOURCES = [
    {name:'Milli.gold', url:'https://milli.gold/landing/geram18/'},
    {name:'Tala.ir', url:'https://www.tala.ir/price/18k'},
    {name:'Zarminex.ir', url:'https://zarminex.ir/gold-price/18-karat'},
    {name:'Estjt.ir', url:'https://www.estjt.ir/'}
    // می‌توان سایت‌های دیگر معتبر را اضافه کرد
];

function getCachedData() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY));
    } catch(e){ return null; }
}

function setCachedData(data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

async function fetchHTML(url) {
    try {
        const res = await fetch(url, {method:'GET', headers:{'Content-Type':'text/html'}});
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text;
    } catch(e){
        console.warn('HTML fetch failed:', url, e);
        return null;
    }
}

function parsePriceFromHTML(html, sourceName) {
    try {
        if(!html) return null;
        let match;
        switch(sourceName){
            case 'Milli.gold':
                // جستجو برای "گرم ۱۸" یا متن مشابه
                match = html.match(/قیمت\s*هر\s*گرم\s*طلای\s*۱۸\s*عیار\s*[:\s]*([\d,]+)/i);
                break;
            case 'Tala.ir':
            case 'Zarminex.ir':
            case 'Estjt.ir':
                match = html.match(/18k\s*[:\s]*([\d,]+)/i) || html.match(/گرم\s*۱۸\s*[:\s]*([\d,]+)/i);
                break;
            default: return null;
        }
        if(match && match[1]){
            const price = parseInt(match[1].replace(/,/g,''),10);
            if(!isNaN(price)) return price;
        }
        return null;
    } catch(e){
        console.error('Parse error:', sourceName, e);
        return null;
    }
}

async function fetchAPIPrice(url) {
    // نمونه: اگر سایتی API عمومی داشته باشد
    try {
        const res = await fetch(url+'/api'); // فرضی
        if(!res.ok) throw new Error(`API HTTP ${res.status}`);
        const data = await res.json();
        if(data?.gram18) return parseInt(data.gram18,10);
        return null;
    } catch(e){
        console.warn('API fetch failed:', url, e);
        return null;
    }
}

export async function fetchIranGold18kOffline(currency='IRR') {
    const cached = getCachedData();
    let result = { price:null, sources:[], primarySource:null, fetched_at:null };

    for(const src of SOURCES){
        let price = await fetchHTML(src.url).then(html => parsePriceFromHTML(html, src.name));
        if(!price) price = await fetchAPIPrice(src.url);
        if(price){
            result.price = price;
            result.primarySource = {name: src.name, url: src.url};
            result.fetched_at = Date.now();
            result.sources.push({name:src.name,url:src.url,online:true});
            break; // اولین منبع موفق را انتخاب کن
        } else {
            result.sources.push({name:src.name,url:src.url,online:false});
        }
    }

    if(!result.price && cached?.price){
        result = {...cached, sources: result.sources, primarySource: cached.primarySource};
    }

    setCachedData(result);
    return result;
}