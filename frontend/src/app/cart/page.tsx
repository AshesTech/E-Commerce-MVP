'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export default function CartPage() {
    // Temporary initial state - Baad mein GET /api/cart se integrate hoga
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            productId: 'p1',
            name: 'Sample Product 1',
            price: 1200,
            quantity: 2,
        },
        {
            id: '2',
            productId: 'p2',
            name: 'Sample Product 2',
            price: 2500,
            quantity: 1,
        },
    ]);

    // Quantity Update Handler
    const handleQuantityChange = (id: string, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            })
        );
    };

    // Remove Item Handler
    const handleRemoveItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Subtotal Calculation
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

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