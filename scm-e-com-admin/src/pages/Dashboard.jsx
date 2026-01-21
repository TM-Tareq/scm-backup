import { motion } from 'framer-motion';
import { DollarSign, Store, ShoppingCart, Users, TrendingUp, Download } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesOverviewChart from '../components/dashboard/SalesOverviewChart';

const Dashboard = () => {
    // Mock data - will be replaced with API calls
    const stats = {
        totalRevenue: 124500,
        activeVendors: 45,
        totalOrders: 1234,
        totalUsers: 5678,
    };

    const recentActivities = [
        { id: 1, user: 'Admin', action: 'Approved vendor TechStore', time: '5 min ago', type: 'vendor' },
        { id: 2, user: 'Editor John', action: 'Updated FAQ #12', time: '12 min ago', type: 'content' },
        { id: 3, user: 'Admin', action: 'Set commission rate to 8%', time: '1 hour ago', type: 'finance' },
        { id: 4, user: 'Editor Sarah', action: 'Suspended user @badactor', time: '2 hours ago', type: 'moderation' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden shadow-xl"
            >
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                        <p className="text-blue-100 opacity-90">
                            Here's what's happening with your platform today
                        </p>
                    </div>
                    <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition">
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12.5%"
                    color="bg-blue-600"
                    delay={0.1}
                />
                <StatsCard
                    title="Active Vendors"
                    value={stats.activeVendors}
                    icon={Store}
                    trend="up"
                    trendValue="+5"
                    color="bg-emerald-600"
                    delay={0.2}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    icon={ShoppingCart}
                    trend="up"
                    trendValue="+8.2%"
                    color="bg-indigo-600"
                    delay={0.3}
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="up"
                    trendValue="+15.3%"
                    color="bg-amber-600"
                    delay={0.4}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Overview - Takes 2 columns */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sales Overview</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue performance over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">+12.5%</span>
                        </div>
                    </div>
                    <SalesOverviewChart />
                </motion.div>

                {/* Recent Activity - Takes 1 column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-800 last:border-0 last:pb-0 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'finance' ? 'bg-blue-500' :
                                        activity.type === 'vendor' ? 'bg-emerald-500' :
                                            activity.type === 'moderation' ? 'bg-red-500' :
                                                'bg-amber-500'
                                    }`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{activity.action}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                                        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Pending Payouts</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">$12,450</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To 8 vendors</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Commission Rate</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">8.0%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current platform fee</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Active Carriers</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">5</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">FedEx, DHL, UPS, USPS, Local</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
