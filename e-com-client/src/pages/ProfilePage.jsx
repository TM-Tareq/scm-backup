import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Shield, Edit3, Save, X, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const [fname, setFname] = useState(user?.fname || '');
  const [lname, setLname] = useState(user?.lname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({ fname, lname, email });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">Please login to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 text-center sticky top-24">
              <div className="w-32 h-32 rounded-3xl bg-blue-600 mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-600/20">
                {user.fname[0]}{user.lname[0]}
              </div>
              <h2 className="text-2xl font-black dark:text-white mb-2">{user.fname} {user.lname}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                <Shield className="w-3 h-3" />
                {user.role}
              </div>

              <div className="space-y-3 pt-8 border-t border-gray-50 dark:border-slate-800">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout Session
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-colors">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black dark:text-white">Account Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings / Security Placeholder */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-950/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">Account Security</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Your profile is currently protected by standard authentication.</p>
              </div>
              <button className="px-6 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl shadow-sm hover:shadow-md transition">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;