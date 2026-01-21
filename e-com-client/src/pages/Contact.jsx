import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Info */}
                    <div>
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Get in touch</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Have a question or just want to say hi? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-center">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-slate-800 transition-colors">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email us</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">support@myshop.com</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-slate-800 transition-colors">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Call us</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">+1 (555) 000-0000</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-slate-800 transition-colors">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Visit us</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">123 Commerce St, San Francisco, CA</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <button key={i} className="p-4 bg-gray-200 dark:bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                    <Icon className="w-6 h-6" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100 dark:border-slate-800 transition-colors">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                    <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors" placeholder="How can we help?" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-40 dark:text-white transition-colors" placeholder="Your message here..."></textarea>
                            </div>
                            <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
