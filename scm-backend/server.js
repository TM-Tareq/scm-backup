import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";
import vendorRoutes from "./routes/vendor.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import blogRoutes from "./routes/blog.js";
import chatRoutes from "./routes/chat.js";
import reviewRoutes from "./routes/review.js";
import shipmentRoutes from "./routes/shipment.js";
import trackingRoutes from "./routes/tracking.js";
import warehouseRoutes from "./routes/warehouse.js";
import iotDeviceRoutes from "./routes/iot-device.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup for real-time GPS tracking
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Make io accessible to routes
app.set('io', io);

// establishing middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/iot-devices', iotDeviceRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('📍 GPS Tracker connected:', socket.id);

    // Join shipment tracking room
    socket.on('track:shipment', (trackingCode) => {
        socket.join(`shipment:${trackingCode}`);
        console.log(`👀 Tracking shipment: ${trackingCode}`);
    });

    // --- CHAT SYSTEM ---
    socket.on('chat:join', (userId) => {
        socket.join(`user:${userId}`);
        console.log(`💬 User ${userId} joined their chat room (Socket: ${socket.id})`);
    });

    socket.on('chat:message', (data) => {
        const { senderId, receiverId, message, senderName } = data;

        // Only process if we have valid data (backend controller is primary, this is fallback)
        if (!senderId || !receiverId || !message) {
            console.log('⚠️ Invalid chat:message data, ignoring');
            return;
        }

        console.log(`📨 Chat message (fallback):`, {
            from: senderId,
            to: receiverId,
            senderName,
            messagePreview: message.substring(0, 30)
        });

        // Emit to receiver's room for real-time chat update
        io.to(`user:${receiverId}`).emit('chat:receive', {
            senderId: parseInt(senderId),
            receiverId: parseInt(receiverId),
            message,
            senderName: senderName || 'User',
            timestamp: new Date()
        });

        // Emit notification to receiver (only if not from themselves)
        if (parseInt(senderId) !== parseInt(receiverId)) {
            io.to(`user:${receiverId}`).emit('chat:notification', {
                senderId: parseInt(senderId),
                senderName: senderName || 'User',
                messagePreview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                timestamp: new Date()
            });
        }

        console.log(`✅ Message delivered to user:${receiverId} room`);
    });

    socket.on('chat:typing', (data) => {
        const { senderId, receiverId, isTyping } = data;
        io.to(`user:${receiverId}`).emit('chat:typing', { senderId, isTyping });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('👋 Socket disconnected:', socket.id);
    });

    // GPS location update from IoT device
    socket.on('location:update', (data) => {
        const { trackingCode, latitude, longitude, accuracy, speed, heading, batteryLevel } = data;

        // Broadcast to all clients tracking this shipment
        io.to(`shipment:${trackingCode}`).emit('location:updated', {
            latitude,
            longitude,
            accuracy,
            speed,
            heading,
            batteryLevel,
            timestamp: new Date()
        });

        console.log(`📍 Location update for ${trackingCode}:`, { latitude, longitude });
    });

    // Shipment status update
    socket.on('status:update', (data) => {
        const { trackingCode, status } = data;
        io.to(`shipment:${trackingCode}`).emit('status:updated', { status, timestamp: new Date() });
        console.log(`📦 Status update for ${trackingCode}: ${status}`);
    });

    // Device offline notification
    socket.on('device:offline', (data) => {
        const { trackingCode, deviceId } = data;
        io.to(`shipment:${trackingCode}`).emit('device:offline', { deviceId, timestamp: new Date() });
        console.log(`⚠️ Device ${deviceId} went offline`);
    });

    // Device reconnected
    socket.on('device:online', (data) => {
        const { trackingCode, deviceId } = data;
        io.to(`shipment:${trackingCode}`).emit('device:online', { deviceId, timestamp: new Date() });
        console.log(`✅ Device ${deviceId} reconnected`);
    });

    socket.on('disconnect', () => {
        console.log('📍 GPS Tracker disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📍 Socket.io ready for real-time GPS tracking`);
});
