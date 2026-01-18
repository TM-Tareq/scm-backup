import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, removeItemCompletely, totalPrice, cartCount } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <ShoppingCart className="w-32 h-32 text-gray-300 mb-8" />
        <h2 className="text-4xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
        <p className="text-xl text-gray-500">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Shopping Cart ({cartCount()})</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white rounded-xl shadow-md p-6 flex gap-6">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />

                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeItemCompletely(item.product.id)}
                      className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-md p-8 h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;