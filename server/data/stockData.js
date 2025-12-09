export const INITIAL_STOCKS = [
    // Tech
    { code: "GOOG", name: "Alphabet Inc.", price: 150.00, category: "Tech", marketCap: "1.9T", netProfit: "74B", peRatio: 24.5, logo: "https://www.google.com/s2/favicons?domain=google.com&sz=128" },
    { code: "TSLA", name: "Tesla Inc.", price: 220.00, category: "Auto", marketCap: "800B", netProfit: "12B", peRatio: 70.1, logo: "https://www.google.com/s2/favicons?domain=tesla.com&sz=128" },
    { code: "AMZN", name: "Amazon.com", price: 130.00, category: "Tech", marketCap: "1.6T", netProfit: "30B", peRatio: 55.2, logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=128" },
    { code: "META", name: "Meta Platforms", price: 300.00, category: "Tech", marketCap: "900B", netProfit: "35B", peRatio: 28.4, logo: "https://www.google.com/s2/favicons?domain=meta.com&sz=128" },
    { code: "NVDA", name: "NVIDIA Corp", price: 450.00, category: "Tech", marketCap: "1.2T", netProfit: "28B", peRatio: 110.0, logo: "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128" },
    { code: "AAPL", name: "Apple Inc.", price: 175.00, category: "Tech", marketCap: "2.8T", netProfit: "97B", peRatio: 29.8, logo: "https://www.google.com/s2/favicons?domain=apple.com&sz=128" },
    { code: "MSFT", name: "Microsoft Corp", price: 330.00, category: "Tech", marketCap: "2.5T", netProfit: "72B", peRatio: 32.1, logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128" },
    { code: "NFLX", name: "Netflix Inc.", price: 400.00, category: "Media", marketCap: "200B", netProfit: "5B", peRatio: 45.6, logo: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128" },
    { code: "AMD", name: "Adv Micro Devices", price: 110.00, category: "Tech", marketCap: "180B", netProfit: "2B", peRatio: 38.5, logo: "https://www.google.com/s2/favicons?domain=amd.com&sz=128" },
    { code: "INTC", name: "Intel Corp", price: 35.00, category: "Tech", marketCap: "150B", netProfit: "8B", peRatio: 15.2, logo: "https://www.google.com/s2/favicons?domain=intel.com&sz=128" },

    // Finance
    { code: "JPM", name: "JPMorgan Chase", price: 150.00, category: "Finance", marketCap: "430B", netProfit: "48B", peRatio: 10.5, logo: "https://www.google.com/s2/favicons?domain=jpmorganchase.com&sz=128" },
    { code: "BAC", name: "Bank of America", price: 28.00, category: "Finance", marketCap: "230B", netProfit: "25B", peRatio: 9.8, logo: "https://www.google.com/s2/favicons?domain=bankofamerica.com&sz=128" },
    { code: "V", name: "Visa Inc.", price: 240.00, category: "Finance", marketCap: "500B", netProfit: "18B", peRatio: 30.2, logo: "https://www.google.com/s2/favicons?domain=visa.com&sz=128" },
    { code: "GS", name: "Goldman Sachs", price: 320.00, category: "Finance", marketCap: "110B", netProfit: "11B", peRatio: 12.8, logo: "https://www.google.com/s2/favicons?domain=goldmansachs.com&sz=128" },
    { code: "BLK", name: "BlackRock", price: 680.00, category: "Finance", marketCap: "100B", netProfit: "5B", peRatio: 19.5, logo: "https://www.google.com/s2/favicons?domain=blackrock.com&sz=128" },

    // Retail & Consumer
    { code: "WMT", name: "Walmart", price: 160.00, category: "Retail", marketCap: "450B", netProfit: "14B", peRatio: 30.5, logo: "https://www.google.com/s2/favicons?domain=walmart.com&sz=128" },
    { code: "TGT", name: "Target Corp", price: 110.00, category: "Retail", marketCap: "60B", netProfit: "3B", peRatio: 20.1, logo: "https://www.google.com/s2/favicons?domain=target.com&sz=128" },
    { code: "KO", name: "Coca-Cola", price: 58.00, category: "Consumer", marketCap: "250B", netProfit: "10B", peRatio: 24.2, logo: "https://www.google.com/s2/favicons?domain=coca-cola.com&sz=128" },
    { code: "PEP", name: "PepsiCo", price: 170.00, category: "Consumer", marketCap: "230B", netProfit: "8B", peRatio: 26.5, logo: "https://www.google.com/s2/favicons?domain=pepsico.com&sz=128" },
    { code: "MCD", name: "McDonald's", price: 280.00, category: "Consumer", marketCap: "200B", netProfit: "7B", peRatio: 28.1, logo: "https://www.google.com/s2/favicons?domain=mcdonalds.com&sz=128" },
    { code: "SBUX", name: "Starbucks", price: 95.00, category: "Consumer", marketCap: "110B", netProfit: "4B", peRatio: 25.8, logo: "https://www.google.com/s2/favicons?domain=starbucks.com&sz=128" },
    { code: "NKE", name: "Nike Inc.", price: 100.00, category: "Consumer", marketCap: "150B", netProfit: "5B", peRatio: 32.4, logo: "https://www.google.com/s2/favicons?domain=nike.com&sz=128" },

    // Auto & Ind
    { code: "F", name: "Ford Motor", price: 12.00, category: "Auto", marketCap: "48B", netProfit: "3B", peRatio: 11.2, logo: "https://www.google.com/s2/favicons?domain=ford.com&sz=128" },
    { code: "GM", name: "General Motors", price: 32.00, category: "Auto", marketCap: "45B", netProfit: "6B", peRatio: 7.5, logo: "https://www.google.com/s2/favicons?domain=gm.com&sz=128" },
    { code: "BA", name: "Boeing", price: 190.00, category: "Industrial", marketCap: "115B", netProfit: "-2B", peRatio: "N/A", logo: "https://www.google.com/s2/favicons?domain=boeing.com&sz=128" },
    { code: "GE", name: "General Electric", price: 110.00, category: "Industrial", marketCap: "120B", netProfit: "4B", peRatio: 40.2, logo: "https://www.google.com/s2/favicons?domain=ge.com&sz=128" },

    // Energy
    { code: "XOM", name: "Exxon Mobil", price: 110.00, category: "Energy", marketCap: "440B", netProfit: "36B", peRatio: 11.5, logo: "https://www.google.com/s2/favicons?domain=exxonmobil.com&sz=128" },
    { code: "CVX", name: "Chevron", price: 160.00, category: "Energy", marketCap: "300B", netProfit: "28B", peRatio: 10.8, logo: "https://www.google.com/s2/favicons?domain=chevron.com&sz=128" },
    { code: "SHEL", name: "Shell PLC", price: 65.00, category: "Energy", marketCap: "210B", netProfit: "20B", peRatio: 9.3, logo: "https://www.google.com/s2/favicons?domain=shell.com&sz=128" },

    // Real Estate
    { code: "PLD", name: "Prologis", price: 110.00, category: "Real Estate", marketCap: "100B", netProfit: "3B", peRatio: 35.6, logo: "https://www.google.com/s2/favicons?domain=prologis.com&sz=128" },
    { code: "O", name: "Realty Income", price: 55.00, category: "Real Estate", marketCap: "38B", netProfit: "1.5B", peRatio: 42.1, logo: "https://www.google.com/s2/favicons?domain=realtyincome.com&sz=128" }
];