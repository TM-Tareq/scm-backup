import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import { MapPin, Package, Truck, CheckCircle, Clock, AlertCircle, Navigation } from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';

const TrackingPage = () => {
    const { trackingCode } = useParams();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationHistory, setLocationHistory] = useState([]);
    const [isDeviceOffline, setIsDeviceOffline] = useState(false);
    const socketRef = useRef(null);
    const mapRef = useRef(null);

    const mapContainerStyle = {
        width: '100%',
        height: '600px'
    };

    const mapCenter = currentLocation || { lat: 23.8103, lng: 90.4125 }; // Default to Dhaka

    useEffect(() => {
        fetchTrackingData();
        connectSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [trackingCode]);

    const fetchTrackingData = async () => {
        try {
            const response = await api.get(`/tracking/${trackingCode}`);
            setShipment(response.data);

            if (response.data.latest_location) {
                setCurrentLocation({
                    lat: parseFloat(response.data.latest_location.latitude),
                    lng: parseFloat(response.data.latest_location.longitude)
                });
                setIsDeviceOffline(response.data.latest_location.is_offline);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Tracking code not found');
            setLoading(false);
        }
    };

    const connectSocket = () => {
        socketRef.current = io(import.meta.env.VITE_API_URL.replace('/api', ''));

        socketRef.current.emit('track:shipment', trackingCode);

        socketRef.current.on('location:updated', (data) => {
            setCurrentLocation({
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude)
            });
            setLocationHistory(prev => [...prev, data]);
            setIsDeviceOffline(false);
        });

        socketRef.current.on('status:updated', (data) => {
            setShipment(prev => ({ ...prev, status: data.status }));
            toast.success(`Status updated: ${data.status.replace('_', ' ')}`);
        });

        socketRef.current.on('device:offline', () => {
            setIsDeviceOffline(true);
            toast.error('GPS tracker is offline. Showing last known location.');
        });

        socketRef.current.on('device:online', () => {
            setIsDeviceOffline(false);
            toast.success('GPS tracker reconnected!');
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'preparing':
            case 'ready_to_ship':
                return <Package className="w-6 h-6" />;
            case 'picked_up':
            case 'in_transit':
            case 'out_for_delivery':
                return <Truck className="w-6 h-6" />;
            case 'delivered':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            default:
                return <Clock className="w-6 h-6" />;
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tracking Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">The tracking code you entered is invalid.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tracking Code: <span className="font-mono font-bold">{trackingCode}</span>
                    </p>
                </div>

                {/* Offline Warning */}
                {isDeviceOffline && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                        <p className="text-yellow-800 dark:text-yellow-200">
                            GPS tracker is offline. Showing last known location. Tracking will resume automatically when connection is restored.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Navigation className="w-5 h-5" />
                                    Live Tracking
                                </h2>
                                {currentLocation && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Live
                                    </div>
                                )}
                            </div>
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={14}
                                    onLoad={map => mapRef.current = map}
                                >
                                    {/* Warehouse Marker */}
                                    {shipment.warehouse_lat && shipment.warehouse_lng && (
                                        <Marker
                                            position={{
                                                lat: parseFloat(shipment.warehouse_lat),
                                                lng: parseFloat(shipment.warehouse_lng)
                                            }}
                                            label="W"
                                            title={shipment.warehouse_name}
                                        />
                                    )}

                                    {/* Current Location Marker */}
                                    {currentLocation && (
                                        <Marker
                                            position={currentLocation}
                                            icon={{
                                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                            }}
                                            title="Delivery Person"
                                        />
                                    )}

                                    {/* Route Polyline */}
                                    {locationHistory.length > 1 && (
                                        <Polyline
                                            path={locationHistory.map(loc => ({
                                                lat: parseFloat(loc.latitude),
                                                lng: parseFloat(loc.longitude)
                                            }))}
                                            options={{
                                                strokeColor: '#3B82F6',
                                                strokeOpacity: 0.8,
                                                strokeWeight: 4
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="space-y-6">
                        {/* Current Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Delivery Status</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-full ${getStatusColor(shipment.status)}`}>
                                    {getStatusIcon(shipment.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                        {shipment.status.replace(/_/g, ' ')}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                                {['preparing', 'ready_to_ship', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].map((status, index) => {
                                    const statusIndex = ['preparing', 'ready_to_ship', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].indexOf(shipment.status);
                                    const isCompleted = index <= statusIndex;
                                    const isCurrent = index === statusIndex;

                                    return (
                                        <div key={status} className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <p className={`text-sm ${isCurrent ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        {shipment.items && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {shipment.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${item.image}`}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Warehouse Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shipping From</h3>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{shipment.warehouse_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{shipment.warehouse_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
