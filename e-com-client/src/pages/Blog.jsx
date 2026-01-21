import { Newspaper, ArrowRight, Calendar, User, Heart, MessageCircle, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Blog = () => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'General' });

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setPosts(response.data);
        } catch (err) {
            console.error('Fetch blogs failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/blogs', newBlog);
            toast.success('Blog submitted for approval!');
            setShowModal(false);
            setNewBlog({ title: '', content: '', category: 'General' });
        } catch (err) {
            toast.error('Failed to submit blog');
        }
    };

    const handleReaction = async (blogId, type) => {
        if (!user) return toast.error('Please login to react');
        try {
            await api.post('/blogs/react', { blogId, type });
            fetchBlogs(); // Refresh to get new counts
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                            <Newspaper className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">MyShop Blog</h1>
                            <p className="text-gray-600 dark:text-gray-400">Insights, trends, and platform updates</p>
                        </div>
                    </div>
                    {user && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="w-5 h-5" /> Write a Post
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-96 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl transition-colors">
                        <p className="text-gray-500">No blog posts found.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all group border border-gray-100 dark:border-slate-800">
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={post.image || `https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800`}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.fname}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">{post.content}</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleReaction(post.id, 'like')}
                                                className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="w-5 h-5" />
                                                <span className="text-sm font-medium">{post.like_count || 0}</span>
                                            </button>
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">{post.comment_count || 0}</span>
                                            </div>
                                        </div>
                                        <button className="text-blue-600 font-bold text-sm hover:underline">
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for submission */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in transition-colors">
                        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-2xl font-bold dark:text-white">Write a Blog Post</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                <input
                                    required
                                    value={newBlog.title}
                                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                    placeholder="Enter a catchy title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    value={newBlog.category}
                                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                >
                                    <option>General</option>
                                    <option>Tech</option>
                                    <option>Fashion</option>
                                    <option>Lifestyle</option>
                                    <option>Shopping</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Content</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={newBlog.content}
                                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                    placeholder="Share your thoughts..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                            >
                                Submit for Approval
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
