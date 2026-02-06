import React from 'react';
import { Settings as SettingsIcon, User, Bell, Database } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-primary-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your account information and preferences.
                    </p>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                        <Bell className="w-5 h-5 text-primary-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Configure alert and notification preferences.
                    </p>
                </div>

                {/* System Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                        <SettingsIcon className="w-5 h-5 text-primary-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Configure system-wide settings and preferences.
                    </p>
                </div>

                {/* Database */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                        <Database className="w-5 h-5 text-primary-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Database</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Backup and restore database options.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
