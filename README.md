# 🌏 Travel Booking Website

Một nền tảng đặt tour du lịch trực tuyến hiện đại, đầy đủ tính năng, được xây dựng với PERN stack (PostgreSQL, Express, React, Node.js).

## 🚀 Công nghệ sử dụng

### Frontend (`/client`)

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State/Routing:** React Router DOM, Context API
- **Icons:** React Icons
- **HTTP Client:** Fetch API

### Backend (`/server`)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer (Gửi email xác nhận)

## ✨ Tính năng chính

### Người dùng (User)

- 🔐 **Xác thực:** Đăng ký, Đăng nhập, Quên mật khẩu.
- 🏠 **Trang chủ:** Tìm kiếm tour, xem tour nổi bật, điểm đến phổ biến.
- 🎫 **Đặt tour:** Chọn lịch trình, số lượng khách, áp dụng mã giảm giá (Voucher).
- 💳 **Thanh toán:** Tích hợp thanh toán qua mã QR (Mô phỏng).
- 👤 **Cá nhân:** Quản lý hồ sơ, xem lịch sử đặt tour.
- ⭐ **Đánh giá:** Viết đánh giá và chấm điểm cho các tour đã đi.
- 🖼️ **Thư viện ảnh:** Xem thư viện ảnh du lịch đẹp mắt.

### Quản trị viên (Admin)

- 📊 **Dashboard:** Thống kê doanh thu, số lượng booking.
- ✈️ **Quản lý Tour:** Thêm, sửa, xóa tour, lịch trình (Schedules).
- 📝 **Quản lý Đơn hàng:** Xem chi tiết, xác nhận hoặc hủy đơn hàng.
- 🎟️ **Quản lý Voucher:** Tạo mã giảm giá, quản lý hạn sử dụng.
- 🖼️ **Quản lý Gallery:** Upload và quản lý ảnh thư viện.
- 💬 **Quản lý Đánh giá:** Duyệt hoặc ẩn đánh giá của người dùng.

## 🛠️ Cài đặt và Chạy dự án

### 1. Yêu cầu tiên quyết

- Node.js (v16 trở lên)
- PostgreSQL (đã cài đặt và đang chạy)
- Git

### 2. Cài đặt Backend (Server)

```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server` và cấu hình các biến môi trường:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/travel_db?schema=public"
JWT_SECRET="your_super_secret_key"
# Cấu hình Email (nếu có)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

Chạy migration để tạo bảng trong database:

```bash
npx prisma migrate dev --name init
npx prisma db seed # (Tùy chọn) Tạo dữ liệu mẫu
```

Khởi chạy server:

```bash
npm run dev
```

### 3. Cài đặt Frontend (Client)

Mở một terminal mới:

```bash
cd client
npm install
```

Khởi chạy ứng dụng React:

```bash
npm run dev
```

Truy cập vào `http://localhost:5173` để trải nghiệm website.

## 📂 Cấu trúc thư mục

```
project-root/
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── admin/          # Trang quản trị
│   │   ├── components/     # Các component tái sử dụng
│   │   ├── pages/          # Các trang chính (Home, Booking...)
│   │   └── ...
├── server/                 # Backend Express App
│   ├── prisma/             # Schema database & Migrations
│   ├── src/
│   │   ├── controllers/    # Xử lý logic
│   │   ├── routes/         # Định nghĩa API endpoints
│   │   └── ...
└── README.md
```

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc mở Issue nếu bạn tìm thấy lỗi.
