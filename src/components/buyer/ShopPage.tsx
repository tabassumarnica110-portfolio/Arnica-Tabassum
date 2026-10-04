import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCategory, Product } from "../../types";
import { ProductImage } from "../common/ProductImage";
import { 
  Filter, 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ShoppingCart, 
  Eye, 
  ArrowUpDown, 
  CalendarDays,
  Flame,
  Award,
  MessageSquare,
  QrCode
} from "lucide-react";

export const ShopPage: React.FC = () => {
  const { products, farmers, addToCart, setSelectedProductId, setActiveModal, lang } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);
  const [harvestedLast24h, setHarvestedLast24h] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"FRESHNESS" | "PRICE_ASC" | "RATING">("FRESHNESS");

  // Filtering Logic
  const filteredProducts = products.filter((prod) => {
    if (selectedCategory !== "ALL" && prod.category !== selectedCategory) return false;
    if (selectedDistrict !== "ALL" && prod.district !== selectedDistrict) return false;
    if (onlyOrganic && !prod.isOrganic) return false;
    if (harvestedLast24h && prod.harvestDate !== "2026-10-02") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.banglaName.toLowerCase().includes(q) ||
        prod.farmerName.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "PRICE_ASC") return a.pricePerKg - b.pricePerKg;
    if (sortBy === "RATING") return 4.95 - 4.8;
    return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* 1. Header Banner & Weekly Veggie Combo Box Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Marketplace Title Card */}
        <div className="lg:col-span-8 rounded-2xl bg-[#14532D] p-6 text-white shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#FBBF24] tracking-wider uppercase">
              {lang === "bn" ? "সরাসরি ফার্মগেট বাজার" : "Direct Farmgate Mandi"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === "bn"
                ? "জামালপুরের ভেরিফাইড খামারিদের বিষমুক্ত টাটকা ফসল"
                : "Verified Farmgate Fresh Produce from Jamalpur"}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-normal leading-relaxed">
              প্রতিটি পণ্যে ডিজিটাল কিউআর কোড ও ল্যাব টেস্ট রিপোর্ট। সকালের খেতের ফসল সন্ধ্যায় আপনার দোরগোড়ায়।
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
            <span>১০০% রাসায়নিক ও ফরমালিনমুক্ত</span>
            <span>·</span>
            <span>কোল্ড চেইন ফ্রেইট ডেলিভারি</span>
            <span>·</span>
            <span>বিকাশ ও সরাসরি ব্যাংক এসক্রো</span>
          </div>
        </div>

        {/* Weekly Veggie Combo Box Subscription */}
        <div className="lg:col-span-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 p-5 text-stone-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
                সাপ্তাহিক হোম ডেলিভারি
              </span>
              <CalendarDays className="w-4 h-4 text-amber-800" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">ফ্যামিলি ভেজি কম্বো ঝুড়ি</h3>
            <p className="text-xs text-stone-600 mt-1">
              প্রতি শুক্রবার ভোরে ৫ কেজি ডায়মন্ড আলু, ২ কেজি বেগুন, ১ কেজি পটল ও মরিচের ফ্রেশ বক্স সরাসরি বাসা পর্যন্ত।
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold font-mono text-stone-900">৳ ১,০০০</span>
              <span className="text-xs text-stone-600"> /সপ্তাহ</span>
            </div>
            <button
              onClick={() => {
                alert("সাপ্তাহিক ভেজি কম্বো সাবস্ক্রিপশন সম্পন্ন হয়েছে! প্রতি শুক্রবার সকালে আপনার ঠিকানায় সরাসরি ফ্রেশ ঝুড়ি পৌঁছে যাবে।");
              }}
              className="px-3.5 py-1.5 bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              সাবস্ক্রাইব
            </button>
          </div>
        </div>

      </div>

      {/* 2. REAL-TIME WHOLESALE AUCTION BANNER */}
      <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4 border border-stone-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#FBBF24] flex items-center justify-center font-bold shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-stone-100">
                পাইকারি লাইভ অকশন: ১০০ মণ আমন ধান রিকোয়ারমেন্ট
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-mono font-semibold">
                LIVE
              </span>
            </div>
            <p className="text-xs text-stone-400">
              ক্রেতা: প্রাণ এগ্রো সোর্সিং · টার্গেট দর: ৳৩৩/কেজি · শেষ সময়: আজ রাত ১০:০০ টা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal("INSTITUTIONAL_RFQ")}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-xs border border-stone-700 shadow-xs transition-colors cursor-pointer"
          >
            🏢 প্রাতিষ্ঠানিক বাল্ক সোর্সিং (RFQ)
          </button>

          <button
            onClick={() => setActiveModal("AUCTION")}
            className="px-4 py-2 rounded-lg bg-[#FBBF24] hover:bg-amber-400 text-stone-950 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            লাইভ নিলামে দরপত্র দিন
          </button>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === "bn" ? "ফসল বা কৃষকের নাম দিয়ে খুঁজুন (যেমন: আলু, ব্রি-২৮)..." : "Search crop or farmer..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:ring-1 focus:ring-[#14532D] outline-hidden"
            />
          </div>

          {/* District Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-medium focus:ring-1 focus:ring-[#14532D] outline-hidden"
            >
              <option value="ALL">সকল জেলা (All Districts)</option>
              <option value="Jamalpur">জামালপুর (Jamalpur)</option>
              <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
              <option value="Dhaka">ঢাকা (Dhaka)</option>
              <option value="Bogura">বগুড়া (Bogura)</option>
              <option value="Rangpur">রংপুর (Rangpur)</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-medium focus:ring-1 focus:ring-[#14532D] outline-hidden"
            >
              <option value="FRESHNESS">সতেজতা অনুযায়ী (Harvest Freshness)</option>
              <option value="PRICE_ASC">সর্বনিম্ন দাম অনুযায়ী (Lowest Price)</option>
              <option value="RATING">শীর্ষ রেটিংপ্রাপ্ত কৃষক (Top Rated)</option>
            </select>
          </div>

        </div>

        {/* Category Filter Tabs */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {[
              { id: "ALL", label: "সকল শস্য" },
              { id: "ALU", label: "আলু" },
              { id: "DHAN", label: "ধান ও চাল" },
              { id: "BEGUN", label: "বেগুন" },
              { id: "POTOL", label: "পটল" },
              { id: "MORICH", label: "মরিচ" },
              { id: "PEYAJ", label: "পেঁয়াজ" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#14532D] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-stone-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOrganic}
                onChange={(e) => setOnlyOrganic(e.target.checked)}
                className="w-4 h-4 text-[#14532D] rounded-sm focus:ring-[#14532D]"
              />
              <span>শুধু অর্গানিক</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={harvestedLast24h}
                onChange={(e) => setHarvestedLast24h(e.target.checked)}
                className="w-4 h-4 text-[#14532D] rounded-sm focus:ring-[#14532D]"
              />
              <span>গত ২৪ ঘণ্টায় তোলা</span>
            </label>
          </div>

        </div>

      </div>

      {/* 4. PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-white border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              
              {/* Product Image Header with Zero-Pill Overlay */}
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <ProductImage
                  src={prod.images[0]}
                  alt={prod.banglaName}
                  category={prod.category}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-mono">
                    {prod.category}
                  </span>
                  {prod.isOrganic && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-800/90 backdrop-blur-md text-emerald-100 text-[10px] font-medium">
                      অর্গানিক
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-[10px] font-mono">
                  মজুত: {prod.quantityKg} কেজি
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-stone-800 text-xs flex items-center justify-between font-mono">
                  <span>উত্তোলন: {prod.harvestDate}</span>
                  <span className="text-[#14532D] font-semibold">Grade A+</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                
                <div>
                  <h3 className="font-semibold text-base text-stone-900 group-hover:text-[#14532D] transition-colors leading-snug">
                    {prod.banglaName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    {prod.variety} · ন্যূনতম {prod.minOrderKg} কেজি
                  </p>
                </div>

                {/* Farmer Credential */}
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-1 font-medium text-stone-800">
                    <span>{prod.farmerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{prod.upazila}</span>
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-lg font-bold font-mono text-[#14532D]">৳{prod.pricePerKg}</span>
                    <span className="text-stone-500 text-[10px]"> /কেজি</span>
                  </div>
                  <div className="text-right text-[11px] text-stone-500">
                    <span className="line-through font-mono">সরকারি: ৳{prod.govPrice}</span>
                    <span className="block text-emerald-700 font-medium font-mono">
                      সাশ্রয় ৳{prod.govPrice - prod.pricePerKg}/কেজি
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 pt-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActiveModal("PRODUCT_DETAIL");
                  }}
                  className="py-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>বিস্তারিত ও ট্রেস</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActiveModal("BARGAINING");
                  }}
                  className="py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                  <span>চ্যাট ও দরদাম</span>
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(prod, prod.minOrderKg);
                  setActiveModal("CHECKOUT");
                }}
                className="w-full py-2.5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>সরাসরি অর্ডার করুন</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
