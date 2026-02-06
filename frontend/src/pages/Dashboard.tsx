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

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [lowStockItems, setLowStockItems] = useState<Item[]>([]);
    const [recentSales, setRecentSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

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

    const statCards: StatCard[] = [
        {
            title: "Today's Sales",
            value: formatCurrency(stats?.today?.totalSales || 0),
            change: `${stats?.today?.count || 0} transactions`,
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            title: "Today's Profit",
            value: formatCurrency(stats?.today?.totalProfit || 0),
            change: `Margin: ${stats?.today?.totalSales ? ((stats.today.totalProfit / stats.today.totalSales) * 100).toFixed(1) : 0}%`,
            icon: TrendingUp,
            color: 'bg-blue-500',
        },
        {
            title: 'Weekly Sales',
            value: formatCurrency(stats?.week?.totalSales || 0),
            change: `${stats?.week?.count || 0} transactions`,
            icon: ShoppingCart,
            color: 'bg-purple-500',
        },
        {
            title: 'Monthly Sales',
            value: formatCurrency(stats?.month?.totalSales || 0),
            change: `${stats?.month?.count || 0} transactions`,
            icon: TrendingDown,
            color: 'bg-orange-500',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Overview of your business performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
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
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                                        className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                SKU: {item.sku}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${item.stock.quantity === 0
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-orange-600 dark:text-orange-400'
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
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                All items are well stocked!
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Package className="w-5 h-5 text-primary-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                                        className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {sale.invoiceNumber}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {sale.items.length} items • {sale.payment.method}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(sale.totals.total)}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                +{formatCurrency(sale.totals.profit)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No sales yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
