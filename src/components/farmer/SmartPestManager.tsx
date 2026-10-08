import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Bug, 
  ShieldCheck, 
  AlertTriangle, 
  Leaf, 
  FlaskConical, 
  Volume2, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Filter
} from "lucide-react";

export interface PestIntervention {
  id: string;
  cropBn: string;
  diseaseNameBn: string;
  scientificName: string;
  recentDetectionDateBn: string;
  severity: "HIGH" | "MEDIUM" | "PREVENTIVE";
  organicSolution: {
    titleBn: string;
    materialsBn: string;
    preparationBn: string;
    applicationRateBn: string;
    safetyPeriodBn: string;
  };
  chemicalSolution: {
    titleBn: string;
    activeIngredientBn: string;
    commercialTradeNameBn: string;
    dosagePerLiterBn: string;
    phiDaysBn: string; // Pre-Harvest Interval
    timingBn: string;
  };
  expertNoteBn: string;
}

const INTERVENTIONS_DATA: PestIntervention[] = [
  {
    id: "PI-01",
    cropBn: "আলু (Potato)",
    diseaseNameBn: "আলুর পাতা ধসা রোগ (লেইট ব্লাইট)",
    scientificName: "Phytophthora infestans",
    recentDetectionDateBn: "গত সপ্তাহে সনাক্ত",
    severity: "HIGH",
    organicSolution: {
      titleBn: "ট্রাইকোডার্মা ও নিম তেলের প্রতিরোধক মিশ্রণ",
      materialsBn: "ট্রাইকোডার্মা ভিরিডি + প্রাকৃতিক নিম তেল (৫ মিলি) + গুঁড়ো সাবান (২ গ্রাম)",
      preparationBn: "প্রথমে সামান্য কুসুম গরম পানিতে গুঁড়ো সাবান ও নিম তেল মিশিয়ে ইমালশন বানান, তারপর প্রতি লিটার পানিতে স্প্রে করুন।",
      applicationRateBn: "প্রতি ৭ দিন পর পর সকালের মিষ্টি রোদে পুরো গাছে পাতার নিচে স্প্রে করুন।",
      safetyPeriodBn: "শতভাগ নিরাপদ, স্প্রে করার ২ দিন পরেই আলু তোলা যায়।"
    },
    chemicalSolution: {
      titleBn: "সিস্টেমিক ও স্পর্শক ডাবল অ্যাকশন ছত্রাকনাশক",
      activeIngredientBn: "ম্যানকোজেব ৬৪% + সাইমোক্সানিল ৮% ডব্লিউপি",
      commercialTradeNameBn: "কার্জেট এম-৮ বা এক্রোবেট এমজেড / রিডোমিল গোল্ড",
      dosagePerLiterBn: "প্রতি লিটার পানিতে ২ গ্রাম হারে গুলে স্প্রে",
      phiDaysBn: "তোলার ৭ দিন পূর্বে স্প্রে বন্ধ করতে হবে (PHI: ৭ দিন)",
      timingBn: "কুয়াশাচ্ছন্ন আবহাওয়ায় বিকালের ঠাণ্ডা বাতাসে স্প্রে করুন।"
    },
    expertNoteBn: "আক্রান্ত গাছের পাতা কেটে মাটিতে পুঁতে ধ্বংস করুন। নাইট্রোজেন সারের উপরিপ্রয়োগ সাময়িকভাবে বন্ধ রাখুন।"
  },
  {
    id: "PI-02",
    cropBn: "বোরো ধান (Rice)",
    diseaseNameBn: "শীষ ও পাতা ব্লাস্ট রোগ",
    scientificName: "Magnaporthe oryzae",
    recentDetectionDateBn: "চলতি মৌসুমে সনাক্ত",
    severity: "HIGH",
    organicSolution: {
      titleBn: "কাঁচা গোবর ও ছাইয়ের তরল নির্যাস বা ব্যাকটেরিয়াল শীল্ড",
      materialsBn: "টাটকা গোবর (৫ কেজি) + কাঠকয়লার ছাই (১ কেজি) + পানি (২০ লিটার)",
      preparationBn: "মিশ্রণটি ৩ দিন ভিজিয়ে রেখে পাতলা কাপড়ে ছেঁকে ধানের শীষে স্প্রে করুন। এতে সিলিকার স্তর তৈরি হয়।",
      applicationRateBn: "বিঘা প্রতি ৪০-৫০ লিটার দ্রবণ স্প্রে করুন।",
      safetyPeriodBn: "প্রাকৃতিক জৈব উপাদান, কোনো বিষাক্ততা নেই।"
    },
    chemicalSolution: {
      titleBn: "ট্রাইসাইক্লাজোল সিস্টেমিক প্রটেকশন",
      activeIngredientBn: "ট্রাইসাইক্লাজোল ৭৫% ডব্লিউপি (Tricyclazole)",
      commercialTradeNameBn: "ট্রুপার ৭৫ ডব্লিউপি / নাটিভো ৭৫ ডব্লিউজি",
      dosagePerLiterBn: "প্রতি লিটার পানিতে ০.৭৫ - ১ গ্রাম",
      phiDaysBn: "ধান কাটার ২১ দিন পূর্বে স্প্রে বন্ধ (PHI: ২১ দিন)",
      timingBn: "শেষ বিকেলে যখন বাতাসের বেগ কম থাকে।"
    },
    expertNoteBn: "জমির পানি বের করে ২ দিন মাটি শুকিয়ে আবার সেচ দিন। বিঘা প্রতি ৫ কেজি এমওপি সার বাড়তি প্রয়োগ করুন।"
  },
  {
    id: "PI-03",
    cropBn: "বেগুন (Brinjal)",
    diseaseNameBn: "ডগা ও ফল ছিদ্রকারী পোকা",
    scientificName: "Leucinodes orbonalis",
    recentDetectionDateBn: "চলতি সপ্তাহে সনাক্ত",
    severity: "MEDIUM",
    organicSolution: {
      titleBn: "আইপিএম (IPM) যৌন আকর্ষণ ফেরোমোন ফাঁদ",
      materialsBn: "লিউসিন-ল্যুর ফেরোমোন টোপ + প্লাস্টিক ফাঁদ বাটি + সাবান পানি",
      preparationBn: "ফাঁদের বাটিতে ২ ইঞ্চি সাবান পানি রেখে ওপরের ঢাকনায় টোপ ঝুলিয়ে দিন। পুরুষ পোকা আকর্ষিত হয়ে ডুবে মরবে।",
      applicationRateBn: "বিঘা প্রতি ৪-৫টি ফাঁদ মাটির ১.৫ ফুট উঁচুতে স্থাপন করুন।",
      safetyPeriodBn: "শতভাগ বিষমুক্ত, রপ্তানি মানের বেগুন উৎপাদনের জন্য আদর্শ।"
    },
    chemicalSolution: {
      titleBn: "জৈব উৎসজাত কম বিষাক্ত কীটনাশক",
      activeIngredientBn: "এমামেকটিন বেনজোয়েট ৫% এসজি",
      commercialTradeNameBn: "প্রোক্লেইম ৫ এসজি / সাসপেন্ড",
      dosagePerLiterBn: "প্রতি লিটার পানিতে ১ গ্রাম",
      phiDaysBn: "বেগুন তোলার ৩ দিন পূর্বে স্প্রে বন্ধ (PHI: ৩ দিন)",
      timingBn: "পোকার আক্রমণ তীব্র হলে বিকেলে স্প্রে করুন।"
    },
    expertNoteBn: "প্রতি সপ্তাহে আক্রান্ত নেতিয়ে পড়া ডগা ও ছিদ্রযুক্ত বেগুন ধারালো ছুরি দিয়ে কেটে মাটিতে পুঁতে ধ্বংস করুন।"
  },
  {
    id: "PI-04",
    cropBn: "কাঁচা মরিচ (Chili)",
    diseaseNameBn: "হলুদ মাকড় ও পাতা কোঁকড়ানো",
    scientificName: "Polyphagotarsonemus latus",
    recentDetectionDateBn: "নজরদারিতে",
    severity: "MEDIUM",
    organicSolution: {
      titleBn: "রসুন ও কাঁচা হলুদের নির্যাস স্প্রে",
      materialsBn: "রসুন বাটা (৫০ গ্রাম) + কাঁচা হলুদ (২৫ গ্রাম) + ডিটারজেন্ট (২ গ্রাম)",
      preparationBn: "সব উপাদান ১ লিটার পানিতে ভালো করে মিশিয়ে ১২ ঘণ্টা ভিজিয়ে ছেঁকে স্প্রে করুন।",
      applicationRateBn: "পাতার উল্টো পিঠে স্প্রে করুন যেখানে মাকড় লুকিয়ে থাকে।",
      safetyPeriodBn: "প্রাকৃতিক মশলা দ্রবণ, কোনো বিষক্রিয়া নেই।"
    },
    chemicalSolution: {
      titleBn: "নির্দিষ্ট মাকড়নাশক (Acaricide)",
      activeIngredientBn: "এবামেকটিন ১.৮% ইসি (Abamectin)",
      commercialTradeNameBn: "ভার্টিমেক বা ওমাইট ৫৭ ইসি",
      dosagePerLiterBn: "প্রতি লিটার পানিতে ১.৫ মিলি",
      phiDaysBn: "মরিচ তোলার ৫ দিন পূর্বে স্প্রে বন্ধ (PHI: ৫ দিন)",
      timingBn: "রৌদ্রোজ্জ্বল সকালে পাতার নিচে ভিজিয়ে স্প্রে করুন।"
    },
    expertNoteBn: "ক্ষেতে সাদা মাছি ও থ্রিপস দমনে হলুদ এবং নীল আঠালো ফাঁদ পাতলে মাকড়ের আক্রমণ ৭০% কমে যায়।"
  }
];

export const SmartPestManager: React.FC = () => {
  const { lang } = useApp();
  const [selectedIntervention, setSelectedIntervention] = useState<PestIntervention>(INTERVENTIONS_DATA[0]);
  const [solutionType, setSolutionType] = useState<"ORGANIC" | "CHEMICAL">("ORGANIC");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleVoiceAdvisory = () => {
    if (!("speechSynthesis" in window)) {
      alert("স্পিচ সিন্থেসিস অডিও সমর্থিত নয়।");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const sol = solutionType === "ORGANIC" ? selectedIntervention.organicSolution : selectedIntervention.chemicalSolution;
    const text = `স্মার্ট পেস্ট ম্যানেজমেন্ট: ${selectedIntervention.cropBn} এর ${selectedIntervention.diseaseNameBn}। সমাধান: ${sol.titleBn}। মাত্রা: ${solutionType === "ORGANIC" ? selectedIntervention.organicSolution.applicationRateBn : selectedIntervention.chemicalSolution.dosagePerLiterBn}। বিশেষজ্ঞ পরামর্শ: ${selectedIntervention.expertNoteBn}`;
    
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
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs">
            <Bug className="w-6 h-6 text-[#FBBF24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "স্মার্ট সমন্বিত বালাই ব্যবস্থাপনা (IPM Advisor)" : "Smart Integrated Pest Management"}
              </h2>
              <span className="text-[11px] font-mono bg-emerald-100 text-[#14532D] px-2.5 py-0.5 rounded-full font-bold">
                DAE Integrated Expert Protocol
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              শনাক্তকৃত রোগের ইতিহাসের ওপর ভিত্তি করে সুনির্দিষ্ট জৈব ও অনুমোদিত রাসায়নিক বালাইনাশকের সঠিক মাত্রা।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceAdvisory}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSpeaking
                ? "bg-red-600 text-white animate-pulse"
                : "bg-stone-100 hover:bg-stone-200 text-stone-800"
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#D97706]" />
            <span>{isSpeaking ? "বন্ধ করুন" : "🔊 প্রেসক্রিপশন শুনুন"}</span>
          </button>
        </div>
      </div>

      {/* 2. Detected Disease History Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {INTERVENTIONS_DATA.map(item => {
          const isSelected = selectedIntervention.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedIntervention(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                isSelected
                  ? "bg-[#14532D] text-white border-[#14532D] shadow-md ring-2 ring-[#14532D]/30"
                  : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                }`}>
                  {item.recentDetectionDateBn}
                </span>
                <span className={`text-xs font-bold ${
                  item.severity === "HIGH" ? "text-red-400" : "text-amber-400"
                }`}>
                  ● {item.severity === "HIGH" ? "উচ্চ ঝুঁকি" : "মাঝারি"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm">{item.cropBn}</h4>
                <p className={`text-xs truncate ${isSelected ? "text-emerald-100" : "text-stone-600"}`}>
                  {item.diseaseNameBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Dual Track Solution Switcher: Organic (Green) vs Chemical (Blue) */}
      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            সমাধানের ধরন নির্বাচন করুন:
          </span>
          <span className="text-xs font-bold text-[#14532D] bg-white px-2.5 py-0.5 rounded-lg border border-stone-200">
            {selectedIntervention.cropBn} · {selectedIntervention.diseaseNameBn}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSolutionType("ORGANIC")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              solutionType === "ORGANIC"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>🌿 ১০০% নিরাপদ জৈব সমাধান</span>
          </button>

          <button
            onClick={() => setSolutionType("CHEMICAL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              solutionType === "CHEMICAL"
                ? "bg-blue-700 text-white shadow-xs"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-300" />
            <span>🧪 অনুমোদিত রাসায়নিক সমাধান</span>
          </button>
        </div>
      </div>

      {/* 4. Active Solution Detail Card */}
      {solutionType === "ORGANIC" ? (
        <div className="rounded-3xl bg-linear-to-br from-emerald-50 via-white to-stone-50 border-2 border-emerald-500/70 p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-100">
            <div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                অর্গানিক বায়ো-কন্ট্রোল প্রেসক্রিপশন
              </span>
              <h3 className="text-xl font-black text-[#14532D] mt-1.5">
                {selectedIntervention.organicSolution.titleBn}
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              নিরাপদ খাদ্য মানসম্পন্ন (GAP)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <span className="font-bold text-[#14532D] uppercase tracking-wider block text-xs">
                প্রয়োজনীয় প্রাকৃতিক উপাদান:
              </span>
              <p className="text-stone-800 leading-relaxed font-medium">
                {selectedIntervention.organicSolution.materialsBn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <span className="font-bold text-[#14532D] uppercase tracking-wider block text-xs">
                প্রস্তুত প্রণালী:
              </span>
              <p className="text-stone-700 leading-relaxed">
                {selectedIntervention.organicSolution.preparationBn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <span className="font-bold text-[#14532D] uppercase tracking-wider block text-xs">
                প্রয়োগ মাত্রা ও সময়:
              </span>
              <p className="text-stone-800 leading-relaxed font-bold">
                {selectedIntervention.organicSolution.applicationRateBn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <span className="font-bold text-[#14532D] uppercase tracking-wider block text-xs">
                নিরাপত্তা সময়সীমা (PHI):
              </span>
              <p className="text-emerald-700 font-bold leading-relaxed">
                {selectedIntervention.organicSolution.safetyPeriodBn}
              </p>
            </div>

          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-linear-to-br from-blue-50 via-white to-stone-50 border-2 border-blue-500/70 p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-blue-100">
            <div>
              <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                ডিএই রেজিস্টার্ড রাসায়নিক বালাইনাশক
              </span>
              <h3 className="text-xl font-black text-blue-950 mt-1.5">
                {selectedIntervention.chemicalSolution.titleBn}
              </h3>
            </div>
            <span className="text-xs font-mono text-red-600 font-bold bg-red-50 px-3 py-1 rounded-xl border border-red-200">
              ⚠️ সঠিক মাত্রা ও সতর্কতা আবশ্যক
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            
            <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-1">
              <span className="font-bold text-blue-900 uppercase tracking-wider block text-xs">
                সক্রিয় উপাদান (Active Ingredient):
              </span>
              <p className="text-stone-800 leading-relaxed font-mono font-bold">
                {selectedIntervention.chemicalSolution.activeIngredientBn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-1">
              <span className="font-bold text-blue-900 uppercase tracking-wider block text-xs">
                বাজারে প্রচলিত অনুমোদিত বাণিজ্যিক নাম:
              </span>
              <p className="text-stone-800 leading-relaxed font-bold">
                {selectedIntervention.chemicalSolution.commercialTradeNameBn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-1">
              <span className="font-bold text-blue-900 uppercase tracking-wider block text-xs">
                প্রতি লিটার পানিতে অনুমোদিত ডোজ:
              </span>
              <p className="text-blue-950 leading-relaxed font-black text-base">
                {selectedIntervention.chemicalSolution.dosagePerLiterBn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-1">
              <span className="font-bold text-red-700 uppercase tracking-wider block text-xs">
                ফসল তোলার কত দিন আগে স্প্রে বন্ধ (PHI):
              </span>
              <p className="text-red-700 font-bold leading-relaxed">
                {selectedIntervention.chemicalSolution.phiDaysBn}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 5. Regional Agricultural Expert Note */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Award className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm">উপজেলা কৃষি সম্প্রসারণ পরামর্শ:</span>
          <p className="mt-1 text-stone-700 leading-relaxed">{selectedIntervention.expertNoteBn}</p>
        </div>
      </div>

    </div>
  );
};
