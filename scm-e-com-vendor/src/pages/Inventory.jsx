import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingUp, RefreshCw, Plus, Loader2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/products/vendor/all');
            const enriched = res.data.map(p => {
                let status = 'healthy';
                if (p.stock === 0) status = 'out';
                else if (p.stock <= 10) status = 'low';
                return { ...p, status };
            });
            setProducts(enriched);
        } catch (err) {
            console.error('Failed to fetch inventory', err);
            toast.error('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const filteredItems = products.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'low') return item.status === 'low';
        if (activeTab === 'out') return item.status === 'out';
        return true;
    });

    const stats = {
        total: products.reduce((sum, item) => sum + item.stock, 0),
        lowStock: products.filter(i => i.status === 'low').length,
        outOfStock: products.filter(i => i.status === 'out').length,
        healthy: products.filter(i => i.status === 'healthy').length,
    };

    const [showRestockModal, setShowRestockModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [restockAmount, setRestockAmount] = useState('');

    const openRestockModal = (product) => {
        setSelectedProduct(product);
        setRestockAmount(product.stock);
        setShowRestockModal(true);
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${selectedProduct.id}`, { stock: parseInt(restockAmount) });
            toast.success('Stock updated successfully');
            setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: parseInt(restockAmount), status: parseInt(restockAmount) === 0 ? 'out' : parseInt(restockAmount) <= 10 ? 'low' : 'healthy' } : p));
            setShowRestockModal(false);
        } catch (err) {
            console.error('Failed to update stock', err);
            toast.error('Failed to update stock');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">Deployment & Logistics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 italic font-medium">Precision tracking for your supply chain units</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-xs">
                    <Plus className="h-4 w-4" />
                    New Shipment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Inventory</p>
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.total.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase">Total units in pipeline</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Optimal</p>
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.healthy}</p>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase">Above operational limit</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Critical</p>
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.lowStock}</p>
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1 uppercase">Below reorder threshold</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Depleted</p>
                        <RefreshCw className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.outOfStock}</p>
                    <p className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1 uppercase">Urgent re-entry required</p>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 dark:border-slate-800">
                {['all', 'low', 'out'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
                            }`}
                    >
                        {tab === 'all' ? 'Entire Inventory' : tab === 'low' ? 'Low Stock Alerts' : 'Depleted Units'}
                        {activeTab === tab && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                <table className="w-full">
                    <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Premium Unit</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Protocol ID (SKU)</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Classification</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Current Stock</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-5 text-right text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filteredItems.map((item) => {
                            const statusConfig = {
                                healthy: { label: 'Optimal', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
                                low: { label: 'Reorder Now', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
                                out: { label: 'Depleted', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
                            };

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition duration-300">
                                    <td className="px-6 py-5 font-black text-gray-900 dark:text-white tracking-tight">{item.name}</td>
                                    <td className="px-6 py-5 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">#{item.sku || 'N/A-' + item.id}</td>
                                    <td className="px-6 py-5 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-tight">{item.category || 'Unclassified'}</td>
                                    <td className="px-6 py-5 text-gray-900 dark:text-white font-black text-lg">{item.stock} <span className="text-[10px] text-gray-400 uppercase ml-1">Units</span></td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusConfig[item.status].color}`}>
                                            {statusConfig[item.status].label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => openRestockModal(item)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black text-[10px] uppercase tracking-widest bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-xl transition-all active:scale-95"
                                        >
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Restock Modal */}
            {showRestockModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 animate-fade-in mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                <RefreshCw className="text-blue-600" /> Update Stock
                            </h2>
                            <button onClick={() => setShowRestockModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <span className="sr-only">Close</span>
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold">✕</div>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStock} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product</label>
                                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl font-bold dark:text-white">
                                    {selectedProduct.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-bold text-lg"
                                    value={restockAmount}
                                    onChange={e => setRestockAmount(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition uppercase tracking-widest text-xs mt-4 shadow-lg shadow-blue-600/30"
                            >
                                Confirm Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;

