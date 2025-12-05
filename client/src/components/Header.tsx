import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setSearchOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const navLinks = [
    { to: "/destinations", label: "Điểm đến" },
    { to: "/explore", label: "Khám phá" },
    { to: "/popular", label: "Tour phổ biến" },
    { to: "/gallery", label: "Thư viện ảnh" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === "/";
  const isDark = !isScrolled && isHomePage;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-sm py-3"
            : isHomePage
            ? "bg-transparent py-5"
            : "bg-white shadow-sm py-3"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo - Simple Text */}
            <Link to="/" className="group">
              <motion.span
                className={`text-2xl font-bold tracking-tight transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: '"Playfair Display", serif' }}
                whileHover={{ scale: 1.02 }}
              >
                Viet
                <span className="text-emerald-500">Travel</span>
              </motion.span>
            </Link>

            {/* Center Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? isDark
                          ? "text-white"
                          : "text-emerald-600"
                        : isDark
                        ? "text-white/80 group-hover:text-white"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 transition-transform origin-left ${
                      isActive(link.to)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <motion.button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <FiSearch className="w-5 h-5" />
              </motion.button>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${
                        isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-medium text-gray-900 text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/me"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <FiUser className="w-4 h-4" />
                              Trang cá nhân
                            </Link>
                            {user.role === "ADMIN" && (
                              <Link
                                to="/admin"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <FiSettings className="w-4 h-4" />
                                Quản trị
                              </Link>
                            )}
                            <button
                              onClick={logout}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <FiLogOut className="w-4 h-4" />
                              Đăng xuất
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        isDark
                          ? "text-white/90 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isDark
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay - Minimal */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg overflow-hidden"
            >
              <div className="max-w-2xl mx-auto p-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Bạn muốn đi đâu?"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    autoFocus
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Phổ biến:</span>
                  {["Hạ Long", "Sapa", "Đà Nẵng", "Phú Quốc"].map((tag) => (
                    <Link
                      key={tag}
                      to={`/popular?q=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu - Full Screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-semibold text-gray-900">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isActive(link.to)
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{link.label}</span>
                      <FiArrowRight
                        className={`w-4 h-4 ${
                          isActive(link.to)
                            ? "text-emerald-500"
                            : "text-gray-400"
                        }`}
                      />
                    </Link>
                  ))}

                  {user && (
                    <>
                      <div className="my-3 border-t" />
                      <Link
                        to="/me"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <span className="font-medium">Trang cá nhân</span>
                        <FiUser className="w-4 h-4 text-gray-400" />
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <span className="font-medium">Quản trị</span>
                          <FiSettings className="w-4 h-4 text-gray-400" />
                        </Link>
                      )}
                    </>
                  )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t">
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full py-3 text-center rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full py-3 text-center rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={isHomePage ? "h-0" : "h-16"} />
    </>
  );
}
