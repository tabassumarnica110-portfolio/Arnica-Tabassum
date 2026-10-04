import React from "react";
import { useApp } from "../../context/AppContext";
import { X, QrCode, ShieldCheck, MapPin, Calendar, CheckCircle2, Download, ExternalLink } from "lucide-react";

export const TraceabilityQRModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { products, selectedProductId, lang } = useApp();
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-6 h-6 text-[#FBBF24]" />
            <div>
              <h3 className="font-bold text-lg">ডিজিটাল ট্রেসেবিলিটি কিউআর কোড</h3>
              <p className="text-xs text-emerald-200">
                {product.banglaName} • টোকেন: {product.qrCodeToken}
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

        <div className="p-6 sm:p-8 space-y-6 text-center">
          
          {/* Visual QR Code Display */}
          <div className="p-6 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-300 inline-block shadow-inner">
            <div className="w-52 h-52 bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center border border-stone-200 mx-auto">
              <QrCode className="w-36 h-36 text-stone-900" />
              <span className="text-[10px] font-mono text-stone-500 mt-2 block">
                {product.qrCodeToken}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-base text-stone-900">
              স্মার্টফোন ক্যামেরা দিয়ে স্ক্যান করুন
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              ভোক্তা সরাসরি দেখতে পাবেন বীজ রোপণ থেকে ফসল তোলার সম্পূর্ণ সচিত্র ইতিহাস।
            </p>
          </div>

          {/* Verification Badge */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-xs space-y-1.5 font-mono text-stone-700">
            <div className="flex justify-between">
              <span>উৎপাদক খামার:</span>
              <span className="font-bold text-[#14532D]">{product.farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span>অবস্থান:</span>
              <span>{product.upazila}, {product.district}</span>
            </div>
            <div className="flex justify-between">
              <span>ফসল উত্তোলন:</span>
              <span>{product.harvestDate}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-bold pt-1 border-t">
              <span>ল্যাব মান সনদ:</span>
              <span>Passed Grade A+ (100% Organic)</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => alert(`QR Code token: ${product.qrCodeToken} copied to clipboard!`)}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>কিউআর ডাউনলোড</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
