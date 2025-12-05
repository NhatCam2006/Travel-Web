import { useEffect, useState } from "react";

interface Schedule {
  id: number;
  departureDate: string;
  returnDate: string;
  price: number | null;
  availableSeats: number;
}

interface ScheduleModalProps {
  tourId: number;
  tourName: string;
  onClose: () => void;
}

export default function ScheduleModal({
  tourId,
  tourName,
  onClose,
}: ScheduleModalProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    departureDate: "",
    returnDate: "",
    price: "",
    availableSeats: 20,
  });

  const fetchSchedules = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tours/${tourId}/schedules`
      );
      if (res.ok) {
        setSchedules(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [tourId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/tours/${tourId}/schedules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            departureDate: form.departureDate,
            returnDate: form.returnDate,
            price: form.price ? Number(form.price) : null,
            availableSeats: Number(form.availableSeats),
          }),
        }
      );
      if (res.ok) {
        fetchSchedules();
        setForm({
          departureDate: "",
          returnDate: "",
          price: "",
          availableSeats: 20,
        });
      } else {
        alert("Lỗi khi thêm lịch");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa lịch này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/schedules/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchSchedules();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Lịch khởi hành: {tourName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Thêm lịch mới</h3>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-xs mb-1">Ngày đi</label>
              <input
                type="datetime-local"
                required
                className="w-full border rounded p-1"
                value={form.departureDate}
                onChange={(e) =>
                  setForm({ ...form, departureDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Ngày về</label>
              <input
                type="datetime-local"
                required
                className="w-full border rounded p-1"
                value={form.returnDate}
                onChange={(e) =>
                  setForm({ ...form, returnDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Số chỗ</label>
              <input
                type="number"
                required
                className="w-full border rounded p-1"
                value={form.availableSeats}
                onChange={(e) =>
                  setForm({ ...form, availableSeats: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Giá riêng (tùy chọn)</label>
              <input
                type="number"
                className="w-full border rounded p-1"
                placeholder="Để trống nếu dùng giá gốc"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
          >
            Thêm lịch
          </button>
        </form>

        <div>
          <h3 className="font-semibold mb-2">Danh sách lịch trình</h3>
          {loading ? (
            <p>Đang tải...</p>
          ) : schedules.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có lịch khởi hành nào.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Ngày đi</th>
                  <th className="p-2">Ngày về</th>
                  <th className="p-2">Chỗ</th>
                  <th className="p-2">Giá</th>
                  <th className="p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-2">
                      {new Date(s.departureDate).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-2">
                      {new Date(s.returnDate).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-2">{s.availableSeats}</td>
                    <td className="p-2">
                      {s.price ? s.price.toLocaleString() : "-"}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
