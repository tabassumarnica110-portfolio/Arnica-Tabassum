import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  ThermometerSnowflake, 
  Truck, 
  MapPin, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Layers,
  Wind,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export const ColdChainTelemetryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { coldStorages, lang } = useApp();
  const [selectedHub, setSelectedHub] = useState("cs-1");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active IoT reefer fleet simulation
  const reeferTrucks = [
    {
      id: "TRK-881",
      vehicleNumber: "Dhaka Metro-Ta 11-9821",
      driver: "Kabir Hossain",
      currentLocation: "Tangail Bypass Highway (KM 74)",
      destination: "Tejgaon Industrial Area, Dhaka",
      tempC: 3.4,
      targetTempC: 3.0,
      humidity: 87,
      fuelPct: 82,
      cargo: "Potato & Fresh Brinjal (6.5 Tons)",
      status: "IN_TRANSIT",
      doorStatus: "SEALED",
      eta: "1 hr 45 min",
    },
    {
      id: "TRK-904",
      vehicleNumber: "Dhaka Metro-Ta 14-3329",
      driver: "Mofizul Islam",
      currentLocation: "Jamalpur Beltia Dispatch Depot",
      destination: "Kawran Bazar Central Mandi",
      tempC: 2.8,
      targetTempC: 2.5,
      humidity: 89,
      fuelPct: 96,
      cargo: "Premium BRRI-28 Paddy (10 Tons)",
      status: "LOADING_SEALED",
      doorStatus: "SEALED",
      eta: "3 hr 15 min",
    },
    {
      id: "TRK-712",
      vehicleNumber: "Dhaka Metro-Ta 12-4011",
      driver: "Nurul Absar",
      currentLocation: "Gazipur Chowrasta Entry",
      destination: "Uttara Sector-7 Shwapno Hub",
      tempC: 4.1,
      targetTempC: 4.0,
      humidity: 84,
      fuelPct: 65,
      cargo: "Jamuna Char Pointed Gourd (3 Tons)",
      status: "APPROACHING_DEPOT",
      doorStatus: "SEALED",
      eta: "25 min",
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const activeStorage = coldStorages.find((cs) => cs.id === selectedHub) || coldStorages[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ThermometerSnowflake className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  ColdLink™ IoT Telemetry & Fleet Command
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  REAL-TIME IoT LIVE
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {lang === "bn"
                  ? "হিমাগার তাপমাত্রা, আর্দ্রতা ও রাস্তায় চলমান রেফ্রিজারেটেড ট্রাকের লাইভ সেন্সর ডাটা"
                  : "Warehouse climate control & live GPS reefer compartment telemetry"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer ${
                isRefreshing ? "animate-spin text-blue-400" : ""
              }`}
              title="Refresh telemetry stream"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-800">
          
          {/* Section 1: Cold Storage Hub Telemetry */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>সেন্ট্রাল হিমাগার হাব সেন্সর মনিটরিং</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                MQTT Broker: Beltia-Edge-Gateway (Online)
              </span>
            </div>

            {/* Hub Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {coldStorages.map((cs) => (
                <button
                  key={cs.id}
                  onClick={() => setSelectedHub(cs.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedHub === cs.id
                      ? "bg-[#14532D] text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  ❄️ {cs.name.split(" ")[0]} ({cs.upazila})
                </button>
              ))}
            </div>

            {/* Hub Gauges Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 block">চেম্বার তাপমাত্রা</span>
                <span className="text-2xl font-bold font-mono text-blue-700">
                  {activeStorage.tempC}°C
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  ● নিখুঁত রেঞ্জ (২.০°C - ৩.৫°C)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 block">আপেক্ষিক আর্দ্রতা</span>
                <span className="text-2xl font-bold font-mono text-[#14532D]">
                  {activeStorage.humidity}%
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  ● আদর্শ আর্দ্রতা (পচনরোধী)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 block">উপলব্ধ ধারণক্ষমতা</span>
                <span className="text-2xl font-bold font-mono text-stone-900">
                  {activeStorage.availCapTons}
                  <span className="text-xs text-stone-500 font-normal"> / {activeStorage.totalCapTons} টন</span>
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {( (activeStorage.availCapTons / activeStorage.totalCapTons) * 100 ).toFixed(0)}% খালি স্পেস
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 block">চেম্বার ডোর স্ট্যাটাস</span>
                <span className="text-base font-bold font-mono text-emerald-700 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SEALED</span>
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                  কোনো লিকেজ নেই
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Active Reefer Logistics Fleet in Transit */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#14532D]" />
                <span>রাস্তায় চলমান কোল্ড-ফ্রেইট রিকশার বহর (Live Fleet)</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                ৩টি ট্রাক ট্রানজিটে সক্রিয়
              </span>
            </div>

            <div className="space-y-3">
              {reeferTrucks.map((truck) => (
                <div
                  key={truck.id}
                  className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        🚚
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{truck.vehicleNumber}</span>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {truck.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          চালক: {truck.driver} · পণ্য: {truck.cargo}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-mono">আনুমানিক পৌঁছানোর সময় (ETA)</span>
                      <span className="font-bold text-xs font-mono text-[#14532D]">{truck.eta}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="text-stone-600 truncate">{truck.currentLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-stone-900 font-bold">{truck.tempC}°C (লক্ষ্য {truck.targetTempC}°C)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-stone-600">আর্দ্রতা {truck.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{truck.doorStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Spoilage & Cold-Chain Impact Metrics */}
          <div className="p-4 rounded-xl bg-linear-to-r from-blue-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider block">
                ESG & Spoilage Prevention Audit
              </span>
              <p className="text-sm font-semibold text-white">
                কোল্ড চেইনের মাধ্যমে নষ্ট হওয়া থেকে রক্ষা পেয়েছে <span className="text-[#FBBF24] font-bold">১২,৪০০+ কেজি</span> খাদ্যপণ্য
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-blue-200">
              <div>
                <span className="block text-[10px] text-blue-400">খাদ্য অপচয় হার</span>
                <span className="font-bold text-white text-base">১.৮%</span>
                <span className="text-[10px] text-stone-400 block">(ঐতিহ্যবাহী: ৩৫%)</span>
              </div>
              <div className="border-l border-blue-800 pl-4">
                <span className="block text-[10px] text-blue-400">সংরক্ষণ সক্ষমতা</span>
                <span className="font-bold text-white text-base">৯৮.২%</span>
                <span className="text-[10px] text-emerald-400 block">SLA পাস্ট</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
