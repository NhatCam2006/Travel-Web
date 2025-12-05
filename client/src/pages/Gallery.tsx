import { useState, useEffect } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCamera,
} from "react-icons/fi";

interface GalleryImage {
  id: number;
  src: string;
  thumbnail?: string;
  title: string;
  location: string;
  category: string;
}

const categories = [
  { id: "all", name: "Tất cả", icon: "🌟" },
  { id: "beach", name: "Biển & Đảo", icon: "🏖️" },
  { id: "mountain", name: "Núi & Cao nguyên", icon: "⛰️" },
  { id: "culture", name: "Văn hóa & Di sản", icon: "🏛️" },
  { id: "city", name: "Đô thị", icon: "🏙️" },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <FiCamera className="text-amber-400" />
            <span className="text-sm font-medium">Thư viện ảnh</span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Khám Phá Việt Nam
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Những khoảnh khắc đẹp nhất từ các điểm đến nổi tiếng trên khắp Việt
            Nam
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold text-gray-900">
              {filteredImages.length}
            </span>{" "}
            ảnh
          </p>
        </div>
      </div>

      {/* Masonry Gallery */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20">Đang tải ảnh...</div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Chưa có ảnh nào trong thư viện.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-200">
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-200">
                        <FiMapPin className="w-3 h-3" />
                        <span>{image.location}</span>
                      </div>
                    </div>
                  </div>
                  {/* Hover icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                    <FiCamera className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="max-w-6xl max-h-[85vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[currentIndex].src}
              alt={filteredImages[currentIndex].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            {/* Image info */}
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-bold mb-1">
                {filteredImages[currentIndex].title}
              </h3>
              <div className="flex items-center justify-center gap-1 text-gray-300">
                <FiMapPin className="w-4 h-4" />
                <span>{filteredImages[currentIndex].location}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {currentIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
