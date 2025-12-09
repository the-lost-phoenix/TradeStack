import { INITIAL_STOCKS } from '../data/stockData.js';

const TEMPLATES = {
    Tech: [
        { text: "{company} unveils revolutionary AI chip, promising 50% faster processing.", sentiment: "Positive", score: 0.05 },
        { text: "{company} faces antitrust lawsuit over market dominance.", sentiment: "Negative", score: -0.04 },
        { text: "{company} announces partnership with major cloud provider.", sentiment: "Positive", score: 0.03 },
        { text: "Data breach compromise reported at {company}, millions of users affected.", sentiment: "Negative", score: -0.06 },
        { text: "{company} quarterly earnings beat expectations by 15%.", sentiment: "Positive", score: 0.04 },
        { text: "Supply chain issues delay {company}'s flagship product launch.", sentiment: "Negative", score: -0.03 }
    ],
    Finance: [
        { text: "{company} reports record profits in investment banking division.", sentiment: "Positive", score: 0.04 },
        { text: "Regulatory body investigates {company} for trading irregularities.", sentiment: "Negative", score: -0.05 },
        { text: "{company} raises dividend payout for shareholders.", sentiment: "Positive", score: 0.03 },
        { text: "Global economic slowdown impacts {company}'s lending growth.", sentiment: "Negative", score: -0.03 }
    ],
    Auto: [
        { text: "{company} recalls 50,000 vehicles due to safety concerns.", sentiment: "Negative", score: -0.05 },
        { text: "{company} launches new electric vehicle model to rave reviews.", sentiment: "Positive", score: 0.06 },
        { text: "{company} opens new gigafactory ahead of schedule.", sentiment: "Positive", score: 0.04 }
    ],
    General: [
        { text: "{company} CEO steps down unexpectedly.", sentiment: "Negative", score: -0.04 },
        { text: "Analysts upgrade {company} to 'Buy' rating.", sentiment: "Positive", score: 0.03 },
        { text: "{company} announces massive stock buyback program.", sentiment: "Positive", score: 0.04 }
    ]
};

export const generateNews = () => {
    // 1. Pick a random stock
    const stock = INITIAL_STOCKS[Math.floor(Math.random() * INITIAL_STOCKS.length)];

    // 2. Pick a template based on category
    const categoryTemplates = TEMPLATES[stock.category] || TEMPLATES.General;
    // Mix in some general news occasionally
    const templates = Math.random() > 0.7 ? TEMPLATES.General : categoryTemplates;

    const template = templates[Math.floor(Math.random() * templates.length)];

    // 3. Construct the news object
    return {
        id: Date.now(),
        stockCode: stock.code,
        headline: template.text.replace("{company}", stock.name),
        summary: `AI Sentiment Analysis indicates a ${template.sentiment.toLowerCase()} market reaction.`,
        sentiment: template.sentiment,
        score: template.score, // This is the 'momentum' impact on price
        timestamp: new Date().toISOString()
    };
};
