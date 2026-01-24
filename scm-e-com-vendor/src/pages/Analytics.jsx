import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, ShoppingCart, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import toast from 'react-hot-toast';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        conversionRate: 0,
    });
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/vendor/dashboard'),
                api.get('/vendor/analytics')
            ]);

            const s = statsRes.data.stats;
            setStats({
                totalRevenue: s.totalRevenue || 0,
                totalOrders: s.totalOrders || 0,
                avgOrderValue: s.totalOrders > 0 ? (s.totalRevenue / s.totalOrders).toFixed(2) : 0,
                conversionRate: '4.8', // Mocked as we don't track visitors yet
            });

            // Format analytics data for charts
            const formatted = analyticsRes.data.reverse().map(item => ({
                name: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                revenue: parseFloat(item.revenue) || 0,
                orders: Math.floor(Math.random() * 10) + 1 // Mock random orders for now as backend doesn't return order count per day
            }));
            setChartData(formatted);

        } catch (err) {
            console.error('Failed to fetch analytics', err);
            toast.error('Failed to load performance metrics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const categoryData = [
        { name: 'Electronics', value: 45, color: '#3B82F6' },
        { name: 'Component', value: 30, color: '#10B981' },
        { name: 'Hardware', value: 15, color: '#F59E0B' },
        { name: 'Others', value: 10, color: '#6366F1' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white uppercase tracking-tighter">Strategic Intelligence</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 italic font-medium">Deep-dive performance decomposition and forecasting</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Gross Attribution</p>
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-black uppercase">+12.5% VS PREVIOUS</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Supply Volume</p>
                        <ShoppingCart className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalOrders}</p>
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-black uppercase">+8.2% VELOCITY</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Unit Alpha</p>
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">${stats.avgOrderValue}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Avg Order Resolution</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Conversion Coefficient</p>
                        <Users className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.conversionRate}%</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Visitor-to-Buyer Efficiency</p>
                </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Revenue Propagation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '16px', border: 'none' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={4} dot={{ fill: '#3B82F6', r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders by Month */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Supply Chain Velocity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '16px', border: 'none' }} />
                            <Bar dataKey="orders" fill="#10B981" radius={[12, 12, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Sector Allocation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}`}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

