import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Wallet, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Sparkles, 
  Smartphone, 
  QrCode, 
  Building2, 
  Layers, 
  AlertCircle, 
  Users, 
  FileText, 
  Percent, 
  TrendingUp,
  RefreshCw,
  Award,
  ChevronRight,
  Send,
  Zap,
  Leaf
} from "lucide-react";
import confetti from "canvas-confetti";

export const KrishiPayWalletHub: React.FC = () => {
  const { currentUser, lang, addAuditLog } = useApp();

  // 1. Live Wallet Balances State
  const [cashBalance, setCashBalance] = useState<number>(12450);
  const [escrowLocked, setEscrowLocked] = useState<number>(38500);
  const [govtVoucherBalance, setGovtVoucherBalance] = useState<number>(5000);
  const [greenBonusBalance, setGreenBonusBalance] = useState<number>(1250);

  // 2. Feature 1: Multi-Stage Smart Escrow State
  const [escrowStages, setEscrowStages] = useState({
    stage1Loaded: true, // 20%
    stage2InTransit: false, // 40%
    stage3Delivered: false, // 40%
  });
  const [escrowOrderAmount] = useState<number>(15000); // ৳15,000 order

  // 3. Feature 2: Warehouse Receipt Financing (WRF)
  const [potatoStoredBags] = useState<number>(500); // 500 bags in Jamalpur Central Cold Storage
  const [potatoStoredValue] = useState<number>(150000); // ৳1,50,000 value
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(50000);
  const [loanDisbursed, setLoanDisbursed] = useState<boolean>(false);

  // 4. Feature 3: Agri-Credit Score & Micro-Advance
  const [creditScore] = useState<number>(785); // 785 / 850 (Excellent)
  const [inputAdvanceApproved, setInputAdvanceApproved] = useState<boolean>(false);

  // 5. Feature 4: Group Buying Bulk Pool
  const [groupPoolMembers, setGroupPoolMembers] = useState([
    { name: "গুলশান কিচেন প্রা. লি.", sharePct: 45, amount: 108000, paid: true },
    { name: "উত্তরা হোলসেল সুপারমার্ট", sharePct: 30, amount: 72000, paid: true },
    { name: "মিরপুর সমবায় বাজার", sharePct: 25, amount: 60000, paid: false },
  ]);

  // 6. Feature 5: Offline SMS Token Cash-Out
  const [generatedSmsToken, setGeneratedSmsToken] = useState<string>("KP-849201");
  const [cashOutCompleted, setCashOutCompleted] = useState<boolean>(false);
  const [agentBoothCode, setAgentBoothCode] = useState<string>("JAMALPUR-AGENT-09");

  // 7. General Feedback Notice
  const [liveSuccessMessage, setLiveSuccessMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setLiveSuccessMessage(msg);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
    setTimeout(() => setLiveSuccessMessage(null), 5000);
  };

  // --- ACTIONS ---

  // Feature 1: Milestone Release
  const handleReleaseTransitStage = () => {
    if (escrowStages.stage2InTransit) return;
    const releaseAmount = escrowOrderAmount * 0.4; // 40% = ৳6,000
    setEscrowStages(prev => ({ ...prev, stage2InTransit: true }));
    setEscrowLocked(prev => Math.max(0, prev - releaseAmount));
    setCashBalance(prev => prev + releaseAmount);
    addAuditLog(
      "ESCROW_MILESTONE_RELEASE",
      "/api/wallet/escrow/stage2",
      "ALLOWED",
      `Escrow Stage 2 Transit Released: ৳${releaseAmount} credited to ${currentUser.name} after Cold-Chain GPS & Temp Lock.`
    );
    showToast(`✅ ধাপ ২ সফল: কোল্ড চেইন ট্রানজিট ৪০% (৳${releaseAmount.toLocaleString()}) ছাড় হয়ে আপনার মূল ওয়ালেটে জমা হয়েছে!`);
  };

  const handleReleaseDeliveryStage = () => {
    if (escrowStages.stage3Delivered) return;
    const releaseAmount = escrowOrderAmount * 0.4; // 40% = ৳6,000
    setEscrowStages(prev => ({ ...prev, stage3Delivered: true }));
    setEscrowLocked(prev => Math.max(0, prev - releaseAmount));
    setCashBalance(prev => prev + releaseAmount);
    addAuditLog(
      "ESCROW_MILESTONE_RELEASE",
      "/api/wallet/escrow/stage3",
      "ALLOWED",
      `Escrow Stage 3 Delivery Released: ৳${releaseAmount} credited to ${currentUser.name} after Buyer QR scan.`
    );
    showToast(`🎉 ধাপ ৩ সফল: ক্রেতার ফ্রেশ ডেলিভারি নিশ্চিত হয়েছে! অবশিষ্ট ৪০% (৳${releaseAmount.toLocaleString()}) ওয়ালেটে যুক্ত হয়েছে!`);
  };

  // Feature 2: WRF Cold Storage Loan
  const handleDisburseStorageLoan = () => {
    if (loanDisbursed) return;
    setLoanDisbursed(true);
    setCashBalance(prev => prev + requestedLoanAmount);
    addAuditLog(
      "WRF_LOAN_DISBURSEMENT",
      "/api/wallet/wrf-loan",
      "ALLOWED",
      `Warehouse Receipt Loan ৳${requestedLoanAmount} disbursed for 500 potato bags at Jamalpur Cold Storage.`
    );
    showToast(`💰 ওয়্যারহাউজ রিসিপ্ট লোন অনুমোদিত: ৳${requestedLoanAmount.toLocaleString()} ক্যাশ আপনার ওয়ালেটে ক্রেডিট করা হয়েছে!`);
  };

  // Feature 3: Input Credit Advance
  const handleTakeInputAdvance = () => {
    if (inputAdvanceApproved) return;
    const advanceAmount = 25000;
    setInputAdvanceApproved(true);
    setCashBalance(prev => prev + advanceAmount);
    addAuditLog(
      "AGRI_INPUT_ADVANCE",
      "/api/wallet/input-advance",
      "ALLOWED",
      `Zero-interest input advance ৳${advanceAmount} disbursed based on Agri-Credit score ${creditScore}.`
    );
    showToast(`🌱 ইনপুট অগ্রিম সফল: চমৎকার ক্রেডিট স্কোরের (${creditScore}) ভিত্তিতে ৳${advanceAmount.toLocaleString()} ওয়ালেটে যোগ হয়েছে (ফসল বিক্রির পর স্বয়ংক্রিয় সমন্বয় হবে)।`);
  };

  // Feature 4: Group Buying Complete
  const handlePayRemainingGroupShare = () => {
    const updated = groupPoolMembers.map(m => ({ ...m, paid: true }));
    setGroupPoolMembers(updated);
    addAuditLog(
      "GROUP_BUYING_FUNDED",
      "/api/wallet/group-split/10ton",
      "ALLOWED",
      `Bulk 10-Ton Potato Pool 100% Funded (৳2,40,000). Full Truckload Purchase Order Dispatched to Farmer.`
    );
    showToast(`🤝 সমবায়ী গ্রুপ-বাইয়িং সফল: ৩য় ক্রেতার ২৫% পেমেন্ট সম্পন্ন! পুরো ১০ টন লটের (৳২,৪০,০০০) বাল্ক অর্ডার কৃষকের অ্যাকাউন্টে লক করা হয়েছে!`);
  };

  // Feature 5: Offline SMS Cash-out
  const handleSimulateAgentCashOut = () => {
    setCashOutCompleted(true);
    setCashBalance(prev => Math.max(0, prev - 5000));
    addAuditLog(
      "OFFLINE_SMS_CASHOUT",
      "/api/wallet/agent-cashout",
      "ALLOWED",
      `Offline SMS Token ${generatedSmsToken} redeemed at ${agentBoothCode} for ৳5,000 cash.`
    );
    showToast(`📱 এজেন্ট ক্যাশ-আউট সম্পন্ন: টোকেন ${generatedSmsToken} যাচাই করে ৳৫,০০০ নগদ ক্যাশ তুলে দেওয়া হয়েছে (ইন্টারনেটহীন চরাঞ্চল প্রযুক্তি)।`);
  };

  // Feature 6: Redeem Govt Fertilizer Voucher
  const handleRedeemGovtVoucher = () => {
    if (govtVoucherBalance < 1500) return;
    setGovtVoucherBalance(prev => prev - 1500);
    addAuditLog(
      "GOVT_VOUCHER_REDEEM",
      "/api/wallet/govt-voucher/bcic",
      "ALLOWED",
      `৳1,500 BCIC Subsidized Fertilizer Voucher redeemed via QR code.`
    );
    showToast(`🌾 সরকারি প্রণোদনা রিডিম: বিসিআইসি ডিলার পয়েন্টে ১ বস্তা ডিএপি সার ক্রয়ে ৳১,৫০০ ভাউচার সফলভাবে রিডিম করা হয়েছে!`);
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 font-sans">
      
      {/* Toast Notification */}
      {liveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>{liveSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setLiveSuccessMessage(null)}
            className="text-white hover:text-stone-200 text-xs underline cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* 1. Header with Multi-Pocket Balance Display */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-black shadow-md">
            <Wallet className="w-6 h-6 text-[#FBBF24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                KrishiPay™ (কৃষি-পে স্মার্ট অ্যাগ্রি-ফিনটেক ওয়ালেট)
              </h2>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                Smart Agri-FinTech Protocol
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              স্মার্ট এস্ক্রো, কোল্ড স্টোরেজ রশিদ লোন, ক্রেডিট স্কোর ও চরাঞ্চলের অফলাইন ক্যাশ-আউট হাব
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>লাইভ টেস্ট মোড সক্রিয়</span>
          </span>
        </div>
      </div>

      {/* 2. Four Integrated Pockets Ledger Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pocket 1: Cash Balance */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-500 to-[#14532D] text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              ১. উত্তোলনযোগ্য নগদ ব্যালেন্স
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="text-3xl font-black font-mono">
            ৳{cashBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-100 block">
            বিকাশ / নগদ / ব্যাংক অ্যাকাউন্টে তাৎক্ষণিক ট্রান্সফারযোগ্য
          </span>
        </div>

        {/* Pocket 2: Smart Escrow Locked */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500 to-amber-700 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>২. স্মার্ট এস্ক্রো লকড ফান্ড</span>
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-200" />
          </div>
          <div className="text-3xl font-black font-mono">
            ৳{escrowLocked.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-100 block">
            ক্রেতার পেমেন্ট নিরাপদ; ধাপভিত্তিক কিউসি যাচাইয়ে ছাড় হবে
          </span>
        </div>

        {/* Pocket 3: Govt Subsidized Voucher */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-800 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
              ৩. সরকারি সার ও ডিজেল ভাউচার
            </span>
            <FileText className="w-4 h-4 text-blue-200" />
          </div>
          <div className="text-3xl font-black font-mono">
            ৳{govtVoucherBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-100 block">
            বিসিআইসি নিবন্ধিত ডিলার পয়েন্টে কিউআর স্ক্যানে রিডিমযোগ্য
          </span>
        </div>

        {/* Pocket 4: Green Farming Cashback */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-teal-600 to-teal-800 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-100 uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              <span>৪. গ্রিন ফার্মিং বোনাস ক্যাশ</span>
            </span>
            <Award className="w-4 h-4 text-teal-200" />
          </div>
          <div className="text-3xl font-black font-mono">
            ৳{greenBonusBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-100 block">
            ভার্মিকম্পোস্ট ও বিষমুক্ত শস্য বিক্রয়ে ২% পরিবেশবান্ধব রিওয়ার্ড
          </span>
        </div>

      </div>

      {/* 3. SIX REVOLUTIONARY FINTECH CARDS (INTERACTIVE SIMULATOR) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ============================================================== */}
        {/* FEATURE 1: SMART ESCROW & MULTI-STAGE MILESTONE PAYMENT */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                ১
              </div>
              <h3 className="font-extrabold text-base text-stone-900">
                স্মার্ট এস্ক্রো ও মাল্টি-স্টেজ মাইলস্টোন রিলিজ (Agri-Escrow)
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
              মাইলস্টোন ট্র্যাকার
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs space-y-1">
            <div className="flex justify-between font-bold text-stone-800">
              <span>চলমান অর্ডার #KL-9402: ৫০০ কেজি গোল আলু</span>
              <span className="font-mono text-[#14532D]">মোট এস্ক্রো: ৳১৫,০০০</span>
            </div>
            <span className="text-stone-500 block">ক্রেতা: শফিকুল ইসলাম (বনানী, ঢাকা)</span>
          </div>

          {/* 3 Stages Workflow */}
          <div className="space-y-2.5">
            {/* Stage 1 */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-emerald-900 block">ধাপ ১ (২০% = ৳৩,০০০): ফার্মগেটে ট্রাকে লোড ও ওজন</span>
                  <span className="text-[10px] text-emerald-700">ফার্মগেটে ডিজিটাল স্কেল নিশ্চিতকরণ সম্পন্ন</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                ছাড় হয়েছে ✓
              </span>
            </div>

            {/* Stage 2 */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              escrowStages.stage2InTransit ? "bg-emerald-50 border-emerald-200" : "bg-white border-stone-200"
            }`}>
              <div className="flex items-center gap-2">
                {escrowStages.stage2InTransit ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <span className="font-bold text-stone-900 block">ধাপ ২ (৪০% = ৳৬,০০০): কোল্ড চেইন ট্রানজিট ও তাপমাত্রা লক</span>
                  <span className="text-[10px] text-stone-500">জিপিএস হাইওয়ে ট্র্যাকিং ও তাপমাত্রা ৪°C নিশ্চিত হলে</span>
                </div>
              </div>
              {escrowStages.stage2InTransit ? (
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                  ছাড় হয়েছে ✓
                </span>
              ) : (
                <button
                  onClick={handleReleaseTransitStage}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer shadow-xs"
                >
                  সিমুলেট: ৪০% ছাড়
                </button>
              )}
            </div>

            {/* Stage 3 */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              escrowStages.stage3Delivered ? "bg-emerald-50 border-emerald-200" : "bg-white border-stone-200"
            }`}>
              <div className="flex items-center gap-2">
                {escrowStages.stage3Delivered ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-stone-400" />
                )}
                <div>
                  <span className="font-bold text-stone-900 block">ধাপ ৩ (৪০% = ৳৬,০০০): ক্রেতা ডেলিভারি ও কিউআর স্ক্যান</span>
                  <span className="text-[10px] text-stone-500">ক্রেতা মালামাল ফ্রেশ বুঝে নিলে চূড়ান্ত ছাড়</span>
                </div>
              </div>
              {escrowStages.stage3Delivered ? (
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                  ছাড় হয়েছে ✓
                </span>
              ) : (
                <button
                  onClick={handleReleaseDeliveryStage}
                  disabled={!escrowStages.stage2InTransit}
                  className="px-3 py-1.5 rounded-lg bg-[#14532D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  সিমুলেট: ৪০% ছাড়
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FEATURE 2: DIGITAL WAREHOUSE RECEIPT FINANCING (WRF) */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                ২
              </div>
              <h3 className="font-extrabold text-base text-stone-900">
                কোল্ড স্টোরেজ ডিজিটাল রশিদ ঋণ (WRF Cash Advance)
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-bold">
              ই-রশিদ #WR-984
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2">
            <div className="flex justify-between font-bold text-stone-800">
              <span>জামালপুর সেন্ট্রাল হিমাগার (রশিদ #CS-JM-984)</span>
              <span className="text-blue-700 font-mono font-bold">৭০% লোন লিমিট</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 text-stone-600">
              <div>সংরক্ষিত: <strong>{potatoStoredBags} বস্তা আলু</strong></div>
              <div>বাজারমূল্য: <strong>৳{potatoStoredValue.toLocaleString()}</strong></div>
              <div className="col-span-2 text-emerald-800 font-bold">
                অনুমোদিত ক্যাশ ক্রেডিট লাইন: ৳{(potatoStoredValue * 0.7).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interactive Loan Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">প্রয়োজনীয় লোন পরিমাণ নির্বাচন করুন:</span>
              <span className="text-blue-800 font-mono text-sm">৳{requestedLoanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={105000}
              step={5000}
              disabled={loanDisbursed}
              value={requestedLoanAmount}
              onChange={(e) => setRequestedLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>৳১০,০০০</span>
              <span>সর্বোচ্চ: ৳১,০৫,০০০ (৭০%)</span>
            </div>
          </div>

          <button
            onClick={handleDisburseStorageLoan}
            disabled={loanDisbursed}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
              loanDisbursed 
                ? "bg-emerald-600 text-white cursor-default" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{loanDisbursed ? "✓ ৳" + requestedLoanAmount.toLocaleString() + " ওয়ালেটে ট্রান্সফার সম্পন্ন" : "রশিদের জামানতে তাৎক্ষণিক ক্যাশ লোন নিন"}</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* FEATURE 3: ALGORITHMIC AGRI-CREDIT SCORE & MICRO-ADVANCE */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                ৩
              </div>
              <h3 className="font-extrabold text-base text-stone-900">
                জামানতবিহীন কৃষি ক্রেডিট স্কোর ও ইনপুট অগ্রিম
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md font-bold">
              AI Credit Engine
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 font-bold block">আপনার কৃষি ক্রেডিট স্কোর (Agri-Score):</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-purple-700">{creditScore}</span>
                <span className="text-xs text-stone-400 font-mono">/ ৮৫০</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">
                ✓ গ্রেড: A+ (চমৎকার ট্রাস্ট রেকর্ড)
              </span>
            </div>

            <div className="text-right text-xs space-y-0.5 text-stone-600">
              <div>৩ মৌসুমে ফলন: <strong>১৮.৫ টন</strong></div>
              <div>ডেলিভারি রেটিং: <strong>৯৯.২%</strong></div>
              <div>ডিফল্ট হিস্ট্রি: <strong>০%</strong></div>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            আপনার উচ্চ স্কোরের কারণে আগামী রবি মৌসুমের বীজ ও সার কেনার জন্য <strong>৳২৫,০০০ পর্যন্ত ০% সুদে ইনপুট অগ্রিম</strong> অনুমোদিত।
          </p>

          <button
            onClick={handleTakeInputAdvance}
            disabled={inputAdvanceApproved}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
              inputAdvanceApproved 
                ? "bg-emerald-600 text-white cursor-default" 
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
            <span>{inputAdvanceApproved ? "✓ ৳২৫,০০০ ইনপুট অগ্রিম ওয়ালেটে যুক্ত হয়েছে" : "০% সুদে ৳২৫,০০০ ইনপুট লোন ওয়ালেটে নিন"}</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* FEATURE 4: GROUP BUYING SPLIT WALLET (BULK B2B POOL) */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                ৪
              </div>
              <h3 className="font-extrabold text-base text-stone-900">
                পাইকারি ক্রেতা গ্রুপ-বাইয়িং স্প্লিট ওয়ালেট (Bulk B2B Pool)
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md font-bold">
              ১০ টন লট পুল
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs space-y-1">
            <div className="flex justify-between font-bold text-stone-800">
              <span>সমবায়ী ক্রয় পুল #POOL-10TON (আলু লট)</span>
              <span className="font-mono text-indigo-700">মোট মূল্য: ৳২,৪০,০০০</span>
            </div>
            <span className="text-stone-500 block">পাইকারি রেট: ৳২৪/কেজি (একক কেনায় লাভ +৳৬/কেজি সাশ্রয়)</span>
          </div>

          {/* Members Pool Contribution */}
          <div className="space-y-2 text-xs">
            {groupPoolMembers.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 block">{m.name}</span>
                  <span className="text-[10px] text-stone-500 font-mono">অংশ: {m.sharePct}% (৳{m.amount.toLocaleString()})</span>
                </div>
                {m.paid ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    পরিশোধিত ✓
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold animate-pulse">
                    অপেক্ষারত...
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handlePayRemainingGroupShare}
            disabled={groupPoolMembers.every(m => m.paid)}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Users className="w-4 h-4" />
            <span>
              {groupPoolMembers.every(m => m.paid) 
                ? "✓ ১০০% ফান্ডিং সম্পন্ন! ফুল ট্রাকলোড অর্ডার রিলিজড" 
                : "সিমুলেট: ৩য় ক্রেতার ২৫% শেয়ার জমা দিন"}
            </span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* FEATURE 5: OFFLINE CHAR ZONE "SMS TOKEN CASH-OUT" */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                ৫
              </div>
              <h3 className="font-extrabold text-base text-stone-900">
                চরাঞ্চলের জন্য ইন্টারনেটহীন "এসএমএস টোকেন ক্যাশ-আউট"
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md font-bold">
              Offline OTP POS
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
            <span className="text-stone-500 font-bold block">
              যমুনা ও ব্রহ্মপুত্র চরে ফোরজি নেটওয়ার্ক না থাকলে বাটন ফোনের জন্য:
            </span>
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div>
                <span className="text-[10px] text-rose-700 block font-bold">আপনার গোপন ক্যাশ-আউট টোকেন:</span>
                <span className="text-xl font-black font-mono text-rose-950 tracking-wider">
                  {generatedSmsToken}
                </span>
              </div>
              <Smartphone className="w-6 h-6 text-rose-600" />
            </div>
            <p className="text-[11px] text-stone-500">
              এজেন্ট পয়েন্ট ({agentBoothCode}): যেকোনো বিকাশ/নগদ বুথে শুধু এই এসএমএস টোকেন বললেই সাথে সাথে ক্যাশ টাকা হাতে পাবেন।
            </p>
          </div>

          <button
            onClick={handleSimulateAgentCashOut}
            disabled={cashOutCompleted}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
              cashOutCompleted 
                ? "bg-emerald-600 text-white cursor-default" 
                : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{cashOutCompleted ? "✓ এজেন্ট পয়েন্টে ৳৫,০০০ ক্যাশ হ্যান্ডওভার স্লিপ জেনারেটেড" : "সিমুলেট: এজেন্ট পয়েন্টে এসএমএস টোকেন দিয়ে ক্যাশ নিন"}</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* FEATURE 6: GOVT SUBSIDIZED VOUCHER & CARBON CREDIT CASHBACK */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                ৬
              </div>
              <h3 className="font-extrabold text-base text-stone-900">
                সরকারি সার ভাউচার ও গ্রিন-ফার্মিং রিডিম
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
              DBT Subsidies
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-stone-800">বিসিআইসি সরকারি ডিলার নেটওয়ার্ক (জামালপুর)</span>
              <span className="text-emerald-700 font-mono">ভাউচার: ৳{govtVoucherBalance.toLocaleString()}</span>
            </div>
            <p className="text-stone-500 leading-relaxed text-[11px]">
              ডিজিটাল লকড ভাউচার হওয়ায় এই অর্থ কোনো অনাকাঙ্ক্ষিত কাজে ব্যয় করা যাবে না; কৃষক শুধুমাত্র অনুমোদিত ডিলারের কিউআর স্ক্যান করে ইউরিয়া/টিএসপি সার সংগ্রহ করতে পারেন।
            </p>
          </div>

          <button
            onClick={handleRedeemGovtVoucher}
            disabled={govtVoucherBalance < 1500}
            className="w-full py-3 rounded-2xl bg-[#14532D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <QrCode className="w-4 h-4 text-[#FBBF24]" />
            <span>সিমুলেট: কিউআর স্ক্যান করে ১ বস্তা সার (৳১,৫০০) রিডিম করুন</span>
          </button>
        </div>

      </div>

    </div>
  );
};
