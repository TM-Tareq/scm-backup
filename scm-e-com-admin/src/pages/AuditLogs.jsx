import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {
    ScrollText, User, Shield, Terminal,
    Search, Calendar, Filter, Download,
    CheckCircle, AlertTriangle, Info, Clock, ExternalLink
} from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data
        setTimeout(() => {
            setLogs([
                { id: 1, user: 'admin@system.com', action: 'UPDATE_COMMISSION', resource: 'Finance', status: 'success', timestamp: '2026-01-20 14:23:45', ip: '192.168.1.1' },
                { id: 2, user: 'editor_mark', action: 'APPROVE_VENDOR', resource: 'Vendors', status: 'success', timestamp: '2026-01-20 13:10:02', ip: '192.168.1.45' },
                { id: 3, user: 'system_bot', action: 'AUTO_PAYOUT_FAILED', resource: 'Payouts', status: 'error', timestamp: '2026-01-20 12:00:00', ip: '127.0.0.1' },
                { id: 4, user: 'admin@system.com', action: 'DELETE_USER', resource: 'Users', status: 'warning', timestamp: '2026-01-20 11:45:30', ip: '192.168.1.1' },
                { id: 5, user: 'vendor_support', action: 'REJECT_VENDOR', resource: 'Vendors', status: 'success', timestamp: '2026-01-20 10:20:15', ip: '192.168.1.12' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'warning': return <Info className="w-4 h-4 text-amber-500" />;
            default: return <Clock className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400">Complete history of administrative actions</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800 transition shadow-sm font-medium">
                        <Download className="w-4 h-4" />
                        Export Logs
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by action, user, or IP..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none">
                        <option>Today</option>
                        <option>Last 7 Days</option>
                        <option>Current Month</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none">
                        <option>All Modules</option>
                        <option>Finance</option>
                        <option>Vendors</option>
                        <option>Users</option>
                    </select>
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-mono text-sm font-bold text-slate-300">SYSTEM_ACTIVITY_PROTOCOL</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User / IP</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Module</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-mono text-[13px]">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-4 bg-slate-100 rounded w-4"></div></td>
                                    </tr>
                                ))
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800 transition-colors group">
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 dark:text-white font-bold">{log.user}</span>
                                            <span className="text-[11px] text-slate-400">{log.ip}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-indigo-600">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {log.resource}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <StatusIcon status={log.status} />
                                            <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
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

export default AuditLogs;
