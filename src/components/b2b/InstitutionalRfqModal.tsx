import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCategory } from "../../types";
import { 
  X, 
  Building2, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Calendar,
  DollarSign,
  Scale,
  Sparkles,
  Truck
} from "lucide-react";

export const InstitutionalRfqModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lang, addAuditLog } = useApp();

  const [companyName, setCompanyName] = useState("");
  const [procurementCategory, setProcurementCategory] = useState<ProductCategory>("ALU");
  const [requiredTons, setRequiredTons] = useState(25);
  const [targetPricePerKg, setTargetPricePerKg] = useState(28);
  const [deliveryFrequency, setDeliveryFrequency] = useState<"DAILY" | "WEEKLY" | "BI_WEEKLY" | "ONE_OFF">("WEEKLY");
  const [deliveryLocation, setDeliveryLocation] = useState("Tejgaon Central Depot, Dhaka");
  const [qcGrade, setQcGrade] = useState<"GRADE_A_PLUS" | "GRADE_A" | "EXPORT_GRADE">("GRADE_A_PLUS");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRfqId, setGeneratedRfqId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rfqId = `RFQ-KL-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRfqId(rfqId);
    setIsSubmitted(true);

    addAuditLog(
      "INSTITUTIONAL_RFQ_SUBMISSION",
      `/b2b/rfq/${rfqId}`,
      "ALLOWED",
      `B2B Tender placed by ${companyName} for ${requiredTons} metric tons of ${procurementCategory} with Grade ${qcGrade}. Direct Escrow facility active.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">
                  {lang === "bn" ? "প্রতিষ্ঠানিক পাইকারি সোর্সিং ও আরএফকিউ" : "Enterprise Bulk Sourcing & RFQ"}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#FBBF24] text-stone-950 text-[10px] font-bold font-mono">
                  B2B PROCUREMENT
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {lang === "bn"
                  ? "সুপারমার্কেট, ফুড প্রসেসর ও রপ্তানিকারকদের জন্য সরাসরি কৃষকের সাথে চুক্তিভিত্তিক চাষাবাদ"
                  : "Contract farming & wholesale farmgate supply for supermarkets, processors & exporters"}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-800">
          
          {isSubmitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {generatedRfqId}
                </span>
                <h3 className="text-2xl font-bold text-stone-900">
                  {lang === "bn" ? "প্রতিষ্ঠানিক দরপত্র সফলভাবে রেজিস্টার্ড হয়েছে!" : "Enterprise Procurement Tender Active!"}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  {companyName}-এর চাহিদাকৃত <strong>{requiredTons} মেট্রিক টন</strong> ফসলের জন্য জামালপুর কেন্দ্রীয় হাবের রেজিস্টার্ড এফপিও (কৃষক উৎপাদন দল) ও সমবায় খামারিদের জানানো হয়েছে।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left max-w-md mx-auto space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-500">প্রকিউরমেন্ট ক্যাটাগরি:</span>
                  <span className="font-bold text-stone-900">{procurementCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">টার্গেট মূল্য:</span>
                  <span className="font-bold text-[#14532D]">৳{targetPricePerKg}/কেজি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">কোয়ালিটি গ্রেড:</span>
                  <span className="font-bold text-stone-900">{qcGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">ডেলিভারি ঠিকানা:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[200px]">{deliveryLocation}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-emerald-700 font-bold">
                  <span>নিরাপত্তা বিধান:</span>
                  <span>১০০% ব্যাংক গ্যারান্টি ও এস্ক্রো সমর্থিত</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#14532D] text-white font-semibold rounded-xl text-sm shadow-sm hover:bg-[#166534] transition-colors cursor-pointer"
              >
                {lang === "bn" ? "সম্পন্ন" : "Done"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Trust Callout */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <span className="font-bold block">
                    {lang === "bn" ? "করপোরেট সোর্সিং গ্যারান্টি (Enterprise SLA)" : "Corporate Sourcing Guarantee"}
                  </span>
                  <p className="text-stone-600 leading-relaxed font-normal">
                    {lang === "bn"
                      ? "সরাসরি জামালপুর ও যমুনা অববাহিকার ৫,২০০+ ভেরিফাইড কৃষকদের সাথে চুক্তি। ল্যাব সার্টিফাইড আর্দ্রতা, কোল্ড চেইন ফ্রেইট এবং ব্যাংক এস্ক্রোর মাধ্যমে কোনো অপচয় বা সরবরাহ বিঘ্ন ঘটে না।"
                      : "Direct supply agreements with 5,200+ verified farmers in Jamalpur. Certified moisture metrics, reefer transport, and escrow-backed fulfillment."}
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "প্রতিষ্ঠানের নাম (Company / Brand)" : "Company / Organization Name"} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: PRAN Agro / Shwapno / Square Consumer"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "প্রয়োজনীয় ফসল ক্যাটাগরি" : "Crop Commodity"} *
                  </label>
                  <select
                    value={procurementCategory}
                    onChange={(e) => setProcurementCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs sm:text-sm focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  >
                    <option value="ALU">ডায়মন্ড গোল আলু (Diamond Potato)</option>
                    <option value="DHAN">আমন ও বোরো ধান / চাল (BRRI Paddy/Rice)</option>
                    <option value="MORICH">মেলান্দহ লাল শুকনা মরিচ (Red Chili)</option>
                    <option value="PEYAJ">তাহেরপুরী দেশি পেঁয়াজ (Red Onion)</option>
                    <option value="BEGUN">দেশি গোল বেগুন (Tal Brinjal)</option>
                    <option value="POTOL">যমুনা চরের কচি পটল (Pointed Gourd)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "চাহিদার পরিমাণ (মেট্রিক টন)" : "Required Volume (Metric Tons)"} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      required
                      value={requiredTons}
                      onChange={(e) => setRequiredTons(Number(e.target.value))}
                      className="w-full pl-3.5 pr-12 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm font-mono font-bold focus:ring-1 focus:ring-[#14532D] outline-hidden"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-mono">
                      টুল টন
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    = {(requiredTons * 1000).toLocaleString()} কেজি ({(requiredTons * 25).toLocaleString()} মণ)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "টার্গেট ফার্মগেট দর (৳/কেজি)" : "Target Unit Price (৳/kg)"} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      required
                      value={targetPricePerKg}
                      onChange={(e) => setTargetPricePerKg(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm font-mono font-bold text-[#14532D] focus:ring-1 focus:ring-[#14532D] outline-hidden"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-mono">
                      ৳
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 mt-1 block font-mono">
                    প্রাক্কলিত মোট চালান মূল্য: ৳ {(requiredTons * 1000 * targetPricePerKg).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "গুণমান স্ট্যান্ডার্ড (Quality Grade)" : "Quality Specification"}
                  </label>
                  <select
                    value={qcGrade}
                    onChange={(e) => setQcGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs sm:text-sm focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  >
                    <option value="GRADE_A_PLUS">Grade A+ (ল্যাব সার্টিফাইড, ১০০% দাগহীন)</option>
                    <option value="GRADE_A">Grade A (স্ট্যান্ডার্ড বাণিজ্যিক গুণমান)</option>
                    <option value="EXPORT_GRADE">Export Certified (গ্লোবাল জিএপি স্ট্যান্ডার্ড)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "সরবরাহের পুনরাবৃত্তি" : "Fulfillment Cadence"}
                  </label>
                  <select
                    value={deliveryFrequency}
                    onChange={(e) => setDeliveryFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs sm:text-sm focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  >
                    <option value="WEEKLY">সাপ্তাহিক রানিং চালান (Weekly Rolling)</option>
                    <option value="DAILY">দৈনিক সতেজ চালান (Daily Fresh Dispatch)</option>
                    <option value="BI_WEEKLY">পাক্ষিক চালান (Bi-Weekly Batch)</option>
                    <option value="ONE_OFF">এককালীন বড় ব্যাচ (One-time Bulk)</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {lang === "bn" ? "ডেলিভারি ডিপো / ফ্যাক্টরি ঠিকানা" : "Delivery Depot / Warehouse Location"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তেজগাঁও সেন্ট্রাল ওয়্যারহাউজ, ঢাকা মেট্রো"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:ring-1 focus:ring-[#14532D] outline-hidden"
                />
              </div>

              {/* Point of Contact */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-900 block mb-3">
                  {lang === "bn" ? "প্রতিষ্ঠান প্রতিনিধির যোগাযোগ" : "Institutional Contact Person"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="প্রতিনিধির নাম"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="অফিসিয়াল ফোন (যেমন: 017...)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  />
                  <input
                    type="email"
                    required
                    placeholder="কর্পোরেট ইমেইল"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#14532D] outline-hidden"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-mono">
                  🔒 এসএলএ ও মূল্য সুরক্ষা এনক্রিপ্টেড
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{lang === "bn" ? "আরএফকিউ টেন্ডার প্রকাশ করুন" : "Publish RFQ Tender"}</span>
                  <ArrowRight className="w-4 h-4 text-[#FBBF24]" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
