import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, Package, MapPin, Navigation, Clock, Truck } from 'lucide-react';
import api from '../config/api';
import { socket } from '../utils/socket';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toast from 'react-hot-toast';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Delivery Truck Icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/713/713311.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// Map Updater Component
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15);
        }
    }, [center, map]);
    return null;
};

const LiveTracking = () => {
    const [searchParams] = useSearchParams();
    const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState(null); // [lat, lng]

    // Initial load from URL param
    useEffect(() => {
        if (searchParams.get('code')) {
            handlesearch(searchParams.get('code'));
        }
    }, []);

    // Socket Connection
    useEffect(() => {
        if (!trackingData) return;

        socket.connect();
        socket.emit('track:shipment', trackingCode);

        console.log(`📡 Connecting to live tracking for ${trackingCode}`);

        socket.on('location:updated', (data) => {
            console.log('📍 New Location:', data);
            if (data.latitude && data.longitude) {
                setPosition([data.latitude, data.longitude]);
                toast.success('Location updated!', { icon: '📍', duration: 2000 });
            }
        });

        socket.on('status:updated', (data) => {
            setTrackingData(prev => ({ ...prev, status: data.status }));
            toast.success(`Order status updated: ${data.status}`);
        });

        return () => {
            socket.off('location:updated');
            socket.off('status:updated');
            socket.disconnect();
        };
    }, [trackingData]); // Re-run if tracking data loads

    const handlesearch = async (codeToSearch = trackingCode) => {
        if (!codeToSearch.trim()) return;

        setLoading(true);
        try {
            const response = await api.get(`/tracking/${codeToSearch}`);
            setTrackingData(response.data);

            // Set initial position
            if (response.data.current_location) {
                const { lat, lng } = response.data.current_location;
                if (lat && lng) setPosition([lat, lng]);
            }
        } catch (err) {
            toast.error('Tracking code not found');
            setTrackingData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Search Bar */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            placeholder="Enter Tracking ID (e.g. TRK-X7Z-9N2)"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold tracking-widest uppercase"
                        />
                    </div>
                    <button
                        onClick={() => handlesearch()}
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
                    >
                        {loading ? 'Locating...' : 'Track Order'}
                    </button>
                </div>

                {trackingData && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Status Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-400">ORDER STATUS</div>
                                        <div className="text-2xl font-black text-gray-800 dark:text-white uppercase">{trackingData.status}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {trackingData.items?.map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <p className="font-bold text-sm dark:text-white line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Total Amount</span>
                                        <span className="text-gray-900 dark:text-white font-bold">৳{(trackingData.total_price * 120).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium mt-2">
                                        <span>Receiver</span>
                                        <span className="text-gray-900 dark:text-white font-bold">{trackingData.receiver_name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white">
                                <h3 className="font-bold flex items-center gap-2 mb-4">
                                    <Navigation className="w-5 h-5" /> Live Updates
                                </h3>
                                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                                    Our IoT tracking system updates location every 30 seconds.
                                    Even if the delivery vehicle changes, this link remains active.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-mono bg-white/10 p-3 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    SYSTEM ONLINE
                                </div>
                            </div>
                        </div>

                        {/* Map View */}
                        <div className="lg:col-span-2 h-[600px] bg-gray-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 relative z-0">
                            {position ? (
                                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <MapUpdater center={position} />
                                    <Marker position={position} icon={truckIcon}>
                                        <Popup>
                                            <div className="text-center">
                                                <div className="font-bold">Your Order</div>
                                                <div className="text-xs text-gray-500">Live Location</div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900/50">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                        <MapPin className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">Waiting for GPS Signal...</h3>
                                    <p className="text-gray-400 text-sm mt-2">The delivery verified has not started moving yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTracking;
