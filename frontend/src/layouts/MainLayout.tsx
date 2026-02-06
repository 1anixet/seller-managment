import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    TrendingUp,
    Receipt,
    Settings,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    User,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const theme = useAppSelector((state) => state.theme.mode);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Items', href: '/items', icon: Package },
        { name: 'Billing', href: '/billing', icon: ShoppingCart },
        { name: 'Stock', href: '/stock', icon: TrendingUp },
        { name: 'Sales', href: '/sales', icon: Receipt },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-transparent transition-colors">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r-0 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/30 dark:border-gray-700/30">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200">
                            Seller Platform
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 overflow-y-auto">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${active
                                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] backdrop-blur-sm border border-primary-500/20'
                                            : 'text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:shadow-sm'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User profile */}
                    <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/20 dark:bg-black/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 flex items-center justify-center shadow-inner">
                                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user?.profile.firstName} {user?.profile.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white/50 rounded-lg hover:bg-white/80 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800/80 transition-all shadow-sm hover:shadow"
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-4 h-4 mx-auto" />
                                ) : (
                                    <Sun className="w-4 h-4 mx-auto" />
                                )}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
                {/* Top bar */}
                <div className="sticky top-0 z-40 glass border-b-0 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1" />
                    </div>
                </div>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;
