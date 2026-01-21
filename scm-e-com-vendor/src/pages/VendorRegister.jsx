import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

import ProgressBar from './register/components/ProgressBar';
import StepAccountInfo from './register/steps/AccountInfo';
import StepStoreDetails from './register/steps/StoreDetails';
import StepVerification from './register/steps/Verification';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

const VendorRegister = () => {
    const [step, setStep] = useState(1);
    const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm({
        mode: "onChange"
    });
    const navigate = useNavigate();
    const { register: registerVendor, createStoreProfile, loading } = useAuthStore();
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    const totalSteps = 3;

    const handleNext = async () => {
        let isValid = false;

        if (step === 1) {
            isValid = await trigger(['fname', 'lname', 'email', 'password', 'confirmPassword']);
        } else if (step === 2) {
            isValid = await trigger(['storeName', 'storeDescription', 'address']);
        }

        if (isValid) {
            setStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data) => {
        try {
            // 1. Register User
            const userSuccess = await registerVendor({
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                password: data.password
            });

            if (userSuccess) {
                // 2. Create Store Profile
                const storeSuccess = await createStoreProfile({
                    storeName: data.storeName,
                    description: data.storeDescription,
                    address: data.address
                    // Note: backend needs to support address
                });

                if (storeSuccess) {
                    toast.success("Registration Complete! Pending Approval.");
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-4 py-8 transition-colors">
            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200 z-50"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                    <Moon className="h-5 w-5 text-slate-700" />
                )}
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-all duration-300 hover:shadow-3xl"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-900 px-8 py-6 border-b border-blue-500/20 dark:border-slate-700 flex justify-between items-center transition-colors">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-white">Become a Vendor</h2>
                        <p className="text-sm text-blue-100 dark:text-gray-400 mt-1">Join our premium marketplace</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-semibold text-blue-100 dark:text-blue-400 uppercase tracking-wide bg-white/20 dark:bg-slate-700/50 px-3 py-1 rounded-full">Step {step} of {totalSteps}</p>
                    </div>
                </div>

                <div className="px-8 md:px-10 py-8 bg-white dark:bg-slate-900 transition-colors">
                    <ProgressBar currentStep={step} totalSteps={totalSteps} />

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <StepAccountInfo key="step1" register={register} errors={errors} />
                            )}
                            {step === 2 && (
                                <StepStoreDetails key="step2" register={register} errors={errors} setValue={setValue} watch={watch} />
                            )}
                            {step === 3 && (
                                <StepVerification key="step3" register={register} errors={errors} />
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="px-8 md:px-10 py-6 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center transition-colors gap-4">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" /> Back
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                            Already have an account?
                        </Link>
                    )}

                    {step < totalSteps ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all font-semibold shadow-lg shadow-blue-200 dark:shadow-blue-900/50 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Next Step <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                            className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 transition-all font-semibold shadow-lg shadow-green-200 dark:shadow-green-900/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    Complete Registration <CheckCircle className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VendorRegister;
