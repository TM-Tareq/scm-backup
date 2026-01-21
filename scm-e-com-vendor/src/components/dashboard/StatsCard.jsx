import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all group relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">
                        {value}
                    </h3>
                </div>
                <div className={clsx("p-3 rounded-lg", color)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    {trend === 'up' ? (
                        <span className="flex items-center text-emerald-500 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {trendValue}
                        </span>
                    ) : (
                        <span className="flex items-center text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            {trendValue}
                        </span>
                    )}
                    <span className="text-gray-400 dark:text-gray-500 ml-1">vs last month</span>
                </div>
            )}

            {/* Background Decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-gray-50 dark:from-slate-800 to-gray-100 dark:to-slate-700 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 z-0"></div>
        </motion.div>
    );
};

export default StatsCard;
