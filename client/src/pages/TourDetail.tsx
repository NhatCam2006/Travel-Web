import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TourCard from "../components/TourCard";
import {
  FiClock,
  FiMapPin,
  FiTruck,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiHeart,
  FiCheck,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
  locationId: number;
}

type RelatedTour = {
  id: number;
  name: string;
  price: number;
  duration: string;
  images?: string[];
};
type Review = {
  id: number;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  user: { id: number; name: string };
  bookingId?: number | null;
};

type TourSchedule = {
  id: number;
  departureDate: string;
  returnDate: string;
  price?: number | null;
  availableSeats: number;
};

function placeholderFor(src?: string, seed?: string) {
  const ok = src && src.trim().length > 0;
  return ok ? src! : `https://picsum.photos/seed/${seed || "tour"}/800/500`;
}

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<TourDetailData | null>(null);
  const [relatedTours, setRelatedTours] = useState<RelatedTour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [schedules, setSchedules] = useState<TourSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "price" | "reviews" | "schedules"
  >("itinerary");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/tours/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTour(data);
        fetch(`http://localhost:5000/api/tours`)
          .then((r) => r.json())
          .then((all: TourDetailData[]) => {
            const related = all
              .filter(
                (t) => t.locationId === data.locationId && t.id !== data.id
              )
              .slice(0, 4);
            setRelatedTours(related);
          })
          .catch(console.error);
        fetch(`http://localhost:5000/api/tours/${id}/reviews`)
          .then((r) => r.json())
          .then((reviewData) => setReviews(reviewData))
          .catch(console.error);
        fetch(`http://localhost:5000/api/tours/${id}/schedules`)
          .then((r) => r.json())
          .then((scheduleData) => setSchedules(scheduleData))
          .catch(console.error);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <div className="p-6 text-center">Đang tải tour...</div>;
  if (error)
    return <div className="p-6 text-red-600 text-center">Lỗi: {error}</div>;
  if (!tour) return <div className="p-6 text-center">Không tìm thấy tour</div>;

  const images =
    tour.images?.length > 0
      ? tour.images
      : [placeholderFor("", `tour${tour.id}`)];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gallery Section */}
      <div className="relative w-full h-[500px] md:h-[600px] -mt-16 md:-mt-20 bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={tour.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-8">
          <button
            onClick={() =>
              setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))
            }
            className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentImageIndex
                  ? "bg-white w-8"
                  : "bg-white/50 w-3 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-24 md:top-28 right-4 flex gap-2">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all">
            <FiShare2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all">
            <FiHeart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tour Info Card */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-sky-600">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/popular" className="hover:text-sky-600">
              Tours
            </Link>
            <span>/</span>
            <span className="text-gray-900">{tour.name}</span>
          </div>

          {/* Title & Info */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {tour.name}
              </h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="w-5 h-5 text-sky-500" />
                  <span>{tour.location.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock className="w-5 h-5 text-sky-500" />
                  <span>{tour.duration}</span>
                </div>
                {tour.transport && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiTruck className="w-5 h-5 text-sky-500" />
                    <span>{tour.transport}</span>
                  </div>
                )}
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-5 h-5 ${
                          star <= avgRating
                            ? "text-amber-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-500">
                    ({reviews.length} đánh giá)
                  </span>
                </div>
              )}
            </div>
            <div className="lg:text-right">
              <div className="text-sm text-gray-500 mb-1">Giá từ</div>
              <div className="text-3xl font-bold text-sky-600 mb-4">
                {tour.price.toLocaleString()}₫
                <span className="text-base font-normal text-gray-500">
                  /người
                </span>
              </div>
              <Link
                to={`/tours/${tour.id}/booking`}
                className="btn btn-primary w-full lg:w-auto"
              >
                <FiCalendar className="w-5 h-5" />
                Đặt tour ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-card mb-6 overflow-hidden">
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            {[
              { key: "itinerary", label: "Lịch trình", icon: "📋" },
              { key: "price", label: "Giá & Chính sách", icon: "💰" },
              { key: "schedules", label: "Lịch Khởi Hành", icon: "📅" },
              {
                key: "reviews",
                label: `Đánh giá (${reviews.length})`,
                icon: "⭐",
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "text-sky-600 border-b-2 border-sky-500 bg-sky-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-8">
          {activeTab === "itinerary" && (
            <div>
              <h2 className="font-heading text-2xl font-bold mb-4">
                Thông tin tour
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {tour.description}
                </p>
              </div>
            </div>
          )}

          {activeTab === "price" && (
            <div>
              <h2 className="font-heading text-2xl font-bold mb-4">
                Giá tour & Chính sách
              </h2>
              <div className="space-y-6">
                <div className="bg-sky-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 text-sky-700">
                    💰 Bảng giá:
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Người lớn
                      </div>
                      <div className="text-xl font-bold text-sky-600">
                        {tour.price.toLocaleString()}₫
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Trẻ em (5-12 tuổi)
                      </div>
                      <div className="text-xl font-bold text-emerald-600">
                        {(tour.price * 0.7).toLocaleString()}₫
                      </div>
                      <div className="text-xs text-gray-400">
                        70% giá người lớn
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Trẻ em dưới 5 tuổi
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        Miễn phí
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="text-green-500">✓</span> Giá bao gồm:
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Xe đưa đón theo chương trình",
                        "Khách sạn tiêu chuẩn",
                        "Các bữa ăn theo chương trình",
                        "Vé tham quan theo lịch trình",
                        "Hướng dẫn viên tiếng Việt",
                        "Bảo hiểm du lịch",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="text-red-500">✕</span> Giá không bao gồm:
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Vé máy bay/tàu đi và về",
                        "Chi phí cá nhân",
                        "Các dịch vụ không trong chương trình",
                        "Thuế VAT",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <span className="text-red-500 flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">
                    📋 Chính sách hủy tour:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                      { time: "Trước 15 ngày", percent: "90%" },
                      { time: "Trước 7 ngày", percent: "70%" },
                      { time: "Trước 3 ngày", percent: "50%" },
                      { time: "Trong 3 ngày", percent: "0%" },
                    ].map((policy, i) => (
                      <div key={i} className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          {policy.time}
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          Hoàn {policy.percent}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedules" && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold mb-4">
                📅 Lịch Khởi Hành Sắp Tới
              </h2>
              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500">
                    Hiện chưa có lịch khởi hành cho tour này.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Vui lòng liên hệ để được tư vấn
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="border-2 border-gray-100 rounded-xl p-5 hover:border-sky-300 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiCalendar className="w-5 h-5 text-sky-500" />
                            <span className="font-bold text-lg text-sky-700">
                              {new Date(
                                schedule.departureDate
                              ).toLocaleDateString("vi-VN", {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 ml-7">
                            Về:{" "}
                            {new Date(schedule.returnDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-sky-600">
                            {(schedule.price || tour.price).toLocaleString()}₫
                          </div>
                          <div className="text-xs text-gray-400">/người</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4 text-gray-400" />
                          <span
                            className={`text-sm font-medium ${
                              schedule.availableSeats < 5
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            Còn {schedule.availableSeats} chỗ
                          </span>
                        </div>
                        <Link
                          to={`/tours/${tour.id}/booking?schedule=${schedule.id}`}
                          className="btn btn-primary py-2 text-sm"
                        >
                          Đặt Lịch Này
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold">
                  ⭐ Đánh giá từ khách hàng
                </h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-full">
                    <span className="text-2xl font-bold text-amber-600">
                      {avgRating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= avgRating
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({reviews.length})
                    </span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500 italic">
                    Chưa có đánh giá nào cho tour này.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Hãy là người đầu tiên đánh giá!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6 last:border-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">
                              {review.user.name}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-amber-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {review.bookingId && (
                              <span className="badge badge-success text-xs">
                                ✓ Đã mua tour
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-2">
                              {review.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Review"
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Tour liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((t) => (
                <TourCard
                  key={t.id}
                  id={t.id}
                  name={t.name}
                  price={t.price}
                  duration={t.duration}
                  images={t.images}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t transition-transform z-30 ${
          isSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-sky-600">
              {tour.price.toLocaleString()}₫
            </p>
            <p className="text-sm text-gray-600 line-clamp-1">{tour.name}</p>
          </div>
          <Link to={`/tours/${tour.id}/booking`} className="btn btn-primary">
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
