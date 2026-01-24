import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon, Shield, Bell, Network,
    Database, Globe, Save, RefreshCw, Key,
    Lock, Mail, Cpu, HardDrive, Smartphone
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        platform_name: 'SCM Admin Platform',
        support_email: 'support@scm-sys.com',
        currency: 'USD ($)',
        timezone: 'UTC (GMT+0)',
        require_2fa: 'false',
        session_timeout: '30',
        maintenance_mode: 'false'
    });

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/system-settings');
            if (res.data && Object.keys(res.data).length > 0) {
                setSettings(prev => ({ ...prev, ...res.data }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            await api.post('/admin/system-settings', settings);
            toast.success('Settings saved successfully');
        } catch (err) {
            toast.error('Failed to save settings');
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'api', label: 'API & Integrations', icon: Network },
        { id: 'system', label: 'System Health', icon: Cpu },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure global platform parameters and security</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-bold"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors"
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                    General Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Platform Name</label>
                                        <input
                                            type="text"
                                            value={settings.platform_name}
                                            onChange={(e) => handleChange('platform_name', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Support Email</label>
                                        <input
                                            type="email"
                                            value={settings.support_email}
                                            onChange={(e) => handleChange('support_email', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Base Currency</label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => handleChange('currency', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        >
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Time Zone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => handleChange('timezone', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                                        >
                                            <option>UTC (GMT+0)</option>
                                            <option>EST (GMT-5)</option>
                                            <option>PST (GMT-8)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                    Security & Access
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">Two-Factor Authentication</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Require 2FA for all administrative accounts</p>
                                        </div>
                                        <button
                                            onClick={() => handleChange('require_2fa', settings.require_2fa === 'true' ? 'false' : 'true')}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.require_2fa === 'true' ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'}`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.require_2fa === 'true' ? 'right-1' : 'left-1'}`}></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">Automatic Session Timeout</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Log out users after inactivity (minutes)</p>
                                        </div>
                                        <input
                                            type="number"
                                            value={settings.session_timeout}
                                            onChange={(e) => handleChange('session_timeout', e.target.value)}
                                            className="w-20 px-2 py-1 border border-slate-200 rounded text-center"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 pt-4">
                                        <RefreshCw className="w-4 h-4" />
                                        Revoke All Session Tokens
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Database className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                    Infrastructure Health
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                                <HardDrive className="w-4 h-4" /> Database usage
                                            </span>
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">42%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 dark:bg-indigo-400" style={{ width: '42%' }}></div>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                                <Smartphone className="w-4 h-4" /> Mobile API Response
                                            </span>
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">120ms</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 dark:bg-emerald-400" style={{ width: '15%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-between transition-colors">
                                    <div>
                                        <p className="font-bold text-indigo-900 dark:text-indigo-100">Maintenance Mode</p>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300">Display a maintenance screen to all platform visitors</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('maintenance_mode', settings.maintenance_mode === 'true' ? 'false' : 'true')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-colors ${settings.maintenance_mode === 'true' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                    >
                                        {settings.maintenance_mode === 'true' ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
