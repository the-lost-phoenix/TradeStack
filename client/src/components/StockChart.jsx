import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

function StockChart({ data, color }) {
    // data is an array like: [{ price: 150 }, { price: 152 }, ...]

    return (
        <div className="h-16 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    {/* Hide the axis but keep the scale auto-adjusting */}
                    <YAxis domain={['auto', 'auto']} hide />

                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={color || "#3B82F6"} // Default Blue, or passed color
                        strokeWidth={2}
                        dot={false} // Hide the dots, just show the line
                        isAnimationActive={false} // Disable heavy animation for performance
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StockChart;