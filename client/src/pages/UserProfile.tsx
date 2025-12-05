import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, Navigate } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
  FiStar,
  FiEdit3,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

type Booking = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  tour: {
    id: number;
    name: string;
    price: number;
    duration: string;
    images?: string[];
  };
  schedule?: { departureDate: string };
  review?: { id: number };
};

type TabType = "bookings" | "settings";

export default function UserProfile() {
  const { user, loading, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabType>("bookings");

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:5000/user/bookings", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không tải được bookings");
      setBookings(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const stats = {
    totalBookings: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    totalSpent: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <FiCheckCircle className="text-green-500" />;
      case "PENDING":
        return <FiAlertCircle className="text-amber-500" />;
      default:
        return <FiXCircle className="text-red-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden mb-8"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500 relative"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg border-4 border-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <FiMail className="w-4 h-4" />
                    {user.email}
                  </div>
                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1 mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium hover:bg-emerald-200 transition-colors"
                    >
                      <FiShield className="w-3 h-3" />
                      Quản trị viên
                    </Link>
                  )}
                </div>
              </div>

              <button
                onClick={logout}
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-sky-600">
                  {stats.totalBookings}
                </div>
                <div className="text-sm text-gray-500">Tổng đơn</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </div>
                <div className="text-sm text-gray-500">Đã xác nhận</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-500">Đang chờ</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.totalSpent.toLocaleString()}₫
                </div>
                <div className="text-sm text-gray-500">Tổng chi</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiCalendar className="w-4 h-4" />
                Đơn đặt tour
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === "settings"
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiSettings className="w-4 h-4" />
                Cài đặt
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "bookings" && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                      <FiAlertCircle />
                      {error}
                    </div>
                  )}

                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiCalendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Chưa có đơn đặt nào
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Hãy khám phá các tour du lịch tuyệt vời của chúng tôi
                      </p>
                      <Link to="/tours" className="btn-primary">
                        Khám phá ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((b, index) => (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-gray-100 rounded-xl p-4 hover:shadow-soft transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Tour Image */}
                            <div className="w-full lg:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {b.tour.images?.[0] ? (
                                <img
                                  src={b.tour.images[0]}
                                  alt={b.tour.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiMapPin className="w-8 h-8 text-gray-300" />
                                </div>
                              )}
                            </div>

                            {/* Tour Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <Link
                                    to={`/tours/${b.tour.id}`}
                                    className="font-semibold text-gray-800 hover:text-sky-600 transition-colors line-clamp-1"
                                  >
                                    {b.tour.name}
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <FiClock className="w-4 h-4" />
                                      {b.tour.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FiCalendar className="w-4 h-4" />
                                      {b.schedule
                                        ? new Date(
                                            b.schedule.departureDate
                                          ).toLocaleDateString("vi-VN")
                                        : "Liên hệ"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FiUsers className="w-4 h-4" />
                                      {b.adultCount} NL, {b.childCount} TE
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                                    b.status
                                  )}`}
                                >
                                  {getStatusIcon(b.status)}
                                  {b.status === "CONFIRMED"
                                    ? "Đã xác nhận"
                                    : b.status === "PENDING"
                                    ? "Đang chờ"
                                    : "Đã hủy"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <div>
                                  <span className="text-xs text-gray-400">
                                    Mã đơn: #{b.id}
                                  </span>
                                  <div className="text-lg font-bold text-sky-600">
                                    {b.totalPrice.toLocaleString()}₫
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {b.status === "CONFIRMED" && !b.review && (
                                    <button
                                      onClick={() => setReviewingBooking(b)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                                    >
                                      <FiEdit3 className="w-4 h-4" />
                                      Đánh giá
                                    </button>
                                  )}
                                  {b.review && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg">
                                      <FiStar className="w-4 h-4 fill-current" />
                                      Đã đánh giá
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl"
                >
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Thông tin tài khoản
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={user.name}
                          disabled
                          className="input-field pl-10 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="input-field pl-10 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Vai trò
                      </label>
                      <div className="relative">
                        <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={
                            user.role === "ADMIN"
                              ? "Quản trị viên"
                              : "Khách hàng"
                          }
                          disabled
                          className="input-field pl-10 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">Lưu ý</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Chức năng đổi mật khẩu và cập nhật thông tin sẽ được
                          bổ sung trong phiên bản tiếp theo.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingBooking && (
        <ReviewForm
          bookingId={reviewingBooking.id}
          tourName={reviewingBooking.tour.name}
          onSuccess={() => {
            setReviewingBooking(null);
            fetchBookings();
          }}
          onCancel={() => setReviewingBooking(null)}
        />
      )}
    </div>
  );
}
