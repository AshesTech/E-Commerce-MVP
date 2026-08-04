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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Dynamic POST /api/checkout call placeholder
        setTimeout(() => {
            alert('Order placed successfully via Cash on Delivery!');
            setIsSubmitting(false);
            router.push('/storefront');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                    <textarea
                        required
                        rows={3}
                        className="mt-1 w-full p-2 border rounded-md"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-4">Payment Method: <strong>Cash on Delivery (COD)</strong></p>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    );
}