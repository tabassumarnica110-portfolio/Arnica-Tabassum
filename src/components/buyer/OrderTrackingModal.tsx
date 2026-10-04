import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  Navigation,
  QrCode
} from "lucide-react";

export const OrderTrackingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { orders, selectedOrderId, lang } = useApp();
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const steps = [
    { key: "NEW", title: "অর্ডার গৃহীত", desc: "জামালপুর হাব থেকে অর্ডার গ্রহণ করা হয়েছে", time: "সকাল ০৮:১৫" },
    { key: "ACCEPTED", title: "কৃষক প্রস্তুত করছেন", desc: "আলহাজ্ব মোকবুল হোসেন মাল সর্টিং করছেন", time: "সকাল ০৮:৩০" },
    { key: "PACKED", title: "প্যাকিং ও গ্রেডিং সম্পন্ন", desc: "তাপমাত্রা নিয়ন্ত্রিত ট্রে ও ক্রাফট ব্যাগে প্যাকড", time: "সকাল ০৯:৪৫" },
    { key: "SHIPPED", title: "কোল্ড ট্রাকে রওনা", desc: "ঢাকা সেন্ট্রাল রুট (GPS: বেলটিয়া বাইপাস)", time: "সকাল ১০:২০" },
    { key: "DELIVERED", title: "ক্রেতার হাতে হস্তান্তর", desc: "সফলভাবে হোম ডেলিভারি সম্পন্ন", time: "আসন্ন" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">লাইভ কোল্ড-ফ্রেইট ট্র্যাকিং</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-emerald-200">
                অর্ডার: {order.orderNumber} • গন্তব্য: {order.deliveryAddress}
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

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Pathao Style Driver Card */}
          <div className="p-5 rounded-2xl bg-linear-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                🚚
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">
                  কৃষিলিংক অনুমোদিত চালক
                </span>
                <h4 className="font-bold text-base">{order.deliveryAgent?.name || "কবীর হোসেন"}</h4>
                <p className="text-xs text-stone-400 font-mono">
                  গাড়ি নং: {order.deliveryAgent?.vehicleNumber || "ঢাকা মেট্রো-ট ১১-৯৮২১ (কোল্ড ভ্যান)"}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.deliveryAgent?.phone || "01799887766"}`}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">কল করুন</span>
            </a>
          </div>

          {/* Real-time OTP Shield */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-950 font-mono">
            <span>ডেলিভারি গ্রহণের গোপন ওয়ান-টাইম পিন (OTP):</span>
            <span className="text-lg font-black tracking-widest bg-amber-200 px-3 py-1 rounded-lg text-amber-900">
              8 9 4 2
            </span>
          </div>

          {/* Timeline UI */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {steps.map((st, i) => {
              const isDone = i <= currentIdx;
              const isCurrent = i === currentIdx;

              return (
                <div key={st.key} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                      isDone
                        ? "bg-[#14532D] text-white"
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-sm font-bold ${isCurrent ? "text-[#14532D]" : "text-stone-800"}`}>
                        {st.title}
                      </h5>
                      <span className="text-xs text-stone-400 font-mono">{st.time}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Temperature & Cold Sensor Health */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600 font-mono">
            <span>কোল্ড চেম্বার তাপমাত্রা: <strong>৪.২° সেলসিয়াস</strong></span>
            <span className="text-emerald-700 font-bold">IoT Sensor OK</span>
          </div>

        </div>

      </div>
    </div>
  );
};
