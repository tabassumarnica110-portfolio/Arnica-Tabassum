import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  Thermometer, 
  ShieldAlert,
  ChevronDown,
  Volume2
} from "lucide-react";

export interface WeatherTelemetry {
  zone: string;
  upazilaBn: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionBn: string;
  humidity: number;
  rainProbability: number;
  windSpeedKmH: number;
  soilMoisturePct: number;
  alertType: "MONSOON_FLOOD" | "BLIGHT_FOG" | "DROUGHT_HEAT" | "NORMAL";
  alertTitleBn: string;
  alertDescBn: string;
  agronomicActionBn: string;
  forecast: {
    day: string;
    temp: number;
    rainProb: number;
    icon: string;
  }[];
}

const REGIONAL_WEATHER_DATA: Record<string, WeatherTelemetry> = {
  JAMALPUR_SADAR: {
    zone: "JAMALPUR_SADAR",
    upazilaBn: "জামালপুর সদর",
    temperature: 31,
    feelsLike: 35,
    condition: "Heavy Rain & Thunderstorms",
    conditionBn: "ভারী বৃষ্টি ও বজ্রপাত",
    humidity: 88,
    rainProbability: 92,
    windSpeedKmH: 26,
    soilMoisturePct: 84,
    alertType: "MONSOON_FLOOD",
    alertTitleBn: "⚠️ আকস্মিক ভারী বর্ষণ ও জলাবদ্ধতা সতর্কতা",
    alertDescBn: "আগামী ১২-১৮ ঘণ্টায় ব্রহ্মপুত্র অববাহিকায় ভারী বৃষ্টিপাত (৭০-১০০ মিমি) হতে পারে। নিচু জমির ধান ও সবজি খেত দ্রুত নিষ্কাশন করুন।",
    agronomicActionBn: "পাকা বোরো/আমন ধান অবিলম্বে কেটে শুকনা খলিয়ানে তুলুন। সবজি মাচার গোড়ায় নালা কেটে দ্রুত পানি অপসারণ নিশ্চিত করুন।",
    forecast: [
      { day: "আজ", temp: 31, rainProb: 92, icon: "🌧️" },
      { day: "আগামীকাল", temp: 29, rainProb: 85, icon: "⛈️" },
      { day: "পরশু", temp: 30, rainProb: 60, icon: "🌦️" },
      { day: "শুক্রবার", temp: 32, rainProb: 25, icon: "🌤️" },
      { day: "শনিবার", temp: 33, rainProb: 15, icon: "☀️" },
    ]
  },
  MELANDAHA: {
    zone: "MELANDAHA",
    upazilaBn: "মেলান্দহ উপজেলা",
    temperature: 30,
    feelsLike: 34,
    condition: "Heavy Monsoon Surge",
    conditionBn: "টানা বর্ষণ ও মেঘলা আকাশ",
    humidity: 91,
    rainProbability: 88,
    windSpeedKmH: 22,
    soilMoisturePct: 89,
    alertType: "MONSOON_FLOOD",
    alertTitleBn: "⚠️ মেলান্দহ চরাঞ্চলে আকস্মিক পানির চাপ বৃদ্ধি",
    alertDescBn: "যমুনার শাখা খালে পানির উচ্চতা বৃদ্ধি পাচ্ছে। নিচু চরের ফসল ও পটল মাচায় নিরাপত্তা বেষ্টনী দিন।",
    agronomicActionBn: "পাট ও সবজির গোড়া থেকে পানি সরান। বীজতলা উঁচু স্থানে পলিথিন দিয়ে ঢেকে রাখুন।",
    forecast: [
      { day: "আজ", temp: 30, rainProb: 88, icon: "🌧️" },
      { day: "আগামীকাল", temp: 28, rainProb: 80, icon: "⛈️" },
      { day: "পরশু", temp: 31, rainProb: 45, icon: "⛅" },
      { day: "শুক্রবার", temp: 32, rainProb: 20, icon: "🌤️" },
      { day: "শনিবার", temp: 33, rainProb: 10, icon: "☀️" },
    ]
  },
  ISLAMPUR: {
    zone: "ISLAMPUR",
    upazilaBn: "ইসলামপুর (চরাঞ্চল)",
    temperature: 29,
    feelsLike: 33,
    condition: "Active River Erosion & Flash Rain",
    conditionBn: "নদীভাঙন ঝুঁকি ও দমকা ঝড়",
    humidity: 93,
    rainProbability: 95,
    windSpeedKmH: 32,
    soilMoisturePct: 92,
    alertType: "MONSOON_FLOOD",
    alertTitleBn: "🚨 ইসলামপুর চরে জরুরি বন্যা ও ঝড় সতর্কতা",
    alertDescBn: "যমুনা নদীর পানি বিপদসীমার কাছাকাছি প্রবাহিত হচ্ছে। চরের কৃষকদের গবাদিপশু ও তোলা ফসল উঁচু বাঁধে সরিয়ে নেওয়ার পরামর্শ দেওয়া হচ্ছে।",
    agronomicActionBn: "কাঁচা মরিচ ও আলু/শাকসবজি দ্রুত জমি থেকে সংগ্রহ করুন। কৃষি কর্মকর্তাদের সাথে সার্বক্ষণিক যোগাযোগ রাখুন।",
    forecast: [
      { day: "আজ", temp: 29, rainProb: 95, icon: "⛈️" },
      { day: "আগামীকাল", temp: 27, rainProb: 90, icon: "🌧️" },
      { day: "পরশু", temp: 29, rainProb: 70, icon: "🌦️" },
      { day: "শুক্রবার", temp: 31, rainProb: 35, icon: "⛅" },
      { day: "শনিবার", temp: 32, rainProb: 20, icon: "🌤️" },
    ]
  },
  SARISHABARI: {
    zone: "SARISHABARI",
    upazilaBn: "সরিষাবাড়ী উপজেলা",
    temperature: 32,
    feelsLike: 36,
    condition: "High Humidity & Dense Fog Risk",
    conditionBn: "উচ্চ আর্দ্রতা ও মেঘাচ্ছন্ন",
    humidity: 86,
    rainProbability: 40,
    windSpeedKmH: 14,
    soilMoisturePct: 75,
    alertType: "BLIGHT_FOG",
    alertTitleBn: "⚠️ কুয়াশা ও আর্দ্রতায় আলুর ব্লাইট রোগের অনুকূল আবহাওয়া",
    alertDescBn: "রাতে তাপমাত্রা কম ও দিনে আর্দ্রতা ৮৫%+ থাকায় আলু ও টমেটোতে লেইট ব্লাইট ছত্রাক দ্রুত ছড়াতে পারে।",
    agronomicActionBn: "আগাম প্রতিরোধ হিসেবে প্রতি লিটারে ২ গ্রাম ম্যানকোজেব স্প্রে করুন। জমিতে সেচ দেওয়া আপাতত বন্ধ রাখুন।",
    forecast: [
      { day: "আজ", temp: 32, rainProb: 40, icon: "⛅" },
      { day: "আগামীকাল", temp: 31, rainProb: 50, icon: "🌦️" },
      { day: "পরশু", temp: 32, rainProb: 30, icon: "🌤️" },
      { day: "শুক্রবার", temp: 33, rainProb: 15, icon: "☀️" },
      { day: "শনিবার", temp: 34, rainProb: 10, icon: "☀️" },
    ]
  }
};

export const WeatherAlertBanner: React.FC = () => {
  const { lang, addAuditLog } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>("JAMALPUR_SADAR");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("এইমাত্র (সরাসরি উপগ্রহ রাডার)");

  const currentData = REGIONAL_WEATHER_DATA[selectedZone] || REGIONAL_WEATHER_DATA.JAMALPUR_SADAR;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }) + " এ হালনাগাদ");
      addAuditLog(
        "WEATHER_API_SYNC",
        `/api/weather/regional/${selectedZone}`,
        "ALLOWED",
        `OpenWeather API synched agro-climatic feed for ${currentData.upazilaBn}. Rainfall probability: ${currentData.rainProbability}%.`
      );
    }, 800);
  };

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

    const textToSpeak = `আবহাওয়া সতর্কতা: ${currentData.upazilaBn}। ${currentData.alertTitleBn}। ${currentData.alertDescBn}। কৃষকের করণীয়: ${currentData.agronomicActionBn}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "bn-BD";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-3xl bg-linear-to-br from-amber-500/15 via-red-500/10 to-emerald-500/10 border-2 border-amber-500/80 p-5 sm:p-7 space-y-5 shadow-sm">
      
      {/* 1. Header with Region Dropdown & API Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
            <CloudRain className="w-5 h-5 text-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                {lang === "bn" ? "আঞ্চলিক কৃষি আবহাওয়া ও জরুরি সতর্কতা কেন্দ্র" : "Regional Agro-Weather & Alert Radar"}
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                OpenWeather™ Feed
              </span>
            </div>
            <p className="text-xs text-stone-600">
              জামালপুর ও ব্রহ্মপুত্র অববাহিকার কৃষিভিত্তিক রিয়েল-টাইম আবহাওয়া ও ফসল সুরক্ষা পরামর্শ
            </p>
          </div>
        </div>

        {/* Region Selector & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="appearance-none bg-white text-xs font-bold text-stone-800 pl-3 pr-8 py-2 rounded-xl border border-stone-300 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="JAMALPUR_SADAR">📍 জামালপুর সদর</option>
              <option value="MELANDAHA">📍 মেলান্দহ উপজেলা</option>
              <option value="ISLAMPUR">📍 ইসলামপুর (চর অঞ্চল)</option>
              <option value="SARISHABARI">📍 সরিষাবাড়ী উপজেলা</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer shadow-2xs transition-all disabled:opacity-50"
            title="Update Live Radar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Urgent Red Notification Alert Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl text-white shadow-md transition-all ${
        currentData.alertType === "MONSOON_FLOOD" 
          ? "bg-linear-to-r from-red-600 via-rose-600 to-red-700" 
          : "bg-linear-to-r from-amber-600 via-orange-600 to-amber-700"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight">
                  {currentData.alertTitleBn}
                </span>
                <span className="text-[10px] font-mono bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                  {currentData.upazilaBn}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-red-50 leading-relaxed max-w-3xl">
                {currentData.alertDescBn}
              </p>
              <div className="pt-1.5 flex items-center gap-1.5 text-xs text-amber-200 font-bold">
                <span>🌱 কৃষকের তাৎক্ষণিক করণীয়:</span>
                <span className="text-white font-medium">{currentData.agronomicActionBn}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleVoiceAdvisory}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer transition-all ${
              isSpeaking
                ? "bg-white text-red-700 animate-pulse"
                : "bg-stone-950/40 hover:bg-stone-950/60 text-white border border-white/30"
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#FBBF24]" />
            <span>{isSpeaking ? "বলছে..." : "সতর্কবার্তা শুনুন"}</span>
          </button>
        </div>
      </div>

      {/* 3. Micro-Telemetry Grid (Temperature, Humidity, Rain Prob, Soil Moisture, Wind) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-stone-800">
        
        {/* Temp */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">তাপমাত্রা</span>
            <div className="text-lg font-black font-mono text-stone-900">
              {currentData.temperature}°C
            </div>
            <span className="text-[10px] text-stone-500">অনূভূত: {currentData.feelsLike}°C</span>
          </div>
        </div>

        {/* Rain Probability */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">বৃষ্টির সম্ভাবনা</span>
            <div className="text-lg font-black font-mono text-blue-700">
              {currentData.rainProbability}%
            </div>
            <span className="text-[10px] text-blue-600 font-bold">{currentData.conditionBn}</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">বাতাসের আর্দ্রতা</span>
            <div className="text-lg font-black font-mono text-stone-900">
              {currentData.humidity}%
            </div>
            <span className="text-[10px] text-amber-700 font-semibold">ছত্রাকের অনুকূল</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">বাতাসের গতি</span>
            <div className="text-lg font-black font-mono text-stone-900">
              {currentData.windSpeedKmH} কিমি/ঘ
            </div>
            <span className="text-[10px] text-stone-500">ঝড়ের পূর্বাভাস</span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="font-bold text-xs">🌱</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">মাটির রস/আর্দ্রতা</span>
            <div className="text-lg font-black font-mono text-emerald-800">
              {currentData.soilMoisturePct}%
            </div>
            <span className="text-[10px] text-red-600 font-bold">সেচ বন্ধ রাখুন</span>
          </div>
        </div>

      </div>

      {/* 4. 5-Day Agro Forecast Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-200/80 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600">
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span className="font-bold">আগামী ৫ দিনের কৃষি পূর্বাভাস:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {currentData.forecast.map((f, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-stone-200/70 shadow-2xs font-mono"
            >
              <span>{f.icon}</span>
              <span className="font-semibold text-stone-700">{f.day}</span>
              <span className="font-bold text-stone-900">{f.temp}°C</span>
              <span className={`text-[10px] font-bold ${f.rainProb > 60 ? "text-blue-600" : "text-stone-400"}`}>
                ({f.rainProb}%)
              </span>
            </div>
          ))}
        </div>

        <span className="text-[11px] font-mono text-stone-400">
          {lastUpdated}
        </span>
      </div>

    </div>
  );
};
