import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Thermometer, 
  Droplets, 
  ShieldCheck, 
  PhoneCall, 
  Navigation, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Maximize2
} from "lucide-react";

export interface ColdChainTruck {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  currentLocationBn: string;
  destinationHubBn: string;
  distanceKm: number;
  etaMinutes: number;
  reeferTempC: number;
  targetTempC: number;
  humidityPct: number;
  capacityTon: number;
  availableCapacityTon: number;
  status: "EN_ROUTE_PICKUP" | "LOADING" | "IN_TRANSIT_HUB";
  statusBn: string;
  gpsCoords: { lat: number; lng: number };
  waypoints: { nameBn: string; timeBn: string; completed: boolean }[];
}

const SAMPLE_TRUCKS: ColdChainTruck[] = [
  {
    id: "TRUCK-KL-402",
    plateNumber: "ঢাকা মেট্রো-ট-১৪-৭৮৯২",
    driverName: "রফিকুল ইসলাম (লজিস্টিক পার্টনার)",
    driverPhone: "+৮৮০১৭৮৯-৪৫৬১২৩",
    currentLocationBn: "মেলান্দহ বাজার মোড় (জামালপুর মহাসড়ক)",
    destinationHubBn: "জামালপুর সেন্ট্রাল অ্যাগ্রো-কোল্ড স্টোরেজ",
    distanceKm: 3.4,
    etaMinutes: 14,
    reeferTempC: 3.8,
    targetTempC: 4.0,
    humidityPct: 88,
    capacityTon: 5.0,
    availableCapacityTon: 2.8,
    status: "EN_ROUTE_PICKUP",
    statusBn: "🚚 খামারের দিকে রওনা হয়েছে",
    gpsCoords: { lat: 24.9620, lng: 89.8430 },
    waypoints: [
      { nameBn: "ইসলামপুর কোল্ড জংশন", timeBn: "সকাল ১০:১৫", completed: true },
      { nameBn: "মেলান্দহ চেকপয়েন্ট", timeBn: "সকাল ১০:৪৫", completed: true },
      { nameBn: "কেন্দুয়া সোনালী খামার (আপনার খামার)", timeBn: "সকাল ১১:০৫ (আনুমানিক)", completed: false },
      { nameBn: "জামালপুর সেন্ট্রাল কোল্ড হাব", timeBn: "দুপুর ১২:০০", completed: false }
    ]
  },
  {
    id: "TRUCK-KL-508",
    plateNumber: "ঢাকা মেট্রো-ট-১১-৩২১০",
    driverName: "আব্দুল কাদের (এক্সপ্রেস ড্রাইভ)",
    driverPhone: "+৮৮০১৬১২-৯৮৭৬৫৪",
    currentLocationBn: "তুলশীরচর ব্রীজ সংলগ্ন রোড",
    destinationHubBn: "তেজগাঁও সেন্ট্রাল পাইকারি বাজার, ঢাকা",
    distanceKm: 8.7,
    etaMinutes: 28,
    reeferTempC: -16.5,
    targetTempC: -18.0,
    humidityPct: 65,
    capacityTon: 10.0,
    availableCapacityTon: 4.5,
    status: "IN_TRANSIT_HUB",
    statusBn: "❄️ হিমায়িত চেইন সচল (ঢাকা ট্রানজিট)",
    gpsCoords: { lat: 24.9150, lng: 89.9820 },
    waypoints: [
      { nameBn: "বকশীগঞ্জ কৃষি পয়েন্ট", timeBn: "সকাল ০৯:৩০", completed: true },
      { nameBn: "তুলশীরচর কালেকশন বুথ", timeBn: "সকাল ১০:৫০", completed: true },
      { nameBn: "কেন্দুয়া লিঙ্ক রোড", timeBn: "সকাল ১১:২০", completed: false },
      { nameBn: "ঢাকা সেন্ট্রাল ডিপো", timeBn: "বিকাল ০৪:৩০", completed: false }
    ]
  }
];

export const ColdChainRouteVisualizer: React.FC = () => {
  const { lang, currentUser, addAuditLog } = useApp();
  const [trucks, setTrucks] = useState<ColdChainTruck[]>(SAMPLE_TRUCKS);
  const [selectedTruckId, setSelectedTruckId] = useState<string>("TRUCK-KL-402");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const activeTruck = trucks.find(t => t.id === selectedTruckId) || trucks[0];

  // Simulated live countdown and movement
  useEffect(() => {
    const timer = setInterval(() => {
      setTrucks(prev => prev.map(truck => {
        if (truck.etaMinutes > 2) {
          return {
            ...truck,
            etaMinutes: truck.etaMinutes - 1,
            distanceKm: Math.max(0.5, +(truck.distanceKm - 0.2).toFixed(1))
          };
        }
        return truck;
      }));
    }, 25000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addAuditLog(
        "COLD_CHAIN_TELEMETRY_REFRESH",
        `/farmer/logistics/${selectedTruckId}`,
        "ALLOWED",
        `GPS telemetry refreshed for reefer truck ${activeTruck.plateNumber}. Current ETA: ${activeTruck.etaMinutes} mins.`
      );
    }, 700);
  };

  const handleRequestPickup = () => {
    setBookingSuccess(true);
    addAuditLog(
      "LOGISTICS_PICKUP_REQUESTED",
      `/farmer/logistics/book`,
      "ALLOWED",
      `Farmer ${currentUser.name} requested chilled crop pickup with ${activeTruck.plateNumber}.`
    );
    setTimeout(() => {
      setBookingSuccess(false);
    }, 3500);
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 font-sans">
      
      {/* 1. Header with Active Fleet Telemetry Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black shadow-xs">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "কোল্ড চেইন পরিবহন রুট ও ট্র্যাকিং রাডার" : "Cold Chain Logistics Route Visualizer"}
              </h2>
              <span className="text-[11px] font-mono bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full font-bold">
                IoT GPS Telemetry Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              আপনার খামারের নিকটবর্তী রিফার শীতাতপনিয়ন্ত্রিত ট্রাকের তাৎক্ষণিক অবস্থান ও সম্ভাব্য পৌঁছানোর সময় (ETA)।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer shadow-2xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-700" : ""}`} />
            <span>জিপিএস রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* 2. Truck Fleet Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.map(truck => {
          const isSelected = truck.id === selectedTruckId;
          return (
            <div
              key={truck.id}
              onClick={() => setSelectedTruckId(truck.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? "bg-linear-to-br from-cyan-50/70 via-white to-emerald-50/40 border-cyan-500 shadow-md ring-2 ring-cyan-500/20"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className={`w-5 h-5 ${isSelected ? "text-cyan-600" : "text-stone-500"}`} />
                  <span className="font-bold text-sm text-stone-900">{truck.plateNumber}</span>
                </div>
                <span className="text-xs font-mono font-bold bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full">
                  {truck.statusBn}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-stone-200/60 font-mono">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">খামার থেকে দূরত্ব</span>
                  <span className="font-black text-cyan-800 text-sm">{truck.distanceKm} কিমি</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">পৌঁছানোর সময় (ETA)</span>
                  <span className="font-black text-emerald-700 text-sm">{truck.etaMinutes} মিনিট</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">রিফার তাপমাত্রা</span>
                  <span className="font-black text-stone-900 text-sm">{truck.reeferTempC}°C</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Live Route Visualization Canvas (Left) & Telemetry Metrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Dynamic Visual Route Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl bg-stone-950 border-2 border-stone-800 p-6 overflow-hidden shadow-xl text-white min-h-[360px] flex flex-col justify-between">
            
            {/* Map Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between bg-stone-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-mono text-cyan-300 font-bold">
                  ROUTE: {activeTruck.currentLocationBn.slice(0, 22)}...
                </span>
              </div>
              <span className="font-mono text-stone-300">
                GPS: {activeTruck.gpsCoords.lat.toFixed(4)}°N, {activeTruck.gpsCoords.lng.toFixed(4)}°E
              </span>
            </div>

            {/* Simulated Highway Path with Waypoint Nodes */}
            <div className="relative z-10 py-10 px-4">
              <div className="relative flex items-center justify-between">
                
                {/* Route Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-emerald-500 via-cyan-400 to-cyan-500 w-3/4 rounded-full animate-pulse"></div>
                </div>

                {/* Waypoint 1 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg">
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-stone-300 mt-2">উৎপাদন হাব</span>
                  <span className="text-[10px] text-stone-500 font-mono">মেলান্দহ</span>
                </div>

                {/* Waypoint 2: Truck Current Position */}
                <div className="relative z-10 flex flex-col items-center text-center animate-bounce">
                  <div className="w-11 h-11 rounded-full bg-cyan-500 border-4 border-white flex items-center justify-center text-stone-950 font-black shadow-xl">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black text-cyan-300 mt-2 bg-stone-900/90 px-2 py-0.5 rounded-md border border-cyan-500/50">
                    ট্রাক এখন এখানে ({activeTruck.distanceKm} কিমি)
                  </span>
                </div>

                {/* Waypoint 3: Farmer's Farm Target */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-stone-950 text-base font-bold shadow-lg">
                    🏠
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 mt-2">আপনার খামার</span>
                  <span className="text-[10px] text-amber-200 font-mono">কেন্দুয়া (ETA {activeTruck.etaMinutes}মি.)</span>
                </div>

                {/* Waypoint 4: Final Cold Storage Depot */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center text-xs font-bold text-stone-400">
                    ❄️
                  </div>
                  <span className="text-[11px] font-bold text-stone-400 mt-2">কোল্ড স্টোরেজ হাব</span>
                  <span className="text-[10px] text-stone-500 font-mono">জামালপুর সদর</span>
                </div>

              </div>
            </div>

            {/* Bottom Live Metrics */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-800 text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-stone-300">
                  গড় গতিবেগ: ৪৫ কিমি/ঘণ্টা · ট্রাফিক স্বাভাবিক
                </span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">
                ফার্মগেটে পৌঁছাতে বাকি: {activeTruck.etaMinutes} মিনিট
              </span>
            </div>

          </div>

          {/* Quick Driver Contact Strip */}
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">{activeTruck.driverName}</span>
                <span className="text-stone-600 font-mono">{activeTruck.driverPhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeTruck.driverPhone}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#14532D] text-white font-bold text-xs hover:bg-[#166534] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>ড্রাইভারকে কল দিন</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Selected Truck Telemetry Details & Instant Booking */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-linear-to-br from-stone-50 via-white to-cyan-50/40 border border-stone-200 p-6 space-y-6 shadow-sm">
            
            {/* Header */}
            <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  রিফার লজিস্টিকস টেলিমেট্রি
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  {activeTruck.plateNumber}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-stone-500 block">অবশিষ্ট ধারণক্ষমতা</span>
                <span className="text-base font-black text-cyan-800 font-mono">
                  {activeTruck.availableCapacityTon} টন খালি
                </span>
              </div>
            </div>

            {/* IoT Sensor Readings */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-700 font-bold">
                  <Thermometer className="w-4 h-4" />
                  <span>চেম্বার তাপমাত্রা</span>
                </div>
                <div className="text-2xl font-black font-mono text-stone-900">
                  {activeTruck.reeferTempC}°C
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  টার্গেট: {activeTruck.targetTempC}°C (অনুমোদিত)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                  <Droplets className="w-4 h-4" />
                  <span>চেম্বার আর্দ্রতা</span>
                </div>
                <div className="text-2xl font-black font-mono text-stone-900">
                  {activeTruck.humidityPct}%
                </div>
                <span className="text-[10px] text-stone-500 font-bold block">
                  সবজি ও কন্দের উপযুক্ত
                </span>
              </div>

            </div>

            {/* Waypoints Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                রুট ও পৌঁছানোর সময়সূচি:
              </span>
              <div className="space-y-2 border-l-2 border-cyan-400 pl-3 ml-2">
                {activeTruck.waypoints.map((wp, i) => (
                  <div key={i} className="relative flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${wp.completed ? "bg-emerald-500" : "bg-cyan-500 animate-ping"}`}></span>
                      <span className={`font-semibold ${wp.completed ? "text-stone-500 line-through" : "text-stone-900 font-bold"}`}>
                        {wp.nameBn}
                      </span>
                    </div>
                    <span className="font-mono text-stone-500 text-[11px]">{wp.timeBn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Pickup Request Button */}
            <div className="pt-2 border-t border-stone-100">
              {bookingSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">পিকআপ অনুরোধ গৃহীত হয়েছে!</span>
                    <span>ট্রাক চালক সরাসরি আপনার খামারের গেটে ফসল লোড করতে পৌঁছাচ্ছেন।</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRequestPickup}
                  className="w-full py-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#14532D]/20 cursor-pointer transition-transform active:scale-98"
                >
                  <Truck className="w-5 h-5 text-[#FBBF24]" />
                  <span>এই ট্রাকে ফসল তোলার পিকআপ নিশ্চিত করুন</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
