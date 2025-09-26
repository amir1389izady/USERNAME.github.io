// This file simulates fetching data from various local sources.
// In a real application, these functions would make API calls.

export const countries = {
    US: {
        name: 'United States',
        currencies: ['USD'],
        goldSources: [
            { name: 'US Gold Bureau', url: '#', credibility: 'Official Dealer', basePrice: 2350 }, // Price per ounce
            { name: 'APMEX', url: '#', credibility: 'Major Retailer', basePrice: 2355 },
            { name: 'Federal Reserve Data', url: '#', credibility: 'Government Source', basePrice: 2345 },
        ],
        banks: [
            { name: 'Chase Bank', url: '#', rates: { '1y': 0.045, '3y': 0.042 } },
            { name: 'Bank of America', url: '#', rates: { '1y': 0.046, '3y': 0.041 } },
            { name: 'Ally Bank', url: '#', rates: { '1y': 0.051, '3y': 0.048 } },
        ],
        products: [
            { name: '1 Gallon Milk', price: 3.99, store: 'Walmart' },
            { name: 'Loaf of Bread', price: 2.50, store: 'Kroger' },
            { name: 'Dozen Eggs', price: 4.20, store: 'Target' },
        ],
        economicFactors: {
            news: "Federal Reserve hints at holding interest rates steady amid inflation concerns.",
            fxTrend: "USD stable against major currencies.",
            bankingPolicy: "No major policy changes announced."
        }
    },
    IR: {
        name: 'Iran',
        currencies: ['IRR'],
        goldSources: [
            { name: 'Milli Gold', url: 'https://milli.gold/landing/geram18/', credibility: 'Local Market Data', basePrice: 45000000 }, // Price per gram 18k
            { name: 'Tala.ir', url: 'https://www.tala.ir/price/18k', credibility: 'Local Exchange Data', basePrice: 45050000 },
            { name: 'Zarminex', url: 'https://zarminex.ir/gold-price/18-karat', credibility: 'Digital Exchange', basePrice: 44950000 },
        ],
        banks: [
            { name: 'Bank Melli', url: '#', rates: { '1y': 0.18, '3y': 0.22 } },
            { name: 'Bank Mellat', url: '#', rates: { '1y': 0.185, '3y': 0.225 } },
            { name: 'Bank Saderat', url: '#', rates: { '1y': 0.17, '3y': 0.21 } },
        ],
        products: [
            { name: '1kg Rice', price: 1500000, store: 'Refah Chain' },
            { name: 'Loaf of Bread (Barbari)', price: 100000, store: 'Local Bakery' },
            { name: '1kg Chicken', price: 900000, store: 'Local Butcher' },
        ],
        economicFactors: {
            news: "New trade agreements with neighboring countries expected to boost economy, but sanctions remain a concern.",
            fxTrend: "Local currency shows slight weakening against USD in unofficial markets.",
            bankingPolicy: "Central bank raises short-term deposit rates to combat inflation."
        }
    },
    DE: {
        name: 'Germany',
        currencies: ['EUR'],
        goldSources: [
            { name: 'Deutsche Börse Commodities', url: '#', credibility: 'Official Exchange', basePrice: 68.50 }, // Price per gram
            { name: 'Pro Aurum', url: '#', credibility: 'Major Dealer', basePrice: 68.75 },
            { name: 'Bundesbank Statistics', url: '#', credibility: 'Central Bank', basePrice: 68.40 },
        ],
        banks: [
            { name: 'Deutsche Bank', url: '#', rates: { '1y': 0.035, '3y': 0.032 } },
            { name: 'Commerzbank', url: '#', rates: { '1y': 0.036, '3y': 0.033 } },
            { name: 'N26', url: '#', rates: { '1y': 0.040, '3y': 0.035 } },
        ],
        products: [
            { name: '1 Liter Milk', price: 1.19, store: 'Lidl' },
            { name: 'Loaf of Bread', price: 2.20, store: 'Aldi' },
            { name: '10 Eggs', price: 2.99, store: 'Rewe' },
        ],
        economicFactors: {
            news: "European Central Bank signals potential rate cuts later in the year if inflation targets are met.",
            fxTrend: "EUR shows strength against the USD due to positive manufacturing data.",
            bankingPolicy: "ECB continues its quantitative tightening policy at a reduced pace."
        }
    },
    CA: {
        name: 'Canada',
        currencies: ['CAD'],
        goldSources: [
            { name: 'Kitco', url: '#', credibility: 'Major Dealer', basePrice: 3180 }, // Price per ounce in USD, to be converted
            { name: 'Scotiabank', url: '#', credibility: 'Major Bank', basePrice: 3190 },
        ],
        banks: [
            { name: 'RBC', url: '#', rates: { '1y': 0.048, '3y': 0.045 } },
            { name: 'TD Bank', url: '#', rates: { '1y': 0.0475, '3y': 0.046 } },
        ],
        products: [
            { name: '4L Milk Bag', price: 5.89, store: 'Loblaws' },
            { name: 'Loaf of Bread', price: 3.50, store: 'Sobeys' },
        ],
        economicFactors: {
            news: "Bank of Canada monitors housing market inflation closely.",
            fxTrend: "CAD fluctuating with oil prices.",
            bankingPolicy: "Stable interest rate policy expected for the next quarter."
        }
    },
    AU: {
        name: 'Australia',
        currencies: ['AUD'],
        goldSources: [
            { name: 'Perth Mint', url: '#', credibility: 'Government Mint', basePrice: 3550 }, // Price per ounce in AUD
            { name: 'ABC Bullion', url: '#', credibility: 'Private Dealer', basePrice: 3560 },
        ],
        banks: [
            { name: 'Commonwealth Bank', url: '#', rates: { '1y': 0.045, '3y': 0.041 } },
            { name: 'Westpac', url: '#', rates: { '1y': 0.046, '3y': 0.042 } },
        ],
        products: [
            { name: '2L Milk', price: 3.10, store: 'Coles' },
            { name: 'Loaf of Bread', price: 4.00, store: 'Woolworths' },
        ],
        economicFactors: {
            news: "Reserve Bank of Australia holds cash rate amid global uncertainty.",
            fxTrend: "AUD performance tied to commodity export prices.",
            bankingPolicy: "Focus on maintaining financial stability."
        }
    },
    JP: {
        name: 'Japan',
        currencies: ['JPY'],
        goldSources: [
            { name: 'Tanaka Kikinzoku', url: '#', credibility: 'Major Retailer', basePrice: 13000 }, // Price per gram in JPY
            { name: 'Mitsubishi Materials', url: '#', credibility: 'Major Corporation', basePrice: 13050 },
        ],
        banks: [
            { name: 'MUFG Bank', url: '#', rates: { '1y': 0.002, '3y': 0.005 } },
            { name: 'Sumitomo Mitsui Banking', url: '#', rates: { '1y': 0.002, '3y': 0.006 } },
        ],
        products: [
            { name: '1L Milk', price: 250, store: '7-Eleven' },
            { name: 'Loaf of Bread (Shokupan)', price: 400, store: 'Local Bakery' },
        ],
        economicFactors: {
            news: "Bank of Japan maintains ultra-low interest rate policy.",
            fxTrend: "JPY weakening against USD, impacting import costs.",
            bankingPolicy: "Continued quantitative easing to stimulate economy."
        }
    }
};

// Helper to add a small random fluctuation to a base price
const fluctuate = (price) => price * (1 + (Math.random() - 0.5) * 0.01); // +/- 0.5%

export function getGoldPrices(countryCode) {
    const countryData = countries[countryCode];
    if (!countryData) return null;

    // Simulate source status: 20% chance for any source to be offline
    const allSources = countryData.goldSources.map(source => ({
        ...source,
        status: Math.random() > 0.2 ? 'online' : 'offline',
    }));

    const onlineSourcesRaw = allSources.filter(s => s.status === 'online');

    const onlineSources = onlineSourcesRaw.map(source => {
        let price = fluctuate(source.basePrice);
        // Convert ounce to gram for US & CA
        if (countryCode === 'US' || countryCode === 'CA') {
            price = price / 28.3495 / 24 * 18; // ounce -> gram -> 18k
        }
        if (countryCode === 'AU') {
             price = price / 28.3495 / 24 * 18; // ounce -> gram -> 18k
        }
        return { ...source, price };
    });

    if (onlineSources.length === 0) {
        return { allSources, onlineSources: [], min: 0, max: 0, average: 0, lastUpdated: new Date() };
    }

    const prices = onlineSources.map(s => s.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;

    return { allSources, onlineSources, min, max, average, lastUpdated: new Date() };
}

export function getHistoricalGoldData(countryCode, interval = 'daily', currentAveragePrice) {
    // If no current price is provided, use the base price from data as a fallback.
    const basePrice = currentAveragePrice || countries[countryCode].goldSources[0].basePrice;
    const labels = [];
    const values = [];
    let pointCount, timeStep, formatOpts;

    switch (interval) {
        case 'weekly':
            pointCount = 52; // 52 weeks
            timeStep = 7 * 24 * 60 * 60 * 1000;
            formatOpts = { month: 'short', day: 'numeric' };
            break;
        case 'monthly':
            pointCount = 12; // 12 months
            timeStep = 30.44 * 24 * 60 * 60 * 1000;
            formatOpts = { month: 'short', year: 'numeric' };
            break;
        case 'daily':
        default:
            pointCount = 30; // 30 days
            timeStep = 24 * 60 * 60 * 1000;
            formatOpts = { month: 'short', day: 'numeric' };
            break;
    }

    let currentPrice = basePrice;
    for (let i = pointCount - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * timeStep);
        labels.push(date.toLocaleDateString(undefined, formatOpts));
        currentPrice *= (1 + (Math.random() - 0.5) * (interval === 'daily' ? 0.02 : 0.05));
        values.push(currentPrice);
    }

    return { labels, values };
}

export function getBankInterestRates(countryCode) {
    return countries[countryCode].banks;
}

export function getProductPrices(countryCode) {
    return countries[countryCode].products;
}

export function getLocalEconomicFactors(countryCode) {
    return countries[countryCode].economicFactors;
}