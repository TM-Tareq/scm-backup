import db from '../db.js';

export const sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    try {
        await db.query(
            'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiverId, message]
        );
        res.status(201).json({ message: 'Message sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    try {
        const [messages] = await db.query(
            `SELECT * FROM chat_messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?) 
             ORDER BY created_at ASC`,
            [userId, otherUserId, otherUserId, userId]
        );

        // Mark as read
        await db.query(
            'UPDATE chat_messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?',
            [otherUserId, userId]
        );

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getChatList = async (req, res) => {
    const userId = req.user.id;
    try {
        // Get unique users who have messaged this user or vice versa
        const [chats] = await db.query(
            `SELECT DISTINCT u.id, u.fname, u.lname, u.role
             FROM users u
             JOIN chat_messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
             WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?`,
            [userId, userId, userId]
        );
        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
