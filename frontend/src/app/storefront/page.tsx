"use client";

import { useState } from "react";
import { mockVendorStore, Product } from "@/data/mockStorefront";
import Link from "next/link";
export default function StorefrontPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredProducts =
        selectedCategory === "All"
            ? mockVendorStore.products
            : mockVendorStore.products.filter(
                (product) => product.category === selectedCategory
            );

    return (
        <div
            className="min-h-screen font-sans"
            style={{ backgroundColor: mockVendorStore.theme.backgroundColor }}
        >
            {/* Dynamic Header with Vendor Branding */}
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
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Buyer Storefront View
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Category Navigation Bar */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Browse Categories
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {mockVendorStore.categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${selectedCategory === cat
                                    ? "text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                style={
                                    selectedCategory === cat
                                        ? { backgroundColor: mockVendorStore.theme.primaryColor }
                                        : {}
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Product Grid */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Products ({filteredProducts.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product: Product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                {product.category}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded font-medium ${product.inStock
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product.inStock ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-gray-900">
                                        ${product.price}
                                    </span>
                                    <Link href={`/storefront/${product.id}`}>
                                        <button
                                            disabled={!product.inStock}
                                            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundColor: mockVendorStore.theme.primaryColor,
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </Link>


                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}