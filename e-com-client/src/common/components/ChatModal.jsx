import { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';
import api from '../../config/api';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const ChatModal = ({ isOpen, onClose, vendorId, vendorName }) => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (isOpen && vendorId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000); // Polling every 5s
            return () => clearInterval(interval);
        }
    }, [isOpen, vendorId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/messages/${vendorId}`);
            setMessages(response.data);
        } catch (err) {
            console.error('Fetch messages failed', err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post('/chat/send', { receiverId: vendorId, message: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            toast.error('Failed to send message');
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
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
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
