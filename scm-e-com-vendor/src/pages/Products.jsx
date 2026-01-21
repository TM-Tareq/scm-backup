import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import axios from 'axios';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on search and stock filter
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStock = true;
        if (stockFilter === 'in-stock') matchesStock = product.stock > 10;
        else if (stockFilter === 'low-stock') matchesStock = product.stock > 0 && product.stock <= 10;
        else if (stockFilter === 'out-of-stock') matchesStock = product.stock === 0;

        return matchesSearch && matchesStock;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Product Matrix</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Monitor and manage your supply chain offerings</p>
                </div>
                <Link
                    to="/products/new"
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest text-sm"
                >
                    <Plus className="h-5 w-5" />
                    Deploy New Item
                </Link>
            </div>

            {/* Filters */}
            <ProductFilters
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
            />

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 transition-colors">
                    <Package className="h-20 w-20 text-gray-200 dark:text-slate-800 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-600 dark:text-slate-400 mb-2 tracking-tighter">No Units Detected</h3>
                    <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-sm mx-auto">
                        {searchTerm || stockFilter !== 'all'
                            ? 'The current filter configuration yielded no results. Try recalibrating your search parameters.'
                            : 'Your store is ready for its first inventory deployment. Add your premium products to begin trading.'
                        }
                    </p>
                    {!searchTerm && stockFilter === 'all' && (
                        <Link
                            to="/products/new"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus className="h-5 w-5" />
                            Add Your First Product
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Premium Product</th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Market Value</th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Availability</th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Compliance</th>
                                        <th className="px-6 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {filteredProducts.map((product) => {
                                        const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
                                        const stockColor = product.stock > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : product.stock > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative group">
                                                            <img
                                                                src={product.image || 'https://via.placeholder.com/50'}
                                                                alt={product.name}
                                                                className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 dark:text-white tracking-tight">{product.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{product.sku || 'SKU-NONE'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-black text-gray-900 dark:text-white text-lg">${product.price.toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-gray-700 dark:text-gray-300">{product.stock} units</span>
                                                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(product.stock, 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${stockColor}`}>
                                                        {stockStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        to={`/products/edit/${product.id}`}
                                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-black text-xs uppercase tracking-widest bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-xl transition-all"
                                                    >
                                                        Edit Matrix
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;
