import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { DollarSign, Store, ShoppingCart, Users, TrendingUp, Download, Loader2 } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesOverviewChart from '../components/dashboard/SalesOverviewChart';
import api from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [analyticsRes, logsRes] = await Promise.all([
                api.get('/admin/analytics'),
                api.get('/admin/audit-logs')
            ]);

            setStats({
                totalRevenue: analyticsRes.data.revenue || 0,
                activeVendors: analyticsRes.data.vendors || 0,
                totalOrders: analyticsRes.data.orders || 0,
                totalUsers: analyticsRes.data.users || 0,
                totalProducts: analyticsRes.data.products || 0,
            });

            // Map audit logs to activity display format
            const mappedActivities = logsRes.data.slice(0, 5).map(log => ({
                id: log.id,
                user: `${log.fname} ${log.lname}`,
                action: log.action.replace(/_/g, ' ').toLowerCase(),
                resource: log.resource,
                time: new Date(log.created_at).toLocaleString(),
                type: log.resource.toLowerCase()
            }));
            setActivities(mappedActivities);

        } catch (err) {
            console.error('Failed to load dashboard data', err);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Connect to Socket.io
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

        socket.on('connect', () => {
            // WebSocket connected
        });

        // Real-time Order Updates
        socket.on('order:new', (data) => {
            toast.success(`New order received: $${data.totalPrice}`);
            setStats(prev => ({
                ...prev,
                totalOrders: (prev?.totalOrders || 0) + 1,
                totalRevenue: (prev?.totalRevenue || 0) + parseFloat(data.totalPrice)
            }));

            // Add to recent activity locally for instant feedback
            const newActivity = {
                id: Date.now(),
                user: data.customer || 'Customer',
                action: 'created',
                resource: 'order',
                time: new Date().toLocaleString(),
                type: 'finance'
            };
            setActivities(prev => [newActivity, ...prev].slice(0, 5));
        });

        // Real-time Shipment Updates
        socket.on('shipment:update', (data) => {
            toast(`Shipment ${data.trackingCode} is now ${data.status.replace(/_/g, ' ')}`, {
                icon: '🚚'
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

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
                    value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12.5%"
                    color="bg-blue-600"
                    delay={0.1}
                />
                <StatsCard
                    title="Active Vendors"
                    value={stats?.activeVendors || 0}
                    icon={Store}
                    trend="up"
                    trendValue="+5"
                    color="bg-emerald-600"
                    delay={0.2}
                />
                <StatsCard
                    title="Total Orders"
                    value={(stats?.totalOrders || 0).toLocaleString()}
                    icon={ShoppingCart}
                    trend="up"
                    trendValue="+8.2%"
                    color="bg-indigo-600"
                    delay={0.3}
                />
                <StatsCard
                    title="Total Users"
                    value={(stats?.totalUsers || 0).toLocaleString()}
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
                        {activities.length > 0 ? activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-800 last:border-0 last:pb-0 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'finance' ? 'bg-blue-500' :
                                    activity.type === 'vendors' ? 'bg-emerald-500' :
                                        activity.type === 'users' ? 'bg-red-500' :
                                            'bg-amber-500'
                                    }`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium capitalize">
                                        {activity.action} - {activity.resource}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                                        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <p className="text-sm text-gray-500 italic">No recent activity detected.</p>
                        )}
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
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Total Products</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{(stats?.totalProducts || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Across all categories</p>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time tracking enabled</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;

