import { Store, MapPin, AlignLeft } from 'lucide-react';

const Step2StoreInfo = ({ formData, setFormData, onPrev, onSubmit, loading }) => {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Store className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    required
                    className="pl-10 w-full p-2 border rounded-lg"
                    placeholder="Store Name"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                />
            </div>

            <div className="relative">
                <AlignLeft className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <textarea
                    required
                    className="pl-10 w-full p-2 border rounded-lg"
                    placeholder="Store Description"
                    rows="3"
                    value={formData.storeDescription}
                    onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                />
            </div>

            <div className="relative">
                <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    required
                    className="pl-10 w-full p-2 border rounded-lg"
                    placeholder="Store Address (Optional)"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="w-1/2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Complete Registration"}
                </button>
            </div>
        </div>
    );
};

export default Step2StoreInfo;
