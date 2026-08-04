'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Vendor {
    name: string;
    logoUrl?: string;
    colorPrimary?: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function StorefrontPage() {
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStorefrontData() {
            try {
                const [vendorRes, productsRes] = await Promise.all([
                    fetch('/api/storefront'),
                    fetch('/api/storefront/products'),
                ]);

                if (vendorRes.ok) {
                    const vendorData = await vendorRes.json();
                    setVendor(vendorData.vendor);
                }

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setProducts(productsData.products);
                }
            } catch (error) {
                console.error('Failed to fetch storefront data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStorefrontData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading storefront...</div>;
    }

    const primaryColor = vendor?.colorPrimary || '#3B82F6';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Dynamic Vendor Branding */}
            <header className="p-4 shadow-sm bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {vendor?.logoUrl && (
                        <Image src={vendor.logoUrl} alt={vendor.name || 'Vendor Logo'} width={40} height={40} className="rounded" />
                    )}
                    <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
                        {vendor?.name || 'Storefront'}
                    </h1>
                </div>
            </header>

            {/* Dynamic Products Grid */}
            <main className="max-w-7xl mx-auto p-6">
                <h2 className="text-2xl font-semibold mb-6">Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const inStock = product.quantity > 0;
                        return (
                            <div key={product.id} className="border rounded-lg bg-white p-4 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="font-medium text-lg">{product.name}</h3>
                                </div>

                                <div className="mt-4 border-t pt-4 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                    <Link href={`/storefront/${product.id}`}>
                                        <button
                                            disabled={!inStock}
                                            className="px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {inStock ? 'View Product' : 'Out of Stock'}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
