import { User, Mail, Lock } from 'lucide-react';

const Step1UserInfo = ({ formData, setFormData, onNext }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        required
                        className="pl-10 w-full p-2 border rounded-lg"
                        placeholder="First Name"
                        value={formData.fname}
                        onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                    />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded-lg"
                        placeholder="Last Name"
                        value={formData.lname}
                        onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                    />
                </div>
            </div>

            <div className="relative">
                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                    type="email"
                    required
                    className="pl-10 w-full p-2 border rounded-lg"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                    type="password"
                    required
                    className="pl-10 w-full p-2 border rounded-lg"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                    type="password"
                    required
                    className="pl-10 w-full p-2 border rounded-lg"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
            </div>

            <button
                type="button"
                onClick={onNext}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Next: Store Details
            </button>
        </div>
    );
};

export default Step1UserInfo;
