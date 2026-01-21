import { useState, useEffect } from 'react';
import { Newspaper, Check, X, Eye } from 'lucide-react';
import api from '../api'; // Assuming there is an api config
import toast from 'react-hot-toast';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingBlogs = async () => {
        try {
            const response = await api.get('/blogs/admin/pending');
            setBlogs(response.data);
        } catch (err) {
            console.error('Fetch pending blogs failed', err);
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
            toast.success(`Blog ${status}`);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (err) {
            toast.error('Failed to update status');
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
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center border border-gray-100 dark:border-slate-800 transition-colors">
                    <p className="text-gray-400 dark:text-gray-500">No pending blog posts</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold dark:text-white">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">By {blog.fname} {blog.lname} • {new Date(blog.created_at).toLocaleDateString()}</p>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 transition-colors">
                                        {blog.content}
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase transition-colors">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleStatus(blog.id, 'accepted')}
                                        className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" title="Approve">
                                        <Check className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleStatus(blog.id, 'rejected')}
                                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Reject">
                                        <X className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" title="View Details">
                                        <Eye className="h-5 w-5" />
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
