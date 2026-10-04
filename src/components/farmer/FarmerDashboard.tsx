import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCategory, OrderStatus } from "../../types";
import { DiseaseDetector } from "./DiseaseDetector";
import { WeatherAlertBanner } from "./WeatherAlertBanner";
import { YieldForecaster } from "./YieldForecaster";
import { RegionalPestMap } from "./RegionalPestMap";
import { 
  CloudRain, 
  Mic, 
  MicOff, 
  PlusCircle, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  ThermometerSnowflake, 
  MessageSquare, 
  Sparkles, 
  Scan, 
  ChevronRight, 
  ArrowRight,
  Layers,
  MapPin,
  Calendar,
  Volume2,
  Wallet,
  DollarSign,
  Building2,
  Radio,
  ShieldCheck,
  Radar
} from "lucide-react";

export const FarmerDashboard: React.FC = () => {
  const { 
    currentUser, 
    lang, 
    products, 
    orders, 
    addProduct, 
    updateOrderStatus, 
    setActiveModal,
    setSelectedProductId 
  } = useApp();

  // Tab state within farmer portal
  const [activeSubTab, setActiveSubTab] = useState<
    "OVERVIEW" | "YIELD_FORECAST" | "PEST_MAP" | "DISEASE_VISION" | "ADD_PRODUCT" | "ORDERS_KANBAN" | "INVENTORY" | "WALLET"
  >("OVERVIEW");

  // KrishiPay Wallet state
  const [walletBalance, setWalletBalance] = useState(12450);
  const [escrowLocked, setEscrowLocked] = useState(38500);
  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [withdrawMethod, setWithdrawMethod] = useState<"BKASH" | "NAGAD" | "BANK">("BKASH");
  const [withdrawAlert, setWithdrawAlert] = useState<string | null>(null);

  // Add Product Form State
  const [name, setName] = useState<string>("");
  const [banglaName, setBanglaName] = useState<string>("");
  const [category, setCategory] = useState<ProductCategory>("ALU");
  const [variety, setVariety] = useState<string>("Diamond Grade-1");
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [pricePerKg, setPricePerKg] = useState<number>(30);
  const [minOrderKg, setMinOrderKg] = useState<number>(20);
  const [harvestDate, setHarvestDate] = useState<string>("2026-10-02");
  const [isOrganic, setIsOrganic] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("জামালপুর সদর থেকে খেত থেকে সরাসরি তোলা বিষমুক্ত টাটকা ফসল।");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");

  // Live stock alert
  const lowStockItem = products.find((p) => p.farmerId === currentUser.id && p.quantityKg < 100);

  // Web Speech API Voice Input
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      // Graceful fallback simulation if browser Web Speech is unavailable
      setVoiceTranscript("৫০ কেজি আলু ৩০ টাকা");
      setName("Diamond Potato (Alu)");
      setBanglaName("টাটকা ডায়মন্ড আলু");
      setCategory("ALU");
      setQuantityKg(50);
      setPricePerKg(30);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript(lang === "bn" ? "শুনছি... বলুন: যেমন '৫০ কেজি আলু ৩০ টাকা'" : "Listening in Bangla...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setIsListening(false);

      // Intelligent parser for Bangla agri voice input:
      // "৫০ কেজি আলু ৩০ টাকা" -> 50kg, potato, 30 taka
      if (transcript.includes("আলু")) {
        setCategory("ALU");
        setName("Fresh Diamond Potato");
        setBanglaName("টাটকা ডায়মন্ড আলু");
      } else if (transcript.includes("ধান")) {
        setCategory("DHAN");
        setName("Jamalpur Boro Dhan");
        setBanglaName("জামালপুর বোরো ধান");
      } else if (transcript.includes("মরিচ")) {
        setCategory("MORICH");
        setName("Hot Red Chili");
        setBanglaName("মেলান্দহের শুকনা মরিচ");
      } else if (transcript.includes("বেগুন")) {
        setCategory("BEGUN");
        setName("Deshi Gol Begun");
        setBanglaName("দেশি গোল বেগুন");
      }

      // Extract numbers
      const numbers = transcript.match(/\d+/g);
      if (numbers && numbers.length >= 1) {
        setQuantityKg(Number(numbers[0]));
      }
      if (numbers && numbers.length >= 2) {
        setPricePerKg(Number(numbers[1]));
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      // fallback preset
      setName("Fresh Diamond Potato");
      setBanglaName("টাটকা ডায়মন্ড আলু");
      setCategory("ALU");
      setQuantityKg(50);
      setPricePerKg(30);
      setVoiceTranscript("৫০ কেজি আলু ৩০ টাকা (ভয়েস অটোফিল সম্পন্ন)");
    };

    recognition.start();
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name,
      banglaName: banglaName || name,
      category,
      variety,
      quantityKg,
      minOrderKg,
      pricePerKg,
      govPrice: pricePerKg + 3,
      histAvgPrice: pricePerKg + 2,
      harvestDate,
      isOrganic,
      isQcApproved: false, // Goes to Admin QC first
      qcInspectorNotes: "Pending QC Inspection from Jamalpur Office",
      images: [
        category === "DHAN"
          ? "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
          : category === "ALU"
          ? "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
          : category === "MORICH"
          ? "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80"
      ],
      shelfLifeDays: category === "DHAN" ? 365 : category === "ALU" ? 90 : 7,
      district: currentUser.district,
      upazila: currentUser.upazila,
      description,
    });

    // Reset and switch
    setName("");
    setBanglaName("");
    setActiveSubTab("INVENTORY");
  };

  // Farmer's orders
  const myOrders = orders;

  const kanbanColumns: { status: OrderStatus; label: string; badgeColor: string }[] = [
    { status: "NEW", label: "নতুন অর্ডার (New)", badgeColor: "bg-blue-100 text-blue-800" },
    { status: "ACCEPTED", label: "গৃহীত (Accepted)", badgeColor: "bg-amber-100 text-amber-800" },
    { status: "PACKED", label: "প্যাকিং সম্পন্ন (Packed)", badgeColor: "bg-purple-100 text-purple-800" },
    { status: "SHIPPED", label: "ট্রাকে রওনা (Shipped)", badgeColor: "bg-indigo-100 text-indigo-800" },
    { status: "DELIVERED", label: "ডেলিভার্ড (Delivered)", badgeColor: "bg-emerald-100 text-emerald-800" },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Low-Literate Accessible Farmer Welcome Header */}
      <div className="rounded-3xl bg-linear-to-r from-[#14532D] to-[#0A2F18] p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FBBF24] text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                ভেরিফাইড কৃষক
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FBBF24]" />
              <span>{currentUser.farmName || "কেন্দুয়া সোনালী কৃষি খামার"}, {currentUser.upazila}, {currentUser.district}</span>
            </p>
          </div>
        </div>

        {/* Quick Voice / Disease Diagnostic Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveSubTab("ADD_PRODUCT")}
            className="px-5 py-3 rounded-2xl bg-[#FBBF24] hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{lang === "bn" ? "ভয়েসে ফসল যুক্ত করুন" : "Add Crop by Voice"}</span>
          </button>

          <button
            onClick={() => setActiveModal("COLD_STORAGE")}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <ThermometerSnowflake className="w-4 h-4 text-cyan-300" />
            <span>{lang === "bn" ? "কোল্ড স্টোরেজ বুকিং" : "Cold Storage"}</span>
          </button>

          <button
            onClick={() => setActiveModal("BARGAINING")}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>{lang === "bn" ? "দরদাম চ্যাট (১)" : "Bargaining (1)"}</span>
          </button>
        </div>
      </div>

      {/* 2. THREE KEY WIDGETS FOR LOW-LITERATE FARMERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Widget 1: Ajker Aay */}
        <div 
          onClick={() => setActiveSubTab("WALLET")}
          className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
        >
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 group-hover:text-[#14532D]">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === "bn" ? "কৃষি-পে ওয়ালেট ও আয়" : "KrishiPay™ Wallet"}</span>
            </span>
            <div className="text-3xl font-black font-mono text-[#14532D] mt-1">
              ৳ {walletBalance.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              ক্লিক করে সরাসরি উত্তোলন বা এস্ক্রো দেখুন &rarr;
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            ৳
          </div>
        </div>

        {/* Widget 2: Mot Order */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {lang === "bn" ? "চলতি মোট অর্ডার" : "Active Orders"}
            </span>
            <div className="text-3xl font-black text-stone-900 mt-1">{myOrders.length} টি</div>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              ২টি অর্ডার প্যাক করার অপেক্ষায়
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Widget 3: Low Stock Alert */}
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "স্টক শেষ হতে চলেছে!" : "Low Stock Alert"}</span>
            </span>
            <div className="text-xl font-black text-red-950 mt-1">
              {lowStockItem ? lowStockItem.banglaName : "দেশি গোল বেগুন"}
            </div>
            <p className="text-xs text-red-800 mt-1">
              মাত্র ২০ কেজি বাকি। দ্রুত নতুন লট যুক্ত করুন।
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-200 text-red-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. WEATHER FORECAST & RED ALERT BANNER (JAMALPUR REGION - OpenWeather Grounded) */}
      <WeatherAlertBanner />

      {/* 4. SUB-TABS: OVERVIEW | YIELD FORECAST | PEST RADAR | DISEASE VISION | ADD PRODUCT | ORDERS | INVENTORY | WALLET */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("OVERVIEW")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeSubTab === "OVERVIEW"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          📊 সামগ্রিক ড্যাশবোর্ড
        </button>

        <button
          onClick={() => setActiveSubTab("YIELD_FORECAST")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeSubTab === "YIELD_FORECAST"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>📈 ফলন পূর্বাভাস (Yield Forecast)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("PEST_MAP")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeSubTab === "PEST_MAP"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Radar className="w-3.5 h-3.5 text-red-500" />
          <span>🚨 পোকা আক্রমণ ম্যাপ (Pest Radar)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("DISEASE_VISION")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeSubTab === "DISEASE_VISION"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>🔬 শস্য রোগ নির্ণয় ল্যাব (১১টি শস্য)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ADD_PRODUCT")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeSubTab === "ADD_PRODUCT"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          ➕ নতুন ফসল যুক্ত করুন
        </button>

        <button
          onClick={() => setActiveSubTab("ORDERS_KANBAN")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeSubTab === "ORDERS_KANBAN"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          📋 অর্ডার কানবান ({myOrders.length})
        </button>

        <button
          onClick={() => setActiveSubTab("INVENTORY")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeSubTab === "INVENTORY"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          📦 স্টক ইনভেন্টরি
        </button>

        <button
          onClick={() => setActiveSubTab("WALLET")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeSubTab === "WALLET"
              ? "bg-[#14532D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>💳 কৃষি-পে ওয়ালেট</span>
        </button>
      </div>

      {/* TAB 1: ADD PRODUCT WITH SMART PRICE & BANGLA VOICE */}
      {activeSubTab === "ADD_PRODUCT" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-xl font-bold text-stone-900">নতুন শস্য বা ফসল তালিকায় যুক্ত করুন</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                মুখে বলুন অথবা নিচে তথ্য দিন। স্বয়ংক্রিয় এআই প্রাইস অ্যানালাইসিস আপনাকে দ্রুত বিক্রির দর জানাবে।
              </p>
            </div>

            {/* Bangla Voice Trigger */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all shadow-md cursor-pointer ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-amber-500 hover:bg-amber-600 text-stone-950"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? "শুনছি... (বলুন)" : "মাইক্রোফোনে বলুন (ভয়েস)"}</span>
            </button>
          </div>

          {voiceTranscript && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>🎙️ শেষ ভয়েস সনাক্তকরণ: <strong>"{voiceTranscript}"</strong></span>
              <span className="font-mono text-emerald-700 font-bold">Auto-filled</span>
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ফসলের নাম (বাংলায়):</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: টাটকা ডায়মন্ড গোল আলু"
                  value={banglaName}
                  onChange={(e) => {
                    setBanglaName(e.target.value);
                    if (!name) setName(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#14532D] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">শস্য বিভাগ (Category):</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-[#14532D] outline-hidden font-medium"
                >
                  <option value="ALU">আলু (Potato)</option>
                  <option value="DHAN">ধান ও চাল (Paddy & Rice)</option>
                  <option value="BEGUN">বেগুন (Brinjal)</option>
                  <option value="POTOL">পটল (Pointed Gourd)</option>
                  <option value="MORICH">শুকনা ও কাঁচামরিচ (Chili)</option>
                  <option value="PEYAJ">পেঁয়াজ ও রসুন (Onion/Garlic)</option>
                  <option value="MACH">মাছ (Live Fish)</option>
                  <option value="SHOBJI">শাকসবজি (Vegetables)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">মোট পরিমাণ (কেজি):</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-[#14532D] outline-hidden"
                />
                <span className="text-[11px] text-stone-400 font-mono mt-0.5 block">
                  ={(quantityKg / 40).toFixed(1)} মণ
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">আপনার চাওয়া দাম (৳/কেজি):</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold text-[#14532D] focus:ring-2 focus:ring-[#14532D] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ফসল তোলার তারিখ:</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#14532D] outline-hidden"
                />
              </div>
            </div>

            {/* SMART PRICE SUGGESTION WIDGET - Explicitly requested */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
                <span className="font-bold text-xs sm:text-sm text-[#14532D]">
                  কৃষিলিংক এআই বাজারদর বিশ্লেষণ (Jamalpur Sadar Mandi):
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                গত ৭ দিনে জামালপুরে আলুর গড় দাম ছিল <strong>৩২ টাকা/কেজি</strong>, সরকারি নির্ধারিত দাম <strong>৩৩ টাকা</strong>।
                আপনি <strong>৳৩০ টাকা/কেজি</strong> নির্ধারণ করায় ৯২% দ্রুত বিক্রি হওয়ার সম্ভাবনা রয়েছে!
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-emerald-800">
                <span>সরকারি দাম: ৳৩৩</span>
                <span>•</span>
                <span>আড়তদার কেনে: ৳২৫</span>
                <span>•</span>
                <span className="font-bold text-[#14532D]">আপনার নিট লাভ: +৳৫/কেজি বেশি</span>
              </div>
            </div>

            {/* Organic & Certified check */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <input
                type="checkbox"
                id="isOrganicCheck"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                className="w-4 h-4 text-[#14532D] rounded-sm focus:ring-[#14532D]"
              />
              <label htmlFor="isOrganicCheck" className="text-xs font-bold text-stone-700 cursor-pointer">
                শতভাগ বিষমুক্ত / ভার্মিকম্পোস্ট জৈব পদ্ধতিতে উৎপাদিত (Organic Certified)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-base shadow-xl transition-all cursor-pointer"
            >
              ফসল যুক্ত করুন ও QC অনুমোদনের জন্য পাঠান
            </button>

          </form>

        </div>
      )}

      {/* TAB 2: ORDERS KANBAN BOARD (Trello-style drag & drop state advance) */}
      {activeSubTab === "ORDERS_KANBAN" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-stone-900">
              অর্ডার কানবান বোর্ড (Live Order Dispatch Flow)
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              ক্লিক করে পরবর্তী ধাপে এগিয়ে দিন
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((col) => {
              const columnOrders = myOrders.filter((o) => o.status === col.status);
              return (
                <div key={col.status} className="bg-stone-100 rounded-2xl p-4 flex flex-col min-h-[420px] border border-stone-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
                    <span className="font-bold text-xs text-stone-800">{col.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeColor}`}>
                      {columnOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-[#14532D]">{ord.orderNumber}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div>
                          <p className="font-bold text-stone-800">{ord.buyerName}</p>
                          <p className="text-[11px] text-stone-500 truncate">{ord.deliveryAddress}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-bold">
                          <span className="text-stone-900">৳ {ord.grandTotal}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </div>

                        {/* Advance button */}
                        {col.status !== "DELIVERED" && col.status !== "CANCELLED" && (
                          <button
                            onClick={() => {
                              const nextMap: Record<OrderStatus, OrderStatus> = {
                                NEW: "ACCEPTED",
                                ACCEPTED: "PACKED",
                                PACKED: "SHIPPED",
                                SHIPPED: "DELIVERED",
                                DELIVERED: "DELIVERED",
                                CANCELLED: "CANCELLED",
                              };
                              updateOrderStatus(ord.id, nextMap[ord.status]);
                            }}
                            className="w-full mt-2 py-1.5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>পরবর্তী ধাপ</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {columnOrders.length === 0 && (
                      <div className="h-32 flex items-center justify-center text-[11px] text-stone-400 italic">
                        কোনো অর্ডার নেই
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeSubTab === "INVENTORY" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-stone-900">আমার খামারের মোট ফসল ও ইনভেন্টরি</h3>
            <span className="text-xs text-stone-500 font-mono">
              অর্ডার হলে স্বয়ংক্রিয়ভাবে স্টক কমে যাবে
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider text-[11px] font-bold border-b">
                <tr>
                  <th className="py-3 px-4">ফসলের নাম</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4">বর্তমান মজুদ</th>
                  <th className="py-3 px-4">দর (৳/কেজি)</th>
                  <th className="py-3 px-4">QC স্ট্যাটাস</th>
                  <th className="py-3 px-4">ট্রেসেবিলিটি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.filter((p) => p.farmerId === currentUser.id || currentUser.role === "ADMIN").map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-stone-900 block">{prod.banglaName}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{prod.variety}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">{prod.category}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className={prod.quantityKg < 100 ? "text-red-600 font-black" : "text-stone-800"}>
                        {prod.quantityKg} কেজি
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#14532D]">৳{prod.pricePerKg}</td>
                    <td className="py-3 px-4">
                      {prod.isQcApproved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          ✅ অনুমোদিত
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          ⏳ QC অপেক্ষারত
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setActiveModal("TRACEABILITY_QR");
                        }}
                        className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                      >
                        QR কোড দেখুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OVERVIEW DEFAULT: INCLUDES AI DISEASE DETECTOR DIRECTLY ACCESSIBLE */}
      {activeSubTab === "OVERVIEW" && (
        <div className="space-y-8">
          <DiseaseDetector />
        </div>
      )}

    </div>
  );
};
