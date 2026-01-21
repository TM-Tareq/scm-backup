import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Plus, Search, HelpCircle,
    ChevronDown, ChevronUp, Edit3, Trash2,
    Eye, EyeOff, GripVertical, Check
} from 'lucide-react';

const FaqManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        // Mock data
        setTimeout(() => {
            setFaqs([
                { id: 1, question: 'How do I apply for a vendor account?', answer: 'You can apply by clicking the "Become a Vendor" button on the homepage and filling out the application form. Our team will review it within 48 hours.', category: 'General', status: 'published' },
                { id: 2, question: 'What are the platform commission rates?', answer: 'The standard commission rate is 10% per transaction. High-volume vendors may be eligible for custom rates.', category: 'Finance', status: 'published' },
                { id: 3, question: 'How long do payouts take?', answer: 'Payouts are processed bi-weekly (1st and 15th of every month) for all completed orders.', category: 'Finance', status: 'draft' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">FAQ Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Edit and organize platform help content</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium">
                    <Plus className="w-4 h-4" />
                    New Question
                </button>
            </div>

            {/* Categories & Filter */}
            <div className="flex flex-wrap gap-2">
                {['All Questions', 'General', 'Shipping', 'Finance', 'Security', 'Drafts'].map((cat, i) => (
                    <button key={i} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-white dark:bg-slate-900 border border-slate-200 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                        }`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search existing FAQs..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-xl animate-pulse"></div>
                    ))
                ) : faqs.map((faq) => (
                    <div key={faq.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group">
                        <div
                            onClick={() => toggleExpand(faq.id)}
                            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50"
                        >
                            <div className="flex items-center gap-4">
                                <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                                <HelpCircle className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white">{faq.question}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{faq.category}</span>
                                        <span className={`w-1 h-1 rounded-full ${faq.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                        <span className="text-[10px] text-slate-400">{faq.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white dark:bg-slate-900 rounded-lg transition border border-transparent hover:border-slate-100 dark:border-slate-800 shadow-sm">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-white dark:bg-slate-900 rounded-lg transition border border-transparent hover:border-slate-100 dark:border-slate-800 shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {expanded === faq.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                        </div>
                        <AnimatePresence>
                            {expanded === faq.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-16 pb-6"
                                >
                                    <div className="p-4 bg-slate-50 rounded-lg text-slate-600 dark:text-slate-300 border-l-4 border-indigo-500">
                                        {faq.answer}
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                            {faq.status === 'published' ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish Now</>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center shadow-xl shadow-indigo-100 border border-indigo-500/20">
                <h3 className="font-bold text-lg mb-2">Need to update platform policies?</h3>
                <p className="text-indigo-100 text-sm mb-4">Bulk changes can be scheduled to take effect across all help centers.</p>
                <button className="bg-white dark:bg-slate-900 text-indigo-600 px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition">
                    Access Help Center Engine
                </button>
            </div>
        </div>
    );
};

export default FaqManager;
