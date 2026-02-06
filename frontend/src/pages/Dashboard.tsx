import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { salesApi, itemsApi } from '../api';
import { formatCurrency } from '../utils/helpers';
import { Sale, Item } from '../types';

interface StatCard {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
}

import { motion } from 'framer-motion';

// ... (imports remain similar, assume StatCard interface exists)

const Dashboard: React.FC = () => {
    // ... (state setup remains the same)
    const [stats, setStats] = useState<any>(null);
    const [lowStockItems, setLowStockItems] = useState<Item[]>([]);
    const [recentSales, setRecentSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // ... (fetchDashboardData remains the same)
    const fetchDashboardData = async () => {
        try {
            const [statsRes, lowStockRes, salesRes] = await Promise.all([
                salesApi.getStats(),
                itemsApi.getLowStock(),
                salesApi.getAll({ limit: 5 }),
            ]);

            setStats(statsRes.data);
            setLowStockItems(lowStockRes.data.slice(0, 5));
            setRecentSales(salesRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... (statCards array definition remains the same)
    const statCards: StatCard[] = [
        {
            title: "Today's Sales",
            value: formatCurrency(stats?.today?.totalSales || 0),
            change: `${stats?.today?.count || 0} transactions`,
            icon: DollarSign,
            color: 'from-emerald-400 to-emerald-600',
        },
        {
            title: "Today's Profit",
            value: formatCurrency(stats?.today?.totalProfit || 0),
            change: `Margin: ${stats?.today?.totalSales ? ((stats.today.totalProfit / stats.today.totalSales) * 100).toFixed(1) : 0}%`,
            icon: TrendingUp,
            color: 'from-blue-400 to-blue-600',
        },
        {
            title: 'Weekly Sales',
            value: formatCurrency(stats?.week?.totalSales || 0),
            change: `${stats?.week?.count || 0} transactions`,
            icon: ShoppingCart,
            color: 'from-purple-400 to-purple-600',
        },
        {
            title: 'Monthly Sales',
            value: formatCurrency(stats?.month?.totalSales || 0),
            change: `${stats?.month?.count || 0} transactions`,
            icon: TrendingDown,
            color: 'from-orange-400 to-orange-600',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Overview of your business performance
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border-opacity-50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-xl shadow-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 bg-red-50/30 dark:bg-red-900/10">
                        <div className="flex items-center">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-3">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Low Stock Alerts
                            </h2>
                        </div>
                    </div>
                    <div className="p-6">
                        {lowStockItems.length > 0 ? (
                            <div className="space-y-4">
                                {lowStockItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0 group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                SKU: {item.sku}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${item.stock.quantity === 0
                                                ? 'text-red-500'
                                                : 'text-orange-500'
                                                }`}>
                                                {item.stock.quantity} {item.stock.unit}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Min: {item.stock.lowStockThreshold}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mb-3">
                                    <Package className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    All items are well stocked!
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Sales */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 bg-blue-50/30 dark:bg-blue-900/10">
                        <div className="flex items-center">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
                                <Package className="w-5 h-5 text-primary-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Recent Sales
                            </h2>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentSales.length > 0 ? (
                            <div className="space-y-4">
                                {recentSales.map((sale) => (
                                    <div
                                        key={sale._id}
                                        className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0 group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                {sale.invoiceNumber}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {sale.items.length} items • <span className="capitalize">{sale.payment.method}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(sale.totals.total)}
                                            </p>
                                            <p className="text-xs text-emerald-500 font-medium bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full inline-block mt-1">
                                                +{formatCurrency(sale.totals.profit)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-3">
                                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    No sales yet
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
