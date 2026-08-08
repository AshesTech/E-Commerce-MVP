'use client';

import { useState, useEffect } from 'react';

interface Order {
    id: string;
    customerName: string;
    totalAmount: number;
    status: 'Pending' | 'Dispatched' | 'Delivered';
    createdAt: string;
}

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data / fetch API placeholder
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/vendor/orders');
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                // Fallback mock data for testing UI
                setOrders([
                    { id: 'ORD-101', customerName: 'Sara Ahmed', totalAmount: 2500, status: 'Pending', createdAt: '2026-08-08' },
                    { id: 'ORD-102', customerName: 'Ali Khan', totalAmount: 1800, status: 'Dispatched', createdAt: '2026-08-07' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDispatch = async (orderId: string) => {
        try {
            // Call API to mark as dispatched
            await fetch(`/api/vendor/orders/${orderId}/dispatch`, { method: 'POST' });

            // Update UI state
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: 'Dispatched' } : order
                )
            );
            alert(`Order ${orderId} marked as Dispatched!`);
        } catch (error) {
            console.error('Error dispatching order:', error);
            // Local state update fallback
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: 'Dispatched' } : order
                )
            );
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Vendor Order Management</h1>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4 text-sm font-semibold">Order ID</th>
                                <th className="p-4 text-sm font-semibold">Customer</th>
                                <th className="p-4 text-sm font-semibold">Amount</th>
                                <th className="p-4 text-sm font-semibold">Status</th>
                                <th className="p-4 text-sm font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{order.id}</td>
                                    <td className="p-4">{order.customerName}</td>
                                    <td className="p-4">Rs. {order.totalAmount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Dispatched'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {order.status === 'Pending' ? (
                                            <button
                                                onClick={() => handleDispatch(order.id)}
                                                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                                            >
                                                Dispatch
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500 font-medium">Dispatched</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}