import { useState } from 'react';
import { Package, Truck, CheckCircle2, Search, MapPin } from 'lucide-react';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [trackingData, setTrackingData] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        // Mock data for demo
        setTrackingData({
            id: orderId || 'ORD-882194',
            status: 'In Transit',
            estimate: '2 days remaining',
            steps: [
                { title: 'Order Placed', date: 'Oct 24, 2025', done: true },
                { title: 'Processing', date: 'Oct 25, 2025', done: true },
                { title: 'Shipped', date: 'Oct 26, 2025', done: true },
                { title: 'In Transit', date: 'Oct 27, 2025', done: false },
                { title: 'Delivered', date: 'Pending', done: false },
            ]
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Track Your Order</h1>
                    <p className="text-gray-600 dark:text-gray-400">Enter your order ID to see real-time updates on your delivery</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-slate-800 transition-colors">
                    <form onSubmit={handleTrack} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Order ID (e.g. ORD-12345)"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg dark:text-white transition-colors"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                        </div>
                        <button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
                            Track Now
                        </button>
                    </form>
                </div>

                {trackingData && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="bg-blue-600 dark:bg-blue-500 p-8 text-white flex justify-between items-center">
                            <div>
                                <p className="text-blue-100 dark:text-blue-200 text-sm mb-1">Order Status</p>
                                <h2 className="text-3xl font-bold">{trackingData.status}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 dark:text-blue-200 text-sm mb-1">Estimated Arrival</p>
                                <p className="text-xl font-bold">{trackingData.estimate}</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="space-y-8 relative">
                                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-slate-800"></div>
                                {trackingData.steps.map((step, i) => (
                                    <div key={i} className="flex gap-6 relative z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                                            {step.done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${step.done ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
