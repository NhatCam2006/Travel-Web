import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";

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
  tour: { id: number; name: string };
  schedule?: { departureDate: string };
};

const statusConfig = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: FiClock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: FiCheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: FiXCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function AdminBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const qs = status ? `?status=${encodeURIComponent(status)}` : "";
        const res = await fetch(`http://localhost:5000/admin/bookings${qs}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Không tải được danh sách bookings");
        const data = (await res.json()) as Booking[];
        setItems(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Lỗi không xác định";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const updateStatus = async (id: number, next: string) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      const list = await fetch(`http://localhost:5000/admin/bookings${qs}`, {
        credentials: "include",
      });
      const data = (await list.json()) as Booking[];
      setItems(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setError(msg);
    }
  };

  const filteredItems = items.filter(
    (b) =>
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tour?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: items.length,
    pending: items.filter((b) => b.status === "PENDING").length,
    confirmed: items.filter((b) => b.status === "CONFIRMED").length,
    cancelled: items.filter((b) => b.status === "CANCELLED").length,
    revenue: items
      .filter((b) => b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
        <FiXCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Tổng đơn</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-amber-600">Chờ xác nhận</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600">Đã xác nhận</p>
          <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600">Đã hủy</p>
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
        </div>
        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 col-span-2 lg:col-span-1">
          <p className="text-sm text-sky-600">Doanh thu</p>
          <p className="text-2xl font-bold text-sky-700">
            {stats.revenue.toLocaleString()}₫
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, email, tour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="input-field pl-10 pr-8 appearance-none cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-medium text-gray-600">
                  Khách hàng
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Tour
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Ngày đi
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Số khách
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Tổng tiền
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Trạng thái
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((b, index) => {
                const statusInfo =
                  statusConfig[b.status as keyof typeof statusConfig] ||
                  statusConfig.PENDING;
                const StatusIcon = statusInfo.icon;
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {b.customerName}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <FiMail className="w-3 h-3" />
                        {b.customerEmail}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FiPhone className="w-3 h-3" />
                        {b.customerPhone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-800">
                        {b.tour?.name}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">#{b.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        {b.schedule
                          ? new Date(
                              b.schedule.departureDate
                            ).toLocaleDateString("vi-VN")
                          : "Liên hệ"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <FiUsers className="w-4 h-4 text-gray-400" />
                        {b.adultCount} NL, {b.childCount} TE
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-sky-600">
                        {b.totalPrice.toLocaleString()}₫
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={b.status === "CONFIRMED"}
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Xác nhận
                        </button>
                        <button
                          disabled={b.status === "CANCELLED"}
                          onClick={() => updateStatus(b.id, "CANCELLED")}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FiSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
