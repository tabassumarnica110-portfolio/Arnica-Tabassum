import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./components/landing/LandingPage";
import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { ShopPage } from "./components/buyer/ShopPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";

// Modals
import { ProductDetailModal } from "./components/buyer/ProductDetailModal";
import { CheckoutModal } from "./components/buyer/CheckoutModal";
import { OrderTrackingModal } from "./components/buyer/OrderTrackingModal";
import { ColdStorageBookingModal } from "./components/farmer/ColdStorageBookingModal";
import { BargainingChatModal } from "./components/farmer/BargainingChatModal";
import { AuctionBiddingModal } from "./components/buyer/AuctionBiddingModal";
import { SecuritySimulatorModal } from "./components/common/SecuritySimulatorModal";
import { TraceabilityQRModal } from "./components/common/TraceabilityQRModal";
import { AboutDeveloperModal } from "./components/common/AboutDeveloperModal";
import { InstitutionalRfqModal } from "./components/b2b/InstitutionalRfqModal";
import { ColdChainTelemetryModal } from "./components/logistics/ColdChainTelemetryModal";
import { LiveSmsDispatcherModal } from "./components/common/LiveSmsDispatcherModal";
import { BackendLiveEnginesPortal } from "./components/backend/BackendLiveEnginesPortal";

import { Sprout, Phone, Mail, ExternalLink, Award, GraduationCap, Building2, Radio } from "lucide-react";

const MainContent: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeModal, 
    setActiveModal, 
    selectedProductId, 
    lang 
  } = useApp();

  const [buyerSubView, setBuyerSubView] = useState<"LANDING" | "SHOP">("LANDING");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1E293B]">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Live Farmgate Market Ticker & Escrow Network Status Strip */}
      <div className="bg-stone-900 text-stone-300 border-b border-stone-800 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white shrink-0">
              {lang === "bn" ? "ফার্মগেট লাইভ দর:" : "Live Farmgate Index:"}
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums text-stone-300">
              <span>🌾 ধান ব্রি-২৮ ৳৩৪/কেজি</span>
              <span className="text-stone-600">·</span>
              <span>🥔 আলু (ডায়মন্ড) ৳২৯/কেজি</span>
              <span className="text-stone-600">·</span>
              <span>🌶️ লাল মরিচ ৳২৮০/কেজি</span>
              <span className="text-stone-600">·</span>
              <button
                onClick={() => setActiveModal("COLD_CHAIN_TELEMETRY")}
                className="hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer flex items-center gap-1 text-blue-400"
                title="View IoT Reefer Telemetry"
              >
                <span>❄️ বেলটিয়া কোল্ড হাব: ৮৮% আর্দ্রতা</span>
              </button>
              <span className="text-stone-600">·</span>
              <span className="text-emerald-400">এস্ক্রো সেটেলমেন্ট সক্রিয়</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveModal("BACKEND_ENGINES_MODAL")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-black shadow-xs transition-all cursor-pointer ring-1 ring-amber-300"
              title="Open Real-time Escrow, Cron SMS, Auction, & AI Vision Testing Engines"
            >
              <span>⚡</span>
              <span>{lang === "bn" ? "লাইভ ইঞ্জিন টেস্ট ল্যাব" : "Live Engine Lab"}</span>
            </button>

            <button
              onClick={() => setActiveModal("LIVE_SMS_TEST")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer ring-1 ring-emerald-400/50"
            >
              <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{lang === "bn" ? "📲 লাইভ এসএমএস টেস্ট ল্যাব" : "📲 Live SMS Test Lab"}</span>
            </button>

            <button
              onClick={() => setActiveModal("INSTITUTIONAL_RFQ")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "বাল্ক প্রাতিষ্ঠানিক RFQ" : "Enterprise RFQ"}</span>
            </button>

            <button
              onClick={() => setActiveModal("COLD_CHAIN_TELEMETRY")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors cursor-pointer border border-stone-700"
            >
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>ColdLink™ IoT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Buyer View Navigation Toggle (when in BUYER role) */}
        {role === "BUYER" && (
          <div className="flex items-center justify-between mb-6 bg-white p-1.5 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBuyerSubView("LANDING")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  buyerSubView === "LANDING"
                    ? "bg-[#14532D] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {lang === "bn" ? "প্ল্যাটফর্ম ওভারভিউ" : "Overview & Impact"}
              </button>

              <button
                onClick={() => setBuyerSubView("SHOP")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  buyerSubView === "SHOP"
                    ? "bg-[#14532D] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {lang === "bn" ? "ফার্মগেট মার্কেটপ্লেস" : "Farmgate Marketplace"}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-medium pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>জামালপুর সেন্ট্রাল হাব সংযুক্ত</span>
            </div>
          </div>
        )}

        {/* Role Content Render */}
        {role === "FARMER" && <FarmerDashboard />}

        {role === "BUYER" && (
          buyerSubView === "LANDING" ? (
            <LandingPage 
              onExploreShop={() => setBuyerSubView("SHOP")}
              onFarmerPortal={() => setRole("FARMER")}
            />
          ) : (
            <ShopPage />
          )
        )}

        {role === "ADMIN" && <AdminDashboard />}

      </main>

      {/* MODALS RENDERER */}
      {activeModal === "BACKEND_ENGINES_MODAL" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[94vh] flex flex-col font-sans">
            <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-lg">
                  ⚡
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                    <span>লাইভ সিস্টেম ইঞ্জিন ও প্রেজেন্টেশন টেস্ট পোর্টাল</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      Real Startup Architecture
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    এসক্রো ওয়ালেট ভল্ট · ৩-ঘণ্টার ডিজাস্টার এসএমএস ক্রন · রিভার্স অকশন ওয়েবসকেট · এআই শস্য ডাক্তার
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAFAF8]">
              <BackendLiveEnginesPortal />
            </div>
          </div>
        </div>
      )}

      {activeModal === "PRODUCT_DETAIL" && selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "CHECKOUT" && (
        <CheckoutModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "ORDER_TRACKING" && (
        <OrderTrackingModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "COLD_STORAGE" && (
        <ColdStorageBookingModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "BARGAINING" && (
        <BargainingChatModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "AUCTION" && (
        <AuctionBiddingModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "SECURITY_LAB" && (
        <SecuritySimulatorModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "TRACEABILITY_QR" && (
        <TraceabilityQRModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "ABOUT_DEVELOPER" && (
        <AboutDeveloperModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "INSTITUTIONAL_RFQ" && (
        <InstitutionalRfqModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "COLD_CHAIN_TELEMETRY" && (
        <ColdChainTelemetryModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "LIVE_SMS_TEST" && (
        <LiveSmsDispatcherModal onClose={() => setActiveModal(null)} />
      )}

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-20">
        
        {/* Professional Platform Banner */}
        <div className="bg-[#14532D] border-b border-emerald-800 py-3 px-4 text-center">
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            KrishiLink Platform · Smart Direct Farmer-to-Buyer Supply Chain & Marketplace for Bangladesh
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-lg">
                <div className="w-8 h-8 rounded-xl bg-[#14532D] flex items-center justify-center text-[#FBBF24]">
                  <Sprout className="w-5 h-5" />
                </div>
                <span>Krishi<span className="text-[#FBBF24]">Link</span></span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Smart Direct Farmer-to-Buyer Supply Chain & Intelligence Platform for Bangladesh.
                Eliminating middlemen cartels with AI vision, cold chain logistics, and blockchain traceability.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">
                Jamalpur & Dhaka Agri Hubs | Smart AgriTech Platform
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Agri Hubs & Warehouses</h4>
              <p className="text-xs">Central Reefer Hub: Beltia Bypass Road, Jamalpur Sadar</p>
              <p className="text-xs">Regional Upazila Office: Hazrabari Road, Melandaha</p>
              <p className="text-xs">Yamuna Char Sourcing Center: Station Road, Islampur</p>
              <p className="text-xs">Dhaka Metro Dispatch: Tejgaon Industrial Area, Dhaka</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Emergency Support Hotline</h4>
              <p className="text-xs flex items-center gap-1.5 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Toll-Free Agri Hotline: 16123 (16122)</span>
              </p>
              <p className="text-xs flex items-center gap-1.5 text-stone-300">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>Official Support: support@krishilink.gov.bd</span>
              </p>
              <p className="text-[11px] text-stone-500 pt-2">
                Certified by Department of Agricultural Extension (DAE) Bangladesh.
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span>&copy; {new Date().getFullYear()} KrishiLink AgriTech Limited. All Rights Reserved.</span>
              <span className="text-stone-300 font-medium">
                Crafted & Developed by{" "}
                <button 
                  onClick={() => setActiveModal("ABOUT_DEVELOPER")} 
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  title="View Lead Architect Credentials & JSTU Profile"
                >
                  Arnica Tabassum
                </button>
              </span>
              <span className="text-stone-500 font-mono text-[11px]">
                (Dept. of CSE, Jamalpur Science And Technology University - JSTU)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Dispute Protocol</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
