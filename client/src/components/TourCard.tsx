import { Link } from "react-router-dom";
import {
  FiClock,
  FiMapPin,
  FiStar,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";

export type TourCardProps = {
  id: number;
  name: string;
  price: number;
  duration: string;
  images?: string[];
  location?: { name: string } | null;
  rating?: number;
  reviewCount?: number;
  isHot?: boolean;
};

function placeholderFor(srcs?: string[], seed?: string) {
  const first = (srcs || []).find((s) => s && s.trim().length > 0);
  return first || `https://picsum.photos/seed/${seed || "tour"}/600/400`;
}

export default function TourCard({
  id,
  name,
  price,
  duration,
  images,
  location,
  rating = 4.5,
  reviewCount = 0,
  isHot = false,
}: TourCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const img = placeholderFor(images, `tour-${id}`);

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
    >
      {/* Gradient border effect on hover */}
      <div
        className={`absolute -inset-[2px] bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
      />
      <div className="absolute inset-0 bg-white rounded-2xl" />

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/tours/${id}`}>
          <motion.img
            src={img}
            alt={name}
            className="w-full h-56 object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          {/* Image shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isHot && (
            <motion.span
              className="badge bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              🔥 Hot
            </motion.span>
          )}
        </div>

        {/* Like Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
            isLiked
              ? "bg-red-500 text-white"
              : "bg-white/95 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
          }`}
          whileTap={{ scale: 0.9 }}
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
        >
          <FiHeart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </motion.button>

        {/* Price Tag - Enhanced */}
        <motion.div
          className="absolute bottom-3 right-3"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/50">
            <div className="text-xs text-gray-500 font-medium">Từ</div>
            <span className="text-sky-600 font-bold text-lg">
              {price.toLocaleString()}₫
            </span>
          </div>
        </motion.div>

        {/* Quick view button on hover */}
        <motion.div
          className="absolute bottom-3 left-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to={`/tours/${id}`}
            className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-white transition-colors shadow-lg"
          >
            Xem nhanh
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative p-5 bg-white">
        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2">
            <FiMapPin className="w-4 h-4 text-sky-500" />
            <span>{location.name}</span>
          </div>
        )}

        {/* Title */}
        <Link to={`/tours/${id}`}>
          <h3
            className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-sky-600 transition-colors mb-3"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            {name}
          </h3>
        </Link>

        {/* Rating & Duration */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
            <FiStar className="w-4 h-4 text-amber-500 fill-current" />
            <span className="font-bold text-amber-700">
              {rating.toFixed(1)}
            </span>
            {reviewCount > 0 && (
              <span className="text-amber-600/70">({reviewCount})</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
            <FiClock className="w-4 h-4" />
            <span className="font-medium">{duration}</span>
          </div>
        </div>

        {/* CTA Button - Enhanced */}
        <Link
          to={`/tours/${id}`}
          className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:from-sky-600 hover:to-sky-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Đặt tour ngay
        </Link>
      </div>
    </motion.div>
  );
}
