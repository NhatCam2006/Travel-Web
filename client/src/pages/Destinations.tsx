import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TourCard from "../components/TourCard";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiArrowLeft,
  FiGrid,
  FiList,
  FiChevronDown,
} from "react-icons/fi";

interface Location {
  id: number;
  name: string;
  description: string;
  region: "NORTH" | "CENTRAL" | "SOUTH";
  latitude: number;
  longitude: number;
  image: string;
  tours: Tour[];
}

interface Tour {
  id: number;
  name: string;
  price: number;
  duration: string;
  images?: string[];
}

const REGIONS = {
  NORTH: "Miền Bắc",
  CENTRAL: "Miền Trung",
  SOUTH: "Miền Nam",
};

type PriceRange = "all" | "low" | "mid" | "high";
type SortBy = "newest" | "price-asc" | "price-desc";

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLocationId = searchParams.get("location");
  const selectedRegion = searchParams.get("region") as
    | "NORTH"
    | "CENTRAL"
    | "SOUTH"
    | null;

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  useEffect(() => {
    // Fetch all locations
    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const selectedLocation = selectedLocationId
    ? locations.find((loc) => loc.id === Number(selectedLocationId))
    : null;

  // Get tours based on selection
  const tours =
    selectedLocationId && selectedLocation
      ? selectedLocation.tours
      : selectedRegion
      ? locations
          .filter((loc) => loc.region === selectedRegion)
          .flatMap((loc) => loc.tours)
      : locations.flatMap((loc) => loc.tours);

  // Filter and sort tours
  const filteredTours = tours
    .filter((tour) => {
      // Search filter
      if (
        searchQuery &&
        !tour.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Price filter
      if (priceRange === "low" && tour.price > 3000000) return false;
      if (
        priceRange === "mid" &&
        (tour.price <= 3000000 || tour.price > 7000000)
      )
        return false;
      if (priceRange === "high" && tour.price <= 7000000) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // newest (default order from API)
    });

  const filteredLocations = locations.filter((loc) => {
    if (selectedRegion && loc.region !== selectedRegion) return false;
    if (
      searchQuery &&
      !loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-emerald-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Khám phá điểm đến
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Tìm kiếm và đặt tour du lịch tại các địa điểm tuyệt vời nhất Việt
              Nam
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Region Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => {
              setSearchParams({});
            }}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
              !selectedRegion && !selectedLocationId
                ? "bg-sky-600 text-white shadow-lg shadow-sky-500/30"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
            }`}
          >
            Tất cả
          </button>
          {Object.entries(REGIONS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSearchParams({ region: key });
              }}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedRegion === key
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-500/30"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Selected Location Header */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card overflow-hidden mb-8"
          >
            <div className="relative h-48 md:h-64">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <button
                onClick={() => setSearchParams({})}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm mb-2">
                  <FiMapPin className="w-3 h-3 inline mr-1" />
                  {REGIONS[selectedLocation.region]}
                </span>
                <h2 className="text-3xl font-bold text-white">
                  {selectedLocation.name}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">{selectedLocation.description}</p>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tour hoặc địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                className="input-field pl-12 pr-10 appearance-none cursor-pointer"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="low">Dưới 3 triệu</option>
                <option value="mid">3 - 7 triệu</option>
                <option value="high">Trên 7 triệu</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-800">
                {selectedLocationId
                  ? filteredTours.length
                  : filteredLocations.length}
              </span>{" "}
              {selectedLocationId ? "tour" : "điểm đến"}
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-sky-50 text-sky-600">
                <FiGrid className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content: Show locations or tours */}
        {!selectedLocationId ? (
          <>
            {/* Locations Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedRegion ? REGIONS[selectedRegion] : "Tất cả địa điểm"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    setSearchParams({ location: location.id.toString() })
                  }
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
                        {location.tours.length} tour
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-sky-500 text-white rounded-full">
                        <FiMapPin className="w-3 h-3" />
                        {REGIONS[location.region]}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {location.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Tours Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Tours tại {selectedLocation?.name}
                <span className="text-gray-400 font-normal ml-2">
                  ({filteredTours.length})
                </span>
              </h2>
            </div>
            {filteredTours.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-2xl shadow-card"
              >
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Không tìm thấy tour
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc để xem thêm kết quả
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TourCard
                      id={tour.id}
                      name={tour.name}
                      price={tour.price}
                      duration={tour.duration}
                      images={tour.images}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
