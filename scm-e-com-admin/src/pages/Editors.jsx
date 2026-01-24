import { useState, useEffect } from 'react';
import { Shield, UserPlus, Trash2, Mail, Calendar, CheckCircle, XCircle, Search, ShieldAlert, Award } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Editors = () => {
    const [editors, setEditors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEditors = async () => {
        try {
            const response = await api.get('/admin/editors');
            setEditors(response.data);
        } catch (err) {
            console.error('Fetch editors failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEditors();
    }, []);

    const handleStatus = async (id, status) => {
        try {
            await api.put('/admin/editors/status', { id, status });
            toast.success(`Editor ${status}`);
            setEditors(editors.map(e => e.id === id ? { ...e, status } : e));
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to demote this editor to a regular customer?')) return;
        try {
            await api.delete(`/admin/editors/${id}`);
            toast.success('Editor demoted');
            setEditors(editors.filter(e => e.id !== id));
        } catch (err) {
            toast.error('Failed to demote editor');
        }
    };

    const filteredEditors = editors.filter(e =>
        `${e.fname} ${e.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
    });

    const handleAddEditor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/add-editor', formData);
            toast.success('Editor authorized successfully');
            setShowModal(false);
            setFormData({ fname: '', lname: '', email: '', password: '' });
            fetchEditors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add editor');
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black flex items-center gap-4 dark:text-white tracking-tighter">
                        <Shield className="text-blue-600 w-10 h-10" /> Staff Infrastructure
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Provision and manage administrative privileges across the ecosystem</p>
                </div>
                <button
                    className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs active:scale-95"
                    onClick={() => setShowModal(true)}
                >
                    <UserPlus className="w-5 h-5" /> Authorize Personnel
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 transition-colors">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Scan for personnel by identifier or email..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-6 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Status Monitoring</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(n => <div key={n} className="h-64 bg-white dark:bg-slate-900 animate-pulse rounded-[2.5rem] border border-gray-100 dark:border-slate-800" />)}
                </div>
            ) : filteredEditors.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-32 rounded-[3rem] text-center border-2 border-dashed border-gray-100 dark:border-slate-800 transition-colors">
                    <ShieldAlert className="w-20 h-20 text-gray-200 dark:text-slate-800 mx-auto mb-6" />
                    <p className="text-gray-400 text-xl font-black tracking-tight">Access Matrix Vacant</p>
                    <p className="text-gray-500 mt-2 text-sm font-medium">No personnel currently hold editor-level credentials in this registry.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEditors.map((editor) => (
                        <div key={editor.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-2xl hover:shadow-blue-600/5 group relative overflow-hidden">
                            {/* Abstract Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-lg uppercase">
                                    {editor.fname[0]}{editor.lname[0]}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-black text-xl dark:text-white truncate tracking-tight">{editor.fname} {editor.lname}</h3>
                                    <span className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${editor.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {editor.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        {editor.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 bg-gray-50/50 dark:bg-slate-800/50 p-6 rounded-3xl relative z-10 transition-colors">
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
                                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                        <Mail size={14} className="text-blue-500" />
                                    </div>
                                    <span className="truncate">{editor.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
                                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                        <Calendar size={14} className="text-indigo-500" />
                                    </div>
                                    <span>Joined {new Date(editor.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
                                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                        <Award size={14} className="text-amber-500" />
                                    </div>
                                    <span className="uppercase text-[10px] tracking-widest">Content Authorization Level 2</span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 relative z-10">
                                {editor.status === 'active' ? (
                                    <button
                                        onClick={() => handleStatus(editor.id, 'inactive')}
                                        className="flex-1 py-4 text-xs font-black text-red-600 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all uppercase tracking-widest"
                                    >
                                        Revoke Token
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatus(editor.id, 'active')}
                                        className="flex-1 py-4 text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-all uppercase tracking-widest"
                                    >
                                        Re-Authorize
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(editor.id)}
                                    className="p-4 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all shadow-sm bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 group/trash" title="Demote Personnel"
                                >
                                    <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Editor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 animate-fade-in mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                <UserPlus className="text-blue-600" /> New Personnel
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEditor} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">First Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        value={formData.fname}
                                        onChange={e => setFormData({ ...formData, fname: e.target.value })}
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Last Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        value={formData.lname}
                                        onChange={e => setFormData({ ...formData, lname: e.target.value })}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="editor@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition uppercase tracking-widest text-xs mt-4 shadow-lg shadow-blue-600/30"
                            >
                                Authorize Access
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editors;
