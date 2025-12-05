import { useEffect, useState } from "react";
import TourCard from "../components/TourCard";

type Tour = {
  id: number;
  name: string;
  price: number;
  duration: string;
  images?: string[];
};

export default function PopularTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [region, setRegion] = useState<"NORTH" | "CENTRAL" | "SOUTH" | "">("");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "newest">(
    "newest"
  );

  const fetchTours = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (query || searchQuery) params.append("q", query || searchQuery);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (region) params.append("region", region);
      if (sort) params.append("sort", sort);
      const res = await fetch(
        `http://localhost:5000/api/tours/search?${params.toString()}`
      );
      if (!res.ok) throw new Error("Không tải được danh sách tour");
      setTours(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q") || "";
    const date = urlParams.get("date") || "";
    const guests = urlParams.get("guests") || "";

    setSearchQuery(q);
    setDepartureDate(date);
    setGuestCount(guests);

    fetchTours(q);
  }, []);

  if (loading) return <div className="p-4">Đang tải tour phổ biến…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      {/* Filter sidebar */}
      <aside className="w-64 bg-white p-4 rounded shadow-md h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-4">Bộ lọc</h2>

        {/* Search Query */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Tìm kiếm</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Tên tour, địa điểm..."
          />
        </div>

        {/* Departure Date */}
        {departureDate && (
          <div className="mb-4 bg-blue-50 p-2 rounded">
            <label className="block text-sm font-semibold mb-1">Ngày đi</label>
            <div className="text-sm text-blue-700">
              {new Date(departureDate).toLocaleDateString("vi-VN")}
            </div>
          </div>
        )}

        {/* Guest Count */}
        {guestCount && (
          <div className="mb-4 bg-blue-50 p-2 rounded">
            <label className="block text-sm font-semibold mb-1">Số khách</label>
            <div className="text-sm text-blue-700">{guestCount} người</div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Giá từ (₫)</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="0"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Giá đến (₫)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="10000000"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Vùng</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="region"
                value=""
                checked={region === ""}
                onChange={() => setRegion("")}
                className="mr-2"
              />
              Tất cả
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="region"
                value="NORTH"
                checked={region === "NORTH"}
                onChange={() => setRegion("NORTH")}
                className="mr-2"
              />
              Miền Bắc
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="region"
                value="CENTRAL"
                checked={region === "CENTRAL"}
                onChange={() => setRegion("CENTRAL")}
                className="mr-2"
              />
              Miền Trung
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="region"
                value="SOUTH"
                checked={region === "SOUTH"}
                onChange={() => setRegion("SOUTH")}
                className="mr-2"
              />
              Miền Nam
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Sắp xếp</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp → cao</option>
            <option value="price-desc">Giá cao → thấp</option>
          </select>
        </div>
        <button
          onClick={() => fetchTours()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Áp dụng
        </button>
      </aside>

      {/* Results */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-2">Tour phổ biến</h1>
        {(searchQuery || departureDate || guestCount) && (
          <div className="mb-4 text-sm text-gray-600">
            Kết quả tìm kiếm
            {searchQuery && (
              <span>
                {" "}
                cho "<strong>{searchQuery}</strong>"
              </span>
            )}
            {departureDate && (
              <span>
                {" "}
                vào ngày{" "}
                <strong>
                  {new Date(departureDate).toLocaleDateString("vi-VN")}
                </strong>
              </span>
            )}
            {guestCount && (
              <span>
                {" "}
                cho <strong>{guestCount}</strong> người
              </span>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((t) => (
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
        {tours.length === 0 && (
          <p className="text-gray-500 text-center mt-8">
            Không tìm thấy tour nào.
          </p>
        )}
      </main>
    </div>
  );
}
