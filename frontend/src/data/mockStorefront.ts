export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
}

export interface VendorStore {
    id: string;
    subdomain: string;
    storeName: string;
    logoUrl: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        textColor: string;
    };
    categories: string[];
    products: Product[];
}

export const mockVendorStore: VendorStore = {
    id: "vendor-101",
    subdomain: "techmart",
    storeName: "TechMart Electronics",
    logoUrl: "https://via.placeholder.com/150?text=TechMart",
    theme: {
        primaryColor: "#2563eb",   // Tailored Blue
        secondaryColor: "#1e40af", // Darker Blue
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
    },
    categories: ["All", "Laptops", "Audio", "Accessories"],
    products: [
        {
            id: "prod-1",
            name: "Wireless Noise-Canceling Headphones",
            description: "High-quality sound with active noise cancellation and 30-hour battery life.",
            price: 120,
            category: "Audio",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            inStock: true,
        },
        {
            id: "prod-2",
            name: "Pro Mechanical Keyboard",
            description: "RGB backlit mechanical keyboard with tactile switches for ultimate typing.",
            price: 85,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
            inStock: true,
        },
        {
            id: "prod-3",
            name: "Ultra-Slim 15-inch Laptop",
            description: "Powerful performance with 16GB RAM and 512GB SSD in a lightweight design.",
            price: 899,
            category: "Laptops",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
            inStock: false,
        },
        {
            id: "prod-4",
            name: "Ergonomic Wireless Mouse",
            description: "Comfortable design reducing wrist strain during long work hours.",
            price: 45,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
            inStock: true,
        },
    ],
};