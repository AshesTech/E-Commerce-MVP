'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
        name: string;
    };
}

interface Order {
    id: string;
    createdAt: string;
    status: 'PLACED' | 'DISPATCHED' | 'DELIVERED';
    items: OrderItem[];
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const res = await fetch('/api/buyer/orders');
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Failed to load order history:', error);
                setError('Could not load your order history right now. Please try again in a moment.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    const getOrderTotal = (order: Order) =>
        order.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

    const statusStyles: Record<Order['status'], string> = {
        PLACED: 'bg-yellow-100 text-yellow-800',
        DISPATCHED: 'bg-blue-100 text-blue-800',
        DELIVERED: 'bg-green-100 text-green-800',
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Order History</h1>

            {loading ? (
                <p>Loading order history...</p>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4">
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <p className="text-gray-500">No previous orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 shadow-sm bg-white space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between border-b pb-3 gap-2">
                                <div>
                                    <p className="font-bold text-lg">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <span className="font-bold">Rs. {getOrderTotal(order)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.product.name} (x{item.quantity})</span>
                                        <span>Rs. {item.priceAtPurchase * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
