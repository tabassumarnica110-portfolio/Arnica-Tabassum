import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  PhoneCall, 
  CheckCircle2, 
  BarChart3, 
  Truck, 
  ScanQrCode, 
  Mic, 
  ThermometerSnowflake, 
  Layers,
  ArrowRight,
  UserCheck,
  Globe
} from "lucide-react";

export const LandingPage: React.FC<{ onExploreShop: () => void; onFarmerPortal: () => void }> = ({
  onExploreShop,
  onFarmerPortal,
}) => {
  const { lang, farmers, setActiveModal } = useApp();

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION - High-impact agri startup story */}
      <section className="relative overflow-hidden pt-6 lg:pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-[#14532D] text-xs font-semibold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>
                  {lang === "bn" ? "সরাসরি কৃষক-টু-ভোক্তা ডিজিটাল সাপ্লাই চেইন নেটওয়ার্ক" : "Direct Farmgate Supply Chain Platform"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.2]">
                {lang === "bn" ? (
                  <>
                    সরাসরি জামালপুরের খেত থেকে <span className="text-[#14532D]">ন্যায্যমূল্যে টাটকা ফসল</span>
                  </>
                ) : (
                  <>
                    Direct from <span className="text-[#14532D]">Jamalpur Farm Gates</span> to Your Dining Table
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
                {lang === "bn"
                  ? "কোনো মধ্যস্বত্বভোগী বা সিন্ডিকেট নয়। জামালপুর, মেলান্দহ ও ইসলামপুরের প্রত্যন্ত কৃষকদের কাছ থেকে বিষমুক্ত টাটকা ধান, আলু, বেগুন ও শাকসবজি কিনুন সরাসরি খামারি মূল্যে। কৃষক পাবে ন্যায্যমূল্য, আপনি পাবেন শতভাগ খাঁটি খাদ্য।"
                  : "Eliminating intermediaries and predatory markups. Source fresh Boro paddy, Diamond potatoes, vegetables directly from verified farmers in Jamalpur with QR traceability and cold-chain logistics."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={onExploreShop}
                  className="px-6 py-3.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>{lang === "bn" ? "ফার্মগেট মার্কেটপ্লেস দেখুন" : "Explore Marketplace"}</span>
                  <ArrowRight className="w-4 h-4 text-[#FBBF24]" />
                </button>

                <button
                  onClick={onFarmerPortal}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>{lang === "bn" ? "কৃষক ড্যাশবোর্ড" : "Farmer Portal"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveModal("SECURITY_LAB")}
                  className="px-4 py-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs border border-stone-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{lang === "bn" ? "নিরাপত্তা ও অডিট" : "Security Architecture"}</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-normal">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "bn" ? "কৃষি সম্প্রসারণ অধিদপ্তর প্রত্যয়ন" : "DAE Standards Compliant"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "bn" ? "এনআইডি ভেরিফাইড খামারি" : "100% KYC Verified Farmers"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "bn" ? "বিকাশ ও ব্যাংক সরাসরি এস্ক্রো" : "Direct Escrow Settlements"}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-stone-900 text-white shadow-xl overflow-hidden border border-stone-800">
                
                {/* Hero Banner Visual */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                  <img 
                    src="/src/assets/images/hero_agritech_farmgate_1791049455344.jpg"
                    alt="Jamalpur Farmgate Cold Logistics"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[11px] font-mono text-emerald-200">
                        সরাসরি কোল্ড ফ্রেইট লিঙ্ক সক্রিয়
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-300 bg-stone-900/80 px-2 py-0.5 rounded-md border border-white/10">
                      জামালপুর ➔ ঢাকা মেট্রো
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  
                  {/* Item 1: Boro Dhan */}
                  <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-center gap-3">
                    <img 
                      src="/src/assets/images/product_boro_dhan_1791049472339.jpg" 
                      alt="BRRI-28 Dhan" 
                      className="w-14 h-14 rounded-lg object-cover border border-stone-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs sm:text-sm text-stone-100 truncate">
                          ব্রি-২৮ আমন ধান (A+ গ্রেড)
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#FBBF24]">৳৩৪/কেজি</span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate">আলহাজ্ব মোকবুল হোসেন · কেন্দুয়া, জামালপুর সদর</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                        <span>আর্দ্রতা: ১৩.৮% (ল্যাব পাস্ট)</span>
                        <span>স্টক: ৩,৫০০ কেজি</span>
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Diamond Potato */}
                  <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-center gap-3">
                    <img 
                      src="/src/assets/images/product_diamond_potato_1791049486919.jpg" 
                      alt="Diamond Potato" 
                      className="w-14 h-14 rounded-lg object-cover border border-stone-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs sm:text-sm text-stone-100 truncate">
                          টাটকা ডায়মন্ড গোল আলু
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#FBBF24]">৳২৯/কেজি</span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate">শহিদুল আলম · শরীফপুর, জামালপুর</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                        <span>হিমাগার: বেলটিয়া কোল্ড চেইন</span>
                        <span>স্টক: ৮,২০০ কেজি</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-stone-300">
                    <div>
                      <span className="text-[11px] text-stone-400 block">আজকের নিশ্চিত ডেসপ্যাচ</span>
                      <span className="font-bold font-mono text-white text-sm">১৪.২ মেট্রিক টন</span>
                    </div>
                    <button 
                      onClick={onExploreShop}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      লাইভ পণ্য দেখুন
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM VS SOLUTION - Core Storytelling (DeHaat/Ninjacart style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#D97706] font-extrabold">
            {lang === "bn" ? "কেন কৃষিলিংক?" : "Why KrishiLink?"}
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">
            {lang === "bn"
              ? "ঐতিহ্যবাহী সিন্ডিকেট বনাম কৃষিলিংক সরাসরি সরবরাহ"
              : "Traditional Exploitative Middlemen vs KrishiLink Direct Model"}
          </h3>
          <p className="text-stone-600 mt-3 text-sm sm:text-base">
            {lang === "bn"
              ? "কীভাবে দালালরা কৃষকের রক্ত পানি করা ফসলের ৫০% মুনাফা লুট করত এবং আমরা কীভাবে তা কৃষক ও সাধারণ মানুষের হাতে ফিরিয়ে দিয়েছি।"
              : "See how KrishiLink saves up to 45% unnecessary markup and prevents massive food spoilage."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Exploitation Card */}
          <div className="rounded-3xl bg-red-50/70 border border-red-200 p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                {lang === "bn" ? "পুরনো অস্বচ্ছ ব্যবস্থা (ফড়িয়া-দালাল)" : "Traditional Exploitative Chain"}
              </span>
              <span className="text-2xl font-black text-red-600">❌ ৫০% অপচয় ও লুট</span>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">1</div>
                <div>
                  <p className="font-bold text-stone-900">কৃষক পায় মাত্র ২০ টাকা/কেজি</p>
                  <p className="text-xs text-stone-600">স্থানীয় আড়তদার ও পাইকাররা বাকিতে মাল কিনে কম দাম চাপিয়ে দেয়।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">2</div>
                <div>
                  <p className="font-bold text-stone-900">৪ ধাপের ফড়িয়া ও পরিবহন কমিশন</p>
                  <p className="text-xs text-stone-600">লোকাল বেপারি &rarr; জেলা আড়ত &rarr; কারওয়ান বাজার &rarr; মহল্লার খুচরা বিক্রেতা।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">3</div>
                <div>
                  <p className="font-bold text-stone-900">ক্রেতা কেনে ৬০ টাকা/কেজিতে</p>
                  <p className="text-xs text-stone-600">পথিমধ্যে খাদ্য নষ্ট হয় ৩০%, কোল্ড চেইন না থাকায় পচন ধরে।</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-100/70 border border-red-300 text-xs text-red-900 font-semibold">
              ফলাফল: কৃষক ঋণগ্রস্ত, সাধারণ ক্রেতা দ্রব্যমূল্যের চাপে দিশেহারা!
            </div>
          </div>

          {/* KrishiLink Direct Solution Card */}
          <div className="rounded-3xl bg-emerald-50/70 border-2 border-emerald-500 p-8 space-y-6 relative overflow-hidden shadow-xl shadow-emerald-900/5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-[#14532D] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                {lang === "bn" ? "কৃষিলিংক সরাসরি ফ্রেইট মডেল" : "KrishiLink Direct Agri Chain"}
              </span>
              <span className="text-2xl font-black text-[#14532D]">✅ ১০০% স্বচ্ছ</span>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-[#14532D] flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">1</div>
                <div>
                  <p className="font-bold text-stone-900">কৃষক পায় ৩৫ টাকা/কেজি (৭৫% বেশি আয়)</p>
                  <p className="text-xs text-stone-600">সরাসরি কৃষক অ্যাপের মাধ্যমে ডিজিটাল পেমেন্ট ও কোল্ড স্টোরেজ সাপোর্ট।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-[#14532D] flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">2</div>
                <div>
                  <p className="font-bold text-stone-900">জিরো মিডলম্যান + সরাসরি ডোরস্টেপ কোল্ড ট্রাক</p>
                  <p className="text-xs text-stone-600">জামালপুর কেন্দ্রীয় হাব থেকে ঢাকার ওয়্যারহাউজে সরাসরি ৬ ঘণ্টায় চালান।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-[#14532D] flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">3</div>
                <div>
                  <p className="font-bold text-stone-900">ক্রেতা পায় মাত্র ৪২ টাকায় টাটকা এ-গ্রেড সবজি</p>
                  <p className="text-xs text-stone-600">খাবারের অপচয় নেমে এসেছে ২% এ। কিউআর কোড স্ক্যান করে পুরো জার্নি দৃশ্যমান।</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-100 text-xs text-[#14532D] font-bold">
              ফলাফল: কৃষক স্বাবলম্বী, ক্রেতার সাশ্রয় ১৮ টাকা প্রতি কেজিতে!
            </div>
          </div>

        </div>
      </section>

      {/* 3. LIVE IMPACT COUNTER DASHBOARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-r from-[#14532D] via-[#166534] to-[#0A2F18] p-8 sm:p-12 text-white shadow-2xl relative">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-widest text-[#FBBF24] font-bold">
              {lang === "bn" ? "বাস্তব ইমপ্যাক্ট ও সামাজিক প্রভাব" : "Real-time Verified Impact"}
            </span>
            <h3 className="text-3xl font-extrabold mt-1">
              {lang === "bn"
                ? "জামালপুর ও ময়মনসিংহ অঞ্চলের কৃষকদের বাস্তব সমৃদ্ধি"
                : "Measurable Economic Empowerment for Bangladeshi Farmers"}
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-[#FBBF24]">১,২৫০+ কেজি</span>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 font-medium">
                {lang === "bn" ? "খাদ্য অপচয় রক্ষা হয়েছে" : "Post-harvest Loss Saved"}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-emerald-300">৩৫.৮%</span>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 font-medium">
                {lang === "bn" ? "কৃষকের নিট আয় বৃদ্ধি" : "Net Farmer Income Rise"}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-amber-300">১,৪২০+</span>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 font-medium">
                {lang === "bn" ? "নিবন্ধিত ভেরিফাইড কৃষক" : "NID Verified Farmers"}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-emerald-200">৳ ২৪.৮ লাখ</span>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 font-medium">
                {lang === "bn" ? "মোট কৃষিপণ্য কেনাবেচা (GMV)" : "Gross Platform Volume"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL FARMER STORIES FROM JAMALPUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D97706] font-extrabold">
            {lang === "bn" ? "আমাদের গর্বিত উৎপাদকরা" : "Farmer Spotlight"}
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-stone-900 mt-1">
            {lang === "bn"
              ? "জামালপুরের মাঠ থেকে যারা দেশ গড়ছেন"
              : "Real Stories from Jamalpur Sadar, Melandaha & Islampur"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {farmers.slice(0, 3).map((f) => (
            <div 
              key={f.id} 
              className="rounded-3xl bg-white p-6 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#14532D] font-extrabold text-xl">
                    {f.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-stone-900 flex items-center gap-1.5">
                      <span>{f.name}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    </h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{f.village}, {f.upazila}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 italic bg-stone-50 p-3 rounded-xl border border-stone-100">
                  "{f.bio}"
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-[#14532D]">
                    <span className="block text-[10px] text-stone-500">মোট বিক্রয়</span>
                    <span className="font-bold">৳ {(f.salesTaka / 1000).toFixed(0)}k+ টাকা</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900">
                    <span className="block text-[10px] text-stone-500">জমি ও রেটিং</span>
                    <span className="font-bold">{f.landAcres} একর | ⭐ {f.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold font-mono">
                  {f.organicCertified ? "🌱 ১০০% অর্গানিক সার্টিফাইড" : "🌾 বিএডিসি অনুমোদিত"}
                </span>
                <span className="text-stone-400 font-mono">NID: {f.nidNumber.slice(0, 4)}••••</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 5-STAR REVOLUTIONARY FEATURES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-14">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#FBBF24] font-bold">
              {lang === "bn" ? "প্রযুক্তিগত উৎকর্ষ" : "Deep AgriTech Capabilities"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black mt-2">
              {lang === "bn"
                ? "কৃষিলিংক কেন আন্তর্জাতিক মানের"
                : "World-Class AgriTech Features Built for Bangladesh"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div 
              onClick={onFarmerPortal}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-950/40 hover:border-emerald-500/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-[#FBBF24]" />
              </div>
              <h4 className="font-bold text-lg text-emerald-100 flex items-center justify-between">
                <span>AI রোগ শনাক্তকরণ (Disease Vision)</span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700">
                  Live Test ➔
                </span>
              </h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                আলু, বেগুন, ধান, পটল, লাউ, মিষ্টি কুমড়ো, মরিচ, টমেটো, আম, লিচু ও আনারসের ছবি আপলোড বা ক্যামেরা দিয়ে তুলুন — এআই তাৎক্ষণিক রোগাক্রান্ত নাকি সুস্থ তা বিশ্লেষণ করে সঠিক প্রেসক্রিপশন দেবে।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <ScanQrCode className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-amber-100">QR কোড ব্লকচেইন ট্রেসেবিলিটি</h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                প্রতিটি পণ্যে ইউনিক কিউআর কোড। স্ক্যান করলেই বীজ রোপণ, সার প্রয়োগ ও ল্যাব পরীক্ষার টাইমলাইন দৃশ্যমান।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-blue-100">কোল্ড স্টোরেজ লাইভ বুকিং</h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                জামালপুরের ৫টি আধুনিক হিমাগারের লাইভ ফাঁকা স্পেস ম্যাপে দেখে বস্তা অনুযায়ী সরাসরি সংরক্ষিত বুকিং।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-purple-100">বাংলা ভয়েস ইনপুট (Web Speech)</h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                নিরক্ষর কৃষক মুখে বললেই (যেমন "৫০ কেজি আলু ৩০ টাকা") স্বয়ংক্রিয়ভাবে ফর্ম পূরণ ও পণ্য আপলোড হয়ে যাবে।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-yellow-100">এআই বাজারদর প্রেডিকশন</h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                গত ৩০ দিনের সরকারি ও পাইকারি দাম এবং আগামী ৭ দিনের সম্ভাব্য দামের রিচার্টস ট্রেন্ড অ্যানালাইসিস।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-red-100">মিলিটারি গ্রেড সাইবার সিকিউরিটি</h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Bcrypt ১২ রাউন্ড, ৫ বার ভুলের পর লকআউট, Zod ভ্যালিডেশন, প্যারামিটারাইজড SQLi শিল্ড ও আরলএস পলিসি।
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-black text-stone-900 mb-12">
          {lang === "bn" ? "কীভাবে কাজ করে কৃষিলিংক?" : "How KrishiLink Works"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3">
            <span className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold">1</span>
            <h4 className="font-bold text-base text-stone-900">কৃষক ফসল তালিকাভুক্ত করে</h4>
            <p className="text-xs text-stone-600">ভয়েস বা লিখে ফসল, পরিমাণ ও কাটার তারিখ যুক্ত করে। এআই দ্রুত বিক্রির দর সাজেস্ট করে।</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3">
            <span className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold">2</span>
            <h4 className="font-bold text-base text-stone-900">ল্যাব QC ও মান নিয়ন্ত্রণ</h4>
            <p className="text-xs text-stone-600">জামালপুর ফিল্ড অফিসার আর্দ্রতা ও গুণমান পরীক্ষা করে ডিজিটাল কিউআর কোড অনুমোদন দেয়।</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3">
            <span className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold">3</span>
            <h4 className="font-bold text-base text-stone-900">ক্রেতা অর্ডার ও দরদাম</h4>
            <p className="text-xs text-stone-600">বাসাবাড়ি বা পাইকার সরাসরি অর্ডার করে অথবা লাইভ চ্যাটে দাম সমঝোতা করে বিকাশ বা কার্ডে পেমেন্ট করে।</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3">
            <span className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold">4</span>
            <h4 className="font-bold text-base text-stone-900">কোল্ড ফ্রেইট ও ডোরস্টেপ ডেলিভারি</h4>
            <p className="text-xs text-stone-600">তাপমাত্রা নিয়ন্ত্রিত ট্রাকে সরাসরি কৃষকের খেত থেকে ক্রেতার ঠিকানায় নিরাপদে পৌঁছানো হয়।</p>
          </div>
        </div>
      </section>

    </div>
  );
};
