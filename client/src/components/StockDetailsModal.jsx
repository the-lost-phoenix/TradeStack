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
            toolbar: { show: false }
        },
        title: {
            text: 'Price Movement (Last 30 Days)',
            align: 'left',
            style: { color: '#888' }
        },
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#888' } }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: { style: { colors: '#888' } }
        },
        theme: { mode: 'dark' }, // Auto-match dark mode if possible, but hardcoding dark for contrast or use logic
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#16a34a',
                    downward: '#dc2626'
                }
            }
        },
        grid: {
            borderColor: '#333'
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col md:flex-row">

                {/* LEFT: Charts */}
                <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-extrabold dark:text-white flex items-center gap-3">
                                {stock.code}
                                <span className="text-sm font-normal bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">{stock.category}</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">{stock.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-mono font-bold dark:text-white">${stock.price.toFixed(2)}</p>
                            <span className="text-green-500 text-sm font-bold">+2.4% (Today)</span>
                        </div>
                    </div>

                    <div className="h-80 w-full bg-gray-50 dark:bg-gray-700/30 rounded-xl p-2">
                        <Chart options={options} series={series} type="candlestick" height="100%" />
                    </div>
                </div>

                {/* RIGHT: Details */}
                <div className="p-6 md:w-1/3 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold dark:text-white">Market Stats</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                            <p className="text-xl font-bold dark:text-gray-200">{stock.marketCap || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Net Profit (TTM)</p>
                            <p className="text-xl font-bold dark:text-gray-200">{stock.netProfit || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">P/E Ratio</p>
                            <p className="text-xl font-bold dark:text-gray-200">{stock.peRatio || "N/A"}</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="mt-6 w-full py-3 bg-gray-200 dark:bg-gray-700 font-bold rounded-xl text-gray-700 dark:text-white hover:opacity-80 transition-opacity">
                        Close View
                    </button>
                </div>

            </div>
        </div>
    );
}

export default StockDetailsModal;
