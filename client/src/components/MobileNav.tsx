import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { FiHome, FiMapPin, FiSearch, FiUser, FiLogIn } from "react-icons/fi";

export default function MobileNav() {
  const { user } = useAuth();

  const navItems = [
    { to: "/", icon: FiHome, label: "Trang chủ" },
    { to: "/destinations", icon: FiMapPin, label: "Điểm đến" },
    { to: "/popular", icon: FiSearch, label: "Tìm tour" },
    ...(user
      ? [{ to: "/me", icon: FiUser, label: "Cá nhân" }]
      : [{ to: "/login", icon: FiLogIn, label: "Đăng nhập" }]),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
