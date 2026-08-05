export default function VendorDashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold">$1,240</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>
    </div>
  );
}
