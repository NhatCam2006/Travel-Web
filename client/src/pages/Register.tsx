import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiUserPlus,
  FiAlertCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 6;
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const validPassword = hasMinLength && hasSpecialChar;
  const validPhone = phone === "" || /^0[35789]\d{8}$/.test(phone);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validPassword) {
      setError("Mật khẩu tối thiểu 6 ký tự và có ký tự đặc biệt");
      return;
    }
    if (!validPhone) {
      setError("Số điện thoại VN không hợp lệ");
      return;
    }
    setLoading(true);
    const ok = await register(name, email, password, phone || undefined);
    setLoading(false);
    if (ok) {
      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo);
    } else {
      setError("Không thể đăng ký. Email có thể đã tồn tại.");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
                VietTravel
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-500 mt-2">
              Đăng ký để nhận ưu đãi và đặt tour nhanh hơn
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Họ và tên
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="input-field pl-12"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="input-field pl-12"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Số điện thoại{" "}
                <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className={`input-field pl-12 ${
                    phone && !validPhone
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {phone && !validPhone && (
                <p className="text-xs text-red-500 mt-1">
                  Số điện thoại VN không hợp lệ
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="input-field pl-12"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Password requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div
                    className={`flex items-center gap-2 text-xs ${
                      hasMinLength ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {hasMinLength ? (
                      <FiCheck className="w-3.5 h-3.5" />
                    ) : (
                      <FiX className="w-3.5 h-3.5" />
                    )}
                    Tối thiểu 6 ký tự
                  </div>
                  <div
                    className={`flex items-center gap-2 text-xs ${
                      hasSpecialChar ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {hasSpecialChar ? (
                      <FiCheck className="w-3.5 h-3.5" />
                    ) : (
                      <FiX className="w-3.5 h-3.5" />
                    )}
                    Có ký tự đặc biệt (!@#$...)
                  </div>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
              >
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !validPassword || !validPhone}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiUserPlus className="w-5 h-5" />
                  Tạo tài khoản
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                className="text-sky-600 font-medium hover:text-sky-700 transition-colors"
                to={`/login${
                  searchParams.get("redirect")
                    ? `?redirect=${searchParams.get("redirect")}`
                    : ""
                }`}
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <a href="#" className="text-sky-600 hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-sky-600 hover:underline">
                Chính sách bảo mật
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
          alt="Vietnam Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-sky-600/90 to-emerald-600/90"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Bắt đầu hành trình của bạn
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Tạo tài khoản để trải nghiệm những chuyến đi tuyệt vời nhất tại Việt
            Nam.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiCheck className="w-5 h-5" />
              </div>
              <span>Đặt tour nhanh chóng, tiện lợi</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiCheck className="w-5 h-5" />
              </div>
              <span>Nhận thông báo ưu đãi độc quyền</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiCheck className="w-5 h-5" />
              </div>
              <span>Quản lý đơn đặt dễ dàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
