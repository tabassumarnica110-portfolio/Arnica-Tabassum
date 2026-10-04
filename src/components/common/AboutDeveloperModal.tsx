import React from "react";
import { 
  X, 
  GraduationCap, 
  ShieldCheck, 
  Code2, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  KeyRound, 
  MapPin, 
  Mail, 
  Award,
  BookOpen
} from "lucide-react";

export const AboutDeveloperModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col font-sans">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#14532D] via-[#166534] to-[#0A2F18] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] text-stone-950 flex items-center justify-center font-black text-xl shadow-lg">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl">Arnica Tabassum</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold font-mono">
                  Dept. of CSE | JSTU
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Lead Software Architect • Jamalpur Science And Technology University (JSTU)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-800">
          
          {/* Official Architectural Leadership Statement */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
            <div className="flex items-center gap-2 text-[#14532D] font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#D97706]" />
              <span>Platform Architecture & Innovation Charter</span>
            </div>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">
              "KrishiLink is a production-grade AgriTech supply chain network engineered by Arnica Tabassum at Jamalpur Science And Technology University (JSTU). Designed to eliminate exploitative intermediaries, provide real-time cold-chain visibility, and empower Bangladeshi farmers through AI disease vision, blockchain traceability, and direct escrow payments."
            </p>
          </div>

          {/* Academic & University Affiliation Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-bold uppercase tracking-wider block text-[10px]">Lead Architect & Engineer</span>
              <p className="text-base font-black text-stone-900">Arnica Tabassum</p>
              <p className="text-stone-600 font-mono">Dept. of Computer Science & Engineering</p>
              <p className="text-stone-600 font-mono">Email: tabassumarnica110@gmail.com</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-bold uppercase tracking-wider block text-[10px]">Institution</span>
              <p className="text-base font-black text-[#14532D]">Jamalpur Science And Technology University</p>
              <p className="text-stone-600">Faculty of Engineering & Technology (CSE)</p>
              <p className="text-stone-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Melandaha, Jamalpur, Bangladesh</span>
              </p>
            </div>
          </div>

          {/* Official Live Credentials Box */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-800">
              <span className="font-bold text-[#FBBF24] flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>Official Live Testing Credentials (Bcrypt 12 Salt Rounds Protected):</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">● Active Online</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-950 flex flex-wrap items-center justify-between gap-2 border border-stone-800">
                <div>
                  <span className="text-stone-400 block text-[10px]">ADMIN PORTAL (QC, KYC NID Verification, Logs):</span>
                  <span className="font-bold text-emerald-400">admin@krishilink.com</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">PASSWORD:</span>
                  <span className="bg-stone-800 px-2.5 py-0.5 rounded text-amber-300 font-bold">Admin@12345!JSTU</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 flex flex-wrap items-center justify-between gap-2 border border-stone-800">
                <div>
                  <span className="text-stone-400 block text-[10px]">FARMER PORTAL (Voice Sourcing, Cold Storage, Weather):</span>
                  <span className="font-bold text-emerald-400">farmer@jstu.edu</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">PASSWORD:</span>
                  <span className="bg-stone-800 px-2.5 py-0.5 rounded text-amber-300 font-bold">Farmer@123</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 flex flex-wrap items-center justify-between gap-2 border border-stone-800">
                <div>
                  <span className="text-stone-400 block text-[10px]">BUYER PORTAL (Direct Farmgate Marketplace, Checkout):</span>
                  <span className="font-bold text-emerald-400">buyer@jstu.edu</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">PASSWORD:</span>
                  <span className="bg-stone-800 px-2.5 py-0.5 rounded text-amber-300 font-bold">Buyer@123</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Points Security Hardening Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Security & Defense Implementation Matrix:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bcrypt 12 Rounds + 5-Wrong Login 15m Lockout</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NextAuth v5 HttpOnly Strict Cookie RBAC</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zod Runtime Payload Validation + DOMPurify XSS</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Magic Bytes File Inspection + Private NID Signed URLs</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sliding Window Rate Limiter + Anti-Bot Honeypot</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CSP, X-Frame DENY, HSTS, Disable X-Powered-By</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[#14532D] text-white font-bold cursor-pointer font-sans"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
