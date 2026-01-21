import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, removeItemCompletely, totalPrice, cartCount } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors">
        <ShoppingCart className="w-32 h-32 text-gray-200 dark:text-slate-800 mb-8" />
        <h2 className="text-4xl font-black text-gray-600 dark:text-slate-700 mb-4 tracking-tighter">Your Bag is Empty</h2>
        <p className="text-xl text-gray-400 font-medium">Add some premium products to get started!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-10">Shopping Cart ({cartCount()})</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 flex gap-6 border border-gray-100 dark:border-slate-800 transition-colors">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />

                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Minus className="w-4 h-4 dark:text-white" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product)}
                      className="p-2 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Plus className="w-4 h-4 dark:text-white" />
                    </button>

                    <button
                      onClick={() => removeItemCompletely(item.product.id)}
                      className="ml-auto p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 h-fit border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold dark:text-white">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
              </div>
              <div className="border-t dark:border-slate-800 pt-4 flex justify-between text-xl font-bold dark:text-white">
                <span>Total</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/checkout'}
              className="w-full py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition block text-center"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;