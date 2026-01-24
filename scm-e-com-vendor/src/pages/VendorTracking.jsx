import { useState, useEffect } from 'react';
import { Package, MapPin, Truck, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../config/api';
import toast from 'react-hot-toast';

const VendorTracking = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShipment, setSelectedShipment] = useState(null);

    useEffect(() => {
        fetchVendorShipments();
    }, []);

    const fetchVendorShipments = async () => {
        try {
            const response = await api.get('/tracking/vendor/shipments');
            setShipments(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load shipments');
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-500';
            case 'in_transit':
            case 'out_for_delivery':
                return 'bg-blue-500';
            case 'preparing':
            case 'ready_to_ship':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'preparing':
            case 'ready_to_ship':
                return <Package className="w-5 h-5" />;
            case 'in_transit':
            case 'out_for_delivery':
                return <Truck className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    const openTracking = (trackingCode) => {
        window.open(`/track/${trackingCode}`, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Product Tracking
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your products in real-time with unique tracking codes
                    </p>
                </div>

                {/* Shipments Grid */}
                {shipments.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Shipments Yet</h3>
                        <p className="text-gray-600 dark:text-gray-400">Your product shipments will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shipments.map((shipment, index) => (
                            <motion.div
                                key={shipment.unique_code}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${shipment.product_image}`}
                                        alt={shipment.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full ${getStatusColor(shipment.status)} text-white text-xs font-bold flex items-center gap-1`}>
                                        {getStatusIcon(shipment.status)}
                                        {shipment.status.replace(/_/g, ' ').toUpperCase()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                                        {shipment.product_name}
                                    </h3>

                                    {/* Tracking Code */}
                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Tracking Code</p>
                                        <p className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                                            {shipment.unique_code}
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Package className="w-4 h-4" />
                                            <span>Quantity: {shipment.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(shipment.order_date).toLocaleDateString()}</span>
                                        </div>
                                        {shipment.current_location && (
                                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>Live Location Available</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openTracking(shipment.tracking_code)}
                                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Track Live
                                        </button>
                                    </div>

                                    {/* Estimated Delivery */}
                                    {shipment.estimated_delivery && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {new Date(shipment.estimated_delivery).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorTracking;
