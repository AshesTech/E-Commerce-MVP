'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingName: formData.name,
                    shippingEmail: formData.email,
                    shippingAddress: formData.address,
                }),
            });

            if (res.ok) {
                alert('Order placed successfully via Cash on Delivery!');
                router.push('/storefront');
            } else {
                let message = 'Something went wrong while placing your order. Please try again.';
                try {
                    const errorData = await res.json();
                    if (errorData?.message) {
                        message = errorData.message;
                    }
                } catch {
                    // response wasn't JSON, fall back to the generic message
                }
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setErrorMessage('Could not reach the server. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 border p-6 rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Information</h2>

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            required
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                        <textarea
                            required
                            rows={3}
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                        </button>
                    </div>
                </form>

                <div className="border p-6 rounded-lg shadow-sm bg-gray-50 h-fit space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Order Review</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-semibold text-gray-800">Cash on Delivery</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Fee:</span>
                            <span className="text-green-600 font-semibold">Free</span>
                        </div>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total Payable:</span>
                        <span>Rs. Calculated at Cart</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
