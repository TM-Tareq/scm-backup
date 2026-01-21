import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const StepAccountInfo = ({ register, errors }) => {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Account Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                        <input
                            {...register('fname', { required: 'First name is required' })}
                            type="text"
                            className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.fname ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                            placeholder="Enter first name"
                        />
                    </div>
                    {errors.fname && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.fname.message}</span>}
                </div>
                <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('lname', { required: 'Last name is required' })}
                        type="text"
                        className={`w-full py-3 px-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.lname ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Enter last name"
                    />
                    {errors.lname && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.lname.message}</span>}
                </div>
            </div>

            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        type="email"
                        className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Enter your email address"
                    />
                </div>
                {errors.email && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.email.message}</span>}
            </div>

            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: "Min 6 chars" } })}
                        type="password"
                        className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Create a password (min 6 characters)"
                    />
                </div>
                {errors.password && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.password.message}</span>}
            </div>

            <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input
                        {...register('confirmPassword', {
                            required: 'Confirm Password is required',
                            validate: (val, formValues) => val === formValues.password || "Passwords do not match"
                        })}
                        type="password"
                        className={`pl-12 pr-4 w-full py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500'}`}
                        placeholder="Confirm your password"
                    />
                </div>
                {errors.confirmPassword && <span className="text-xs text-red-500 dark:text-red-400 mt-1 block">{errors.confirmPassword.message}</span>}
            </div>
        </motion.div>
    );
};

export default StepAccountInfo;
