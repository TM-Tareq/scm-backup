import { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';
import api from '../../config/api';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { socket } from '../../utils/socket';

const ChatModal = ({ isOpen, onClose, vendorId, vendorName }) => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (isOpen && vendorId && user) {
            fetchMessages();

            // Ensure socket is connected (global manager handles connection, but we ensure join)
            if (!socket.connected) {
                socket.connect();
            }
            socket.emit('chat:join', user.id);

            console.log(`🔌 ChatModal: Listening for messages from vendor ${vendorId}`);

            // Listen for incoming messages in THIS chat
            const handleReceive = (data) => {
                console.log('📨 ChatModal received message:', data, 'vendorId:', vendorId);
                // Normalize IDs for comparison (handle both string and number)
                const normalizedSenderId = parseInt(data.senderId);
                const normalizedVendorId = parseInt(vendorId);
                const normalizedReceiverId = parseInt(data.receiverId);
                const currentUserId = parseInt(user.id);

                // Show if it's from the vendor OR if it's a message WE sent (for multiple tabs sync)
                const isFromVendor = normalizedSenderId === normalizedVendorId;
                const isFromMeToVendor = normalizedSenderId === currentUserId && normalizedReceiverId === normalizedVendorId;

                if (isFromVendor || isFromMeToVendor) {
                    console.log('✅ Message matches chat context, adding to chat');
                    setMessages(prev => {
                        // Avoid duplicates
                        const exists = prev.some(m =>
                            parseInt(m.sender_id) === normalizedSenderId &&
                            m.message === data.message &&
                            Math.abs(new Date(m.created_at) - new Date(data.timestamp || new Date())) < 2000
                        );
                        if (exists) {
                            console.log('⚠️ Duplicate message detected, skipping');
                            return prev;
                        }

                        return [...prev, {
                            sender_id: normalizedSenderId,
                            message: data.message,
                            created_at: data.timestamp || new Date()
                        }];
                    });
                } else {
                    console.log('❌ Message not relevant to this chat, ignoring');
                }
            };

            socket.on('chat:receive', handleReceive);

            // Don't listen to notifications here - global manager handles that
            // But we can refresh messages if needed

            socket.on('chat:typing', (data) => {
                if (data.senderId === vendorId || data.senderId === parseInt(vendorId)) {
                    setIsTyping(data.isTyping);
                }
            });

            return () => {
                socket.off('chat:receive', handleReceive);
                socket.off('chat:typing');
                // DON'T disconnect - global manager handles that
            };
        }
    }, [isOpen, vendorId, user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            console.log(`📬 Fetching messages with vendor ${vendorId}`);
            const response = await api.get(`/chat/messages/${vendorId}`);
            console.log(`✅ Loaded ${response.data.length} messages`);
            setMessages(response.data);
        } catch (err) {
            console.error('Fetch messages failed', err);
            toast.error('Failed to load messages');
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const messageData = {
                receiverId: vendorId,
                message: newMessage,
                senderId: user.id,
                senderName: user.fname
            };

            // Send via API (backend will emit socket event)
            await api.post('/chat/send', { receiverId: vendorId, message: newMessage });

            // Optimistically add message to UI (backend socket will also send it back for confirmation)
            setMessages(prev => {
                const newMsg = {
                    sender_id: user.id,
                    message: newMessage,
                    created_at: new Date()
                };
                // Avoid duplicates
                const exists = prev.some(m =>
                    m.sender_id === newMsg.sender_id &&
                    m.message === newMsg.message &&
                    Math.abs(new Date(m.created_at) - new Date(newMsg.created_at)) < 2000
                );
                return exists ? prev : [...prev, newMsg];
            });

            setNewMessage('');
            toast.success('Message sent!');
        } catch (err) {
            console.error('Send message error:', err);
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-end justify-end p-6 pointer-events-none">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col h-[500px] pointer-events-auto overflow-hidden transition-colors">
                {/* Header */}
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">{vendorName}</h3>
                            <p className="text-xs text-blue-100 font-medium">Vendor</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${msg.sender_id === user.id
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex gap-2">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                        <Send className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
