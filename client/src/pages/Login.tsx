import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiAlertCircle, FiInfo } from "react-icons/fi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo);
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1200"
          alt="Vietnam Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/90 to-emerald-600/90"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Khám phá Việt Nam cùng chúng tôi
          </h2>
          <p className="text-lg text-white/80">
            Hàng trăm tour du lịch hấp dẫn đang chờ bạn. Đăng nhập để đặt tour
            và nhận ưu đãi đặc biệt.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-sm font-bold"
                >
                  {i}K+
                </div>
              ))}
            </div>
            <p className="text-sm text-white/80">
              Hơn 10,000 khách hàng tin tưởng
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
              Chào mừng trở lại!
            </h1>
            <p className="text-gray-500 mt-2">Đăng nhập để tiếp tục khám phá</p>
          </div>

          {searchParams.get("redirect") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <FiInfo className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-sky-800">
                Vui lòng đăng nhập để tiếp tục đặt tour
              </p>
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
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
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                className="text-sky-600 font-medium hover:text-sky-700 transition-colors"
                to={`/register${
                  searchParams.get("redirect")
                    ? `?redirect=${searchParams.get("redirect")}`
                    : ""
                }`}
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
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
    </div>
  );
};

export default Login;
