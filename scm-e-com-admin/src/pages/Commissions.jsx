import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, TrendingUp, History, Plus,
    Calendar, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Commissions = () => {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRate, setNewRate] = useState({ rate: '', date: '', notes: '' });

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/commissions');
            setCommissions(res.data);
        } catch (err) {
            console.error('Failed to load commissions', err);
            toast.error('Failed to load commissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleAddRate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/commissions', {
                rate_percentage: parseFloat(newRate.rate),
                effective_date: newRate.date,
                notes: newRate.notes
            });
            toast.success('Commission rate updated');
            setShowAddModal(false);
            setNewRate({ rate: '', date: '', notes: '' });
            fetchCommissions();
        } catch (err) {
            console.error('Failed to set commission rate', err);
            toast.error('Failed to set commission rate');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Commission Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure global platform fees and track history</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    Set New Rate
                </button>
            </div>

            {/* Current Rate Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden"
            >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-indigo-100 font-medium mb-1">Active Commission Rate</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-5xl font-extrabold">{commissions[0]?.rate_percentage}%</h2>
                            <span className="text-indigo-200">per transaction</span>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-indigo-200" />
                            <span className="text-sm font-medium text-indigo-50">Effective Since</span>
                        </div>
                        <p className="text-lg font-bold">{commissions[0]?.effective_date}</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            </motion.div>

            {/* History Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 transition-colors">
                    <History className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <h3 className="font-bold text-slate-800 dark:text-white">Rate History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rate</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Effective Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created By</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-48"></div></td>
                                    </tr>
                                ))
                            ) : commissions.map((c, idx) => (
                                <tr key={c.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${idx === 0 ? 'bg-indigo-50/30 dark:bg-indigo-900/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {c.rate_percentage}%
                                            </span>
                                            {idx === 0 && <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {c.effective_date}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {c.created_by}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 italic">
                                        {c.notes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[60] overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-100 dark:border-slate-700 transition-colors">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    Set New Commission Rate
                                </h3>
                            </div>
                            <form onSubmit={handleAddRate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Rate Percentage (%)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                            placeholder="e.g. 10.5"
                                            value={newRate.rate}
                                            onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Effective Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                            value={newRate.date}
                                            onChange={(e) => setNewRate({ ...newRate, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Reason</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 w-4 h-4" />
                                        <textarea
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none h-24 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                            placeholder="Reason for change..."
                                            value={newRate.notes}
                                            onChange={(e) => setNewRate({ ...newRate, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                                    >
                                        Update Rate
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Commissions;
