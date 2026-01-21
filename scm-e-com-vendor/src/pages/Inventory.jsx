import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingUp, RefreshCw, Plus } from 'lucide-react';

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('all');

    // Mock inventory data
    const inventoryItems = [
        { id: 1, name: 'Wireless Headphones', sku: 'WH-001', stock: 145, reorderPoint: 50, status: 'healthy', category: 'Electronics' },
        { id: 2, name: 'Smart Watch', sku: 'SW-002', stock: 23, reorderPoint: 30, status: 'low', category: 'Electronics' },
        { id: 3, name: 'Laptop Stand', sku: 'LS-003', stock: 0, reorderPoint: 20, status: 'out', category: 'Accessories' },
        { id: 4, name: 'USB-C Cable', sku: 'UC-004', stock: 380, reorderPoint: 100, status: 'healthy', category: 'Accessories' },
        { id: 5, name: 'Mechanical Keyboard', sku: 'MK-005', stock: 12, reorderPoint: 25, status: 'low', category: 'Peripherals' },
    ];

    const filteredItems = inventoryItems.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'low') return item.status === 'low';
        if (activeTab === 'out') return item.status === 'out';
        return true;
    });

    const stats = {
        total: inventoryItems.reduce((sum, item) => sum + item.stock, 0),
        lowStock: inventoryItems.filter(i => i.status === 'low').length,
        outOfStock: inventoryItems.filter(i => i.status === 'out').length,
        healthy: inventoryItems.filter(i => i.status === 'healthy').length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory & Supply Chain</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor stock levels and manage suppliers</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Plus className="h-5 w-5" />
                    Add Supplier
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Across all products</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Healthy Stock</p>
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.healthy}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Above reorder point</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.lowStock}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Needs reordering</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
                        <RefreshCw className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.outOfStock}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Urgent action needed</p>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800">
                {['all', 'low', 'out'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === tab
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab === 'all' ? 'All Items' : tab === 'low' ? 'Low Stock' : 'Out of Stock'}
                    </button>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">SKU</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Stock</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reorder Point</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filteredItems.map((item) => {
                            const statusConfig = {
                                healthy: { label: 'Healthy', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
                                low: { label: 'Low Stock', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
                                out: { label: 'Out of Stock', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
                            };

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{item.sku}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.category}</td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-white font-bold">{item.stock}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.reorderPoint}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[item.status].color}`}>
                                            {statusConfig[item.status].label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                                            Reorder
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
