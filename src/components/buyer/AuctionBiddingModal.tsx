import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { X, Flame, Gavel, CheckCircle2, Send, Clock, UserCheck, Radio, RefreshCw, ArrowDown, Sparkles, Trophy, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface BidItem {
  id: string;
  farmerName: string;
  price: number;
  qty: number;
  time: string;
  message?: string;
  isNew?: boolean;
}

const SIMULATED_BIDDERS = [
  { name: "মো. রফিকুল ইসলাম (ইসলামপুর চরাঞ্চল)", message: "আজই ট্রাক লোড দেওয়া যাবে, আর্দ্রতা ১২% নিশ্চিত।" },
  { name: "আব্দুল কুদ্দুস (মেলান্দহ উমিরপুর)", message: "সরাসরি মাঠের ফ্রেশ শুকনো ব্রি-২৮ ধান, বস্তা প্রস্তুত।" },
  { name: "আমিরুল হোসেন (দেওয়ানগঞ্জ বাজার)", message: "উন্নত মানের গ্রেড-এ ধান, বাহাদুরাবাদ ঘাট পয়েন্টে ডেলিভারি।" },
  { name: "মো. মোজাম্মেল হক (সরিষাবাড়ী)", message: "১০০ বস্তা অবিলম্বে চালান দেওয়া সম্ভব।" },
  { name: "আজিজুল হক (জামালপুর সদর)", message: "কেন্দুয়া সোনালী খামার থেকে সরাসরি ফ্রেশ লট।" },
  { name: "নুরুল ইসলাম (বকশীগঞ্জ)", message: "উঁচু ভিটায় শুকানো চিটামুক্ত সোনালী ধান।" }
];

export const AuctionBiddingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { auctions, placeAuctionBid, currentUser, lang } = useApp();
  const auction = auctions[0];
  const wsRef = useRef<WebSocket | null>(null);

  const [liveBids, setLiveBids] = useState<BidItem[]>(auction.bids || [
    { id: "b-1", farmerName: "মো. রফিকুল ইসলাম (ইসলামপুর চরাঞ্চল)", price: 33.2, qty: 5000, time: "২ মিনিট আগে", message: "শুকনা ব্রি-২৮ ধান প্রস্তুত।" },
    { id: "b-2", farmerName: "আব্দুল কুদ্দুস (মেলান্দহ উমিরপুর)", price: 33.8, qty: 4500, time: "৫ মিনিট আগে", message: "গ্রেড-১ মানের চাল উপযোগী ধান।" }
  ]);
  const [liveFeedActive, setLiveFeedActive] = useState<boolean>(true);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [newestBidId, setNewestBidId] = useState<string | null>(null);
  const [winnerInfo, setWinnerInfo] = useState<any | null>(null);

  const [myBidPrice, setMyBidPrice] = useState<number>(32.2);
  const [myBidQty, setMyBidQty] = useState<number>(4000);
  const [myMessage, setMyMessage] = useState<string>("আমার খামারে শুকনা ১১.৫% আর্দ্রতার ব্রি-২৮ ধান প্রস্তুত আছে।");
  const [bidSubmitted, setBidSubmitted] = useState<boolean>(false);

  // Play subtle audio ping on incoming competitive bid
  const playBidPing = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // Connect to Backend WebSocket
  useEffect(() => {
    let socket: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      socket = new WebSocket(`${protocol}//${host}/ws/auction`);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
        socket?.send(JSON.stringify({ type: "GET_STATE" }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "AUCTION_STATE" && data.payload?.activeBids?.["auc-dhan-28"]) {
            const serverBids = data.payload.activeBids["auc-dhan-28"];
            const formatted: BidItem[] = serverBids.map((b: any) => ({
              id: b.id,
              farmerName: `${b.farmerName} (${b.upazila})`,
              price: b.price,
              qty: b.qty,
              time: "এইমাত্র (WebSocket)",
              message: b.message
            }));
            setLiveBids(formatted.sort((a, b) => a.price - b.price));
          } else if (data.type === "NEW_BID_BROADCAST") {
            const b = data.payload.bid;
            const newBid: BidItem = {
              id: b.id,
              farmerName: `${b.farmerName} (${b.upazila})`,
              price: b.price,
              qty: b.qty,
              time: "এইমাত্র (WebSocket)",
              message: b.message,
              isNew: true
            };
            setLiveBids((prev) => [newBid, ...prev.filter((item) => item.id !== b.id)].sort((x, y) => x.price - y.price));
            setNewestBidId(b.id);
            playBidPing();
          } else if (data.type === "WINNER_DECLARED_BROADCAST") {
            setWinnerInfo(data.payload.winner);
            try { confetti({ particleCount: 80, spread: 70 }); } catch (e) {}
          }
        } catch (e) {}
      };

      socket.onclose = () => setWsConnected(false);
      socket.onerror = () => setWsConnected(false);
    } catch (e) {
      setWsConnected(false);
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  // Handle local user submission
  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    const myBidId = `user-bid-${Date.now()}`;
    const newBid: BidItem = {
      id: myBidId,
      farmerName: `${currentUser.name} (${currentUser.upazila || "জামালপুর সদর"})`,
      price: Number(myBidPrice),
      qty: Number(myBidQty),
      time: "এইমাত্র (আপনার বিড)",
      message: myMessage,
      isNew: true
    };

    setLiveBids((prev) => [newBid, ...prev].sort((a, b) => a.price - b.price));
    setNewestBidId(myBidId);
    placeAuctionBid(auction.id, myBidPrice, myBidQty, myMessage);

    // Send to WebSocket server if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "PLACE_BID",
          payload: {
            auctionId: "auc-dhan-28",
            farmerName: currentUser.name,
            farmerPhone: currentUser.phone || "০১৭১২-৩৪৫৬৭৮",
            upazila: currentUser.upazila || "জামালপুর সদর",
            price: Number(myBidPrice),
            qty: Number(myBidQty),
            moisturePct: 11.5,
            lotGrade: "গ্রেড-১",
            message: myMessage
          }
        })
      );
    }

    setBidSubmitted(true);
    playBidPing();
    setTimeout(() => setBidSubmitted(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">পাইকারি লাইভ নিলাম ও বিডিং পোর্টাল</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pusher WebSocket লাইভ স্ট্রিম সিঙ্ক (রিয়েল-টাইম মার্কেট)</span>
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

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Live Winner Award Notification if declared */}
          {winnerInfo && (
            <div className="p-4 rounded-2xl bg-amber-400 text-stone-950 font-sans shadow-lg space-y-1.5 animate-scaleIn border border-amber-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-stone-950" />
                  <span className="font-black text-sm">
                    🎉 নিলাম বিজয়ী ঘোষিত: {winnerInfo.farmerName} ({winnerInfo.upazila})
                  </span>
                </div>
                <span className="font-mono text-xs font-bold bg-stone-950 text-white px-2.5 py-0.5 rounded-full">
                  দর: ৳{winnerInfo.price}/কেজি
                </span>
              </div>
              <p className="text-xs text-stone-900 font-medium">
                ডিজিটাল কন্ট্রাক্ট স্বাক্ষরিত এবং কৃষিলিঙ্ক এসক্রো ভল্টে তহবিল লক করা হয়েছে (টোকেন: {winnerInfo.escrowId})।
              </p>
            </div>
          )}

          {/* Auction Overview Box */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500 text-stone-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>{auction.buyerName}</span>
              </span>
              <span className="text-xs font-mono bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                শেষ সময়: {auction.deadline}
              </span>
            </div>
            <h4 className="font-black text-lg text-stone-900">{auction.title}</h4>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono">
              <span>প্রয়োজনীয় পরিমাণ: <strong>{auction.quantityKg} কেজি ({auction.quantityKg / 40} মণ)</strong></span>
              <span>টার্গেট সর্বোচ্চ দর: <strong>৳{auction.targetPrice}/কেজি</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                বর্তমান সর্বনিম্ন দর: ৳{liveBids[0]?.price || auction.targetPrice}/কেজি
              </span>
            </div>
          </div>

          {/* Live Bids Feed with setInterval Real-Time Simulation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <div className="flex items-center gap-2">
                <span className="text-stone-900">লাইভ বিডিং ফিড (Live Bidding Feed):</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{liveBids.length}টি বিড রানিং</span>
                </span>
              </div>

              {/* Simulation Toggle */}
              <button
                type="button"
                onClick={() => setLiveFeedActive(!liveFeedActive)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  liveFeedActive
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${liveFeedActive ? "animate-spin" : ""}`} />
                <span>{liveFeedActive ? "লাইভ ফিড চলছে" : "ফিড পজ করা"}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {liveBids.map((b, i) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                    b.id === newestBidId
                      ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/60 shadow-md animate-pulse"
                      : i === 0
                      ? "bg-emerald-50/90 border-emerald-400 shadow-xs"
                      : "bg-white border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900">{b.farmerName}</span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#14532D] text-white text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>শীর্ষ বিজয়ী দর (Leading Bid)</span>
                        </span>
                      )}
                      {b.id === newestBidId && (
                        <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-bold animate-bounce">
                          নতুন বিড!
                        </span>
                      )}
                    </div>
                    {b.message && <p className="text-stone-600 text-[11px] italic">"{b.message}"</p>}
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{b.time}</span>
                    </span>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <div className="flex items-center justify-end gap-1">
                      <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xl font-black font-mono text-[#14532D]">৳{b.price}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-medium">/কেজি ({b.qty.toLocaleString()} কেজি)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Place New Bid Form (For Farmers or simulated users) */}
          <form onSubmit={handleSubmitBid} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
              <span>আপনার প্রস্তাবিত দর ও লট সাবমিট করুন:</span>
              <span className="text-[11px] text-stone-500 lowercase font-normal">সর্বনিম্ন দর অগ্রাধিকার পাবে</span>
            </h5>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">দর (৳ প্রতি কেজি):</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={myBidPrice}
                  onChange={(e) => setMyBidPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold focus:ring-2 focus:ring-[#14532D] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">সরবরাহ পরিমাণ (কেজি):</label>
                <input
                  type="number"
                  required
                  value={myBidQty}
                  onChange={(e) => setMyBidQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold focus:ring-2 focus:ring-[#14532D] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">ক্রেতার উদ্দেশ্যে বার্তা:</label>
              <input
                type="text"
                value={myMessage}
                onChange={(e) => setMyMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#14532D] outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>নিলামে সরাসরি বিড সাবমিট করুন (Live Broadcast)</span>
            </button>

            {bidSubmitted && (
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold text-center animate-fadeIn">
                ✅ আপনার বিড সফলভাবে রিয়েল-টাইম লাইভ ফিডে শীর্ষ তালিকায় যুক্ত হয়েছে!
              </div>
            )}
          </form>

        </div>

      </div>
    </div>
  );
};
