import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16 mt-16 border-t border-gray-800 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div className="space-y-6">
          <h3 className="text-3xl font-black tracking-tighter">MY<span className="text-blue-500">SHOP</span></h3>
          <p className="text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
            Elevating your digital lifestyle with curated electronics, premium gadgets, and seamless shopping experiences since 2025.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="w-4 h-4 bg-gray-400 rounded-sm"></span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-blue-500">Navigation</h4>
          <ul className="space-y-3 text-gray-400 dark:text-gray-500 font-medium">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Digital Home</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Insights & Blog</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Get in Touch</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400 transition-colors">Helper Center</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-blue-500">Assistance</h4>
          <ul className="space-y-3 text-gray-400 dark:text-gray-500 font-medium">
            <li><Link to="/track-order" className="hover:text-blue-400 transition-colors">Order Tracking</Link></li>
            <li><Link to="/returns" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Data Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Use</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-blue-500">Exclusive Updates</h4>
          <p className="text-gray-400 dark:text-gray-500 mb-6 font-medium">Join our mailing list for early access to product launches and seasonal offers.</p>
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:border-blue-500/50 transition-colors">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition">
              Join Now
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-gray-500 text-sm font-medium">© 2025 MYSHOP™ — Engineered for the modern world. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;