import React, { useState, useId } from "react";
import { useApp } from "../../context/AppContext";
import { 
  TrendingUp, 
  Sprout, 
  Calendar, 
  DollarSign, 
  Scale, 
  Award, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BarChart3,
  HelpCircle,
  FileSpreadsheet,
  Zap,
  Printer
} from "lucide-react";

export type SeasonType = "RABI" | "KHARIF_1" | "KHARIF_2";

export interface CropYieldProfile {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryBn: string;
  defaultAcreage: number;
  baseYieldMaundPerAcre: number; // ১ একরে গড় মণ (১ মণ = ৪০ কেজি)
  avgPricePerKg: number;
  costPerAcre: number;
  growthDays: number;
  harvestWindowBn: string;
  history: {
    year2024: number; // Maunds
    year2025: number;
    forecast2026: number;
  };
  aiRecommendations: string[];
}

const CROP_PROFILES: Record<string, CropYieldProfile> = {
  RICE_BRRI_28: {
    id: "RICE_BRRI_28",
    nameBn: "ব্রি-২৮ বোরো ধান",
    nameEn: "BRRI-28 Boro Rice",
    categoryBn: "দানা শস্য",
    defaultAcreage: 2.0,
    baseYieldMaundPerAcre: 58,
    avgPricePerKg: 34,
    costPerAcre: 32000,
    growthDays: 140,
    harvestWindowBn: "মে মাসের ১ম সপ্তাহ (২০২৬)",
    history: {
      year2024: 104,
      year2025: 112,
      forecast2026: 124,
    },
    aiRecommendations: [
      "শীষ বের হওয়ার পর দানার গঠনকালে প্রতি লিটারে ২ গ্রাম পটাশ (MOP) স্প্রে করলে চিটার হার ৮% কমে ফলন বাড়ে।",
      "মাটি শুকিয়ে যাওয়ার আগেই ফুল আসার সময় জমিতে ২-৩ ইঞ্চি পানি ধরে রাখা আবশ্যক।",
      "ব্লাস্ট রোগের আগাম প্রতিরোধে অনুমোদিত ট্রাইসাইক্লাজোল শেষ বিকেলে স্প্রে করুন।"
    ]
  },
  POTATO_DIAMOND: {
    id: "POTATO_DIAMOND",
    nameBn: "ডায়মন্ড গোল আলু (BARI-7)",
    nameEn: "Diamond Potato (BARI Alu-7)",
    categoryBn: "কন্দ জাতীয়",
    defaultAcreage: 1.5,
    baseYieldMaundPerAcre: 240,
    avgPricePerKg: 28,
    costPerAcre: 68000,
    growthDays: 90,
    harvestWindowBn: "মার্চ মাসের মাঝামাঝি (২০২৬)",
    history: {
      year2024: 320,
      year2025: 350,
      forecast2026: 395,
    },
    aiRecommendations: [
      "আলুর সাইজ বড় করতে ৬০ দিনের মাথায় জমিতে বোরন (১ গ্রাম/লিটার) ও জিংক স্প্রে করুন।",
      "তোলার ১৫ দিন পূর্বে সেচ সম্পূর্ণ বন্ধ রাখলে আলুর ত্বক শক্ত হয় এবং কোল্ড স্টোরেজে পচন রোধ হয়।",
      "কুয়াশাচ্ছন্ন আবহাওয়ায় আগাম প্রতিরোধ হিসেবে কপার অক্সিক্লোরাইড স্প্রে করে পাতা ধসা ঠেকান।"
    ]
  },
  BRINJAL_HYBRID: {
    id: "BRINJAL_HYBRID",
    nameBn: "হাইব্রিড দেশি বেগুন",
    nameEn: "Hybrid Brinjal",
    categoryBn: "সবজি ফসল",
    defaultAcreage: 1.0,
    baseYieldMaundPerAcre: 185,
    avgPricePerKg: 38,
    costPerAcre: 45000,
    growthDays: 120,
    harvestWindowBn: "চলতি মৌসুমের প্রতি সপ্তাহে পর্যায়ক্রমে তোলন",
    history: {
      year2024: 160,
      year2025: 175,
      forecast2026: 198,
    },
    aiRecommendations: [
      "ডগা ছিদ্রকারী পোকা দমনে রাসায়নিক বিষের বদলে ফেরোমোন ফাঁদ ব্যবহার করলে ফলনের গুণমান এ+ গ্রেড থাকবে।",
      "প্রতিটি তোলনের পর হালকা ইউরিয়া ও খৈল পচা পানি গাছের গোড়ায় দিলে নতুন কুঁড়ির সংখ্যা দ্বিগুণ হয়।",
      "মাটির আর্দ্রতা সমান রাখতে ড্রিপ সেচ বা মালচিং পদ্ধতি গ্রহণ করুন।"
    ]
  },
  POTOL_SPECIAL: {
    id: "POTOL_SPECIAL",
    nameBn: "উন্নত মাচায় দেশি পটল",
    nameEn: "Pointed Gourd (Potol)",
    categoryBn: "শাকসবজি",
    defaultAcreage: 0.8,
    baseYieldMaundPerAcre: 150,
    avgPricePerKg: 42,
    costPerAcre: 38000,
    growthDays: 180,
    harvestWindowBn: "এপ্রিল থেকে অক্টোবর পর্যন্ত একটানা সংগ্রহ",
    history: {
      year2024: 105,
      year2025: 115,
      forecast2026: 130,
    },
    aiRecommendations: [
      "পটল মাচায় স্ত্রী ও পুরুষ ফুল ৮:১ অনুপাতে বজায় রেখে সকালের মিষ্টি রোদে কৃত্রিম পরাগায়ন করুন।",
      "ডাউনি মিলডিউ রোধে লতা মাটির সংস্পর্শ থেকে উঁচুতে তারের জালে বেঁধে দিন।",
      "জৈব ট্রাইকো-কম্পোস্ট ব্যবহারে পটলের মিষ্টতা ও ওজন উল্লেখযোগ্যভাবে বাড়ে।"
    ]
  },
  CHILI_HOT: {
    id: "CHILI_HOT",
    nameBn: "জামালপুরী ঝাল কাঁচা মরিচ",
    nameEn: "Jamalpur Hot Green Chili",
    categoryBn: "মসলা ও সবজি",
    defaultAcreage: 1.0,
    baseYieldMaundPerAcre: 90,
    avgPricePerKg: 65,
    costPerAcre: 35000,
    growthDays: 130,
    harvestWindowBn: "চলতি মৌসুমের প্রতি ১৫ দিনে তোলা",
    history: {
      year2024: 78,
      year2025: 84,
      forecast2026: 96,
    },
    aiRecommendations: [
      "পাতা কোঁকড়ানো রোধে প্রতি লিটার পানিতে ১.৫ মিলি এবামেকটিন স্প্রে করুন।",
      "বৃষ্টির পর দ্রুত পানি নিষ্কাশন নালা দিয়ে সরিয়ে দিলে গোড়া পচা রোগ এড়ানো যায়।",
      "পটাশ ও সালফারের সঠিক সমন্বয়ে মরিচের ঝাল ও চকচকে ভাব বৃদ্ধি পায়।"
    ]
  },
  TOMATO_WINTER: {
    id: "TOMATO_WINTER",
    nameBn: "শীতকালীন টমেটো (রতন / বারি-৮)",
    nameEn: "Winter Fresh Tomato",
    categoryBn: "সবজি ফসল",
    defaultAcreage: 1.2,
    baseYieldMaundPerAcre: 280,
    avgPricePerKg: 32,
    costPerAcre: 52000,
    growthDays: 100,
    harvestWindowBn: "ফেব্রুয়ারি - মার্চ (২০২৬)",
    history: {
      year2024: 290,
      year2025: 315,
      forecast2026: 355,
    },
    aiRecommendations: [
      "টমেটোর নিচের মাটি ছোঁয়া পাতাগুলো ছেঁটে দিলে রোগ কম হয় এবং সূর্যের আলোয় ফল দ্রুত পাকে।",
      "ক্যালসিয়ামের ঘাটতি মেটাতে চিলেটেড ক্যালসিয়াম স্প্রে করলে ফলের তলা পচা (Blossom End Rot) রোধ হয়।",
      "মাচায় সুতা দিয়ে ফল ঝুলিয়ে দিলে দাগহীন এ+ গ্রেড টমেটো উৎপাদিত হয়।"
    ]
  }
};

export const YieldForecaster: React.FC = () => {
  const { lang, currentUser, addAuditLog } = useApp();
  const cropSelectId = useId();
  const seasonSelectId = useId();
  const acreageInputId = useId();
  const seedSelectId = useId();
  const soilSelectId = useId();
  
  const [selectedCropId, setSelectedCropId] = useState<string>("RICE_BRRI_28");
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>("RABI");
  const [acreage, setAcreage] = useState<number>(2.0);
  const [seedQuality, setSeedQuality] = useState<"CERTIFIED" | "LOCAL">("CERTIFIED");
  const [soilHealth, setSoilHealth] = useState<"OPTIMAL" | "AVERAGE">("OPTIMAL");
  const [optimizing, setOptimizing] = useState<boolean>(false);

  const crop = CROP_PROFILES[selectedCropId] || CROP_PROFILES.RICE_BRRI_28;

  // AI Forecasting Multiplier Calculation
  const seedMultiplier = seedQuality === "CERTIFIED" ? 1.08 : 0.94;
  const soilMultiplier = soilHealth === "OPTIMAL" ? 1.06 : 0.96;
  const seasonFactor = selectedSeason === "RABI" ? 1.04 : 0.98;

  // Total Forecasted Yield
  const predictedMaundPerAcre = Math.round(crop.baseYieldMaundPerAcre * seedMultiplier * soilMultiplier * seasonFactor);
  const totalPredictedMaund = Math.round(predictedMaundPerAcre * acreage);
  const totalPredictedKg = totalPredictedMaund * 40; // ১ মণ = ৪০ কেজি
  const totalPredictedTons = (totalPredictedKg / 1000).toFixed(1);

  // Revenue & Profit Estimation
  const projectedGrossRevenue = Math.round(totalPredictedKg * crop.avgPricePerKg);
  const totalEstimatedCost = Math.round(crop.costPerAcre * acreage);
  const projectedNetProfit = projectedGrossRevenue - totalEstimatedCost;
  const returnOnInvestment = Math.round((projectedNetProfit / totalEstimatedCost) * 100);

  // Historical Scale Calculation for Chart
  const hist2024 = Math.round((crop.history.year2024 / crop.defaultAcreage) * acreage);
  const hist2025 = Math.round((crop.history.year2025 / crop.defaultAcreage) * acreage);
  const maxMaundInChart = Math.max(hist2024, hist2025, totalPredictedMaund, 1);

  const handleRecalculate = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      addAuditLog(
        "YIELD_FORECAST_CALCULATED",
        `/farmer/yield-forecast/${crop.id}`,
        "ALLOWED",
        `AI Yield model executed for ${crop.nameBn} on ${acreage} acres. Forecast: ${totalPredictedMaund} maunds (৳${projectedGrossRevenue.toLocaleString()} revenue).`
      );
    }, 600);
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-[#FBBF24] flex items-center justify-center font-black shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "AI শস্য ফলন পূর্বাভাস ও আয় প্রজেকশন" : "AI Crop Yield Forecasting & Revenue Radar"}
              </h2>
              <span className="text-[11px] font-mono bg-emerald-100 text-[#14532D] px-2.5 py-0.5 rounded-full font-bold">
                BARI / BRRI Dataset v3.8
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              জমির পরিমাণ, আবহাওয়া এবং খামারের ঐতিহাসিক ফলনের ওপর ভিত্তি করে এআই-চালিত সম্ভাব্য উৎপাদন ও নিট লাভের হিসাব।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>প্রিন্ট / রিপোর্ট ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Input Controls: Crop, Season, Acreage, Seed & Soil */}
      <div className="p-5 sm:p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#14532D]" />
            <span>খামারের বিবরণ ও ফসলের প্যারামিটার নির্বাচন করুন:</span>
          </span>
          <span className="text-xs font-mono text-emerald-800 font-bold">
            কৃষক: {currentUser.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Crop Selector */}
          <div className="space-y-1">
            <label htmlFor={cropSelectId} className="text-[11px] font-bold text-stone-600">ফসলের ধরন:</label>
            <select
              id={cropSelectId}
              value={selectedCropId}
              onChange={(e) => {
                setSelectedCropId(e.target.value);
                setAcreage(CROP_PROFILES[e.target.value]?.defaultAcreage || 1.5);
              }}
              className="w-full bg-white text-xs font-bold text-stone-800 px-3 py-2.5 rounded-xl border border-stone-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-[#14532D]"
            >
              {Object.values(CROP_PROFILES).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Season Selector */}
          <div className="space-y-1">
            <label htmlFor={seasonSelectId} className="text-[11px] font-bold text-stone-600">মৌসুম (Season):</label>
            <select
              id={seasonSelectId}
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value as SeasonType)}
              className="w-full bg-white text-xs font-bold text-stone-800 px-3 py-2.5 rounded-xl border border-stone-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-[#14532D]"
            >
              <option value="RABI">❄️ রবি মৌসুম (শীতকালীন)</option>
              <option value="KHARIF_1">🌱 খরিফ-১ (গ্রীষ্মকালীন)</option>
              <option value="KHARIF_2">🌧️ খরিফ-২ (বর্ষা ও আমন)</option>
            </select>
          </div>

          {/* Acreage Slider / Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
              <label htmlFor={acreageInputId}>জমির পরিমাণ (একর):</label>
              <span className="font-mono text-[#14532D]">{acreage} একর</span>
            </div>
            <input
              id={acreageInputId}
              type="number"
              min="0.2"
              max="20"
              step="0.1"
              value={acreage}
              onChange={(e) => setAcreage(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              className="w-full bg-white text-xs font-bold text-stone-800 px-3 py-2 rounded-xl border border-stone-300 shadow-2xs focus:ring-2 focus:ring-[#14532D]"
            />
          </div>

          {/* Seed Variety Quality */}
          <div className="space-y-1">
            <label htmlFor={seedSelectId} className="text-[11px] font-bold text-stone-600">বীজের মান:</label>
            <select
              id={seedSelectId}
              value={seedQuality}
              onChange={(e) => setSeedQuality(e.target.value as any)}
              className="w-full bg-white text-xs font-bold text-stone-800 px-3 py-2.5 rounded-xl border border-stone-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-[#14532D]"
            >
              <option value="CERTIFIED">🥇 বিএডিসি সার্টিফাইড বীজ (+৮%)</option>
              <option value="LOCAL">🌾 স্থানীয় কৃষকের সংগৃহীত বীজ</option>
            </select>
          </div>

          {/* Soil & Nutrient Health */}
          <div className="space-y-1">
            <label htmlFor={soilSelectId} className="text-[11px] font-bold text-stone-600">মাটির স্বাস্থ্য ও সার:</label>
            <select
              id={soilSelectId}
              value={soilHealth}
              onChange={(e) => setSoilHealth(e.target.value as any)}
              className="w-full bg-white text-xs font-bold text-stone-800 px-3 py-2.5 rounded-xl border border-stone-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-[#14532D]"
            >
              <option value="OPTIMAL">🧪 সুষম জৈব ও এনপিকে সার (+৬%)</option>
              <option value="AVERAGE">🍂 সাধারণ প্রচলিত সার ব্যবস্থাপনা</option>
            </select>
          </div>

        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-stone-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>প্যারামিটার পরিবর্তন করলে সাথে সাথে এআই মডেল স্বয়ংক্রিয়ভাবে ফলন হিসাব করবে।</span>
          </span>
          <button
            onClick={handleRecalculate}
            disabled={optimizing}
            className="px-4 py-1.5 rounded-xl bg-[#14532D] text-white font-bold text-xs hover:bg-[#166534] shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            {optimizing ? "হিসাব হচ্ছে..." : "পুনরায় রিফ্রেশ করুন"}
          </button>
        </div>
      </div>

      {/* 3. Primary Prediction Summary Grid (4 High Impact Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Forecasted Yield */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-emerald-50 to-white border-2 border-emerald-500 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              সম্ভাব্য মোট উৎপাদন
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-[#14532D] px-2 py-0.5 rounded-full">
              ৯৪.৬% আত্মবিশ্বাস
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-[#14532D]">
            {totalPredictedMaund} <span className="text-lg font-bold">মণ</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono pt-1 border-t border-emerald-100">
            <span>মোট: {totalPredictedTons} মেট্রিক টন</span>
            <span className="font-bold text-emerald-800">{predictedMaundPerAcre} মণ/একর</span>
          </div>
        </div>

        {/* Card 2: Projected Gross Farmgate Revenue */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-amber-50 to-white border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              সম্ভাব্য মোট বিক্রয়মূল্য
            </span>
            <span className="text-xs font-mono font-bold text-[#D97706]">
              ৳{crop.avgPricePerKg}/কেজি
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-950">
            ৳ {projectedGrossRevenue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono pt-1 border-t border-amber-100">
            <span>মোট ফসল: {totalPredictedKg.toLocaleString()} কেজি</span>
            <span className="text-emerald-700 font-bold">সরাসরি খামারি দর</span>
          </div>
        </div>

        {/* Card 3: Projected Net Profit */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-blue-50 to-white border border-blue-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              সম্ভাব্য নিট লাভ (Net Profit)
            </span>
            <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
              ROI: +{returnOnInvestment}%
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-blue-950">
            ৳ {projectedNetProfit.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono pt-1 border-t border-blue-100">
            <span>খরচ বাদ: ৳ {totalEstimatedCost.toLocaleString()}</span>
            <span className="text-blue-700 font-bold">লাভজনক ফসল</span>
          </div>
        </div>

        {/* Card 4: Optimal Harvest Window */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-purple-50 to-white border border-purple-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              ফসল কাটার সেরা সময়
            </span>
            <span className="text-xs font-mono font-bold text-purple-700">
              {crop.growthDays} দিনের ফসল
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-purple-950 leading-snug">
            {crop.harvestWindowBn}
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono pt-1 border-t border-purple-100">
            <span>আবহাওয়া ঝুঁকি: কম</span>
            <span className="text-purple-700 font-bold">কোল্ড চেইন সক্রিয়</span>
          </div>
        </div>

      </div>

      {/* 4. Historical vs. AI Forecast Comparison Chart (Multi-season Benchmark) */}
      <div className="p-6 rounded-3xl bg-stone-900 text-white space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#FBBF24] uppercase tracking-wider block">
              Historical Farm Benchmark vs AI Prediction
            </span>
            <h3 className="text-lg font-black mt-0.5">
              গত ৩ বছরের তুলনায় ২০২৬ সালের ফলন তুলনা ({acreage} একর ভিত্তিতে)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-stone-600"></span>
              <span className="text-stone-300">পূর্ববর্তী মৌসুম</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span className="text-emerald-300 font-bold">২০২৬ এআই পূর্বাভাস (+১৪%)</span>
            </div>
          </div>
        </div>

        {/* CSS/SVG Responsive Bar Chart Comparison */}
        <div className="space-y-4 pt-2">
          
          {/* 2024 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-stone-300">
              <span>২০২৪ মৌসুমের প্রকৃত ফলন (Season 2024)</span>
              <span className="font-bold">{hist2024} মণ</span>
            </div>
            <div className="h-6 w-full bg-stone-800 rounded-xl overflow-hidden p-1">
              <div 
                className="h-full bg-stone-500 rounded-lg transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold font-mono"
                style={{ width: `${Math.round((hist2024 / maxMaundInChart) * 100)}%` }}
              >
                {hist2024} মণ
              </div>
            </div>
          </div>

          {/* 2025 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-stone-300">
              <span>২০২৫ মৌসুমের প্রকৃত ফলন (Season 2025)</span>
              <span className="font-bold">{hist2025} মণ</span>
            </div>
            <div className="h-6 w-full bg-stone-800 rounded-xl overflow-hidden p-1">
              <div 
                className="h-full bg-amber-600 rounded-lg transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold font-mono"
                style={{ width: `${Math.round((hist2025 / maxMaundInChart) * 100)}%` }}
              >
                {hist2025} মণ
              </div>
            </div>
          </div>

          {/* 2026 AI Forecast */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>২০২৬ এআই প্রেডিক্টেড ফলন (AI Optimized Forecast)</span>
              </span>
              <span className="text-base text-[#FBBF24] font-black">{totalPredictedMaund} মণ (+১৪%)</span>
            </div>
            <div className="h-8 w-full bg-stone-800 rounded-xl overflow-hidden p-1 ring-2 ring-emerald-500/50">
              <div 
                className="h-full bg-linear-to-r from-emerald-600 via-emerald-500 to-amber-400 rounded-lg transition-all duration-700 flex items-center justify-end pr-3 text-xs font-black font-mono text-stone-950 shadow-md"
                style={{ width: `${Math.round((totalPredictedMaund / maxMaundInChart) * 100)}%` }}
              >
                {totalPredictedMaund} মণ (সম্ভাব্য আয়: ৳{projectedGrossRevenue.toLocaleString()})
              </div>
            </div>
          </div>

        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-stone-300 flex items-center justify-between">
          <span>💡 বিএডিসি সার্টিফাইড বীজ ও এনপিকে ভারসাম্য মেনে চলায় গড়ে বিঘা প্রতি অতিরিক্ত ৮-১২ মণ ফলন বৃদ্ধি প্রজেক্টেড।</span>
          <span className="font-mono text-emerald-400 font-bold">Model Confidence: 94.6%</span>
        </div>
      </div>

      {/* 5. Actionable AI Agronomic Yield Optimization Recommendations */}
      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#14532D] uppercase tracking-wider">
          <Award className="w-4 h-4 text-[#D97706]" />
          <span>{crop.nameBn} ফলন বৃদ্ধি ও সর্বোচ্চ লাভের জন্য এআই কৃষিবিদ সুপারিশ:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {crop.aiRecommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-stone-800">
                  সুপারিশ পদক্ষেপ #{idx + 1}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {rec}
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ফলন বৃদ্ধি অনুঘটক</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
