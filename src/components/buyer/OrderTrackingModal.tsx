import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  Truck, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Unlock,
  AlertTriangle,
  Star,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";

export const OrderTrackingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { orders, selectedOrderId, releaseEscrowForOrder } = useApp();
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const [isReleasing, setIsReleasing] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [releaseSuccess, setReleaseSuccess] = useState<{ trxId: string; message: string } | null>(
    order.escrowStatus === "RELEASED" ? { trxId: order.escrowTrxId || "TRX-BKASH-894129481", message: "ফসল ডেলিভারি সফল এবং টাকা কৃষকের ওয়ালেটে স্থানান্তরিত হয়েছে!" } : null
  );
  const [isDisputing, setIsDisputing] = useState<boolean>(false);
  const [disputeNotice, setDisputeNotice] = useState<string | null>(order.escrowStatus === "DISPUTED" ? "তহবিল সাময়িকভাবে স্থগিত রয়েছে।" : null);

  const steps = [
    { key: "NEW", title: "অর্ডার গৃহীত", desc: "জামালপুর হাব থেকে অর্ডার গ্রহণ করা হয়েছে", time: "সকাল ০৮:১৫" },
    { key: "ACCEPTED", title: "কৃষক প্রস্তুত করছেন", desc: `${order.items[0]?.farmerName || "আলহাজ্ব মোকবুল হোসেন"} মাল সর্টিং করছেন`, time: "সকাল ০৮:৩০" },
    { key: "PACKED", title: "প্যাকিং ও গ্রেডিং সম্পন্ন", desc: "তাপমাত্রা নিয়ন্ত্রিত ট্রে ও ক্রাফট ব্যাগে প্যাকড", time: "সকাল ০৯:৪৫" },
    { key: "SHIPPED", title: "কোল্ড ট্রাকে রওনা", desc: "ঢাকা সেন্ট্রাল রুট (GPS: বেলটিয়া বাইপাস)", time: "সকাল ১০:২০" },
    { key: "DELIVERED", title: "ক্রেতার হাতে হস্তান্তর", desc: "সফলভাবে হোম ডেলিভারি সম্পন্ন ও এসক্রো রিলিজ", time: order.escrowReleasedAt ? "সম্পন্ন" : "চলমান" },
  ];

  const currentIdx = order.status === "DELIVERED" ? 4 : steps.findIndex((s) => s.key === order.status);

  // Handle Buyer Confirm Delivery & Release Escrow
  const handleConfirmAndRelease = async () => {
    setIsReleasing(true);
    try {
      const res = await releaseEscrowForOrder(order.id, rating);
      setIsReleasing(false);
      if (res.success) {
        setReleaseSuccess({
          trxId: res.trxId || `TRX-BKASH-${Date.now()}`,
          message: res.message
        });
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    } catch {
      setIsReleasing(false);
    }
  };

  // Handle Dispute
  const handleRaiseDispute = async () => {
    const reason = prompt("অনুগ্রহ করে ফসলের গুণগত ত্রুটি বা সমস্যার বিবরণ লিখুন (যেমন: ওজনে কম, পরিবহন ক্ষতি):");
    if (!reason) return;
    setIsDisputing(true);
    try {
      const res = await fetch("/api/escrow/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          escrowId: order.escrowId || "ESCROW-VAULT-94821",
          reason
        })
      });
      const data = await res.json();
      setDisputeNotice(data.message || "তহবিল স্থগিত রাখা হয়েছে।");
    } catch {
      setDisputeNotice("অভিযোগ গৃহীত হয়েছে ও ফান্ড সাময়িকভাবে স্থগিত করা হয়েছে।");
    } finally {
      setIsDisputing(false);
    }
  };

  const isAlreadyReleased = order.status === "DELIVERED" || order.escrowStatus === "RELEASED" || !!releaseSuccess;

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
                <h3 className="font-extrabold text-lg">লাইভ কোল্ড-ফ্রেইট ও এসক্রো ট্র্যাকিং</h3>
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

          {/* REAL-TIME ESCROW VAULT PROTECTION ENGINE BANNER */}
          <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
            isAlreadyReleased
              ? "bg-emerald-50 border-emerald-500 text-emerald-950"
              : disputeNotice
              ? "bg-rose-50 border-rose-400 text-rose-950"
              : "bg-amber-50/80 border-amber-400 text-stone-900"
          }`}>
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${isAlreadyReleased ? "text-emerald-700" : disputeNotice ? "text-rose-600" : "text-amber-700"}`} />
                <h4 className="font-black text-sm uppercase tracking-wide">
                  {isAlreadyReleased ? "কৃষিলিঙ্ক এসক্রো ভল্ট: পে-আউট সফলভাবে সম্পন্ন ✓" : "নিরাপদ এসক্রো পেমেন্ট ইঞ্জিন (Escrow Wallet Engine)"}
                </h4>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase ${
                isAlreadyReleased
                  ? "bg-emerald-200 text-emerald-900"
                  : disputeNotice
                  ? "bg-rose-200 text-rose-900"
                  : "bg-amber-200 text-amber-950"
              }`}>
                {isAlreadyReleased ? "FUNDS RELEASED" : disputeNotice ? "FUNDS FROZEN" : "LOCKED IN VAULT"}
              </span>
            </div>

            {/* Escrow Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono bg-white/80 p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-500 block">এসক্রো ভল্ট টোকেন:</span>
                <span className="font-bold text-[#14532D] truncate block">{order.escrowId || "ESCROW-VAULT-94821"}</span>
              </div>
              <div>
                <span className="text-stone-500 block">লকড পেমেন্ট গেটওয়ে:</span>
                <span className="font-bold text-stone-800">
                  {order.escrowGateway === "SSLCOMMERZ" ? "SSLCommerz Enterprise" : order.escrowGateway === "STRIPE" ? "Stripe 3D Hold" : "bKash Merchant API"}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">ভল্টে সুরক্ষিত অর্থ:</span>
                <span className="font-black text-[#14532D] text-xs">৳ {order.grandTotal.toLocaleString("bn-BD")}</span>
              </div>
            </div>

            {/* Status Explanations & Action */}
            {isAlreadyReleased ? (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-emerald-900 font-medium">
                  {releaseSuccess?.message || "বায়ার ফসল বুঝে পেয়ে রিসিভ কনফার্ম করেছেন। টাকা তাৎক্ষণিকভাবে কৃষকের বিকাশ/কৃষিপে ওয়ালেটে ট্রান্সফার হয়েছে!"}
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ইন্সট্যান্ট সেটেলমেন্ট TrxID:</span>
                  </div>
                  <span className="font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded">
                    {releaseSuccess?.trxId || order.escrowTrxId || "TRX-BKASH-894129481"}
                  </span>
                </div>
              </div>
            ) : disputeNotice ? (
              <div className="space-y-2 pt-1 text-xs text-rose-900">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{disputeNotice}</span>
                </p>
                <p className="text-[11px] text-rose-800">
                  কৃষিলিঙ্কের কোয়ালিটি অডিটর কোল্ড ভ্যানের তাপমাত্রা ও ডিজিটাল ওজন স্লিপ যাচাই করে ২৪ ঘণ্টার ভেতর সমাধান করবেন।
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-stone-700 leading-relaxed">
                  টাকা সরাসরি কৃষকের কাছে যায়নি, <strong>কৃষিলিঙ্কের নিরাপদ এসক্রো ভল্টে লক করা আছে</strong>। ফসল হাতে পেয়ে ফ্রেশ কিনা নিশ্চিত করে নিচের বাটনে ক্লিক করুন। আপনি কনফার্ম করা মাত্রই টাকা কৃষকের ওয়ালেটে ট্রান্সফার হবে।
                </p>

                {/* Rating Input */}
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-200 text-xs">
                  <span className="text-stone-600 font-medium">ফসলের কোয়ালিটি রেটিং:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${rating >= star ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                      </button>
                    ))}
                    <span className="font-bold text-amber-900 ml-1 font-mono">({rating}/৫)</span>
                  </div>
                </div>

                {/* Buyer Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={handleConfirmAndRelease}
                    disabled={isReleasing}
                    className="sm:col-span-2 py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isReleasing ? (
                      <span>এসক্রো রিলিজ প্রসেস হচ্ছে...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>ফসল পেয়েছি — রিসিভ কনফার্ম ও টাকা কৃষকের ওয়ালেটে দিন</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRaiseDispute}
                    disabled={isDisputing}
                    className="py-3 px-3 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-800 font-bold text-xs border border-stone-300 hover:border-rose-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>সমস্যা? তহবিল স্থগিত</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Driver Card */}
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
