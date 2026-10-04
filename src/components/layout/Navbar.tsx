import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";
import { 
  Sprout, 
  ShieldCheck, 
  ShoppingCart, 
  CloudRain, 
  Globe, 
  Lock,
  Award,
  X,
  User,
  ChevronDown,
  ExternalLink
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    lang, 
    setLang, 
    currentUser, 
    cart, 
    setActiveModal, 
    lockoutStatus 
  } = useApp();

  const [showWeatherAlert, setShowWeatherAlert] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      
      {/* Real-time Agricultural Weather Alert */}
      {showWeatherAlert && (
        <div className="bg-amber-50 border-b border-amber-200/70 text-stone-900 px-4 py-2 text-xs font-medium transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <CloudRain className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-stone-800 leading-tight">
                {lang === "bn" 
                  ? "জরুরি কৃষি আবহাওয়া বার্তা (জামালপুর অঞ্চল): আগামী ২৪ ঘণ্টায় স্থানীয় বৃষ্টিপাতের সম্ভাবনা রয়েছে। পাকা আমন ধান ও খেতের সংগৃহীত ফসল দ্রুত আচ্ছাদিত গুদামে স্থানান্তর করুন।" 
                  : "Regional Weather Advisory (Jamalpur): Rain forecasted within 24h. Secure harvested paddy and perishable produce in covered storage."}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline-block text-[11px] font-mono text-stone-500 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200">
                OpenWeather Grounded
              </span>
              <button
                onClick={() => setShowWeatherAlert(false)}
                className="p-1 text-stone-500 hover:text-stone-800 rounded-md hover:bg-amber-100 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => setActiveModal(null)}
          >
            <div className="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-md shadow-[#14532D]/20 transition-transform hover:scale-102">
              <Sprout className="w-6 h-6 text-[#FBBF24]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#14532D]">
                  Krishi<span className="text-[#D97706]">Link</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  AgriTech
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-normal hidden sm:block">
                {lang === "bn" ? "সরাসরি কৃষক-টু-ভোক্তা কৃষি নেটওয়ার্ক" : "Direct Farm-to-Buyer Supply Chain"}
              </p>
            </div>
          </div>

          {/* Role Switcher - Segmented Control */}
          <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
            {(["FARMER", "BUYER", "ADMIN"] as Role[]).map((r) => {
              const isActive = role === r;
              const labels = {
                FARMER: { bn: "কৃষক পোর্টাল", en: "Farmer App" },
                BUYER: { bn: "মার্কেটপ্লেস ও শপ", en: "Buyer Shop" },
                ADMIN: { bn: "অ্যাডমিন ও কোয়ালিটি", en: "Admin & QC" },
              };
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#14532D] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                  }`}
                >
                  {labels[r][lang]}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Leadership & Institution Info */}
            <button
              onClick={() => setActiveModal("ABOUT_DEVELOPER")}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
              title="Architecture & Founder (JSTU)"
            >
              <Award className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Arnica Tabassum · JSTU</span>
            </button>

            {/* Security & Audit Dialog */}
            <button
              onClick={() => setActiveModal("SECURITY_LAB")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
              title="Cybersecurity & Audit Logs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">
                {lang === "bn" ? "নিরাপত্তা ও অডিট" : "Security & Audit"}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setActiveModal("CHECKOUT")}
              className="relative p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-200 transition-colors cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4 px-1 bg-[#D97706] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-[#14532D] font-bold text-xs">
                {currentUser.name[0]}
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-semibold text-stone-800 truncate max-w-[110px]">
                  {currentUser.name.split(" ")[0]}
                </div>
                <span className="text-[10px] text-stone-500">
                  {currentUser.district} · {currentUser.role}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Role Switcher */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-stone-100 gap-1">
          {(["FARMER", "BUYER", "ADMIN"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                role === r ? "bg-[#14532D] text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {r === "FARMER" ? "কৃষক" : r === "BUYER" ? "মার্কেটপ্লেস" : "অ্যাডমিন"}
            </button>
          ))}
        </div>

      </div>

      {/* Account Lockout Notification */}
      {lockoutStatus.isLocked && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>
            {lang === "bn"
              ? `নিরাপত্তা সতর্কতা: অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে। ৫ বার ভুল প্রচেষ্টার কারণে ${lockoutStatus.minutes} মিনিট কোনো লগইন অনুমতি নেই।`
              : `Security Alert: Account suspended for ${lockoutStatus.minutes} minutes due to multiple failed authentication attempts.`}
          </span>
        </div>
      )}
    </header>
  );
};
