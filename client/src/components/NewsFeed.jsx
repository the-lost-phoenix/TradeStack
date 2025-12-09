import React, { useEffect, useState } from 'react';

function NewsFeed({ news, stocks }) {
    // We can also fetch initial news here if needed, but App.jsx might pass it down or we rely on socket updates
    // For now, we assume 'news' prop is the list passed from App

    const getStockInfo = (code) => stocks.find(s => s.code === code);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                AI Market Insights
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full uppercase font-extrabold tracking-wider animate-pulse">Live</span>
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {news.length === 0 ? (
                    <div className="text-gray-400 text-center py-8 italic text-sm">
                        Waiting for market news...
                    </div>
                ) : (
                    news.map((item) => {
                        const stock = getStockInfo(item.stockCode);
                        const isPositive = item.sentiment === 'Positive';
                        const isNegative = item.sentiment === 'Negative';

                        return (
                            <div key={item.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {stock?.logo && <img src={stock.logo} alt={item.stockCode} className="w-5 h-5 rounded-full object-contain bg-white" />}
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.stockCode}</span>
                                        <span className="text-[10px] text-gray-400">• {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${isPositive ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                            isNegative ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                                'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {item.sentiment.toUpperCase()}
                                    </span>
                                </div>

                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                                    {item.headline}
                                </h4>

                                <div className="mt-2 flex items-center gap-2 p-2 rounded bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                                    <span className="text-lg">🤖</span>
                                    <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                                        {item.summary}
                                        {item.score !== 0 && (
                                            <span className={`ml-1 font-bold ${item.score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                (Predicted Impact: {item.score > 0 ? '+' : ''}{(item.score * 100).toFixed(1)}%)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default NewsFeed;
