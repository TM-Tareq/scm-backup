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
        paymentMethod: 'bkash',
        bkashNumber: '',
        nagadNumber: '',
        transactionId: ''
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
            clearCartOnLogout(); // Clear local cart state
            setStep(3);
            toast.success('Order placed successfully!');
        } catch (err) {
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
                                    <CreditCard className="text-blue-600" /> Payment Method
                                </h2>
                                <div className="space-y-6">
                                    {/* Payment Method Selection */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                                            className={`py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <div className={`font-black text-lg ${formData.paymentMethod === 'bkash' ? 'text-pink-600' : 'text-gray-400'}`}>bKash</div>
                                            <span className="text-xs font-bold text-gray-400">Mobile Banking</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                                            className={`py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'nagad' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <div className={`font-black text-lg ${formData.paymentMethod === 'nagad' ? 'text-orange-600' : 'text-gray-400'}`}>Nagad</div>
                                            <span className="text-xs font-bold text-gray-400">Digital Payment</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                                            className={`py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'cod' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <Truck className={formData.paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-400'} />
                                            <span className={`text-xs font-bold ${formData.paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-400'}`}>Cash on Delivery</span>
                                        </button>
                                    </div>

                                    {/* Payment Instructions */}
                                    {formData.paymentMethod === 'bkash' && (
                                        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-6">
                                            <h3 className="font-bold text-pink-800 dark:text-pink-300 mb-3">bKash Payment Instructions</h3>
                                            <ol className="text-sm text-pink-700 dark:text-pink-400 space-y-2 list-decimal list-inside">
                                                <li>Open your bKash app</li>
                                                <li>Select "Send Money"</li>
                                                <li>Send <strong>৳{(totalPrice() * 120).toFixed(2)}</strong> to the merchant</li>
                                                <li>Enter your bKash number and transaction ID below</li>
                                            </ol>
                                            <input
                                                name="bkashNumber"
                                                value={formData.bkashNumber}
                                                onChange={handleChange}
                                                className="w-full mt-4 px-4 py-3 bg-white dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                                placeholder="Your bKash Number (01XXXXXXXXX)"
                                            />
                                            <input
                                                name="transactionId"
                                                value={formData.transactionId}
                                                onChange={handleChange}
                                                className="w-full mt-3 px-4 py-3 bg-white dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                                placeholder="Transaction ID"
                                            />
                                        </div>
                                    )}

                                    {formData.paymentMethod === 'nagad' && (
                                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                                            <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-3">Nagad Payment Instructions</h3>
                                            <ol className="text-sm text-orange-700 dark:text-orange-400 space-y-2 list-decimal list-inside">
                                                <li>Open your Nagad app</li>
                                                <li>Select "Send Money"</li>
                                                <li>Send <strong>৳{(totalPrice() * 120).toFixed(2)}</strong> to the merchant</li>
                                                <li>Enter your Nagad number and transaction ID below</li>
                                            </ol>
                                            <input
                                                name="nagadNumber"
                                                value={formData.nagadNumber}
                                                onChange={handleChange}
                                                className="w-full mt-4 px-4 py-3 bg-white dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Your Nagad Number (01XXXXXXXXX)"
                                            />
                                            <input
                                                name="transactionId"
                                                value={formData.transactionId}
                                                onChange={handleChange}
                                                className="w-full mt-3 px-4 py-3 bg-white dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Transaction ID"
                                            />
                                        </div>
                                    )}

                                    {formData.paymentMethod === 'cod' && (
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                                            <h3 className="font-bold text-green-800 dark:text-green-300 mb-3">Cash on Delivery</h3>
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                                Pay <strong>৳{(totalPrice() * 120).toFixed(2)}</strong> in cash when you receive your order.
                                                Please keep the exact amount ready for smooth delivery.
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handlePlaceOrder}
                                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : `Place Order (৳${(totalPrice() * 120).toFixed(2)})`}
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
                                        <p className="text-sm font-bold text-blue-600">৳{(item.product.price * item.quantity * 120).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-800 dark:text-white">৳{(totalPrice() * 120).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span className="font-bold text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-slate-800">
                                <span>Total</span>
                                <span>৳{(totalPrice() * 120).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
