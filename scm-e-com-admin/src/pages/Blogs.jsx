import { useState, useEffect } from 'react';
import { Newspaper, Check, X, Eye, RefreshCw } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingBlogs = async () => {
        setLoading(true);
        try {
            console.log('Fetching pending blogs...');
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);
            
            const response = await api.get('/blogs/admin/pending');
            console.log('Pending blogs response:', response.data);
            console.log('Number of blogs:', response.data?.length || 0);
            
            if (Array.isArray(response.data)) {
                setBlogs(response.data);
            } else {
                console.warn('Response data is not an array:', response.data);
                setBlogs([]);
            }
        } catch (err) {
            console.error('Fetch pending blogs failed', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                statusText: err.response?.statusText
            });
            
            if (err.response?.status === 401) {
                toast.error('Authentication required. Please login again.');
            } else if (err.response?.status === 403) {
                toast.error('Access denied. Admin privileges required.');
            } else {
                toast.error(err.response?.data?.message || err.message || 'Failed to load pending blogs');
            }
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingBlogs();
    }, []);

    const handleStatus = async (id, status) => {
        try {
            await api.put('/blogs/admin/status', { id, status });
            toast.success(`Blog ${status === 'accepted' ? 'approved' : 'rejected'}`);
            setBlogs(blogs.filter(b => b.id !== id));
            // Refresh the list to ensure consistency
            setTimeout(() => fetchPendingBlogs(), 500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                        <Newspaper className="text-blue-600" /> Blog Moderation
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Approve or reject user-submitted blog posts</p>
                </div>
                <button
                    onClick={fetchPendingBlogs}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center border border-gray-100 dark:border-slate-800 transition-colors">
                    <Newspaper className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">No pending blog posts</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">All submitted blogs have been reviewed</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white dark:bg-slate-900 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors flex flex-col md:flex-row h-full">
                            {blog.image_url && (
                                <div className="md:w-64 h-48 md:h-auto shrink-0 bg-gray-100 dark:bg-slate-800 border-r border-gray-100 dark:border-slate-800">
                                    <img
                                        src={`http://localhost:5000/${blog.image_url.split(',')[0]}`}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800' }}
                                    />
                                </div>
                            )}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold dark:text-white leading-tight">{blog.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatus(blog.id, 'accepted')}
                                                className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" title="Approve">
                                                <Check className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleStatus(blog.id, 'rejected')}
                                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Reject">
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">By {blog.fname} {blog.lname} • {new Date(blog.created_at).toLocaleDateString()}</p>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 transition-colors text-sm leading-relaxed">
                                        {blog.content}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {blog.category}
                                    </span>
                                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold">
                                        <Eye className="h-4 w-4" /> Preview Full Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;
