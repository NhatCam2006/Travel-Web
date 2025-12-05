import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiShoppingBag,
  FiMapPin,
  FiCompass,
  FiTag,
  FiStar,
  FiHome,
  FiMenu,
  FiX,
  FiImage,
} from "react-icons/fi";
import { useState } from "react";

const navItems = [
  { path: "bookings", label: "Đơn hàng", icon: FiShoppingBag },
  { path: "locations", label: "Địa điểm", icon: FiMapPin },
  { path: "tours", label: "Tours", icon: FiCompass },
  { path: "vouchers", label: "Vouchers", icon: FiTag },
  { path: "reviews", label: "Đánh giá", icon: FiStar },
  { path: "gallery", label: "Thư viện ảnh", icon: FiImage },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/30">
                  VT
                </div>
                <div>
                  <span className="font-bold text-gray-800">VietTravel</span>
                  <span className="block text-xs text-gray-400">
                    Admin Panel
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={`/admin/${item.path}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    active
                      ? "bg-sky-50 text-sky-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-sky-600" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <FiHome className="w-5 h-5" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 hidden lg:block">
              {navItems.find((item) => isActive(item.path))?.label ||
                "Dashboard"}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
