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
    // TODO(verify): assuming the Order model has a `shippingName` scalar column
    // (based on the checkout body using shippingName/shippingEmail/shippingAddress).
    // Check the console log below after loading this page — if the real field
    // name differs, update this interface and the JSX reference accordingly.
    shippingName?: string;
    status: 'PLACED' | 'DISPATCHED' | 'DELIVERED';
    createdAt: string;
    items: OrderItem[];
}

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [dispatchError, setDispatchError] = useState<string | null>(null);
    const [dispatchingId, setDispatchingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/vendor/orders');
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
                const data = await res.json();
                console.log('Raw /api/vendor/orders response:', data);
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setLoadError('Could not load orders right now. Please try again in a moment.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getOrderTotal = (order: Order) =>
        order.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

    const handleDispatch = async (orderId: string) => {
        setDispatchError(null);
        setDispatchingId(orderId);

        try {
            const res = await fetch(`/api/vendor/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'DISPATCHED' }),
            });

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: 'DISPATCHED' } : order
                )
            );
        } catch (error) {
            console.error('Error dispatching order:', error);
            setDispatchError(`Could not mark order ${orderId} as dispatched. Please try again.`);
        } finally {
            setDispatchingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Vendor Order Management</h1>

            {dispatchError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">
                    {dispatchError}
                </div>
            )}

            {loading ? (
                <p>Loading orders...</p>
            ) : loadError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4">
                    {loadError}
                </div>
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
                                    <td className="p-4">{order.shippingName || '—'}</td>
                                    <td className="p-4">Rs. {getOrderTotal(order)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'DISPATCHED' || order.status === 'DELIVERED'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {order.status === 'PLACED' ? (
                                            <button
                                                onClick={() => handleDispatch(order.id)}
                                                disabled={dispatchingId === order.id}
                                                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-50"
                                            >
                                                {dispatchingId === order.id ? 'Dispatching...' : 'Dispatch'}
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500 font-medium">{order.status === 'DELIVERED' ? 'Delivered' : 'Dispatched'}</span>
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
