import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingBag, AlertTriangle, Plus, Download, FileText, Loader2 } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import CircularProgress from '../components/dashboard/CircularProgress';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await api.get('/vendor/dashboard');
            setData(res.data);
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.message?.includes('approved')) {
                setIsPending(true);
            } else {
                console.error('Failed to fetch vendor stats', err);
                toast.error('Failed to load dashboard statistics');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data && !isPending) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center p-8">
                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Verification Pending</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg leading-relaxed mb-8">
                    Your store request has been submitted and is currently under review by our administration team.
                </p>
                <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 max-w-sm w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Account Created</p>
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-slate-700 ml-4 mb-2"></div>
                    <div className="flex items-center gap-4 mb-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-500 font-bold text-sm">2</div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Admin Review</p>
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-slate-700 ml-4 mb-2"></div>
                    <div className="flex items-center gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-500 font-bold text-sm">3</div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Start Selling</p>
                    </div>
                </div>
                <button
                    onClick={fetchStats}
                    className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                >
                    Check Status
                </button>
            </div>
        );
    }

    const { stats, store_name } = data || {};

    return (
        <div className="space-y-8">
            {/* 1. Welcome & Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex justify-between items-end"
            >
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back, {store_name || 'Vendor'}! 🚀</h1>
                    <p className="text-blue-100 opacity-90 max-w-xl">
                        Your supply chain performance is looking strong today. You have {stats?.pendingOrders || 0} pending orders to ship.
                    </p>
                </div>
                <div className="relative z-10 hidden md:block">
                    <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition">
                        <Download className="w-4 h-4" />
                        Download Report
                    </button>
                </div>
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-12 -mt-12 pointer-events-none"></div>
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-blue-600"
                    trend="up"
                    trendValue="12.5%"
                    delay={0.1}
                />
                <StatsCard
                    title="Active Products"
                    value={stats?.totalProducts || 0}
                    icon={Package}
                    color="bg-indigo-500"
                    trend="up"
                    trendValue="Live"
                    delay={0.2}
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats?.pendingOrders || 0}
                    icon={ShoppingBag}
                    color="bg-emerald-500"
                    trend="up"
                    trendValue="Action needed"
                    delay={0.3}
                />
                <StatsCard
                    title="Low Stock Alerts"
                    value={stats?.lowStockCount || 0}
                    icon={AlertTriangle}
                    color="bg-amber-500"
                    trend="down"
                    trendValue={stats?.lowStockCount > 0 ? "Restock soon" : "Healthy"}
                    delay={0.4}
                />
            </div>

            {/* Main Visuals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Sales Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Sales Distribution</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time revenue analytics & performance</p>
                        </div>
                        <select className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-bold rounded-xl px-4 py-2 outline-none text-gray-600 dark:text-gray-300 transition-colors">
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <SalesChart />
                </motion.div>

                {/* Right: Quick Actions & Supply Health */}
                <div className="space-y-6 text-black dark:text-white">
                    {/* Supply Chain Health Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">Site Health</h3>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full font-black uppercase tracking-widest">Optimal</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <CircularProgress
                                value={stats?.pendingOrders === 0 ? 100 : 92}
                                label="Fulfillment"
                                color="text-emerald-500"
                            />
                            <CircularProgress
                                value={stats?.lowStockCount === 0 ? 100 : 85}
                                label="Inventory"
                                color="text-blue-500"
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">Support Rating</span>
                                <div className="flex gap-1.5 items-center">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <div key={star} className={`w-2.5 h-2.5 rounded-full ${star <= 4 ? 'bg-amber-400' : 'bg-gray-200 dark:bg-slate-700'}`} />
                                    ))}
                                    <span className="font-black text-gray-900 dark:text-white ml-2">4.8</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                    >
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/products/new" className="flex flex-col items-center justify-center p-5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all border border-blue-100 dark:border-blue-800/50 group relative overflow-hidden">
                                <Plus className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                                <span className="text-xs font-black uppercase tracking-tight relative z-10">Add Item</span>
                            </Link>
                            <Link to="/orders" className="flex flex-col items-center justify-center p-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all border border-emerald-100 dark:border-emerald-800/50 group relative overflow-hidden">
                                <ShoppingBag className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                                <span className="text-xs font-black uppercase tracking-tight relative z-10">Orders</span>
                            </Link>
                            <Link to="/earnings" className="flex flex-col items-center justify-center p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all border border-indigo-100 dark:border-indigo-800/50 group relative overflow-hidden">
                                <DollarSign className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                                <span className="text-xs font-black uppercase tracking-tight relative z-10">Earnings</span>
                            </Link>
                            <Link to="/inventory" className="flex flex-col items-center justify-center p-5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all border border-amber-100 dark:border-amber-800/50 group relative overflow-hidden">
                                <Package className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                                <span className="text-xs font-black uppercase tracking-tight relative z-10">Inventory</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;

