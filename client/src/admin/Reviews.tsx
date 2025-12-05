import { useEffect, useState } from "react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
  tour: { id: number; name: string };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/reviews", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không tải được danh sách đánh giá");
      setReviews(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchReviews();
      } else {
        alert("Xóa thất bại");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Đang tải đánh giá...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Quản lý đánh giá</h1>
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Khách hàng</th>
              <th className="text-left p-2">Tour</th>
              <th className="text-left p-2">Điểm</th>
              <th className="text-left p-2">Nội dung</th>
              <th className="text-left p-2">Ngày</th>
              <th className="text-left p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">
                  <div>{r.user.name}</div>
                  <div className="text-xs text-gray-500">{r.user.email}</div>
                </td>
                <td className="p-2">{r.tour.name}</td>
                <td className="p-2 text-yellow-600 font-bold">{r.rating} ★</td>
                <td className="p-2 max-w-xs truncate" title={r.comment}>
                  {r.comment}
                </td>
                <td className="p-2">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(r.id)}
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
