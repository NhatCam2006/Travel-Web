import { useEffect, useState } from "react";
import ScheduleModal from "./ScheduleModal";
import ImageUpload from "../components/ImageUpload";

type Tour = {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: string;
  transport?: string | null;
  images: string[];
  locationId: number;
};

type Location = { id: number; name: string };

export default function AdminTours() {
  const [items, setItems] = useState<Tour[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [scheduleTour, setScheduleTour] = useState<Tour | null>(null);
  const [form, setForm] = useState<Partial<Tour> & { imagesText?: string }>({
    name: "",
    description: "",
    price: 0,
    duration: "",
    transport: "",
    images: [],
    imagesText: "",
    locationId: 0,
  });

  const fetchTours = async () => {
    const res = await fetch("http://localhost:5000/admin/tours", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Không tải được tours");
    return (await res.json()) as Tour[];
  };

  const fetchLocations = async () => {
    const res = await fetch("http://localhost:5000/admin/locations", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Không tải được locations");
    const rows = (await res.json()) as any[];
    return rows.map((r) => ({ id: r.id, name: r.name })) as Location[];
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [ls, ts] = await Promise.all([fetchLocations(), fetchTours()]);
        setLocations(ls);
        setItems(ts);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name?.trim(),
        description: form.description ?? "",
        price: Number(form.price || 0),
        duration: form.duration?.trim(),
        transport: form.transport ?? null,
        images: (form.imagesText || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        locationId: Number(form.locationId),
      } as any;
      const url = editing
        ? `http://localhost:5000/admin/tours/${editing.id}`
        : "http://localhost:5000/admin/tours";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          editing ? "Cập nhật tour thất bại" : "Tạo tour thất bại"
        );
      setItems(await fetchTours());
      setEditing(null);
      setForm({
        name: "",
        description: "",
        price: 0,
        duration: "",
        transport: "",
        images: [],
        imagesText: "",
        locationId: locations[0]?.id || 0,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    }
  };

  const onEdit = (t: Tour) => {
    setEditing(t);
    setForm({ ...t, imagesText: (t.images || []).join(", ") });
  };

  const onDelete = async (id: number) => {
    if (!confirm("Xác nhận xoá tour?")) return;
    const res = await fetch(`http://localhost:5000/admin/tours/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setError("Xoá thất bại");
      return;
    }
    setItems(await fetchTours());
  };

  if (loading) return <div>Đang tải tours…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex gap-4">
      <div className="w-2/3">
        <h1 className="text-xl font-semibold mb-4">Danh sách Tours</h1>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Tên</th>
                <th className="p-2 text-left">Giá</th>
                <th className="p-2 text-left">Thời gian</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.price.toLocaleString()} ₫</td>
                  <td className="p-2">{t.duration}</td>
                  <td className="p-2">
                    {locations.find((l) => l.id === t.locationId)?.name ||
                      t.locationId}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => setScheduleTour(t)}
                      className="px-2 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
                    >
                      Lịch
                    </button>
                    <button
                      onClick={() => onEdit(t)}
                      className="px-2 py-1 text-xs rounded bg-yellow-100 hover:bg-yellow-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-1/3">
        <h2 className="font-semibold mb-2">
          {editing ? "Sửa tour" : "Thêm tour"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-2">
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Tên"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full border rounded px-2 py-1"
            placeholder="Mô tả"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              className="flex-1 border rounded px-2 py-1"
              placeholder="Giá"
              value={form.price ?? 0}
              onChange={(e) =>
                setForm({ ...form, price: parseFloat(e.target.value) })
              }
            />
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Thời gian"
              value={form.duration || ""}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Phương tiện"
            value={form.transport || ""}
            onChange={(e) => setForm({ ...form, transport: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Ảnh tour</label>
            <ImageUpload
              onUpload={(urls) =>
                setForm({ ...form, images: urls, imagesText: urls.join(", ") })
              }
              multiple={true}
              existingImages={form.images || []}
              maxFiles={10}
            />
            <input
              className="w-full border rounded px-2 py-1 mt-2 text-xs"
              placeholder="Hoặc nhập URLs, cách nhau bằng dấu phẩy"
              value={form.imagesText || ""}
              onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
            />
          </div>
          <select
            className="w-full border rounded px-2 py-1"
            value={form.locationId || 0}
            onChange={(e) =>
              setForm({ ...form, locationId: parseInt(e.target.value) })
            }
          >
            <option value={0} disabled>
              Chọn địa điểm
            </option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            >
              {editing ? "Lưu" : "Thêm"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    name: "",
                    description: "",
                    price: 0,
                    duration: "",
                    transport: "",
                    images: [],
                    imagesText: "",
                    locationId: locations[0]?.id || 0,
                  });
                }}
                className="px-3 py-1 rounded bg-gray-200 text-sm"
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>
      {scheduleTour && (
        <ScheduleModal
          tourId={scheduleTour.id}
          tourName={scheduleTour.name}
          onClose={() => setScheduleTour(null)}
        />
      )}
    </div>
  );
}
