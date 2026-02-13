import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';

function StockChart({ data, color }) {
    // data is an array like: [{ price: 150 }, { price: 152 }, ...]

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <YAxis
                        domain={['auto', 'auto']}
                        hide
                    />
                    <XAxis dataKey="time" hide />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#050505',
                            borderColor: color || '#fca311',
                            borderRadius: '0px',
                            boxShadow: `0 0 10px ${color || '#fca311'}40`,
                            color: '#e5e5e5',
                            fontFamily: 'Rajdhani',
                            textTransform: 'uppercase'
                        }}
                        itemStyle={{ color: color || '#fca311' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value) => [`$${value.toFixed(2)}`, 'PRICE']}
                    />

                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={color || "#fca311"} // Solar Flare default
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#050505', stroke: color || "#fca311", strokeWidth: 2 }}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StockChart;