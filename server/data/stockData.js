export const INITIAL_STOCKS = [
    // Tech
    { code: "GOOG", name: "Alphabet Inc.", price: 150.00, category: "Tech", marketCap: "1.9T", netProfit: "74B", peRatio: 24.5, logo: "https://logo.clearbit.com/google.com" },
    { code: "TSLA", name: "Tesla Inc.", price: 220.00, category: "Auto", marketCap: "800B", netProfit: "12B", peRatio: 70.1, logo: "https://logo.clearbit.com/tesla.com" },
    { code: "AMZN", name: "Amazon.com", price: 130.00, category: "Tech", marketCap: "1.6T", netProfit: "30B", peRatio: 55.2, logo: "https://logo.clearbit.com/amazon.com" },
    { code: "META", name: "Meta Platforms", price: 300.00, category: "Tech", marketCap: "900B", netProfit: "35B", peRatio: 28.4, logo: "https://logo.clearbit.com/meta.com" },
    { code: "NVDA", name: "NVIDIA Corp", price: 450.00, category: "Tech", marketCap: "1.2T", netProfit: "28B", peRatio: 110.0, logo: "https://logo.clearbit.com/nvidia.com" },
    { code: "AAPL", name: "Apple Inc.", price: 175.00, category: "Tech", marketCap: "2.8T", netProfit: "97B", peRatio: 29.8, logo: "https://logo.clearbit.com/apple.com" },
    { code: "MSFT", name: "Microsoft Corp", price: 330.00, category: "Tech", marketCap: "2.5T", netProfit: "72B", peRatio: 32.1, logo: "https://logo.clearbit.com/microsoft.com" },
    { code: "NFLX", name: "Netflix Inc.", price: 400.00, category: "Media", marketCap: "200B", netProfit: "5B", peRatio: 45.6, logo: "https://logo.clearbit.com/netflix.com" },
    { code: "AMD", name: "Adv Micro Devices", price: 110.00, category: "Tech", marketCap: "180B", netProfit: "2B", peRatio: 38.5, logo: "https://logo.clearbit.com/amd.com" },
    { code: "INTC", name: "Intel Corp", price: 35.00, category: "Tech", marketCap: "150B", netProfit: "8B", peRatio: 15.2, logo: "https://logo.clearbit.com/intel.com" },

    // Finance
    { code: "JPM", name: "JPMorgan Chase", price: 150.00, category: "Finance", marketCap: "430B", netProfit: "48B", peRatio: 10.5, logo: "https://logo.clearbit.com/jpmorganchase.com" },
    { code: "BAC", name: "Bank of America", price: 28.00, category: "Finance", marketCap: "230B", netProfit: "25B", peRatio: 9.8, logo: "https://logo.clearbit.com/bankofamerica.com" },
    { code: "V", name: "Visa Inc.", price: 240.00, category: "Finance", marketCap: "500B", netProfit: "18B", peRatio: 30.2, logo: "https://logo.clearbit.com/visa.com" },
    { code: "GS", name: "Goldman Sachs", price: 320.00, category: "Finance", marketCap: "110B", netProfit: "11B", peRatio: 12.8, logo: "https://logo.clearbit.com/goldmansachs.com" },
    { code: "BLK", name: "BlackRock", price: 680.00, category: "Finance", marketCap: "100B", netProfit: "5B", peRatio: 19.5, logo: "https://logo.clearbit.com/blackrock.com" },

    // Retail & Consumer
    { code: "WMT", name: "Walmart", price: 160.00, category: "Retail", marketCap: "450B", netProfit: "14B", peRatio: 30.5, logo: "https://logo.clearbit.com/walmart.com" },
    { code: "TGT", name: "Target Corp", price: 110.00, category: "Retail", marketCap: "60B", netProfit: "3B", peRatio: 20.1, logo: "https://logo.clearbit.com/target.com" },
    { code: "KO", name: "Coca-Cola", price: 58.00, category: "Consumer", marketCap: "250B", netProfit: "10B", peRatio: 24.2, logo: "https://logo.clearbit.com/coca-cola.com" },
    { code: "PEP", name: "PepsiCo", price: 170.00, category: "Consumer", marketCap: "230B", netProfit: "8B", peRatio: 26.5, logo: "https://logo.clearbit.com/pepsico.com" },
    { code: "MCD", name: "McDonald's", price: 280.00, category: "Consumer", marketCap: "200B", netProfit: "7B", peRatio: 28.1, logo: "https://logo.clearbit.com/mcdonalds.com" },
    { code: "SBUX", name: "Starbucks", price: 95.00, category: "Consumer", marketCap: "110B", netProfit: "4B", peRatio: 25.8, logo: "https://logo.clearbit.com/starbucks.com" },
    { code: "NKE", name: "Nike Inc.", price: 100.00, category: "Consumer", marketCap: "150B", netProfit: "5B", peRatio: 32.4, logo: "https://logo.clearbit.com/nike.com" },

    // Auto & Ind
    { code: "F", name: "Ford Motor", price: 12.00, category: "Auto", marketCap: "48B", netProfit: "3B", peRatio: 11.2, logo: "https://logo.clearbit.com/ford.com" },
    { code: "GM", name: "General Motors", price: 32.00, category: "Auto", marketCap: "45B", netProfit: "6B", peRatio: 7.5, logo: "https://logo.clearbit.com/gm.com" },
    { code: "BA", name: "Boeing", price: 190.00, category: "Industrial", marketCap: "115B", netProfit: "-2B", peRatio: "N/A", logo: "https://logo.clearbit.com/boeing.com" },
    { code: "GE", name: "General Electric", price: 110.00, category: "Industrial", marketCap: "120B", netProfit: "4B", peRatio: 40.2, logo: "https://logo.clearbit.com/ge.com" },

    // Energy
    { code: "XOM", name: "Exxon Mobil", price: 110.00, category: "Energy", marketCap: "440B", netProfit: "36B", peRatio: 11.5, logo: "https://logo.clearbit.com/exxonmobil.com" },
    { code: "CVX", name: "Chevron", price: 160.00, category: "Energy", marketCap: "300B", netProfit: "28B", peRatio: 10.8, logo: "https://logo.clearbit.com/chevron.com" },
    { code: "SHEL", name: "Shell PLC", price: 65.00, category: "Energy", marketCap: "210B", netProfit: "20B", peRatio: 9.3, logo: "https://logo.clearbit.com/shell.com" },

    // Real Estate
    { code: "PLD", name: "Prologis", price: 110.00, category: "Real Estate", marketCap: "100B", netProfit: "3B", peRatio: 35.6, logo: "https://logo.clearbit.com/prologis.com" },
    { code: "O", name: "Realty Income", price: 55.00, category: "Real Estate", marketCap: "38B", netProfit: "1.5B", peRatio: 42.1, logo: "https://logo.clearbit.com/realtyincome.com" }
];