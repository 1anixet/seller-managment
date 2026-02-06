import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { itemsApi, salesApi } from '../api';
import { Item } from '../types';
import { formatCurrency } from '../utils/helpers';

interface CartItem {
    item: Item;
    quantity: number;
}

const Billing: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');

    useEffect(() => {
        fetchItems();
    }, [search]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await itemsApi.getAll({ search, isActive: true, limit: 50 });
            setItems(response.data);
        } catch (error) {
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item: Item) => {
        const existing = cart.find(c => c.item._id === item._id);
        if (existing) {
            if (existing.quantity < item.stock.quantity) {
                setCart(cart.map(c =>
                    c.item._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
                ));
            } else {
                toast.error('Insufficient stock');
            }
        } else {
            setCart([...cart, { item, quantity: 1 }]);
        }
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(cart.map(c => {
            if (c.item._id === itemId) {
                const newQty = c.quantity + delta;
                if (newQty <= 0) return c;
                if (newQty > c.item.stock.quantity) {
                    toast.error('Insufficient stock');
                    return c;
                }
                return { ...c, quantity: newQty };
            }
            return c;
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCart(cart.filter(c => c.item._id !== itemId));
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, c) => sum + (c.item.pricing.sellingPrice * c.quantity), 0);
        const tax = 0; // Add tax calculation if needed
        const total = subtotal + tax;
        return { subtotal, tax, total };
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setProcessing(true);
        try {
            const { subtotal, tax, total } = calculateTotals();
            const saleData = {
                items: cart.map(c => ({
                    itemId: c.item._id,
                    quantity: c.quantity,
                })),
                payment: {
                    method: paymentMethod,
                    amountPaid: total,
                },
                totals: {
                    subtotal,
                    tax,
                    discount: 0,
                },
            };

            await salesApi.create(saleData);
            toast.success('Sale completed successfully!');
            setCart([]);
            fetchItems(); // Refresh items to update stock
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Sale failed');
        } finally {
            setProcessing(false);
        }
    };

    const { subtotal, tax, total } = calculateTotals();

    return (
        <div className="h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing / POS</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Items list */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <input
                            type="text"
                            placeholder="Search items by name, SKU, or barcode..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {items.map(item => (
                                    <button
                                        key={item._id}
                                        onClick={() => addToCart(item)}
                                        disabled={item.stock.quantity === 0}
                                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {formatCurrency(item.pricing.sellingPrice)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Stock: {item.stock.quantity}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <ShoppingCart className="w-5 h-5 text-primary-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Cart ({cart.length})
                            </h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {cart.map(cartItem => (
                            <div
                                key={cartItem.item._id}
                                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                        {cartItem.item.name}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(cartItem.item._id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(cartItem.item._id, -1)}
                                            className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(cartItem.item._id, 1)}
                                            className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(cartItem.item.pricing.sellingPrice * cartItem.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals and checkout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(tax)}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-900 dark:text-white">Total</span>
                                <span className="text-gray-900 dark:text-white">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Payment Method
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['cash', 'card', 'upi'] as const).map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`py-2 px-3 border rounded-lg text-sm font-medium capitalize transition-colors ${paymentMethod === method
                                                ? 'bg-primary-600 text-white border-primary-600'
                                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || processing}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Complete Sale - ${formatCurrency(total)}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
