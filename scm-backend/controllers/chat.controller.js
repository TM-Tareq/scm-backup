import db from '../db.js';

export const sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    try {
        console.log(`💬 Storing message: User ${senderId} → User ${receiverId}`);

        await db.query(
            'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiverId, message]
        );

        console.log(`✅ Message stored in database`);

        // Emit real-time events from the backend so chat works even if the frontend doesn't emit
        const io = req.app?.get?.('io');
        if (io) {
            // Get sender's full name from database for accurate display
            const [senderInfo] = await db.query(
                'SELECT fname, lname FROM users WHERE id = ?',
                [senderId]
            );
            const senderName = senderInfo[0]
                ? `${senderInfo[0].fname || ''} ${senderInfo[0].lname || ''}`.trim() || 'User'
                : req.user?.fname || 'User';

            // Emit to receiver's room
            io.to(`user:${receiverId}`).emit('chat:receive', {
                senderId: parseInt(senderId),
                receiverId: parseInt(receiverId),
                message,
                senderName,
                timestamp: new Date()
            });

            // Emit notification (only to receiver, not sender)
            io.to(`user:${receiverId}`).emit('chat:notification', {
                senderId: parseInt(senderId),
                senderName,
                messagePreview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                timestamp: new Date()
            });
        }

        res.status(201).json({ message: 'Message sent' });
    } catch (err) {
        console.error('❌ Send Message Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    try {
        console.log(`📬 Fetching messages between User ${userId} and User ${otherUserId}`);

        const [messages] = await db.query(
            `SELECT * FROM chat_messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?) 
             ORDER BY created_at ASC`,
            [userId, otherUserId, otherUserId, userId]
        );

        console.log(`✅ Found ${messages.length} messages`);

        // Mark as read
        await db.query(
            'UPDATE chat_messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?',
            [otherUserId, userId]
        );

        res.json(messages);
    } catch (err) {
        console.error('❌ Get Messages Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getChatList = async (req, res) => {
    const userId = req.user.id;
    try {
        // Get unique users who have messaged this user or vice versa
        // Ensure we get accurate user data and avoid duplicates
        const [chats] = await db.query(
            `SELECT DISTINCT
                u.id,
                COALESCE(u.fname, '') AS fname,
                COALESCE(u.lname, '') AS lname,
                COALESCE(u.role, 'customer') AS role,
                (
                    SELECT COUNT(*)
                    FROM chat_messages m2
                    WHERE m2.sender_id = u.id
                      AND m2.receiver_id = ?
                      AND m2.is_read = FALSE
                ) AS unread_count,
                (
                    SELECT m3.message
                    FROM chat_messages m3
                    WHERE (m3.sender_id = u.id AND m3.receiver_id = ?)
                       OR (m3.sender_id = ? AND m3.receiver_id = u.id)
                    ORDER BY m3.created_at DESC
                    LIMIT 1
                ) AS last_message,
                (
                    SELECT m4.created_at
                    FROM chat_messages m4
                    WHERE (m4.sender_id = u.id AND m4.receiver_id = ?)
                       OR (m4.sender_id = ? AND m4.receiver_id = u.id)
                    ORDER BY m4.created_at DESC
                    LIMIT 1
                ) AS last_message_at
             FROM users u
             INNER JOIN chat_messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
             WHERE (m.sender_id = ? OR m.receiver_id = ?) 
               AND u.id != ?
               AND u.id IS NOT NULL
             GROUP BY u.id, u.fname, u.lname, u.role
             ORDER BY last_message_at DESC`,
            [userId, userId, userId, userId, userId, userId, userId, userId]
        );

        // Clean up the data to ensure no null/undefined values
        const cleanedChats = chats.map(chat => ({
            id: parseInt(chat.id),
            fname: chat.fname || 'Unknown',
            lname: chat.lname || 'User',
            role: chat.role || 'customer',
            unread_count: parseInt(chat.unread_count) || 0,
            last_message: chat.last_message || '',
            last_message_at: chat.last_message_at || null
        }));

        res.json(cleanedChats);
    } catch (err) {
        console.error('❌ Get Chat List Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getUnreadCount = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) AS unread_count FROM chat_messages WHERE receiver_id = ? AND is_read = FALSE',
            [userId]
        );
        res.json({ unread_count: rows?.[0]?.unread_count ?? 0 });
    } catch (err) {
        console.error('❌ Get Unread Count Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
