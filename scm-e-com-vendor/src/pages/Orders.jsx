import { useState, useEffect } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/vendor/all');
            const formatted = res.data.map(order => ({
                id: `#ORD-${order.order_id}`,
                date: new Date(order.created_at).toLocaleDateString(),
                customer: `${order.fname} ${order.lname}`,
                total: `$${parseFloat(order.sub_total).toLocaleString()}`,
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                items: 'View Details', // We don't have item count in sub_orders list query currently
                rawId: order.order_id
            }));
            setOrders(formatted);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">Supply Chain Orders</h2>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between transition-colors">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                        <thead className="bg-gray-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Deployment Date</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Client Name</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Net Value</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">Syncing with supply chain...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">No orders found matching criteria.</td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-blue-600 dark:text-blue-400">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 dark:text-white">{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-[10px] font-black uppercase tracking-widest rounded-md ${getStatusColor(order.status)} dark:bg-opacity-20`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;

