import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    TrendingUp, TrendingDown, Users, ShoppingBag,
    DollarSign, ArrowUpRight, Calendar, Download
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const revenueData = [
        { name: 'Mon', revenue: 4500, orders: 120 },
        { name: 'Tue', revenue: 5200, orders: 145 },
        { name: 'Wed', revenue: 4800, orders: 132 },
        { name: 'Thu', revenue: 6100, orders: 168 },
        { name: 'Fri', revenue: 5900, orders: 155 },
        { name: 'Sat', revenue: 7800, orders: 210 },
        { name: 'Sun', revenue: 7200, orders: 195 },
    ];

    const vendorPerformance = [
        { name: 'TechStore', sales: 4200 },
        { name: 'FashionHub', sales: 3800 },
        { name: 'ElectroWorld', sales: 3100 },
        { name: 'GreenLife', sales: 2900 },
        { name: 'UrbanStyle', sales: 2400 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/analytics');
                setStats(res.data);
            } catch (err) {
                toast.error('Failed to load real-time analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ label, value, trend, icon: Icon, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors"
        >
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
                    <span className={`text-xs font-bold flex items-center ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                        {trend > 0 ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <TrendingDown className="w-3 h-3 ml-0.5" />}
                    </span>
                </div>
            </div>
            <div className={`p-4 rounded-xl ${color} bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon className="w-6 h-6" />
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Advanced Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Comprehensive platform performance insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
                        <Calendar className="w-4 h-4" />
                        Last 7 Days
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium">
                        <Download className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value={loading ? '...' : `$${Number(stats?.revenue || 0).toLocaleString()}`}
                    trend={stats?.trends?.revenue || 0}
                    icon={DollarSign}
                    color="text-indigo-600"
                    delay={0.1}
                />
                <StatCard
                    label="Total Orders"
                    value={loading ? '...' : stats?.orders?.toLocaleString()}
                    trend={stats?.trends?.orders || 0}
                    icon={ShoppingBag}
                    color="text-blue-600"
                    delay={0.2}
                />
                <StatCard
                    label="Active Vendors"
                    value={loading ? '...' : stats?.vendors?.toLocaleString()}
                    trend={stats?.trends?.vendors || 0}
                    icon={TrendingUp}
                    color="text-emerald-600"
                    delay={0.3}
                />
                <StatCard
                    label="Registered Users"
                    value={loading ? '...' : stats?.users?.toLocaleString()}
                    trend={stats?.trends?.users || 0}
                    icon={Users}
                    color="text-amber-600"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Growth */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white">Revenue & Orders Growth</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Revenue
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Orders
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Vendors */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors"
                >
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Top Performing Vendors</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vendorPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm col-span-1 transition-colors">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">Device Traffic</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Mobile App', value: '45%', color: 'bg-indigo-500' },
                            { label: 'Web Browser', value: '38%', color: 'bg-blue-500' },
                            { label: 'Tablet', value: '17%', color: 'bg-slate-300' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
                                    <span className="text-slate-800 dark:text-white font-bold">{item.value}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: item.value }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm col-span-2 transition-colors">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">Growth Breakdown</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Customer Acquisition</p>
                            <div className="flex items-center gap-3">
                                <h4 className="text-3xl font-bold text-slate-800 dark:text-white">2,450</h4>
                                <span className="text-emerald-500 dark:text-emerald-400 text-sm font-bold flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                    +12% <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Growth over last 30 days</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Vendor Retention</p>
                            <div className="flex items-center gap-3">
                                <h4 className="text-3xl font-bold text-slate-800 dark:text-white">94.2%</h4>
                                <span className="text-emerald-500 dark:text-emerald-400 text-sm font-bold flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                    +0.5% <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Retention rate (Monthly)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
