import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Warehouse, Plus, Search, MapPin,
    Package, Edit, Trash2, X, Info
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', capacity: '', contact_info: '' });

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/warehouses'); // Wait, let's check the route for warehouses
            // Actually warehouses are in /api/warehouses
            // But admin might need /api/admin/warehouses if we want to separate?
            // Let's use /api/warehouses as it exists in server.js
            const response = await api.get('/warehouses');
            setWarehouses(response.data);
        } catch (err) {
            toast.error('Failed to load warehouses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/warehouses', newWarehouse);
            toast.success('Warehouse established');
            setShowModal(false);
            setNewWarehouse({ name: '', location: '', capacity: '', contact_info: '' });
            fetchWarehouses();
        } catch (err) {
            toast.error('Initialization failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Decommission this facility?')) return;
        try {
            await api.delete(`/warehouses/${id}`);
            toast.success('Facility decommissioned');
            fetchWarehouses();
        } catch (err) {
            toast.error('Decommissioning failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Warehouse Infrastructure</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage fulfillment centers and storage capacity</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-medium"
                >
                    <Plus className="w-4 h-4" />
                    New Facility
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
                    ))
                ) : warehouses.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <Warehouse className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500">No active facilities found in the network.</p>
                    </div>
                ) : warehouses.map((w) => (
                    <motion.div
                        key={w.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Warehouse className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" onClick={() => handleDelete(w.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{w.name}</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {w.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Package className="w-4 h-4 text-slate-400" />
                                Capacity: {w.capacity} Units
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Info className="w-4 h-4 text-slate-400" />
                                {w.contact_info || 'No contact info'}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Active</span>
                            <button className="text-xs font-bold text-blue-600 hover:underline">Manage Inventory</button>
                        </div>
                    </motion.div>
                ))}
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
                            onSubmit={handleSubmit}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Facility Initialization</h3>
                                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Facility Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Central Fulfillment Alpha"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition dark:text-white"
                                        value={newWarehouse.name}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Location Coordinates/Address</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="City, Sector, Country"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition dark:text-white"
                                        value={newWarehouse.location}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Unit Capacity</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="5000"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition dark:text-white"
                                            value={newWarehouse.capacity}
                                            onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Contact Protocol</label>
                                        <input
                                            type="text"
                                            placeholder="+1-800-FULFILL"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition dark:text-white"
                                            value={newWarehouse.contact_info}
                                            onChange={(e) => setNewWarehouse({ ...newWarehouse, contact_info: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Abort</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">Establish Link</button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Warehouses;
