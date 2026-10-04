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

            <button
              onClick={() => setActiveModal("ABOUT_DEVELOPER")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors cursor-pointer border border-stone-700"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{lang === "bn" ? "আর্কিটেকচার ও প্রতিষ্ঠাতা" : "Founder & Architecture"}</span>
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

      {/* FOOTER - OFFICIAL JSTU & ARNICA TABASSUM BRANDING */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-20">
        
        {/* Professional Incubated By & Founder Accreditation Banner */}
        <div className="bg-[#14532D] border-b border-emerald-800 py-3 px-4 text-center">
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            KrishiLink Platform · Incubated at Department of Computer Science & Engineering, <span className="text-white font-semibold">Jamalpur Science And Technology University (JSTU)</span> · Founder & Lead Architect: <span className="text-[#FBBF24] font-semibold">Arnica Tabassum</span>
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
                Incubated in Jamalpur & Dhaka | Smart AgriTech Platform
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
                <span>Executive Support: tabassumarnica110@gmail.com</span>
              </p>
              <p className="text-[11px] text-stone-500 pt-2">
                Certified by Department of Agricultural Extension (DAE) Bangladesh.
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} KrishiLink AgriTech Limited. All Rights Reserved. Crafted by <span className="text-emerald-400 font-semibold">Arnica Tabassum</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Dispute Protocol</span>
              <span>•</span>
              <span className="font-mono text-emerald-500">System Status: 100% Operational</span>
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
