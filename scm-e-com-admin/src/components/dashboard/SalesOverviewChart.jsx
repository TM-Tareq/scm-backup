import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesOverviewChart = () => {
    const data = [
        { date: 'Jan 14', revenue: 4200, orders: 45 },
        { date: 'Jan 15', revenue: 5100, orders: 58 },
        { date: 'Jan 16', revenue: 6800, orders: 72 },
        { date: 'Jan 17', revenue: 5900, orders: 64 },
        { date: 'Jan 18', revenue: 7200, orders: 81 },
        { date: 'Jan 19', revenue: 8100, orders: 89 },
        { date: 'Jan 20', revenue: 9200, orders: 95 },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{payload[0].payload.date}</p>
                    <p className="text-sm text-blue-600">Revenue: ${payload[0].value.toLocaleString()}</p>
                    <p className="text-sm text-emerald-600">Orders: {payload[0].payload.orders}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="date"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SalesOverviewChart;
