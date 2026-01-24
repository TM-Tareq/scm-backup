import { useState, useEffect } from 'react';
import { Search, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';
import ChatModal from '../common/components/ChatModal';
import toast from 'react-hot-toast';

const MessagesPage = () => {
    const { user } = useAuthStore();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null); // Vendor object to pass to ChatModal

    useEffect(() => {
        fetchChatList();
    }, []);

    const fetchChatList = async () => {
        try {
            const response = await api.get('/chat/list');
            setChats(response.data);
        } catch (err) {
            console.error('Fetch chat list failed', err);
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChat = (chat) => {
        setSelectedChat({
            vendorId: chat.id,
            store_name: chat.store_name || `${chat.fname} ${chat.lname}`
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Messages</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your conversations with sellers</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
                    {chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <MessageSquare className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No messages yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                When you contact a seller from a product page, your conversations will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-slate-800">
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleOpenChat(chat)}
                                    className="w-full p-6 flex items-center gap-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                                            {chat.fname?.[0]}{chat.lname?.[0]}
                                        </div>
                                        {chat.unread_count > 0 && (
                                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                                {chat.unread_count}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                                {chat.store_name || `${chat.fname} ${chat.lname}`}
                                            </h3>
                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {chat.last_message_at ? new Date(chat.last_message_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            {chat.last_message || 'No messages yet'}
                                        </p>
                                        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                                            {chat.role || 'Vendor'}
                                        </span>
                                    </div>

                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedChat && (
                <ChatModal
                    isOpen={!!selectedChat}
                    onClose={() => {
                        setSelectedChat(null);
                        fetchChatList(); // Refresh list on close to update unread counts
                    }}
                    vendorId={selectedChat.vendorId}
                    vendorName={selectedChat.store_name}
                />
            )}
        </div>
    );
};

export default MessagesPage;
