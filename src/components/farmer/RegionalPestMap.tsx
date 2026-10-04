import React, { useState, useId } from "react";
import { useApp } from "../../context/AppContext";
import { 
  AlertTriangle, 
  MapPin, 
  Radar, 
  ShieldAlert, 
  ShieldCheck, 
  Bug, 
  PlusCircle, 
  Radio, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Crosshair, 
  Volume2, 
  Send,
  X
} from "lucide-react";

export interface PestIncident {
  id: string;
  zoneId: string;
  upazilaBn: string;
  villageBn: string;
  distanceKm: number;
  cropBn: string;
  pestNameBn: string;
  scientificName: string;
  severity: "HIGH" | "MEDIUM" | "CONTROLLED";
  reportedAgo: string;
  reportedBy: string;
  affectedAcres: number;
  preventiveActionBn: string;
  statusBn: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map pin
}

const INITIAL_PEST_INCIDENTS: PestIncident[] = [
  {
    id: "INC-2026-081",
    zoneId: "MELANDAHA",
    upazilaBn: "মেলান্দহ উপজেলা",
    villageBn: "ঝাউগড়া ও ভাবকী",
    distanceKm: 4.8,
    cropBn: "বোরো ধান",
    pestNameBn: "কারেন্ট পোকা (বাদামি গাছফড়িং - BPH)",
    scientificName: "Nilaparvata lugens",
    severity: "HIGH",
    reportedAgo: "১ ঘণ্টা আগে",
    reportedBy: "কৃষি কর্মকর্তা মোস্তাফিজুর রহমান",
    affectedAcres: 18.5,
    preventiveActionBn: "জমির পানি তাৎক্ষণিক সরিয়ে ফেলুন। গাছের গোড়ায় পর্যাপ্ত আলো-বাতাস নিশ্চিত করতে বিলি কেটে দিন এবং পাইমেট্রোজিন (Plenum) স্প্রে করুন।",
    statusBn: "🔴 লাল সতর্কতা (দ্রুত ছড়াচ্ছে)",
    coordinates: { x: 42, y: 35 }
  },
  {
    id: "INC-2026-082",
    zoneId: "ISLAMPUR",
    upazilaBn: "ইসলামপুর (চর অঞ্চল)",
    villageBn: "কুলকান্দি ও বেলগাছা চর",
    distanceKm: 12.3,
    cropBn: "গোল আলু ও টমেটো",
    pestNameBn: "আলুর পাতা ধসা রোগ (লেইট ব্লাইট স্পোর)",
    scientificName: "Phytophthora infestans",
    severity: "HIGH",
    reportedAgo: "৩ ঘণ্টা আগে",
    reportedBy: "আলহাজ্ব মোকবুল হোসেন (কৃষক)",
    affectedAcres: 24.0,
    preventiveActionBn: "বাতাসে ছত্রাকের রেণু উড়ছে। আশেপাশের ৫ কিমির আলু জমিতে অবিলম্বে প্রতি লিটার পানিতে ২ গ্রাম ম্যানকোজেব স্প্রে করে প্রটেক্টিভ শিল্ড তৈরি করুন।",
    statusBn: "🔴 লাল সতর্কতা (বাতাসে ছড়াচ্ছে)",
    coordinates: { x: 26, y: 22 }
  },
  {
    id: "INC-2026-083",
    zoneId: "JAMALPUR_SADAR",
    upazilaBn: "জামালপুর সদর",
    villageBn: "কেন্দুয়া ও তুলশীরচর",
    distanceKm: 2.1,
    cropBn: "বেগুন ও পটল",
    pestNameBn: "ডগা ও ফল ছিদ্রকারী পোকার কীড়া",
    scientificName: "Leucinodes orbonalis",
    severity: "MEDIUM",
    reportedAgo: "আজ সকালে",
    reportedBy: "ল্যাব মনিটরিং টিম, জেএসটিইউ",
    affectedAcres: 9.2,
    preventiveActionBn: "প্রতি বিঘায় ৪টি করে সেক্স ফেরোমোন ফাঁদ স্থাপন করুন। আক্রান্ত ডগা কেটে ধ্বংস করুন।",
    statusBn: "🟡 হলুদ সতর্কতা (নজরদারিতে)",
    coordinates: { x: 62, y: 55 }
  },
  {
    id: "INC-2026-084",
    zoneId: "SARISHABARI",
    upazilaBn: "সরিষাবাড়ী উপজেলা",
    villageBn: "পোগলদিঘা ও ভাটারা",
    distanceKm: 19.4,
    cropBn: "মিষ্টি কুমড়ো ও লাউ",
    pestNameBn: "মাছি পোকা ও আঠাঝরা রোগ",
    scientificName: "Bactrocera cucurbitae",
    severity: "MEDIUM",
    reportedAgo: "গতকাল",
    reportedBy: "উপজেলা কৃষি সম্প্রসারণ অধিদপ্তর",
    affectedAcres: 14.0,
    preventiveActionBn: "কিউলিউর বিষটোপ ফাঁদ ব্যবহার করুন। কচি কুমড়া ঠোঙ্গা দিয়ে ঢেকে দিন।",
    statusBn: "🟡 হলুদ সতর্কতা (আংশিক নিয়ন্ত্রণে)",
    coordinates: { x: 74, y: 78 }
  },
  {
    id: "INC-2026-085",
    zoneId: "MADARGANJ",
    upazilaBn: "মাদারগঞ্জ উপজেলা",
    villageBn: "কড়ইচড়া",
    distanceKm: 15.6,
    cropBn: "কাঁচা মরিচ",
    pestNameBn: "হলুদ মাকড় ও পাতা কোঁকড়ানো",
    scientificName: "Polyphagotarsonemus latus",
    severity: "CONTROLLED",
    reportedAgo: "২ দিন আগে",
    reportedBy: "জৈব কৃষক সমবায়",
    affectedAcres: 6.5,
    preventiveActionBn: "ভার্টিমেক ও নিম তেল স্প্রে সফলভাবে সম্পন্ন। নতুন প্রাদুর্ভাব নেই।",
    statusBn: "🟢 সবুজ জোন (নিয়ন্ত্রিত)",
    coordinates: { x: 38, y: 68 }
  }
];

export const RegionalPestMap: React.FC = () => {
  const { lang, currentUser, addAuditLog } = useApp();
  const upazilaInputId = useId();
  const villageInputId = useId();
  const cropInputId = useId();
  const pestInputId = useId();
  const severityInputId = useId();

  const [incidents, setIncidents] = useState<PestIncident[]>(INITIAL_PEST_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<PestIncident>(INITIAL_PEST_INCIDENTS[0]);
  const [distanceFilter, setDistanceFilter] = useState<"ALL" | "NEARBY_5KM" | "NEARBY_15KM">("ALL");
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // New Report Form State
  const [newUpazila, setNewUpazila] = useState<string>("জামালপুর সদর");
  const [newVillage, setNewVillage] = useState<string>("");
  const [newCrop, setNewCrop] = useState<string>("ধান");
  const [newPest, setNewPest] = useState<string>("কারেন্ট পোকা (BPH)");
  const [newSeverity, setNewSeverity] = useState<"HIGH" | "MEDIUM">("HIGH");
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Filtered Incidents based on radius
  const filteredIncidents = incidents.filter((item) => {
    if (distanceFilter === "NEARBY_5KM") return item.distanceKm <= 5.0;
    if (distanceFilter === "NEARBY_15KM") return item.distanceKm <= 15.0;
    return true;
  });

  // Nearest Threat within 5km
  const immediateThreat = incidents.find((i) => i.distanceKm <= 5.0 && i.severity === "HIGH");

  const handleSelectIncident = (incident: PestIncident) => {
    setSelectedIncident(incident);
  };

  const handleVoiceBroadcast = () => {
    if (!("speechSynthesis" in window)) {
      alert("স্পিচ সিন্থেসিস অডিও সমর্থিত নয়।");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `আঞ্চলিক পোকা সতর্কতা: ${selectedIncident.upazilaBn} এর ${selectedIncident.villageBn} এলাকায় ${selectedIncident.cropBn} ফসলে ${selectedIncident.pestNameBn} আক্রমণ শনাক্ত হয়েছে। দূরত্ব: আপনার খামার থেকে ${selectedIncident.distanceKm} কিলোমিটার। প্রতিরোধমূলক পরামর্শ: ${selectedIncident.preventiveActionBn}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "bn-BD";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillage.trim()) {
      alert("অনুগ্রহ করে গ্রামের নাম লিখুন।");
      return;
    }

    const newInc: PestIncident = {
      id: `INC-2026-0${incidents.length + 86}`,
      zoneId: "LOCAL_FARMER",
      upazilaBn: newUpazila,
      villageBn: newVillage,
      distanceKm: 1.5,
      cropBn: newCrop,
      pestNameBn: newPest,
      scientificName: "Field Pest Sighting (Under Investigation)",
      severity: newSeverity,
      reportedAgo: "এইমাত্র",
      reportedBy: `${currentUser.name} (যাচাইকৃত কৃষক)`,
      affectedAcres: 3.5,
      preventiveActionBn: "উপজেলা কৃষি কর্মকর্তার পরিদর্শন টিম পাঠানো হয়েছে। আশেপাশের কৃষকদের সতর্ক থাকতে অনুরোধ করা হচ্ছে।",
      statusBn: newSeverity === "HIGH" ? "🔴 লাল সতর্কতা (নতুন রিপোর্ট)" : "🟡 হলুদ সতর্কতা (নতুন রিপোর্ট)",
      coordinates: { x: 55, y: 50 }
    };

    setIncidents([newInc, ...incidents]);
    setSelectedIncident(newInc);
    setReportSuccess(true);

    addAuditLog(
      "PEST_INCIDENT_REPORTED",
      `/farmer/pest-radar/report`,
      "ALLOWED",
      `Farmer ${currentUser.name} reported ${newPest} in ${newVillage}, ${newUpazila}. Distance: 1.5 km.`
    );

    setTimeout(() => {
      setReportSuccess(false);
      setIsReportModalOpen(false);
      setNewVillage("");
    }, 1200);
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
            <Radar className="w-6 h-6 animate-spin text-[#FBBF24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "আঞ্চলিক ক্ষতিকর পোকা ও রোগ আক্রমণ রাডার" : "Regional Pest Outbreak & Threat Map"}
              </h2>
              <span className="text-[11px] font-mono bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                Live Community Defense
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              জামালপুর ও পাশ্ববর্তী উপজেলার সক্রিয় পোকা ও রোগের বিস্তার মানচিত্র। পার্শ্ববর্তী এলাকায় আক্রমণ ছড়িয়ে পড়ার সাথে সাথে সতর্কতা গ্রহণ করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-102"
          >
            <PlusCircle className="w-4 h-4 text-[#FBBF24]" />
            <span>নতুন পোকার আক্রমণ রিপোর্ট করুন</span>
          </button>
        </div>
      </div>

      {/* 2. Immediate Threat Alert Bar (If any threat is within 5km radius) */}
      {immediateThreat && (
        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#FBBF24]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-200 block">
                🚨 আপনার খামারের অতি নিকটবর্তী জরুরি ঝুঁকি ({immediateThreat.distanceKm} কিমি দূরত্বে)
              </span>
              <h4 className="text-base font-black">
                {immediateThreat.villageBn} এলাকায় {immediateThreat.cropBn} ফসলে {immediateThreat.pestNameBn} আক্রমণ শনাক্ত!
              </h4>
              <p className="text-xs text-red-100 mt-0.5">
                বাতাস বা মাটির মাধ্যমে দ্রুত ছড়িয়ে পড়তে পারে। এখনই প্রতিরোধমূলক স্প্রে করুন।
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSelectIncident(immediateThreat)}
            className="px-4 py-2 rounded-xl bg-white text-red-950 font-bold text-xs shadow-sm hover:bg-stone-100 cursor-pointer"
          >
            প্রতিরোধ ব্যবস্থা দেখুন &rarr;
          </button>
        </div>
      )}

      {/* 3. Distance Radius Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-emerald-700" />
          <span>দূরত্ব অনুযায়ী ফিল্টার করুন (Radius Filter):</span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "সকল অঞ্চল (জামালপুর জেলা)" },
            { id: "NEARBY_15KM", label: "📍 ১৫ কিমি রেডিয়াসের ঝুঁকি" },
            { id: "NEARBY_5KM", label: "⚠️ ৫ কিমি অতি-জরুরি পরিধি" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setDistanceFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                distanceFilter === f.id
                  ? "bg-[#14532D] text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Threat Map Canvas (Left) & Active Threat Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Regional Map Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl bg-stone-950 border-2 border-stone-800 p-4 aspect-4/3 overflow-hidden shadow-xl flex flex-col justify-between select-none">
            
            {/* Background Radar Rings & Topography Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
            
            {/* Concentric Defense Range Rings centered on Farmer's Farm */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-emerald-500/20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-amber-500/25 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-red-500/30 pointer-events-none"></div>

            {/* Radar Sweeper Line Animation */}
            <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-full h-full rounded-full border-t border-r border-emerald-400/40 animate-spin"></div>
            </div>

            {/* Top Overlay Legend */}
            <div className="relative z-10 flex items-center justify-between text-xs text-stone-300 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-mono text-emerald-300 font-bold">
                  RADAR ACTIVE · JAMALPUR AGRI ZONE
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> লাল (উচ্চ ঝুঁকি)
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> হলুদ (সতর্কতা)
                </span>
              </div>
            </div>

            {/* Center: Farmer's Own Farm Marker */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <div className="w-8 h-8 rounded-full bg-[#14532D] border-2 border-[#FBBF24] flex items-center justify-center text-xs shadow-lg text-[#FBBF24]">
                🏠
              </div>
              <span className="text-[10px] font-bold font-mono bg-stone-950/90 text-emerald-300 px-2 py-0.5 rounded-md mt-1 border border-emerald-700/50 whitespace-nowrap">
                আপনার খামার (কেন্দুয়া)
              </span>
            </div>

            {/* Interactive Threat Hotspot Pins */}
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIncident.id === incident.id;
              const isHigh = incident.severity === "HIGH";
              const isControlled = incident.severity === "CONTROLLED";

              return (
                <div
                  key={incident.id}
                  onClick={() => handleSelectIncident(incident)}
                  className="absolute z-20 cursor-pointer group"
                  style={{ top: `${incident.coordinates.y}%`, left: `${incident.coordinates.x}%` }}
                >
                  <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    
                    {/* Pulsing ring for high severity */}
                    {isHigh && (
                      <span className="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping"></span>
                    )}

                    {/* Pin button */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                      isSelected 
                        ? "ring-4 ring-white scale-125" 
                        : ""
                    } ${
                      isHigh 
                        ? "bg-red-600 text-white" 
                        : isControlled 
                        ? "bg-emerald-600 text-white" 
                        : "bg-amber-500 text-stone-950"
                    }`}>
                      <Bug className="w-3.5 h-3.5" />
                    </div>

                    {/* Label Tag */}
                    <div className="mt-1 bg-stone-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-stone-700 whitespace-nowrap shadow-md group-hover:border-white">
                      <span>{incident.upazilaBn.replace(" উপজেলা", "")}</span>
                      <span className="text-amber-300 font-bold ml-1">({incident.distanceKm}km)</span>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Bottom Radar Controls */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-400 bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-stone-800">
              <span className="font-mono">ম্যাপের যেকোনো পিনে ক্লিক করে বিস্তারিত আক্রমণ ও প্রতিরোধ তথ্য দেখুন</span>
              <span className="font-mono text-emerald-400">মোট সক্রিয় রিপোর্ট: {incidents.length}টি</span>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>প্রতিটি পোকার আক্রমণের পর আশেপাশের সব খামারিদের মোবাইল অ্যাপে সরাসরি পুশ অ্যালার্ট পাঠানো হয়।</span>
            </div>
            <span className="font-mono font-bold text-amber-900">Geo-Radius Broadcast</span>
          </div>
        </div>

        {/* Right: Selected Threat Detail & Countermeasure Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-linear-to-br from-stone-50 via-white to-red-50/40 border border-stone-200 p-6 space-y-5 shadow-sm">
            
            {/* Header with Severity Badge & Audio */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                  selectedIncident.severity === "HIGH" 
                    ? "bg-red-100 text-red-800 border-red-300 animate-pulse" 
                    : selectedIncident.severity === "CONTROLLED" 
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }`}>
                  {selectedIncident.statusBn}
                </span>

                <h3 className="text-xl font-black text-stone-900 mt-2">
                  {selectedIncident.pestNameBn}
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Scientific: {selectedIncident.scientificName}
                </p>
              </div>

              <button
                onClick={handleVoiceBroadcast}
                className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  isSpeaking 
                    ? "bg-red-600 text-white border-red-600 animate-pulse" 
                    : "bg-white text-stone-800 border-stone-200 hover:bg-stone-50 shadow-2xs"
                }`}
                title="Speak alert in Bangla"
              >
                <Volume2 className="w-4 h-4 text-[#D97706]" />
                <span>{isSpeaking ? "বলছে..." : "শুনুন"}</span>
              </button>
            </div>

            {/* Incident Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">আক্রান্ত এলাকা</span>
                <span className="font-bold text-stone-900 text-sm block">{selectedIncident.villageBn}</span>
                <span className="text-[11px] text-stone-600">{selectedIncident.upazilaBn}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">আপনার খামার থেকে দূরত্ব</span>
                <span className="font-bold text-red-600 text-sm font-mono block">
                  {selectedIncident.distanceKm} কিমি দূরে
                </span>
                <span className="text-[11px] text-stone-600">
                  {selectedIncident.distanceKm <= 5 ? "⚠️ অতি-জরুরি জোন" : "নজরদারি জোন"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">আক্রান্ত ফসল</span>
                <span className="font-bold text-stone-900 block">{selectedIncident.cropBn}</span>
                <span className="text-[11px] text-stone-500 font-mono">আক্রান্ত জমি: {selectedIncident.affectedAcres} একর</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">রিপোর্টের সময় ও তথ্যদাতা</span>
                <span className="font-bold text-stone-900 block">{selectedIncident.reportedAgo}</span>
                <span className="text-[11px] text-stone-500 truncate block">{selectedIncident.reportedBy}</span>
              </div>
            </div>

            {/* Actionable Bio-Chemical Countermeasure Prescription */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-600 text-emerald-950 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532D] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>তাত্ক্ষণিক প্রতিরোধ ও ফসল সুরক্ষা নির্দেশিকা:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#14532D] leading-relaxed">
                {selectedIncident.preventiveActionBn}
              </p>
            </div>

            {/* List of other incidents for quick switching */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                অন্যান্য রিপোর্টকৃত এলাকা নির্বাচন করুন:
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => handleSelectIncident(inc)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      selectedIncident.id === inc.id
                        ? "bg-emerald-50 border-emerald-400 font-bold text-[#14532D]"
                        : "bg-white border-stone-200 hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        inc.severity === "HIGH" ? "bg-red-500" : inc.severity === "CONTROLLED" ? "bg-emerald-500" : "bg-amber-500"
                      }`}></span>
                      <span>{inc.villageBn} ({inc.cropBn})</span>
                    </div>
                    <span className="font-mono text-stone-500 text-[11px]">
                      {inc.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 5. Report Pest Incident Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900">
                  নতুন পোকার আক্রমণ রিপোর্ট করুন
                </h3>
                <p className="text-xs text-stone-500">
                  আপনার এলাকার তথ্য অন্যান্য কৃষকদের রক্ষা করতে সরাসরি রাডারে যুক্ত হবে।
                </p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-900">রিপোর্ট সফলভাবে গৃহীত হয়েছে!</h4>
                <p className="text-xs text-stone-600">
                  রাডার ম্যাপে আপনার রিপোর্ট যুক্ত করা হয়েছে এবং আশেপাশের কৃষকদের সতর্কবার্তা পাঠানো হচ্ছে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor={upazilaInputId} className="text-xs font-bold text-stone-700">উপজেলা:</label>
                    <select
                      id={upazilaInputId}
                      value={newUpazila}
                      onChange={(e) => setNewUpazila(e.target.value)}
                      className="w-full bg-stone-50 text-xs font-bold text-stone-800 p-2.5 rounded-xl border border-stone-300"
                    >
                      <option value="জামালপুর সদর">জামালপুর সদর</option>
                      <option value="মেলান্দহ উপজেলা">মেলান্দহ উপজেলা</option>
                      <option value="ইসলামপুর (চর অঞ্চল)">ইসলামপুর (চর অঞ্চল)</option>
                      <option value="দেওয়ানগঞ্জ উপজেলা">দেওয়ানগঞ্জ উপজেলা</option>
                      <option value="মাদারগঞ্জ উপজেলা">মাদারগঞ্জ উপজেলা</option>
                      <option value="সরিষাবাড়ী উপজেলা">সরিষাবাড়ী উপজেলা</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={villageInputId} className="text-xs font-bold text-stone-700">গ্রাম বা এলাকা:</label>
                    <input
                      id={villageInputId}
                      type="text"
                      placeholder="যেমন: কেন্দুয়া, ঝাউগড়া"
                      value={newVillage}
                      onChange={(e) => setNewVillage(e.target.value)}
                      required
                      className="w-full bg-stone-50 text-xs font-bold text-stone-800 p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor={cropInputId} className="text-xs font-bold text-stone-700">আক্রান্ত ফসল:</label>
                    <select
                      id={cropInputId}
                      value={newCrop}
                      onChange={(e) => setNewCrop(e.target.value)}
                      className="w-full bg-stone-50 text-xs font-bold text-stone-800 p-2.5 rounded-xl border border-stone-300"
                    >
                      <option value="বোরো ধান">বোরো ধান</option>
                      <option value="গোল আলু">গোল আলু</option>
                      <option value="বেগুন">বেগুন</option>
                      <option value="পটল">পটল</option>
                      <option value="কাঁচা মরিচ">কাঁচা মরিচ</option>
                      <option value="টমেটো">টমেটো</option>
                      <option value="লাউ / কুমড়ো">লাউ / কুমড়ো</option>
                      <option value="আম / লিচু">আম / লিচু</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={pestInputId} className="text-xs font-bold text-stone-700">পোকা বা রোগের নাম:</label>
                    <input
                      id={pestInputId}
                      type="text"
                      value={newPest}
                      onChange={(e) => setNewPest(e.target.value)}
                      placeholder="যেমন: কারেন্ট পোকা, পাতা ধসা"
                      required
                      className="w-full bg-stone-50 text-xs font-bold text-stone-800 p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor={severityInputId} className="text-xs font-bold text-stone-700">আক্রমণের মাত্রা:</label>
                  <select
                    id={severityInputId}
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-stone-50 text-xs font-bold text-stone-800 p-2.5 rounded-xl border border-stone-300"
                  >
                    <option value="HIGH">🔴 উচ্চ মাত্রা (দ্রুত ছড়িয়ে পড়ছে - লাল সতর্কতা)</option>
                    <option value="MEDIUM">🟡 মাঝারি মাত্রা (প্রাথমিক আক্রমণ - হলুদ সতর্কতা)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>লাইভ রাডারে সম্প্রচার করুন</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
