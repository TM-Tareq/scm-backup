import { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import api from '../api';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Messages = () => {
    const { user } = useAuthStore();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        fetchChatList();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChatList = async () => {
        try {
            const response = await api.get('/chat/list');
            setChats(response.data);
        } catch (err) {
            console.error('Fetch chat list failed', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const response = await api.get(`/chat/messages/${selectedChat.id}`);
            setMessages(response.data);
        } catch (err) {
            console.error('Fetch messages failed', err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            await api.post('/chat/send', { receiverId: selectedChat.id, message: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-all duration-500">
            {/* Chat List */}
            <div className="w-96 border-r border-gray-100 dark:border-slate-800 flex flex-col bg-gray-50/50 dark:bg-slate-900/50">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black dark:text-white tracking-tighter">Messages</h2>
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                        <input
                            placeholder="Identify customer..."
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 dark:text-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 px-4 pb-8 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4 px-4">
                            {[1, 2, 3].map(n => <div key={n} className="h-20 bg-white dark:bg-slate-800/50 animate-pulse rounded-2xl border border-gray-50 dark:border-slate-800" />)}
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No active channels</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full p-5 flex items-center gap-4 rounded-2xl transition-all ${selectedChat?.id === chat.id
                                    ? 'bg-white dark:bg-slate-800 shadow-xl shadow-blue-600/5 border border-blue-50 dark:border-blue-900/20 translate-x-1'
                                    : 'hover:bg-white dark:hover:bg-slate-800/50 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                        {chat.fname[0]}{chat.lname[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div className="text-left overflow-hidden flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-black truncate tracking-tight">{chat.fname} {chat.lname}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 opacity-60">5m</span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{chat.role}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-colors">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-lg">
                                    {selectedChat.fname[0]}{selectedChat.lname[0]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black dark:text-white tracking-tight">{selectedChat.fname} {selectedChat.lname}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Link</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    <ShieldCheck size={20} />
                                </button>
                                <div className="h-8 w-px bg-gray-100 dark:border-slate-800"></div>
                                <button className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    <Clock size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50/20 dark:bg-slate-950/20 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[70%] p-6 rounded-3xl text-sm font-medium leading-relaxed ${msg.sender_id === user.id
                                        ? 'bg-blue-600 text-white rounded-br-none shadow-2xl shadow-blue-600/30 font-bold'
                                        : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-slate-800'
                                        }`}>
                                        {msg.message}
                                    </div>
                                    <p className="text-[10px] mt-3 font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        {msg.sender_id === user.id ? 'Transmission' : 'Received'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-8 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex gap-4 p-2 bg-gray-50 dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-800 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Execute response..."
                                    className="flex-1 px-8 py-4 bg-transparent dark:text-white border-none focus:ring-0 outline-none font-bold placeholder:text-gray-400"
                                />
                                <button type="submit" className="p-4 bg-blue-600 text-white rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center active:scale-95 group">
                                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
                        <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner group">
                            <MessageSquare className="w-16 h-16 text-blue-600 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <h3 className="text-4xl font-black dark:text-white mb-4 tracking-tighter">Unified Communications</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium leading-relaxed">System is operational. Select a priority customer channel from the matrix to initialize correspondence.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
