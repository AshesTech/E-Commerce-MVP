export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <span className="text-lg font-semibold">E-Commerce MVP</span>
      <nav className="flex gap-4 text-sm">
        <a href="/">Home</a>
        <a href="/products">Products</a>
      </nav>
    </header>
  );
}
