import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ChatMessage } from "../../types";
import { X, Send, CheckCircle, RotateCcw, User, Tag, Sparkles } from "lucide-react";
import { sanitizeInput, detectMaliciousPayload } from "../../../lib/validation";

export const BargainingChatModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lang, currentUser, addAuditLog } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "BUYER",
      senderName: "Shafiqul Islam (Dhaka Supermart)",
      text: "আসসালামু আলাইকুম মোকবুল ভাই। আপনার ডায়মন্ড আলুর কোয়ালিটি দেখলাম খুব ভালো। কিন্তু ২৯ টাকা একটু বেশি।",
      timestamp: "১০:১০ AM",
    },
    {
      id: "msg-2",
      sender: "BUYER",
      senderName: "Shafiqul Islam (Dhaka Supermart)",
      text: "ভাই ১০০ কেজি নিবো, ২৮ টাকা দিলে এখনই ক্যাশ অর্ডার কনফার্ম করবো?",
      timestamp: "১০:১২ AM",
      isOffer: true,
      offerPrice: 28,
      offerQty: 100,
      offerStatus: "PENDING",
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [counterPrice, setCounterPrice] = useState<number>(28.5);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Defensive sanitization & threat detection (anti-XSS / anti-injection)
    const cleanText = sanitizeInput(inputText, 400);
    const threat = detectMaliciousPayload(cleanText);
    if (threat.isMalicious) {
      addAuditLog("MALICIOUS_CHAT_INTERCEPTED", "/chat/negotiation", "BLOCKED", threat.description || "Suspicious script in chat payload");
      setInputText("");
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser.role === "FARMER" ? "FARMER" : "BUYER",
      senderName: currentUser.name,
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg].slice(-60));
    setInputText("");
    addAuditLog("BARGAIN_CHAT", "/chat/negotiation", "ALLOWED", `Chat message sent: "${newMsg.text.slice(0, 30)}..."`);
  };

  const handleAcceptOffer = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, offerStatus: "ACCEPTED" } : m
      )
    );
    const acceptMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "FARMER",
      senderName: currentUser.name,
      text: "আলহামদুলিল্লাহ! আপনার অফার ২৮ টাকা গ্রহণ করলাম। ১০০ কেজি মাল প্যাকিংয়ে পাঠিয়ে দিচ্ছি।",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, acceptMsg]);
    addAuditLog("PRICE_OFFER_ACCEPTED", "/chat/bargaining", "ALLOWED", "Farmer accepted Buyer offer of ৳28/kg for 100kg.");
  };

  const handleCounterOffer = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, offerStatus: "COUNTERED" } : m))
    );
    const counterMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "FARMER",
      senderName: currentUser.name,
      text: `ভাই ২৮ টাকা দিলে লস হয়ে যায়। একদাম সাড়ে ২৮ টাকা (৳${counterPrice}) হলে নিতে পারেন। মাল সেরা।`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOffer: true,
      offerPrice: counterPrice,
      offerQty: 100,
      offerStatus: "PENDING",
    };
    setMessages((prev) => [...prev, counterMsg]);
    addAuditLog("COUNTER_OFFER_SENT", "/chat/bargaining", "ALLOWED", `Farmer countered with ৳${counterPrice}/kg.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[620px] shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">দরদাম ও লাইভ চ্যাট ইনবক্স</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-emerald-200">
                ক্রেতা: শফিকুল ইসলাম (বনানী, ঢাকা) | ডায়মন্ড আলু ১০০ কেজি
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages scroll area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAF7]">
          {messages.map((m) => {
            const isMe = (currentUser.role === "FARMER" && m.sender === "FARMER") || (currentUser.role === "BUYER" && m.sender === "BUYER");
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-stone-400 font-mono px-1 mb-1">
                  {m.senderName} • {m.timestamp}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                    isMe
                      ? "bg-[#14532D] text-white rounded-br-xs"
                      : "bg-white text-stone-800 border border-stone-200 shadow-xs rounded-bl-xs"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Special Offer Card in Chat */}
                  {m.isOffer && (
                    <div className="mt-3 pt-3 border-t border-stone-200/40 bg-stone-50/80 p-2.5 rounded-xl text-stone-900 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#14532D]">প্রস্তাবিত মূল্য: ৳{m.offerPrice}/কেজি</span>
                        <span className="font-mono text-stone-500">পরিমাণ: {m.offerQty} কেজি</span>
                      </div>

                      {m.offerStatus === "PENDING" && currentUser.role === "FARMER" && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAcceptOffer(m.id)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>গ্রহণ করুন (২৮৳)</span>
                          </button>
                          <button
                            onClick={() => handleCounterOffer(m.id)}
                            className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>কাউন্টার (২৮.৫৳)</span>
                          </button>
                        </div>
                      )}

                      {m.offerStatus === "ACCEPTED" && (
                        <div className="text-center py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                          ✅ অফার সফলভাবে গৃহীত হয়েছে!
                        </div>
                      )}

                      {m.offerStatus === "COUNTERED" && (
                        <div className="text-center py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                          🔄 পাল্টা দর দেওয়া হয়েছে
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={lang === "bn" ? "মেসেজ লিখুন..." : "Type bargaining message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#14532D] outline-hidden"
          />
          <button
            onClick={handleSendMessage}
            className="p-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
