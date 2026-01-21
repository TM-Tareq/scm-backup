import { useState } from 'react';
import { CreditCard, Truck, ShieldCheck, ChevronRight, MapPin } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import api from '../config/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cart, totalPrice, clearCartOnLogout } = useCartStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        paymentMethod: 'credit_card',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                items: cart,
                totalPrice: totalPrice(),
                shippingDetails: {
                    fname: formData.fname,
                    lname: formData.lname,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                },
                paymentMethod: formData.paymentMethod
            };

            await api.post('/orders', orderData);
            setStep(3);
            toast.success('Order placed successfully!');
        } catch (err) {
            console.error('Checkout failed:', err);
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
                <a href="/" className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Continue Shopping</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Side: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Progress Stepper */}
                        <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-8 overflow-x-auto">
                            <span className={step === 1 ? "text-blue-600 flex items-center gap-1" : "text-green-500 flex items-center gap-1"}>
                                {step > 1 && <ShieldCheck className="w-4 h-4" />} SHIPPING
                            </span>
                            <ChevronRight className="w-4 h-4" />
                            <span className={step === 2 ? "text-blue-600" : step > 2 ? "text-green-500 flex items-center gap-1" : ""}>
                                {step > 2 && <ShieldCheck className="w-4 h-4" />} PAYMENT
                            </span>
                            <ChevronRight className="w-4 h-4" />
                            <span className={step === 3 ? "text-blue-600" : ""}>CONFIRMATION</span>
                        </div>

                        {step === 1 && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10 animate-fade-in transition-colors">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 dark:text-white">
                                    <Truck className="text-blue-600" /> Shipping Information
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input
                                            name="fname"
                                            value={formData.fname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="First Name"
                                        />
                                        <input
                                            name="lname"
                                            value={formData.lname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Full Address"
                                    />
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="City"
                                        />
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="State"
                                        />
                                        <input
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="ZIP Code"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10 animate-fade-in transition-colors">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 dark:text-white">
                                    <CreditCard className="text-blue-600" /> Payment Details
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 mb-8">
                                        <button
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                                            className={`flex-1 py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <CreditCard className={formData.paymentMethod === 'credit_card' ? 'text-blue-600' : 'text-gray-400'} />
                                            <span className={`text-xs font-bold ${formData.paymentMethod === 'credit_card' ? 'text-blue-600' : 'text-gray-400'}`}>Credit Card</span>
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                                            className={`flex-1 py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <div className={`font-bold ${formData.paymentMethod === 'paypal' ? 'text-blue-600' : 'text-gray-400'}`}>PayPal</div>
                                            <span className="text-xs font-bold text-gray-400">Digital Wallet</span>
                                        </button>
                                    </div>
                                    <input
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Card Number"
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input
                                            name="expiry"
                                            value={formData.expiry}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="MM/YY"
                                        />
                                        <input
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="CVV"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handlePlaceOrder}
                                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : `Place Order ($${totalPrice().toFixed(2)})`}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-16 text-center animate-fade-in transition-colors">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <ShieldCheck className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Thank you for your purchase. We've sent a confirmation email with your order details and tracking number.</p>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                                >
                                    Back to Home
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 h-fit transition-colors">
                        <h3 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h3>
                        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex gap-4">
                                    <img src={item.product.image} className="w-16 h-16 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        <p className="text-sm font-bold text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-800 dark:text-white">${totalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span className="font-bold text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-slate-800">
                                <span>Total</span>
                                <span>${totalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
