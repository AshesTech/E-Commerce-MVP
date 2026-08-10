'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    date: string;
    totalAmount: number;
    status: 'Pending' | 'Dispatched' | 'Delivered';
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
                                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Dispatched'
                                        ? 'bg-blue-100 text-blue-800'
                                        : order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <span className="font-bold">Rs. {order.totalAmount}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.title} (x{item.quantity})</span>
                                        <span>Rs. {item.price * item.quantity}</span>
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
