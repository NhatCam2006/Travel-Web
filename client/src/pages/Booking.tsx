import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiTag,
  FiCheck,
  FiChevronLeft,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface TourDetailData {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  transport?: string | null;
  images: string[];
  location: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    image: string;
  };
}

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get("schedule");

  const { user } = useAuth();
  const [tour, setTour] = useState<TourDetailData | null>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherData, setVoucherData] = useState<any>(null);
  const [voucherError, setVoucherError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate(`/login?redirect=/tours/${id}/booking`);
    }
  }, [user, loading, navigate, id]);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/tours/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTour(data);
        // Fetch schedules
        return fetch(`http://localhost:5000/api/tours/${id}/schedules`);
      })
      .then((res) => res.json())
      .then((data) => setAvailableSchedules(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (scheduleId) {
      fetch(`http://localhost:5000/api/schedules/${scheduleId}`)
        .then((r) => r.json())
        .then((data) => setSchedule(data))
        .catch(console.error);
    }
  }, [scheduleId]);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
    }
  }, [user]);

  const totalPrice = useMemo(() => {
    if (!tour) return 0;
    const price = schedule?.price || tour.price;
    const adult = adultCount * price;
    const child = childCount * (price * 0.7); // 70% giá người lớn
    const subtotal = adult + child;
    return Math.max(0, subtotal - voucherDiscount);
  }, [tour, schedule, adultCount, childCount, voucherDiscount]);

  const handleApplyVoucher = async () => {
    setVoucherError("");
    if (!voucherCode.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode }),
      });
      if (!res.ok) {
        const err = await res.json();
        setVoucherError(err.error || "Mã voucher không hợp lệ");
        setVoucherDiscount(0);
        setVoucherData(null);
        return;
      }
      const data = await res.json();
      const voucher = data.voucher;
      setVoucherData(voucher);
      const price = schedule?.price || tour?.price || 0;
      const subtotal = adultCount * price + childCount * (price * 0.7);
      let discount = 0;
      if (voucher.discountType === "PERCENT") {
        discount = (subtotal * voucher.value) / 100;
        if (voucher.maxDiscount)
          discount = Math.min(discount, voucher.maxDiscount);
      } else {
        discount = voucher.value;
      }
      setVoucherDiscount(discount);
    } catch (e) {
      setVoucherError("Lỗi kiểm tra voucher");
      setVoucherDiscount(0);
      setVoucherData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    if (availableSchedules.length > 0 && !schedule) {
      setMessage("Vui lòng chọn lịch khởi hành!");
      return;
    }

    if (schedule && adultCount + childCount > schedule.availableSeats) {
      setMessage("Số lượng khách vượt quá số chỗ còn lại!");
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          adultCount,
          childCount,
          totalPrice,
          tourId: tour.id,
          scheduleId: schedule?.id,
          voucherCode: voucherData ? voucherCode : undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setBookingId(data.id);
      setShowPayment(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`Lỗi đặt tour: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!bookingId) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Thanh toán thất bại");

      toast.success("Thanh toán thành công! Đơn hàng đã được xác nhận.");
      setShowPayment(false);
      navigate(`/tours/${tour?.id}`);
    } catch (error) {
      toast.error("Lỗi thanh toán: " + String(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (error)
    return <div className="p-6 text-red-600 text-center">Lỗi: {error}</div>;
  if (!tour) return <div className="p-6 text-center">Không tìm thấy tour</div>;

  const price = schedule?.price || tour.price;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/tours/${tour.id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
            Quay lại chi tiết tour
          </Link>
        </div>

        {/* Steps Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex items-center justify-center gap-4">
            {[
              { step: 1, label: "Chọn lịch trình", icon: FiCalendar },
              { step: 2, label: "Thông tin khách", icon: FiUser },
              { step: 3, label: "Xác nhận & Thanh toán", icon: FiCheck },
            ].map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="w-12 md:w-20 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex gap-4">
                <img
                  src={tour.images?.[0] || tour.location.image}
                  alt={tour.name}
                  className="w-32 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h1 className="font-heading text-xl font-bold text-gray-900 mb-2">
                    {tour.name}
                  </h1>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4 text-sky-500" />
                      {tour.duration}
                    </span>
                    {tour.transport && (
                      <span className="flex items-center gap-1">
                        🚌 {tour.transport}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Selection */}
            {availableSchedules.length > 0 && !scheduleId && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-sky-500" />
                  Chọn lịch khởi hành
                </h3>
                <div className="grid gap-3">
                  {availableSchedules.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        schedule?.id === s.id
                          ? "border-sky-500 bg-sky-50"
                          : "border-gray-200 hover:border-sky-300"
                      } ${
                        s.availableSeats <= 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="schedule"
                          checked={schedule?.id === s.id}
                          onChange={() =>
                            s.availableSeats > 0 && setSchedule(s)
                          }
                          className="w-5 h-5 text-sky-600"
                          disabled={s.availableSeats <= 0}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {new Date(s.departureDate).toLocaleDateString(
                              "vi-VN",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Về:{" "}
                            {new Date(s.returnDate).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {s.price && (
                          <div className="font-bold text-sky-600">
                            {s.price.toLocaleString()}₫
                          </div>
                        )}
                        <div
                          className={`text-sm ${
                            s.availableSeats < 5
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {s.availableSeats > 0
                            ? `Còn ${s.availableSeats} chỗ`
                            : "Hết chỗ"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Schedule */}
            {schedule && (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-sky-700 mb-3 flex items-center gap-2">
                  <FiCheck className="w-5 h-5" />
                  Lịch Khởi Hành Đã Chọn
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Ngày đi</div>
                    <div className="font-bold text-sky-700">
                      {new Date(schedule.departureDate).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Ngày về</div>
                    <div className="font-bold text-sky-700">
                      {new Date(schedule.returnDate).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guest Info */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-card p-6 space-y-6"
            >
              <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-sky-500" />
                Số lượng khách
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Người lớn
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-sky-500 flex items-center justify-center text-xl"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">
                      {adultCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdultCount(adultCount + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-sky-500 flex items-center justify-center text-xl"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {price.toLocaleString()}₫/người
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trẻ em (5-12 tuổi)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-sky-500 flex items-center justify-center text-xl"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">
                      {childCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildCount(childCount + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-sky-500 flex items-center justify-center text-xl"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {(price * 0.7).toLocaleString()}₫/người (70%)
                  </div>
                </div>
              </div>

              {schedule &&
                adultCount + childCount > schedule.availableSeats && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
                    ⚠️ Số lượng khách ({adultCount + childCount}) vượt quá số
                    chỗ còn lại ({schedule.availableSeats})
                  </div>
                )}

              <div className="border-t pt-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-sky-500" />
                  Thông tin liên hệ
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="input input-with-icon"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="input input-with-icon"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="input input-with-icon"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Voucher */}
              <div className="border-t pt-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <FiTag className="w-5 h-5 text-sky-500" />
                  Mã giảm giá
                </h3>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      placeholder="Nhập mã voucher"
                      className="input input-with-icon"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="btn btn-secondary whitespace-nowrap"
                  >
                    Áp dụng
                  </button>
                </div>
                {voucherError && (
                  <p className="text-sm text-red-600 mt-2">{voucherError}</p>
                )}
                {voucherData && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <FiCheck className="w-4 h-4" />
                    Đã áp dụng: -{voucherDiscount.toLocaleString()}₫
                  </div>
                )}
              </div>

              {/* Submit button for mobile */}
              <div className="lg:hidden border-t pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full py-4 text-lg"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : `Xác nhận đặt tour - ${totalPrice.toLocaleString()}₫`}
                </button>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-xl text-center ${
                    message.includes("thành công")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-heading text-lg font-bold mb-4">
                Chi tiết đơn hàng
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Người lớn x {adultCount}
                  </span>
                  <span className="font-medium">
                    {(adultCount * price).toLocaleString()}₫
                  </span>
                </div>
                {childCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trẻ em x {childCount}</span>
                    <span className="font-medium">
                      {(childCount * price * 0.7).toLocaleString()}₫
                    </span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{voucherDiscount.toLocaleString()}₫</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-sky-600">
                    {totalPrice.toLocaleString()}₫
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="hidden lg:flex btn btn-primary w-full mt-6 py-4"
              >
                {submitting ? "Đang xử lý..." : "Xác nhận đặt tour"}
              </button>

              <div className="mt-6 space-y-3 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <FiShield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Xác nhận đặt tour qua email</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiPhone className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Hỗ trợ 24/7: 1900 123 456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-center mb-6">
              Thanh toán qua QR Code
            </h3>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="bg-white p-2 rounded-xl border-2 border-sky-100 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT_BOOKING_${bookingId}_AMOUNT_${totalPrice}`}
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-1">Tổng thanh toán</p>
                <p className="text-2xl font-bold text-sky-600">
                  {totalPrice.toLocaleString()}₫
                </p>
              </div>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Vui lòng quét mã QR trên bằng ứng dụng ngân hàng để thanh toán.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePaymentConfirm}
                disabled={submitting}
                className="btn btn-primary w-full py-3"
              >
                {submitting ? "Đang xử lý..." : "Tôi đã thanh toán"}
              </button>
              <button
                onClick={() => setShowPayment(false)}
                disabled={submitting}
                className="btn btn-secondary w-full py-3"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
