import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Farmer, Product, Order } from "../../types";
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Package, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Eye, 
  Truck, 
  ThermometerSnowflake, 
  Sliders, 
  FileText,
  AlertTriangle,
  Lock,
  Search,
  ExternalLink
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import L from "leaflet";

export const AdminDashboard: React.FC = () => {
  const { 
    farmers, 
    products, 
    orders, 
    coldStorages, 
    auditLogs, 
    verifyFarmerKyc, 
    approveProductQc, 
    setActiveModal,
    lang 
  } = useApp();

  const [adminTab, setAdminTab] = useState<"OVERVIEW" | "KYC_VERIFICATION" | "PRODUCT_QC" | "LOGISTICS" | "COLD_STORAGE" | "AUDIT_LOGS">("OVERVIEW");
  const [commissionRate, setCommissionRate] = useState<number>(5);
  const [kmDeliveryRate, setKmDeliveryRate] = useState<number>(1.15);

  const adminMapRef = useRef<HTMLDivElement | null>(null);
  const leafletAdminMap = useRef<L.Map | null>(null);

  // Revenue & District Data
  const districtSalesData = [
    { name: "জামালপুর সদর", sales: 840000, orders: 320 },
    { name: "মেলান্দহ", sales: 520000, orders: 190 },
    { name: "ইসলামপুর", sales: 410000, orders: 145 },
    { name: "সরিষাবাড়ী", sales: 380000, orders: 110 },
    { name: "ঢাকা মেট্রো", sales: 332500, orders: 129 },
  ];

  const orderStatusPieData = [
    { name: "গৃহীত", value: 35, color: "#14532D" },
    { name: "প্যাকড", value: 25, color: "#FBBF24" },
    { name: "ট্রাকে রওনা", value: 25, color: "#3B82F6" },
    { name: "ডেলিভার্ড", value: 15, color: "#10B981" },
  ];

  // Leaflet Map for Bangladesh Agro Hubs
  useEffect(() => {
    if (adminTab !== "OVERVIEW") return;
    if (!adminMapRef.current) return;

    if (!leafletAdminMap.current) {
      const map = L.map(adminMapRef.current).setView([24.92, 89.94], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      // Plot all farmers
      farmers.forEach((f) => {
        const icon = L.divIcon({
          className: "farmer-marker",
          html: `<div style="background:#14532D;color:#FBBF24;padding:4px 8px;border-radius:12px;font-size:10px;font-weight:bold;border:1px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);">👨‍🌾 ${f.name.split(" ")[0]}</div>`,
        });
        L.marker([f.lat, f.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${f.name}</b><br/>${f.village}, ${f.upazila}<br/>Sales: ৳${f.salesTaka}`);
      });

      // Plot cold storages
      coldStorages.forEach((cs) => {
        const csIcon = L.divIcon({
          className: "cs-marker",
          html: `<div style="background:#0284C7;color:#fff;padding:4px 8px;border-radius:12px;font-size:10px;font-weight:bold;border:1px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);">❄️ ${cs.name.slice(0, 12)}...</div>`,
        });
        L.marker([cs.lat, cs.lng], { icon: csIcon })
          .addTo(map)
          .bindPopup(`<b>${cs.name}</b><br/>${cs.address}<br/>Available: ${cs.availCapTons} Tons`);
      });

      leafletAdminMap.current = map;
    }

    return () => {
      if (leafletAdminMap.current) {
        leafletAdminMap.current.remove();
        leafletAdminMap.current = null;
      }
    };
  }, [adminTab, farmers, coldStorages]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-stone-900 via-stone-800 to-stone-950 p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-red-600 text-white shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {lang === "bn" ? "প্রশাসন, কোয়ালিটি কন্ট্রোল ও সিকিউরিটি হাব" : "KrishiLink Executive & QC Command"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                এনআইডি ভেরিফিকেশন, ল্যাব কোয়ালিটি অনুমোদন, কোল্ড চেইন লজিস্টিকস ও অডিট ট্রেইল
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal("SECURITY_LAB")}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-xs flex items-center gap-2 border border-stone-700 shadow-xs transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>সাইবার সিকিউরিটি ও কমপ্লায়েন্স অডিট</span>
          </button>
        </div>
      </div>

      {/* 4 CORE KPI CARDS - As specified in brief */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* GMV */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            সর্বমোট কেনাবেচা (Total GMV)
          </span>
          <div className="text-3xl font-black text-[#14532D] mt-2">৳ ২৪,৮২,৫০০</div>
          <div className="mt-2 flex items-center text-xs text-emerald-700 font-semibold">
            <span>+২৩.৪% চলতি মাসে</span>
          </div>
        </div>

        {/* Total Farmers */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            নিবন্ধিত কৃষক (Total Farmers)
          </span>
          <div className="text-3xl font-black text-stone-900 mt-2">১,৪২০ জন</div>
          <div className="mt-2 flex items-center text-xs text-stone-500">
            <span>জামালপুর সদর, মেলান্দহ ও ইসলামপুর</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            মোট সফল ডেলিভারি (Orders)
          </span>
          <div className="text-3xl font-black text-stone-900 mt-2">৮,৯৫০ টি</div>
          <div className="mt-2 flex items-center text-xs text-emerald-700 font-semibold">
            <span>৯৯.১% অন-টাইম কোল্ড ফ্রেইট</span>
          </div>
        </div>

        {/* Commission Earned (5%) */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500 shadow-xs">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
            প্ল্যাটফর্ম নিট কমিশন (৫%)
          </span>
          <div className="text-3xl font-black text-[#D97706] mt-2">৳ ১,২৪,১২৫</div>
          <div className="mt-2 flex items-center text-xs text-stone-700 font-mono">
            <span>SaaS Transaction Fee (5%)</span>
          </div>
        </div>

      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {[
          { id: "OVERVIEW", label: "📊 ড্যাশবোর্ড ও বাংলাদেশ লাইভ ম্যাপ" },
          { id: "KYC_VERIFICATION", label: `🪪 কৃষক NID ভেরিফিকেশন (${farmers.filter(f => !f.isNidVerified).length})` },
          { id: "PRODUCT_QC", label: `🔍 ল্যাব QC অনুমোদন (${products.filter(p => !p.isQcApproved).length})` },
          { id: "LOGISTICS", label: "🚚 লজিস্টিকস ও কোল্ড ডেলিভারি হাব" },
          { id: "COLD_STORAGE", label: "❄️ হিমাগার অ্যাডমিন ও বুকিং" },
          { id: "AUDIT_LOGS", label: `🛡️ সিকিউরিটি অডিট ট্রেইল (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              adminTab === tab.id
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: OVERVIEW WITH CHARTS & LEAFLET BANGLADESH MAP */}
      {adminTab === "OVERVIEW" && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sales Bar Chart */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    উপজেলা ও জেলাভিত্তিক বিক্রয় অ্যানালিটিক্স
                  </h3>
                  <p className="text-xs text-stone-500">জামালপুর, মেলান্দহ ও ঢাকা মেট্রো সরবরাহ চিত্র</p>
                </div>
                <span className="text-xs text-stone-400 font-mono">টাকায় হিসাব</span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="৳" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(val: any) => [`৳${val.toLocaleString()}`, "বিক্রয়"]}
                    />
                    <Bar dataKey="sales" fill="#14532D" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Pie Chart */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">অর্ডার স্ট্যাটাস অনুপাত</h3>
                <p className="text-xs text-stone-500">চলতি চালানের বিতরণ চিত্র</p>
              </div>

              <div className="h-56 w-full my-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                      {orderStatusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                {orderStatusPieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-stone-700">{d.name} ({d.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Live Leaflet Map: Farmers & Cold Storages */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  বাংলাদেশ এগ্রিকালচারাল সাপ্লাই চেইন লাইভ ম্যাপ (Jamalpur Hubs)
                </h3>
                <p className="text-xs text-stone-500">
                  সবুজ পিন = ভেরিফাইড খামারি | নীল পিন = তাপমাত্রা নিয়ন্ত্রিত কোল্ড স্টোরেজ
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1">🟢 {farmers.length} টি খামার সক্রিয়</span>
                <span className="flex items-center gap-1">🔵 {coldStorages.length} টি হিমাগার লিংকড</span>
              </div>
            </div>

            <div 
              ref={adminMapRef} 
              className="w-full h-96 rounded-2xl border border-stone-300 overflow-hidden shadow-inner"
            />
          </div>

        </div>
      )}

      {/* SUBTAB 2: KYC VERIFICATION CENTER (NID INSPECTION) */}
      {adminTab === "KYC_VERIFICATION" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                কৃষক জাতীয় পরিচয়পত্র (NID) ভেরিফিকেশন সেন্টার
              </h3>
              <p className="text-xs text-stone-500">
                ভুয়া মধ্যস্বত্বভোগী প্রতিরোধে প্রতিটি কৃষকের খতিয়ান ও এনআইডি পরীক্ষা বাধ্যতামূলক
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-[#14532D] px-3 py-1 rounded-full font-bold">
              EC-BD API Integrated
            </span>
          </div>

          <div className="space-y-4">
            {farmers.map((farmer) => (
              <div
                key={farmer.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#14532D] text-[#FBBF24] flex items-center justify-center font-black text-xl">
                    {farmer.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-stone-900">{farmer.name}</h4>
                      {farmer.isNidVerified ? (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          ✓ NID ভেরিফাইড
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                          অপেক্ষমান
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {farmer.village}, {farmer.upazila}, {farmer.district} • মোবাইল: {farmer.phone}
                    </p>
                    <p className="text-xs font-mono text-stone-600 mt-1">
                      NID নম্বর: <strong>{farmer.nidNumber}</strong> (স্মার্ট কার্ড)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={farmer.nidFrontUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>NID কপি দেখুন</span>
                  </a>

                  {!farmer.isNidVerified ? (
                    <button
                      onClick={() => verifyFarmerKyc(farmer.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>অনুমোদন দিন</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => verifyFarmerKyc(farmer.id, false)}
                      className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>স্থগিত করুন</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRODUCT QC & LAB APPROVAL */}
      {adminTab === "PRODUCT_QC" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                পণ্যের গুণমান পরীক্ষা ও QC অনুমোদন (Lab Certification)
              </h3>
              <p className="text-xs text-stone-500">
                মার্কেটপ্লেসে লাইভ হওয়ার পূর্বে আর্দ্রতা, বিষাক্ততার অবশিষ্টাংশ ও আকার গ্রেডিং যাচাই
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              ISO-22000 Standard
            </span>
          </div>

          <div className="space-y-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={prod.images[0]} alt={prod.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{prod.banglaName}</h4>
                    <p className="text-xs text-stone-500">
                      কৃষক: {prod.farmerName} • পরিমাণ: {prod.quantityKg} কেজি • দাম: ৳{prod.pricePerKg}/কেজি
                    </p>
                    <p className="text-[11px] font-mono text-emerald-800 mt-0.5">
                      QC নোট: {prod.qcInspectorNotes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {prod.isQcApproved ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      ✅ অনুমোদিত ও লাইভ
                    </span>
                  ) : (
                    <button
                      onClick={() => approveProductQc(prod.id)}
                      className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
                      <span>QC সার্টিফিকেট দিন</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: LOGISTICS MANAGEMENT */}
      {adminTab === "LOGISTICS" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                কোল্ড চেইন লজিস্টিকস ও ফ্রেইট ড্রাইভার ব্যবস্থাপনা
              </h3>
              <p className="text-xs text-stone-500">
                জামালপুর সেন্ট্রাল ওয়্যারহাউজ থেকে ঢাকা ও দেশজুড়ে তাপমাত্রা নিয়ন্ত্রিত ট্রাক ডেসপ্যাচ
              </p>
            </div>
            <button
              onClick={() => alert("নতুন ফ্রেইট এজেন্ট যুক্ত করার মডিউল প্রস্তুত।")}
              className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold cursor-pointer"
            >
              + নতুন ডেলিভারি এজেন্ট
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">কবীর হোসেন (লিড ফ্রেইট ড্রাইভার)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">অন-ডিউটি</span>
              </div>
              <p className="text-xs text-stone-600">গাড়ি: ঢাকা মেট্রো-ট ১১-৯৮২১ (২.৫ টন কোল্ড চেম্বার)</p>
              <p className="text-xs text-stone-500 font-mono">বর্তমান রুট: বেলটিয়া বাইপাস &rarr; বনানী, ঢাকা</p>
              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span>মোবাইল: 01799-887766</span>
                <span className="text-emerald-700 font-bold">চেম্বার তাপমাত্রা: ২.২°C</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">সোহেল রানা (ফাস্ট ভ্যান)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">অন-ডিউটি</span>
              </div>
              <p className="text-xs text-stone-600">গাড়ি: ঢাকা মেট্রো-ট ১৪-৩৮২৯ (১.৫ টন ভ্যান)</p>
              <p className="text-xs text-stone-500 font-mono">বর্তমান রুট: ইসলামপুর চর হাব &rarr; ময়মনসিংহ</p>
              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span>মোবাইল: 01788-334411</span>
                <span className="text-emerald-700 font-bold">চেম্বার তাপমাত্রা: ৩.০°C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: COLD STORAGE ADMIN */}
      {adminTab === "COLD_STORAGE" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                হিমাগার ও কোল্ড চেইন অবকাঠামো নিয়ন্ত্রণ
              </h3>
              <p className="text-xs text-stone-500">
                জামালপুরের ৫টি অনুমোদিত হিমাগারের লাইভ সেন্সর তাপমাত্রা ও স্পেস মনিটরিং
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {coldStorages.map((cs) => (
              <div key={cs.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{cs.name}</h4>
                  <p className="text-xs text-stone-500">{cs.address} • ম্যানেজার: {cs.managerName} ({cs.contactPhone})</p>
                  <div className="flex items-center gap-4 text-xs font-mono mt-1 text-stone-600">
                    <span>মোট ধারণক্ষমতা: {cs.totalCapTons} টন</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">খালি আছে: {cs.availCapTons} টন</span>
                    <span>•</span>
                    <span>ভাড়া: ৳{cs.ratePerBagMonth}/বস্তা</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs font-mono">
                    <span className="text-blue-600 font-bold block">{cs.tempC}°C</span>
                    <span className="text-cyan-600">{cs.humidity}% আর্দ্রতা</span>
                  </div>
                  <button 
                    onClick={() => setActiveModal("COLD_STORAGE")}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
                  >
                    বুকিং স্লট দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: SECURITY AUDIT TRAIL (CYBER DEFENSE EVIDENCE) */}
      {adminTab === "AUDIT_LOGS" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                রিয়েল-টাইম সাইবার সিকিউরিটি অডিট ট্রেইল (Forensics & Compliance)
              </h3>
              <p className="text-xs text-stone-500">
                SQL ইনজেকশন ব্লক, XSS স্ক্রিপ্ট ফিল্টারিং, ব্রুট ফোর্স লকআউট ও RBAC ট্রাফিক রেকর্ড
              </p>
            </div>
            <button
              onClick={() => setActiveModal("SECURITY_LAB")}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              অ্যাটাক সিমুলেটর রান করুন
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider text-[10px] font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">সময়</th>
                  <th className="py-2.5 px-3">অ্যাকশন</th>
                  <th className="py-2.5 px-3">রিসোর্স</th>
                  <th className="py-2.5 px-3">আইপি অ্যাড্রেস</th>
                  <th className="py-2.5 px-3">রোল</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3">ফরেনসিক বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{log.action}</td>
                    <td className="py-2.5 px-3 text-stone-600 truncate max-w-[140px]">{log.resource}</td>
                    <td className="py-2.5 px-3 text-stone-500">{log.ipAddress}</td>
                    <td className="py-2.5 px-3 font-bold">{log.role}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === "ALLOWED"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.status === "BLOCKED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-700 max-w-[260px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
