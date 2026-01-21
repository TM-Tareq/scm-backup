import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard as CardIcon, ArrowUpRight as ArrowIcon, Clock as ClockIcon,
    CheckCircle2 as CheckIcon, XCircle as XIcon, Search as SearchIcon,
    Filter as FilterIcon, ExternalLink as LinkIcon, MoreVertical as DotsIcon
} from 'lucide-react';

const Payouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        // Mock data
        setTimeout(() => {
            setPayouts([
                { id: 1, vendor: 'TechStore', amount: 1250.00, commission: 125.00, status: 'pending', period: 'Jan 1 - Jan 15', created_at: '2026-01-16' },
                { id: 2, vendor: 'FashionHub', amount: 840.50, commission: 84.05, status: 'paid', period: 'Jan 1 - Jan 15', created_at: '2026-01-16', paid_at: '2026-01-17' },
                { id: 3, vendor: 'ElectroWorld', amount: 3200.00, commission: 320.00, status: 'pending', period: 'Jan 1 - Jan 15', created_at: '2026-01-16' },
                { id: 4, vendor: 'GreenLife', amount: 150.25, commission: 15.03, status: 'cancelled', period: 'Dec 15 - Dec 31', created_at: '2026-01-01' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const StatusBadge = ({ status }) => {
        const styles = {
            paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            cancelled: "bg-slate-100 text-slate-700 border-slate-200 dark:border-slate-700"
        };
        const icons = {
            paid: <CheckIcon className="w-3.5 h-3.5" />,
            pending: <ClockIcon className="w-3.5 h-3.5" />,
            cancelled: <XIcon className="w-3.5 h-3.5" />
        };
        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Vendor Payouts</h1>
                    <p className="text-slate-500 dark:text-slate-400">Review and process vendor settlements</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/50 transition shadow-sm font-medium">
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium">
                        Process Batch
                    </button>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Outstanding', value: '$4,450.00', color: 'text-amber-600', icon: ClockIcon, bg: 'bg-amber-50' },
                    { label: 'Total Paid (Jan)', value: '$12,840.50', color: 'text-emerald-600', icon: CheckIcon, bg: 'bg-emerald-50' },
                    { label: 'Service Fees Earned', value: '$1,284.05', color: 'text-indigo-600', icon: ArrowIcon, bg: 'bg-indigo-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                            <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by vendor name..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FilterIcon className="text-slate-400 w-4 h-4" />
                    <select
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending Only</option>
                        <option value="paid">Paid Only</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vendor & Period</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comm. Fee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48 mb-2"></div><div className="h-3 bg-slate-50 dark:bg-slate-800 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-5 bg-slate-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-5 bg-slate-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-24"></div></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-8 bg-slate-100 rounded w-8"></div></td>
                                    </tr>
                                ))
                            ) : payouts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                <CardIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800 dark:text-white">{p.vendor}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{p.period}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 dark:text-white">${p.amount.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">${p.commission.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={p.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {p.status === 'pending' ? (
                                                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                                                    Mark Paid
                                                </button>
                                            ) : (
                                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                                                    <DotsIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payouts;
