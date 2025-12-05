import nodemailer from "nodemailer";

// Cấu hình transporter
// Trong thực tế, bạn nên dùng biến môi trường
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (VD: travel@gmail.com)
    pass: process.env.EMAIL_PASS, // App Password (không phải mật khẩu đăng nhập)
  },
});

export const sendBookingConfirmation = async (
  booking: any,
  tour: any,
  schedule: any
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️ Chưa cấu hình EMAIL_USER và EMAIL_PASS trong .env");
    console.log("   -> Bỏ qua việc gửi email.");
    return;
  }

  const departureDate = schedule
    ? new Date(schedule.departureDate).toLocaleDateString("vi-VN")
    : "Liên hệ sau";

  const returnDate = schedule
    ? new Date(schedule.returnDate).toLocaleDateString("vi-VN")
    : "Liên hệ sau";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Xác Nhận Đặt Tour</h1>
        <p style="margin: 5px 0 0;">Cảm ơn bạn đã lựa chọn chúng tôi!</p>
      </div>
      
      <div style="padding: 20px;">
        <p>Xin chào <strong>${booking.customerName}</strong>,</p>
        <p>Đơn đặt tour của bạn đã được ghi nhận thành công. Dưới đây là thông tin chi tiết:</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">${tour.name}</h3>
          <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${
            booking.id
          }</p>
          <p style="margin: 5px 0;"><strong>Ngày khởi hành:</strong> ${departureDate}</p>
          <p style="margin: 5px 0;"><strong>Ngày về:</strong> ${returnDate}</p>
          <p style="margin: 5px 0;"><strong>Số khách:</strong> ${
            booking.adultCount
          } người lớn, ${booking.childCount} trẻ em</p>
          <p style="margin: 5px 0; font-size: 18px; color: #dc2626;"><strong>Tổng tiền: ${booking.totalPrice.toLocaleString(
            "vi-VN"
          )}đ</strong></p>
        </div>

        <p>Chúng tôi sẽ sớm liên hệ qua số điện thoại <strong>${
          booking.customerPhone
        }</strong> để xác nhận và hướng dẫn thanh toán.</p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #666;">
          Nếu có bất kỳ thắc mắc nào, vui lòng trả lời email này hoặc gọi hotline: 1900 xxxx.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Travel Web" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: `[Xác Nhận] Đặt tour #${booking.id} - ${tour.name}`,
      html: htmlContent,
    });
    console.log(`📧 Email xác nhận đã gửi tới ${booking.customerEmail}`);
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
  }
};
