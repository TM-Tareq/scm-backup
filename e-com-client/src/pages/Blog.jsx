import { Newspaper, ArrowRight, Calendar, User, Heart, MessageCircle, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Blog = () => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'General', image: null });
    const [preview, setPreview] = useState(null);

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

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newBlog.content.length < 100) {
            toast.error('Content must be at least 100 characters');
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('title', newBlog.title.trim());
        formData.append('content', newBlog.content.trim());
        formData.append('category', newBlog.category);
        if (newBlog.image) {
            formData.append('images', newBlog.image);
        }

        try {
            const response = await api.post('/blogs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Blog submission response:', response.data);
            toast.success('Blog submitted for approval! It will be reviewed by our team.');
            setShowModal(false);
            setNewBlog({ title: '', content: '', category: 'General', image: null });
            setPreview(null);
            fetchBlogs(); // Refresh the blog list
        } catch (err) {
            console.error('Blog submission error:', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to submit blog. Please try again.';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
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
                                            <button
                                                onClick={() => {
                                                    const comment = prompt('Enter your comment:');
                                                    if (comment) {
                                                        api.post('/blogs/comment', { blogId: post.id, content: comment })
                                                            .then(() => {
                                                                toast.success('Comment added');
                                                                fetchBlogs();
                                                            })
                                                            .catch(() => toast.error('Failed to add comment'));
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">{post.comment_count || 0}</span>
                                            </button>
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

            {/* Enhanced Modal for submission */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden transition-colors max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-xl">
                                    <Newspaper className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white">Create New Blog Post</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Share your insights with the community</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setNewBlog({ title: '', content: '', category: 'General', image: null });
                                    setPreview(null);
                                }} 
                                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    maxLength={200}
                                    value={newBlog.title}
                                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter a catchy, descriptive title..."
                                />
                                <p className="text-xs text-gray-400 mt-1">{newBlog.title.length}/200 characters</p>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={newBlog.category}
                                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option>General</option>
                                    <option>Tech</option>
                                    <option>Fashion</option>
                                    <option>Lifestyle</option>
                                    <option>Shopping</option>
                                    <option>Business</option>
                                    <option>Health</option>
                                    <option>Travel</option>
                                </select>
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Cover Image <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-600 transition-all cursor-pointer relative overflow-hidden group bg-gray-50/50 dark:bg-slate-800/50">
                                    {preview ? (
                                        <div className="relative w-full aspect-video group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-lg" />
                                            <button
                                                type="button"
                                                onClick={() => { setPreview(null); setNewBlog({ ...newBlog, image: null }); }}
                                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
                                        </div>
                                    ) : (
                                        <label className="space-y-3 text-center cursor-pointer w-full">
                                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                                <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                                    Click to upload
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400"> or drag and drop</span>
                                            </div>
                                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        if (file.size > 5 * 1024 * 1024) {
                                                            toast.error('File size must be less than 5MB');
                                                            return;
                                                        }
                                                        setNewBlog({ ...newBlog, image: file });
                                                        setPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={10}
                                    maxLength={5000}
                                    value={newBlog.content}
                                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Write your blog post content here... Share your thoughts, insights, and experiences with the community."
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-400">{newBlog.content.length}/5000 characters</p>
                                    <p className="text-xs text-gray-400">Minimum 100 characters required</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewBlog({ title: '', content: '', category: 'General', image: null });
                                        setPreview(null);
                                    }}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={newBlog.content.length < 100 || submitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit for Approval'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Blog;
