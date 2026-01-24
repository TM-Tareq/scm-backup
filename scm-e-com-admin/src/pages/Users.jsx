import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users as UsersIcon, Search, Filter, UserCog,
    MoreHorizontal, UserCheck, UserX, Shield, Mail, Calendar,
    TrendingUp, ExternalLink, X, ShoppingBag, DollarSign
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users/analytics');
            console.log('Users response:', response.data);
            setUsers(response.data || []);
        } catch (err) {
            console.error('Fetch users failed', err);
            toast.error(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUserHistory = async (user) => {
        setSelectedUser(user);
        setLoadingOrders(true);
        try {
            const response = await api.get(`/admin/users/${user.id}/orders`);
            setUserOrders(response.data);
        } catch (err) {
            console.error('Fetch orders failed', err);
            toast.error('Failed to load order history');
        } finally {
            setLoadingOrders(false);
        }
    };

    const RoleBadge = ({ role }) => {
        const styles = {
            admin: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
            editor: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
            vendor: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
            customer: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[role]}`}>
                {role}
            </span>
        );
    };

    const StatusBadge = ({ status }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
            }`}>
            {status}
        </span>
    );

    const filteredUsers = users.filter(u => {
        const fullName = `${u.fname} ${u.lname}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">User Intelligence</h1>
                    <p className="text-slate-500">Track user behavior, spending, and account history</p>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: users.length, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Avg Spend', value: `$${(users.reduce((acc, curr) => acc + parseFloat(curr.total_spent), 0) / (users.length || 1)).toFixed(2)}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: 'Total Revenue', value: `$${users.reduce((acc, curr) => acc + parseFloat(curr.total_spent), 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, icon: UserX, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                            <p className="text-xl font-bold dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-slate-400 w-4 h-4" />
                    <select
                        className="bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="editor">Editors</option>
                        <option value="vendor">Vendors</option>
                        <option value="customer">Customers</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Access</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Orders</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Total Spent</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-48 mb-2"></div><div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-32"></div></td>
                                            <td className="px-6 py-4 flex gap-2"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-16"></div><div className="h-6 bg-slate-50 dark:bg-slate-800 rounded-full w-16"></div></td>
                                            <td className="px-6 py-4 text-center"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-8 mx-auto"></div></td>
                                            <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 ml-auto"></div></td>
                                            <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-8 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                                    {user.image_url ? (
                                                        <img src={`http://localhost:5000/${user.image_url}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{user.fname[0]}{user.lname[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold dark:text-white">{user.fname} {user.lname}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <RoleBadge role={user.role} />
                                                <StatusBadge status={user.status} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold dark:text-white">{user.total_orders}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-black text-blue-600 dark:text-blue-400">${parseFloat(user.total_spent).toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => fetchUserHistory(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Overlay Sidebar */}
            <AnimatePresence>
                {selectedUser && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[70] p-8 overflow-y-auto transition-colors"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black dark:text-white">Purchase History</h2>
                                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition dark:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="bg-blue-600 rounded-3xl p-6 text-white mb-8 shadow-lg shadow-blue-600/30">
                                <p className="text-xs uppercase font-bold opacity-80 mb-1">Total Spent</p>
                                <h3 className="text-4xl font-black">${parseFloat(selectedUser.total_spent).toFixed(2)}</h3>
                                <div className="mt-4 flex items-center justify-between text-xs font-bold bg-white/20 p-3 rounded-xl backdrop-blur-md">
                                    <span>{selectedUser.fname} {selectedUser.lname}</span>
                                    <span>{selectedUser.role.toUpperCase()}</span>
                                </div>
                            </div>

                            <h4 className="text-lg font-bold dark:text-white mb-4">Recent Orders</h4>
                            <div className="space-y-4">
                                {loadingOrders ? (
                                    Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-50 dark:bg-slate-800 animate-pulse rounded-2xl" />)
                                ) : userOrders.length === 0 ? (
                                    <div className="text-center py-10">
                                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                                        <p className="text-gray-400">No orders found for this user.</p>
                                    </div>
                                ) : (
                                    userOrders.map((order) => (
                                        <div key={order.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 group transition-all hover:bg-white dark:hover:bg-slate-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase">Order #{order.id}</p>
                                                    <p className="text-lg font-black dark:text-white">${parseFloat(order.total_amount).toFixed(2)}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                                <span>{order.item_count} Items</span>
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
