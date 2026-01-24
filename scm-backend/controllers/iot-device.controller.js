import db from '../db.js';

// Register IoT device
export const registerDevice = async (req, res) => {
    const { deviceId, deviceType, deviceModel, imei, phoneNumber } = req.body;

    try {
        const [existing] = await db.query('SELECT id FROM iot_devices WHERE device_id = ?', [deviceId]);

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Device already registered' });
        }

        await db.query(`
            INSERT INTO iot_devices (device_id, device_type, device_model, imei, phone_number, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        `, [deviceId, deviceType, deviceModel || null, imei || null, phoneNumber || null]);

        res.status(201).json({ message: 'Device registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Assign device to delivery person
export const assignDevice = async (req, res) => {
    const { deviceId, userId } = req.body;

    try {
        await db.query(
            'UPDATE iot_devices SET assigned_to = ? WHERE device_id = ?',
            [userId, deviceId]
        );

        res.json({ message: 'Device assigned successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get device status
export const getDeviceStatus = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const [device] = await db.query(`
            SELECT d.*, u.fname, u.lname
            FROM iot_devices d
            LEFT JOIN users u ON d.assigned_to = u.id
            WHERE d.device_id = ?
        `, [deviceId]);

        if (device.length === 0) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json(device[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all devices (admin)
export const getAllDevices = async (req, res) => {
    try {
        const [devices] = await db.query(`
            SELECT d.*, u.fname, u.lname
            FROM iot_devices d
            LEFT JOIN users u ON d.assigned_to = u.id
            ORDER BY d.created_at DESC
        `);

        res.json(devices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update device status
export const updateDeviceStatus = async (req, res) => {
    const { deviceId, status } = req.body;

    try {
        await db.query(
            'UPDATE iot_devices SET status = ? WHERE device_id = ?',
            [status, deviceId]
        );

        res.json({ message: 'Device status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get delivery person's assigned device
export const getMyDevice = async (req, res) => {
    const userId = req.user.id;

    try {
        const [device] = await db.query(
            'SELECT * FROM iot_devices WHERE assigned_to = ? AND status = "active"',
            [userId]
        );

        if (device.length === 0) {
            return res.status(404).json({ message: 'No device assigned' });
        }

        res.json(device[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
