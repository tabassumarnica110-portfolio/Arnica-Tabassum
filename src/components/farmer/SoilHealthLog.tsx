import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import {
  FlaskConical,
  Droplets,
  Sprout,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  Printer,
  Plus,
  History,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Scale,
  Send
} from "lucide-react";
import confetti from "canvas-confetti";

export interface SoilRecord {
  id: string;
  plotName: string;
  upazila: string;
  cropName: string;
  soilType: string;
  ph: number;
  moisturePct: number;
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
  organicCarbonPct: number;
  healthScore: number;
  healthStatus: "OPTIMAL" | "MODERATE" | "CRITICAL";
  date: string;
  notes?: string;
}

export interface AgronomicMetricAlert {
  key: "PH" | "NITROGEN" | "PHOSPHORUS" | "POTASSIUM";
  nameBn: string;
  isAlert: boolean;
  severity: "CRITICAL" | "WARNING" | "NORMAL";
  badgeBn: string;
  optimalRangeBn: string;
  currentValueBn: string;
  causeBn: string;
  impactBn: string;
  actionBn: string;
}

// Preset testing samples for defense & testing in front of the teacher
export const DEMO_SOIL_SAMPLES = [
  {
    id: "SAMPLE_1_OPTIMAL",
    nameBn: "১. 🌱 আদর্শ উর্বর জমি (Optimal Loamy - ধান ও আলুর জন্য আদর্শ)",
    descriptionBn: "সব পুষ্টি উপাদান ও আর্দ্রতা সুষম মাত্রায় রয়েছে। কোনো সংকট নেই।",
    upazila: "জামালপুর সদর",
    plotName: "উত্তর চরপাড়া প্লট-০১",
    cropName: "বোরো ধান (ব্রি-২৮)",
    soilType: "পলি দোঁআশ (Loam)",
    ph: 6.6,
    moisturePct: 62,
    nitrogenKgHa: 195,
    phosphorusKgHa: 38,
    potassiumKgHa: 235,
    organicCarbonPct: 1.4
  },
  {
    id: "SAMPLE_2_ACIDIC_DROUGHT",
    nameBn: "২. ⚠️ চরাঞ্চলের অম্লীয় ও খরাকবলিত জমি (Acidic & Drought - দেওয়ানগঞ্জ চর)",
    descriptionBn: "মাটি অতিরিক্ত অম্লীয় (pH ৪.৮) এবং তীব্র খরাকবলিত (আর্দ্রতা ২৬%)। চুন ও সেচ জরুরি।",
    upazila: "দেওয়ানগঞ্জ বাজার",
    plotName: "বাহাদুরাবাদ ঘাট চর-০৩",
    cropName: "ভুট্টা ও মরিচ",
    soilType: "বেলে দোঁআশ (Sandy Loam)",
    ph: 4.8,
    moisturePct: 26,
    nitrogenKgHa: 85,
    phosphorusKgHa: 14,
    potassiumKgHa: 110,
    organicCarbonPct: 0.6
  },
  {
    id: "SAMPLE_3_WATERLOGGED_HIGH_N",
    nameBn: "৩. 🌊 জলাবদ্ধ ও অতিরিক্ত ইউরিয়াযুক্ত জমি (Waterlogged & Excess N - ইসলামপুর)",
    descriptionBn: "অতিবৃষ্টিতে আর্দ্রতা ৮৬% (জলাবদ্ধ) এবং অতিরিক্ত ইউরিয়ায় নাইট্রোজেন ৩২০ কেজি/হেক্টর।",
    upazila: "ইসলামপুর",
    plotName: "যমুনা চর নিম্নভূমি-০২",
    cropName: "পাট ও আউশ ধান",
    soilType: "পলি এটেল (Clay Loam)",
    ph: 7.9,
    moisturePct: 86,
    nitrogenKgHa: 320,
    phosphorusKgHa: 24,
    potassiumKgHa: 135,
    organicCarbonPct: 1.1
  },
  {
    id: "SAMPLE_4_POTATO_DEFICIENT",
    nameBn: "৪. 🥔 মেলান্দহ আলু খেত - ফসফরাস ও পটাশ ঘাটতি (P & K Deficient)",
    descriptionBn: "মাটিতে আলুর জন্য অত্যাবশ্যকীয় ফসফেট ও পটাশের তীব্র ঘাটতি রয়েছে। টিএসপি ও এমওপি আবশ্যক।",
    upazila: "মেলান্দহ",
    plotName: "উমিরপুর আলু ব্লক-০৪",
    cropName: "ডায়মন্ড আলু",
    soilType: "দোঁআশ (Loam)",
    ph: 5.7,
    moisturePct: 54,
    nitrogenKgHa: 175,
    phosphorusKgHa: 13,
    potassiumKgHa: 95,
    organicCarbonPct: 1.0
  }
];

export const SoilHealthLog: React.FC = () => {
  const { addAuditLog, setActiveModal } = useApp();

  // Active Input State
  const [plotName, setPlotName] = useState<string>("উত্তরপাড়া ফসলি জমি-০১");
  const [upazila, setUpazila] = useState<string>("জামালপুর সদর");
  const [cropName, setCropName] = useState<string>("বোরো ধান (ব্রি-২৮)");
  const [soilType, setSoilType] = useState<string>("পলি দোঁআশ");

  const [ph, setPh] = useState<number>(6.5);
  const [moisturePct, setMoisturePct] = useState<number>(60);
  const [nitrogenKgHa, setNitrogenKgHa] = useState<number>(180);
  const [phosphorusKgHa, setPhosphorusKgHa] = useState<number>(35);
  const [potassiumKgHa, setPotassiumKgHa] = useState<number>(220);
  const [organicCarbonPct, setOrganicCarbonPct] = useState<number>(1.2);

  // Active Tooltip for Agronomic Alerts
  const [activeTooltip, setActiveTooltip] = useState<"PH" | "NITROGEN" | "PHOSPHORUS" | "POTASSIUM" | null>(null);

  // Audio Voice Narration
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // History Records
  const [records, setRecords] = useState<SoilRecord[]>([
    {
      id: "LOG-101",
      plotName: "উত্তর চরপাড়া প্লট-০১",
      upazila: "জামালপুর সদর",
      cropName: "বোরো ধান",
      soilType: "পলি দোঁআশ",
      ph: 6.6,
      moisturePct: 62,
      nitrogenKgHa: 195,
      phosphorusKgHa: 38,
      potassiumKgHa: 235,
      organicCarbonPct: 1.4,
      healthScore: 94,
      healthStatus: "OPTIMAL",
      date: "২০২৬-১০-০৫ (গতকাল)",
      notes: "মাটির অবস্থা চমৎকার। অনুমোদিত মাত্রার নিয়মিত সুষম সার দিলে বাম্পার ফলন হবে।"
    },
    {
      id: "LOG-102",
      plotName: "উমিরপুর আলু ব্লক-০৪",
      upazila: "মেলান্দহ",
      cropName: "ডায়মন্ড আলু",
      soilType: "দোঁআশ",
      ph: 5.7,
      moisturePct: 54,
      nitrogenKgHa: 175,
      phosphorusKgHa: 13,
      potassiumKgHa: 95,
      organicCarbonPct: 1.0,
      healthScore: 68,
      healthStatus: "MODERATE",
      date: "২০২৬-১০-০১",
      notes: "পটাশ ও ফসফরাসের ঘাটতি রয়েছে। বিঘা প্রতি ১২ কেজি টিএসপি ও ১৫ কেজি এমওপি প্রয়োগ নির্দেশিত।"
    }
  ]);

  // Success Notification
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Health Calculation Engine
  const analysis = useMemo(() => {
    // 1. pH Evaluation (Optimal: 6.0 - 7.2)
    let phScore = 100;
    let phStatusBn = "আদর্শ (সুষম)";
    let phColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (ph < 5.5) {
      phScore = Math.max(20, Math.round(100 - (5.5 - ph) * 35));
      phStatusBn = "তীব্র অম্লীয় (Acidic) — চুন প্রয়োজন";
      phColor = "text-red-700 bg-red-50 border-red-200";
    } else if (ph < 6.0) {
      phScore = 75;
      phStatusBn = "সামান্য অম্লীয় (Slightly Acidic)";
      phColor = "text-amber-700 bg-amber-50 border-amber-200";
    } else if (ph > 7.8) {
      phScore = Math.max(20, Math.round(100 - (ph - 7.8) * 35));
      phStatusBn = "তীব্র ক্ষারীয় (Alkaline) — জিপসাম প্রয়োজন";
      phColor = "text-red-700 bg-red-50 border-red-200";
    } else if (ph > 7.2) {
      phScore = 80;
      phStatusBn = "সামান্য ক্ষারীয় (Slightly Alkaline)";
      phColor = "text-amber-700 bg-amber-50 border-amber-200";
    }

    // 2. Moisture Evaluation (Optimal: 50% - 70%)
    let moistureScore = 100;
    let moistureStatusBn = "আদর্শ আর্দ্রতা (Field Capacity)";
    let moistureColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (moisturePct < 35) {
      moistureScore = Math.max(15, Math.round((moisturePct / 35) * 60));
      moistureStatusBn = "তীব্র খরা / শুষ্কতা — অবিলম্বে সেচ দিন";
      moistureColor = "text-red-700 bg-red-50 border-red-200";
    } else if (moisturePct < 50) {
      moistureScore = 75;
      moistureStatusBn = "স্বাভাবিকের চেয়ে কম আর্দ্রতা — হালকা সেচ প্রয়োজন";
      moistureColor = "text-amber-700 bg-amber-50 border-amber-200";
    } else if (moisturePct > 80) {
      moistureScore = Math.max(20, Math.round(100 - (moisturePct - 80) * 3.5));
      moistureStatusBn = "অতিরিক্ত স্যাঁতসেঁতে / জলাবদ্ধতা — নিষ্কাশন প্রয়োজন";
      moistureColor = "text-blue-700 bg-blue-50 border-blue-200";
    }

    // 3. Nitrogen Evaluation (Optimal: 140 - 240 kg/ha)
    let nScore = 100;
    let nStatusBn = "সুষম নাইট্রোজেন";
    if (nitrogenKgHa < 100) {
      nScore = Math.max(20, Math.round((nitrogenKgHa / 100) * 60));
      nStatusBn = "তীব্র ঘাটতি (পাতা হলুদ হওয়ার ঝুঁকি)";
    } else if (nitrogenKgHa < 140) {
      nScore = 75;
      nStatusBn = "হালকা ঘাটতি (ইউরিয়া উপরিপ্রয়োগ আবশ্যক)";
    } else if (nitrogenKgHa > 280) {
      nScore = Math.max(30, Math.round(100 - (nitrogenKgHa - 280) * 0.5));
      nStatusBn = "অতিরিক্ত নাইট্রোজেন (রোগ ও পোকা বৃদ্ধির ঝুঁকি)";
    }

    // 4. Phosphorus Evaluation (Optimal: 25 - 50 kg/ha)
    let pScore = 100;
    let pStatusBn = "আদর্শ ফসফরাস";
    if (phosphorusKgHa < 16) {
      pScore = Math.max(20, Math.round((phosphorusKgHa / 16) * 60));
      pStatusBn = "তীব্র ঘাটতি (দুর্বল শিকড় বৃদ্ধি)";
    } else if (phosphorusKgHa < 25) {
      pScore = 75;
      pStatusBn = "হালকা ঘাটতি (টিএসপি/ডিএপি সার প্রয়োজন)";
    } else if (phosphorusKgHa > 60) {
      nScore = 80;
      pStatusBn = "উচ্চ মাত্রা (অতিরিক্ত সার প্রয়োগ পরিহার করুন)";
    }

    // 5. Potassium Evaluation (Optimal: 160 - 300 kg/ha)
    let kScore = 100;
    let kStatusBn = "আদর্শ পটাশিয়াম";
    if (potassiumKgHa < 120) {
      kScore = Math.max(20, Math.round((potassiumKgHa / 120) * 60));
      kStatusBn = "তীব্র ঘাটতি (কান্ড দুর্বল ও দানা অপুষ্ট)";
    } else if (potassiumKgHa < 160) {
      kScore = 75;
      kStatusBn = "হালকা ঘাটতি (এমওপি সার প্রয়োজন)";
    } else if (potassiumKgHa > 340) {
      kScore = 85;
      kStatusBn = "পর্যাপ্ত / উচ্চ মাত্রা";
    }

    // Combined Weighted Score
    const weightedScore = Math.round(
      phScore * 0.25 +
      moistureScore * 0.25 +
      nScore * 0.20 +
      pScore * 0.15 +
      kScore * 0.15
    );

    let status: "OPTIMAL" | "MODERATE" | "CRITICAL" = "OPTIMAL";
    let statusLabelBn = "উত্তম / স্বাস্থ্যকর জমি (Optimal Soil Health)";
    let statusDescriptionBn = "মাটির সামগ্রিক ভৌত ও রাসায়নিক পরিবেশ শস্য উৎপাদনের জন্য চমৎকার। স্বাভাবিক সুষম সারে সর্বোচ্চ ফলন পাওয়া যাবে।";
    let statusTheme = "from-emerald-600 to-teal-800 text-white";
    let statusBadgeColor = "bg-emerald-500 text-white";

    if (weightedScore < 55) {
      status = "CRITICAL";
      statusLabelBn = "সংকটজনক / জরুরি প্রতিকার প্রয়োজন (Critical Condition)";
      statusDescriptionBn = "মাটির পুষ্টি ও পরিবেশের চরম ভারসাম্যহীনতা শনাক্ত হয়েছে। চুন, জরুরি সেচ বা নিষ্কাশন ছাড়া ফসল রোপণ করলে লোকসানের ঝুঁকি রয়েছে।";
      statusTheme = "from-red-600 to-rose-800 text-white";
      statusBadgeColor = "bg-red-500 text-white";
    } else if (weightedScore < 80) {
      status = "MODERATE";
      statusLabelBn = "সতর্কতা / মধ্যম স্বাস্থ্য (Needs Corrective Attention)";
      statusDescriptionBn = "মাটিতে কিছু উপাদানের ঘাটতি বা আধিক্য রয়েছে। নির্দেশিত সার ও সংশোধনমূলক ব্যবস্থা গ্রহণ করলে মাটি উর্বর হবে।";
      statusTheme = "from-amber-600 to-orange-800 text-white";
      statusBadgeColor = "bg-amber-500 text-stone-950";
    }

    // Actionable Agronomic Prescription
    const recommendations: string[] = [];
    if (ph < 5.5) {
      recommendations.push("ডলোমাইট চুন: অম্লতা কাটাতে বিঘা প্রতি ২৫-৩০ কেজি ডলোমাইট চুন শেষ চাষের ১৫ দিন পূর্বে জমিতে ছিটিয়ে সমানভাবে মিশিয়ে দিন।");
    } else if (ph > 7.8) {
      recommendations.push("জিপসাম ও জৈব সার: ক্ষারত্ব প্রশমিত করতে বিঘা প্রতি ১৫ কেজি জিপসাম এবং ৩০০ কেজি ভার্মিকম্পোস্ট প্রয়োগ করুন।");
    }

    if (moisturePct < 40) {
      recommendations.push("জরুরি সেচ: মাটিতে আর্দ্রতার তীব্র সংকট। শিকড়ের খরা কাটাতে অবিলম্বে ২-৩ ইঞ্চি হালকা সেচ দিন।");
    } else if (moisturePct > 80) {
      recommendations.push("নিষ্কাশন নালা: জমির অতিরিক্ত পানি অপসারণে চারিদিকে ১ ফুট গভীর নালা কেটে পানি বের করে দিন।");
    }

    if (nitrogenKgHa < 140) {
      recommendations.push("ইউরিয়া সার: নাইট্রোজেনের ঘাটতি মেটাতে বিঘা প্রতি ১২-১৫ কেজি ইউরিয়া সার সমান ২-৩ কিস্তিতে উপরিপ্রয়োগ করুন।");
    } else if (nitrogenKgHa > 260) {
      recommendations.push("ইউরিয়া বন্ধ রাখুন: মাটিতে পর্যাপ্ত নাইট্রোজেন বিদ্যমান। অতিরিক্ত ইউরিয়া দিলে রোগ ও পোকা বাড়বে।");
    }

    if (phosphorusKgHa < 25) {
      recommendations.push("টিএসপি / ডিএপি: ফসফেটের অভাব রয়েছে। জমি তৈরির সময় বিঘা প্রতি ১৮ কেজি টিএসপি বা ডিএপি সার মাটিতে মিশিয়ে দিন।");
    }

    if (potassiumKgHa < 160) {
      recommendations.push("এমওপি (পটাশ): কান্ড শক্ত ও রোগ প্রতিরোধে বিঘা প্রতি ১৪-১৬ কেজি এমওপি সার অর্ধেক রোপণের সময় ও বাকি অর্ধেক ফুল আসার আগে দিন।");
    }

    if (organicCarbonPct < 1.0) {
      recommendations.push("জৈব কার্বন উন্নয়ন: মাটির স্বাস্থ্য ধরে রাখতে বিঘা প্রতি ৪০০ কেজি পচা গোবর বা ট্রাইকো-কম্পোস্ট সার প্রয়োগ করুন।");
    }

    if (recommendations.length === 0) {
      recommendations.push("মাটি সম্পূর্ণ স্বাস্থ্যকর ও সুষম। অনুমোদিত নিয়মিত চার্ট অনুযায়ী স্বাভাবিক সার প্রয়োগ অব্যাহত রাখুন।");
    }

    return {
      weightedScore,
      status,
      statusLabelBn,
      statusDescriptionBn,
      statusTheme,
      statusBadgeColor,
      phScore,
      phStatusBn,
      phColor,
      moistureScore,
      moistureStatusBn,
      moistureColor,
      nStatusBn,
      pStatusBn,
      kStatusBn,
      recommendations
    };
  }, [ph, moisturePct, nitrogenKgHa, phosphorusKgHa, potassiumKgHa, organicCarbonPct]);

  // Agronomic Metric Alert System Engine
  const metricAlerts = useMemo(() => {
    // 1. pH Alert (Optimal: 6.0 - 7.2)
    const phIsAlert = ph < 6.0 || ph > 7.2;
    const phAlert: AgronomicMetricAlert = {
      key: "PH",
      nameBn: "মাটির পিএইচ (pH)",
      isAlert: phIsAlert,
      severity: ph < 5.5 || ph > 7.8 ? "CRITICAL" : phIsAlert ? "WARNING" : "NORMAL",
      badgeBn: ph < 5.5 ? "🚨 চরম অম্লীয় মাটি (Severe Acidic)" : ph < 6.0 ? "⚠️ অম্লীয় মাটি (Acidic)" : ph > 7.8 ? "🚨 চরম ক্ষারীয় মাটি (Severe Alkaline)" : ph > 7.2 ? "⚠️ ক্ষারীয় মাটি (Alkaline)" : "✓ আদর্শ উর্বর pH",
      optimalRangeBn: "৬.০ – ৭.২ pH",
      currentValueBn: `${ph.toFixed(1)} pH`,
      causeBn: ph < 6.0 
        ? "মাটিতে অতিরিক্ত হাইড্রোজেন আয়ন, অম্লীয় জৈব পদার্থ ও অতিবৃষ্টিতে ক্ষারীয় উপাদান লিচিং হয়ে চলে যাওয়া।" 
        : ph > 7.2 
        ? "মাটিতে কার্বনেট, বাইকার্বনেট ও অতিরিক্ত সোডিয়াম লবণের জমাটবদ্ধতা।" 
        : "প্রাকৃতিক সুষম মৃত্তিকা দ্রবণ।",
      impactBn: ph < 6.0 
        ? "ফসফরাস ও পটাশ শিকড় দিয়ে গ্রহণ সম্পূর্ণ আটকে যায় (P-Fixation), অ্যালুমিনিয়াম বিষাক্ততা সৃষ্টি হয় এবং ফলন ৪০-৬০% হ্রাস পেতে পারে।" 
        : ph > 7.2 
        ? "জিংক ও আয়রনের তীব্র ঘাটতি দেখা দেয়, পাতা হলুদ-সাদাটে হয়ে কুশি গজানো বন্ধ হয়।" 
        : "উদ্ভিদের শিকড় সব প্রধান পুষ্টি উপাদান সহজে ও স্বাভাবিকভাবে গ্রহণ করতে পারে।",
      actionBn: ph < 6.0 
        ? "বিঘা প্রতি ২৫-৩০ কেজি ডলোমাইট চুন শেষ চাষের ১৫ দিন পূর্বে জমিতে ছিটিয়ে সমানভাবে মাটির সাথে মিশিয়ে দিন।" 
        : ph > 7.2 
        ? "বিঘা প্রতি ১৫-২০ কেজি জিপসাম এবং ৩০০ কেজি ভার্মিকম্পোস্ট প্রয়োগ করুন।" 
        : "কোনো চুন বা জিপসামের প্রয়োজন নেই।"
    };

    // 2. Nitrogen (N) Alert (Optimal: 140 - 240 kg/ha)
    const nIsAlert = nitrogenKgHa < 140 || nitrogenKgHa > 240;
    const nAlert: AgronomicMetricAlert = {
      key: "NITROGEN",
      nameBn: "নাইট্রোজেন (N)",
      isAlert: nIsAlert,
      severity: nitrogenKgHa < 100 || nitrogenKgHa > 280 ? "CRITICAL" : nIsAlert ? "WARNING" : "NORMAL",
      badgeBn: nitrogenKgHa < 100 ? "🚨 তীব্র নাইট্রোজেন সংকট (Severe Deficit)" : nitrogenKgHa < 140 ? "⚠️ নাইট্রোজেন ঘাটতি" : nitrogenKgHa > 280 ? "🚨 অতিরিক্ত ইউরিয়া বিষাক্ততা (Toxicity)" : nitrogenKgHa > 240 ? "⚠️ অতিরিক্ত নাইট্রোজেন" : "✓ সুষম নাইট্রোজেন",
      optimalRangeBn: "১৪০ – ২৪০ kg/ha",
      currentValueBn: `${nitrogenKgHa} kg/ha`,
      causeBn: nitrogenKgHa < 140 
        ? "ইউরিয়া সারের অপ্রতুলতা বা অতিরিক্ত বৃষ্টি ও সেচের পানিতে নাইট্রোজেন ধুয়ে নিচে চলে যাওয়া (Leaching)।" 
        : nitrogenKgHa > 240 
        ? "অপরিমিত ইউরিয়া সারের অতিরিক্ত উপরিপ্রয়োগ।" 
        : "সুষম নাইট্রোজেন মাত্রা।",
      impactBn: nitrogenKgHa < 140 
        ? "পুরনো পাতা দ্রুত হলুদ হয়ে শুকিয়ে যায় (Chlorosis), কুশি গজানো কমে যায় এবং ফলন চরমভাবে মার খায়।" 
        : nitrogenKgHa > 240 
        ? "গাছ অতিরিক্ত লিকলিকে নরম হয়ে সামান্য বাতাসে হেলে পড়ে (Lodging), পাতা নরম হওয়ায় ব্লাস্ট রোগ ও মাজরা পোকার আক্রমণ ৩ গুণ বেড়ে যায়।" 
        : "গাঢ় সবুজ সতেজ পাতা ও স্বাভাবিক কুশি তৈরি নিশ্চিত হয়।",
      actionBn: nitrogenKgHa < 140 
        ? "বিঘা প্রতি ১২-১৫ কেজি ইউরিয়া সমান ২-৩ কিস্তিতে সেচের পর উপরিপ্রয়োগ করুন।" 
        : nitrogenKgHa > 240 
        ? "অবিলম্বে সকল প্রকার ইউরিয়া সার প্রয়োগ সম্পূর্ণ বন্ধ রাখুন এবং কান্ড শক্ত করতে পটাশ দিন।" 
        : "অনুমোদিত স্বাভাবিক মাত্রা বজায় রাখুন।"
    };

    // 3. Phosphorus (P) Alert (Optimal: 25 - 50 kg/ha)
    const pIsAlert = phosphorusKgHa < 25 || phosphorusKgHa > 50;
    const pAlert: AgronomicMetricAlert = {
      key: "PHOSPHORUS",
      nameBn: "ফসফরাস (P)",
      isAlert: pIsAlert,
      severity: phosphorusKgHa < 16 ? "CRITICAL" : pIsAlert ? "WARNING" : "NORMAL",
      badgeBn: phosphorusKgHa < 16 ? "🚨 চরম ফসফরাস সংকট (Critical Deficit)" : phosphorusKgHa < 25 ? "⚠️ ফসফরাস ঘাটতি" : phosphorusKgHa > 50 ? "⚠️ উচ্চ ফসফেট সঞ্চয়" : "✓ আদর্শ ফসফরাস",
      optimalRangeBn: "২৫ – ৫০ kg/ha",
      currentValueBn: `${phosphorusKgHa} kg/ha`,
      causeBn: phosphorusKgHa < 25 
        ? "টিএসপি/ডিএপি সারের অভাব বা অম্লীয় মাটিতে ফসফরাস ফিক্সেশন হয়ে শিকড়ের নাগালের বাইরে থাকা।" 
        : "অতিরিক্ত টিএসপি সার প্রয়োগ।",
      impactBn: phosphorusKgHa < 25 
        ? "প্রধান ও পার্শ্ব শিকড়ের বিস্তার থমকে যায়, পাতার ডগা বেগুনি-লালচে রঙ নেয় এবং ফুল-ফল আসার সময় বিলম্বিত হয়।" 
        : phosphorusKgHa > 50 
        ? "মাটিতে জিংক (Zinc) ও আয়রন শোষণ ব্যাহত হয়।" 
        : "শক্তিশালী শিকড় ও দ্রুত কন্দ/দানা গঠন নিশ্চিত হয়।",
      actionBn: phosphorusKgHa < 25 
        ? "জমি তৈরির শেষ চাষে বিঘা প্রতি ১৮-২০ কেজি টিএসপি বা ডিএপি সার মাটির নিচে প্রয়োগ করুন।" 
        : phosphorusKgHa > 50 
        ? "টিএসপি সার প্রয়োগ আপাতত পরিহার করুন।" 
        : "অনুমোদিত স্বাভাবিক মাত্রা বজায় রাখুন।"
    };

    // 4. Potassium (K) Alert (Optimal: 160 - 300 kg/ha)
    const kIsAlert = potassiumKgHa < 160 || potassiumKgHa > 300;
    const kAlert: AgronomicMetricAlert = {
      key: "POTASSIUM",
      nameBn: "পটাশিয়াম (K)",
      isAlert: kIsAlert,
      severity: potassiumKgHa < 120 ? "CRITICAL" : kIsAlert ? "WARNING" : "NORMAL",
      badgeBn: potassiumKgHa < 120 ? "🚨 তীব্র পটাশ সংকট (Severe Deficit)" : potassiumKgHa < 160 ? "⚠️ পটাশিয়াম স্বল্পতা" : potassiumKgHa > 300 ? "⚠️ উচ্চ পটাশিয়াম মাত্রা" : "✓ আদর্শ পটাশিয়াম",
      optimalRangeBn: "১৬০ – ৩০০ kg/ha",
      currentValueBn: `${potassiumKgHa} kg/ha`,
      causeBn: potassiumKgHa < 160 
        ? "এমওপি (পটাশ) সারের অপর্যাপ্ত প্রয়োগ বা ব্যবহারে কৃষকের অনীহা।" 
        : "অতিরিক্ত পটাশ সার ব্যবহার।",
      impactBn: potassiumKgHa < 160 
        ? "কান্ড দুর্বল হয়ে ফসল সামান্য বাতাসে হেলে পড়ে, পাতার কিনারা পুড়ে যাওয়ার মতো ঝলসে যায় (Marginal Scorch) এবং রোগ প্রতিরোধ ক্ষমতা ভেঙে পড়ে।" 
        : potassiumKgHa > 300 
        ? "ম্যাগনেসিয়াম ও ক্যালসিয়াম ঘাটতি তৈরি হতে পারে।" 
        : "মজবুত কান্ড, রোগ প্রতিরোধ ও বড় ওজনদার দানা গঠন করে।",
      actionBn: potassiumKgHa < 160 
        ? "বিঘা প্রতি ১৪-১৬ কেজি এমওপি সার অর্ধেক রোপণের সময় ও বাকি অর্ধেক থোর আসার পূর্বে দিন।" 
        : potassiumKgHa > 300 
        ? "এমওপি সারের মাত্রা হ্রাস করুন।" 
        : "অনুমোদিত স্বাভাবিক মাত্রা বজায় রাখুন।"
    };

    const alertList = [phAlert, nAlert, pAlert, kAlert];
    const activeAlertCount = alertList.filter(a => a.isAlert).length;

    return {
      ph: phAlert,
      nitrogen: nAlert,
      phosphorus: pAlert,
      potassium: kAlert,
      alertList,
      activeAlertCount
    };
  }, [ph, nitrogenKgHa, phosphorusKgHa, potassiumKgHa]);

  // Handle Load Sample
  const handleLoadSample = (sample: typeof DEMO_SOIL_SAMPLES[0]) => {
    setPlotName(sample.plotName);
    setUpazila(sample.upazila);
    setCropName(sample.cropName);
    setSoilType(sample.soilType);
    setPh(sample.ph);
    setMoisturePct(sample.moisturePct);
    setNitrogenKgHa(sample.nitrogenKgHa);
    setPhosphorusKgHa(sample.phosphorusKgHa);
    setPotassiumKgHa(sample.potassiumKgHa);
    setOrganicCarbonPct(sample.organicCarbonPct);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    addAuditLog(
      "SOIL_SAMPLE_LOADED",
      `/farmer/soil-log/preset/${sample.id}`,
      "ALLOWED",
      `Loaded demo test soil sample: ${sample.nameBn}`
    );
  };

  // Handle Save Record
  const handleSaveRecord = () => {
    const newRecord: SoilRecord = {
      id: `SOIL-${Date.now().toString().slice(-5)}`,
      plotName,
      upazila,
      cropName,
      soilType,
      ph,
      moisturePct,
      nitrogenKgHa,
      phosphorusKgHa,
      potassiumKgHa,
      organicCarbonPct,
      healthScore: analysis.weightedScore,
      healthStatus: analysis.status,
      date: new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" }),
      notes: analysis.recommendations[0] || "মাটি পরীক্ষা সম্পন্ন।"
    };

    setRecords([newRecord, ...records]);
    setSavedSuccessMsg(`"${plotName}" জমির মাটির স্বাস্থ্য সফলভাবে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setSavedSuccessMsg(null), 4000);

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    addAuditLog(
      "SOIL_HEALTH_LOG_SAVED",
      `/farmer/soil-log/save`,
      "ALLOWED",
      `Soil health log saved for ${plotName} (${upazila}). Score: ${analysis.weightedScore}% (${analysis.status})`
    );
  };

  // Text-To-Speech Bangla Voice
  const handleVoiceDiagnosis = () => {
    if (isSpeaking) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    const voiceScript = `মাটির স্বাস্থ্য রিপোর্ট: জমির নাম ${plotName}, উপজেলা ${upazila}। মাটির স্বাস্থ্য সূচক ১০০ এর মধ্যে ${analysis.weightedScore}। মাটির অবস্থা: ${analysis.statusLabelBn}। পি এইচ মাত্রা ${ph}, আর্দ্রতা শতকরা ${moisturePct} ভাগ। প্রধান পরামর্শ: ${analysis.recommendations.slice(0, 2).join("। ")}`;

    if (!("speechSynthesis" in window)) {
      alert(voiceScript);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(voiceScript);

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.startsWith("bn") || v.name.toLowerCase().includes("bangla"));
      if (bnVoice) utterance.voice = bnVoice;
      utterance.lang = "bn-BD";
      utterance.rate = 0.88;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Tooltip component renderer for agronomic metric alerts
  const renderAlertTooltip = (alert: AgronomicMetricAlert) => {
    if (!alert.isAlert && activeTooltip !== alert.key) return null;

    return (
      <div className={`mt-2 p-3.5 rounded-2xl border transition-all animate-fadeIn ${
        alert.severity === "CRITICAL"
          ? "bg-stone-950 text-white border-2 border-red-500 shadow-xl"
          : "bg-stone-900 text-stone-100 border-2 border-amber-500 shadow-lg"
      }`}>
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <h5 className="font-black text-xs text-white">
                🚨 কৃষি পুষ্টি সতর্কতা: {alert.nameBn}
              </h5>
              <span className="text-[10px] text-amber-300 font-mono font-bold">
                {alert.badgeBn}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTooltip(null)}
            className="text-stone-400 hover:text-white p-1 rounded cursor-pointer transition-colors"
            title="টুলটিপ বন্ধ করুন"
          >
            ✕
          </button>
        </div>

        <div className="mt-2.5 space-y-2 text-xs">
          {/* Metric comparison */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-white/5 p-2 rounded-xl border border-white/10">
            <div>
              <span className="text-stone-400 block text-[9px]">বর্তমান পরিমাপ:</span>
              <span className="font-bold text-red-400 text-xs">{alert.currentValueBn}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[9px]">আদর্শ কৃষি সীমা:</span>
              <span className="font-bold text-emerald-400 text-xs">{alert.optimalRangeBn}</span>
            </div>
          </div>

          {/* Cause */}
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 text-[11px] block">🔍 চিহ্নিত মূল কারণ:</span>
            <p className="text-stone-200 leading-relaxed text-[11px]">{alert.causeBn}</p>
          </div>

          {/* Agronomic Impact */}
          <div className="space-y-0.5">
            <span className="font-bold text-rose-300 text-[11px] block">🍂 ফসলে ক্ষতিকর প্রভাব ও ঝুঁকি:</span>
            <p className="text-stone-200 leading-relaxed text-[11px]">{alert.impactBn}</p>
          </div>

          {/* Actionable prescription */}
          <div className="space-y-0.5 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200">
            <span className="font-bold text-emerald-300 block">💊 তাৎক্ষণিক কৃষি প্রেসক্রিপশন:</span>
            <p className="leading-relaxed">{alert.actionBn}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-7 font-sans">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-900 via-stone-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                <span>মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউট (SRDI) ও বিএআরআই প্যারামিটার</span>
              </span>
              <span className="text-xs font-mono bg-white/10 text-stone-200 px-2.5 py-0.5 rounded-full font-bold">
                Live Soil Analytics
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>🧪 মাটির স্বাস্থ্য লগ ও উর্বরতা নির্ণয়ক</span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              মাটির পিএইচ (pH), আর্দ্রতা (Moisture), নাইট্রোজেন (N), ফসফরাস (P) ও পটাশিয়াম (K) ইনপুট দিয়ে তাৎক্ষণিক উর্বরতা সূচক, ঘাটতি বিশ্লেষণ ও ডিএই কৃষি প্রেসক্রিপশন গ্রহণ করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveModal("LIVE_SMS_TEST")}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-102"
              title="মাটির অ্যালার্ট ও প্রেসক্রিপশন মোবাইলে টেস্ট এসএমএস পাঠান"
            >
              <Send className="w-4 h-4" />
              <span>📲 সিমে টেস্ট এসএমএস পাঠান</span>
            </button>

            <button
              onClick={handleVoiceDiagnosis}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                isSpeaking
                  ? "bg-amber-400 text-stone-950 animate-pulse ring-4 ring-amber-300/40"
                  : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-stone-950" />
                  <span>ভয়েস থামান</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>🔊 মুখে বাংলায় ডায়াগনোসিস শুনুন</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="মৃত্তিকা স্বাস্থ্য রিপোর্ট প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
              <span>কার্ড প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. DEMO SAMPLES BAR FOR PRESENTATION TO TEACHER / EXAMINER */}
      <div className="rounded-3xl bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border-2 border-emerald-600/30 p-5 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 animate-bounce" />
            <span className="font-extrabold text-sm text-stone-900">
              🧪 সম্মানিত স্যারের সামনে টেস্ট করার জন্য রেডি ডেমো স্যাম্পল (1-Click Test Presets):
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-500">
            যেকোনো বাটনে এক ক্লিকে সম্পূর্ণ স্বাস্থ্য পরীক্ষা লাইভ পর্যবেক্ষণ করুন
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMO_SOIL_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 text-left transition-all shadow-2xs hover:shadow-md cursor-pointer group flex flex-col justify-between gap-2"
            >
              <div>
                <span className="font-bold text-xs text-stone-900 group-hover:text-emerald-800 line-clamp-1 block">
                  {sample.nameBn}
                </span>
                <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                  {sample.descriptionBn}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-stone-600 pt-1 border-t border-stone-100">
                <span>pH {sample.ph} · আর্দ্রতা {sample.moisturePct}%</span>
                <span className="text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  টেস্ট রান <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Bar */}
      {savedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{savedSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSavedSuccessMsg(null)}
            className="text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE: INPUT GAUGES (LEFT) + REAL-TIME HEALTH STATUS & PRESCRIPTION (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* LEFT COLUMN: INTERACTIVE SOIL LOG INPUT FORM & SLIDERS (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  মাটির পরীক্ষার মান ইনপুট করুন
                </h3>
                <p className="text-xs text-stone-500">
                  স্মার্ট সেন্সর বা ল্যাব টেস্টের মান দিন
                </p>
              </div>
            </div>

            <span className="text-xs font-mono bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-bold">
              ইনপুট প্যানেল
            </span>
          </div>

          {/* Plot Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ফসলি জমির নাম / প্লট:
              </label>
              <input
                type="text"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="যেমন: উত্তরপাড়া প্লট-০১"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                উপজেলা / অঞ্চল:
              </label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden cursor-pointer"
              >
                <option value="জামালপুর সদর">জামালপুর সদর</option>
                <option value="মেলান্দহ">মেলান্দহ</option>
                <option value="ইসলামপুর">ইসলামপুর</option>
                <option value="সরিষাবাড়ী">সরিষাবাড়ী</option>
                <option value="দেওয়ানগঞ্জ বাজার">দেওয়ানগঞ্জ বাজার</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                টার্গেট ফসল:
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="যেমন: বোরো ধান (ব্রি-২৮)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                মাটির ধরন:
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden cursor-pointer"
              >
                <option value="পলি দোঁআশ">পলি দোঁআশ (Silt Loam - আদর্শ)</option>
                <option value="দোঁআশ">দোঁআশ (Loam)</option>
                <option value="বেলে দোঁআশ">বেলে দোঁআশ (Sandy Loam)</option>
                <option value="পলি এটেল">পলি এটেল (Clay Loam)</option>
                <option value="বেলে মাটি">বেলে মাটি (Sandy Soil)</option>
              </select>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* MASTER AGRONOMIC ALERT BANNER */}
          <div className={`p-4 rounded-2xl border transition-all ${
            metricAlerts.activeAlertCount > 0
              ? "bg-linear-to-r from-red-600/10 via-rose-500/15 to-amber-500/10 border-red-500/40 text-red-950 shadow-xs"
              : "bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs"
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  metricAlerts.activeAlertCount > 0
                    ? "bg-red-600 text-white animate-bounce shadow-xs"
                    : "bg-emerald-600 text-white"
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm flex items-center gap-2 text-stone-900">
                    <span>
                      {metricAlerts.activeAlertCount > 0
                        ? `🚨 মাটির পুষ্টি সতর্কতা সক্রিয় (${metricAlerts.activeAlertCount}টি পরামিতি কৃষি সীমার বাইরে)`
                        : "🟢 মাটির পুষ্টি সুরক্ষা নিশ্চিত (সকল পরামিতি সুষম)"
                      }
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-600 leading-tight">
                    {metricAlerts.activeAlertCount > 0
                      ? "লাল সতর্কীকরণ ইন্ডিকেটর ও টুলটিপে ক্লিক করে তাৎক্ষণিক সমাধান ও ক্ষতিকর প্রভাব দেখুন।"
                      : "পিএইচ (pH) ও এনপিকে (NPK) সকল মান আদর্শ উর্বর কৃষি পরিসীমার মধ্যে রয়েছে।"
                    }
                  </p>
                </div>
              </div>

              {/* Violated parameter pills */}
              {metricAlerts.activeAlertCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {metricAlerts.alertList.filter(a => a.isAlert).map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === a.key ? null : a.key)}
                      className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-all animate-pulse"
                      title="টুলটিপ দেখতে ক্লিক করুন"
                    >
                      <span>{a.nameBn}: {a.currentValueBn}</span>
                      <AlertTriangle className="w-3 h-3 text-amber-200" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PARAMETER 1: SOIL pH SLIDER */}
          <div className={`space-y-2 p-4 rounded-2xl border transition-all ${
            metricAlerts.ph.isAlert
              ? "bg-linear-to-br from-red-50/80 via-white to-rose-50/40 border-red-500 ring-2 ring-red-300 shadow-xs"
              : "bg-stone-50 border-stone-200"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scale className={`w-4 h-4 ${metricAlerts.ph.isAlert ? "text-red-600" : "text-emerald-700"}`} />
                <span className="font-bold text-xs text-stone-800">১. মাটির পিএইচ (Soil pH Level):</span>
                {metricAlerts.ph.isAlert && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] animate-pulse flex items-center gap-0.5 shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-white" />
                      <span>সীমার বাইরে সতর্কতা</span>
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "PH" ? null : "PH")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                    metricAlerts.ph.isAlert
                      ? "text-red-800 bg-red-100 hover:bg-red-200 border-red-300 font-extrabold"
                      : "text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
                  }`}
                  title="টুলটিপ দেখতে ক্লিক করুন"
                >
                  <Info className="w-3 h-3" />
                  <span>{metricAlerts.ph.isAlert ? "🚨 সতর্কবার্তা টুলটিপ" : "আদর্শ মানদণ্ড"}</span>
                </button>

                <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg border ${
                  metricAlerts.ph.isAlert
                    ? "bg-red-600 text-white border-red-700 shadow-2xs"
                    : "bg-white text-stone-900 border-stone-300"
                }`}>
                  {ph.toFixed(1)}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="3.5"
              max="9.5"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className={`w-full cursor-pointer h-2 rounded-lg ${
                metricAlerts.ph.isAlert ? "accent-red-600 bg-red-200" : "accent-emerald-600 bg-stone-200"
              }`}
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span className="text-red-600 font-bold">৩.৫ (তীব্র অম্লীয়)</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-1 rounded">৬.০ - ৭.২ (আদর্শ উর্বর সীমা)</span>
              <span className="text-blue-600 font-bold">৯.৫ (তীব্র ক্ষারীয়)</span>
            </div>

            {/* Inline Alert / Tooltip Card */}
            {renderAlertTooltip(metricAlerts.ph)}
          </div>

          {/* PARAMETER 2: SOIL MOISTURE % SLIDER */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-stone-800">২. মাটির আর্দ্রতা (Soil Moisture %):</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${analysis.moistureColor}`}>
                  {analysis.moistureStatusBn}
                </span>
                <span className="font-mono font-black text-sm text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                  {moisturePct}%
                </span>
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={moisturePct}
              onChange={(e) => setMoisturePct(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span className="text-amber-700 font-bold">১০% (খরা/শুষ্ক)</span>
              <span className="text-blue-700 font-bold bg-blue-100 px-1 rounded">৫০% - ৭০% (আদর্শ জো)</span>
              <span className="text-indigo-800 font-bold">১০০% (জলাবদ্ধ)</span>
            </div>
          </div>

          {/* PARAMETER 3: NITROGEN (N) SLIDER */}
          <div className={`space-y-2 p-4 rounded-2xl border transition-all ${
            metricAlerts.nitrogen.isAlert
              ? "bg-linear-to-br from-red-50/80 via-white to-rose-50/40 border-red-500 ring-2 ring-red-300 shadow-xs"
              : "bg-stone-50 border-stone-200"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sprout className={`w-4 h-4 ${metricAlerts.nitrogen.isAlert ? "text-red-600" : "text-emerald-700"}`} />
                <span className="font-bold text-xs text-stone-800">৩. নাইট্রোজেন (N - ইউরিয়া পুষ্টি):</span>
                {metricAlerts.nitrogen.isAlert && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] animate-pulse flex items-center gap-0.5 shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-white" />
                      <span>সীমার বাইরে সতর্কতা</span>
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "NITROGEN" ? null : "NITROGEN")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                    metricAlerts.nitrogen.isAlert
                      ? "text-red-800 bg-red-100 hover:bg-red-200 border-red-300 font-extrabold"
                      : "text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
                  }`}
                  title="টুলটিপ দেখতে ক্লিক করুন"
                >
                  <Info className="w-3 h-3" />
                  <span>{metricAlerts.nitrogen.isAlert ? "🚨 সতর্কবার্তা টুলটিপ" : "আদর্শ মানদণ্ড"}</span>
                </button>

                <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg border ${
                  metricAlerts.nitrogen.isAlert
                    ? "bg-red-600 text-white border-red-700 shadow-2xs"
                    : "bg-white text-stone-900 border-stone-300"
                }`}>
                  {nitrogenKgHa} kg/ha
                </span>
              </div>
            </div>

            <input
              type="range"
              min="40"
              max="360"
              step="5"
              value={nitrogenKgHa}
              onChange={(e) => setNitrogenKgHa(parseInt(e.target.value))}
              className={`w-full cursor-pointer h-2 rounded-lg ${
                metricAlerts.nitrogen.isAlert ? "accent-red-600 bg-red-200" : "accent-emerald-700 bg-stone-200"
              }`}
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span className="text-red-600 font-bold">৪০ kg/ha (তীব্র ঘাটতি)</span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-1 rounded">১৪০ – ২৪০ kg/ha (আদর্শ সুষম সীমা)</span>
              <span className="text-red-700 font-bold">৩৬০ kg/ha (অতিরিক্ত বিষাক্ততা)</span>
            </div>

            {/* Inline Alert / Tooltip Card */}
            {renderAlertTooltip(metricAlerts.nitrogen)}
          </div>

          {/* PARAMETER 4: PHOSPHORUS (P) SLIDER */}
          <div className={`space-y-2 p-4 rounded-2xl border transition-all ${
            metricAlerts.phosphorus.isAlert
              ? "bg-linear-to-br from-red-50/80 via-white to-rose-50/40 border-red-500 ring-2 ring-red-300 shadow-xs"
              : "bg-stone-50 border-stone-200"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sprout className={`w-4 h-4 ${metricAlerts.phosphorus.isAlert ? "text-red-600" : "text-amber-600"}`} />
                <span className="font-bold text-xs text-stone-800">৪. ফসফরাস (P - টিএসপি/ডিএপি পুষ্টি):</span>
                {metricAlerts.phosphorus.isAlert && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] animate-pulse flex items-center gap-0.5 shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-white" />
                      <span>সীমার বাইরে সতর্কতা</span>
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "PHOSPHORUS" ? null : "PHOSPHORUS")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                    metricAlerts.phosphorus.isAlert
                      ? "text-red-800 bg-red-100 hover:bg-red-200 border-red-300 font-extrabold"
                      : "text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
                  }`}
                  title="টুলটিপ দেখতে ক্লিক করুন"
                >
                  <Info className="w-3 h-3" />
                  <span>{metricAlerts.phosphorus.isAlert ? "🚨 সতর্কবার্তা টুলটিপ" : "আদর্শ মানদণ্ড"}</span>
                </button>

                <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg border ${
                  metricAlerts.phosphorus.isAlert
                    ? "bg-red-600 text-white border-red-700 shadow-2xs"
                    : "bg-white text-stone-900 border-stone-300"
                }`}>
                  {phosphorusKgHa} kg/ha
                </span>
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="75"
              step="1"
              value={phosphorusKgHa}
              onChange={(e) => setPhosphorusKgHa(parseInt(e.target.value))}
              className={`w-full cursor-pointer h-2 rounded-lg ${
                metricAlerts.phosphorus.isAlert ? "accent-red-600 bg-red-200" : "accent-amber-600 bg-stone-200"
              }`}
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span className="text-red-600 font-bold">৫ kg/ha (তীব্র সংকট)</span>
              <span className="text-amber-800 font-bold bg-amber-100 px-1 rounded">২৫ – ৫০ kg/ha (আদর্শ সীমা)</span>
              <span className="text-orange-700 font-bold">৭৫ kg/ha (উচ্চ সঞ্চয়)</span>
            </div>

            {/* Inline Alert / Tooltip Card */}
            {renderAlertTooltip(metricAlerts.phosphorus)}
          </div>

          {/* PARAMETER 5: POTASSIUM (K) SLIDER */}
          <div className={`space-y-2 p-4 rounded-2xl border transition-all ${
            metricAlerts.potassium.isAlert
              ? "bg-linear-to-br from-red-50/80 via-white to-rose-50/40 border-red-500 ring-2 ring-red-300 shadow-xs"
              : "bg-stone-50 border-stone-200"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sprout className={`w-4 h-4 ${metricAlerts.potassium.isAlert ? "text-red-600" : "text-purple-600"}`} />
                <span className="font-bold text-xs text-stone-800">৫. পটাশিয়াম (K - এমওপি পুষ্টি):</span>
                {metricAlerts.potassium.isAlert && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] animate-pulse flex items-center gap-0.5 shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-white" />
                      <span>সীমার বাইরে সতর্কতা</span>
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "POTASSIUM" ? null : "POTASSIUM")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                    metricAlerts.potassium.isAlert
                      ? "text-red-800 bg-red-100 hover:bg-red-200 border-red-300 font-extrabold"
                      : "text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
                  }`}
                  title="টুলটিপ দেখতে ক্লিক করুন"
                >
                  <Info className="w-3 h-3" />
                  <span>{metricAlerts.potassium.isAlert ? "🚨 সতর্কবার্তা টুলটিপ" : "আদর্শ মানদণ্ড"}</span>
                </button>

                <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg border ${
                  metricAlerts.potassium.isAlert
                    ? "bg-red-600 text-white border-red-700 shadow-2xs"
                    : "bg-white text-stone-900 border-stone-300"
                }`}>
                  {potassiumKgHa} kg/ha
                </span>
              </div>
            </div>

            <input
              type="range"
              min="50"
              max="400"
              step="5"
              value={potassiumKgHa}
              onChange={(e) => setPotassiumKgHa(parseInt(e.target.value))}
              className={`w-full cursor-pointer h-2 rounded-lg ${
                metricAlerts.potassium.isAlert ? "accent-red-600 bg-red-200" : "accent-purple-600 bg-stone-200"
              }`}
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span className="text-red-600 font-bold">৫০ kg/ha (তীব্র সংকট)</span>
              <span className="text-purple-800 font-bold bg-purple-100 px-1 rounded">১৬০ – ৩০০ kg/ha (আদর্শ সীমা)</span>
              <span className="text-purple-900 font-bold">৪০০ kg/ha (উচ্চ মাত্রা)</span>
            </div>

            {/* Inline Alert / Tooltip Card */}
            {renderAlertTooltip(metricAlerts.potassium)}
          </div>

          {/* Action Button: Save Soil Record */}
          <button
            onClick={handleSaveRecord}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>মাটির স্বাস্থ্য লগ সংরক্ষণ করুন (Save to Soil Health History)</span>
          </button>
        </div>

        {/* RIGHT COLUMN: REAL-TIME HEALTH STATUS GAUGE & PRESCRIPTION (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* A. VISUAL SOIL HEALTH STATUS GAUGE CARD */}
          <div className={`p-6 sm:p-7 rounded-3xl bg-linear-to-br ${analysis.statusTheme} shadow-xl space-y-5 border border-white/20`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold">
                  সার্বিক মৃত্তিকা স্বাস্থ্য সূচক
                </span>
                <h3 className="text-lg font-black mt-2 text-white">
                  {analysis.statusLabelBn}
                </h3>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex flex-col items-center justify-center border border-white/30 shrink-0">
                <span className="text-2xl font-black font-mono leading-none text-white">
                  {analysis.weightedScore}
                </span>
                <span className="text-[10px] text-stone-200 font-bold">/ ১০০</span>
              </div>
            </div>

            {/* Health Meter Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-stone-100">
                <span>স্বাস্থ্য মানদণ্ড</span>
                <span className="font-bold">{analysis.weightedScore}% সক্ষমতা</span>
              </div>
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-amber-400 to-emerald-400"
                  style={{ width: `${analysis.weightedScore}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xs text-stone-100 leading-relaxed bg-black/15 p-3 rounded-2xl border border-white/10">
              {analysis.statusDescriptionBn}
            </p>

            {/* Mini Metric Badges Grid with Dynamic Red Alert Indicators */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* pH Mini Badge */}
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === "PH" ? null : "PH")}
                className={`p-2.5 rounded-xl backdrop-blur-xs border text-left transition-all cursor-pointer ${
                  metricAlerts.ph.isAlert
                    ? "bg-red-600/40 border-red-400 ring-2 ring-red-400/60 shadow-xs"
                    : "bg-white/10 border-white/15 hover:bg-white/15"
                }`}
                title="পিএইচ বিস্তারিত ও সতর্কতা দেখুন"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-200">পিএইচ (pH):</span>
                  {metricAlerts.ph.isAlert ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                      <span className="text-[9px] font-bold text-red-200 bg-red-950/70 px-1 rounded">সতর্কতা</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-emerald-300">আদর্শ</span>
                  )}
                </div>
                <span className="font-bold text-white text-sm block mt-0.5">{ph.toFixed(1)}</span>
              </button>

              {/* Moisture Mini Badge */}
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <span className="text-[10px] text-stone-200 block">আর্দ্রতা (Moisture):</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{moisturePct}%</span>
              </div>

              {/* Nitrogen Mini Badge */}
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === "NITROGEN" ? null : "NITROGEN")}
                className={`p-2.5 rounded-xl backdrop-blur-xs border text-left transition-all cursor-pointer ${
                  metricAlerts.nitrogen.isAlert
                    ? "bg-red-600/40 border-red-400 ring-2 ring-red-400/60 shadow-xs"
                    : "bg-white/10 border-white/15 hover:bg-white/15"
                }`}
                title="নাইট্রোজেন বিস্তারিত ও সতর্কতা দেখুন"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-200">নাইট্রোজেন (N):</span>
                  {metricAlerts.nitrogen.isAlert ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                      <span className="text-[9px] font-bold text-red-200 bg-red-950/70 px-1 rounded">সতর্কতা</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-emerald-300">আদর্শ</span>
                  )}
                </div>
                <span className="font-bold text-white text-sm block mt-0.5">{nitrogenKgHa} kg/ha</span>
              </button>

              {/* Phosphorus & Potassium Mini Badge */}
              <button
                type="button"
                onClick={() => {
                  if (metricAlerts.phosphorus.isAlert) {
                    setActiveTooltip(activeTooltip === "PHOSPHORUS" ? null : "PHOSPHORUS");
                  } else if (metricAlerts.potassium.isAlert) {
                    setActiveTooltip(activeTooltip === "POTASSIUM" ? null : "POTASSIUM");
                  } else {
                    setActiveTooltip(activeTooltip === "PHOSPHORUS" ? null : "PHOSPHORUS");
                  }
                }}
                className={`p-2.5 rounded-xl backdrop-blur-xs border text-left transition-all cursor-pointer ${
                  metricAlerts.phosphorus.isAlert || metricAlerts.potassium.isAlert
                    ? "bg-red-600/40 border-red-400 ring-2 ring-red-400/60 shadow-xs"
                    : "bg-white/10 border-white/15 hover:bg-white/15"
                }`}
                title="ফসফরাস ও পটাশ বিস্তারিত দেখুন"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-200">ফসফরাস ও পটাশ:</span>
                  {(metricAlerts.phosphorus.isAlert || metricAlerts.potassium.isAlert) ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                      <span className="text-[9px] font-bold text-red-200 bg-red-950/70 px-1 rounded">সতর্কতা</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-emerald-300">আদর্শ</span>
                  )}
                </div>
                <span className="font-bold text-white text-xs block mt-0.5">P:{phosphorusKgHa} · K:{potassiumKgHa}</span>
              </button>
            </div>
          </div>

          {/* B. ACTIONABLE AGRONOMIC PRESCRIPTION (ডিএই ও বিএআরআই নির্দেশিকা) */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-stone-900">
                  সুপারিশকৃত কৃষি প্রেসক্রিপশন
                </h4>
                <span className="text-[10px] text-stone-500">
                  মাটির বর্তমান অবস্থা অনুযায়ী বিঘা প্রতি প্রয়োজনীয় সংশোধন
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {analysis.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="font-medium">{rec}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                পরামর্শ: সার প্রয়োগের সময় জমিতে হালকা 'জো' বা আর্দ্রতা বজায় রাখুন। তীব্র রোদে সার ছিটানো থেকে বিরত থাকুন।
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. SOIL HEALTH LOG HISTORY (সংরক্ষিত মাটির পরীক্ষার তালিকা) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                মাটির স্বাস্থ্য পরীক্ষার সংরক্ষিত লগ হিস্ট্রি ({records.length}টি রেকর্ড)
              </h3>
              <p className="text-xs text-stone-500">
                পূর্বে সংরক্ষিত প্লটের পরীক্ষার ফলাফল ও অগ্রগতি
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold">
            Audit Trail Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-mono text-[11px] bg-stone-50/70">
                <th className="py-3 px-3">তারিখ ও আইডি</th>
                <th className="py-3 px-3">জমির নাম ও উপজেলা</th>
                <th className="py-3 px-3">ফসল ও মাটি</th>
                <th className="py-3 px-3">pH মাত্রা</th>
                <th className="py-3 px-3">আর্দ্রতা</th>
                <th className="py-3 px-3">এনপিকে (N-P-K)</th>
                <th className="py-3 px-3">স্বাস্থ্য স্কোর</th>
                <th className="py-3 px-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-stone-900 block">{rec.date}</span>
                    <span className="font-mono text-[10px] text-stone-400">{rec.id}</span>
                  </td>
                  <td className="py-3.5 px-3 font-medium">
                    <span className="text-stone-900 font-bold block">{rec.plotName}</span>
                    <span className="text-stone-500 text-[11px]">{rec.upazila}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-stone-900 font-medium block">{rec.cropName}</span>
                    <span className="text-stone-400 text-[11px]">{rec.soilType}</span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-800">
                    {rec.ph.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-700">
                    {rec.moisturePct}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-stone-700">
                    N:{rec.nitrogenKgHa} · P:{rec.phosphorusKgHa} · K:{rec.potassiumKgHa}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-black text-sm text-stone-900">
                      {rec.healthScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.healthStatus === "OPTIMAL"
                        ? "bg-emerald-100 text-emerald-800"
                        : rec.healthStatus === "MODERATE"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {rec.healthStatus === "OPTIMAL" ? "উত্তম" : rec.healthStatus === "MODERATE" ? "মধ্যম" : "সংকটজনক"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
