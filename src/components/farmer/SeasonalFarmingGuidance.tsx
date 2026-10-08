import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Calendar, 
  Sprout, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Volume2, 
  BookOpen, 
  Droplets,
  ShieldCheck,
  PhoneCall,
  Printer
} from "lucide-react";

export type AgriSeason = "RABI" | "KHARIF_1" | "KHARIF_2";

export interface FertilizerStage {
  stageNameBn: string;
  dayIntervalBn: string;
  fertilizers: { nameBn: string; dosePerBighaBn: string; purposeBn: string }[];
  organicInterventionBn: string;
  irrigationTipBn: string;
}

export interface SeasonGuide {
  id: AgriSeason;
  nameBn: string;
  bengaliMonthsBn: string;
  englishMonthsBn: string;
  badgeBn: string;
  focusCropsBn: string[];
  stages: FertilizerStage[];
  govGuidelinesBn: string[];
}

const SEASONAL_DATA: Record<AgriSeason, SeasonGuide> = {
  RABI: {
    id: "RABI",
    nameBn: "রবি মৌসুম (শীতকালীন ফসল)",
    bengaliMonthsBn: "কার্তিক - ফাল্গুন",
    englishMonthsBn: "অক্টোবর - মার্চ",
    badgeBn: "চলতি প্রধান মৌসুম (Active)",
    focusCropsBn: ["বোরো ধান", "ডায়মন্ড আলু", "টমেটো", "কাঁচা মরিচ", "বেগুন", "সরিষা"],
    stages: [
      {
        stageNameBn: "১. জমি প্রস্তুতি ও বুনন পূর্ববর্তী বেসাল ডোজ (Basal)",
        dayIntervalBn: "বপন/রোপণের ২-৩ দিন পূর্বে",
        fertilizers: [
          { nameBn: "ভার্মিকম্পোস্ট / পচা গোবর", dosePerBighaBn: "৩৫০-৪০০ কেজি", purposeBn: "মাটির জৈব কার্বন ও জীবাণু বৃদ্ধি" },
          { nameBn: "সরিষার খৈল (গুঁড়ো)", dosePerBighaBn: "২০-২৫ কেজি", purposeBn: "ধীরে ধীরে পুষ্টি নিঃসরণ" },
          { nameBn: "টিএসপি (TSP) বা ডিএপি", dosePerBighaBn: "১৮ কেজি", purposeBn: "শিকড়ের গভীর বিস্তার" },
          { nameBn: "এমওপি (পটাশ)", dosePerBighaBn: "১৫ কেজি", purposeBn: "রোগ প্রতিরোধ ক্ষমতা ও কন্দ গঠন" },
          { nameBn: "জিপসাম ও জিংক সালফেট", dosePerBighaBn: "১০ কেজি ও ১.৫ কেজি", purposeBn: "সালফার ও মাইক্রোনিউট্রিয়েন্ট ঘাটতি পূরণ" }
        ],
        organicInterventionBn: "জমির শেষ চাষে বিঘা প্রতি ২ কেজি ট্রাইকোডার্মা সমৃদ্ধ জৈব সার ছিটিয়ে দিলে মাটির ক্ষতিকর ছত্রাক ৯৫% ধ্বংস হয়।",
        irrigationTipBn: "মাটিতে 'জো' অবস্থায় হালকা সেচ দিয়ে সমানভাবে মই দিন।"
      },
      {
        stageNameBn: "২. প্রাথমিক কুশি ও চারা গঠন পর্যায়",
        dayIntervalBn: "রোপণের ১৫-২০ দিন পর",
        fertilizers: [
          { nameBn: "ইউরিয়া (১ম কিস্তি)", dosePerBighaBn: "৮-১০ কেজি", purposeBn: "পাতার সতেজতা ও দ্রুত শাখা বিস্তার" },
          { nameBn: "জৈব খৈল পচা তরল নির্যাস", dosePerBighaBn: "১০ লিটার পানিতে গুলিয়ে", purposeBn: "কচি শিকড়ের পুষ্টি শোষণ" }
        ],
        organicInterventionBn: "গাছের গোড়ায় নিড়ানি দিয়ে মাটি আলগা করে দিন যাতে শিকড়ে পর্যাপ্ত অক্সিজেন প্রবেশ করতে পারে।",
        irrigationTipBn: "হালকা সেচ দিন, গোড়ায় পানি জমতে দেবেন না।"
      },
      {
        stageNameBn: "৩. সর্বাধিক কুশি ও কন্দ ফুল ফোটার পর্যায়",
        dayIntervalBn: "রোপণের ৩৫-৪৫ দিন পর",
        fertilizers: [
          { nameBn: "ইউরিয়া (২য় কিস্তি) + এমওপি", dosePerBighaBn: "৮ কেজি + ৫ কেজি", purposeBn: "আলুর কন্দ ও ধানের শীষের ভ্রূণ গঠন" },
          { nameBn: "চিলেটেড জিংক ও বোরন স্প্রে", dosePerBighaBn: "১ গ্রাম/লিটার পানি", purposeBn: "ফুল ঝরা রোধ ও দানার ওজন বৃদ্ধি" }
        ],
        organicInterventionBn: "আলু গাছের গোড়ায় মাটি তুলে দিন যেন কন্দ রোদে সবুজ না হয়। ধানে বিলি কেটে আলো-বাতাস নিশ্চিত করুন।",
        irrigationTipBn: "নিয়মিত রস বজায় রাখুন। রবি ফসলের এই সময়ে রসের ঘাটতি হলে ফলন ৩০% কমে যায়।"
      },
      {
        stageNameBn: "৪. দানা গঠন ও ফসল পরিপক্কতার পর্যায়",
        dayIntervalBn: "ফসল তোলার ১৫-২০ দিন পূর্বে",
        fertilizers: [
          { nameBn: "পটাশিয়াম সালফেট (SOP) স্প্রে", dosePerBighaBn: "২ গ্রাম/লিটার", purposeBn: "মিষ্টতা, চকচকে উজ্জ্বল ত্বক ও ওজন বৃদ্ধি" }
        ],
        organicInterventionBn: "কোনো ধরনের রাসায়নিক কীটনাশক সম্পূর্ণ নিষিদ্ধ। কেবল নিম তেল স্প্রে করা যাবে।",
        irrigationTipBn: "আলু তোলার ১০-১৫ দিন পূর্বে এবং ধান কাটার ৭ দিন পূর্বে জমিতে সেচ সম্পূর্ণ বন্ধ করুন।"
      }
    ],
    govGuidelinesBn: [
      "বাংলাদেশ কৃষি গবেষণা কাউন্সিল (BARC) সার নির্দেশিকা ২০২৩ অনুযায়ী সুষম সার ব্যবহার করলে সারের খরচ ২৫% কমে।",
      "মাটি পরীক্ষার রিপোর্ট অনুযায়ী অম্লীয় মাটিতে শতাংশ প্রতি ১.৫ কেজি ডলোচুন বা জৈব চুন প্রয়োগ করুন।",
      "যেকোনো ফসলে ইউরিয়া সারের অপচয় রোধে গুটি ইউরিয়া (USG) ব্যবহারকে সরকারিভাবে অগ্রাধিকার দেওয়া হয়েছে।"
    ]
  },
  KHARIF_1: {
    id: "KHARIF_1",
    nameBn: "খরিফ-১ মৌসুম (প্রাক-গ্রীষ্মকালীন ফসল)",
    bengaliMonthsBn: "চৈত্র - জ্যৈষ্ঠ",
    englishMonthsBn: "মার্চ - জুন",
    badgeBn: "আগামী মৌসুম (Upcoming)",
    focusCropsBn: ["আউশ ধান", "পটল", "লাউ", "মিষ্টি কুমড়ো", "পাট", "ঢ্যাঁড়শ"],
    stages: [
      {
        stageNameBn: "১. জমি প্রস্তুতি ও আগাম জৈব সার প্রয়োগ",
        dayIntervalBn: "চৈত্র মাসের শুরুতে",
        fertilizers: [
          { nameBn: "ট্রাইকো-কম্পোস্ট সার", dosePerBighaBn: "৩০০ কেজি", purposeBn: "গ্রীষ্মের খরায় মাটির আর্দ্রতা ধরে রাখা" },
          { nameBn: "টিএসপি ও পটাশ", dosePerBighaBn: "১৫ কেজি ও ১২ কেজি", purposeBn: "মূল শক্ত করা" }
        ],
        organicInterventionBn: "সবজি মাচায় খড় বিছিয়ে মালচিং করুন যাতে প্রখর রোদে মাটির পানি শুকিয়ে না যায়।",
        irrigationTipBn: "সকালে বা শেষ বিকেলে ড্রিপ সেচ দিন।"
      },
      {
        stageNameBn: "২. দ্রুত বৃদ্ধি ও ফুল পরাগায়ন পর্যায়",
        dayIntervalBn: "রোপণের ৩০-৪০ দিন পর",
        fertilizers: [
          { nameBn: "তরল ভার্মিওয়াশ স্প্রে", dosePerBighaBn: "৫০ মিলি/১০ লিটার", purposeBn: "স্ত্রী ফুলের সংখ্যা বৃদ্ধি" }
        ],
        organicInterventionBn: "মাছি পোকা দমনে কিউলিউর ফেরোমোন ফাঁদ ব্যবহার করুন।",
        irrigationTipBn: "মাটির আর্দ্রতা অনুযায়ী ৩-৪ দিন পর পর হালকা সেচ দিন।"
      }
    ],
    govGuidelinesBn: [
      "উঁচু মাচায় পটল ও লাউ চাষ করলে বর্ষার আগাম পানিতে লতা পচার ঝুঁকি থাকে না।",
      "আউশ ধানে খরা সহনশীল ব্রি ধান-৪৮ জাত ব্যবহারে সরকারি প্রণোদনা ও বীজ বিতরণ কর্মসূচি চালু রয়েছে।"
    ]
  },
  KHARIF_2: {
    id: "KHARIF_2",
    nameBn: "খরিফ-২ মৌসুম (বর্ষাকালীন আমন ফসল)",
    bengaliMonthsBn: "আষাঢ় - আশ্বিন",
    englishMonthsBn: "জুন - অক্টোবর",
    badgeBn: "বর্ষাকালীন মৌসুম",
    focusCropsBn: ["রোপা আমন ধান", "শাকসবজি (উঁচু ভিটায়)", "আনারস", "পেঁপে"],
    stages: [
      {
        stageNameBn: "১. আমনের কাদাময় জমি প্রস্তুতি ও চারা রোপণ",
        dayIntervalBn: "আষাঢ়ের মাঝামাঝি থেকে শ্রাবণ",
        fertilizers: [
          { nameBn: "পচা গোবর বা সবুজ সার (ধৈঞ্চা)", dosePerBighaBn: "২০০ কেজি", purposeBn: "মাটির জৈব নাইট্রোজেন বৃদ্ধি" },
          { nameBn: "ডিএপি ও পটাশ", dosePerBighaBn: "১২ কেজি ও ১০ কেজি", purposeBn: "শিকড় মজবুতকরণ" }
        ],
        organicInterventionBn: "জমির চারিদিকে ধৈঞ্চা চাষ করলে নাইট্রোজেন বাড়ে এবং পোকামাকড়ের প্রাকৃতিক বাধা সৃষ্টি হয়।",
        irrigationTipBn: "বৃষ্টির পানি জমিতে ধরে রাখতে আইলগুলো উঁচু করে বাঁধুন।"
      }
    ],
    govGuidelinesBn: [
      "বন্যাপ্রবণ নিচু অঞ্চলের জন্য বিঘা প্রতি জলমগ্নতা সহনশীল ব্রি ধান-৫১ বা ব্রি ধান-৫২ জাত রোপণ করুন।",
      "আমন ধানে মাজরা ও পাতা মোড়ানো পোকা দমনে আলোক ফাঁদ ও পার্চিং (গাছের ডাল পুঁতে দেওয়া) পদ্ধতি ব্যবহার করুন।"
    ]
  }
};

export const SeasonalFarmingGuidance: React.FC = () => {
  const { lang, currentUser } = useApp();
  const [activeSeason, setActiveSeason] = useState<AgriSeason>("RABI");
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const season = SEASONAL_DATA[activeSeason];
  const activeStage = season.stages[selectedStageIdx] || season.stages[0];

  const handleVoiceReadout = () => {
    if (!("speechSynthesis" in window)) {
      alert("স্পিচ সিন্থেসিস অডিও সমর্থিত নয়।");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${season.nameBn} এর সার প্রয়োগের নির্দেশিকা। ধাপ: ${activeStage.stageNameBn}। সময়: ${activeStage.dayIntervalBn}। জৈব সার সুপারিশ: ${activeStage.organicInterventionBn}। সেচ পরামর্শ: ${activeStage.irrigationTipBn}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "bn-BD";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-[#FBBF24] flex items-center justify-center font-black shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "মৌসুমি কৃষি নির্দেশিকা ও সরকারি সার ক্যালেন্ডার" : "Seasonal Farming Guidance & Fertilizer Schedule"}
              </h2>
              <span className="text-[11px] font-mono bg-emerald-100 text-[#14532D] px-2.5 py-0.5 rounded-full font-bold">
                BARC / DAE Standard 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              কৃষি সম্প্রসারণ অধিদপ্তর অনুমোদিত সুষম জৈব ও রাসায়নিক সার প্রয়োগের ধাপভিত্তিক সময়সূচি ও পরিচর্যা।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceReadout}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSpeaking
                ? "bg-red-600 text-white animate-pulse"
                : "bg-stone-100 hover:bg-stone-200 text-stone-800"
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#D97706]" />
            <span>{isSpeaking ? "বন্ধ করুন" : "🔊 বাংলায় শুনুন"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>প্রিন্ট শিডিউল</span>
          </button>
        </div>
      </div>

      {/* 2. Season Selector Tabs (Rabi, Kharif-1, Kharif-2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(SEASONAL_DATA) as AgriSeason[]).map(sKey => {
          const s = SEASONAL_DATA[sKey];
          const isSelected = activeSeason === sKey;
          return (
            <button
              key={sKey}
              onClick={() => {
                setActiveSeason(sKey);
                setSelectedStageIdx(0);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? "bg-[#14532D] text-white border-[#14532D] shadow-md ring-2 ring-[#14532D]/30"
                  : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-white/20">
                  {s.bengaliMonthsBn}
                </span>
                <span className={`text-[10px] font-bold ${isSelected ? "text-[#FBBF24]" : "text-emerald-700"}`}>
                  {s.badgeBn}
                </span>
              </div>
              <div>
                <h4 className="font-black text-sm">{s.nameBn}</h4>
                <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-emerald-100" : "text-stone-500"}`}>
                  প্রধান ফসল: {s.focusCropsBn.slice(0, 3).join(", ")}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Stage Timeline Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {season.stages.map((stg, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedStageIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              selectedStageIdx === idx
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>ধাপ {idx + 1}: {stg.stageNameBn.slice(3, 20)}...</span>
          </button>
        ))}
      </div>

      {/* 4. Active Stage Details & Fertilizer Application Dosage Table */}
      <div className="rounded-3xl bg-linear-to-br from-emerald-50/50 via-white to-stone-50 border border-emerald-200 p-6 sm:p-7 space-y-6">
        
        {/* Stage Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-100">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              সময়কাল: {activeStage.dayIntervalBn}
            </span>
            <h3 className="text-xl font-black text-stone-900 mt-1.5">
              {activeStage.stageNameBn}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>প্রতি বিঘা (৩৩ শতক) জমির হিসাব</span>
          </div>
        </div>

        {/* Fertilizer Dosage Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider text-[11px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">সারের নাম (জৈব ও অজৈব)</th>
                <th className="py-3 px-4 font-mono">অনুমোদিত মাত্রা (বিঘা প্রতি)</th>
                <th className="py-3 px-4">কাজের উদ্দেশ্য ও কার্যকারিতা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {activeStage.fertilizers.map((fert, fIdx) => (
                <tr key={fIdx} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>{fert.nameBn}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-800 font-mono">
                    {fert.dosePerBighaBn}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {fert.purposeBn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Organic & Irrigation Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>জৈব সুরক্ষা ও ট্রাইকোডার্মা ব্যবস্থাপনা:</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {activeStage.organicInterventionBn}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>সেচ ও পানি নিষ্কাশন নির্দেশিকা:</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {activeStage.irrigationTipBn}
            </p>
          </div>

        </div>

      </div>

      {/* 5. Official Government Agriculture Extension Policy Strip */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 text-xs text-amber-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-900">
            <Award className="w-4 h-4 text-[#D97706]" />
            <span>বাংলাদেশ সরকার ও ডিএই (DAE) কৃষি সম্প্রসারণ নীতি:</span>
          </div>
          <span className="font-mono text-stone-500">হটলাইন: ১৬১২৩</span>
        </div>

        <ul className="space-y-1.5 list-disc pl-4 text-stone-700">
          {season.govGuidelinesBn.map((g, idx) => (
            <li key={idx} className="leading-relaxed">{g}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};
