import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Save, ArrowLeft, Image as ImageIcon, DollarSign, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        supplier: ''
    });
    const [images, setImages] = useState([]);

    const onDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setImages([...images, ...newImages]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 5
    });

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataPayload = new FormData();
        formDataPayload.append('name', formData.name);
        formDataPayload.append('category', formData.category);
        formDataPayload.append('price', formData.price);
        formDataPayload.append('stock', formData.stock);
        formDataPayload.append('description', formData.description);
        formDataPayload.append('supplier', formData.supplier);

        images.forEach((image) => {
            formDataPayload.append('images', image);
        });

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`, formDataPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Product Created Successfully!");
            navigate('/products');
        } catch (error) {
            console.error("Failed to create product", error);
            toast.error(error.response?.data?.message || "Failed to create product");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/products"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-lg transition"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Product</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to add a new product to your inventory</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Package className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Basic Information</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter product name"
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="footwear">Footwear</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="home">Home & Living</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Supplier
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    >
                                        <option value="">Select Supplier (Optional)</option>
                                        <option value="supplier_a">Global Textiles Ltd.</option>
                                        <option value="supplier_b">TechComponents Inc.</option>
                                        <option value="supplier_c">FashionHub Suppliers</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pricing & Inventory */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Pricing & Inventory</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price (USD) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">$</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800"
                    >
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Product Description</h3>
                        <div className="h-64 mb-16">
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                className="h-full"
                                placeholder="Describe your product features, benefits, and specifications..."
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Media Upload */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 sticky top-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Product Images</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload up to 5 high-quality images</p>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${isDragActive
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                {isDragActive ? 'Drop images here...' : 'Drag & drop images'}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">or click to browse</p>
                        </div>

                        {images.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    {images.length} Image{images.length > 1 ? 's' : ''} Selected
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={file.preview}
                                                alt={`preview-${index}`}
                                                className="h-20 w-full object-cover rounded-lg border border-gray-200 dark:border-slate-700"
                                                onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-200 hover:shadow-xl"
                            >
                                <Save className="w-5 h-5" />
                                Save Product
                            </button>
                            <Link
                                to="/products"
                                className="block w-full text-center text-gray-600 dark:text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition mt-2 font-medium"
                            >
                                Cancel
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </form>
        </motion.div>
    );
};

export default AddProduct;
