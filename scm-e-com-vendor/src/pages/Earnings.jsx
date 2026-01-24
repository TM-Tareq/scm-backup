import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Clock, Download, Loader2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Earnings = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        netEarnings: 0,
        totalCommission: 0,
        pendingOrders: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, ordersRes, payoutsRes] = await Promise.all([
                api.get('/vendor/dashboard'),
                api.get('/orders/vendor/all'),
                api.get('/vendor/payouts')
            ]);

            setStats({
                totalRevenue: statsRes.data.stats.totalRevenue || 0,
                netEarnings: statsRes.data.stats.netEarnings || 0,
                totalCommission: statsRes.data.stats.totalCommission || 0,
                pendingOrders: statsRes.data.stats.pendingOrders || 0
            });

            const formattedTransactions = ordersRes.data.map(order => ({
                id: order.id,
                orderId: `#ORD-${order.order_id}`,
                date: new Date(order.created_at).toLocaleDateString(),
                amount: parseFloat(order.sub_total),
                commission: parseFloat(order.commission_amount),
                status: order.status,
                customer: `${order.fname} ${order.lname}`
            }));
            setTransactions(formattedTransactions);
            setPayouts(payoutsRes.data);
        } catch (err) {
            console.error('Failed to fetch earnings data', err);
            toast.error('Failed to load financial records');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPayout = async () => {
        const amount = prompt('Enter payout amount:');
        if (!amount || isNaN(amount)) return;

        try {
            await api.post('/vendor/payouts', { amount: parseFloat(amount) });
            toast.success('Payout request submitted');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to request payout');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white uppercase tracking-tighter">Finance & Settlements</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 italic font-medium">Real-time revenue attribution and payout status</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRequestPayout}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg font-black uppercase tracking-widest text-xs"
                    >
                        Request Payout
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg font-black uppercase tracking-widest text-xs">
                        <Download className="h-4 w-4" />
                        Export Ledger
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Net Settlements</p>
                        <DollarSign className="h-5 w-5 text-blue-200" />
                    </div>
                    <p className="text-3xl font-black">${stats.netEarnings.toLocaleString()}</p>
                    <p className="text-[10px] text-blue-200 mt-2 font-bold uppercase tracking-tighter italic">Credited to primary account</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Available Payout</p>
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    {/* Simplified available calculation for the card */}
                    <p className="text-3xl font-black text-gray-900 dark:text-white">${(stats.netEarnings - payouts.reduce((acc, p) => p.status !== 'cancelled' ? acc + parseFloat(p.amount) : acc, 0)).toLocaleString()}</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-bold uppercase">Withdraw now</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold uppercase tracking-widest">Gross supply chain value</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">System Commission</p>
                        <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">${stats.totalCommission.toLocaleString()}</p>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 font-bold uppercase">Operational overhead</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction History */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Settlement Ledger</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Detailed attribution of unit sales and commissions</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Gross</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition duration-300">
                                        <td className="px-6 py-5 font-black text-sm text-blue-600 dark:text-blue-400">{transaction.orderId}</td>
                                        <td className="px-6 py-5 text-gray-500 dark:text-gray-400 font-medium text-xs">{transaction.date}</td>
                                        <td className="px-6 py-5 text-gray-900 dark:text-white font-black">${transaction.amount.toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${transaction.status.toLowerCase() === 'completed' || transaction.status.toLowerCase() === 'delivered'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                }`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payout History */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Payout Status</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">History of your withdrawals</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {payouts.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No payouts requested yet.</p>
                            ) : payouts.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                    <div>
                                        <p className="font-black text-gray-900 dark:text-white">${parseFloat(p.amount).toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">{new Date(p.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                        p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Earnings;

