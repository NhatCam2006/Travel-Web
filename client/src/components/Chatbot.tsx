import React, { useState, useEffect, useRef } from 'react';
// Đã chuyển sang dùng Tailwind, không cần Chatbot.css

interface Message {
    sender: 'user' | 'bot';
    text: string;
    time: number;
}

const LOCAL_KEY = 'chatbot_gemini_history';
const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load history from localStorage
    useEffect(() => {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) {
            try {
                setMessages(JSON.parse(raw));
            } catch { }
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(messages));
        // Scroll to bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const now = Date.now();
        const userMsg: Message = { sender: 'user', text: input, time: now };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);
        setInput('');
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            setMessages((prev) => [...prev, { sender: 'bot', text: 'API key chưa được cấu hình. Vui lòng kiểm tra file .env.', time: Date.now() }]);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMsg.text }] }]
                })
            });
            if (!res.ok) {
                throw new Error('Lỗi API: ' + res.status);
            }
            const data = await res.json();
            const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Bot không trả lời được.';
            setMessages((prev) => [...prev, { sender: 'bot', text: botText, time: Date.now() }]);
        } catch (err: any) {
            setMessages((prev) => [...prev, { sender: 'bot', text: 'Có lỗi xảy ra: ' + (err?.message || 'Không xác định'), time: Date.now() }]);
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-sm z-[1100] shadow-2xl rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col animate-fadein">
            <div className="flex items-center gap-3 px-5 py-4 rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow">
                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="Gemini" className="w-8 h-8 rounded-full border border-white" />
                Chatbot Gemini
            </div>
            <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto max-h-80 bg-transparent scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                {messages.length === 0 && (
                    <div className="flex justify-center items-center h-32 text-gray-400 text-base">Hãy bắt đầu trò chuyện với Gemini!</div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                        <div className="flex items-end gap-2 max-w-[80%]">
                            {msg.sender === 'bot' && (
                                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                            )}
                            <div className={
                                msg.sender === 'user'
                                    ? 'bg-blue-100 text-blue-900 rounded-xl rounded-br-md px-4 py-2 shadow-md'
                                    : 'bg-white text-gray-800 rounded-xl rounded-bl-md px-4 py-2 shadow-md border border-blue-100'
                            }>
                                <div className="whitespace-pre-line">{msg.text}</div>
                                <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            {msg.sender === 'user' && (
                                <img src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" alt="User" className="w-7 h-7 rounded-full border border-blue-200" />
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-400 rounded-xl rounded-bl-md px-4 py-2 shadow-md border border-blue-100 animate-pulse flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            Đang trả lời...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-blue-100 bg-blue-50 rounded-b-2xl">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg border border-blue-300 focus:border-blue-500 outline-none bg-white text-gray-900 text-base shadow-sm"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
