import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color, delay = 0 }) => {
    const isPositive = trend === 'up';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-md transition-all"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition">
                <Icon className="w-full h-full" />
            </div>

            <div className="relative">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <div className={`p-2 rounded-lg ${color}`}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                </div>

                <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{value}</p>

                {trendValue && (
                    <div className="flex items-center gap-1">
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                            {trendValue}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">vs last month</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatsCard;
