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
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import Chatbot from "./components/Chatbot";
import { Toaster } from "react-hot-toast";

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
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
      <button
        className="fixed bottom-6 right-6 z-[1100] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => setShowChatbot((v) => !v)}
      >
        {showChatbot ? "Đóng Chatbot" : "Mở Chatbot"}
      </button>
      {showChatbot && <Chatbot />}
    </div>
  );
}

export default App;
