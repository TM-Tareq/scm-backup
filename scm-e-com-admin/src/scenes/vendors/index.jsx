import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Filter, ShieldCheck, ShieldAlert,
    MoreHorizontal, CheckCircle2, XCircle, AlertCircle, Clock
} from 'lucide-react';
import axios from 'axios';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        // Simulation for now - will be: axios.get('/api/admin/vendors')
        setTimeout(() => {
            setVendors([
                { id: 1, store_name: 'TechStore', fname: 'John', lname: 'Doe', status: 'pending', email: 'john@techstore.com', joined: '2026-01-15' },
                { id: 2, store_name: 'FashionHub', fname: 'Jane', lname: 'Smith', status: 'approved', email: 'jane@fashionhub.com', joined: '2026-01-12' },
                { id: 3, store_name: 'ElectroWorld', fname: 'Mike', lname: 'Johnson', status: 'rejected', email: 'mike@electroworld.com', joined: '2026-01-10' },
                { id: 4, store_name: 'GreenLife', fname: 'Sarah', lname: 'Wilson', status: 'approved', email: 'sarah@greenlife.com', joined: '2026-01-08' },
                { id: 5, store_name: 'UrbanStyle', fname: 'David', lname: 'Brown', status: 'pending', email: 'david@urbanstyle.com', joined: '2026-01-05' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleApprove = async (id) => {
        // await axios.post('/api/admin/vendors/approve', { id })
        setVendors(vendors.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    };

    const handleReject = async (id) => {
        // await axios.post('/api/admin/vendors/reject', { id })
        setVendors(vendors.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            rejected: "bg-red-100 text-red-700 border-red-200"
        };
        const icons = {
            approved: <CheckCircle2 className="w-3 h-3" />,
            pending: <Clock className="w-3 h-3" />,
            rejected: <XCircle className="w-3 h-3" />
        };

        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredVendors = vendors.filter(v => {
        const matchesSearch = v.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Vendor Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Monitor and manage all platform vendors</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        <ShieldCheck className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search vendors by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-slate-400 w-4 h-4" />
                    <select
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Vendors</option>
                        <option value="pending">Pending Only</option>
                        <option value="approved">Approved Only</option>
                        <option value="rejected">Rejected Only</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vendor Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48 mb-2"></div><div className="h-3 bg-slate-50 dark:bg-slate-800 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                            <td className="px-6 py-4 flex justify-end"><div className="h-8 bg-slate-100 rounded w-8"></div></td>
                                        </tr>
                                    ))
                                ) : filteredVendors.length > 0 ? (
                                    filteredVendors.map((vendor) => (
                                        <motion.tr
                                            key={vendor.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                        {vendor.store_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 dark:text-white">{vendor.store_name}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{vendor.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={vendor.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {new Date(vendor.joined).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {vendor.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(vendor.id)}
                                                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(vendor.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                                            No vendors found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Showing {filteredVendors.length} of {vendors.length} vendors
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-500 dark:text-slate-400 hover:bg-white dark:bg-slate-900 transition disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-500 dark:text-slate-400 hover:bg-white dark:bg-slate-900 transition disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vendors;

