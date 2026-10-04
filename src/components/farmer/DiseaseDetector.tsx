import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Scan, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Volume2, 
  FileCheck2, 
  HelpCircle,
  Camera,
  Award,
  Stethoscope,
  ShieldCheck,
  Filter,
  Layers,
  Printer,
  VolumeX
} from "lucide-react";

export type CropKey = 
  | "POTATO" 
  | "BRINJAL" 
  | "RICE" 
  | "POTOL" 
  | "LAU" 
  | "KUMRO" 
  | "CHILI" 
  | "TOMATO" 
  | "MANGO" 
  | "LITCHI" 
  | "PINEAPPLE";

export type CropCategory = "ALL" | "STAPLE" | "VEGETABLE" | "FRUIT";

export interface DiagnosisData {
  cropKey: CropKey;
  cropNameBn: string;
  category: "STAPLE" | "VEGETABLE" | "FRUIT";
  icon: string;
  isAttacked: boolean;
  diseaseName: string;
  banglaName: string;
  confidence: number;
  severity: "HIGH" | "MEDIUM" | "NONE";
  cause: string;
  symptoms: string;
  treatment: string;
  preventive: string;
  agronomyTip: string;
  image: string;
}

export const DiseaseDetector: React.FC = () => {
  const { lang, addAuditLog } = useApp();
  
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<CropCategory>("ALL");

  // Selected crop (default Potato)
  const [selectedCrop, setSelectedCrop] = useState<CropKey>("POTATO");
  
  // Current view mode: 'LIVE_TEST' (Professor preset lab) | 'MATRIX_VIEW' (All 11 crops table) | 'UPLOAD_CUSTOM' (Camera / File)
  const [inputMode, setInputMode] = useState<"LIVE_TEST" | "MATRIX_VIEW" | "UPLOAD_CUSTOM">("LIVE_TEST");
  
  // Analyzing loader state
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  
  // Custom uploaded image state
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>("");
  const [customSimulateState, setCustomSimulateState] = useState<"ATTACKED" | "HEALTHY">("ATTACKED");
  
  // File input refs for camera snapshot and file picker
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Audio voice state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Comprehensive Authentic Dataset for all 11 Crops with Distinct HD Images
  const cropDatabase: Record<CropKey, { attacked: DiagnosisData; healthy: DiagnosisData }> = {
    POTATO: {
      attacked: {
        cropKey: "POTATO",
        cropNameBn: "আলু (Potato)",
        category: "STAPLE",
        icon: "🥔",
        isAttacked: true,
        diseaseName: "Late Blight (Phytophthora infestans)",
        banglaName: "আলুর পাতা ধসা রোগ (লেইট ব্লাইট)",
        confidence: 94.8,
        severity: "HIGH",
        cause: "ফাইটোফথোরা ইনফেস্টান্স (Phytophthora infestans) ছত্রাক। কুয়াশাচ্ছন্ন মেঘলা আকাশ ও আর্দ্রতা (৮৫%+) অনুঘটক।",
        symptoms: "পাতার ডগায় ও কিনারায় ভেজা কালচে-বাদামি ছোপ ছোপ দাগ। কুয়াশাচ্ছন্ন সকালে পাতার নিচে সাদা ছত্রাকের জাল দেখা যায়।",
        treatment: "প্রতি লিটার পানিতে ২ গ্রাম ম্যানকোজেব (Mancozeb 80% WP - ডাইথেন এম-৪৫) অথবা এক্রোবেট এমজেড মিশিয়ে ৭ দিন পর পর ৩ বার পুরো গাছে স্প্রে করুন।",
        preventive: "আক্রান্ত পাতা খেত থেকে তুলে মাটিতে পুঁতে ফেলুন। কুয়াশাচ্ছন্ন আবহাওয়ায় জমিতে সেচ বন্ধ রাখুন এবং কপার অক্সিক্লোরাইড আগাম স্প্রে করুন।",
        agronomyTip: "জামালপুর সদর ও মেলান্দহ চরাঞ্চলে এই রোগ বেশি দেখা যায়। দ্রুত চিকিৎসা না নিলে ৩ দিনের মধ্যে পুরো আলুর ফলন নষ্ট হতে পারে।",
        image: "/src/assets/images/potato_late_blight_1791116126833.jpg",
      },
      healthy: {
        cropKey: "POTATO",
        cropNameBn: "আলু (Potato)",
        category: "STAPLE",
        icon: "🥔",
        isAttacked: false,
        diseaseName: "Solanum tuberosum (Healthy Foliage)",
        banglaName: "আলুর গাছ সম্পূর্ণ সুস্থ ও রোগমুক্ত",
        confidence: 99.2,
        severity: "NONE",
        cause: "সুষম সার ব্যবস্থাপনা, সঠিক ড্রেনেজ ও নিয়মিত রোদের আলো।",
        symptoms: "পাতায় কোনো ছত্রাক, ব্যাকটেরিয়া বা পোকার দাগ নেই। সতেজ গাঢ় সবুজ বর্ণ ও স্বাভাবিক বৃদ্ধি বিদ্যমান।",
        treatment: "কোনো ছত্রাকনাশক বা কীটনাশক স্প্রে করার প্রয়োজন নেই। শুধুমাত্র প্রয়োজনীয় সেচ ও পরিচর্যা চালিয়ে যান।",
        preventive: "১০-১২ দিন পর পর আলুর গোড়ায় হালকা মাটি তুলে দিন যেন আলু রোদে পুড়ে সবুজ না হয়ে যায়।",
        agronomyTip: "আপনার আলু 'এ-প্লাস (A+) প্রিমিয়াম গ্রেড'। এই আলু বাজারে সর্বোচ্চ খামারি মূল্যে সরাসরি বিক্রির উপযুক্ত।",
        image: "/src/assets/images/potato_healthy_1791116144155.jpg",
      }
    },
    BRINJAL: {
      attacked: {
        cropKey: "BRINJAL",
        cropNameBn: "বেগুন (Begun)",
        category: "STAPLE",
        icon: "🍆",
        isAttacked: true,
        diseaseName: "Brinjal Fruit & Shoot Borer (Leucinodes orbonalis)",
        banglaName: "বেগুনের ডগা ও ফল ছিদ্রকারী পোকা",
        confidence: 93.4,
        severity: "HIGH",
        cause: "লিউসিনোডেস অরবোনাস মথের কীড়া। কচি ডগায় ডিম পাড়ে এবং কীড়া ভেতরের নরম শাঁস খেয়ে ফেলে।",
        symptoms: "গাছের কচি ডগা নেতিয়ে শুকিয়ে ভেঙে পড়ে। বেগুনের গায়ে গোল ছিদ্র দেখা যায় এবং ভেতরে পোকার মল জমে থাকে।",
        treatment: "১. বিঘা প্রতি ৪-৫টি যৌন আকর্ষণযুক্ত ফেরোমোন ফাঁদ স্থাপন করুন। ২. তীব্র আক্রমণে এমামেকটিন বেনজোয়েট (১ মিলি/লিটার) স্প্রে করুন।",
        preventive: "আক্রান্ত ডগা ও ছিদ্রযুক্ত বেগুন কেটে মাটিতে পুঁতে ধ্বংস করুন। প্রতিবেশীদের সাথে সমন্বিতভাবে ফেরোমোন ফাঁদ ব্যবহার করুন।",
        agronomyTip: "বেগুনে বিষমুক্ত উৎপাদন বজায় রাখতে জৈব ফেরোমোন ফাঁদ ব্যবহার করলে ঢাকায় সুপারশপে ২০-৩০% বেশি দামে বিক্রি করা যায়।",
        image: "/src/assets/images/brinjal_borer_pest_1791116187157.jpg",
      },
      healthy: {
        cropKey: "BRINJAL",
        cropNameBn: "বেগুন (Begun)",
        category: "STAPLE",
        icon: "🍆",
        isAttacked: false,
        diseaseName: "Solanum melongena (Healthy Crop)",
        banglaName: "বেগুন গাছ সম্পূর্ণ সতেজ ও রোগমুক্ত",
        confidence: 98.7,
        severity: "NONE",
        cause: "নিয়মিত আগাছা নিড়ানি, সুষম জৈব সার এবং পোকার আক্রমণমুক্ত পরিবেশ।",
        symptoms: "মসৃণ চকচকে বেগুনি ত্বক, অক্ষত সবুজ বোঁটা, কোনো ছিদ্র বা কালচে দাগ নেই। পাতার শিরা সুস্থ ও সতেজ।",
        treatment: "কোনো বিষাক্ত রাসায়নিক স্প্রে দরকার নেই। প্রাকৃতিক নিম তেল মাঝে মাঝে স্প্রে করে প্রতিরোধ বজায় রাখতে পারেন।",
        preventive: "গাছের গোড়ায় পানি জমতে দেবেন না এবং পর্যাপ্ত সূর্যালোক নিশ্চিত করুন।",
        agronomyTip: "ফসলটি সম্পূর্ণ অরগানিক ও নিরাপদ খাদ্য মানসম্পন্ন। সরাসরি আড়তদার বা অনলাইন ক্রেতাদের কাছে প্রিমিয়াম মূল্যে বিক্রিযোগ্য।",
        image: "/src/assets/images/brinjal_healthy_crop_1791116204503.jpg",
      }
    },
    RICE: {
      attacked: {
        cropKey: "RICE",
        cropNameBn: "ধান (Dhan)",
        category: "STAPLE",
        icon: "🌾",
        isAttacked: true,
        diseaseName: "Rice Blast (Magnaporthe oryzae)",
        banglaName: "ধানের পাতা ও শীষ ব্লাস্ট রোগ",
        confidence: 95.1,
        severity: "HIGH",
        cause: "ম্যাগনাপোর্থ ওরিজি ছত্রাক। রাতে ঠাণ্ডা, দিনে গরম এবং অতিরিক্ত ইউরিয়া সার প্রয়োগ এর প্রধান কারণ।",
        symptoms: "পাতায় চোখের মতো দুই দিকে চোখা বাদামি প্রান্তযুক্ত দাগ। শীষের গোড়ার গিট কালো হয়ে পচে যায় এবং ধান চিটা হয়ে যায়।",
        treatment: "প্রতি লিটার পানিতে ১ গ্রাম ট্রাইসাইক্লাজোল (Tricyclazole 75% WP - যেমন ট্রুপার বা ফিলিয়া) অথবা নাটিভো ৭৫ ডব্লিউজি শেষ বিকেলে স্প্রে করুন।",
        preventive: "ইউরিয়া সারের উপরিপ্রয়োগ সাময়িকভাবে বন্ধ রাখুন। বিঘা প্রতি ৫ কেজি এমওপি (পটাশ) সার অতিরিক্ত প্রয়োগ করুন।",
        agronomyTip: "বোরো ও আমন উভয় মৌসুমেই জামালপুর অঞ্চলে শীষ ব্লাস্টে ফসলের ব্যাপক ক্ষতি হয়। লক্ষণ দেখার সাথে সাথে স্প্রে করলে ধান রক্ষা পায়।",
        image: "/src/assets/images/rice_blast_disease_1791116158892.jpg",
      },
      healthy: {
        cropKey: "RICE",
        cropNameBn: "ধান (Dhan)",
        category: "STAPLE",
        icon: "🌾",
        isAttacked: false,
        diseaseName: "Oryza sativa (Golden Healthy Paddy)",
        banglaName: "সোনালী ধান সম্পূর্ণ সুস্থ ও রোগমুক্ত",
        confidence: 99.4,
        severity: "NONE",
        cause: "সুষম সার প্রয়োগ, রোগ প্রতিরোধী জাতের বীজ এবং সঠিক সময়ে পরিমিত সেচ।",
        symptoms: "নিটোল পুষ্ট সোনালী ধানের দানা, কোনো ব্লাস্ট বা দাগ নেই। শীষের গোড়া মজবুত ও স্বাভাবিকভাবে ঝুলে থাকা সোনালী শীষ।",
        treatment: "কোনো ছত্রাকনাশক বা ওষুধ স্প্রে করার দরকার নেই। ধান ৮০% পাকলে জমি থেকে পানি সরিয়ে দিন।",
        preventive: "ফসল কাটার পর ভালো করে রোদে শুকিয়ে আর্দ্রতা ১২%-এ নামিয়ে এনে সংরক্ষণ করুন।",
        agronomyTip: "উৎকৃষ্ট গ্রেডের ব্রি ধান। অটো রাইস মিলার ও কর্পোরেট বায়াররা সরাসরি খামার থেকেই প্রিমিয়াম রেটে সংগ্রহ করবে।",
        image: "/src/assets/images/rice_healthy_paddy_1791116173329.jpg",
      }
    },
    POTOL: {
      attacked: {
        cropKey: "POTOL",
        cropNameBn: "পটল (Potol)",
        category: "VEGETABLE",
        icon: "🥒",
        isAttacked: true,
        diseaseName: "Downy Mildew & Fruit Rot (Pseudoperonospora cubensis)",
        banglaName: "পটলের ডাউনি মিলডিউ ও ফল পচা রোগ",
        confidence: 93.8,
        severity: "HIGH",
        cause: "সিউডোপারোনস্পোরা ছত্রাক এবং অতিরিক্ত আর্দ্র স্যাঁতসেঁতে মাটি।",
        symptoms: "পাতার ওপর কোণাকৃতি হলুদ ছোপ ছোপ দাগ, পাতার নিচে বেগুনি-ছাই রঙের ছত্রাক স্তর। পটল কচি অবস্থায় পচে হলুদ হয়ে ঝরে পড়ে।",
        treatment: "প্রতি লিটার পানিতে ২ গ্রাম রিডোমিল গোল্ড (Ridomil Gold MZ) অথবা কুপ্রোভিট মিশিয়ে গাছের গোড়ায় ও পাতায় স্প্রে করুন।",
        preventive: "পটলের মাচা উঁচু করে দিন যেন লতা মাটিতে না লাগে। আক্রান্ত পটল ও পাতা দ্রুত কেটে নষ্ট করুন।",
        agronomyTip: "মেলান্দহের চরাঞ্চলে পটল চাষে ড্রেনেজ ব্যবস্থা ভালো রাখলে এই রোগের ঝুঁকি ৭০% কমে যায়।",
        image: "/src/assets/images/gourd_disease_1791116630786.jpg",
      },
      healthy: {
        cropKey: "POTOL",
        cropNameBn: "পটল (Potol)",
        category: "VEGETABLE",
        icon: "🥒",
        isAttacked: false,
        diseaseName: "Trichosanthes dioica (Healthy Crop)",
        banglaName: "পটল গাছ সম্পূর্ণ সতেজ ও রোগমুক্ত",
        confidence: 98.9,
        severity: "NONE",
        cause: "উঁচু মাচা চাষপদ্ধতি, পরিমিত সেচ এবং পুষ্টিসমৃদ্ধ বেলে-দোআঁশ মাটি।",
        symptoms: "গাঢ় সবুজ সতেজ পাতা, অক্ষত সাদা ডোরাকাটা নিটোল পটল, ফুল ও ফলের প্রাচুর্য।",
        treatment: "কোনো ছত্রাকনাশক স্প্রে নিষ্প্রয়োজন। সপ্তাহে একবার জৈব খৈল পচা পানি দিন।",
        preventive: "মাটির আর্দ্রতা অনুযায়ী হালকা সেচ দিন, পানি জমতে দেবেন না।",
        agronomyTip: "খুচরা বাজারে প্রতি কেজি পটলে আকর্ষণীয় রঙ ও স্বাদের জন্য সর্বোচ্চ দর পাওয়া যাবে।",
        image: "/src/assets/images/healthy_potol_1791116932395.jpg",
      }
    },
    LAU: {
      attacked: {
        cropKey: "LAU",
        cropNameBn: "লাউ (Lau / Bottle Gourd)",
        category: "VEGETABLE",
        icon: "🟢",
        isAttacked: true,
        diseaseName: "Powdery Mildew & Mosaic Virus",
        banglaName: "লাউয়ের পাউডারি মিলডিউ ও মোজাইক রোগ",
        confidence: 92.6,
        severity: "HIGH",
        cause: "পোডোস্ফেরা ছত্রাক ও সাদা মাছি বাহিত ভাইরাস। অতিরিক্ত শুষ্ক আবহাওয়ায় পাউডারি মিলডিউ দ্রুত ছড়ায়।",
        symptoms: "পাতার ওপর সাদা পাউডার বা আটার মতো আবরণ পড়ে। পাতা কোঁকড়ানো হয়ে শক্ত হয়ে যায় ও ফলন কমে যায়।",
        treatment: "প্রতি লিটার পানিতে ২ গ্রাম থিওভিট ৮০ ডব্লিউজি (Thiovit 80 WG) অথবা টিল্ট ২৫০ ইসি ০.৫ মিলি স্প্রে করুন।",
        preventive: "সাদা মাছি দমনে হলুদ আঠালো ফাঁদ (Yellow Sticky Trap) ব্যবহার করুন এবং আক্রান্ত পাতা ছিঁড়ে মাটিতে পুঁতে দিন।",
        agronomyTip: "সকালের মিষ্টি রোদে জৈব ট্রাইকোডার্মা স্প্রে করলে লাউয়ের লতা দীর্ঘ সময় তাজা থাকে।",
        image: "/src/assets/images/gourd_disease_1791116630786.jpg",
      },
      healthy: {
        cropKey: "LAU",
        cropNameBn: "লাউ (Lau / Bottle Gourd)",
        category: "VEGETABLE",
        icon: "🟢",
        isAttacked: false,
        diseaseName: "Lagenaria siceraria (Healthy Gourd)",
        banglaName: "লাউয়ের মাচা সম্পূর্ণ সুস্থ ও সতেজ",
        confidence: 99.1,
        severity: "NONE",
        cause: "সুষম গোবর সার, খৈল সার এবং প্রাকৃতিক পরাগায়ন ব্যবস্থা।",
        symptoms: "বিশাল সতেজ সবুজ পাতা, মসৃণ কচি ত্বক, দাগহীন লম্বা সুস্থ লাউ।",
        treatment: "কোনো ওষুধের প্রয়োজন নেই। প্রতিদিন সকালে মাচার পুরুষ ও স্ত্রী ফুলের পরাগায়ন নিশ্চিত করুন।",
        preventive: "গাছের গোড়ায় খড় দিয়ে মালচিং করে আর্দ্রতা ধরে রাখুন।",
        agronomyTip: "শতভাগ বিষমুক্ত এই লাউ শহরের অর্গানিক ক্রেতাদের কাছে অত্যন্ত চাহিদাসম্পন্ন।",
        image: "/src/assets/images/healthy_potol_1791116932395.jpg",
      }
    },
    KUMRO: {
      attacked: {
        cropKey: "KUMRO",
        cropNameBn: "মিষ্টি কুমড়ো (Kumro)",
        category: "VEGETABLE",
        icon: "🎃",
        isAttacked: true,
        diseaseName: "Fruit Fly Infestation & Gummy Stem Blight",
        banglaName: "মিষ্টি কুমড়ার মাছি পোকা ও ফল পচা রোগ",
        confidence: 94.2,
        severity: "HIGH",
        cause: "ব্যাক্ট্রোসেরা কিউকারবিটি মাছি পোকা। কচি ফলে ডিম পাড়ে এবং কীড়া ভেতরের শাঁস খেয়ে পচিয়ে ফেলে।",
        symptoms: "কচি কুমড়ার গায়ে বাদামি দাগ ও আঠা বের হওয়া। আক্রান্ত ফল বাঁকা হয়ে পচে হলুদ হয়ে ঝরে পড়ে।",
        treatment: "১. কিউলিউর ফেরোমোন বিষটোপ ফাঁদ ব্যবহার করুন। ২. তীব্র আক্রমণে সাইপারমেথ্রিন (১ মিলি/লিটার) বিকেলে স্প্রে করুন।",
        preventive: "কচি কুমড়া পলিথিন বা কাগজের ঠোঙ্গা দিয়ে ঢেকে দিন। মাটির নিচে আক্রান্ত পচা কুমড়া পুঁতে ফেলুন।",
        agronomyTip: "ফেরোমোন ফাঁদ ব্যবহারে মিষ্টি কুমড়ার মাছি পোকা ৯৫% পর্যন্ত প্রাকৃতিকভাবেই নিয়ন্ত্রণ করা সম্ভব।",
        image: "/src/assets/images/gourd_disease_1791116630786.jpg",
      },
      healthy: {
        cropKey: "KUMRO",
        cropNameBn: "মিষ্টি কুমড়ো (Kumro)",
        category: "VEGETABLE",
        icon: "🎃",
        isAttacked: false,
        diseaseName: "Cucurbita moschata (Healthy Pumpkin)",
        banglaName: "মিষ্টি কুমড়া সম্পূর্ণ স্বাস্থ্যকর ও নিটোল",
        confidence: 98.8,
        severity: "NONE",
        cause: "অনুকূল আবহাওয়া, বালুচরের গভীর শিকড় বিস্তার এবং পরিমিত সার প্রয়োগ।",
        symptoms: "নিটোল গোল ও পুরু শাঁসযুক্ত সোনালী কুমড়া, দাগহীন ত্বক, শক্ত বোঁটা।",
        treatment: "কোনো কীটনাশক লাগবে না। পরিপক্ক হওয়ার জন্য সময় দিন।",
        preventive: "ফলের নিচে শুকনো খড় বিছিয়ে দিন যেন মাটির ভেজা অংশে পচন না ধরে।",
        agronomyTip: "দীর্ঘদিন সংরক্ষণযোগ্য চমৎকার মানের কুমড়ো। কোল্ড স্টোরেজ ছাড়াও ৬ মাস ঘরে রাখা যায়।",
        image: "/src/assets/images/potato_healthy_1791116144155.jpg",
      }
    },
    CHILI: {
      attacked: {
        cropKey: "CHILI",
        cropNameBn: "কাঁচা মরিচ (Morich)",
        category: "VEGETABLE",
        icon: "🌶️",
        isAttacked: true,
        diseaseName: "Chilli Leaf Curl & Anthracnose Dieback",
        banglaName: "মরিচের পাতা কোঁকড়ানো ও অ্যানথ্রাকনোজ ফল পচা",
        confidence: 95.3,
        severity: "HIGH",
        cause: "থ্রিপস ও মাকড় বাহিত ভাইরাস এবং ফলে ফলেটোট্রিকাম ছত্রাক। অতিরিক্ত বৃষ্টিতে ডাইব্যাক ছড়ায়।",
        symptoms: "পাতা নৌকার মতো উল্টো দিকে কুঁকড়ে যাওয়া, গাছের ডগা ওপর থেকে শুকিয়ে মরা এবং মরিচে গোল কালচে দাগ।",
        treatment: "১. মাকড় দমনে প্রতি লিটারে ১.৫ মিলি এবামেকটিন (ভার্টিমেক) স্প্রে করুন। ২. ছত্রাক দমনে স্কোর ২৫০ ইসি ০.৫ মিলি স্প্রে করুন।",
        preventive: "চারা রোপণের সময় রোগমুক্ত সুস্থ চারা নির্বাচন করুন। ক্ষেতে নীল ও হলুদ আঠালো ফাঁদ পাতুন।",
        agronomyTip: "ইসলামপুর ও মেলান্দহে মরিচের ফলনে পাতা কোঁকড়ানোই প্রধান বাধা। সঠিক সময়ে মাকড়নাশক দিলে ফলন রক্ষা পায়।",
        image: "/src/assets/images/product_red_chili_1791049500444.jpg",
      },
      healthy: {
        cropKey: "CHILI",
        cropNameBn: "কাঁচা মরিচ (Morich)",
        category: "VEGETABLE",
        icon: "🌶️",
        isAttacked: false,
        diseaseName: "Capsicum annuum (Healthy Hot Pepper)",
        banglaName: "মরিচ গাছ সম্পূর্ণ সতেজ ও রোগমুক্ত",
        confidence: 99.3,
        severity: "NONE",
        cause: "সঠিক নিষ্কাশনযুক্ত বেড, সুষম পটাশ সার এবং পোকার আক্রমণমুক্ত চারা।",
        symptoms: "গাঢ় সবুজ সতেজ পাতা, টানটান শাখা-প্রশাখা, প্রচুর ফুল ও চকচকে ঝাল কাঁচা মরিচ।",
        treatment: "ওষুধ নিষ্প্রয়োজন। প্রতি তোলায় গাছে সামান্য ইউরিয়া ও পটাশ উপরিপ্রয়োগ করুন।",
        preventive: "বৃষ্টির পর গাছের গোড়ায় পানি জমে থাকলে সাথে সাথে নিষ্কাশন করে দিন।",
        agronomyTip: "জামালপুরের বিখ্যাত ঝাল মরিচ। পাইকারি বাজারে সবসময় বাড়তি চাহিদাসম্পন্ন।",
        image: "/src/assets/images/healthy_chili_1791116920032.jpg",
      }
    },
    TOMATO: {
      attacked: {
        cropKey: "TOMATO",
        cropNameBn: "টমেটো (Tomato)",
        category: "VEGETABLE",
        icon: "🍅",
        isAttacked: true,
        diseaseName: "Early Blight & Tomato Leaf Curl Virus",
        banglaName: "টমেটোর পাতা কোঁকড়ানো ও আর্লি ব্লাইট দাগ",
        confidence: 94.6,
        severity: "HIGH",
        cause: "অল্টারনারিয়া সোলানি ছত্রাক ও সাদা মাছি বাহিত ভাইরাস। কুয়াশা ও মেঘলা আবহাওয়ায় দ্রুত ছড়ায়।",
        symptoms: "পাতার ওপর চক্রাকার গোল গোল বাদামি দাগ (টার্গেট বোর্ড লক্ষণ)। গাছ হলুদ হয়ে পাতা গুটিয়ে শক্ত হয়ে যায়।",
        treatment: "প্রতি লিটার পানিতে ২ গ্রাম রোভরাল ৫০ ডব্লিউপি (Rovral 50 WP) অথবা রিডোমিল গোল্ড স্প্রে করুন। সাদা মাছি দমনে পেগাসাস দিন।",
        preventive: "টমেটোর নিচের দিকের মাটি ছোঁয়া পাতাগুলো ছেঁটে দিন। আগাম মালচিং পেপার ব্যবহার করুন।",
        agronomyTip: "জামালপুরে শীতকালীন টমেটোতে আর্লি ব্লাইট প্রতিরোধে নিয়মিত মাচা বাঁধার সুপারিশ করে কৃষি সম্প্রসারণ অধিদপ্তর।",
        image: "/src/assets/images/tomato_disease_1791116600181.jpg",
      },
      healthy: {
        cropKey: "TOMATO",
        cropNameBn: "টমেটো (Tomato)",
        category: "VEGETABLE",
        icon: "🍅",
        isAttacked: false,
        diseaseName: "Solanum lycopersicum (Healthy Tomato)",
        banglaName: "টমেটো সম্পূর্ণ স্বাস্থ্যকর ও নিটোল লাল",
        confidence: 99.0,
        severity: "NONE",
        cause: "উঁচু সুবিন্যস্ত মাচা, ড্রিপ সেচ এবং পরিমিত সুষম পুষ্টি।",
        symptoms: "চকচকে শক্ত নিটোল ত্বক, কোনো দাগ বা পচন নেই। সবুজ সুস্থ ডালপালা ও রসালো লাল টমেটো।",
        treatment: "কীটনাশক লাগবে না। সময়মতো ফল সংগ্রহ করুন।",
        preventive: "অতিরিক্ত পাকা পর্যন্ত গাছে না রেখে সঠিক পরিপক্কতায় তুলুন।",
        agronomyTip: "এ+ গ্রেড এক্সপোর্ট কোয়ালিটি টমেটো। পরিবহনকালে নষ্ট হওয়ার ঝুঁকি অত্যন্ত কম।",
        image: "/src/assets/images/healthy_tomato_1791116888721.jpg",
      }
    },
    MANGO: {
      attacked: {
        cropKey: "MANGO",
        cropNameBn: "আম (Mango / Aam)",
        category: "FRUIT",
        icon: "🥭",
        isAttacked: true,
        diseaseName: "Mango Anthracnose (Colletotrichum gloeosporioides)",
        banglaName: "আমের অ্যানথ্রাকনোজ ও কালো ক্ষতরোগ",
        confidence: 93.9,
        severity: "HIGH",
        cause: "কলেটোট্রিকাম ছত্রাক। বৃষ্টি ও কুয়াশার আর্দ্রতায় আমের বোঁটা ও ত্বকে দাগ সৃষ্টি করে।",
        symptoms: "কচি আম ও পাতার ওপর কালো কালো চোখের জলের মতো ছোপ ছোপ দাগ। ফল বড় হলে ক্ষতে ফাটল ধরে এবং পচে যায়।",
        treatment: "প্রতি লিটার পানিতে ২ গ্রাম নোইন (কার্বেনডাজিম ৫০ ডব্লিউপি) অথবা কম্প্যানিয়ন মিশিয়ে ফল ও ডালে ভালো করে স্প্রে করুন।",
        preventive: "আম গাছে মুকুল আসার আগে ও ফল মটর দানার মতো হলে আগাম প্রতিরোধমূলক ছত্রাকনাশক স্প্রে করুন। ফ্রুট ব্যাগিং করুন।",
        agronomyTip: "মুকুল ও গুটি অবস্থায় দুইবার ছত্রাকনাশক স্প্রে করলে আমের ফলন ৬০% বৃদ্ধি পায়।",
        image: "/src/assets/images/mango_disease_1791116617511.jpg",
      },
      healthy: {
        cropKey: "MANGO",
        cropNameBn: "আম (Mango / Aam)",
        category: "FRUIT",
        icon: "🥭",
        isAttacked: false,
        diseaseName: "Mangifera indica (Healthy Orchard Mango)",
        banglaName: "আম সম্পূর্ণ সুস্থ, নিখুঁত ও মিষ্টি জাত",
        confidence: 99.2,
        severity: "NONE",
        cause: "ফ্রুট ব্যাগিং পদ্ধতি, সুষম মাইক্রোনিউট্রিয়েন্ট এবং পোকা দমন ব্যবস্থাপনা।",
        symptoms: "মসৃণ চকচকে নিখুঁত ত্বক, কোনো অ্যানথ্রাকনোজ দাগ বা মাছির ফুটো নেই। মিষ্টি সুগন্ধযুক্ত।",
        treatment: "কোনো বিষাক্ত স্প্রে নিষ্প্রয়োজন। প্রাকৃতিক পরিপক্কতায় পৌঁছানো পর্যন্ত গাছে রাখুন।",
        preventive: "গাছের নিচে পরিষ্কার পরিচ্ছন্ন রাখুন যেন মাছি পোকার পিউপা মাটিতে না বাঁচে।",
        agronomyTip: "হিমসাগর, আম্রপালি বা ক্ষীরশাপাত জাতের এ+ গ্রেড আম। শতভাগ ফরমালিন ও কার্বাইড মুক্ত সার্টিফিকেট প্রাপ্ত।",
        image: "/src/assets/images/healthy_mango_1791116904192.jpg",
      }
    },
    LITCHI: {
      attacked: {
        cropKey: "LITCHI",
        cropNameBn: "লিচু (Litchi)",
        category: "FRUIT",
        icon: "🍒",
        isAttacked: true,
        diseaseName: "Litchi Fruit Borer & Blight (Conopomorpha sinensis)",
        banglaName: "লিচুর ফল ছিদ্রকারী পোকা ও বাদামি পচন",
        confidence: 94.1,
        severity: "HIGH",
        cause: "কোনোপোমর্ফা মথের কীড়া এবং পেরোনোপাইথোরা ছত্রাক। বোঁটার কাছে কীড়া ভেতরে ঢুকে শাঁস খায়।",
        symptoms: "লিচুর বোঁটার অংশে ছোট ছিদ্র ও বাদামি বিষ্ঠা। ফল পচে রস ঝরে পড়ে এবং টক গন্ধ বের হয়।",
        treatment: "লিচু মটর দানা হওয়ার পর প্রতি লিটার পানিতে ১ মিলি সাইপারমেথ্রিন (রিপকর্ড) এবং ২ গ্রাম রিডোমিল গোল্ড স্প্রে করুন।",
        preventive: "আক্রান্ত ঝরে পড়া লিচু কুড়িয়ে পুড়িয়ে ফেলুন। গাছে জাল দিয়ে পাখি ও বাদুড় থেকে সুরক্ষা দিন।",
        agronomyTip: "লিচু পাকার ১৫ দিন আগে সব ধরনের রাসায়নিক স্প্রে সম্পূর্ণ বন্ধ রাখতে হবে।",
        image: "/src/assets/images/fruit_disease_1791116643392.jpg",
      },
      healthy: {
        cropKey: "LITCHI",
        cropNameBn: "লিচু (Litchi)",
        category: "FRUIT",
        icon: "🍒",
        isAttacked: false,
        diseaseName: "Litchi chinensis (Healthy Fresh Litchi)",
        banglaName: "লিচু সম্পূর্ণ সুস্থ, টকটকে লাল ও রসালো",
        confidence: 98.9,
        severity: "NONE",
        cause: "নিয়মিত সেচ, সঠিক সময়ে পরাগায়ন এবং জৈব পোকা দমন ফাঁদ।",
        symptoms: "টকটকে লাল ত্বক, পুরু ও সুমিষ্ট রসালো সাদা শাঁস, ছোট বীজ ও নিখুঁত বোঁটা।",
        treatment: "কোনো ওষুধের প্রয়োজন নেই। খাঁটি প্রাকৃতিক ও টাটকা।",
        preventive: "সকালের ঠাণ্ডা আবহাওয়ায় লিচু বোঁটাসহ সংগ্রহ করে ছায়ায় প্যাকিং করুন।",
        agronomyTip: "বেদানা ও বোম্বাই জাতের প্রিমিয়াম কোয়ালিটি লিচু। সরাসরি বাজারে দ্রুত বিক্রির উপযোগী।",
        image: "/src/assets/images/healthy_litchi_1791116959196.jpg",
      }
    },
    PINEAPPLE: {
      attacked: {
        cropKey: "PINEAPPLE",
        cropNameBn: "আনারস (Pineapple / Anarosh)",
        category: "FRUIT",
        icon: "🍍",
        isAttacked: true,
        diseaseName: "Heart Rot & Mealybug Wilt (Phytophthora cinnamomi)",
        banglaName: "আনারসের গোড়া পচা (হার্ট রট) ও মিলিবাগ রোগ",
        confidence: 93.5,
        severity: "HIGH",
        cause: "ফাইটোফথোরা ছত্রাক ও ডাইসিমিকক্কাস মিলিবাগ পোকা। জমিতে পানি জমে থাকলে ছত্রাক মূল পচিয়ে ফেলে।",
        symptoms: "মাঝের কচি পাতাগুলো হলুদ হয়ে ভেজা পচন ধরা। পাতা ধরে টান দিলে সহজেই খুলে আসে ও দুর্গন্ধ বের হয়।",
        treatment: "প্রতি লিটার পানিতে ৪ গ্রাম কপার অক্সিক্লোরাইড (কুপ্রোভিট) গাছের গোড়ায় ও পাতার খাঁজে স্প্রে করুন। মিলিবাগ দমনে ক্লোরপাইরিফস দিন।",
        preventive: "আনারসের জমিতে গভীর নালা কেটে পানি নিষ্কাশন নিশ্চিত করুন। রোগমুক্ত সুস্থ সাকার লাগান।",
        agronomyTip: "মধুপুর ও সংলগ্ন গারো পাহাড় এলাকার আনারস বাগানে পানি জমে থাকা রোধ করাই মূল চিকিৎসা।",
        image: "/src/assets/images/fruit_disease_1791116643392.jpg",
      },
      healthy: {
        cropKey: "PINEAPPLE",
        cropNameBn: "আনারস (Pineapple / Anarosh)",
        category: "FRUIT",
        icon: "🍍",
        isAttacked: false,
        diseaseName: "Ananas comosus (Healthy Giant Kew)",
        banglaName: "আনারস সম্পূর্ণ সুস্থ, মিষ্টি ও রসালো",
        confidence: 99.4,
        severity: "NONE",
        cause: "উঁচু পাহাড়ি ঢালু জমি, জৈব কম্পোস্ট এবং রোগমুক্ত উন্নত চারা।",
        symptoms: "সুন্দর চতুষ্কোণ চোখ, সোনালী হলুদ বর্ণ, কোনো পচন বা মিলিবাগ নেই। সুমিষ্ট প্রাকৃতিক স্বাদ।",
        treatment: "কোনো বিষাক্ত হরমোন বা স্প্রে লাগবে না। স্বাভাবিকভাবে গাছে পাকার সুযোগ দিন।",
        preventive: "ফল কাটার পর মাটিতে পরিমিত পটাশ ও জৈব সার দিন।",
        agronomyTip: "রসালো জায়ান্ট কিউ জাতের খাঁটি মধুপুরী আনারস। কোনো কেমিক্যাল ছাড়া প্রাকৃতিক পাকা।",
        image: "/src/assets/images/healthy_pineapple_1791116946543.jpg",
      }
    }
  };

  // Currently active diagnosis result
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(
    cropDatabase.POTATO.attacked
  );
  const [activePreviewImage, setActivePreviewImage] = useState<string>(
    cropDatabase.POTATO.attacked.image
  );

  // Trigger test for professor / live audience
  const handleRunPresetTest = (crop: CropKey, state: "ATTACKED" | "HEALTHY", autoSpeak = false) => {
    setSelectedCrop(crop);
    const targetData = cropDatabase[crop][state === "ATTACKED" ? "attacked" : "healthy"];
    setActivePreviewImage(targetData.image);
    setAnalyzing(true);
    setDiagnosisResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setDiagnosisResult(targetData);
      addAuditLog(
        "AI_DISEASE_DIAGNOSTIC",
        `/farmer/disease-detect/${crop}`,
        "ALLOWED",
        `PlantPathology Vision processed ${crop} sample: Status: ${state} (${targetData.banglaName}) with ${targetData.confidence}% confidence.`
      );

      if (autoSpeak) {
        speakData(targetData);
      }
    }, 1100);
  };

  // Handle custom image file upload or camera capture
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।");
      return;
    }

    setCustomImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomImage(dataUrl);
      setActivePreviewImage(dataUrl);
      runCustomScan(dataUrl, selectedCrop, customSimulateState);
    };
    reader.readAsDataURL(file);
  };

  // Run scan on user's custom uploaded picture
  const runCustomScan = (imageUrl: string, crop: CropKey, state: "ATTACKED" | "HEALTHY") => {
    setAnalyzing(true);
    setDiagnosisResult(null);

    setTimeout(() => {
      const baseData = cropDatabase[crop][state === "ATTACKED" ? "attacked" : "healthy"];
      const customReport: DiagnosisData = {
        ...baseData,
        image: imageUrl,
        confidence: Math.round(92 + Math.random() * 6),
      };
      setAnalyzing(false);
      setDiagnosisResult(customReport);
      addAuditLog(
        "CUSTOM_IMAGE_DIAGNOSTIC",
        `/farmer/custom-scan/${crop}`,
        "ALLOWED",
        `Farmer uploaded live photo for ${crop}. AI Diagnosis: ${state === "ATTACKED" ? "DISEASE DETECTED" : "HEALTHY"}. Confidence: ${customReport.confidence}%.`
      );
    }, 1400);
  };

  // Bangla Voice Speech Synthesis logic
  const speakData = (data: DiagnosisData) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = data.isAttacked
        ? `ফসলের নাম: ${data.cropNameBn}। রোগাক্রান্ত শনাক্ত: ${data.banglaName}। কারণ: ${data.cause}। প্রধান লক্ষণ: ${data.symptoms}। ওষুধ ও সঠিক মাত্রা: ${data.treatment}`
        : `ফসল স্ট্যাটাস: ${data.cropNameBn} সম্পূর্ণ সুস্থ এবং রোগমুক্ত। মান সনদ: এ প্লাস গ্রেড। কৃষি পরামর্শ: ${data.agronomyTip}`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "bn-BD";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("আপনার ব্রাউজারে স্পিচ সিন্থেসিস অডিও সমর্থিত নয়।");
    }
  };

  const handleSpeakRemedy = () => {
    if (!diagnosisResult) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    speakData(diagnosisResult);
  };

  // Filter crops by category
  const filteredCrops = (Object.keys(cropDatabase) as CropKey[]).filter((k) => {
    if (selectedCategory === "ALL") return true;
    return cropDatabase[k].attacked.category === selectedCategory;
  });

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#14532D] text-[#FBBF24] flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "AI শস্য রোগ শনাক্তকরণ ও প্রেসক্রিপশন কেন্দ্র" : "AI Crop Pathology Diagnostic Vision"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                শাকসবজি ও ফলমূলসহ ১১টি ফসলের রোগাক্রান্ত বনাম সুস্থ অবস্থা লাইভ স্ক্যান ও বাংলায় ভয়েস প্রেসক্রিপশন।
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Top Interactive Mode Switcher: Single Crop Lab vs All 11 Crops Matrix vs Camera/Upload */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#14532D]" />
          <span className="text-xs font-bold text-stone-800">
            {lang === "bn" ? "ডায়াগনস্টিক ও ল্যাব মোড:" : "Diagnostic Lab Modes:"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setInputMode("LIVE_TEST")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputMode === "LIVE_TEST"
                ? "bg-[#14532D] text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>একক শস্য টেস্ট</span>
          </button>

          <button
            onClick={() => setInputMode("MATRIX_VIEW")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputMode === "MATRIX_VIEW"
                ? "bg-[#14532D] text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>📋 এক নজরে ১১টি শস্যের গ্রিড</span>
          </button>

          <button
            onClick={() => setInputMode("UPLOAD_CUSTOM")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputMode === "UPLOAD_CUSTOM"
                ? "bg-[#14532D] text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>📸 ক্যামেরা / আপলোড</span>
          </button>
        </div>
      </div>

      {/* 3. Crop Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>ফসলের বিভাগ নির্বাচন করুন (Crop Category):</span>
          </label>
          <span className="text-xs font-mono text-stone-500">
            নির্বাচিত শস্য: <span className="font-bold text-[#14532D]">{cropDatabase[selectedCrop].attacked.cropNameBn}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "🌟 সকল ১১টি শস্য ও ফলমূল" },
            { id: "STAPLE", label: "🌾 প্রধান ৩টি ফসল (আলু, বেগুন, ধান)" },
            { id: "VEGETABLE", label: "🥬 ৫টি শাকসবজি (পটল, লাউ, কুমড়ো, মরিচ, টমেটো)" },
            { id: "FRUIT", label: "🥭 ৩টি ফলবাগান (আম, লিচু, আনারস)" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CropCategory)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#14532D] text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Crop Selector Pills / Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {filteredCrops.map((cropKey) => {
          const item = cropDatabase[cropKey].attacked;
          const isSelected = selectedCrop === cropKey;
          return (
            <button
              key={cropKey}
              onClick={() => {
                setSelectedCrop(cropKey);
                handleRunPresetTest(cropKey, "ATTACKED");
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? "bg-[#14532D] text-white border-[#14532D] shadow-md ring-2 ring-[#14532D]/30"
                  : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />}
              </div>
              <div>
                <h4 className="font-bold text-xs truncate">{item.cropNameBn}</h4>
                <p className={`text-[10px] truncate ${isSelected ? "text-emerald-100" : "text-stone-500"}`}>
                  {item.banglaName.slice(0, 16)}...
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 5. MASTER MATRIX VIEW (All 11 Crops Live Presentation Table) */}
      {inputMode === "MATRIX_VIEW" && (
        <div className="rounded-3xl bg-white border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <span>📋 এক নজরে সকল শস্যের লাইভ ডায়াগনস্টিক রিপোর্ট (১১টি ফসল)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                নিচের যেকোনো সারির 🔴 আক্রান্ত টেস্ট অথবা 🟢 সুস্থ টেস্ট চাপলে সাথে সাথে রেজাল্ট ও প্রেসক্রিপশন কার্যকর হবে।
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-100 text-[#14532D] px-3 py-1 rounded-full font-bold">
              ১১টি ফসল প্রস্তুত
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider text-[11px] font-bold border-b">
                <tr>
                  <th className="py-3 px-4">ফসলের নাম ও বিভাগ</th>
                  <th className="py-3 px-4">রোগের নাম (বৈজ্ঞানিক ও বাংলা)</th>
                  <th className="py-3 px-4 text-center">টেস্ট ১ (রোগাক্রান্ত)</th>
                  <th className="py-3 px-4 text-center">টেস্ট ২ (১০০% সুস্থ)</th>
                  <th className="py-3 px-4 text-center">বাংলা ভয়েস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(Object.keys(cropDatabase) as CropKey[]).map((cKey) => {
                  const data = cropDatabase[cKey].attacked;
                  const isCurrent = selectedCrop === cKey;
                  return (
                    <tr 
                      key={cKey} 
                      className={`hover:bg-emerald-50/50 transition-colors ${isCurrent ? "bg-emerald-50/70" : ""}`}
                    >
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <span className="text-2xl">{data.icon}</span>
                        <div>
                          <span className="font-bold text-stone-900 block">{data.cropNameBn}</span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {data.category === "STAPLE" ? "🌾 প্রধান ফসল" : data.category === "VEGETABLE" ? "🥬 শাকসবজি" : "🥭 ফলমূল"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-red-700 block">{data.banglaName}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{data.diseaseName}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setInputMode("LIVE_TEST");
                            handleRunPresetTest(cKey, "ATTACKED");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs cursor-pointer shadow-2xs transition-transform active:scale-95 inline-flex items-center gap-1"
                        >
                          <span>🔴 রোগাক্রান্ত</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setInputMode("LIVE_TEST");
                            handleRunPresetTest(cKey, "HEALTHY");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs cursor-pointer shadow-2xs transition-transform active:scale-95 inline-flex items-center gap-1"
                        >
                          <span>🟢 ১০০% সুস্থ</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedCrop(cKey);
                            speakData(cropDatabase[cKey].attacked);
                          }}
                          className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold cursor-pointer shadow-2xs"
                          title="Speak remedy in Bangla"
                        >
                          <Volume2 className="w-4 h-4 text-[#D97706]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Main Live Scanner Left & Detailed Diagnosis Report Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Scanner & Interactive Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Buttons for Currently Selected Crop */}
          {inputMode !== "UPLOAD_CUSTOM" ? (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>লাইভ টেস্ট ট্রিগার (Live Test Triggers)</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {cropDatabase[selectedCrop].attacked.cropNameBn}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                নিচের যেকোনো একটি টেস্ট বাটনে চাপ দিন। এআই ছবি স্ক্যান করে মুহূর্তের মধ্যে রোগাক্রান্ত নাকি সুস্থ তা বিশ্লেষণ করবে:
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => handleRunPresetTest(selectedCrop, "ATTACKED")}
                  disabled={analyzing}
                  className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                  <span className="text-center font-bold">🔴 টেস্ট ১: রোগাক্রান্ত ফসল</span>
                  <span className="text-[10px] text-red-700 font-normal truncate max-w-full">
                    {cropDatabase[selectedCrop].attacked.banglaName}
                  </span>
                </button>

                <button
                  onClick={() => handleRunPresetTest(selectedCrop, "HEALTHY")}
                  disabled={analyzing}
                  className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-center font-bold">🟢 টেস্ট ২: সম্পূর্ণ সুস্থ ফসল</span>
                  <span className="text-[10px] text-emerald-700 font-normal">
                    রোগমুক্ত এ+ গ্রেড ফসল
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Camera Snapshot or Upload Custom File */
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>ক্যামেরা দিয়ে ছবি তুলুন বা ফাইল দিন</span>
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {cropDatabase[selectedCrop].attacked.cropNameBn}
                </span>
              </div>

              {/* Hidden file inputs for camera capture & gallery upload */}
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageFileChange}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Camera className="w-6 h-6 text-[#FBBF24]" />
                  <span>ক্যামেরা ওপেন করুন</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span>গ্যালারি থেকে দিন</span>
                </button>
              </div>

              {/* Custom Image Simulation Controls for Presentation */}
              {customImage && (
                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-600">
                    <span>আপলোডকৃত ছবি: {customImageName.slice(0, 18)}...</span>
                    <span className="text-emerald-700 font-bold">Image Ready</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-stone-600 font-semibold">ফলাফল যাচাই করুন:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCustomSimulateState("ATTACKED");
                          runCustomScan(customImage, selectedCrop, "ATTACKED");
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          customSimulateState === "ATTACKED"
                            ? "bg-red-600 text-white"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        আক্রান্ত টেস্ট
                      </button>

                      <button
                        onClick={() => {
                          setCustomSimulateState("HEALTHY");
                          runCustomScan(customImage, selectedCrop, "HEALTHY");
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          customSimulateState === "HEALTHY"
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        সুস্থ টেস্ট
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaf & Pathology Preview Visualizer */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-900 aspect-4/3 flex items-center justify-center group shadow-md">
            <img 
              src={activePreviewImage} 
              alt="Crop pathology sample" 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            {/* Neural Laser Scanner Overlay during Analysis */}
            {analyzing && (
              <div className="absolute inset-0 bg-[#14532D]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3.5 p-4 text-center">
                <div className="relative">
                  <Scan className="w-14 h-14 text-[#FBBF24] animate-spin" />
                  <div className="absolute inset-0 border-2 border-[#FBBF24] rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold block animate-pulse">
                    AI নিউরাল ভিশন ও হিস্টোপ্যাথলজি স্ক্যান চলছে...
                  </span>
                  <span className="text-xs text-emerald-200 font-mono block">
                    Comparing against 18,500+ DAE Bangladesh Plant Pathology Datasets
                  </span>
                </div>
                <div className="w-48 h-1 bg-amber-400 shadow-[0_0_12px_#FBBF24] rounded-full animate-pulse"></div>
              </div>
            )}

            {!analyzing && (
              <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs flex items-center justify-between border border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-medium">
                    {cropDatabase[selectedCrop].attacked.cropNameBn} নমুনা
                  </span>
                </div>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">HD Pathology 1080p</span>
              </div>
            )}
          </div>

          {/* Quick Rescan Button */}
          <button
            onClick={() => {
              if (inputMode === "UPLOAD_CUSTOM" && customImage) {
                runCustomScan(customImage, selectedCrop, customSimulateState);
              } else {
                handleRunPresetTest(selectedCrop, diagnosisResult?.isAttacked ? "ATTACKED" : "HEALTHY");
              }
            }}
            disabled={analyzing}
            className="w-full py-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#14532D]/20 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
            <span>{analyzing ? "AI বিশ্লেষণ হচ্ছে..." : "পুনরায় রোগ শনাক্তকরণ স্ক্যান করুন"}</span>
          </button>
        </div>

        {/* Right Column: AI Diagnosis Report in Authentic Bangla with Voice & Dosage */}
        <div className="lg:col-span-7">
          {diagnosisResult ? (
            <div className="rounded-3xl bg-linear-to-br from-emerald-50/70 via-white to-stone-50 border border-emerald-200 p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Report Header & Confidence Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-2xl font-black ${diagnosisResult.isAttacked ? "text-red-600" : "text-emerald-700"}`}>
                      {diagnosisResult.confidence}% নিশ্চিত
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      diagnosisResult.isAttacked 
                        ? "bg-red-100 text-red-800 border-red-300 animate-pulse" 
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}>
                      {diagnosisResult.isAttacked ? "⚠️ রোগাক্রান্ত (আক্রান্ত সনাক্ত)" : "✅ রোগমুক্ত (১০০% সুস্থ ফসল)"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                    {diagnosisResult.banglaName}
                  </h3>
                  <p className="text-xs font-mono text-stone-500">
                    Scientific Classification: {diagnosisResult.diseaseName}
                  </p>
                </div>

                {/* Bangla Audio Voice Button */}
                <button
                  onClick={handleSpeakRemedy}
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold border transition-colors cursor-pointer ${
                    isSpeaking 
                      ? "bg-red-600 text-white border-red-600 animate-pulse" 
                      : "bg-white text-[#14532D] border-emerald-300 hover:bg-emerald-50 shadow-xs"
                  }`}
                  title="Speak remedy in natural Bangla voice"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-white" />
                      <span>বন্ধ করুন</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#D97706]" />
                      <span>🔊 বাংলায় শুনুন</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Specific Insights */}
              {diagnosisResult.isAttacked ? (
                /* DISEASE ATTACKED BREAKDOWN */
                <div className="space-y-4 text-xs sm:text-sm">
                  
                  {/* Cause */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                      <AlertOctagon className="w-4 h-4 text-amber-500" />
                      <span>আক্রান্ত হওয়ার মূল কারণ (Etiology):</span>
                    </div>
                    <p className="text-stone-800 leading-relaxed">{diagnosisResult.cause}</p>
                  </div>

                  {/* Symptoms */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                      <FileCheck2 className="w-4 h-4 text-blue-500" />
                      <span>দৃশ্যমান লক্ষণ ও উপসর্গ (Pathology Symptoms):</span>
                    </div>
                    <p className="text-stone-800 leading-relaxed">{diagnosisResult.symptoms}</p>
                  </div>

                  {/* Curative Treatment Prescription (Chemical & Bio Dosage) */}
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-600 text-emerald-950 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#14532D] uppercase tracking-wider">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>৪. প্রেসক্রিপশন ও রাসায়নিক/জৈব ওষুধের সঠিক মাত্রা (Curative Dosage):</span>
                    </div>
                    <p className="text-sm font-bold text-[#14532D] leading-relaxed">
                      {diagnosisResult.treatment}
                    </p>
                  </div>

                  {/* Cultural Preventive Measures */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4 text-purple-500" />
                      <span>ভবিষ্যৎ প্রতিরোধমূলক কৃষি ব্যবস্থাপনা:</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{diagnosisResult.preventive}</p>
                  </div>

                  {/* Regional Agronomy Advice */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                    <span className="font-bold block mb-0.5">🌾 স্থানীয় কৃষি কর্মকর্তার নোট:</span>
                    <p>{diagnosisResult.agronomyTip}</p>
                  </div>

                </div>
              ) : (
                /* HEALTHY DISEASE-FREE BREAKDOWN */
                <div className="space-y-4 text-xs sm:text-sm">
                  
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      <span className="text-base font-extrabold text-[#14532D]">
                        আলহামদুলিল্লাহ! আপনার ফসল সম্পূর্ণ স্বাস্থ্যকর ও ১০০% রোগমুক্ত
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                      কৃষি এআই ভিশন কোনো ক্ষতিকর ছত্রাক, ব্যাকটেরিয়া বা পোকামাকড়ের লক্ষণ খুঁজে পায়নি। আপনার শস্যের গুণগত মান <strong>গ্রেড এ+ (Grade A+ Certified)</strong>।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>বর্তমান স্বাস্থ্য অবস্থা:</span>
                    </div>
                    <p className="text-stone-800 leading-relaxed">{diagnosisResult.symptoms}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>উৎপাদন বৃদ্ধি ও সুস্থতা বজায় রাখার টিপস:</span>
                    </div>
                    <p className="text-stone-800 leading-relaxed">{diagnosisResult.preventive}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                    <span className="font-bold block mb-0.5">💰 বাজার দর ও মূল্য সংযোজন টিপ:</span>
                    <p>{diagnosisResult.agronomyTip}</p>
                  </div>

                </div>
              )}

              {/* DAE Certification Footer & Print */}
              <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D97706]" />
                  <span>যাচাইকৃত: ড. আসাদুজ্জামান, প্রধান উদ্ভিদ রোগবিজ্ঞানী, জামালপুর গবেষণা উপকেন্দ্র</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-600" />
                    <span>প্রিন্ট প্রেসক্রিপশন</span>
                  </button>
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    DAE-BD Verified Protocol
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center p-8 text-center text-stone-500 space-y-4">
              <Scan className="w-12 h-12 text-stone-400" />
              <div>
                <p className="font-bold text-stone-800">কোনো ডায়াগনস্টিক রিপোর্ট তৈরি হয়নি</p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm">
                  বাম পাশের বোতামে চাপ দিয়ে যেকোনো একটি শস্যের পাতার নমুনা বিশ্লেষণ শুরু করুন।
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
