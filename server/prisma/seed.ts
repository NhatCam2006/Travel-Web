import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Tạo các Địa điểm (Locations)
  const locations = [
    {
      name: "Hà Giang",
      description:
        "Vùng đất địa đầu tổ quốc với cao nguyên đá hùng vĩ, cung đường Hạnh Phúc uốn lượn và văn hóa dân tộc đa dạng. Nơi có Cột cờ Lũng Cú, núi đôi Quản Bạ, và những cánh đồng hoa tam giác mạch bất tận.",
      region: "NORTH",
      latitude: 22.8233,
      longitude: 104.9839,
      image:
        "https://images.unsplash.com/photo-1625409636235-c7d09d4a03f6?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Hạ Long",
      description:
        "Di sản thiên nhiên thế giới với hơn 1,600 đảo đá vôi kỳ vĩ. Khám phá hang động Sửng Sốt, Thiên Cung, làng chài Cửa Vạn, và tận hưởng bữa tiệc hải sản tươi ngon trên du thuyền 5 sao.",
      region: "NORTH",
      latitude: 20.9069,
      longitude: 107.0734,
      image:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Đà Nẵng",
      description:
        "Thành phố đáng sống bậc nhất Việt Nam với bãi biển Mỹ Khê tuyệt đẹp, Bà Nà Hills nổi tiếng với Cầu Vàng, Ngũ Hành Sơn linh thiêng và ẩm thực đường phố phong phú. Điểm đến hoàn hảo cho cả du lịch biển và văn hóa.",
      region: "CENTRAL",
      latitude: 16.0544,
      longitude: 108.2022,
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Hội An",
      description:
        "Phố cổ di sản UNESCO với kiến trúc xưa cũ quyến rũ, hàng nghìn chiếc đèn lồng lung linh về đêm. Nổi tiếng với ẩm thực cao lầu, bánh mì Phượng, và làng rau Trà Quế. Trải nghiệm may áo dài theo yêu cầu và nghệ thuật dân gian.",
      region: "CENTRAL",
      latitude: 15.8801,
      longitude: 108.338,
      image:
        "https://images.unsplash.com/photo-1557750255-c76072a7aad1?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Đà Lạt",
      description:
        "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, thác Datanla hùng vĩ, hồ Tuyền Lâm thơ mộng. Nổi tiếng với cà phê chồn, dâu tây tươi, và những khu vườn hoa đầy màu sắc. Điểm đến lý tưởng cho các cặp đôi và gia đình.",
      region: "SOUTH",
      latitude: 11.9404,
      longitude: 108.4583,
      image:
        "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Phú Quốc",
      description:
        "Đảo ngọc thiên đường với bãi biển Sao trong xanh, Vinpearl Safari, Grand World và Sun World Hon Thom. Thưởng thức hải sản tươi sống, ghẹ hấp, nhum nướng và mực một nắng. Lặn ngắm san hô tại Nam đảo và chiêm ngưỡng hoàng hôn tuyệt đẹp.",
      region: "SOUTH",
      latitude: 10.2899,
      longitude: 103.984,
      image:
        "https://images.unsplash.com/photo-1583652961463-5e7a37e1e3f7?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  for (const loc of locations) {
    const tours = [];

    // Tour 1: Tour cao cấp
    tours.push({
      name: `${loc.name} Trọn Gói 4N3Đ - Khám Phá Toàn Diện`,
      description: `🌟 ĐIỂM NỔI BẬT:
• Khách sạn 4 sao trung tâm, view đẹp, đầy đủ tiện nghi
• Tham quan TẤT CẢ điểm nổi tiếng nhất ${loc.name}
• Hướng dẫn viên tiếng Việt nhiệt tình, am hiểu địa phương
• Bao gồm vé tham quan, bảo hiểm du lịch
• Xe ô tô đời mới, điều hòa, wifi miễn phí
• Buffet sáng + Set menu trưa/tối với đặc sản địa phương

📅 LỊCH TRÌNH CHI TIẾT:

NGÀY 1: KHỞI HÀNH - THAM QUAN (Ăn trưa, tối)
06:00 - Xe và HDV đón quý khách tại điểm hẹn
09:00 - Dừng chân nghỉ ngơi, ăn nhẹ tại điểm dừng
12:00 - Đến ${loc.name}, nhận phòng khách sạn 4 sao
13:00 - Ăn trưa tại nhà hàng với đặc sản địa phương
14:30 - Khởi hành tham quan điểm check-in nổi tiếng
17:30 - Tự do dạo phố, mua sắm, chụp ảnh
19:00 - Ăn tối buffet/set menu tại khách sạn
21:00 - Tự do nghỉ ngơi hoặc khám phá phố đêm

NGÀY 2: TOUR THAM QUAN TRỌN NGÀY (Ăn sáng, trưa, tối)
07:00 - Ăn sáng buffet tại khách sạn
08:00 - Khởi hành tham quan các điểm nổi tiếng
      • Điểm tham quan 1: Landmark nổi tiếng
      • Điểm tham quan 2: Khu du lịch sinh thái
      • Điểm tham quan 3: Bảo tàng/Di tích lịch sử
12:30 - Ăn trưa tại nhà hàng view đẹp
14:00 - Tiếp tục hành trình khám phá
      • Tham quan làng nghề truyền thống
      • Chụp ảnh tại các góc check-in hot
18:00 - Về khách sạn nghỉ ngơi
19:00 - Ăn tối và tự do khám phá đêm ${loc.name}

NGÀY 3: TRẢI NGHIỆM VĂN HÓA (Ăn sáng, trưa, tối)
07:30 - Ăn sáng tại khách sạn
08:30 - Khởi hành trải nghiệm văn hóa bản địa
      • Tham quan chợ địa phương
      • Học làm món ăn truyền thống
      • Thăm làng dân tộc (nếu có)
12:00 - Ăn trưa món đặc sản tự tay làm
14:00 - Mua sắm quà lưu niệm, đặc sản
16:00 - Về khách sạn nghỉ ngơi, tự do
19:00 - Bữa tối chia tay, gala dinner

NGÀY 4: TỰ DO - TRẢ PHÒNG - VỀ (Ăn sáng)
07:00 - Ăn sáng tại khách sạn
08:00 - Tự do dạo phố, mua sắm last minute
11:00 - Trả phòng, tập trung xe
12:00 - Khởi hành về, ăn trưa dọc đường
17:00 - Về đến điểm đón, chia tay

✅ GIÁ TOUR BAO GỒM:
• Xe ô tô đời mới, máy lạnh, wifi miễn phí
• Khách sạn 4 sao: 3 đêm, phòng 2 người/phòng
• Ăn uống: 3 bữa sáng + 6 bữa chính (trưa + tối)
• Vé tham quan theo chương trình
• Hướng dẫn viên chuyên nghiệp suốt tuyến
• Bảo hiểm du lịch mức 50.000.000đ/người
• Nước suối, khăn lạnh trên xe
• Nón lá ${loc.name} + Túi vải du lịch

❌ GIÁ TOUR KHÔNG BAO GỒM:
• Vé máy bay/tàu khứ hồi (nếu có)
• Chi phí cá nhân: giặt ủi, điện thoại, minibar...
• Các bữa ăn ngoài chương trình
• Tip cho HDV và tài xế (theo ý khách)
• Thuế VAT 8%

📝 LƯU Ý QUAN TRỌNG:
• Mang theo CMND/CCCD bản gốc
• Trang phục thoải mái, giày thể thao
• Kem chống nắng, mũ, kính râm
• Thuốc cá nhân (nếu có)
• Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung)
• Trẻ em 5-10 tuổi: Tính 70% giá tour
• Phụ thu phòng đơn: 1.500.000đ/người

🎁 QUÀ TẶNG ĐẶC BIỆT:
• Nón lá ${loc.name} thêu tên
• Bộ ảnh kỷ niệm chụp tại điểm đẹp
• Voucher ẩm thực 200.000đ
• 01 chai đặc sản ${loc.name}

❓ CHÍNH SÁCH HUỶ TOUR:
• Hủy trước 15 ngày: Hoàn 90% tổng tiền
• Hủy trước 7-14 ngày: Hoàn 70% tổng tiền
• Hủy trước 3-6 ngày: Hoàn 50% tổng tiền
• Hủy trong 3 ngày: Không hoàn tiền`,
      price: 4500000,
      duration: "4 ngày 3 đêm",
      transport: "Ô tô 16 chỗ đời mới",
      images: [loc.image, loc.image, loc.image],
    });

    // Tour 2: Tour tiết kiệm
    tours.push({
      name: `${loc.name} Tiết Kiệm 2N1Đ - Trọn Gói`,
      description: `💰 TOUR TIẾT KIỆM - CHẤT LƯỢNG:
• Khách sạn 2-3 sao sạch sẽ, tiện nghi cơ bản
• Tham quan CÁC ĐIỂM MUST-SEE ${loc.name}
• Phù hợp sinh viên, người đi phượt, gia đình nhỏ
• Giá rẻ nhưng không giảm chất lượng
• Xe limousine/minivan tiện nghi
• Ăn uống tại quán ăn địa phương ngon-bổ-rẻ

📅 LỊCH TRÌNH CHI TIẾT:

NGÀY 1: KHỞI HÀNH - THAM QUAN (Ăn trưa, tối)
05:00 - Xe đón tại điểm hẹn, khởi hành sớm
09:00 - Dừng chân nghỉ ngơi, ăn sáng nhẹ (tự túc)
11:30 - Đến ${loc.name}, nhận phòng khách sạn 2-3 sao
12:30 - Ăn trưa tại quán ăn bình dân ngon, giá hợp lý
14:00 - Tham quan điểm check-in MUST-GO số 1
      • Chụp ảnh tại landmark nổi tiếng nhất
      • Tìm hiểu lịch sử, văn hóa qua HDV
      • Free time chụp ảnh sống ảo
17:00 - Tự do dạo phố cổ, chợ đêm ${loc.name}
18:30 - Ăn tối tự túc (HDV tư vấn quán ngon-rẻ)
20:00 - Về khách sạn nghỉ ngơi, tự do khám phá đêm

NGÀY 2: THAM QUAN - MUA SẮM - VỀ (Ăn sáng, trưa)
06:30 - Ăn sáng tại khách sạn (phở/bánh mì/cơm)
07:30 - Khởi hành tham quan các điểm nổi bật còn lại
      • Điểm tham quan 2: Khu du lịch HOT
      • Điểm tham quan 3: Chợ địa phương sầm uất
      • Góc check-in sống ảo trending nhất
11:30 - Ăn trưa món đặc sản phải thử khi đến ${loc.name}
13:00 - Mua sắm quà lưu niệm, đặc sản về
15:00 - Trả phòng, khởi hành về
20:00 - Về đến điểm đón ban đầu, kết thúc tour

✅ GIÁ TOUR BAO GỒM:
• Xe limousine/minivan đời mới, máy lạnh, wifi
• Khách sạn 2-3 sao: 1 đêm, phòng 2-3 người/phòng
• Ăn uống: 1 bữa sáng + 2 bữa trưa
• Vé tham quan CÁC ĐIỂM CHÍNH trong tour
• Hướng dẫn viên nhiệt tình, am hiểu địa phương
• Bảo hiểm du lịch 30.000.000đ/người
• Nước suối miễn phí trên xe

❌ GIÁ TOUR KHÔNG BAO GỒM:
• Các bữa ăn tối (tự do ăn uống khám phá)
• Vé tham quan điểm phụ không trong chương trình
• Chi phí cá nhân: giặt ủi, minibar...
• Tip HDV/tài xế (tùy tâm)

📝 LƯU Ý:
• Mang CMND/CCCD bản gốc
• Trang phục thoải mái, gọn nhẹ
• Mang theo tiền mặt cho bữa tối tự túc
• Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung bố mẹ)
• Trẻ em 5-10 tuổi: Tính 50% giá tour

🎁 QUÀ TẶNG:
• Móc khóa ${loc.name}
• Bản đồ du lịch miễn phí với gợi ý quán ăn ngon

❓ CHÍNH SÁCH HUỶ:
• Hủy trước 7 ngày: Hoàn 80% tổng tiền
• Hủy trước 3 ngày: Hoàn 50% tổng tiền
• Hủy trong 3 ngày: Không hoàn tiền`,
      price: 1800000,
      duration: "2 ngày 1 đêm",
      transport: "Xe limousine",
      images: [loc.image, loc.image],
    });

    // Tour 3: Tour trải nghiệm
    tours.push({
      name: `Trải Nghiệm ${loc.name} Theo Cách Riêng 3N2Đ`,
      description: `🎒 TOUR TRẢI NGHIỆM ĐỘC ĐÁO - SỐNG CHẬM:
• Khám phá ${loc.name} như người bản địa
• Ăn uống tại quán ăn dân dã chính gốc
• Homestay/Hostel đầy đủ tiện nghi, gần gũi
• Linh hoạt lịch trình theo sở thích nhóm
• Hướng dẫn viên là người địa phương
• Thuê xe máy tự khám phá tự do

📅 LỊCH TRÌNH CHI TIẾT (Linh Động):

NGÀY 1: ĐẾN - NHẬN PHÒNG - TỰ DO (Ăn trưa)
08:00 - Khởi hành từ điểm đón
12:00 - Đến ${loc.name}, nhận phòng homestay/hostel
13:00 - Ăn trưa tại quán ăn địa phương (HDV dẫn đến)
14:30 - Nhận xe máy, hướng dẫn đường đi
15:00 - TỰ DO khám phá:
      • Lái xe dạo quanh phố cổ
      • Ghé các quán cà phê view đẹp
      • Tìm hiểu văn hóa bản địa
18:00 - Tập trung HDV dẫn đi ăn tối tại quán ngon (tự túc)
20:00 - Tự do khám phá phố đêm, chợ đêm

NGÀY 2: TRẢI NGHIỆM - PHIÊU LƯU (Ăn sáng, trưa)
07:00 - Ăn sáng phở/bún tại quán quen thuộc
08:00 - TỰ DO HOẠT ĐỘNG (chọn 1 trong các option):
      
      OPTION A - TREKKING/HIKING:
      • Chinh phục đường trekking đẹp nhất
      • Checkin đỉnh núi, view 360 độ
      • Mang theo đồ ăn nhẹ, nước uống
      
      OPTION B - VĂN HÓA BẢN ĐỊA:
      • Thăm làng nghề truyền thống
      • Học làm đồ handmade
      • Trò chuyện với người dân
      
      OPTION C - ẨM THỰC ĐƯỜNG PHỐ:
      • Food tour khám phá món ăn địa phương
      • Ghé chợ mua đặc sản
      • Thử các món lạ miệng
      
12:00 - Ăn trưa tại nhà hàng view đẹp
14:00 - Tiếp tục khám phá các góc chụp ảnh đẹp
17:00 - Về homestay nghỉ ngơi
19:00 - Ăn tối BBQ/lẩu tại homestay (tự túc)
21:00 - Giao lưu với nhóm khác, hát hò, trò chuyện

NGÀY 3: MUA SẮM - VỀ (Ăn sáng)
07:00 - Ăn sáng tại homestay
08:00 - Trả phòng, trả xe máy
09:00 - Mua sắm quà lưu niệm, đặc sản
11:00 - Khởi hành về
16:00 - Về đến điểm đón, kết thúc chuyến đi

✅ GIÁ TOUR BAO GỒM:
• Xe đưa đón khứ hồi (ngày 1 và ngày 3)
• Homestay/Hostel: 2 đêm, phòng dorm/private
• Xe máy thuê: 2 ngày (xăng tự túc)
• Ăn uống: 2 bữa sáng + 2 bữa trưa
• Hướng dẫn viên local nhiệt tình
• Bảo hiểm xe máy + du lịch
• Bản đồ offline + gợi ý địa điểm

❌ GIÁ TOUR KHÔNG BAO GỒM:
• Các bữa tối (ăn tự do khám phá)
• Xăng xe máy (~100k/ngày)
• Vé tham quan các điểm (nếu có)
• Chi phí cá nhân

📝 LƯU Ý QUAN TRỌNG:
• Phải có bằng lái xe máy (A1/A2)
• Mang CMND/CCCD để thuê xe
• Trang phục thoải mái, giày thể thao
• Mang theo áo mưa, kem chống nắng
• Điện thoại có 4G để dùng Google Maps
• Nên mang theo powerbank

🎁 QUÀ TẶNG:
• Sổ tay travel journal ${loc.name}
• 01 bức ảnh Polaroid tại điểm đẹp
• Voucher quán cà phê 100k

❓ PHÙ HỢP:
• Nhóm bạn trẻ 20-35 tuổi
• Cặp đôi thích tự do
• Solo traveler muốn gặp gỡ bạn mới
• Người thích phiêu lưu, khám phá`,
      price: 2800000,
      duration: "3 ngày 2 đêm",
      transport: "Xe máy/Ô tô",
      images: [loc.image, loc.image],
    });

    // Tour 4: Tour gia đình
    tours.push({
      name: `${loc.name} Gia Đình Vui Vẻ 3N2Đ`,
      description: `👨‍👩‍👧‍👦 TOUR DÀNH CHO GIA ĐÌNH CÓ TRẺ NHỎ:
• Khách sạn gia đình, phòng rộng 35-40m², giường lớn
• Lịch trình nhẹ nhàng, không quá mệt mỏi
• Phù hợp trẻ em và người lớn tuổi
• Buffet sáng phong phú + Set menu trưa/tối
• Hoạt động vui chơi, giải trí cho bé
• Hướng dẫn viên chị chăm sóc tận tình

📅 LỊCH TRÌNH CHI TIẾT (Nhẹ Nhàng):

NGÀY 1: KHỞI HÀNH - NHẬN PHÒNG (Ăn trưa, tối)
07:00 - Xe đón tại nhà, khởi hành (có ghế trẻ em nếu cần)
09:30 - Dừng chân khu vui chơi, cho bé vận động
12:00 - Đến ${loc.name}, ăn trưa buffet tại khách sạn
13:30 - Nhận phòng, nghỉ ngơi (bé ngủ trưa)
15:30 - Tham quan điểm gần khách sạn, không mệt
      • Công viên có khu vui chơi trẻ em
      • Chụp ảnh gia đình tại điểm đẹp
      • Cho bé chơi đùa, vui vẻ
18:00 - Về khách sạn, tắm rửa
19:00 - Ăn tối buffet (menu đa dạng cho bé)
20:30 - Về phòng, bé đi ngủ sớm

NGÀY 2: THAM QUAN GIA ĐÌNH (Ăn sáng, trưa, tối)
07:30 - Ăn sáng buffet (có món cho trẻ em)
08:30 - Khởi hành tham quan (KHÔNG vội, chậm rãi)
      
      09:00 - ĐIỂM 1: Khu du lịch sinh thái
      • Cho bé chạy nhảy, vui chơi
      • Tìm hiểu động vật, thực vật
      • Chụp ảnh gia đình nhiều góc
      
      11:30 - Về khách sạn nghỉ ngơi
      
12:30 - Ăn trưa tại khách sạn
14:00 - Bé ngủ trưa tại phòng (bố mẹ cũng nghỉ)
16:00 - ĐIỂM 2: Bảo tàng/Khu vui chơi giải trí
      • Bé học hỏi kiến thức vui
      • Vui chơi tại khu kids zone
      • Ăn kem, uống nước
      
18:30 - Về khách sạn tắm rửa
19:30 - Ăn tối gia đình ấm cúng
21:00 - Về phòng nghỉ ngơi

NGÀY 3: TỰ DO - MUA SẮM - VỀ (Ăn sáng, trưa)
07:30 - Ăn sáng buffet
09:00 - Tự do dạo chơi gần khách sạn
      • Chụp ảnh lưu niệm
      • Cho bé chơi ở sảnh khách sạn
11:00 - Trả phòng, tập trung
12:00 - Ăn trưa tại nhà hàng trên đường về
13:00 - Khởi hành về (bé ngủ trên xe)
18:00 - Về đến nhà, kết thúc tour

✅ GIÁ TOUR BAO GỒM:
• Xe ô tô 7-16 chỗ đời mới, có ghế trẻ em
• Khách sạn gia đình: 2 đêm, phòng rộng 35-40m²
• Ăn uống: 3 buffet sáng + 5 bữa chính
• Vé tham quan gia đình (2 người lớn + trẻ em)
• Hướng dẫn viên chị nhiệt tình, yêu trẻ
• Bảo hiểm du lịch cả gia đình
• Đồ chơi nhỏ cho bé trên xe
• Nước suối, khăn lạnh, giấy ướt

❌ GIÁ TOUR KHÔNG BAO GỒM:
• Các hoạt động vui chơi phụ (nếu có)
• Chi phí cá nhân: giặt ủi, minibar...
• Tip HDV/tài xế (tùy tâm)

📝 LƯU Ý GIA ĐÌNH:
• Mang theo CMND + giấy khai sinh bé
• Thuốc men cho bé (nếu cần)
• Đồ dùng cá nhân cho bé: bỉm, sữa...
• Yêu cầu ghế trẻ em khi đặt tour
• Lịch trình có thể điều chỉnh nếu bé mệt

🎟️ GIÁ VÉ TRẺ EM:
• Trẻ dưới 5 tuổi: MIỄN PHÍ (ngủ chung bố mẹ)
• Trẻ 5-10 tuổi: GIẢM 50% giá tour
• Trẻ trên 10 tuổi: Tính như người lớn
• Phụ thu giường phụ cho bé: 500.000đ

🎁 QUÀ TẶNG GIA ĐÌNH:
• 03 áo gia đình cùng màu, in tên ${loc.name}
• Album ảnh gia đình cực đẹp (30 ảnh)
• Voucher khu vui chơi trẻ em 300.000đ
• Bánh kẹo, snack cho bé

❓ CHÍNH SÁCH HUỶ:
• Hủy trước 10 ngày: Hoàn 85% tổng tiền
• Hủy trước 5 ngày: Hoàn 60% tổng tiền
• Hủy trong 5 ngày: Không hoàn tiền`,
      price: 3200000,
      duration: "3 ngày 2 đêm",
      transport: "Ô tô 7-16 chỗ",
      images: [loc.image, loc.image],
    });

    // Tour 5: Tour honeymoon
    tours.push({
      name: `${loc.name} Trăng Mật Lãng Mạn 3N2Đ`,
      description: `💑 TOUR TRĂNG MẬT - HONEYMOON CAO CẤP:
• Resort/Khách sạn 4-5 sao view tuyệt đẹp
• Phòng honeymoon sang trọng, decor hoa tươi, nến thơm
• Bữa tối nến lung linh bên bãi biển/sân vườn
• Spa massage thư giãn dành riêng cho 2 người
• Xe riêng VIP, không ghép đoàn
• Phục vụ riêng tư, lãng mạn

📅 LỊCH TRÌNH CHI TIẾT (Riêng Tư):

NGÀY 1: ĐÓN DÂU RỂ - NHẬN PHÒNG (Ăn trưa, tối)
08:00 - Xe hoa VIP đón tại nhà, trang trí lãng mạn
11:00 - Dừng chân nghỉ ngơi tại khu resort đẹp
13:00 - Đến ${loc.name}, ăn trưa tại nhà hàng sang trọng
14:30 - Check-in resort 4-5 sao
      • Phòng honeymoon 50m² view cực đẹp
      • Decor hoa hồng + nến thơm + rượu champagne
      • Chocolate cao cấp + hoa quả tươi
15:00 - Nghỉ ngơi, tận hưởng không gian riêng tư
      • Ngâm bồn jacuzzi với cánh hoa hồng
      • Ngắm cảnh từ ban công/cửa sổ
      • Chụp ảnh couple trong phòng decor đẹp
17:30 - Dạo biển/vườn resort, chụp ảnh hoàng hôn
19:30 - DINNER NẾN LÃNG MẠN:
      • Bàn ăn decor nến + hoa tươi bên biển/sân vườn
      • Set menu Âu-Á cao cấp 5-7 món
      • Nhạc sống du dương, không gian riêng tư
      • Champagne/Wine cao cấp
22:00 - Về phòng nghỉ ngơi, tận hưởng không gian 2 người

NGÀY 2: TRẢI NGHIỆM - LÃNG MẠN (Ăn sáng, trưa, tối)
08:00 - Ăn sáng tại phòng (room service) hoặc nhà hàng
09:30 - CHỤP ẢNH CƯỚI NGOẠI CẢNH (Miễn phí):
      • Nhiếp ảnh gia chuyên nghiệp
      • Chụp tại 3-4 điểm đẹp nhất ${loc.name}
      • Trang phục: áo dài, vest, váy cưới (cho thuê)
      • Makeup chuyên nghiệp cho cô dâu
      • Thời gian: 3-4 tiếng
      
13:00 - Ăn trưa tại nhà hàng view đẹp
14:30 - Về resort nghỉ ngơi
15:30 - SPA MASSAGE COUPLE (90 phút):
      • Phòng đôi riêng tư, nhạc du dương
      • Massage body + foot + đá nóng
      • Chăm sóc da mặt + ngâm chân thảo dược
      • Nước trái cây, trà thảo mộc
      
18:00 - Tự do tắm biển/bơi lội tại hồ bơi vô cực
19:30 - Ăn tối buffet hải sản cao cấp tại resort
21:00 - Dạo biển đêm, ngắm sao, tản bộ lãng mạn

NGÀY 3: TỰ DO - CHECK-OUT - VỀ (Ăn sáng, trưa)
08:30 - Ăn sáng buffet sang trọng
10:00 - Tự do:
      • Bơi lội, chụp ảnh tại resort
      • Massage miễn phí tại spa resort (nếu có)
      • Thư giãn tại phòng
12:00 - Trả phòng, nhận quà lưu niệm
12:30 - Ăn trưa tại nhà hàng view đẹp trên đường về
13:30 - Khởi hành về trong xe VIP riêng
18:30 - Về đến nhà, kết thúc honeymoon ngọt ngào

✅ GIÁ TOUR BAO GỒM:
• Xe riêng VIP 4-7 chỗ, decor hoa cưới, ruy băng
• Resort 4-5 sao: 2 đêm, phòng honeymoon 50m² view đẹp
• Decor phòng: hoa hồng + nến + champagne + chocolate
• Ăn uống: 2 buffet sáng + 4 bữa chính cao cấp
• 01 bữa tối nến lãng mạn set menu đặc biệt
• CHỤP ẢNH CƯỚI: 3-4 tiếng, 3-4 địa điểm, 100 ảnh gốc
  → Makeup + trang phục + nhiếp ảnh gia
• SPA MASSAGE COUPLE: 90 phút thư giãn
• Hướng dẫn viên riêng, phục vụ tận tình
• Bảo hiểm du lịch 100.000.000đ/cặp
• Hoa cưới cầm tay cho cô dâu

❌ GIÁ TOUR KHÔNG BAO GỒM:
• Vé máy bay (nếu có)
• Các hoạt động spa/massage ngoài gói
• Chi phí cá nhân: minibar, giặt ủi...
• Tip HDV/tài xế (tùy tâm)

📝 LƯU Ý QUAN TRỌNG:
• Cần cung cấp: CMND + Giấy đăng ký kết hôn (bản sao)
• Thông tin 2 người: chiều cao, cân nặng (cho trang phục)
• Size áo dài/vest/váy cưới (nếu chụp ảnh)
• Yêu cầu decor đặc biệt (nếu có) trước 3 ngày
• Trang phục riêng của mình (nếu muốn)

🎁 QUÀ TẶNG ĐẶC BIỆT:
• Rượu champagne/wine cao cấp Pháp
• Chocolate + hoa quả tươi cao cấp
• 01 chai đặc sản ${loc.name} (rượu/nước mắm/café...)
• Album ảnh cưới 30x40cm (30 ảnh đẹp nhất)
• File ảnh gốc 100 ảnh chụp ngoại cảnh
• Áo đôi thêu tên + ngày cưới
• Voucher ăn uống 500.000đ cho lần sau

💝 DỊCH VỤ BỔ SUNG (Tùy Chọn):
• Chụp thêm 1 địa điểm: +2.000.000đ
• Flycam quay phim: +1.500.000đ
• Trang trí hoa cánh đồng: +3.000.000đ
• Dinner BBQ hải sản riêng: +4.000.000đ
• Thuê du thuyền ngắm hoàng hôn: +5.000.000đ

❓ CHÍNH SÁCH HUỶ:
• Hủy trước 20 ngày: Hoàn 90% tổng tiền
• Hủy trước 10-19 ngày: Hoàn 70% tổng tiền
• Hủy trước 5-9 ngày: Hoàn 50% tổng tiền
• Hủy trong 5 ngày: Không hoàn tiền

💌 CAM KẾT:
• Phục vụ tận tâm, chu đáo cho cặp đôi
• Không gian riêng tư, lãng mạn
• Hình ảnh đẹp, chất lượng cao
• Kỷ niệm trăng mật khó quên`,
      price: 8900000,
      duration: "3 ngày 2 đêm",
      transport: "Xe riêng VIP",
      images: [loc.image, loc.image, loc.image],
    });

    const location = await prisma.location.create({
      data: {
        name: loc.name,
        description: loc.description,
        region: loc.region as any,
        latitude: loc.latitude,
        longitude: loc.longitude,
        image: loc.image,
        tours: {
          create: tours,
        },
      },
    });
    console.log(`Created location with id: ${location.id}`);
  }

  // 2. Tạo tài khoản admin nếu biến môi trường có sẵn
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const exists = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!exists) {
      const hash = await bcrypt.hash(adminPassword, 10);
      const admin = await prisma.user.create({
        data: {
          name: process.env.ADMIN_NAME || "Admin",
          email: adminEmail,
          phone: process.env.ADMIN_PHONE || undefined,
          passwordHash: hash,
          role: "ADMIN",
        },
      });
      console.log(`Created admin user id=${admin.id} email=${admin.email}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
  } else {
    console.log(
      "Skip admin seed: missing ADMIN_EMAIL or ADMIN_PASSWORD env vars"
    );
  }

  // 3. Tạo sample users và reviews
  const sampleUsers = [
    { name: "Nguyễn Văn A", email: "user1@example.com", phone: "0901234567" },
    { name: "Trần Thị B", email: "user2@example.com", phone: "0912345678" },
    { name: "Lê Văn C", email: "user3@example.com", phone: "0923456789" },
    { name: "Phạm Thị D", email: "user4@example.com", phone: "0934567890" },
  ];

  const createdUsers = [];
  for (const u of sampleUsers) {
    let user = await (prisma as any).user.findUnique({
      where: { email: u.email },
    });
    if (!user) {
      const hash = await bcrypt.hash("password123", 10);
      user = await (prisma as any).user.create({
        data: {
          name: u.name,
          email: u.email,
          phone: u.phone,
          passwordHash: hash,
          role: "USER",
        },
      });
      console.log(`Created user id=${user.id}`);
    }
    createdUsers.push(user);
  }

  // 4. Tạo reviews chi tiết cho tours
  const allTours = await prisma.tour.findMany();
  const reviewComments = [
    {
      rating: 5,
      comment:
        "Tour tuyệt vời! Hướng dẫn viên anh Nam rất nhiệt tình và chuyên nghiệp. Lịch trình hợp lý, không bị gò bó. Khách sạn sạch đẹp, ăn uống ngon. Sẽ quay lại lần sau!",
    },
    {
      rating: 5,
      comment:
        "Đi cùng gia đình 4 người, mọi người đều rất hài lòng. Xe đưa đón đúng giờ, tài xế lái xe ổn. Các điểm tham quan đều đẹp và có thời gian chụp ảnh thoải mái. Đặc biệt ẩm thực rất tuyệt!",
    },
    {
      rating: 4,
      comment:
        "Tour ổn, giá cả hợp lý. Có vài điểm nhỏ cần cải thiện như thời gian ăn trưa hơi ngắn, nhưng nhìn chung vẫn đáng tiền. Cảnh đẹp quá, chụp ảnh rất nhiều!",
    },
    {
      rating: 5,
      comment:
        "Lần đầu đi tour mà được trải nghiệm tuyệt vời như vậy. HDV chị Lan dễ thương, nhiệt tình giới thiệu từng địa điểm. Nhóm bạn mình đều khen ngợi. Cảm ơn công ty!",
    },
    {
      rating: 4,
      comment:
        "Tour khá ok, phù hợp với ngân sách sinh viên. Khách sạn tuy không sang lắm nhưng sạch sẽ, đầy đủ tiện nghi. Các bạn trẻ nên thử, vui lắm!",
    },
    {
      rating: 5,
      comment:
        "Đi honeymoon với vợ, tour rất lãng mạn. Phòng được trang trí đẹp, bữa tối nến rất ấn tượng. Cảm ơn team đã tạo nên kỷ niệm đẹp cho vợ chồng mình!",
    },
    {
      rating: 5,
      comment:
        "Cảnh đẹp xuất sắc, thời tiết thuận lợi. Đồ ăn ngon, đặc biệt món đặc sản địa phương rất tuyệt. Hướng dẫn viên am hiểu, giải đáp mọi thắc mắc. 10 điểm!",
    },
    {
      rating: 4,
      comment:
        "Tour tốt, lịch trình đa dạng. Chỉ có điều di chuyển hơi mệt một chút. Nhưng nhìn chung rất đáng để trải nghiệm, sẽ giới thiệu cho bạn bè!",
    },
  ];

  let reviewIndex = 0;
  for (const tour of allTours) {
    // Mỗi tour có 2-3 reviews
    const numReviews = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numReviews; i++) {
      const user = createdUsers[reviewIndex % createdUsers.length];
      const review = reviewComments[reviewIndex % reviewComments.length];

      const existingReview = await (prisma as any).review.findFirst({
        where: { tourId: tour.id, userId: user.id },
      });

      if (!existingReview) {
        await (prisma as any).review.create({
          data: {
            rating: review.rating,
            comment: review.comment,
            images: [],
            userId: user.id,
            tourId: tour.id,
          },
        });
      }
      reviewIndex++;
    }
  }
  console.log(`Created reviews for tours`);

  // 5. Tạo sample vouchers
  const sampleVouchers = [
    {
      code: "SUMMER2024",
      discountType: "PERCENT" as const,
      value: 15,
      maxDiscount: 500000,
      expiresAt: new Date("2024-12-31"),
      usageLimit: 100,
      isActive: true,
    },
    {
      code: "WELCOME50K",
      discountType: "FIXED" as const,
      value: 50000,
      maxDiscount: null,
      expiresAt: null,
      usageLimit: null,
      isActive: true,
    },
  ];

  for (const voucherData of sampleVouchers) {
    const exists = await (prisma as any).voucher.findUnique({
      where: { code: voucherData.code },
    });
    if (!exists) {
      await (prisma as any).voucher.create({ data: voucherData });
      console.log(`Created voucher: ${voucherData.code}`);
    }
  }

  // 6. Tạo lịch khởi hành (Schedules)
  const toursForSchedules = await prisma.tour.findMany();
  console.log(`Generating schedules for ${toursForSchedules.length} tours...`);

  for (const tour of toursForSchedules) {
    // Kiểm tra xem tour đã có schedule chưa để tránh duplicate nếu chạy seed nhiều lần
    // Nhưng vì ta dùng force-reset nên không lo
    const schedules = [];
    // Tạo 10 lịch khởi hành
    for (let i = 0; i < 10; i++) {
      const daysToAdd = i * 7 + Math.floor(Math.random() * 3); // Cách nhau ~1 tuần
      const departureDate = new Date(); // Hôm nay
      departureDate.setDate(departureDate.getDate() + 5 + daysToAdd); // Bắt đầu từ 5 ngày tới

      // Parse duration: "4 ngày 3 đêm" -> 4
      const durationMatch = tour.duration.match(/(\d+)\s*ngày/);
      const days = durationMatch ? parseInt(durationMatch[1]) : 1;

      const returnDate = new Date(departureDate);
      returnDate.setDate(returnDate.getDate() + days);

      schedules.push({
        tourId: tour.id,
        departureDate: departureDate,
        returnDate: returnDate,
        price: tour.price,
        availableSeats: 15 + Math.floor(Math.random() * 15), // 15-30 chỗ
      });
    }

    for (const schedule of schedules) {
      await (prisma as any).tourSchedule.create({ data: schedule });
    }
  }
  console.log("Created schedules for all tours");

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
