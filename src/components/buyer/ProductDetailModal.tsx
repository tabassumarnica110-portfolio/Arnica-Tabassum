import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Product } from "../../types";
import { ProductImage } from "../common/ProductImage";
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ShoppingCart, 
  ScanQrCode, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  Phone,
  Scale
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import L from "leaflet";

export const ProductDetailModal: React.FC<{ productId: string; onClose: () => void }> = ({ productId, onClose }) => {
  const { products, farmers, addToCart, lang, setActiveModal } = useApp();
  const [selectedQty, setSelectedQty] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<"DETAILS" | "TRACEABILITY" | "PRICE_HISTORY">("DETAILS");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const product = products.find((p) => p.id === productId) || products[0];
  const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];

  // Recharts 30-Day Historical + 7-Day AI Predicted Price Data
  const priceData = [
    { date: "০২ সেপ্টে", historical: product.pricePerKg - 3, predicted: null, gov: product.govPrice },
    { date: "০৮ সেপ্টে", historical: product.pricePerKg - 2, predicted: null, gov: product.govPrice },
    { date: "১৫ সেপ্টে", historical: product.pricePerKg - 1, predicted: null, gov: product.govPrice },
    { date: "২২ সেপ্টে", historical: product.pricePerKg, predicted: null, gov: product.govPrice },
    { date: "২৮ সেপ্টে", historical: product.pricePerKg + 1, predicted: null, gov: product.govPrice },
    { date: "আজ (০২ অক্টো)", historical: product.pricePerKg, predicted: product.pricePerKg, gov: product.govPrice },
    { date: "+২ দিন", historical: null, predicted: product.pricePerKg + 1.5, gov: product.govPrice },
    { date: "+৪ দিন", historical: null, predicted: product.pricePerKg + 2.0, gov: product.govPrice },
    { date: "+৭ দিন (ভবিষ্যত)", historical: null, predicted: product.pricePerKg + 3.0, gov: product.govPrice },
  ];

  // Initialize Leaflet Map on Mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current).setView([farmer.lat, farmer.lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom Agri Marker Icon
      const customIcon = L.divIcon({
        className: "custom-agri-marker",
        html: `
          <div style="background-color: #14532D; color: white; padding: 6px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #FBBF24;">
            <span>🌾</span> <span>${farmer.name.split(" ")[0]} Farm</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      L.marker([farmer.lat, farmer.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${farmer.name}</b><br/>${farmer.village}, ${farmer.upazila}<br/>Rating: ⭐ ${farmer.rating}`)
        .openPopup();

      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [farmer]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#FBBF24] text-stone-950 text-xs font-black uppercase">
              {product.category}
            </span>
            <div>
              <h2 className="font-extrabold text-xl">{product.banglaName}</h2>
              <p className="text-xs text-emerald-200">
                {product.name} • {product.variety}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-stone-100 p-2 border-b border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("DETAILS")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "DETAILS" ? "bg-white text-[#14532D] shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            📋 পণ্যের বিবরণ ও মানচিত্র
          </button>
          <button
            onClick={() => setActiveTab("TRACEABILITY")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "TRACEABILITY" ? "bg-white text-[#14532D] shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ScanQrCode className="w-4 h-4 text-[#D97706]" />
            <span>ব্লকচেইন ট্রেসেবিলিটি টাইমলাইন (WOW)</span>
          </button>
          <button
            onClick={() => setActiveTab("PRICE_HISTORY")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "PRICE_HISTORY" ? "bg-white text-[#14532D] shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>৩০ দিনের বাজারদর ও এআই পূর্বাভাস</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: DETAILS & LEAFLET MAP */}
          {activeTab === "DETAILS" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product Gallery & Specs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl overflow-hidden aspect-16/10 border border-stone-200 shadow-xs">
                  <ProductImage 
                    src={product.images[0]} 
                    alt={product.banglaName} 
                    category={product.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-stone-900">ফসল পরিচিতি ও গুণাগুণ</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
                    🔍 <strong>ল্যাব QC নোট:</strong> {product.qcInspectorNotes}
                  </div>
                </div>

                {/* Farmer Profile Card with Rating & Badge */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#14532D] text-[#FBBF24] flex items-center justify-center font-black text-xl">
                      {farmer.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-900">{farmer.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>{farmer.village}, {farmer.upazila}, {farmer.district}</span>
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-stone-600">
                        <span>⭐ {farmer.rating} ({farmer.ratingsCount} রিভিউ)</span>
                        <span>•</span>
                        <span>{farmer.landAcres} একর জমি</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold font-mono">
                    ১০০% ভেরিফাইড কৃষক
                  </span>
                </div>
              </div>

              {/* Right: Leaflet Map & Purchase Card */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Price & Cart Card */}
                <div className="p-6 rounded-3xl bg-linear-to-b from-stone-50 to-white border-2 border-stone-200 shadow-md space-y-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-[#14532D]">৳ {product.pricePerKg}</span>
                      <span className="text-xs text-stone-500"> /কেজি</span>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-stone-400 line-through">সরকারি দর: ৳{product.govPrice}</span>
                      <span className="block text-emerald-700 font-bold">সাশ্রয়: ৳{product.govPrice - product.pricePerKg}/কেজি</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-stone-700">
                      পরিমাণ নির্বাচন করুন (সর্বনিম্ন {product.minOrderKg} কেজি):
                    </label>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedQty((q) => Math.max(product.minOrderKg, q - 5))}
                        className="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 font-bold hover:bg-stone-300 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-bold text-lg text-stone-900 border border-stone-200 py-2 rounded-xl bg-white">
                        {selectedQty} কেজি
                      </div>
                      <button
                        onClick={() => setSelectedQty((q) => q + 5)}
                        className="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 font-bold hover:bg-stone-300 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex justify-between text-xs text-stone-500 font-mono">
                      <span>মজুদ অবশিষ্ট: {product.quantityKg} কেজি</span>
                      <span>={(selectedQty / 40).toFixed(1)} মণ</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
                    <span>সর্বমোট ফসল মূল্য:</span>
                    <span className="text-xl text-[#14532D]">৳ {(selectedQty * product.pricePerKg).toLocaleString("bn-BD")}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, selectedQty);
                      onClose();
                      setActiveModal("CHECKOUT");
                    }}
                    className="w-full py-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#14532D]/20 transition-all hover:scale-102 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5 text-[#FBBF24]" />
                    <span>অর্ডারের জন্য ব্যাগে যুক্ত করুন</span>
                  </button>
                </div>

                {/* Leaflet Map: Farm Location in Jamalpur */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>খামারের সঠিক অবস্থান (Jamalpur OpenStreetMap)</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">GPS Verified</span>
                  </div>
                  <div 
                    ref={mapContainerRef} 
                    className="w-full h-52 rounded-2xl border border-stone-300 overflow-hidden shadow-inner"
                  />
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: BLOCKCHAIN TRACEABILITY TIMELINE */}
          {activeTab === "TRACEABILITY" && (
            <div className="max-w-3xl mx-auto space-y-8 py-4">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold font-mono">
                  Polygon Smart Contract Verified: {product.qrCodeToken}
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  বীজ থেকে ডাইনিং টেবিল: সম্পূর্ণ অপরিবর্তনীয় জার্নি
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  প্রতিটি কৃষি কার্যক্রমে উপজেলা কৃষি কর্মকর্তা ও ল্যাব সেন্টারের ডিজিটাল ক্রিপ্টোগ্রাফিক সিলমোহর।
                </p>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
                {product.traceability.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-8 top-1 w-7 h-7 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-md">
                      {idx + 1}
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-base text-stone-900">{step.banglaTitle}</h4>
                        <span className="text-xs text-[#D97706] font-bold font-mono bg-amber-50 px-2 py-0.5 rounded-md">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600">{step.description}</p>
                      
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500 font-mono gap-2">
                        <span>স্থান: {step.location}</span>
                        <span className="text-emerald-700 font-semibold">ভেরিফায়ার: {step.verifiedBy}</span>
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded-sm">Tx: {step.txHash}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 text-white text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScanQrCode className="w-5 h-5 text-[#FBBF24]" />
                  <span>ডিজিটাল কিউআর কোড টোকেন: <strong>{product.qrCodeToken}</strong></span>
                </div>
                <button
                  onClick={() => setActiveModal("TRACEABILITY_QR")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  কিউআর কোড স্ক্যান করুন
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PRICE HISTORY GRAPH & AI PREDICTION (RECHARTS) */}
          {activeTab === "PRICE_HISTORY" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    গত ৩০ দিনের বাজারদর ও আগামী ৭ দিনের সম্ভাব্য দাম (Moving Average)
                  </h3>
                  <p className="text-xs text-stone-500">
                    জামালপুর পাইকারি আড়ত, সরকারি গেজেট ও কৃষিলিংক এআই এলগরিদম ভিত্তিক তথ্য।
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#14532D]"></span>
                    <span>পূর্ববর্তী দাম (টাকা)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#D97706] animate-pulse"></span>
                    <span>এআই পূর্বাভাস (টাকা)</span>
                  </div>
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className="h-80 w-full bg-white p-4 rounded-3xl border border-stone-200">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14532D" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#14532D" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} unit="৳" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "12px", fontSize: "12px" }} 
                      formatter={(val: any) => [`৳${val}/কেজি`, "দাম"]}
                    />
                    <Area type="monotone" dataKey="historical" stroke="#14532D" strokeWidth={3} fillOpacity={1} fill="url(#colorHist)" name="ঐতিহাসিক দর" />
                    <Area type="monotone" dataKey="predicted" stroke="#D97706" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" name="AI পূর্বাভাস" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <strong>এআই ভবিষ্যৎ বিশ্লেষণ:</strong> আসন্ন দুর্গাপূজা ও আগামী সপ্তাহের বৃষ্টির সতর্কতার কারণে বাজারে আলুর পাইকারি সরবরাহ কমে দাম আরও ২-৩ টাকা বাড়তে পারে। এখনই কেনা বুদ্ধিমানের কাজ।
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
