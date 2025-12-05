import { useEffect, useState } from "react";

type Voucher = {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  value: number;
  maxDiscount: number | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
};

export default function Vouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    value: "",
    maxDiscount: "",
    expiresAt: "",
    usageLimit: "",
    isActive: true,
  });

  const fetchVouchers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/vouchers", {
        credentials: "include",
      });
      if (res.ok) {
        setVouchers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5000/admin/vouchers/${editingId}`
      : "http://localhost:5000/admin/vouchers";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code: formData.code,
          discountType: formData.discountType,
          value: formData.value,
          maxDiscount: formData.maxDiscount || null,
          expiresAt: formData.expiresAt || null,
          usageLimit: formData.usageLimit || null,
          isActive: formData.isActive,
        }),
      });
      if (res.ok) {
        await fetchVouchers();
        setFormData({
          code: "",
          discountType: "PERCENT",
          value: "",
          maxDiscount: "",
          expiresAt: "",
          usageLimit: "",
          isActive: true,
        });
        setEditingId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (v: Voucher) => {
    setEditingId(v.id);
    setFormData({
      code: v.code,
      discountType: v.discountType,
      value: v.value.toString(),
      maxDiscount: v.maxDiscount?.toString() || "",
      expiresAt: v.expiresAt ? v.expiresAt.split("T")[0] : "",
      usageLimit: v.usageLimit?.toString() || "",
      isActive: v.isActive,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa voucher này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/vouchers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await fetchVouchers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Voucher</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <h2 className="font-semibold">{editingId ? "Sửa" : "Thêm"} Voucher</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Mã voucher</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Loại giảm giá
            </label>
            <select
              value={formData.discountType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountType: e.target.value as "PERCENT" | "FIXED",
                })
              }
              className="w-full border rounded px-2 py-1"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Số tiền cố định (₫)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá trị</label>
            <input
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Giảm tối đa (₫)
            </label>
            <input
              type="number"
              value={formData.maxDiscount}
              onChange={(e) =>
                setFormData({ ...formData, maxDiscount: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
              placeholder="Chỉ cho PERCENT"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hạn sử dụng
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData({ ...formData, expiresAt: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số lượt dùng
            </label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
              placeholder="Để trống = vô hạn"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
          />
          <label className="text-sm">Kích hoạt</label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? "Cập nhật" : "Tạo mới"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  code: "",
                  discountType: "PERCENT",
                  value: "",
                  maxDiscount: "",
                  expiresAt: "",
                  usageLimit: "",
                  isActive: true,
                });
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Mã</th>
              <th className="p-2 text-left">Loại</th>
              <th className="p-2 text-left">Giá trị</th>
              <th className="p-2 text-left">Giảm tối đa</th>
              <th className="p-2 text-left">Hết hạn</th>
              <th className="p-2 text-left">Lượt dùng</th>
              <th className="p-2 text-left">Trạng thái</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-2 font-mono">{v.code}</td>
                <td className="p-2">
                  {v.discountType === "PERCENT" ? "%" : "₫"}
                </td>
                <td className="p-2">
                  {v.discountType === "PERCENT"
                    ? `${v.value}%`
                    : `${v.value.toLocaleString()}₫`}
                </td>
                <td className="p-2">
                  {v.maxDiscount ? `${v.maxDiscount.toLocaleString()}₫` : "—"}
                </td>
                <td className="p-2">
                  {v.expiresAt
                    ? new Date(v.expiresAt).toLocaleDateString("vi-VN")
                    : "Vô hạn"}
                </td>
                <td className="p-2">
                  {v.usedCount}/{v.usageLimit || "∞"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      v.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.isActive ? "Kích hoạt" : "Tắt"}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(v)}
                    className="text-blue-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
