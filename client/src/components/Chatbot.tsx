import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSend,
    FiMapPin,
    FiCalendar,
    FiDollarSign,
    FiSearch,
    FiTrash2,
    FiChevronDown,
    FiClock,
    FiCompass,
    FiMessageSquare,
} from 'react-icons/fi';

// Types
interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    time: number;
    type?: 'text' | 'tours' | 'locations' | 'suggestions';
    data?: any;
}

interface Tour {
    id: number;
    name: string;
    price: number;
    duration: string;
    images?: string[];
    locationId?: number;
}

interface Location {
    id: number;
    name: string;
    description?: string;
    region: string;
    image: string;
    tours?: Tour[];
}

// Quick action suggestions
const QUICK_ACTIONS = [
    { icon: FiSearch, text: 'Tìm tour Đà Lạt', action: 'Tìm tour du lịch Đà Lạt' },
    { icon: FiMapPin, text: 'Điểm đến hot', action: 'Các điểm đến du lịch nổi tiếng nhất Việt Nam' },
    { icon: FiDollarSign, text: 'Tour giá rẻ', action: 'Tour du lịch giá rẻ dưới 3 triệu' },
    { icon: FiCalendar, text: 'Tour cuối tuần', action: 'Tour du lịch 2 ngày 1 đêm' },
];

const LOCAL_KEY = 'travel_agent_history';
const API_BASE = 'http://localhost:5000';

interface ChatbotProps {
    onClose?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load data
    useEffect(() => {
        // Fetch tours and locations for context
        Promise.all([
            fetch(`${API_BASE}/api/tours`).then(r => r.json()).catch(() => []),
            fetch(`${API_BASE}/api/locations`).then(r => r.json()).catch(() => [])
        ]).then(([toursData, locationsData]) => {
            setTours(toursData);
            setLocations(locationsData);
        });

        // Load history
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed.length === 0) {
                    addWelcomeMessage();
                } else {
                    setMessages(parsed);
                }
            } catch {
                addWelcomeMessage();
            }
        } else {
            addWelcomeMessage();
        }
    }, []);

    const addWelcomeMessage = () => {
        const welcomeMsg: Message = {
            id: 'welcome',
            sender: 'bot',
            text: `Xin chào! 👋 Tôi là **VietTravel AI Agent** - trợ lý du lịch thông minh của bạn.

Tôi có thể giúp bạn:
🔍 Tìm kiếm tour phù hợp
📍 Gợi ý điểm đến hấp dẫn
💰 So sánh giá tour
📅 Tư vấn lịch trình
❓ Giải đáp thắc mắc về du lịch

Hãy hỏi tôi bất cứ điều gì!`,
            time: Date.now(),
            type: 'suggestions',
        };
        setMessages([welcomeMsg]);
    };

    // Save history
    useEffect(() => {
        if (messages.length > 0 && messages[0].id !== 'welcome') {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(messages.slice(-50)));
        } else if (messages.length > 1) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(messages.slice(-50)));
        }
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Agent logic - process user intent
    const processUserIntent = (userText: string): { type: string; data?: any; response?: string } => {
        const lowerText = userText.toLowerCase();

        // Search for tours by location
        const locationKeywords = locations.map(l => l.name.toLowerCase());
        const foundLocation = locationKeywords.find(loc => lowerText.includes(loc));

        if (foundLocation || lowerText.includes('tour') || lowerText.includes('tìm') || lowerText.includes('search')) {
            const matchedLocation = locations.find(l => lowerText.includes(l.name.toLowerCase()));

            if (matchedLocation) {
                const locationTours = tours.filter(t => t.locationId === matchedLocation.id);
                if (locationTours.length > 0) {
                    return {
                        type: 'tours',
                        data: { tours: locationTours, location: matchedLocation.name }
                    };
                }
            }

            // Price filter
            const priceMatch = lowerText.match(/(\d+)\s*(triệu|tr|million)/);
            if (priceMatch) {
                const maxPrice = parseInt(priceMatch[1]) * 1000000;
                const filteredTours = tours.filter(t => t.price <= maxPrice);
                if (filteredTours.length > 0) {
                    return {
                        type: 'tours',
                        data: { tours: filteredTours.slice(0, 5), filter: `dưới ${priceMatch[1]} triệu` }
                    };
                }
            }

            // Duration filter
            if (lowerText.includes('2 ngày') || lowerText.includes('cuối tuần') || lowerText.includes('weekend')) {
                const shortTours = tours.filter(t =>
                    t.duration.includes('2 ngày') || t.duration.includes('2N')
                );
                if (shortTours.length > 0) {
                    return {
                        type: 'tours',
                        data: { tours: shortTours.slice(0, 5), filter: '2 ngày 1 đêm' }
                    };
                }
            }

            // Return all tours if no specific filter
            if (tours.length > 0) {
                return {
                    type: 'tours',
                    data: { tours: tours.slice(0, 6), filter: 'phổ biến' }
                };
            }
        }

        // Locations/destinations query
        if (lowerText.includes('điểm đến') || lowerText.includes('địa điểm') ||
            lowerText.includes('nổi tiếng') || lowerText.includes('destination')) {
            return {
                type: 'locations',
                data: { locations: locations.slice(0, 6) }
            };
        }

        // Booking help
        if (lowerText.includes('đặt tour') || lowerText.includes('booking') || lowerText.includes('đặt chỗ')) {
            return {
                type: 'text',
                response: `📝 **Hướng dẫn đặt tour:**

1️⃣ Chọn tour bạn yêu thích từ danh sách
2️⃣ Xem chi tiết và chọn lịch khởi hành
3️⃣ Điền thông tin và số lượng khách
4️⃣ Áp dụng mã giảm giá (nếu có)
5️⃣ Thanh toán qua QR code
6️⃣ Nhận email xác nhận!

💡 Bạn cần đăng nhập để đặt tour.`
            };
        }

        // Voucher/discount
        if (lowerText.includes('voucher') || lowerText.includes('giảm giá') || lowerText.includes('khuyến mãi') || lowerText.includes('mã')) {
            return {
                type: 'text',
                response: `🎟️ **Thông tin voucher:**

Bạn có thể sử dụng mã giảm giá khi đặt tour:
• Nhập mã vào ô "Mã giảm giá" ở trang đặt tour
• Nhấn "Áp dụng" để kiểm tra
• Mức giảm sẽ được tính vào tổng tiền

📢 Theo dõi fanpage để nhận voucher hot!`
            };
        }

        // Contact/support
        if (lowerText.includes('liên hệ') || lowerText.includes('hotline') || lowerText.includes('hỗ trợ')) {
            return {
                type: 'text',
                response: `📞 **Thông tin liên hệ:**

🌐 Website: viettravel.vn
📧 Email: support@viettravel.vn
☎️ Hotline: 1900 xxxx (8h-22h)
📍 Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM

💬 Hoặc chat với tôi bất cứ lúc nào!`
            };
        }

        // Default - use Gemini for general questions
        return { type: 'gemini' };
    };

    const callGeminiAPI = async (userText: string, context: string): Promise<string> => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            return 'API key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env';
        }

        const systemPrompt = `Bạn là VietTravel AI Agent - trợ lý du lịch thông minh cho website đặt tour du lịch Việt Nam.

Thông tin về các tour và địa điểm hiện có:
${context}

Quy tắc:
1. Trả lời ngắn gọn, thân thiện, sử dụng emoji phù hợp
2. Tập trung vào du lịch Việt Nam
3. Gợi ý tour/địa điểm cụ thể nếu có thể
4. Sử dụng tiếng Việt tự nhiên
5. Nếu được hỏi về giá, hãy đề cập đến các tour trong danh sách
6. Format text đẹp với markdown (bold, list...)`;

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: systemPrompt }] },
                            { role: 'model', parts: [{ text: 'Tôi hiểu. Tôi là VietTravel AI Agent, sẵn sàng hỗ trợ du khách!' }] },
                            { role: 'user', parts: [{ text: userText }] }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500,
                        }
                    })
                }
            );

            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            const data = await res.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi không thể trả lời ngay bây giờ.';
        } catch (err: any) {
            console.error('Gemini API error:', err);
            return `Xin lỗi, đã có lỗi xảy ra. Bạn có thể thử lại hoặc liên hệ hotline 1900 xxxx để được hỗ trợ.`;
        }
    };

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        const userMsg: Message = {
            id: generateId(),
            sender: 'user',
            text: messageText,
            time: Date.now(),
            type: 'text'
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const intent = processUserIntent(messageText);
            let botMsg: Message;

            if (intent.type === 'tours' && intent.data?.tours) {
                botMsg = {
                    id: generateId(),
                    sender: 'bot',
                    text: intent.data.location
                        ? `🎯 Tìm thấy **${intent.data.tours.length} tour** tại **${intent.data.location}**:`
                        : `🎯 Đây là **${intent.data.tours.length} tour ${intent.data.filter || ''}** phù hợp:`,
                    time: Date.now(),
                    type: 'tours',
                    data: intent.data.tours
                };
            } else if (intent.type === 'locations' && intent.data?.locations) {
                botMsg = {
                    id: generateId(),
                    sender: 'bot',
                    text: `📍 Các **điểm đến nổi bật** tại Việt Nam:`,
                    time: Date.now(),
                    type: 'locations',
                    data: intent.data.locations
                };
            } else if (intent.type === 'text' && intent.response) {
                botMsg = {
                    id: generateId(),
                    sender: 'bot',
                    text: intent.response,
                    time: Date.now(),
                    type: 'text'
                };
            } else {
                // Use Gemini for complex queries
                const context = `
Tours: ${tours.slice(0, 10).map(t => `${t.name} (${t.price.toLocaleString()}đ, ${t.duration})`).join(', ')}
Locations: ${locations.map(l => l.name).join(', ')}`;

                const geminiResponse = await callGeminiAPI(messageText, context);
                botMsg = {
                    id: generateId(),
                    sender: 'bot',
                    text: geminiResponse,
                    time: Date.now(),
                    type: 'text'
                };
            }

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: generateId(),
                sender: 'bot',
                text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại!',
                time: Date.now(),
                type: 'text'
            }]);
        }

        setLoading(false);
        inputRef.current?.focus();
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem(LOCAL_KEY);
        addWelcomeMessage();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Render markdown-like text
    const renderText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-600 underline hover:text-emerald-700">$1</a>')
            .split('\n')
            .map((line, i) => <p key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-140px)] z-[1100] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-4 flex items-center gap-3 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <FiCompass className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
                </div>
                <div className="flex-1 relative">
                    <h3 className="text-white font-bold text-base">VietTravel AI</h3>
                    <p className="text-white/80 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Trợ lý du lịch thông minh
                    </p>
                </div>
                <button
                    onClick={clearHistory}
                    className="relative p-2 hover:bg-white/20 rounded-xl transition-colors group"
                    title="Xóa lịch sử"
                >
                    <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                </button>
                <button
                    onClick={onClose}
                    className="relative p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Đóng"
                >
                    <FiChevronDown className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                                {/* Avatar for bot */}
                                {msg.sender === 'bot' && (
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                            <FiMessageSquare className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">VietTravel AI</span>
                                    </div>
                                )}

                                {/* Message bubble */}
                                <div
                                    className={`px-4 py-3 ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-emerald-500/20'
                                            : 'bg-white text-gray-800 rounded-2xl rounded-tl-md shadow-md border border-gray-100'
                                        }`}
                                >
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {renderText(msg.text)}
                                    </div>
                                </div>

                                {/* Tour cards */}
                                {msg.type === 'tours' && msg.data && (
                                    <div className="mt-3 space-y-2">
                                        {msg.data.slice(0, 4).map((tour: Tour) => (
                                            <Link
                                                key={tour.id}
                                                to={`/tours/${tour.id}`}
                                                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group"
                                            >
                                                <img
                                                    src={tour.images?.[0] || `https://picsum.photos/seed/tour${tour.id}/100/100`}
                                                    alt={tour.name}
                                                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-emerald-600 transition-colors">
                                                        {tour.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                                            <FiClock className="w-3 h-3" />
                                                            {tour.duration}
                                                        </span>
                                                        <span className="text-emerald-600 font-bold text-sm">
                                                            {formatPrice(tour.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {msg.data.length > 4 && (
                                            <Link
                                                to="/popular"
                                                className="flex items-center justify-center gap-1 py-2.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                            >
                                                Xem thêm {msg.data.length - 4} tour
                                                <span>→</span>
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {/* Location cards */}
                                {msg.type === 'locations' && msg.data && (
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {msg.data.slice(0, 4).map((loc: Location) => (
                                            <Link
                                                key={loc.id}
                                                to="/destinations"
                                                className="relative overflow-hidden rounded-2xl group shadow-md"
                                            >
                                                <img
                                                    src={loc.image || `https://picsum.photos/seed/loc${loc.id}/200/120`}
                                                    alt={loc.name}
                                                    className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute bottom-2 left-2 right-2">
                                                    <h4 className="text-white font-semibold text-sm truncate">{loc.name}</h4>
                                                    <span className="text-white/80 text-[11px] flex items-center gap-1">
                                                        <FiMapPin className="w-2.5 h-2.5" />
                                                        {loc.tours?.length || 0} tours
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Timestamp */}
                                <p className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                                    {new Date(msg.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loading indicator */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-sm text-gray-500">Đang suy nghĩ...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50/30">
                    <p className="text-xs text-gray-500 mb-2 font-medium">✨ Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_ACTIONS.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(action.action)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 shadow-sm hover:shadow"
                            >
                                <action.icon className="w-3.5 h-3.5" />
                                {action.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
                            placeholder="Hỏi về tour, địa điểm, giá cả..."
                            disabled={loading}
                            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 pr-12"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <FiSend className="w-5 h-5" />
                    </motion.button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                    Powered by Gemini AI • VietTravel
                </p>
            </div>
        </motion.div>
    );
};

export default Chatbot;
