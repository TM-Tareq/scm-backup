import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingBag, AlertTriangle, Plus, ChevronRight, Download, FileText } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import CircularProgress from '../components/dashboard/CircularProgress';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
    return (
        <div className="space-y-8">
            {/* 1. Welcome & Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex justify-between items-end"
            >
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Good Morning, TechEssentials! 🚀</h1>
                    <p className="text-blue-100 opacity-90 max-w-xl">Your supply chain performance is looking strong today. You have 5 pending orders to ship.</p>
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
                    value="$24,500"
                    icon={DollarSign}
                    color="bg-blue-600"
                    trend="up"
                    trendValue="12.5%"
                    delay={0.1}
                />
                <StatsCard
                    title="Active Products"
                    value="45"
                    icon={Package}
                    color="bg-indigo-500"
                    trend="up"
                    trendValue="2"
                    delay={0.2}
                />
                <StatsCard
                    title="Pending Orders"
                    value="12"
                    icon={ShoppingBag}
                    color="bg-emerald-500"
                    trend="up"
                    trendValue="5 new"
                    delay={0.3}
                />
                <StatsCard
                    title="Low Stock Alerts"
                    value="3"
                    icon={AlertTriangle}
                    color="bg-amber-500"
                    trend="down"
                    trendValue="Action needed"
                    delay={0.4}
                />
            </div>

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
                        <option>This Year</option>
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
                            value={94}
                            label="Fulfillment"
                            color="text-emerald-500"
                        />
                        <CircularProgress
                            value={88}
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
                                <span className="font-black text-gray-900 dark:text-white ml-2">4.2</span>
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
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-600 rounded-full blur-2xl -mr-10 -mt-10 opacity-30"></div>
                            <Plus className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                            <span className="text-xs font-black uppercase tracking-tight relative z-10">Add Item</span>
                        </Link>
                        <Link to="/orders" className="flex flex-col items-center justify-center p-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all border border-emerald-100 dark:border-emerald-800/50 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200 dark:bg-emerald-600 rounded-full blur-2xl -mr-10 -mt-10 opacity-30"></div>
                            <ShoppingBag className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                            <span className="text-xs font-black uppercase tracking-tight relative z-10">Orders</span>
                        </Link>
                        <button className="flex flex-col items-center justify-center p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all border border-indigo-100 dark:border-indigo-800/50 group relative overflow-hidden text-black">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 dark:bg-indigo-600 rounded-full blur-2xl -mr-10 -mt-10 opacity-30"></div>
                            <FileText className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                            <span className="text-xs font-black uppercase tracking-tight relative z-10">Reports</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all border border-amber-100 dark:border-amber-800/50 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200 dark:bg-amber-600 rounded-full blur-2xl -mr-10 -mt-10 opacity-30"></div>
                            <AlertTriangle className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform relative z-10" />
                            <span className="text-xs font-black uppercase tracking-tight relative z-10">Low Stock</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VendorDashboard;
