import React, { useEffect, useState } from 'react';

function NewsFeed({ news, stocks }) {
    // We can also fetch initial news here if needed, but App.jsx might pass it down or we rely on socket updates
    // For now, we assume 'news' prop is the list passed from App

    const getStockInfo = (code) => stocks.find(s => s.code === code);

    return (
        <div className="bg-deep-space/30 rounded-none p-6 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)] h-full flex flex-col clip-path-polygon" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
            <h2 className="text-xl font-orbitron font-bold text-starlight mb-6 flex items-center gap-3 border-b border-white/5 pb-2">
                <span className="w-1 h-6 bg-solar-flare shadow-[0_0_10px_#fca311]"></span>
                Market Intel
                <span className="text-[10px] bg-solar-flare/10 border border-solar-flare/30 text-solar-flare px-2 py-0.5 font-rajdhani uppercase font-bold tracking-widest animate-pulse ml-auto shadow-[0_0_10px_rgba(252,163,17,0.2)]">Live Feed</span>
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {news.length === 0 ? (
                    <div className="text-starlight/30 text-center py-8 italic text-xs font-rajdhani uppercase tracking-widest">
                        Scanning for market data...
                    </div>
                ) : (
                    news.map((item) => {
                        const stock = getStockInfo(item.stockCode);
                        const isPositive = item.sentiment === 'Positive';
                        const isNegative = item.sentiment === 'Negative';

                        return (
                            <div key={item.id} className="group p-4 bg-space-black/50 border border-white/5 hover:border-solar-flare/30 transition-all hover:bg-white/5 relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent"></div>

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold font-orbitron text-solar-flare">{item.stockCode}</span>
                                        <span className="text-[10px] text-starlight/30 font-mono tracking-tighter">[{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                    </div>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest border ${isPositive ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                        isNegative ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                            'bg-white/5 text-starlight/50 border-white/10'
                                        }`}>
                                        {item.sentiment.toUpperCase()}
                                    </span>
                                </div>

                                <h4 className="text-sm font-bold text-starlight/90 mb-2 leading-snug font-rajdhani group-hover:text-white transition-colors">
                                    {item.headline}
                                </h4>

                                <div className="mt-2 flex items-start gap-2 p-3 bg-deep-space/50 border border-white/5">
                                    <span className="text-lg opacity-50">📡</span>
                                    <div>
                                        <p className="text-xs text-starlight/70 font-rajdhani leading-relaxed">
                                            {item.summary}
                                        </p>
                                        {item.score !== 0 && (
                                            <p className={`mt-1 text-[10px] font-mono ${item.score > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                IMPCT: {item.score > 0 ? '+' : ''}{(item.score * 100).toFixed(1)}%
                                            </p>
                                        )}
                                    </div>
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
