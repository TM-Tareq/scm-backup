import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck, Package, Plus, Search, MapPin,
    Globe, ShieldCheck, AlertCircle, Edit, Trash2,
    CheckCircle2, Clock, X
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Logistics = () => {
    const [carriers, setCarriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCarrier, setNewCarrier] = useState({ name: '', tracking_url_template: '', logo_url: '' });

    const fetchCarriers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/carriers');
            setCarriers(res.data);
        } catch (err) {
            toast.error('Failed to load carriers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarriers();
    }, []);

    const handleAddCarrier = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/carriers', newCarrier);
            toast.success('Carrier added successfully');
            setShowModal(false);
            setNewCarrier({ name: '', tracking_url_template: '', logo_url: '' });
            fetchCarriers();
        } catch (err) {
            toast.error('Failed to add carrier');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this carrier?')) return;
        try {
            await api.delete(`/admin/carriers/${id}`);
            toast.success('Carrier deleted');
            fetchCarriers();
        } catch (err) {
            toast.error('Failed to delete carrier');
        }
    };

    const StatusBadge = ({ status }) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status === 'active' || !status
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
            {(status || 'active').charAt(0).toUpperCase() + (status || 'active').slice(1)}
        </span>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Logistics & Carriers</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage shipping partners and coverage areas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Carrier
                </button>
            </div>

            {/* Carrier Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Carriers</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{carriers.length}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Logistics Flow</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Optimized</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Fleet Management</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Active</h3>
                    </div>
                </div>
            </div>

            {/* Carriers Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Shipping Partners</h3>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search partners..."
                            className="pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 dark:text-white outline-none transition w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Carrier Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tracking Template</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-40"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-20"></div></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-8"></div></td>
                                    </tr>
                                ))
                            ) : carriers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">No carriers found.</td>
                                </tr>
                            ) : carriers.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {c.logo_url && <img src={c.logo_url} className="w-8 h-8 rounded-full bg-slate-100" alt={c.name} />}
                                            <span className="font-semibold text-slate-800 dark:text-white">{c.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-mono truncate max-w-xs">{c.tracking_url_template || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" onClick={() => handleDelete(c.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.form
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onSubmit={handleAddCarrier}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">New Carrier Protocol</h3>
                                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Carrier Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. DHL Express"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition dark:text-white"
                                        value={newCarrier.name}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Tracking Template</label>
                                    <input
                                        type="text"
                                        placeholder="https://track.com/{{code}}"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition dark:text-white"
                                        value={newCarrier.tracking_url_template}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, tracking_url_template: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Logo URL (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="https://logo-provider.com/carrier.png"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition dark:text-white"
                                        value={newCarrier.logo_url}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, logo_url: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Abort</button>
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Finalize Partner</button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Logistics;
