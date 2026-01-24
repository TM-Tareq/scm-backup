import db from '../db.js';

// Get tracking by code (public endpoint)
// Get tracking by code (public endpoint)
export const getTrackingByCode = async (req, res) => {
    const { code } = req.params;

    try {
        // 1. Fetch from order_tracking_codes table (linked to orders)
        const [trackingResult] = await db.query(`
            SELECT 
                tc.tracking_code, 
                tc.status, 
                tc.current_location,
                tc.created_at,
                o.id as order_id,
                o.receiver_name,
                o.total_price,
                o.payment_method
            FROM order_tracking_codes tc
            JOIN orders o ON tc.order_id = o.id
            WHERE tc.tracking_code = ?
        `, [code]);

        if (trackingResult.length === 0) {
            return res.status(404).json({ message: 'Tracking code not found' });
        }

        const trackingData = trackingResult[0];

        // 2. Get latest IOT device update
        const [deviceUpdate] = await db.query(`
            SELECT latitude, longitude, last_update
            FROM iot_devices
            WHERE tracking_code = ?
            ORDER BY last_update DESC
            LIMIT 1
        `, [code]);

        if (deviceUpdate.length > 0) {
            trackingData.current_location = {
                lat: deviceUpdate[0].latitude,
                lng: deviceUpdate[0].longitude,
                last_update: deviceUpdate[0].last_update
            };
        } else if (typeof trackingData.current_location === 'string') {
            try {
                trackingData.current_location = JSON.parse(trackingData.current_location);
            } catch (e) {
                trackingData.current_location = null;
            }
        }

        // 3. Get Order Items
        const [items] = await db.query(`
            SELECT oi.quantity, oi.price, p.name, p.image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [trackingData.order_id]);

        trackingData.items = items;

        res.json(trackingData);
    } catch (err) {
        console.error('Get tracking error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update GPS location (from IoT device)
export const updateGPSLocation = async (req, res) => {
    const { trackingCode, deviceId, latitude, longitude, accuracy, speed, heading, altitude, batteryLevel } = req.body;

    try {
        // 1. Update order_tracking_codes table
        const currentLocation = JSON.stringify({ lat: latitude, lng: longitude, last_update: new Date() });

        const [result] = await db.query(`
            UPDATE order_tracking_codes
            SET current_location = ?, updated_at = CURRENT_TIMESTAMP
            WHERE tracking_code = ?
        `, [currentLocation, trackingCode]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tracking code not found' });
        }

        // 2. Update/Insert into iot_devices table
        await db.query(`
            INSERT INTO iot_devices (device_id, tracking_code, latitude, longitude, battery_level, last_update)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            battery_level = VALUES(battery_level),
            last_update = VALUES(last_update)
        `, [deviceId || 'unknown', trackingCode, latitude, longitude, batteryLevel || 100]);

        // 3. Emit Socket Event for Real-time Frontend Update
        const io = req.app.get('io');
        if (io) {
            io.to(`shipment:${trackingCode}`).emit('location:updated', {
                latitude,
                longitude,
                accuracy,
                speed,
                heading,
                batteryLevel,
                timestamp: new Date()
            });
            console.log(`📡 Emitted location update for ${trackingCode}`);
        }

        res.json({ message: 'Location updated successfully' });
    } catch (err) {
        console.error('Update GPS location error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get location history
export const getLocationHistory = async (req, res) => {
    const { shipmentId } = req.params;
    const { limit = 100 } = req.query;

    try {
        const [locations] = await db.query(`
            SELECT latitude, longitude, accuracy, speed, heading, battery_level, is_offline, recorded_at
            FROM gps_locations
            WHERE shipment_id = ?
            ORDER BY recorded_at DESC
            LIMIT ?
        `, [shipmentId, parseInt(limit)]);

        res.json(locations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Save planned route
export const savePlannedRoute = async (req, res) => {
    const { shipmentId, waypoints, distanceKm, estimatedDurationMinutes, routePolyline } = req.body;

    try {
        await db.query(`
            INSERT INTO delivery_routes (shipment_id, route_type, waypoints, distance_km, estimated_duration_minutes, route_polyline)
            VALUES (?, 'planned', ?, ?, ?, ?)
        `, [shipmentId, JSON.stringify(waypoints), distanceKm, estimatedDurationMinutes, routePolyline]);

        res.json({ message: 'Route saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get vendor shipments by product tracking codes
export const getVendorShipments = async (req, res) => {
    const vendorId = req.user.id;

    try {
        // Get vendor record
        const [vendor] = await db.query('SELECT id FROM vendors WHERE user_id = ?', [vendorId]);
        if (vendor.length === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const [shipments] = await db.query(`
            SELECT DISTINCT 
                otc.tracking_code as unique_code, 
                otc.tracking_code, 
                otc.status,
                otc.current_location,
                otc.updated_at as last_location_update,
                oi.quantity,
                p.name as product_name, 
                p.image as product_image,
                o.created_at as order_date
            FROM order_tracking_codes otc
            JOIN orders o ON otc.order_id = o.id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.vendor_id = ?
            ORDER BY o.created_at DESC
        `, [vendor[0].id]);

        res.json(shipments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
