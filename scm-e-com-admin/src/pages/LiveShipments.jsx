import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Truck, Package, MapPin, Eye, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';

const LiveShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedShipment, setSelectedShipment] = useState(null);

    const mapContainerStyle = {
        width: '100%',
        height: '600px'
    };

    const mapCenter = { lat: 23.8103, lng: 90.4125 }; // Dhaka

    useEffect(() => {
        fetchShipments();
        const interval = setInterval(fetchShipments, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [selectedStatus]);

    const fetchShipments = async () => {
        try {
            const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
            const response = await api.get('/shipments', { params });
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

    const activeShipments = shipments.filter(s =>
        ['in_transit', 'out_for_delivery'].includes(s.status) &&
        s.current_latitude &&
        s.current_longitude
    );

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
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Live Shipments Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor all active deliveries in real-time
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Shipments', count: shipments.length, color: 'blue' },
                        { label: 'In Transit', count: shipments.filter(s => s.status === 'in_transit').length, color: 'yellow' },
                        { label: 'Out for Delivery', count: shipments.filter(s => s.status === 'out_for_delivery').length, color: 'purple' },
                        { label: 'Delivered Today', count: shipments.filter(s => s.status === 'delivered').length, color: 'green' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                            <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Active Deliveries Map
                                </h2>
                            </div>
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={12}
                                >
                                    {activeShipments.map((shipment) => (
                                        <Marker
                                            key={shipment.id}
                                            position={{
                                                lat: parseFloat(shipment.current_latitude),
                                                lng: parseFloat(shipment.current_longitude)
                                            }}
                                            onClick={() => setSelectedShipment(shipment)}
                                            icon={{
                                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                            }}
                                            title={shipment.tracking_code}
                                        />
                                    ))}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>

                    {/* Shipments List */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipments</h2>

                            {/* Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                            >
                                <option value="all">All Statuses</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready_to_ship">Ready to Ship</option>
                                <option value="in_transit">In Transit</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>

                        <div className="overflow-y-auto max-h-[500px]">
                            {shipments.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600 dark:text-gray-400">No shipments found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {shipments.map((shipment) => (
                                        <div
                                            key={shipment.id}
                                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                            onClick={() => setSelectedShipment(shipment)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                                                        {shipment.tracking_code}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {shipment.warehouse_name}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(shipment.status)}`}>
                                                    {shipment.status.replace(/_/g, ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            {shipment.delivery_person_fname && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                    <Truck className="w-3 h-3" />
                                                    <span>{shipment.delivery_person_fname} {shipment.delivery_person_lname}</span>
                                                </div>
                                            )}

                                            {shipment.current_latitude && shipment.current_longitude && (
                                                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>Live Location Available</span>
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(`/track/${shipment.tracking_code}`, '_blank');
                                                }}
                                                className="mt-2 w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                            >
                                                <Eye className="w-3 h-3" />
                                                View Tracking
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveShipments;
