import React, { useState, useEffect } from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stockApi, itemsApi } from '../api';
import { StockLog, Item } from '../types';
import { formatDateTime } from '../utils/helpers';

const Stock: React.FC = () => {
    const [logs, setLogs] = useState<StockLog[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsRes, itemsRes] = await Promise.all([
                stockApi.getLogs({ limit: 50 }),
                itemsApi.getAll({ limit: 100 }),
            ]);
            setLogs(logsRes.data);
            setItems(itemsRes.data);
        } catch (error) {
            toast.error('Failed to load stock data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Package className="w-5 h-5" />
                    Refill Stock
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Stock Movement Logs
                        </h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Previous</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">New</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map(log => (
                                <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {typeof log.itemId === 'string' ? log.itemId : log.itemId.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${log.type === 'purchase'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : log.type === 'sale'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                                            }`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium ${log.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {log.quantity > 0 ? '+' : ''}{log.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{log.previousQuantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{log.newQuantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(log.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stock;
