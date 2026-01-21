import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, index }) => {
    const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
    const stockColor = product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stockColor} dark:bg-opacity-20`}>
                        {stockStatus}
                    </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Link
                        to={`/products/${product.id}`}
                        className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="View Details"
                    >
                        <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </Link>
                    <Link
                        to={`/products/edit/${product.id}`}
                        className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                        title="Edit Product"
                    >
                        <Edit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </Link>
                    <button
                        className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
                        title="Duplicate"
                    >
                        <Copy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                    <button
                        className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        title="Delete"
                    >
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Price</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${product.price}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500">Stock</p>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{product.stock}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
