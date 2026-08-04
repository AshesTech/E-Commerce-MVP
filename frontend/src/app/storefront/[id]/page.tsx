'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Vendor {
    colorPrimary?: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProductAndVendor() {
            try {
                const [productRes, vendorRes] = await Promise.all([
                    fetch(`/api/storefront/products/${params.id}`),
                    fetch('/api/storefront')
                ]);

                if (productRes.ok) {
                    const productData = await productRes.json();
                    setProduct(productData.product);
                }

                if (vendorRes.ok) {
                    const vendorData = await vendorRes.json();
                    setVendor(vendorData.vendor);
                }
            } catch (error) {
                console.error('Failed to fetch product details:', error);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchProductAndVendor();
        }
    }, [params.id]);

    if (loading) {
        return <div className="p-8 text-center">Loading product details...</div>;
    }

    if (!product) {
        return <div className="p-8 text-center">Product not found.</div>;
    }

    const primaryColor = vendor?.colorPrimary || '#3B82F6';
    const inStock = product.quantity > 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <Link href="/storefront" className="text-sm font-medium hover:underline mb-6 inline-block" style={{ color: primaryColor }}>
                    &larr; Back to Storefront
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>
                        </div>

                        <button
                            disabled={!inStock}
                            className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-50"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
