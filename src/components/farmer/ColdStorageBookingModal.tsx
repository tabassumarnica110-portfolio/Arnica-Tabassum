import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ColdStorage } from "../../types";
import { 
  X, 
  ThermometerSnowflake, 
  MapPin, 
  Calendar, 
  PackageCheck, 
  CheckCircle2, 
  Phone, 
  Info,
  Scale
} from "lucide-react";

export const ColdStorageBookingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { coldStorages, bookColdStorage, currentUser, lang } = useApp();
  const [selectedStorage, setSelectedStorage] = useState<ColdStorage>(coldStorages[0]);
  const [cropType, setCropType] = useState<string>("আলু (ডায়মন্ড গ্রেড-১)");
  const [bagsCount, setBagsCount] = useState<number>(100);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);

  const kgPerBag = 50; // standard 50kg bag
  const totalWeightKg = bagsCount * kgPerBag;
  const totalCostTaka = bagsCount * selectedStorage.ratePerBagMonth * durationMonths;

  const handleConfirmBooking = () => {
    bookColdStorage({
      storageId: selectedStorage.id,
      storageName: selectedStorage.name,
      farmerId: currentUser.id,
      cropType,
      bagsCount,
      totalWeightKg,
      durationMonths,
      totalCostTaka,
    });
    setBookedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl">
                {lang === "bn" ? "হিমাগার (কোল্ড স্টোরেজ) স্পেস বুকিং" : "Cold Storage Space Reservation"}
              </h3>
              <p className="text-xs text-emerald-200">
                {lang === "bn" ? "জামালপুর ও আশেপাশের ৫টি অনুমোদিত হিমাগারে সরাসরি সংরক্ষণ" : "Direct access to 5 certified cold chains in Jamalpur region"}
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

        {bookedSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-stone-900">
                {lang === "bn" ? "বুকিং সফল হয়েছে!" : "Booking Successfully Confirmed!"}
              </h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                {selectedStorage.name}-এ আপনার {bagsCount} বস্তা ({totalWeightKg} কেজি) {cropType} সংরক্ষণের জন্য স্লট রিজার্ভ করা হয়েছে।
              </p>
            </div>
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between"><span>রসিদ নং:</span> <span className="font-bold">CSB-JM-{Math.floor(1000 + Math.random() * 9000)}</span></div>
              <div className="flex justify-between"><span>হিমাগার ঠিকানা:</span> <span>{selectedStorage.address}</span></div>
              <div className="flex justify-between"><span>ম্যানেজার মোবাইল:</span> <span className="font-bold text-[#14532D]">{selectedStorage.contactPhone}</span></div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t">
                <span>মোট ভাড়ার পরিমাণ:</span>
                <span>৳ {totalCostTaka.toLocaleString("bn-BD")}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-[#14532D] text-white font-bold text-sm hover:bg-[#166534] transition-colors cursor-pointer"
            >
              সম্পন্ন
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Storage selection column */}
            <div className="lg:col-span-6 space-y-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                {lang === "bn" ? "১. জামালপুর অঞ্চলের হিমাগার নির্বাচন করুন" : "1. Select Cold Storage Facility"}
              </label>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {coldStorages.map((cs) => {
                  const isSelected = selectedStorage.id === cs.id;
                  return (
                    <div
                      key={cs.id}
                      onClick={() => setSelectedStorage(cs)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#14532D] bg-emerald-50/50 shadow-sm"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{cs.name}</h4>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            <span>{cs.address}</span>
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#14532D] font-mono text-[11px] font-bold">
                          {cs.availCapTons} টন খালি
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-[11px] text-stone-600 font-mono">
                        <div>তাপমাত্রা: <span className="font-bold text-blue-600">{cs.tempC}°C</span></div>
                        <div>আর্দ্রতা: <span className="font-bold text-cyan-600">{cs.humidity}%</span></div>
                        <div>ভাড়া: <span className="font-bold text-amber-700">৳{cs.ratePerBagMonth}/বস্তা</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Form Column */}
            <div className="lg:col-span-6 space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                {lang === "bn" ? "২. ফসলের বিবরণ ও ভাড়ার হিসাব" : "2. Crop & Duration Specification"}
              </label>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">সংরক্ষণযোগ্য ফসল:</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#14532D] outline-hidden"
                  >
                    <option value="আলু (ডায়মন্ড গ্রেড-১)">আলু (ডায়মন্ড গ্রেড-১)</option>
                    <option value="তাহেরপুরী দেশি পেঁয়াজ">তাহেরপুরী দেশি পেঁয়াজ</option>
                    <option value="রসুন ও শুকনা মরিচ">রসুন ও শুকনা মরিচ</option>
                    <option value="বীজ ধান (ব্রি-২৮/২৯)">বীজ ধান (ব্রি-২৮/২৯)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">বস্তার সংখ্যা (৫০কেজি/বস্তা):</label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={bagsCount}
                      onChange={(e) => setBagsCount(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold focus:ring-2 focus:ring-[#14532D] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">সংরক্ষণ মেয়াদ (মাস):</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold focus:ring-2 focus:ring-[#14532D] outline-hidden"
                    />
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>মোট ওজন:</span>
                    <span className="font-bold">{totalWeightKg} কেজি ({(totalWeightKg / 1000).toFixed(1)} টন)</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>প্রতি বস্তা মাসিক চার্জ:</span>
                    <span>৳ {selectedStorage.ratePerBagMonth}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>মেয়াদ:</span>
                    <span>{durationMonths} মাস</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-[#14532D]">
                    <span>সর্বমোট স্টোরেজ ভাড়া:</span>
                    <span>৳ {totalCostTaka.toLocaleString("bn-BD")}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  কোল্ড স্টোরেজ কনফার্ম বুকিং করুন
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
