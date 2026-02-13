import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

function StockDetailsModal({ stock, isOpen, onClose }) {
    if (!isOpen || !stock) return null;

    // Generate Mock Candle Data based on current price
    const series = useMemo(() => {
        const data = [];
        let currentPrice = stock.price;
        const now = new Date().getTime();

        // Generate 30 points (last 30 minutes/days) backwards
        for (let i = 29; i >= 0; i--) {
            // Random volatility
            const open = currentPrice * (1 + (Math.random() * 0.04 - 0.02));
            const close = currentPrice;
            const high = Math.max(open, close) * (1 + Math.random() * 0.01);
            const low = Math.min(open, close) * (1 - Math.random() * 0.01);

            data.push({
                x: new Date(now - i * 60000), // 1 minute intervals
                y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)]
            });

            // Update price for next iteration (backwards logic adjustment: actually we should go forwards or just random walk)
            // Let's just random walk from a starting point to the current price
            currentPrice = open;
        }
        // Reverse to chronological order (actually my loop logic was "i ago", but data.push appends, so it's chronologically correct if I adjust logic. 
        // Let's redo: Start from Base, walk to Current.

        const basePrice = stock.price * 0.9; // 10% lower start
        const seriesData = [];
        let price = basePrice;

        for (let i = 0; i < 30; i++) {
            const volatility = 0.02;
            const open = price;
            const close = price * (1 + (Math.random() * volatility * 2 - volatility));
            const high = Math.max(open, close) + Math.random();
            const low = Math.min(open, close) - Math.random();

            seriesData.push({
                x: new Date(now - (29 - i) * 60000 * 60 * 24), // Daily candles simulated
                y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)]
            });
            price = close;
        }
        // Force the last candle to be close to current price
        seriesData[seriesData.length - 1].y[3] = stock.price.toFixed(2);

        return [{ data: seriesData }];
    }, [stock]);

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            fontFamily: 'Rajdhani, sans-serif'
        },
        title: {
            text: 'PRICE HISTORY [30D]',
            align: 'left',
            style: { color: '#ffffff50', fontSize: '12px', fontFamily: 'Orbitron', letterSpacing: '2px' }
        },
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#ffffff50', fontFamily: 'Rajdhani' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: { style: { colors: '#ffffff50', fontFamily: 'Rajdhani' } }
        },
        theme: { mode: 'dark', palette: 'palette1' },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#4ade80',
                    downward: '#ef4444'
                },
                wick: { useFillColor: true }
            }
        },
        grid: {
            borderColor: '#ffffff10',
            strokeDashArray: 2
        },
        tooltip: {
            theme: 'dark',
            style: { fontFamily: 'Rajdhani' },
            x: { format: 'dd MMM HH:mm' }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-deep-space rounded-none w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-[0_0_50px_rgba(20,33,61,0.5)] flex flex-col md:flex-row clip-path-polygon" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>

                {/* Decorative border line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-solar-flare to-transparent opacity-50"></div>

                {/* LEFT: Charts */}
                <div className="p-8 md:w-3/4 border-b md:border-b-0 md:border-r border-white/5 bg-space-black/50">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-4xl font-black font-orbitron text-starlight flex items-center gap-3 uppercase tracking-wider">
                                {stock.code}
                                <span className="text-xs font-bold border border-white/20 px-2 py-1 text-starlight/50 font-rajdhani">{stock.category}</span>
                            </h2>
                            <p className="text-starlight/40 font-rajdhani uppercase tracking-widest text-sm mt-1">{stock.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-mono font-bold text-starlight tracking-tighter drop-shadow-lg">${stock.price.toFixed(2)}</p>
                            <span className="text-green-400 text-sm font-bold font-rajdhani tracking-wider">+2.4% (CYCLE)</span>
                        </div>
                    </div>

                    <div className="h-96 w-full bg-deep-space/30 border border-white/5 p-4 relative backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-2 text-[10px] text-white/20 font-mono">LIVE FEED CONNECTED</div>
                        <Chart options={options} series={series} type="candlestick" height="100%" />
                    </div>
                </div>

                {/* RIGHT: Details */}
                <div className="p-8 md:w-1/4 flex flex-col bg-deep-space">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-bold font-orbitron text-starlight uppercase tracking-widest border-l-2 border-solar-flare pl-3">Asset Data</h3>
                        <button onClick={onClose} className="text-starlight/30 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="bg-white/5 p-4 border border-white/5 hover:border-solar-flare/30 transition-all group">
                            <p className="text-[10px] uppercase font-bold text-starlight/40 tracking-widest font-rajdhani mb-1">Market Cap</p>
                            <p className="text-xl font-bold font-orbitron text-starlight group-hover:text-solar-flare transition-colors">{stock.marketCap || "N/A"}</p>
                        </div>
                        <div className="bg-white/5 p-4 border border-white/5 hover:border-green-500/30 transition-all group">
                            <p className="text-[10px] uppercase font-bold text-starlight/40 tracking-widest font-rajdhani mb-1">Net Yield (TTM)</p>
                            <p className="text-xl font-bold font-orbitron text-starlight group-hover:text-green-400 transition-colors">{stock.netProfit || "N/A"}</p>
                        </div>
                        <div className="bg-white/5 p-4 border border-white/5 hover:border-blue-500/30 transition-all group">
                            <p className="text-[10px] uppercase font-bold text-starlight/40 tracking-widest font-rajdhani mb-1">P/E Ratio</p>
                            <p className="text-xl font-bold font-orbitron text-starlight group-hover:text-blue-400 transition-colors">{stock.peRatio || "N/A"}</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="mt-8 w-full py-4 border border-white/10 text-starlight/60 font-bold uppercase tracking-widest text-xs font-orbitron hover:bg-white hover:text-space-black transition-all">
                        Terminate View
                    </button>
                </div>

            </div>
        </div>
    );
}

export default StockDetailsModal;
