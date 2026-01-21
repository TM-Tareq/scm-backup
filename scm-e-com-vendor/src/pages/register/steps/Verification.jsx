import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Upload } from 'lucide-react';

const StepVerification = ({ register, errors }) => {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 p-5 rounded-xl flex items-start gap-4 mb-6 shadow-sm">
                <div className="flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-1">Identity Verification Required</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                        To ensure platform safety, we require a valid government ID and tax document.
                        Your store will be pending until approved.
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Verification Documents</h3>

            <div className="space-y-5">
                <div className="border-2 border-gray-300 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Government ID (Passport/License) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                            <FileText className="text-gray-500 dark:text-gray-400 h-5 w-5" />
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 transition-colors cursor-pointer"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                </div>

                <div className="border-2 border-gray-300 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Tax Registration Document <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                            <FileText className="text-gray-500 dark:text-gray-400 h-5 w-5" />
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 transition-colors cursor-pointer"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            {...register('terms', { required: 'You must agree to terms' })}
                            className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 cursor-pointer"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium">
                                Terms of Service
                            </a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    {errors.terms && <span className="text-xs text-red-500 dark:text-red-400 block mt-2 ml-8">{errors.terms.message}</span>}
                </div>
            </div>
        </motion.div>
    );
};

export default StepVerification;
