import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert(`Cảm ơn bạn đã đăng ký nhận tin với email: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🌴</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                VietTravel
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Khám phá vẻ đẹp Việt Nam cùng chúng tôi. Hàng ngàn tour du lịch
              chất lượng với giá tốt nhất.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-sky-500 transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-pink-500 transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/destinations"
                  className="hover:text-sky-400 transition-colors"
                >
                  Điểm đến
                </Link>
              </li>
              <li>
                <Link
                  to="/popular"
                  className="hover:text-sky-400 transition-colors"
                >
                  Tour phổ biến
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-sky-400 transition-colors"
                >
                  Thư viện ảnh
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="hover:text-sky-400 transition-colors"
                >
                  Khám phá bản đồ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-400 transition-colors"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-400 transition-colors"
                >
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>
                  123 Nguyễn Huệ, Quận 1<br />
                  TP. Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-sky-400" />
                <a
                  href="tel:1900123456"
                  className="hover:text-sky-400 transition-colors"
                >
                  1900 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-sky-400" />
                <a
                  href="mailto:info@viettravel.com"
                  className="hover:text-sky-400 transition-colors"
                >
                  info@viettravel.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">
              Nhận tin khuyến mãi
            </h3>
            <p className="text-gray-400 mb-4">
              Đăng ký để nhận thông tin ưu đãi và tour mới nhất.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white placeholder-gray-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <FiSend className="w-4 h-4" />
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 VietTravel. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Điều khoản sử dụng
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
