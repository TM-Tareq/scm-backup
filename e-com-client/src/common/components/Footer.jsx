import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">MyShop</h3>
          <p className="text-gray-400 mb-6">
            Your one-stop shop for electronics, gadgets, and more.
          </p>
          <p className="text-gray-400">© 2025 MyShop. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
            <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Stay Connected</h4>
          <p className="text-gray-400 mb-4">Subscribe to get special offers and updates</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
            />
            <button className="bg-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;