import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';

const SalesChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/vendor/analytics');
                // Backend returns [{date: '2026-01-20', revenue: 500}, ...]
                // Map to { name: 'Jan 20', sales: 500 }
                const formatted = res.data.reverse().map(item => ({
                    name: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                    sales: parseFloat(item.revenue) || 0
                }));
                setChartData(formatted);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="h-[300px] flex items-center justify-center text-gray-400">Loading chart...</div>;
    if (chartData.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-400 italic">No sales data available yet.</div>;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#2563EB"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;

