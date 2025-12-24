import Map from "./components/Map";
import TourList from "./components/TourList";
import { Routes, Route } from "react-router-dom";
import TourDetail from "./pages/TourDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./admin/AdminLayout";
import AdminBookings from "./admin/Bookings";
import AdminLocations from "./admin/Locations";
import AdminTours from "./admin/Tours";
import AdminVouchers from "./admin/Vouchers";
import AdminReviews from "./admin/Reviews";
import AdminGallery from "./admin/Gallery";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import UserProfile from "./pages/UserProfile";
import PopularTours from "./pages/PopularTours";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import { useState } from "react"; // <--- Đã xóa 'React,' ở đầu dòng này
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import Chatbot from "./components/Chatbot";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX } from "react-icons/fi";

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  // ... (phần còn lại giữ nguyên)
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route
            path="/explore"
            element={
              <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden">
                <div className="w-2/5 h-full border-r border-gray-200 z-10 shadow-xl bg-white">
                  <TourList />
                </div>
                <div className="w-3/5 h-full">
                  <Map />
                </div>
              </div>
            }
          />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/tours/:id/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<UserProfile />} />
          <Route path="/popular" element={<PopularTours />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminBookings />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="vouchers" element={<AdminVouchers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <MobileNav />

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-[1200] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${showChatbot
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30'
          }`}
        onClick={() => setShowChatbot((v) => !v)}
      >
        <AnimatePresence mode="wait">
          {showChatbot ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <FiMessageCircle className="w-6 h-6 text-white" />
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat tooltip */}
      {!showChatbot && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-8 right-24 z-[1200] hidden md:block"
        >
          <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm text-gray-700">
            <span className="font-medium text-emerald-600">💬 Hỗ trợ 24/7</span>
            <p className="text-xs text-gray-500">Hỏi tôi về tour!</p>
          </div>
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
        </motion.div>
      )}

      {/* Chatbot Component */}
      <AnimatePresence>
        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;