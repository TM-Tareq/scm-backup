import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Clock, Download } from 'lucide-react';

const Earnings = () => {
    // Mock data
    const stats = {
        totalEarnings: 24500,
        pendingPayouts: 3200,
        completedPayouts: 21300,
        nextPayout: 'Jan 25, 2026',
    };

    const transactions = [
        { id: 1, orderId: '#ORD-001', date: '2026-01-18', amount: 129.99, status: 'completed', customer: 'John Doe' },
        { id: 2, orderId: '#ORD-002', date: '2026-01-17', amount: 89.50, status: 'pending', customer: 'Jane Smith' },
        { id: 3, orderId: '#ORD-003', date: '2026-01-16', amount: 249.00, status: 'completed', customer: 'Mike Johnson' },
        { id: 4, orderId: '#ORD-004', date: '2026-01-15', amount: 56.75, status: 'completed', customer: 'Sarah Williams' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Earnings & Payouts</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track your revenue and manage payouts</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Download className="h-5 w-5" />
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-blue-100">Total Earnings</p>
                        <DollarSign className="h-5 w-5 text-blue-200" />
                    </div>
                    <p className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-blue-200 mt-2">All time revenue</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending Payouts</p>
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">${stats.pendingPayouts.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Processing</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed Payouts</p>
                        <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">${stats.completedPayouts.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Transferred</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Next Payout</p>
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.nextPayout}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Scheduled date</p>
                </motion.div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Transaction History</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recent earnings from orders</p>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                <td className="px-6 py-4 font-mono text-sm text-blue-600 dark:text-blue-400 font-semibold">{transaction.orderId}</td>
                                <td className="px-6 py-4 text-gray-800 dark:text-white">{transaction.customer}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{transaction.date}</td>
                                <td className="px-6 py-4 text-gray-800 dark:text-white font-bold">${transaction.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === 'completed'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                        }`}>
                                        {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Earnings;
