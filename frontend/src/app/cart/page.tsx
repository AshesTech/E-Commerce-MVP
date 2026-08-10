'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            try {
                const res = await fetch('/api/cart');
                if (res.ok) {
                    const data = await res.json();

                    // TODO(verify): we don't yet know the exact response shape from the
                    // backend for GET /api/cart, so this logs the raw response and tries
                    // a few likely shapes. Check the browser console after loading this
                    // page, compare to what actually came back, and let Claude know the
                    // real field names so this can be tightened up.
                    console.log('Raw /api/cart response:', data);

                    const items = data?.items ?? data?.cart?.items ?? (Array.isArray(data) ? data : []);
                    if (!items.length && data) {
                        console.warn('Could not find a cart items array in the response above — check the shape and update fetchCart().');
                    }
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCart();
    }, []);

    // Quantity Update Handler — calls PUT /api/cart/items/:id, body: { quantity }
    const handleQuantityChange = async (id: string, delta: number) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;
        const newQty = item.quantity + delta;
        if (newQty <= 0) return;

        // optimistic update
        setCartItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
        );

        try {
            const res = await fetch(`/api/cart/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQty }),
            });
            if (!res.ok) {
                console.error('Failed to update quantity, reverting.');
                setCartItems((prev) =>
                    prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
                );
            }
        } catch (error) {
            console.error('Quantity update error:', error);
            setCartItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
            );
        }
    };

    // Remove Item Handler — calls DELETE /api/cart/items/:id
    const handleRemoveItem = async (id: string) => {
        const previousItems = cartItems;
        setCartItems((prev) => prev.filter((item) => item.id !== id));

        try {
            const res = await fetch(`/api/cart/items/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                console.error('Failed to remove item, reverting.');
                setCartItems(previousItems);
            }
        } catch (error) {
            console.error('Remove item error:', error);
            setCartItems(previousItems);
        }
    };

    // Subtotal Calculation
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (loading) {
        return <div className="p-8 text-center">Loading your cart...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <Link
                        href="/storefront"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-600">
                                        Rs. {item.price.toLocaleString()}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center border rounded">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border p-6 rounded-lg shadow-sm h-fit space-y-4 bg-gray-50">
                        <h2 className="text-xl font-bold border-b pb-2">Order Summary</h2>
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>Rs. {subtotal.toLocaleString()}</span>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
