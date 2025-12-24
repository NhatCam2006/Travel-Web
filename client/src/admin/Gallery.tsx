import { useEffect, useState } from "react";
import ImageUpload from "../components/ImageUpload";
import { FiTrash2, FiPlus } from "react-icons/fi";

// Lấy API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type GalleryImage = {
  id: number;
  src: string;
  title: string;
  location: string;
  category: string;
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  // Đã xóa loading và error vì không dùng đến
  const [form, setForm] = useState({
    src: "",
    title: "",
    location: "",
    category: "beach",
  });

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`);
      if (!res.ok) throw new Error("Không tải được ảnh");
      setImages(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.src) return alert("Vui lòng chọn ảnh");

    try {
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Thêm ảnh thất bại");

      setForm({ src: "", title: "", location: "", category: "beach" });
      fetchImages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xoá ảnh này?")) return;
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Xoá thất bại");
      setImages(images.filter((img) => img.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi");
    }
  };

  return (
    <div className="flex gap-6">
      {/* List */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Thư viện ảnh</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden aspect-[4/3]"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <p className="font-bold">{img.title}</p>
                <p className="text-sm opacity-80">{img.location}</p>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="w-80 shrink-0">
        <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-4">
          <h2 className="font-bold text-lg mb-4">Thêm ảnh mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ảnh</label>
              <ImageUpload
                onUpload={(urls) => setForm({ ...form, src: urls[0] })}
                maxFiles={1}
                existingImages={form.src ? [form.src] : []}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Vịnh Hạ Long"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Địa điểm</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="VD: Quảng Ninh"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="beach">Biển & Đảo</option>
                <option value="mountain">Núi & Cao nguyên</option>
                <option value="culture">Văn hóa & Di sản</option>
                <option value="city">Đô thị & Hiện đại</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <FiPlus /> Thêm ảnh
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}