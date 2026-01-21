import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [expanded, setExpanded] = useState(null);

    const faqs = [
        {
            q: "How long does shipping take?",
            a: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery in most major cities."
        },
        {
            q: "What is your return policy?",
            ae: "We offer a 30-day hassle-free return policy. Products must be in their original packaging and condition."
        },
        {
            q: "Are the products authentic?",
            a: "Absolutely. We work directly with certified vendors and brands to ensure 100% authenticity for every product on our platform."
        },
        {
            q: "How can I track my order?",
            a: "Go to the 'Order Tracking' section in the header and enter your Order ID. You'll also receive email updates as your package moves."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                        <HelpCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 dark:text-gray-400">Everything you need to know about our products and services</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                            <button
                                onClick={() => setExpanded(expanded === i ? null : i)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="text-lg font-bold text-gray-800 dark:text-white">{faq.q}</span>
                                {expanded === i ? <ChevronUp className="text-blue-600 dark:text-blue-400" /> : <ChevronDown className="text-gray-400 dark:text-gray-500" />}
                            </button>
                            {expanded === i && (
                                <div className="px-8 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in">
                                    {faq.a || "We currently don't have a detailed answer for this, but our support team is happy to help!"}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-600 dark:bg-blue-500 rounded-3xl p-10 text-white text-center shadow-2xl shadow-blue-200 dark:shadow-blue-900/50 transition-colors">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="text-blue-100 dark:text-blue-200 mb-8">Can't find the answer you're looking for? Please contact our friendly team.</p>
                    <button className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                        Get In Touch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
