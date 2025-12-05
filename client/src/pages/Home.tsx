import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import TourCard from "../components/TourCard";
import {
  FiSearch,
  FiCalendar,
  FiUsers,
  FiShield,
  FiDollarSign,
  FiHeadphones,
  FiMapPin,
  FiArrowRight,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";

type Tour = {
  id: number;
  name: string;
  price: number;
  duration: string;
  images?: string[];
  location?: { name: string };
};
type Location = { id: number; name: string; image: string; region: string };

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Mai",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    location: "Hà Nội",
    rating: 5,
    text: "Chuyến đi Hạ Long tuyệt vời! Hướng dẫn viên nhiệt tình, dịch vụ chu đáo. Chắc chắn sẽ quay lại với VietTravel!",
    tour: "Tour Hạ Long 3N2Đ",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    text: "Đã book tour Sapa cho gia đình, mọi thứ được sắp xếp hoàn hảo. Cảnh đẹp, đồ ăn ngon, giá cả hợp lý.",
    tour: "Tour Sapa 4N3Đ",
  },
  {
    id: 3,
    name: "Lê Hoàng Anh",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
    location: "Đà Nẵng",
    rating: 5,
    text: "Lần đầu đặt tour online mà rất hài lòng. Nhân viên tư vấn chuyên nghiệp, hỗ trợ 24/7 như cam kết.",
    tour: "Tour Phú Quốc 5N4Đ",
  },
  {
    id: 4,
    name: "Phạm Thu Hương",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    location: "Hải Phòng",
    rating: 5,
    text: "Tour Đà Lạt rất romantic, phù hợp cho cặp đôi. Khách sạn đẹp, view núi đồi thơ mộng lắm ạ!",
    tour: "Tour Đà Lạt 3N2Đ",
  },
];

// Instagram Feed Data
const instagramPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
    likes: 1234,
    comments: 56,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    likes: 2341,
    comments: 89,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&q=80",
    likes: 1876,
    comments: 67,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    likes: 3210,
    comments: 123,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
    likes: 987,
    comments: 34,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1570366583862-f91883984fde?w=600&q=80",
    likes: 2567,
    comments: 98,
  },
];

// Map Destinations
const mapDestinations = [
  { id: 1, name: "Hạ Long", position: { top: "18%", left: "72%" }, tours: 45 },
  { id: 2, name: "Sapa", position: { top: "12%", left: "58%" }, tours: 32 },
  { id: 3, name: "Hà Nội", position: { top: "20%", left: "68%" }, tours: 67 },
  { id: 4, name: "Huế", position: { top: "42%", left: "62%" }, tours: 28 },
  { id: 5, name: "Đà Nẵng", position: { top: "48%", left: "60%" }, tours: 54 },
  { id: 6, name: "Hội An", position: { top: "50%", left: "58%" }, tours: 41 },
  {
    id: 7,
    name: "Nha Trang",
    position: { top: "62%", left: "68%" },
    tours: 38,
  },
  { id: 8, name: "Đà Lạt", position: { top: "65%", left: "55%" }, tours: 35 },
  { id: 9, name: "TP.HCM", position: { top: "75%", left: "52%" }, tours: 89 },
  {
    id: 10,
    name: "Phú Quốc",
    position: { top: "82%", left: "35%" },
    tours: 47,
  },
];

function placeholderFor(src?: string, seed?: string) {
  const ok = src && src.trim().length > 0;
  return ok ? src! : `https://picsum.photos/seed/${seed || "hero"}/1200/500`;
}

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [popularTours, setPopularTours] = useState<Tour[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredDestination, setHoveredDestination] = useState<number | null>(
    null
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const heroImages = [
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920&q=80",
    "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=80",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1920&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroImages.length),
      5000
    );
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/tours/popular")
      .then((r) => r.json())
      .then((d) => setPopularTours(d.slice(0, 4)))
      .catch(console.error);
    fetch("http://localhost:5000/api/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.slice(0, 6)))
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination.trim()) params.append("q", destination.trim());
    if (departureDate) params.append("date", departureDate);
    if (guestCount) params.append("guests", guestCount);
    window.location.href = `/popular?${params.toString()}`;
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section - Full Screen with Parallax */}
      <div
        ref={heroRef}
        className="relative w-full h-[600px] md:h-[750px] -mt-16 md:-mt-20 overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 w-full h-[120%]"
          style={{ y: heroY }}
        >
          {heroImages.map((src, i) => (
            <img
              key={i}
              src={src}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === heroIndex ? "opacity-100" : "opacity-0"
              }`}
              alt="Hero"
            />
          ))}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <span className="inline-block px-5 py-2.5 glass-card rounded-full text-sm font-medium mb-6 border border-white/30">
              🌟 Hơn 500+ tour du lịch chất lượng
            </span>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Khám Phá Vẻ Đẹp
              <span className="block bg-gradient-to-r from-sky-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent animate-gradient">
                Việt Nam
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Trải nghiệm những chuyến đi đáng nhớ cùng VietTravel. Từ núi rừng
              hùng vĩ đến biển xanh tuyệt đẹp.
            </p>
          </motion.div>

          {/* Glassmorphism Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="glass-card rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Điểm đến
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Bạn muốn đi đâu?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="input input-with-icon"
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Ngày khởi hành
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="input input-with-icon"
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Số khách
                  </label>
                  <div className="relative">
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="Số người"
                      min="1"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="input input-with-icon"
                    />
                  </div>
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary w-full py-3.5 shadow-lg shadow-sky-500/30"
                  >
                    <FiSearch className="w-5 h-5" />
                    Tìm Tour
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === heroIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="relative -mt-12 z-10 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Tour du lịch", icon: "🗺️" },
              { number: "50K+", label: "Khách hàng", icon: "👥" },
              { number: "100+", label: "Điểm đến", icon: "📍" },
              { number: "4.9", label: "Đánh giá", icon: "⭐" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Hot Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge badge-primary mb-2">
                🔥 Được yêu thích
              </span>
              <h2 className="section-title">Tour Nổi Bật</h2>
              <p className="section-subtitle">
                Những tour du lịch được đặt nhiều nhất
              </p>
            </div>
            <Link
              to="/popular"
              className="hidden md:flex items-center gap-2 text-sky-600 font-semibold hover:gap-3 transition-all"
            >
              Xem tất cả
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTours.map((t, i) => (
              <TourCard key={t.id} {...t} isHot={i < 2} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/popular" className="btn btn-secondary">
              Xem tất cả tour
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-2">
              Tại sao chọn chúng tôi
            </span>
            <h2 className="section-title">Trải Nghiệm Khác Biệt</h2>
            <p className="section-subtitle mx-auto">
              VietTravel cam kết mang đến cho bạn những chuyến đi an toàn và
              đáng nhớ
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShield className="w-8 h-8" />,
                title: "An Toàn & Uy Tín",
                desc: "Đảm bảo an toàn tuyệt đối cho mọi chuyến đi. Hoàn tiền 100% nếu tour bị hủy.",
                color: "primary",
              },
              {
                icon: <FiDollarSign className="w-8 h-8" />,
                title: "Giá Tốt Nhất",
                desc: "Cam kết giá cạnh tranh nhất thị trường. Nhiều ưu đãi hấp dẫn quanh năm.",
                color: "secondary",
              },
              {
                icon: <FiHeadphones className="w-8 h-8" />,
                title: "Hỗ Trợ 24/7",
                desc: "Đội ngũ tư vấn chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.",
                color: "accent",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge badge-success mb-2">📍 Khám phá</span>
              <h2 className="section-title">Điểm Đến Nổi Bật</h2>
              <p className="section-subtitle">
                Những địa điểm du lịch hấp dẫn nhất Việt Nam
              </p>
            </div>
            <Link
              to="/destinations"
              className="hidden md:flex items-center gap-2 text-sky-600 font-semibold hover:gap-3 transition-all"
            >
              Tất cả điểm đến
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                to={`/destinations?location=${loc.id}`}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-card image-shine"
              >
                <img
                  src={placeholderFor(loc.image, `loc-${loc.id}`)}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <FiMapPin className="w-4 h-4" />
                    {loc.region}
                  </div>
                  <h3 className="text-white text-2xl font-heading font-bold">
                    {loc.name}
                  </h3>
                </div>
                <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 rounded-2xl transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Vietnam Map Section */}
      <section className="section bg-gradient-to-br from-sky-900 via-sky-800 to-emerald-900 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl animate-blob" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="badge bg-white/20 text-white mb-2">
              🗺️ Bản đồ tương tác
            </span>
            <h2 className="section-title text-white">Khám Phá Việt Nam</h2>
            <p className="section-subtitle text-gray-300 mx-auto">
              Click vào các điểm đến trên bản đồ để tìm hiểu thêm
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Vietnam Map */}
            <div className="relative w-full lg:w-1/2 h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/20" />

              {/* Map outline (simplified SVG shape) */}
              <svg
                viewBox="0 0 100 200"
                className="absolute inset-0 w-full h-full p-8 opacity-30"
              >
                <path
                  d="M60,10 C70,15 75,25 72,40 C70,50 65,60 68,80 C72,100 65,120 60,140 C55,160 50,170 45,185 C40,190 35,185 38,175 C42,160 45,140 42,120 C38,100 45,80 48,60 C50,40 55,20 60,10 Z"
                  fill="currentColor"
                  className="text-white"
                />
              </svg>

              {/* Destination points */}
              {mapDestinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  className="absolute cursor-pointer group"
                  style={{ top: dest.position.top, left: dest.position.left }}
                  onHoverStart={() => setHoveredDestination(dest.id)}
                  onHoverEnd={() => setHoveredDestination(null)}
                  whileHover={{ scale: 1.2 }}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 ${
                      hoveredDestination === dest.id ? "animate-pulse-glow" : ""
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
                  </div>

                  {/* Tooltip */}
                  <div
                    className={`absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-xl p-3 shadow-xl min-w-[140px] transition-all duration-300 ${
                      hoveredDestination === dest.id
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    <p className="font-bold text-gray-900">{dest.name}</p>
                    <p className="text-sm text-sky-600">{dest.tours} tours</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Info */}
            <div className="w-full lg:w-1/2 text-white">
              <h3 className="text-2xl font-bold mb-4">Từ Bắc vào Nam</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Việt Nam trải dài hơn 1,650km từ Bắc vào Nam với đa dạng địa
                hình và văn hóa. Từ núi non hùng vĩ của Sapa đến bãi biển thiên
                đường Phú Quốc, mỗi vùng miền đều có nét đẹp riêng biệt.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Miền Bắc", count: "156 tours", icon: "🏔️" },
                  { label: "Miền Trung", count: "123 tours", icon: "🏛️" },
                  { label: "Tây Nguyên", count: "45 tours", icon: "🌲" },
                  { label: "Miền Nam", count: "178 tours", icon: "🏝️" },
                ].map((region, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <span className="text-2xl">{region.icon}</span>
                    <p className="font-semibold mt-2">{region.label}</p>
                    <p className="text-sm text-gray-300">{region.count}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/explore"
                className="btn bg-white text-sky-600 hover:bg-gray-100"
              >
                <FiMapPin className="w-5 h-5" />
                Khám phá bản đồ đầy đủ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-2">
              💬 Khách hàng nói gì
            </span>
            <h2 className="section-title">Đánh Giá Từ Khách Hàng</h2>
            <p className="section-subtitle mx-auto">
              Hơn 50,000 khách hàng đã tin tưởng và đồng hành cùng chúng tôi
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Avatar */}
                        <div className="relative">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-sky-100"
                          />
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
                            <FiStar className="w-5 h-5 fill-current" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          {/* Stars */}
                          <div className="flex justify-center md:justify-start gap-1 mb-4">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <FiStar
                                key={i}
                                className="w-5 h-5 text-amber-400 fill-current"
                              />
                            ))}
                          </div>

                          <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 italic">
                            "{item.text}"
                          </p>

                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              {item.name}
                            </p>
                            <p className="text-gray-500">
                              {item.location} • {item.tour}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeTestimonial
                      ? "bg-sky-500 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <button
              onClick={() =>
                setActiveTestimonial((prev) =>
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() =>
                setActiveTestimonial((prev) =>
                  prev === testimonials.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex"
            >
              <FiChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge badge-warning mb-2">
              📸 Theo dõi chúng tôi
            </span>
            <h2 className="section-title">@VietTravel trên Instagram</h2>
            <p className="section-subtitle mx-auto">
              Cập nhật những khoảnh khắc đẹp nhất từ các chuyến đi
            </p>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramPosts.map((post) => (
              <motion.a
                key={post.id}
                href="https://instagram.com/viettravel"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={post.image}
                  alt="Instagram post"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiHeart className="w-5 h-5" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageCircle className="w-5 h-5" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com/viettravel"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Theo dõi @VietTravel
              <FiArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 p-8 md:p-12 animate-gradient">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2 animate-blob" />
              <div
                className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2 animate-blob"
                style={{ animationDelay: "3s" }}
              />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white text-center md:text-left">
                <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                  🎉 Ưu đãi đặc biệt
                </span>
                <h3 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-glow">
                  Giảm đến 30% Tour Miền Bắc
                </h3>
                <p className="text-white/90 text-lg mb-6">
                  Áp dụng từ 01/12 - 31/12/2025. Số lượng có hạn!
                </p>
                <Link
                  to="/popular"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Khám phá ngay
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
            poster="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80"
          >
            <source
              src="https://static.videezy.com/system/resources/previews/000/044/130/original/P1070707.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-2xl">
            <span className="badge bg-white/20 text-white mb-4">
              🎬 Video giới thiệu
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Khám Phá Việt Nam Qua Từng Thước Phim
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Hãy để chúng tôi đưa bạn đến những vùng đất tuyệt đẹp nhất của
              Việt Nam qua những thước phim chân thực và sống động.
            </p>
            <button className="group inline-flex items-center gap-4 text-white hover:gap-6 transition-all">
              <span className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors animate-pulse-glow">
                <FiPlay className="w-6 h-6 ml-1" />
              </span>
              <span className="font-semibold text-lg">
                Xem video giới thiệu
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
