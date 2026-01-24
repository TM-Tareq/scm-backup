import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Plus, Bell, Calendar,
    X, Trash2, Edit2, Send, Clock,
    AlertCircle, CheckCircle, Info
} from 'lucide-react';
import api from '../api';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/admin/announcements');
            const formatted = res.data.map(a => ({
                id: a.id,
                title: a.title,
                content: a.message,
                type: a.type,
                status: new Date(a.end_date) < new Date() ? 'Expired' : 'Active',
                audience: a.audience,
                date: new Date(a.created_at).toLocaleDateString()
            }));
            setAnnouncements(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreate = async () => {
        const title = prompt('Enter Title:');
        if (!title) return;
        const message = prompt('Enter Message:');
        const type = prompt('Enter Type (info, warning, critical, success):', 'info');

        try {
            await api.post('/admin/announcements', {
                title,
                message,
                type,
                audience: 'All Users',
                start_date: new Date(),
                end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days default
            });
            fetchAnnouncements();
        } catch (err) {
            alert('Failed to create announcement');
        }
    };

    const TypeBadge = ({ type }) => {
        const styles = {
            critical: "bg-red-50 text-red-600 border-red-100",
            info: "bg-blue-50 text-blue-600 border-blue-100",
            success: "bg-emerald-50 text-emerald-600 border-emerald-100",
            warning: "bg-amber-50 text-amber-600 border-amber-100"
        };
        const icons = {
            critical: <AlertCircle className="w-3.5 h-3.5" />,
            info: <Info className="w-3.5 h-3.5" />,
            success: <CheckCircle className="w-3.5 h-3.5" />,
            warning: <AlertCircle className="w-3.5 h-3.5" />
        };
        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[type] || styles.info}`}>
                {icons[type] || icons.info}
                {type}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Platform Announcements</h1>
                    <p className="text-slate-500 dark:text-slate-400">Broadcast important updates to your users</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium">
                    <Plus className="w-4 h-4" />
                    New Announcement
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Alerts', value: announcements.filter(a => a.status === 'Active').length, color: 'text-indigo-600' },
                    { label: 'Total Sent', value: announcements.length, color: 'text-slate-600 dark:text-slate-300' },
                    { label: 'Avg Open Rate', value: 'N/A', color: 'text-emerald-600' },
                    { label: 'Scheduled', value: '0', color: 'text-amber-600' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
                        <h4 className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</h4>
                    </div>
                ))}
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-xl animate-pulse"></div>
                    ))
                ) : announcements.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No announcements found.</p>
                ) : announcements.map((a) => (
                    <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 group hover:border-indigo-200 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className={`p-4 rounded-xl shrink-0 h-fit ${a.type === 'critical' ? 'bg-red-50 text-red-500' :
                                a.type === 'info' ? 'bg-blue-50 text-blue-500' :
                                    a.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                                        'bg-emerald-50 text-emerald-500'
                                }`}>
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{a.title}</h3>
                                    <TypeBadge type={a.type} />
                                    <span className="ml-auto text-xs font-semibold text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {a.date}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">{a.content}</p>
                                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                    <div className="flex gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                            AUDIENCE: {a.audience}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                            STATUS: {a.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-500 transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5">
                                            <Send className="w-3 h-3" />
                                            Re-send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="text-center">
                    <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Drag legacy announcements here to archive them</p>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
