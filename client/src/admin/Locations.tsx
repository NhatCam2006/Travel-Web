import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import ImageUpload from "../components/ImageUpload";

const markerIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Location = {
  id: number;
  name: string;
  description: string | null;
  region: "NORTH" | "CENTRAL" | "SOUTH";
  latitude: number;
  longitude: number;
  image: string;
};

const ClickPicker = ({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function AdminLocations() {
  const [items, setItems] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState<Partial<Location>>({
    name: "",
    description: "",
    region: "NORTH",
    latitude: 16.0471,
    longitude: 108.2068,
    image: "",
  });

  const fetchList = async () => {
    const res = await fetch("http://localhost:5000/admin/locations", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Không tải được danh sách địa điểm");
    return (await res.json()) as Location[];
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setItems(await fetchList());
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
        region: form.region,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        image: form.image?.trim(),
      } as any;
      const url = editing
        ? `http://localhost:5000/admin/locations/${editing.id}`
        : "http://localhost:5000/admin/locations";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          editing ? "Cập nhật thất bại" : "Tạo địa điểm thất bại"
        );
      setItems(await fetchList());
      setEditing(null);
      setForm({
        name: "",
        description: "",
        region: "NORTH",
        latitude: 16.0471,
        longitude: 108.2068,
        image: "",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    }
  };

  const onEdit = (loc: Location) => {
    setEditing(loc);
    setForm(loc);
  };

  const onDelete = async (id: number) => {
    if (!confirm("Xác nhận xoá địa điểm?")) return;
    const res = await fetch(`http://localhost:5000/admin/locations/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setError("Xoá thất bại");
      return;
    }
    setItems(await fetchList());
  };

  const center = useMemo<[number, number]>(
    () => [
      Number(form.latitude) || 16.0471,
      Number(form.longitude) || 108.2068,
    ],
    [form.latitude, form.longitude]
  );

  if (loading) return <div>Đang tải địa điểm…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex gap-4">
      <div className="w-2/3">
        <h1 className="text-xl font-semibold mb-4">Danh sách Địa điểm</h1>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Tên</th>
                <th className="p-2 text-left">Vùng</th>
                <th className="p-2 text-left">Toạ độ</th>
                <th className="p-2 text-left">Ảnh</th>
                <th className="p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((loc) => (
                <tr key={loc.id} className="border-t">
                  <td className="p-2">{loc.id}</td>
                  <td className="p-2">{loc.name}</td>
                  <td className="p-2">{loc.region}</td>
                  <td className="p-2">
                    {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                  </td>
                  <td className="p-2 max-w-[160px] truncate">{loc.image}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => onEdit(loc)}
                      className="px-2 py-1 text-xs rounded bg-yellow-100 hover:bg-yellow-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(loc.id)}
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
          {editing ? "Sửa địa điểm" : "Thêm địa điểm"}
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
          <select
            className="w-full border rounded px-2 py-1"
            value={form.region}
            onChange={(e) =>
              setForm({ ...form, region: e.target.value as any })
            }
          >
            <option value="NORTH">NORTH</option>
            <option value="CENTRAL">CENTRAL</option>
            <option value="SOUTH">SOUTH</option>
          </select>
          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh đại diện
            </label>
            <ImageUpload
              onUpload={(urls) => setForm({ ...form, image: urls[0] || "" })}
              multiple={false}
              existingImages={form.image ? [form.image] : []}
              maxFiles={1}
            />
            <input
              type="url"
              className="w-full border rounded px-2 py-1 mt-2 text-xs"
              placeholder="Hoặc nhập URL ảnh"
              value={form.image || ""}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.0001"
              className="flex-1 border rounded px-2 py-1"
              placeholder="Latitude"
              value={form.latitude ?? ""}
              onChange={(e) =>
                setForm({ ...form, latitude: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              step="0.0001"
              className="flex-1 border rounded px-2 py-1"
              placeholder="Longitude"
              value={form.longitude ?? ""}
              onChange={(e) =>
                setForm({ ...form, longitude: parseFloat(e.target.value) })
              }
            />
          </div>
          <div className="h-56 w-full overflow-hidden rounded border">
            <MapContainer center={center} zoom={6} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickPicker
                onPick={(lat, lng) =>
                  setForm({ ...form, latitude: lat, longitude: lng })
                }
              />
              {form.latitude && form.longitude && (
                <Marker
                  icon={markerIcon}
                  position={[Number(form.latitude), Number(form.longitude)]}
                />
              )}
            </MapContainer>
          </div>
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
                    region: "NORTH",
                    latitude: 16.0471,
                    longitude: 108.2068,
                    image: "",
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
    </div>
  );
}
