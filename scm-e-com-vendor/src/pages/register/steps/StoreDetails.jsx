import { motion } from 'framer-motion';
import { Store, MapPin, AlignLeft, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';

const StepStoreDetails = ({ register, errors, setValue, watch }) => {
    const onDrop = useCallback(acceptedFiles => {
        // Handle file upload logic (mock for now, create preview)
        if (acceptedFiles?.length) {
            setValue('logo', acceptedFiles[0]);
        }
    }, [setValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });
    const logoFile = watch('logo');

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Store Details</h3>

            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Store className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input
                        {...register('storeName', { required: 'Store Name is required' })}
                        type="text"
                        className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.storeName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Enter your store name"
                    />
                </div>
                {errors.storeName && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.storeName.message}</span>}
            </div>

            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <AlignLeft className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <textarea
                        {...register('storeDescription', { required: 'Description is required' })}
                        className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md resize-none ${errors.storeDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Describe your store and what you offer"
                        rows="4"
                    />
                </div>
                {errors.storeDescription && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.storeDescription.message}</span>}
            </div>

            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <MapPin className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input
                        {...register('address', { required: 'Address is required' })}
                        type="text"
                        className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Enter your store address"
                    />
                </div>
                {errors.address && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.address.message}</span>}
            </div>

            {/* Logo Upload */}
            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Logo <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                        isDragActive 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.02]' 
                            : 'border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800'
                    }`}
                >
                    <input {...getInputProps()} />
                    {logoFile ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <UploadCloud className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-green-600 dark:text-green-400 font-medium text-sm">{logoFile.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Click or drag to change</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                                <UploadCloud className="h-8 w-8" />
                            </div>
                            <p className="text-sm font-medium mb-1">Drag & drop your logo here</p>
                            <p className="text-xs">or click to browse</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StepStoreDetails;
