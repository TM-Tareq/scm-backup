import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, removeItemCompletely, totalPrice, cartCount } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors px-4 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-48 h-48 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 mx-auto">
            <ShoppingCart className="w-24 h-24 text-blue-500 dark:text-blue-400 opacity-80" />
          </div>
        </motion.div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-md mx-auto">
          Look like you haven't added anything to your cart yet. Explore our premium collection today.
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition shadow-xl hover:shadow-2xl flex items-center gap-2"
        >
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-3">
          Shopping Bag
          <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">({cartCount()} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md p-6 flex gap-6 border border-gray-100 dark:border-slate-800 transition-all group"
                >
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden p-2">
                    <img
                      src={item.product.image?.startsWith('http') ? item.product.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${item.product.image}`}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItemCompletely(item.product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Sold by: {item.product.store_name || "Official Store"}
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 bg-white dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 shadow-sm transition"
                        >
                          <Minus className="w-4 h-4 text-gray-600 dark:text-white" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="p-2 bg-white dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 shadow-sm transition"
                        >
                          <Plus className="w-4 h-4 text-gray-600 dark:text-white" />
                        </button>
                      </div>
                      {item.product.stock <= 5 && (
                        <span className="text-xs text-red-500 font-medium">Low Stock: {item.product.stock} left</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-slate-800 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping Estimate</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax Estimate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
                </div>
                <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">${totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/checkout'}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>Free shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;