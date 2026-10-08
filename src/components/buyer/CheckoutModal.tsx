import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PaymentMethod } from "../../types";
import { 
  X, 
  CreditCard, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { sanitizeInput, detectMaliciousPayload } from "../../../lib/validation";

export const CheckoutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { cart, updateCartQty, removeFromCart, placeOrder, lang, setActiveModal } = useApp();

  const [recipientName, setRecipientName] = useState<string>("Shafiqul Islam");
  const [recipientPhone, setRecipientPhone] = useState<string>("01811-998877");
  const [district, setDistrict] = useState<string>("Dhaka");
  const [streetAddress, setStreetAddress] = useState<string>("House 42, Road 11, Block D, Banani");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BKASH");
  const [bkashNumber, setBkashNumber] = useState<string>("01811998877");
  const [bkashPin, setBkashPin] = useState<string>("••••");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Distance calculation: Jamalpur farm hub to buyer district
  const distanceKm = district === "Dhaka" ? 148 : district === "Mymensingh" ? 62 : 190;
  const itemsTotal = cart.reduce((sum, item) => sum + item.quantityKg * item.product.pricePerKg, 0);
  const deliveryFee = Math.round(150 + distanceKm * 1.15); // Distance calculated freight
  const platformFee = Math.round(itemsTotal * 0.05); // 5% SaaS commission
  const grandTotal = itemsTotal + deliveryFee + platformFee;

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const safeName = sanitizeInput(recipientName, 80);
    const safeAddress = sanitizeInput(streetAddress, 180);
    const safePhone = sanitizeInput(recipientPhone, 20);

    const threatName = detectMaliciousPayload(safeName);
    const threatAddr = detectMaliciousPayload(safeAddress);
    if (threatName.isMalicious || threatAddr.isMalicious) {
      alert("Security Guard: Suspicious code in address or name detected. Order rejected.");
      return;
    }

    const ordId = placeOrder({
      buyerName: safeName,
      buyerPhone: safePhone,
      deliveryAddress: `${safeAddress}, ${district}`,
      district,
      itemsTotal,
      deliveryFee,
      platformFee,
      grandTotal,
      distanceKm,
      paymentMethod,
    });

    setPlacedOrderId(ordId);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {lang === "bn" ? "নিরাপদ চেকআউট ও কোল্ড ফ্রেইট বুকিং" : "Secure Cold-Chain Checkout"}
              </h3>
              <p className="text-xs text-emerald-200">
                {lang === "bn" ? "দূরত্ব অনুযায়ী স্বয়ংক্রিয় পরিবহন ভাড়া ও টোকেনাইজড পেমেন্ট" : "Distance-based logistics & tokenized checkout"}
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

        {placedOrderId ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-stone-900">
                {lang === "bn" ? "অর্ডার সফলভাবে নিশ্চিত হয়েছে!" : "Order Placed Successfully!"}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                জামালপুর কেন্দ্রীয় হাব থেকে আপনার অর্ডার সরাসরি তাপমাত্রা নিয়ন্ত্রিত কোল্ড ভ্যানে প্রস্তুত হচ্ছে।
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span>অর্ডার আইডি:</span> <span className="font-bold text-[#14532D]">{placedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি দূরত্ব:</span> <span>{distanceKm} কিমি (জামালপুর &rarr; {district})</span>
              </div>
              <div className="flex justify-between">
                <span>পেমেন্ট মাধ্যম:</span> <span>{paymentMethod} (Verified)</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-sm font-bold text-stone-900">
                <span>পরিশোধিত মোট:</span>
                <span>৳ {grandTotal.toLocaleString("bn-BD")}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  setActiveModal("ORDER_TRACKING");
                }}
                className="px-6 py-3 rounded-2xl bg-[#14532D] text-white font-bold text-xs sm:text-sm hover:bg-[#166534] transition-colors cursor-pointer"
              >
                লাইভ অর্ডার ট্র্যাকিং দেখুন (Pathao Style)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Cart Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                ব্যাগের পণ্যসমূহ ({cart.length} টি)
              </h4>

              {cart.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl">
                  আপনার ব্যাগ বর্তমানে খালি। বাজার থেকে পছন্দের ফসল যুক্ত করুন।
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-10 h-10 rounded-lg object-cover" 
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{item.product.banglaName}</span>
                          <span className="text-[11px] text-stone-500 font-mono">
                            কৃষক: {item.product.farmerName} • ৳{item.product.pricePerKg}/কেজি
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantityKg - 5)}
                            className="w-6 h-6 rounded-md bg-stone-200 font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold">{item.quantityKg} কেজি</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantityKg + 5)}
                            className="w-6 h-6 rounded-md bg-stone-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-[#14532D] w-16 text-right">
                          ৳{item.quantityKg * item.product.pricePerKg}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Address & Logistics Distance Form */}
            <form onSubmit={handleCompletePayment} className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>ডেলিভারি ঠিকানা ও ফ্রেইট দূরত্ব ক্যালকুলেটর</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">প্রাপকের নাম:</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#14532D] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">মোবাইল নম্বর:</label>
                    <input
                      type="text"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold font-mono focus:ring-2 focus:ring-[#14532D] outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">গন্তব্য জেলা:</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold focus:ring-2 focus:ring-[#14532D] outline-hidden"
                    >
                      <option value="Dhaka">ঢাকা (১৪৮ কিমি দূরত্ব)</option>
                      <option value="Mymensingh">ময়মনসিংহ (৬২ কিমি দূরত্ব)</option>
                      <option value="Jamalpur">জামালপুর লোকাল (১৫ কিমি)</option>
                      <option value="Bogura">বগুড়া (১২০ কিমি দূরত্ব)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">রাস্তা ও বাসা নম্বর:</label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#14532D] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  নিরাপদ পেমেন্ট গেটওয়ে নির্বাচন করুন:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "KRISHIPAY_ESCROW", label: "KrishiPay স্মার্ট এস্ক্রো", icon: "🛡️", badge: "৩-ধাপে রিলিজ (Safe)" },
                    { id: "BKASH", label: "বিকাশ মার্চেন্ট (bKash)", icon: "📱", badge: "এসক্রো ভল্ট লক" },
                    { id: "SSLCOMMERZ", label: "SSLCommerz গেটওয়ে", icon: "🏦", badge: "ব্যাংক / কার্ড এসক্রো" },
                    { id: "STRIPE", label: "Stripe Card (Global)", icon: "💳", badge: "3D Secure Hold" },
                    { id: "KRISHIPAY_GROUP_SPLIT", label: "গ্রুপ-বাইয়িং স্প্লিট", icon: "🤝", badge: "বাল্ক পুল (B2B)" },
                    { id: "CASH_ON_DELIVERY", label: "ক্যাশ অন ডেলিভারি", icon: "💵", badge: "COD" },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === p.id
                          ? "border-[#14532D] bg-emerald-50 text-[#14532D] font-bold shadow-xs ring-2 ring-emerald-300"
                          : "border-stone-200 hover:border-stone-300 text-stone-700 bg-white"
                      }`}
                    >
                      <div className="text-xl mb-1">{p.icon}</div>
                      <div className="text-xs font-bold">{p.label}</div>
                      <span className="text-[10px] text-stone-500 font-mono block mt-0.5">{p.badge}</span>
                    </div>
                  ))}
                </div>

                {/* Escrow Vault Guarantee Box for bKash / SSLCommerz / Stripe / KrishiPay */}
                {(paymentMethod === "BKASH" || paymentMethod === "SSLCOMMERZ" || paymentMethod === "STRIPE" || paymentMethod === "KRISHIPAY_ESCROW") && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-950 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#14532D]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>কৃষিলিঙ্ক নিরাপদ এসক্রো ভল্ট গ্যারান্টি (Escrow Vault Protocol):</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-200 text-emerald-900 font-bold">
                        {paymentMethod === "BKASH" ? "bKash Merchant Sandbox" : paymentMethod === "SSLCOMMERZ" ? "SSLCommerz Multi-Bank" : paymentMethod === "STRIPE" ? "Stripe Escrow API" : "KrishiPay Smart Escrow"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      আপনার টাকা সরাসরি কৃষকের কাছে যাবে না। এটি কৃষিলিঙ্কের <strong>নিরাপদ এসক্রো ভল্টে লক থাকবে</strong>। কৃষক জামালপুর থেকে কোল্ড চেইন ট্রাকে ফসল পাঠাবেন। আপনি ফসল হাতে পেয়ে কোয়ালিটি যাচাই করে কনফার্ম করলেই কেবল কৃষকের ওয়ালেটে টাকা তাৎক্ষণিক ট্রান্সফার হবে। কোনো পক্ষেরই প্রতারিত হওয়ার সুযোগ নেই!
                    </p>
                  </div>
                )}

                {/* Group Buying Split Wallet Box */}
                {paymentMethod === "KRISHIPAY_GROUP_SPLIT" && (
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-300 text-xs text-indigo-950 space-y-2">
                    <div className="flex items-center justify-between font-bold text-indigo-900">
                      <span className="flex items-center gap-1.5">
                        <span>🤝 সমবায়ী গ্রুপ-বাইয়িং স্প্লিট পেমেন্ট সক্রিয়:</span>
                      </span>
                      <span className="font-mono bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded text-[10px]">
                        পুল কোড: #GRP-{Math.floor(1000 + Math.random() * 9000)}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-indigo-900">
                      আপনি এবং আপনার সহযোগী ব্যবসায়ীরা মিলে এই অর্ডারের টাকা ভাগ করে দিতে পারবেন। আপনার বর্তমান শেয়ার: <strong>৫০% (৳{(grandTotal * 0.5).toLocaleString()})</strong>। বাকি ৫০% অন্য ক্রেতারা পরিশোধ করলেই পূর্ণ ট্রাকলোড সরবরাহ শুরু হবে।
                    </p>
                  </div>
                )}

                {/* bKash PIN simulator */}
                {paymentMethod === "BKASH" && (
                  <div className="p-3.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-900 flex items-center justify-between">
                    <span>bKash Merchant Account: <strong>01700-112233</strong></span>
                    <span className="font-mono bg-pink-200 px-2 py-0.5 rounded font-bold">Tokenized Sandbox</span>
                  </div>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>ফসলের মোট মূল্য:</span>
                  <span>৳ {itemsTotal.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>কোল্ড চেইন পরিবহন চার্জ ({distanceKm} কিমি):</span>
                  <span>৳ {deliveryFee.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>প্ল্যাটফর্ম ফি (৫% স্বচ্ছ কমিশন):</span>
                  <span>৳ {platformFee.toLocaleString("bn-BD")}</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between text-base font-black text-[#14532D]">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span>৳ {grandTotal.toLocaleString("bn-BD")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={cart.length === 0}
                className="w-full py-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm shadow-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                নিরাপদে অর্ডার কনফার্ম করুন (৳ {grandTotal.toLocaleString("bn-BD")})
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
