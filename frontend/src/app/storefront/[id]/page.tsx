"use client";

import { use } from "react";
import Link from "next/link";
import { mockVendorStore } from "@/data/mockStorefront";

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const product = mockVendorStore.products.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
                    <Link
                        href="/storefront"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        ← Back to Storefront
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen font-sans"
            style={{ backgroundColor: mockVendorStore.theme.backgroundColor }}
        >
            {/* Dynamic Header */}
            <header
                className="text-white shadow-md py-6 px-8 flex justify-between items-center"
                style={{ backgroundColor: mockVendorStore.theme.primaryColor }}
            >
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow">
                        {mockVendorStore.storeName.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{mockVendorStore.storeName}</h1>
                        <p className="text-xs text-blue-100">
                            Subdomain: {mockVendorStore.subdomain}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href="/storefront"
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
                >
                    ← Back to Category Browse
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="flex items-center justify-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-80 object-cover rounded-xl"
                        />
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-600">
                                    {product.category}
                                </span>
                                <span
                                    className={`text-xs px-2.5 py-1 rounded font-medium ${product.inStock
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {product.inStock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-blue-600 mb-4">
                                ${product.price}
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {product.description}
                            </p>
                        </div>

                        <button
                            disabled={!product.inStock}
                            className="w-full py-3 rounded-xl text-white font-medium shadow transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: mockVendorStore.theme.primaryColor }}
                        >
                            {product.inStock ? "Add to Cart" : "Currently Unavailable"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}