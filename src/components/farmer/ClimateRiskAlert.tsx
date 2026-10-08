import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { 
  CloudRain, 
  Sun, 
  Waves, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Smartphone, 
  Droplets, 
  ChevronDown, 
  Info, 
  Radio, 
  Send, 
  Zap, 
  Sparkles, 
  PhoneCall, 
  BellRing, 
  Activity, 
  Layers, 
  Check, 
  X,
  Share2,
  CheckCheck
} from "lucide-react";
import confetti from "canvas-confetti";

export type ClimateRiskType = "HEAVY_RAINFALL" | "HEATWAVE" | "FLASH_FLOOD" | "COLD_FOG";

export interface ClimateRiskProfile {
  riskType: ClimateRiskType;
  titleBn: string;
  badgeBn: string;
  severity: "CRITICAL" | "MODERATE" | "LOW";
  severityColor: string;
  expectedRainfallMm: number;
  temperatureC: number;
  heatIndexC: number;
  riverSurgeMetersAboveDanger: number;
  windGustKmH: number;
  leadTimeHours: number;
  affectedCropsBn: string[];
  descriptionBn: string;
  emergencyActionPlaybook: string[];
  audioScriptBn: string;
  openWeatherApiTelemetry: {
    lat: number;
    lng: number;
    conditionCode: string;
    conditionTextEn: string;
    humidityPct: number;
    uvIndex: number;
    pressureHpa: number;
  };
}

export interface UpazilaMeta {
  key: string;
  nameBn: string;
  labelBn: string;
  riverBasinBn: string;
  notableAreasBn: string;
  leadFarmerPhone: string;
}

export const UPAZILAS: UpazilaMeta[] = [
  {
    key: "JAMALPUR_SADAR",
    nameBn: "জামালপুর সদর",
    labelBn: "জামালপুর সদর ও কেন্দুয়া",
    riverBasinBn: "ব্রহ্মপুত্র নদ (সদর পয়েন্ট)",
    notableAreasBn: "কেন্দুয়া, শাহবাজপুর, শরিফপুর, নরুন্দি",
    leadFarmerPhone: "01907251440"
  },
  {
    key: "MELANDAHA",
    nameBn: "মেলান্দহ",
    labelBn: "মেলান্দহ ও উমিরপুর বিল",
    riverBasinBn: "ঝিনাই নদী ও মালঞ্চ বিল",
    notableAreasBn: "মাহমুদপুর, উমিরপুর, নাংলা, কুলিয়া",
    leadFarmerPhone: "018383251443"
  },
  {
    key: "ISLAMPUR",
    nameBn: "ইসলামপুর",
    labelBn: "ইসলামপুর ও যমুনা চর",
    riverBasinBn: "যমুনা নদী (বাহাদুরাবাদ-কুলকান্দি পয়েন্ট)",
    notableAreasBn: "কুলকান্দি, বেলগাছা, চিনাডুলী, গুঠাইল ঘাট",
    leadFarmerPhone: "01907251440"
  },
  {
    key: "SARISHABARI",
    nameBn: "সরিষাবাড়ী",
    labelBn: "সরিষাবাড়ী ও ঝিনাই অববাহিকা",
    riverBasinBn: "ঝিনai নদী (তারাকান্দি পয়েন্ট)",
    notableAreasBn: "তারাকান্দি, পিংনা, ডোয়াইল, ভাটারা",
    leadFarmerPhone: "018383251443"
  },
  {
    key: "DEWANGANJ_BAZAR",
    nameBn: "দেওয়ানগঞ্জ বাজার",
    labelBn: "দেওয়ানগঞ্জ বাজার ও বাহাদুরাবাদ ঘাট",
    riverBasinBn: "ব্রহ্মপুত্র ও যমুনা মোহনা (বাহাদুরাবাদ ঘাট)",
    notableAreasBn: "বাহাদুরাবাদ ঘাট, চুকাইবাড়ী, সানন্দবাড়ী চর",
    leadFarmerPhone: "01907251440"
  }
];

const REGIONAL_CLIMATE_RISKS: Record<string, Record<ClimateRiskType, ClimateRiskProfile>> = {
  // 1. JAMALPUR SADAR
  JAMALPUR_SADAR: {
    HEAVY_RAINFALL: {
      riskType: "HEAVY_RAINFALL",
      titleBn: "🚨 অতিভারী বৃষ্টিপাত ও আকস্মিক জলাবদ্ধতা সতর্কতা",
      badgeBn: "চরম লাল সতর্কতা (Emergency Red)",
      severity: "CRITICAL",
      severityColor: "from-red-600 to-rose-700",
      expectedRainfallMm: 110,
      temperatureC: 28,
      heatIndexC: 32,
      riverSurgeMetersAboveDanger: 0.35,
      windGustKmH: 42,
      leadTimeHours: 8,
      affectedCropsBn: ["বোরো ধান", "ডায়মন্ড আলু", "গোল বেগুন", "টমেটো"],
      descriptionBn: "বঙ্গোপসাগরে গভীর নিম্নচাপের প্রভাবে জামালপুর সদর ও কেন্দুয়া অববাহিকায় আগামী ৮-১২ ঘণ্টার মধ্যে ৮০ থেকে ১১০ মিলিমিটার অতিভারী বৃষ্টিপাতের উচ্চ সম্ভাবনা রয়েছে। নিচু জমির ফসল নিমজ্জিত হতে পারে।",
      audioScriptBn: "জরুরি কৃষি আবহাওয়া সতর্কতা: অতিভারী বৃষ্টিপাত ও আকস্মিক জলাবদ্ধতা। জামালপুর সদর, কেন্দুয়া ও আশপাশের এলাকায় আগামী আট থেকে বারো ঘণ্টায় আশি থেকে একশত দশ মিলিমিটার অতিভারী বৃষ্টি হতে পারে। নিচু জমির বোরো ধান এবং ডায়মন্ড আলু ক্ষতিগ্রস্ত হওয়ার আশঙ্কা রয়েছে। দ্রুত নিষ্কাশন নালা পরিষ্কার করুন এবং আশি শতাংশ পাকা ধান থাকলে আজই কেটে ফেলুন। জরুরি প্রয়োজনে কল করুন ১৬১২৩ নম্বরে।",
      emergencyActionPlaybook: [
        "জমিতে ৮০% বা তার বেশি পাকা ধান থাকলে দেরি না করে আজকেই দ্রুত কেটে উঁচু ভিটায় তুলুন।",
        "আলু ও সবজি ক্ষেতের চারপাশের নিষ্কাশন নালাগুলো এখনই কোদাল দিয়ে কেটে পরিষ্কার করে দিন যাতে পানি জমতে না পারে।",
        "মাঠ থেকে তোলা ফসল পলিথিন শিট দিয়ে ভালোভাবে ঢেকে শুকনো মাচায় সংরক্ষণ করুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9200, lng: 89.9400, conditionCode: "502", conditionTextEn: "Heavy Intensity Rain", humidityPct: 94, uvIndex: 2.1, pressureHpa: 998 }
    },
    HEATWAVE: {
      riskType: "HEATWAVE",
      titleBn: "☀️ তীব্র দাবদাহ ও খরা স্ট্রেস সতর্কতা",
      badgeBn: "উচ্চ তাপমাত্রা সতর্কতা (Orange Alert)",
      severity: "MODERATE",
      severityColor: "from-amber-600 to-orange-700",
      expectedRainfallMm: 0,
      temperatureC: 40.5,
      heatIndexC: 46.2,
      riverSurgeMetersAboveDanger: -1.2,
      windGustKmH: 18,
      leadTimeHours: 14,
      affectedCropsBn: ["ধানের থোর অবস্থা", "কাঁচা মরিচ", "পটল", "সবজি চারা"],
      descriptionBn: "টানা শুষ্ক আবহাওয়ায় জামালপুর সদরে সর্বোচ্চ তাপমাত্রা ৪০.৫° সেন্টিগ্রেড ছাড়িয়ে যেতে পারে। অতিরিক্ত বাষ্পীভবনে ধানের শীষ বন্ধ্যত্ব (চিটা হওয়া) এবং কচি সবজির ফুল ঝরে যাওয়ার ঝুঁকি রয়েছে।",
      audioScriptBn: "জরুরি কৃষি আবহাওয়া সতর্কতা: তীব্র দাবদাহ ও খরা স্ট্রেস। জামালপুর সদর উপজেলায় তাপমাত্রা চল্লিশ ডিগ্রি ছাড়িয়ে যেতে পারে। ধানের পরাগায়নের সময় চিটা হওয়া রোধে জমিতে দুই থেকে তিন ইঞ্চি পানি ধরে রাখুন। সকাল দশটার আগে বা বিকালে সেচ দিন এবং সবজির গোড়ায় খড় দিয়ে মালচিং করুন।",
      emergencyActionPlaybook: [
        "ধানের পরাগায়ন ও ফুল ফোটার সময় জমিতে অবশ্যই ২-৩ ইঞ্চি পানি ধরে রাখুন।",
        "প্রখর রোদের সময় সেচ দেওয়া পরিহার করুন; সকাল ১০টার আগে অথবা বিকাল ৫টার পর সেচ দিন।",
        "সবজি মাচায় খড় বা শুকনো ঘাস দিয়ে গোড়ায় মালচিং করুন যাতে মাটির আর্দ্রতা সংরক্ষিত থাকে।"
      ],
      openWeatherApiTelemetry: { lat: 24.9200, lng: 89.9400, conditionCode: "800", conditionTextEn: "Extreme Heat", humidityPct: 38, uvIndex: 11.4, pressureHpa: 1008 }
    },
    FLASH_FLOOD: {
      riskType: "FLASH_FLOOD",
      titleBn: "🌊 ব্রহ্মপুত্র অববাহিকায় আকস্মিক ঢল ও বন্যা সতর্কতা",
      badgeBn: "জরুরি বন্যা সতর্কতা (Flood Warning)",
      severity: "CRITICAL",
      severityColor: "from-blue-700 to-indigo-900",
      expectedRainfallMm: 95,
      temperatureC: 27,
      heatIndexC: 30,
      riverSurgeMetersAboveDanger: 0.65,
      windGustKmH: 35,
      leadTimeHours: 6,
      affectedCropsBn: ["চরাঞ্চলের বোরো ধান", "মিষ্টি কুমড়ো", "পাট", "শাকসবজি"],
      descriptionBn: "উজান থেকে নেমে আসা পাহাড়ি ঢলে ব্রহ্মপুত্র নদের পানি সদর পয়েন্টে বিপদসীমার ৬৫ সেন্টিমিটার ওপর দিয়ে প্রবাহিত হচ্ছে। নিচু এলাকার ফসল নিমজ্জিত হতে পারে।",
      audioScriptBn: "জরুরি বন্যা সতর্কতা: ব্রহ্মপুত্র নদের পানি বিপদসীমার পঁয়ষট্টি সেন্টিমিটার ওপরে বইছে। জামালপুর সদরের নিচু জমির পাকা ধান ও ফসল দ্রুত কেটে নিরাপদ বাঁধে সরিয়ে নিন। কৃষিলিঙ্ক হটলাইনে ফ্রি কোল্ড চেইন ফ্রেইটের সহায়তা নিন।",
      emergencyActionPlaybook: [
        "নিচু জমিতে থাকা ফসল অবিলম্বে কেটে নিকটস্থ উঁচু বাঁধে বা ইউনিয়ন পরিষদে সরিয়ে নিন।",
        "মাঠের ফসল দ্রুত বিক্রির জন্য কৃষিলিঙ্ক হটলাইনে কোল্ড চেইন পরিবহন রিকুয়েস্ট পাঠান।",
        "গবাদিপশু ও খড় বাঁধে উঁচু স্থানে সরিয়ে নিন এবং শুকনো মাচায় ফসল মজুত রাখুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9200, lng: 89.9400, conditionCode: "504", conditionTextEn: "Riverine Inundation", humidityPct: 96, uvIndex: 1.8, pressureHpa: 994 }
    },
    COLD_FOG: {
      riskType: "COLD_FOG",
      titleBn: "❄️ ঘন কুয়াশা ও শৈত্যপ্রবাহ (আলুর ব্লাইট স্পোর ঝুঁকি)",
      badgeBn: "শৈত্যপ্রবাহ সতর্কতা (Cold Alert)",
      severity: "MODERATE",
      severityColor: "from-cyan-700 to-slate-800",
      expectedRainfallMm: 5,
      temperatureC: 11.2,
      heatIndexC: 10.5,
      riverSurgeMetersAboveDanger: -1.8,
      windGustKmH: 12,
      leadTimeHours: 18,
      affectedCropsBn: ["ডায়মন্ড আলু", "টমেটো", "সরিষা"],
      descriptionBn: "রাতে ও সকালে দীর্ঘস্থায়ী ঘন কুয়াশা এবং তাপমাত্রা ১০-১২° সে. এ নেমে আসার পূর্বাভাস। কুয়াশার আর্দ্রতায় আলুর লেইট ব্লাইট ছত্রাক দ্রুত ছড়ায়।",
      audioScriptBn: "জরুরি শৈত্যপ্রবাহ সতর্কতা: ঘন কুয়াশা ও শৈত্যপ্রবাহ। জামালপুর সদরের আলু ক্ষেতে লেইট ব্লাইট রোগের উচ্চ ঝুঁকি দেখা দিয়েছে। অবিলম্বে ম্যানকোজেব প্রতি লিটার পানিতে দুই গ্রাম মিশিয়ে স্প্রে করুন। রাতে সেচ দেওয়া বন্ধ রাখুন।",
      emergencyActionPlaybook: [
        "আগাম প্রতিরোধ হিসেবে কুয়াশা শুরু হওয়ার সাথে সাথে ম্যানকোজেব (২ গ্রাম/লিটার) স্প্রে করুন।",
        "জমিতে রাতের বেলা সেচ দেওয়া থেকে বিরত থাকুন।",
        "গাছের গোড়ায় মাটি তুলে দিয়ে শিকড়কে অতিরিক্ত ঠাণ্ডা থেকে রক্ষা করুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9200, lng: 89.9400, conditionCode: "741", conditionTextEn: "Dense Fog & Cold Wave", humidityPct: 92, uvIndex: 3.0, pressureHpa: 1018 }
    }
  },

  // 2. MELANDAHA
  MELANDAHA: {
    HEAVY_RAINFALL: {
      riskType: "HEAVY_RAINFALL",
      titleBn: "🚨 মেলান্দহ ও উমিরপুর বিলে অতিবৃষ্টি ও আকস্মিক জলাবদ্ধতা",
      badgeBn: "চরম লাল সতর্কতা (Bheel Inundation)",
      severity: "CRITICAL",
      severityColor: "from-red-600 to-rose-700",
      expectedRainfallMm: 118,
      temperatureC: 27.8,
      heatIndexC: 31.5,
      riverSurgeMetersAboveDanger: 0.45,
      windGustKmH: 40,
      leadTimeHours: 7,
      affectedCropsBn: ["বোরো ধান", "উমিরপুরের পাট", "মিষ্টি আলু", "বেগুন"],
      descriptionBn: "মেলান্দহ উপজেলার উমিরপুর বিল ও ঝিনাই নদী সংলগ্ন নিচু জমিতে ১১৮ মিমি অতিবৃষ্টির পূর্বাভাস। পানি নিষ্কাশনের ড্রেনেজ বন্ধ থাকায় বিলে পানি আটকে ফসল পচে যাওয়ার আশঙ্কা।",
      audioScriptBn: "মেলান্দহ উপজেলার জরুরি সতর্কতা: উমিরপুর বিল ও ঝিনাই নদী সংলগ্ন এলাকায় একশত আঠারো মিলিমিটার অতিভারী বৃষ্টি হতে পারে। বোরো ধান ও সবজি বাঁচাতে বিলের নিষ্কাশন নালা কেটে দিন এবং আশি শতাংশ পাকা ধান অবিলম্বে কেটে ফেলুন।",
      emergencyActionPlaybook: [
        "উমিরপুর বিলের নিচু জমির পাকা ধান দ্রুত কেটে উঁচু রাস্তায় মাচায় তুলুন।",
        "বিলের সংযোগ খালের আগাছা কেটে পানির প্রবাহ স্বাভাবিক রাখুন।",
        "তোলা সবজি ও পাট শুকনো গোডাউনে স্থানান্তর করুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9700, lng: 89.8300, conditionCode: "502", conditionTextEn: "Heavy Downpour", humidityPct: 95, uvIndex: 2.0, pressureHpa: 996 }
    },
    HEATWAVE: {
      riskType: "HEATWAVE",
      titleBn: "☀️ মেলান্দহে তীব্র দাবদাহ ও পানির স্তর হ্রাস সতর্কতা",
      badgeBn: "উচ্চ খরা সতর্কতা (Orange Alert)",
      severity: "MODERATE",
      severityColor: "from-amber-600 to-orange-700",
      expectedRainfallMm: 0,
      temperatureC: 41.2,
      heatIndexC: 47.0,
      riverSurgeMetersAboveDanger: -1.3,
      windGustKmH: 20,
      leadTimeHours: 13,
      affectedCropsBn: ["থোর ধান", "কাঁচা মরিচ", "পাট চারা"],
      descriptionBn: "টানা খরায় মেলান্দহের বেলে-দোআঁশ মাটিতে পানির তীব্র সংকট। দুপুরের প্রখর রোদে সবজির পাতা ঝলসে যাওয়া এবং ধানের থোর শুকিয়ে চিটা হওয়ার আশঙ্কা।",
      audioScriptBn: "মেলান্দহের খরা সতর্কতা: তাপমাত্রা একচল্লিশ ডিগ্রি ছাড়িয়ে যেতে পারে। ধানের জমিতে দুই থেকে তিন ইঞ্চি পানি জমিয়ে রাখুন। সকালে বা বিকালে সেচ দিন এবং প্রখর রোদে সেচ দেওয়া পরিহার করুন।",
      emergencyActionPlaybook: [
        "ধানের শীষ বের হওয়ার মুহূর্তে জমিতে অবশ্যই পর্যাপ্ত পানি ধরে রাখুন।",
        "মাটির বাষ্পীভবন কমাতে সবজির গোড়ায় খড়কুটো দিয়ে মালচিং করুন।",
        "সৌর বা ডিজেল পাম্প দিয়ে সকালের দিকে হালকা সেচ দিন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9700, lng: 89.8300, conditionCode: "800", conditionTextEn: "Scorching Sun", humidityPct: 35, uvIndex: 11.8, pressureHpa: 1007 }
    },
    FLASH_FLOOD: {
      riskType: "FLASH_FLOOD",
      titleBn: "🌊 ঝিনাই নদী উপচে মেলান্দহ নিম্নাঞ্চলে প্লাবন সতর্কতা",
      badgeBn: "বন্যা লাল সতর্কতা (River Overflow)",
      severity: "CRITICAL",
      severityColor: "from-blue-700 to-indigo-900",
      expectedRainfallMm: 102,
      temperatureC: 26.8,
      heatIndexC: 29.5,
      riverSurgeMetersAboveDanger: 0.72,
      windGustKmH: 38,
      leadTimeHours: 5,
      affectedCropsBn: ["ঝিনাই পাড়ের ধান", "শাকসবজি", "পাট"],
      descriptionBn: "উজানের ঢলে ঝিনাই নদীর পানি মেলান্দহ পয়েন্টে বিপদসীমার ৭২ সেমি ওপর দিয়ে বইছে। মাহমুদপুর ও কুলিয়া ইউনিয়নের নিচু চর দ্রুত প্লাবিত হতে পারে।",
      audioScriptBn: "মেলান্দহের জরুরি বন্যা সতর্কতা: ঝিনাই নদীর পানি বিপদসীমার বাহাত্তর সেন্টিমিটার ওপর দিয়ে বইছে। নদীপাড়ের ধান ও গবাদিপশু অনতিবিলম্বে উঁচু বাঁধে সরিয়ে নিন। জরুরি সহায়তায় কল করুন ১৬১২৩ নম্বরে।",
      emergencyActionPlaybook: [
        "নদীর তীরবর্তী সমস্ত ধান ও সবজি দ্রুত কেটে নিরাপদ স্থানে নিন।",
        "গবাদিপশু ও খাদ্য শুকনো উঁচু বাঁধে সরিয়ে রাখুন।",
        "কৃষিলিঙ্ক জরুরি হটলাইনে কল করে কোল্ড স্টোরেজ সহায়তার আবেদন করুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9700, lng: 89.8300, conditionCode: "504", conditionTextEn: "Rising Jhinai Basin", humidityPct: 97, uvIndex: 1.6, pressureHpa: 993 }
    },
    COLD_FOG: {
      riskType: "COLD_FOG",
      titleBn: "❄️ মেলান্দহের রবি ফসলে দীর্ঘস্থায়ী শৈত্যপ্রবাহ ও কুয়াশা",
      badgeBn: "শৈত্য সতর্কতা (Cold Advisory)",
      severity: "MODERATE",
      severityColor: "from-cyan-700 to-slate-800",
      expectedRainfallMm: 3,
      temperatureC: 10.8,
      heatIndexC: 10.0,
      riverSurgeMetersAboveDanger: -1.7,
      windGustKmH: 14,
      leadTimeHours: 16,
      affectedCropsBn: ["আলু", "সরিষা", "টমেটো"],
      descriptionBn: "রাতে তাপমাত্রা ১০ ডিগ্রিতে নামবে। সকাল ১০টা পর্যন্ত সূর্য দেখা না যাওয়ায় সরিষার পরাগায়ন বাধাগ্রস্ত হতে পারে এবং আলুর ব্লাইট স্পোর ছড়াতে পারে।",
      audioScriptBn: "মেলান্দহের শৈত্যপ্রবাহ সতর্কতা: রাতের তাপমাত্রা দশ ডিগ্রিতে নামতে পারে। সরিষা ও আলু ক্ষেত রক্ষায় কুয়াশা থাকা অবস্থায় ম্যানকোজেব স্প্রে করুন এবং রাতে সেচ দেওয়া বন্ধ রাখুন।",
      emergencyActionPlaybook: [
        "কুয়াশাচ্ছন্ন সকালে আলুর জমিতে প্রতিরক্ষামূলক ছত্রাকনাশক স্প্রে করুন।",
        "সন্ধ্যায় ক্ষেতের আইলে ভেজা খড় দিয়ে ধোঁয়া তৈরি করে তাপমাত্রা রক্ষা করুন।",
        "গাছের গোড়ায় মাটি তুলে দিন।"
      ],
      openWeatherApiTelemetry: { lat: 24.9700, lng: 89.8300, conditionCode: "741", conditionTextEn: "Radiation Fog", humidityPct: 93, uvIndex: 2.9, pressureHpa: 1019 }
    }
  },

  // 3. ISLAMPUR
  ISLAMPUR: {
    HEAVY_RAINFALL: {
      riskType: "HEAVY_RAINFALL",
      titleBn: "🚨 ইসলামপুর চরাঞ্চলে চরম অতিবৃষ্টি ও নদীভাঙন সতর্কতা",
      badgeBn: "চরম লাল সতর্কতা (Char Zone Alert)",
      severity: "CRITICAL",
      severityColor: "from-red-600 to-rose-700",
      expectedRainfallMm: 125,
      temperatureC: 27.5,
      heatIndexC: 31,
      riverSurgeMetersAboveDanger: 0.85,
      windGustKmH: 48,
      leadTimeHours: 5,
      affectedCropsBn: ["চরের আলু", "কাঁচা মরিচ", "বোরো ধান", "চিনা বাদাম"],
      descriptionBn: "যমুনা নদীর কুলকান্দি ও বেলগাছা চরে অবিরাম ভারী বর্ষণে নিচু জমি দ্রুত পানির নিচে তলিয়ে যাওয়ার আশঙ্কা। একই সাথে তীব্র নদীভাঙনের সতর্কতা।",
      audioScriptBn: "ইসলামপুর চরাঞ্চলের জরুরি সতর্কতা: যমুনার কুলকান্দি ও বেলগাছা চরে একশত পঁচিশ মিলিমিটার অতিভারী বৃষ্টি হতে পারে। চরের মরিচ, আলু ও সবজি অবিলম্বে নৌকায় করে গুঠাইল ঘাটে নিরাপদ বাঁধে নিয়ে যান।",
      emergencyActionPlaybook: [
        "চরের সমস্ত কাঁচা মরিচ ও শাকসবজি দ্রুত উত্তোলন করুন।",
        "নৌকা বা ট্রলারের মাধ্যমে তোলা ফসল নিরাপদ বাঁধে স্থানান্তর করুন।",
        "ভাঙনপ্রবণ পাড় থেকে গবাদিপশু দ্রুত সরিয়ে নিন।"
      ],
      openWeatherApiTelemetry: { lat: 25.0800, lng: 89.7800, conditionCode: "503", conditionTextEn: "Very Heavy Rain", humidityPct: 98, uvIndex: 1.5, pressureHpa: 992 }
    },
    HEATWAVE: {
      riskType: "HEATWAVE",
      titleBn: "☀️ যমুনার বালুময় চরে তীব্র খরা ও চিনা বাদাম ঝলসানো ঝুঁকি",
      badgeBn: "খরা লাল সতর্কতা (Char Drought)",
      severity: "MODERATE",
      severityColor: "from-amber-600 to-orange-700",
      expectedRainfallMm: 0,
      temperatureC: 41.8,
      heatIndexC: 48.0,
      riverSurgeMetersAboveDanger: -1.5,
      windGustKmH: 22,
      leadTimeHours: 12,
      affectedCropsBn: ["চিনা বাদাম", "ভুট্টা", "পটল", "কাঁচা মরিচ"],
      descriptionBn: "চরের বালুমাটিতে পানির ধারণক্ষমতা কম থাকায় তীব্র রোদে মাটি শুকিয়ে ফসল ঝলসে যেতে পারে। চিনা বাদামের দানা পুষ্ট হওয়া বাধাগ্রস্ত হবে।",
      audioScriptBn: "ইসলামপুর চরের খরা সতর্কতা: তীব্র রোদে চরের বালুমাটিতে পানির টান পড়েছে। সকাল ও বিকালে সৌর পাম্প দিয়ে স্প্রিংলার বা ড্রিপ সেচ দিন এবং খড় দিয়ে মালচিং করুন।",
      emergencyActionPlaybook: [
        "সৌর পাম্প দিয়ে ড্রিপ বা হালকা ছিটিয়ে সেচ দিন।",
        "মাটির ওপর খড় দিয়ে রোদ আটকানোর ব্যবস্থা করুন।",
        "দুপুরের খরতাপে জমিতে কোনো রাসায়নিক সার প্রয়োগ করবেন না।"
      ],
      openWeatherApiTelemetry: { lat: 25.0800, lng: 89.7800, conditionCode: "800", conditionTextEn: "Clear Scorching Heat", humidityPct: 32, uvIndex: 12.0, pressureHpa: 1006 }
    },
    FLASH_FLOOD: {
      riskType: "FLASH_FLOOD",
      titleBn: "🌊 যমুনা নদীর পানি বাহাদুরাবাদ পয়েন্টে বিপদসীমা অতিক্রম",
      badgeBn: "জরুরি বন্যা সতর্কতা (Flood Emergency)",
      severity: "CRITICAL",
      severityColor: "from-blue-700 to-indigo-900",
      expectedRainfallMm: 115,
      temperatureC: 26.5,
      heatIndexC: 29,
      riverSurgeMetersAboveDanger: 1.10,
      windGustKmH: 52,
      leadTimeHours: 4,
      affectedCropsBn: ["চরের সমস্ত বোরো ধান ও রবি ফসল"],
      descriptionBn: "যমুনার পানি বিপদসীমার ১.১ মিটার ওপর দিয়ে বইছে। চরের যোগাযোগ বিচ্ছিন্ন হওয়ার আগেই মাঠের ফসল উদ্ধার করুন। গুঠাইল ঘাট প্লাবিত হচ্ছে।",
      audioScriptBn: "যমুনা অববাহিকার সর্বোচ্চ জরুরি সতর্কতা: পানি বিপদসীমার এক দশমিক এক মিটার ওপরে বইছে। চরের সমস্ত বোরো ধান এবং ফসল বাঁচাতে এখনই ট্রলারে করে গুঠাইল ঘাটে স্থানান্তর করুন।",
      emergencyActionPlaybook: [
        "সব ধরনের ফসল দ্রুত কেটে ট্রলারে বোঝাই করে গুঠাইল ঘাটে আনুন।",
        "কৃষিলিঙ্ক জরুরি হটলাইনে কোল্ড ট্রানজিট সহায়তার জন্য কল করুন।",
        "ইউনিয়ন পরিষদ বন্যা আশ্রয়কেন্দ্রে অবস্থান নিন।"
      ],
      openWeatherApiTelemetry: { lat: 25.0800, lng: 89.7800, conditionCode: "504", conditionTextEn: "Flood Inundation Warning", humidityPct: 99, uvIndex: 1.2, pressureHpa: 990 }
    },
    COLD_FOG: {
      riskType: "COLD_FOG",
      titleBn: "❄️ যমুনা চরের তীব্র শৈত্যপ্রবাহ ও রবি ফসল রক্ষা",
      badgeBn: "শৈত্য সতর্কতা (River Cold Wave)",
      severity: "MODERATE",
      severityColor: "from-cyan-700 to-slate-800",
      expectedRainfallMm: 2,
      temperatureC: 10.1,
      heatIndexC: 9.4,
      riverSurgeMetersAboveDanger: -1.9,
      windGustKmH: 15,
      leadTimeHours: 16,
      affectedCropsBn: ["চরের আলু", "সরিষা", "টমেটো"],
      descriptionBn: "চরের খোলা হাওয়ায় রাতের তাপমাত্রা ৯ ডিগ্রিতে নামতে পারে। সরিষার ফলন রক্ষা ও আলুর ব্লাইট প্রতিরোধে জরুরি ব্যবস্থা নিন।",
      audioScriptBn: "ইসলামপুর চরের শৈত্যপ্রবাহ সতর্কতা: রাতের তাপমাত্রা নয় ডিগ্রিতে নামতে পারে। সরিষা ও আলু ক্ষেতে অবিলম্বে ম্যানকোজেব স্প্রে করুন এবং ধোঁয়া দিয়ে তাপ ধরে রাখুন।",
      emergencyActionPlaybook: [
        "সন্ধ্যার সময় ক্ষেতের চারপাশে ভেজা খড়কুটো জ্বালিয়ে ধোঁয়া তৈরি করুন।",
        "ছত্রাকনাশক স্প্রে করে ব্লাইট প্রতিরোধ করুন।",
        "আলু ক্ষেতে রাতের সেচ দেওয়া বন্ধ রাখুন।"
      ],
      openWeatherApiTelemetry: { lat: 25.0800, lng: 89.7800, conditionCode: "741", conditionTextEn: "Dense River Fog", humidityPct: 95, uvIndex: 2.8, pressureHpa: 1020 }
    }
  },

  // 4. SARISHABARI
  SARISHABARI: {
    HEAVY_RAINFALL: {
      riskType: "HEAVY_RAINFALL",
      titleBn: "🚨 সরিষাবাড়ী ও তারাকান্দি শিল্প এলাকায় অতিবৃষ্টি সতর্কতা",
      badgeBn: "ভারী বর্ষণ লাল সতর্কতা (Industrial Drainage)",
      severity: "CRITICAL",
      severityColor: "from-red-600 to-rose-700",
      expectedRainfallMm: 105,
      temperatureC: 28.2,
      heatIndexC: 32.0,
      riverSurgeMetersAboveDanger: 0.30,
      windGustKmH: 38,
      leadTimeHours: 9,
      affectedCropsBn: ["বোরো ধান", "পাট", "ভুট্টা", "শাকসবজি"],
      descriptionBn: "তারাকান্দি সার কারখানা ও ঝিনাই নদী সংলগ্ন নিচু জমিতে ১০৫ মিমি অতিবৃষ্টির সম্ভাবনা। ড্রেন উপচে সারমিশ্রিত পানি ফসলি জমিতে ঢুকে ক্ষতি হতে পারে।",
      audioScriptBn: "সরিষাবাড়ী উপজেলার জরুরি সতর্কতা: তারাকান্দি ও ঝিনাই নদী এলাকায় একশত পাঁচ মিলিমিটার অতিভারী বৃষ্টি হতে পারে। ড্রেনেজ নালা কেটে দিন এবং আশি শতাংশ পাকা ধান অবিলম্বে কেটে উঁচু ভিটায় তুলুন।",
      emergencyActionPlaybook: [
        "ফসলের চারপাশের নিষ্কাশন নালা পরিষ্কার করে দ্রুত পানি নিষ্কাশন নিশ্চিত করুন।",
        "পাকা ধান কেটে উঁচু স্থানে গুদামজাত করুন।",
        "ভুট্টার গোড়ায় পানি জমতে না দিয়ে আইল কেটে দিন।"
      ],
      openWeatherApiTelemetry: { lat: 24.7500, lng: 89.8300, conditionCode: "502", conditionTextEn: "Heavy Rain & Squall", humidityPct: 93, uvIndex: 2.3, pressureHpa: 999 }
    },
    HEATWAVE: {
      riskType: "HEATWAVE",
      titleBn: "☀️ সরিষাবাড়ীতে প্রখর দাবদাহ ও ভূগর্ভস্থ পানির টান",
      badgeBn: "দাবদাহ সতর্কতা (Heatwave Alert)",
      severity: "MODERATE",
      severityColor: "from-amber-600 to-orange-700",
      expectedRainfallMm: 0,
      temperatureC: 40.8,
      heatIndexC: 46.5,
      riverSurgeMetersAboveDanger: -1.1,
      windGustKmH: 19,
      leadTimeHours: 14,
      affectedCropsBn: ["ধানের থোর অবস্থা", "পাট চারা", "সবজি"],
      descriptionBn: "সরিষাবাড়ীতে টানা শুষ্ক আবহাওয়ায় তাপমাত্রা ৪০.৮° সেন্টিগ্রেডে পৌঁছাতে পারে। ধানের থোর অবস্থা ও কচি পাটের চারা খরায় শুকিয়ে যেতে পারে।",
      audioScriptBn: "সরিষাবাড়ীর দাবদাহ সতর্কতা: তাপমাত্রা একচল্লিশ ডিগ্রির কাছাকাছি। ধানের জমিতে পর্যাপ্ত পানি ধরে রাখুন এবং দুপুরের প্রখর রোদে সেচ দেওয়া থেকে বিরত থাকুন।",
      emergencyActionPlaybook: [
        "ধানের পরাগায়নের সময় জমিতে অবশ্যই ২-৩ ইঞ্চি পানি ধরে রাখুন।",
        "সকাল ১০টার আগে অথবা বিকাল ৫টার পর হালকা সেচ দিন।",
        "সবজি ক্ষেতে খড় দিয়ে মালচিং করুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.7500, lng: 89.8300, conditionCode: "800", conditionTextEn: "Extreme Heat", humidityPct: 37, uvIndex: 11.2, pressureHpa: 1008 }
    },
    FLASH_FLOOD: {
      riskType: "FLASH_FLOOD",
      titleBn: "🌊 ঝিনাই নদীর পানি পিংনা ও ডোয়াইল পয়েন্টে বিপৎসীমার ওপরে",
      badgeBn: "বন্যা সতর্কতা (Basin Flood)",
      severity: "CRITICAL",
      severityColor: "from-blue-700 to-indigo-900",
      expectedRainfallMm: 90,
      temperatureC: 27.2,
      heatIndexC: 30.2,
      riverSurgeMetersAboveDanger: 0.58,
      windGustKmH: 34,
      leadTimeHours: 7,
      affectedCropsBn: ["ঝিনাই তীরের ধান", "পাট", "শাকসবজি"],
      descriptionBn: "উজানের ঢলে ঝিনাই নদীর পানি পিংনা পয়েন্টে বিপদসীমার ৫৮ সেন্টিমিটার ওপর দিয়ে বইছে। নদী তীরবর্তী নিম্নাঞ্চল প্লাবিত হচ্ছে।",
      audioScriptBn: "সরিষাবাড়ীর বন্যা সতর্কতা: ঝিনাই নদীর পানি বিপদসীমার আটান্ন সেন্টিমিটার ওপর দিয়ে প্রবাহিত হচ্ছে। নদীর পাড়ের ধান ও ফসল কেটে দ্রুত নিরাপদ বাঁধে নিয়ে যান।",
      emergencyActionPlaybook: [
        "নদী তীরবর্তী সমস্ত ফসল অনতিবিলম্বে কেটে উঁচু বাঁধে নিন।",
        "গবাদিপশু ও শুকনো খড় নিরাপদ স্থানে স্থানান্তর করুন।",
        "জরুরি হটলাইনে যোগাযোগ করে ফ্রেইট সহায়তা নিন।"
      ],
      openWeatherApiTelemetry: { lat: 24.7500, lng: 89.8300, conditionCode: "504", conditionTextEn: "Jhinai Inundation", humidityPct: 95, uvIndex: 1.9, pressureHpa: 995 }
    },
    COLD_FOG: {
      riskType: "COLD_FOG",
      titleBn: "❄️ সরিষাবাড়ীর সরিষা ও রবি ফসলে কুয়াশা ব্লাইট অ্যালার্ট",
      badgeBn: "শৈত্যপ্রবাহ সতর্কতা (Cold Alert)",
      severity: "MODERATE",
      severityColor: "from-cyan-700 to-slate-800",
      expectedRainfallMm: 4,
      temperatureC: 11.5,
      heatIndexC: 10.8,
      riverSurgeMetersAboveDanger: -1.6,
      windGustKmH: 13,
      leadTimeHours: 17,
      affectedCropsBn: ["সরিষা", "আলু", "টমেটো"],
      descriptionBn: "দীর্ঘস্থায়ী কুয়াশায় সরিষার দানায় ছত্রাকের আক্রমণ এবং আলুর লেইট ব্লাইটের তীব্র ঝুঁকি রয়েছে।",
      audioScriptBn: "সরিষাবাড়ীর শৈত্যপ্রবাহ সতর্কতা: ঘন কুয়াশার কারণে সরিষা ও আলুর জমিতে ব্লাইট রোগ ছড়াতে পারে। অবিলম্বে অনুমোদিত ছত্রাকনাশক স্প্রে করুন এবং রাতে সেচ বন্ধ রাখুন।",
      emergencyActionPlaybook: [
        "সরিষা ও আলু ক্ষেতে ম্যানকোজেব জাতীয় ছত্রাকনাশক স্প্রে করুন।",
        "জমিতে রাতের বেলা সেচ পরিহার করুন।",
        "গোড়ায় মাটি তুলে দিয়ে শিকড়কে অতিরিক্ত ঠাণ্ডা থেকে রক্ষা করুন।"
      ],
      openWeatherApiTelemetry: { lat: 24.7500, lng: 89.8300, conditionCode: "741", conditionTextEn: "Fog Wave", humidityPct: 91, uvIndex: 3.1, pressureHpa: 1017 }
    }
  },

  // 5. DEWANGANJ BAZAR
  DEWANGANJ_BAZAR: {
    HEAVY_RAINFALL: {
      riskType: "HEAVY_RAINFALL",
      titleBn: "🚨 দেওয়ানগঞ্জ বাজার ও বাহাদুরাবাদ ঘাটে আকস্মিক অতিবৃষ্টি",
      badgeBn: "চরম লাল সতর্কতা (Ghat Flash Storm)",
      severity: "CRITICAL",
      severityColor: "from-red-600 to-rose-700",
      expectedRainfallMm: 130,
      temperatureC: 27.0,
      heatIndexC: 30.8,
      riverSurgeMetersAboveDanger: 0.90,
      windGustKmH: 50,
      leadTimeHours: 5,
      affectedCropsBn: ["চরের ভুট্টা", "বোরো ধান", "কাঁচা মরিচ", "বাদাম"],
      descriptionBn: "মেঘালয় পাহাড়ের পাদদেশে দেওয়ানগঞ্জ ও বাহাদুরাবাদ ঘাট পয়েন্টে ১৩০ মিমি চরম অতিবৃষ্টির পূর্বাভাস। পাহাড়ি ঢলে চরাঞ্চলের ফসল তলিয়ে যাওয়ার তীব্র ঝুঁকি।",
      audioScriptBn: "দেওয়ানগঞ্জ বাজার ও বাহাদুরাবাদ ঘাটের সর্বোচ্চ জরুরি সতর্কতা: মেঘালয় পাহাড়ের ঢলে একশত ত্রিশ মিলিমিটার অতিভারী বৃষ্টি হতে পারে। চরের ভুট্টা ও ধান অবিলম্বে কেটে বাহাদুরাবাদ ঘাট বাঁধে নিয়ে আসুন।",
      emergencyActionPlaybook: [
        "চরে থাকা সমস্ত ভুট্টা ও ধান অবিলম্বে কেটে উঁচু বাঁধে আনুন।",
        "নৌকা প্রস্তুত রেখে চরের কৃষকদের নিরাপদ স্থানে সরিয়ে নিন।",
        "কৃষিলিঙ্ক জরুরি হটলাইনে কল করে ফ্রেইট বুকিং দিন।"
      ],
      openWeatherApiTelemetry: { lat: 25.1400, lng: 89.7600, conditionCode: "503", conditionTextEn: "Severe Mountain Squall", humidityPct: 98, uvIndex: 1.4, pressureHpa: 991 }
    },
    HEATWAVE: {
      riskType: "HEATWAVE",
      titleBn: "☀️ দেওয়ানগঞ্জের বালুময় চরাঞ্চলে খরা ও পানির সংকট",
      badgeBn: "খরা সতর্কতা (Drought Risk)",
      severity: "MODERATE",
      severityColor: "from-amber-600 to-orange-700",
      expectedRainfallMm: 0,
      temperatureC: 41.5,
      heatIndexC: 47.8,
      riverSurgeMetersAboveDanger: -1.6,
      windGustKmH: 21,
      leadTimeHours: 13,
      affectedCropsBn: ["ভুট্টা", "চিনা বাদাম", "সবজি"],
      descriptionBn: "দেওয়ানগঞ্জের চরে প্রখর রোদে বালু উত্তপ্ত হয়ে কচি ফসলের গোড়া শুকিয়ে যেতে পারে। ভুট্টার পাতা মোড়ানো এবং ফলন হ্রাসের আশঙ্কা।",
      audioScriptBn: "দেওয়ানগঞ্জের খরা সতর্কতা: চরের বালুমাটিতে পানির সংকট দেখা দিয়েছে। সকাল বা বিকালে হালকা সেচ দিন এবং খড় দিয়ে মাটির আর্দ্রতা রক্ষা করুন।",
      emergencyActionPlaybook: [
        "সৌর পাম্প দিয়ে ড্রিপ বা হালকা ছিটিয়ে সেচ দিন।",
        "মাটির ওপর খড় বা শুকনো ঘাস দিয়ে মালচিং করুন।",
        "রোদের সময় রাসায়নিক সার ছিটানো থেকে বিরত থাকুন।"
      ],
      openWeatherApiTelemetry: { lat: 25.1400, lng: 89.7600, conditionCode: "800", conditionTextEn: "Scorching Sun", humidityPct: 33, uvIndex: 11.9, pressureHpa: 1007 }
    },
    FLASH_FLOOD: {
      riskType: "FLASH_FLOOD",
      titleBn: "🌊 বাহাদুরাবাদ ঘাট পয়েন্টে ব্রহ্মপুত্র নদ বিপদসীমার ৮৫ সেমি ওপরে",
      badgeBn: "জরুরি লাল বন্যা (Brahmaputra Surge)",
      severity: "CRITICAL",
      severityColor: "from-blue-700 to-indigo-900",
      expectedRainfallMm: 120,
      temperatureC: 26.2,
      heatIndexC: 28.8,
      riverSurgeMetersAboveDanger: 0.85,
      windGustKmH: 55,
      leadTimeHours: 4,
      affectedCropsBn: ["সানন্দবাড়ী ও বাহাদুরাবাদ চরের সমস্ত ফসল"],
      descriptionBn: "ব্রহ্মপুত্র নদের পানি বাহাদুরাবাদ ঘাট পয়েন্টে বিপদসীমার ৮৫ সেমি ওপর দিয়ে প্রবাহিত হচ্ছে। সানন্দবাড়ী ও চুকাইবাড়ী চরের ফসল রক্ষায় জরুরি ট্রলার মোতায়েন আবশ্যক।",
      audioScriptBn: "বাহাদুরাবাদ ঘাট পয়েন্টের জরুরি বন্যা সতর্কতা: পানি বিপদসীমার পঁচাশি সেন্টিমিটার ওপর দিয়ে বইছে। সানন্দবাড়ী ও দেওয়ানগঞ্জের সমস্ত মাঠের ফসল কেটে এখনই ঘাটের উঁচু বাঁধে নিয়ে আসুন।",
      emergencyActionPlaybook: [
        "চরের সমস্ত ফসল ট্রলারে বোঝাই করে বাহাদুরাবাদ ঘাটে তুলুন।",
        "গবাদিপশু ও শুকনো খাবার নিরাপদ আশ্রয়কেন্দ্রে সরিয়ে নিন।",
        "কৃষিলিঙ্ক জরুরি হটলাইনে কল করে সহায়তা গ্রহণ করুন।"
      ],
      openWeatherApiTelemetry: { lat: 25.1400, lng: 89.7600, conditionCode: "504", conditionTextEn: "Severe River Flood", humidityPct: 99, uvIndex: 1.1, pressureHpa: 989 }
    },
    COLD_FOG: {
      riskType: "COLD_FOG",
      titleBn: "❄️ পাহাড়ি হাওয়ায় দেওয়ানগঞ্জে তীব্র শৈত্যপ্রবাহ ও কুয়াশা",
      badgeBn: "শৈত্য সতর্কতা (Cold Wave Alert)",
      severity: "MODERATE",
      severityColor: "from-cyan-700 to-slate-800",
      expectedRainfallMm: 3,
      temperatureC: 9.8,
      heatIndexC: 9.0,
      riverSurgeMetersAboveDanger: -2.0,
      windGustKmH: 16,
      leadTimeHours: 15,
      affectedCropsBn: ["আলু", "টমেটো", "সরিষা", "ভুট্টা চারা"],
      descriptionBn: "মেঘালয়ের হিমেল বাতাসে রাতে তাপমাত্রা ৯ ডিগ্রিতে নামবে। টানা ঘন কুয়াশায় আলুর পাতা ধসা ও ভুট্টার চারা হলুদ হয়ে যাওয়ার ঝুঁকি।",
      audioScriptBn: "দেওয়ানগঞ্জের শৈত্যপ্রবাহ সতর্কতা: পাহাড়ি বাতাসে তাপমাত্রা নয় ডিগ্রিতে নামতে পারে। আলু ও টমেটো ক্ষেতে অবিলম্বে ছত্রাকনাশক স্প্রে করুন এবং রাতে সেচ দেওয়া বন্ধ রাখুন।",
      emergencyActionPlaybook: [
        "কুয়াশা শুরুর সাথে সাথে ম্যানকোজেব স্প্রে করে ব্লাইট প্রতিরোধ করুন।",
        "রাতে সেচ পরিহার করে বিকেলে হালকা ধোঁয়া তৈরি করুন।",
        "ভুট্টার কচি চারাকে ঠাণ্ডা বাতাস থেকে রক্ষা করুন।"
      ],
      openWeatherApiTelemetry: { lat: 25.1400, lng: 89.7600, conditionCode: "741", conditionTextEn: "Dense Mountain Fog", humidityPct: 96, uvIndex: 2.7, pressureHpa: 1021 }
    }
  }
};

interface ScreenPushAlert {
  id: string;
  phone: string;
  operator: string;
  title: string;
  body: string;
  timestamp: string;
  upazilaName: string;
}

const getOperatorName = (phone: string): string => {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("017") || clean.startsWith("013")) return "গ্রামীণফোন (GP 4G)";
  if (clean.startsWith("019") || clean.startsWith("014")) return "বাংলালিংক (BL 4G)";
  if (clean.startsWith("018")) return "রবি (Robi 4G)";
  if (clean.startsWith("016")) return "এয়ারটেল (Airtel 4G)";
  if (clean.startsWith("015")) return "টেলিটক (Teletalk DAE)";
  return "বাংলাদেশী সেলুলার নেটওয়ার্ক (BTRC GSM)";
};

// High-fidelity Web Audio synthesized chime
const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.6);
  } catch (e) {}
};

// Spoken voice audio ping
const playVoiceStartPing = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {}
};

export const ClimateRiskAlert: React.FC = () => {
  const { currentUser, lang, addAuditLog } = useApp();

  const [selectedZone, setSelectedZone] = useState<string>("JAMALPUR_SADAR");
  const [activeRiskType, setActiveRiskType] = useState<ClimateRiskType>("HEAVY_RAINFALL");
  const [selectedUpazilas, setSelectedUpazilas] = useState<string[]>(["JAMALPUR_SADAR"]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Voice Narration State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentlySpeakingRisk, setCurrentlySpeakingRisk] = useState<ClimateRiskType | null>(null);
  const [currentCaptionText, setCurrentCaptionText] = useState<string>("");
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Real SMS Alert State
  const [customPhoneNumber, setCustomPhoneNumber] = useState<string>(currentUser.phone || "01711223344");
  const [smsSending, setSmsSending] = useState<boolean>(false);
  const [smsSendingStep, setSmsSendingStep] = useState<number>(0);
  const [receivedSmsCard, setReceivedSmsCard] = useState<{
    phone: string;
    operator: string;
    upazila: string;
    timestamp: string;
    token: string;
    messageText: string;
  } | null>(null);

  // SMS Confirmation Pop-up Modal State
  const [showSmsConfirmationModal, setShowSmsConfirmationModal] = useState<boolean>(false);

  // Screen Push Alert State
  const [activeScreenPushAlert, setActiveScreenPushAlert] = useState<ScreenPushAlert | null>(null);

  // 72-Hour Predictive Agro-Meteorological Radar & Crop Shield Simulator State
  const [radarTimelineHour, setRadarTimelineHour] = useState<number>(12);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [protectedValueSaved, setProtectedValueSaved] = useState<number>(185000);
  const [lastSyncTime, setLastSyncTime] = useState<string>("এইমাত্র (OpenWeather Live)");

  const zoneData = REGIONAL_CLIMATE_RISKS[selectedZone] || REGIONAL_CLIMATE_RISKS.JAMALPUR_SADAR;
  const currentRisk = zoneData[activeRiskType] || zoneData.HEAVY_RAINFALL;
  const currentUpazilaMeta = UPAZILAS.find(u => u.key === selectedZone) || UPAZILAS[0];

  // Preload speech synthesis voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Auto-dismiss screen push alert after 10 seconds
  useEffect(() => {
    if (activeScreenPushAlert) {
      const timer = setTimeout(() => {
        setActiveScreenPushAlert(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [activeScreenPushAlert]);

  // Sync / Refresh Simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }) + " এ উপগ্রহ সিঙ্ক");
      addAuditLog(
        "CLIMATE_RISK_SYNC",
        `/api/climate/risk/${selectedZone}/${activeRiskType}`,
        "ALLOWED",
        `OpenWeather Early Warning Synced for ${currentUpazilaMeta.nameBn}. Risk: ${currentRisk.riskType}.`
      );
    }, 700);
  };

  // Upazila multi-select toggle
  const toggleUpazilaSelection = (key: string) => {
    setSelectedZone(key);
    setSelectedUpazilas(prev => {
      if (prev.includes(key)) {
        return prev.length === 1 ? prev : prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // ROBUST Text-To-Speech (TTS) Voice Engine for Bangla
  const handleVoiceBroadcastFor = (riskType: ClimateRiskType) => {
    if (isSpeaking && currentlySpeakingRisk === riskType) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setCurrentlySpeakingRisk(null);
      setCurrentCaptionText("");
      return;
    }

    const targetRisk = zoneData[riskType] || currentRisk;
    const textToSpeak = targetRisk.audioScriptBn;

    playVoiceStartPing();
    setCurrentCaptionText(textToSpeak);
    setIsSpeaking(true);
    setCurrentlySpeakingRisk(riskType);

    if (!("speechSynthesis" in window)) {
      // If browser lacks speech synthesis, keep visual caption active with chime
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentlySpeakingRisk(null);
      }, 8000);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtteranceRef.current = utterance;

      // Find best available voice
      const voices = window.speechSynthesis.getVoices();
      const banglaVoice = voices.find(v => 
        v.lang === "bn-BD" || 
        v.lang === "bn-IN" || 
        v.lang.startsWith("bn") ||
        v.name.toLowerCase().includes("bangla") ||
        v.name.toLowerCase().includes("bengali")
      );

      if (banglaVoice) {
        utterance.voice = banglaVoice;
        utterance.lang = banglaVoice.lang;
      } else {
        // Fallback voice (e.g. Hindi, Indian English, or default)
        const fallbackVoice = voices.find(v => v.lang.includes("hi") || v.lang.includes("en-IN") || v.default);
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
        utterance.lang = "bn-BD";
      }

      utterance.rate = 0.86;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlySpeakingRisk(riskType);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingRisk(null);
        setCurrentCaptionText("");
      };

      utterance.onerror = () => {
        // Fallback: don't break UI, keep visual broadcast active for a few seconds
        setTimeout(() => {
          setIsSpeaking(false);
          setCurrentlySpeakingRisk(null);
        }, 6000);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentlySpeakingRisk(null);
      }, 6000);
    }
  };

  // 1. Direct Mobile Device SMS Dispatch (Opens Phone's Native SMS App with SIM ready to send)
  const handleDirectDeviceSms = (targetPhone?: string) => {
    const phoneToUse = (targetPhone || customPhoneNumber).trim();
    if (!phoneToUse) {
      alert("দয়া করে একটি সঠিক মোবাইল নম্বর দিন।");
      return;
    }
    const smsMessage = `[জরুরি কৃষি সতর্কতা - ডিএই ও কৃষিলিঙ্ক] ${currentUpazilaMeta.nameBn} এলাকায় আগামী ${currentRisk.leadTimeHours} ঘণ্টায় ${currentRisk.titleBn}। পরামর্শ: ${currentRisk.emergencyActionPlaybook[0]}। বিস্তারিত জানতে ও কোল্ড চেইনে কল করুন: ১৬১২৩`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsUrl = `sms:${phoneToUse}${isIOS ? '&' : '?'}body=${encodeURIComponent(smsMessage)}`;
    
    // Trigger in-screen push alert & chime simultaneously
    handleTriggerDeviceNotification(phoneToUse);

    try {
      window.location.href = smsUrl;
    } catch (e) {
      window.open(smsUrl, '_blank');
    }

    const deliveryToken = `TRX-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
    const operator = getOperatorName(phoneToUse);
    const newReceipt = {
      phone: phoneToUse,
      operator: operator,
      upazila: currentUpazilaMeta.nameBn,
      timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      token: deliveryToken,
      messageText: smsMessage
    };

    setReceivedSmsCard(newReceipt);
    setShowSmsConfirmationModal(true);

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}

    addAuditLog(
      "CLIMATE_DEVICE_SMS_TRIGGERED",
      `/device/sms-intent`,
      "ALLOWED",
      `Direct Device SMS Intent triggered for phone ${phoneToUse} (${currentUpazilaMeta.nameBn}).`
    );
  };

  // 2. Real System & In-Screen Device Notification (Pops up on Screen with Sound)
  const handleTriggerDeviceNotification = (targetPhone?: string) => {
    const phoneToUse = (targetPhone || customPhoneNumber).trim();
    if (!phoneToUse) {
      alert("দয়া করে কৃষকের মোবাইল নম্বর দিন।");
      return;
    }

    playNotificationChime();

    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([250, 100, 250]);
      }
    } catch (e) {}

    const operator = getOperatorName(phoneToUse);
    const alertData: ScreenPushAlert = {
      id: "PUSH-" + Date.now(),
      phone: phoneToUse,
      operator: operator,
      upazilaName: currentUpazilaMeta.nameBn,
      title: currentRisk.titleBn,
      body: `[জরুরি কৃষি পুশ অ্যালার্ট - ${currentUpazilaMeta.nameBn}] ${currentRisk.titleBn}। পরামর্শ: ${currentRisk.emergencyActionPlaybook[0]}। হেল্পলাইন: ১৬১২৩`,
      timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    };

    setActiveScreenPushAlert(alertData);

    try {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(`🚨 কৃষি সতর্কতা: ${currentRisk.titleBn}`, {
            body: `এলাকা: ${currentUpazilaMeta.nameBn} · প্রাপক: ${phoneToUse} (${operator})`,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification(`🚨 কৃষি সতর্কতা: ${currentRisk.titleBn}`, {
                body: `এলাকা: ${currentUpazilaMeta.nameBn} · প্রাপক: ${phoneToUse} (${operator})`,
                icon: "/favicon.ico"
              });
            }
          });
        }
      }
    } catch (e) {}

    try {
      confetti({ particleCount: 65, spread: 55, origin: { y: 0.15 } });
    } catch (e) {}

    addAuditLog(
      "SCREEN_PUSH_ALERT_TRIGGERED",
      `/farmer/push-alert`,
      "ALLOWED",
      `Screen Push Alert fired for ${phoneToUse} (${currentUpazilaMeta.nameBn}). Risk: ${currentRisk.titleBn}`
    );
  };

  // 3. Realistic UI Simulation for Sending SMS with Multi-Step Progress & Confirmation Pop-up
  const handleSendRealSmsAlert = (targetPhone?: string) => {
    const phoneToUse = (targetPhone || customPhoneNumber).trim();
    if (!phoneToUse) {
      alert("দয়া করে একটি সঠিক মোবাইল নম্বর দিন।");
      return;
    }

    setSmsSending(true);
    setSmsSendingStep(1);

    const smsMessage = `[জরুরি কৃষি সতর্কতা - ডিএই ও কৃষিলিঙ্ক] ${currentUpazilaMeta.nameBn} এলাকায় আগামী ${currentRisk.leadTimeHours} ঘণ্টায় ${currentRisk.titleBn}। পরামর্শ: ${currentRisk.emergencyActionPlaybook[0]}। বিস্তারিত জানতে ও কোল্ড চেইন বুকিংয়ে কল করুন: ১৬১২৩।`;

    // Asynchronously call backend Express /api/sms/dispatch route
    try {
      fetch("/api/sms/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneToUse,
          upazila: currentUpazilaMeta.nameBn,
          riskType: activeRiskType,
          message: smsMessage
        })
      }).catch(() => {
        // Silent fallback for offline
      });
    } catch (e) {}

    // Step 1: Connecting to Gateway
    setTimeout(() => {
      setSmsSendingStep(2);
    }, 450);

    // Step 2: Routing & Encrypting
    setTimeout(() => {
      setSmsSendingStep(3);
    }, 900);

    // Step 3: Delivered
    setTimeout(() => {
      setSmsSending(false);
      setSmsSendingStep(0);
      const deliveryToken = `TRX-BTRC-${Math.floor(100000 + Math.random() * 900000)}`;
      const operator = getOperatorName(phoneToUse);

      const receipt = {
        phone: phoneToUse,
        operator: operator,
        upazila: currentUpazilaMeta.nameBn,
        timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        token: deliveryToken,
        messageText: smsMessage
      };

      setReceivedSmsCard(receipt);
      setShowSmsConfirmationModal(true);
      playNotificationChime();

      try {
        confetti({ particleCount: 85, spread: 65, origin: { y: 0.6 } });
      } catch (e) {}

      addAuditLog(
        "CLIMATE_SMS_DISPATCHED",
        `/api/sms/gateway/btrc`,
        "ALLOWED",
        `Emergency Climate SMS dispatched to ${phoneToUse} (${currentUpazilaMeta.nameBn}). Token: ${deliveryToken}.`
      );
    }, 1400);
  };

  // 1-Click 72-Hour Crop Shield Protocol Activation
  const handleActivate72HourCropShield = () => {
    setShieldActive(true);
    setProtectedValueSaved(185000 + Math.floor(Math.random() * 25000));
    
    // Auto-send SMS to phone
    handleSendRealSmsAlert(customPhoneNumber || currentUser.phone || "01711223344");
    
    // Start voice audio broadcast
    handleVoiceBroadcastFor(activeRiskType);

    try {
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    addAuditLog(
      "CROP_SHIELD_ACTIVATED",
      `/api/climate/crop-shield/72h`,
      "ALLOWED",
      `72-Hour Crop Shield Activated for ${currentUpazilaMeta.nameBn}. Reefer trucks reserved, SMS alert blasted to lead farmers.`
    );
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-7 font-sans relative">
      
      {/* FLOATING REAL-TIME SCREEN PUSH ALERT BANNER */}
      {activeScreenPushAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[520px] shadow-2xl rounded-3xl bg-stone-950 border-2 border-amber-400 text-white p-4.5 animate-fadeIn space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0 animate-bounce shadow-md">
                <BellRing className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                    ডিএই ও কৃষিলিঙ্ক লাইভ স্ক্রিন পুশ অ্যালার্ট
                  </span>
                  <span className="text-[10px] font-mono bg-white/20 text-stone-200 px-1.5 py-0.5 rounded">
                    {activeScreenPushAlert.timestamp}
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  📍 {activeScreenPushAlert.upazilaName} · 📱 {activeScreenPushAlert.phone} ({activeScreenPushAlert.operator})
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveScreenPushAlert(null)}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              title="বন্ধ করুন"
            >
              ✕
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900 border border-white/10 text-xs text-stone-200 leading-relaxed">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>{activeScreenPushAlert.title}</span>
            </div>
            <p className="text-stone-300 font-medium">
              {activeScreenPushAlert.body}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleVoiceBroadcastFor(activeRiskType)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>🔊 বাংলায় শুনুন</span>
              </button>

              <button
                onClick={() => {
                  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  const smsUrl = `sms:${activeScreenPushAlert.phone}${isIOS ? '&' : '?'}body=${encodeURIComponent(activeScreenPushAlert.body)}`;
                  try {
                    window.location.href = smsUrl;
                  } catch (e) {
                    window.open(smsUrl, '_blank');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 মেসেজ অ্যাপ খুলুন</span>
              </button>

              <button
                onClick={() => {
                  setShowSmsConfirmationModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold flex items-center gap-1.5 cursor-pointer border border-stone-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>📋 কনফার্মেশন পপ-আপ</span>
              </button>
            </div>

            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>স্ক্রিনে অ্যালার্ট সক্রিয়</span>
            </span>
          </div>
        </div>
      )}

      {/* LIVE VOICE BROADCAST KARAOKE CAPTION BANNER */}
      {isSpeaking && (
        <div className="p-4 rounded-2xl bg-linear-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg space-y-2 animate-fadeIn border border-white/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
              <span className="font-black uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>লাইভ বাংলা ভয়েস ব্রডকাস্ট পাঠ চলছে (Speech Teleprompter)</span>
              </span>
            </div>
            <button
              onClick={() => handleVoiceBroadcastFor(activeRiskType)}
              className="px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              বন্ধ করুন ✕
            </button>
          </div>
          <p className="text-sm font-bold text-white leading-relaxed pl-1 border-l-2 border-amber-300">
            "{currentCaptionText || currentRisk.audioScriptBn}"
          </p>
          <div className="flex items-center justify-between text-[11px] text-amber-100 pt-1">
            <span>এলাকা: {currentUpazilaMeta.labelBn}</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-white animate-pulse"></span>
              <span className="w-1.5 h-5 bg-white animate-pulse delay-75"></span>
              <span className="w-1.5 h-2 bg-white animate-pulse delay-150"></span>
              <span className="w-1.5 h-4 bg-white animate-pulse delay-200"></span>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header with Farmer Registered Location Badge & OpenWeather API Grounding */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
            <ShieldAlert className="w-6 h-6 animate-pulse text-[#FBBF24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {lang === "bn" ? "জলবায়ু ঝুঁকি ও দুর্যোগ আগাম সতর্কতা (Climate Risk Alert)" : "Climate Risk & Disaster Early Warning"}
              </h2>
              <span className="text-[11px] font-mono bg-red-100 text-red-900 px-2.5 py-0.5 rounded-full font-bold">
                OpenWeather™ Satellite Radar
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
              <span className="font-semibold text-stone-800">
                নির্বাচিত আঞ্চলিক কেন্দ্র: {currentUpazilaMeta.labelBn} · অববাহিকা: {currentUpazilaMeta.riverBasinBn}
              </span>
            </div>
          </div>
        </div>

        {/* Sync telemetry button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1.5"
            title="Refresh Live Satellite Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`} />
            <span>উপগ্রহ সিঙ্ক</span>
          </button>
        </div>
      </div>

      {/* 1.1 EXPANDED UPAZILA SELECTION BAR (Jamalpur Sadar, Melandaha, Islampur, Sarishabari, Dewangonj Bazar) */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#14532D]" />
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              উপজেলা নির্বাচন করুন (Multi-Select Upazila Logic Map):
            </h4>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            প্রতিটি উপজেলার জন্য নির্দিষ্ট ফসল ও নদীর জলস্তর সংযুক্ত
          </span>
        </div>

        {/* Quick-Pills for 5 Upazilas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {UPAZILAS.map((upazila) => {
            const isSelected = selectedZone === upazila.key;
            return (
              <button
                key={upazila.key}
                type="button"
                onClick={() => toggleUpazilaSelection(upazila.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? "bg-[#14532D] text-white border-[#14532D] shadow-md ring-2 ring-emerald-400"
                    : "bg-white text-stone-800 border-stone-300 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs block">
                    📍 {upazila.nameBn}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight block ${isSelected ? "text-emerald-100" : "text-stone-500"}`}>
                  {upazila.riverBasinBn}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-200">
          <span>আওতাধীন এলাকা: <strong>{currentUpazilaMeta.notableAreasBn}</strong></span>
          <span className="text-[#14532D] font-bold font-mono">লাইভ রাডার লজিক সক্রিয় ✓</span>
        </div>
      </div>

      {/* 2. Four Climate Risk Category Selectors with Dedicated Bangla Voice Listen Button on Each */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>৪টি প্রধান প্রাকৃতিক দুর্যোগ সতর্কতা ({currentUpazilaMeta.nameBn} অঞ্চলের জন্য):</span>
          </span>
          <span className="text-[11px] font-mono text-stone-400">প্রতিটিতে ক্লিক করে মুখে বাংলায় শুনুন</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Category 1: Heavy Rainfall */}
          <div
            onClick={() => setActiveRiskType("HEAVY_RAINFALL")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
              activeRiskType === "HEAVY_RAINFALL"
                ? "bg-red-600 text-white border-red-600 shadow-lg ring-2 ring-red-400"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className="w-6 h-6 text-[#FBBF24]" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/20 font-bold">
                  {zoneData.HEAVY_RAINFALL.expectedRainfallMm} মিমি বৃষ্টি
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRiskType("HEAVY_RAINFALL");
                    handleVoiceBroadcastFor("HEAVY_RAINFALL");
                  }}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                    isSpeaking && currentlySpeakingRisk === "HEAVY_RAINFALL"
                      ? "bg-amber-400 text-stone-950 animate-bounce"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                  title="অতিভারী বৃষ্টির সতর্কবার্তা বাংলায় শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-sm">১. অতিভারী বৃষ্টিপাত</h4>
              <span className="text-[11px] opacity-90 block">জলাবদ্ধতা ও ফসল নিমজ্জন</span>
            </div>
          </div>

          {/* Category 2: Severe Heatwave */}
          <div
            onClick={() => setActiveRiskType("HEATWAVE")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
              activeRiskType === "HEATWAVE"
                ? "bg-amber-600 text-white border-amber-600 shadow-lg ring-2 ring-amber-400"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-6 h-6 text-[#FBBF24]" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/20 font-bold">
                  {zoneData.HEATWAVE.temperatureC}°C তাপমাত্রা
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRiskType("HEATWAVE");
                    handleVoiceBroadcastFor("HEATWAVE");
                  }}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                    isSpeaking && currentlySpeakingRisk === "HEATWAVE"
                      ? "bg-amber-300 text-stone-950 animate-bounce"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                  title="দাবদাহ ও খরা সতর্কবার্তা বাংলায় শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-sm">২. তীব্র দাবদাহ ও খরা</h4>
              <span className="text-[11px] opacity-90 block">শীষ বন্ধ্যত্ব ও পাতা ঝলসানো</span>
            </div>
          </div>

          {/* Category 3: Flash Flood */}
          <div
            onClick={() => setActiveRiskType("FLASH_FLOOD")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
              activeRiskType === "FLASH_FLOOD"
                ? "bg-blue-800 text-white border-blue-800 shadow-lg ring-2 ring-blue-400"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className="w-6 h-6 text-cyan-300" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/20 font-bold">
                  +{zoneData.FLASH_FLOOD.riverSurgeMetersAboveDanger}m বিপদসীমা
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRiskType("FLASH_FLOOD");
                    handleVoiceBroadcastFor("FLASH_FLOOD");
                  }}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                    isSpeaking && currentlySpeakingRisk === "FLASH_FLOOD"
                      ? "bg-cyan-300 text-stone-950 animate-bounce"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                  title="আকস্মিক ঢল ও বন্যা সতর্কবার্তা বাংলায় শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-sm">৩. আকস্মিক পাহাড়ি ঢল</h4>
              <span className="text-[11px] opacity-90 block">নদী তীরবর্তী বন্যা ও প্লাবন</span>
            </div>
          </div>

          {/* Category 4: Cold Wave & Dense Fog */}
          <div
            onClick={() => setActiveRiskType("COLD_FOG")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
              activeRiskType === "COLD_FOG"
                ? "bg-cyan-800 text-white border-cyan-800 shadow-lg ring-2 ring-cyan-400"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <Thermometer className="w-6 h-6 text-cyan-200" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/20 font-bold">
                  {zoneData.COLD_FOG.temperatureC}°C কুয়াশা
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRiskType("COLD_FOG");
                    handleVoiceBroadcastFor("COLD_FOG");
                  }}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                    isSpeaking && currentlySpeakingRisk === "COLD_FOG"
                      ? "bg-cyan-300 text-stone-950 animate-bounce"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                  title="ঘন কুয়াশা ও আলুর ব্লাইট সতর্কবার্তা বাংলায় শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-sm">৪. ঘন কুয়াশা ও শৈত্যপ্রবাহ</h4>
              <span className="text-[11px] opacity-90 block">আলুর লেইট ব্লাইট স্পোর ঝুঁকি</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Urgent Alert Banner with Emergency Lead Time Countdown & Audio Equalizer */}
      <div className={`p-6 sm:p-7 rounded-3xl bg-linear-to-r ${currentRisk.severityColor} text-white shadow-xl space-y-4`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white/20 text-white px-3 py-1 rounded-full">
                {currentRisk.badgeBn}
              </span>
              <span className="text-xs font-mono font-bold bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>প্রস্তুতির সময় বাকি: {currentRisk.leadTimeHours} ঘণ্টা</span>
              </span>
              <span className="text-xs font-mono bg-black/20 text-white px-2.5 py-0.5 rounded-full font-bold">
                📍 {currentUpazilaMeta.labelBn}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              {currentRisk.titleBn}
            </h3>
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed max-w-3xl">
              {currentRisk.descriptionBn}
            </p>
          </div>

          {/* Action Buttons: Voice Broadcast with Audio Equalizer */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleVoiceBroadcastFor(activeRiskType)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all ${
                isSpeaking
                  ? "bg-amber-400 text-stone-950 ring-4 ring-amber-300/50 animate-pulse"
                  : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-stone-950" />
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-stone-950 animate-pulse"></span>
                    <span className="w-1 h-5 bg-stone-950 animate-pulse delay-75"></span>
                    <span className="w-1 h-2 bg-stone-950 animate-pulse delay-150"></span>
                  </div>
                  <span>থামুন (অডিও বন্ধ)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#FBBF24]" />
                  <span>🔊 মুখে বাংলায় সতর্কবার্তা শুনুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Affected Crops Warning Ribbon */}
        <div className="pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">ঝুঁকিপূর্ণ শস্যসমূহ ({currentUpazilaMeta.nameBn}):</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentRisk.affectedCropsBn.map((crop, i) => (
                <span key={i} className="bg-white/15 px-2 py-0.5 rounded-md font-medium text-stone-100">
                  {crop}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-200">{lastSyncTime}</span>
        </div>
      </div>

      {/* 4. REAL MOBILE SMS ALERT DISPATCH & GSM GATEWAY SIMULATOR WIDGET */}
      <div className="rounded-3xl bg-linear-to-br from-amber-50/70 via-stone-50 to-emerald-50/50 border border-stone-200 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                মোবাইলে সরাসরি SMS সতর্কবার্তা ও স্ক্রিন পুশ অ্যালার্ট (Telecom GSM Gateway)
              </h3>
              <p className="text-xs text-stone-500">
                যেকোনো কৃষকের ১১-সংখ্যার মোবাইল নম্বরে তৎক্ষণাৎ সচেতনতামূলক এসএমএস ও স্ক্রিন অ্যালার্ট পৌঁছাবে
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>পুশ সার্ভিস সক্রিয় (Active)</span>
            </span>
            <span className="text-xs font-mono bg-stone-200 text-stone-800 px-2.5 py-1 rounded-full font-bold">
              BTRC / GP / BL / Robi
            </span>
          </div>
        </div>

        {/* Screen Push Alert Active Notification Notice */}
        <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-amber-100/70 border border-amber-300/80 text-xs gap-2">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-700 animate-bounce shrink-0" />
            <span className="font-bold text-amber-950">
              🔔 স্ক্রিনে পুশ অ্যালার্ট (Screen Push Alert) অপশন সক্রিয়:
            </span>
            <span className="text-stone-700 font-medium">
              নম্বর প্রদান করে পাঠালে সাথে সাথে ডিভাইসের স্ক্রিনে অ্যালার্ট ব্যানার ভেসে উঠবে এবং অ্যালার্ম টিউন বাজবে।
            </span>
          </div>
          <button
            onClick={() => handleTriggerDeviceNotification()}
            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>এখনই স্ক্রিনে টেস্ট অ্যালার্ট দেখুন</span>
          </button>
        </div>

        {/* Phone Input Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700">
                কৃষক বা দায়িত্বপ্রাপ্ত কর্মকর্তার মোবাইল নম্বর ({currentUpazilaMeta.nameBn}):
              </label>
              <span className="text-xs text-stone-500 font-mono">
                {customPhoneNumber.replace(/[^0-9]/g, "").length}/11 ডিজিট
              </span>
            </div>

            <div className="relative">
              <input
                type="tel"
                value={customPhoneNumber}
                onChange={(e) => setCustomPhoneNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleDirectDeviceSms();
                  }
                }}
                placeholder="যেমন: 01711223344 বা 019..."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-300 font-mono text-sm font-bold text-stone-900 focus:ring-2 focus:ring-[#14532D] outline-hidden shadow-2xs"
              />
              {customPhoneNumber.replace(/[^0-9]/g, "").length >= 11 && (
                <span className="absolute right-3 top-3 text-emerald-600 font-mono text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>প্রস্তুত</span>
                </span>
              )}
            </div>

            {/* Dynamic Operator Detection Pill */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-stone-600 font-medium text-[11px]">শনাক্তকৃত নেটওয়ার্ক:</span>
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded-lg border border-stone-200 text-[11px]">
                  {getOperatorName(customPhoneNumber)}
                </span>
              </div>
              <span className="text-[11px] text-stone-500">
                এন্টার চাপলে সরাসরি পাঠানো হবে
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-2">
            {/* Action 1: Direct Device SMS Intent & Screen Push Alert Combined */}
            <button
              onClick={() => handleDirectDeviceSms()}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#14532D] hover:bg-emerald-800 text-white shadow-md cursor-pointer transition-all"
            >
              <Smartphone className="w-4 h-4 text-[#FBBF24]" />
              <span>📱 ফোনে সরাসরি SMS পাঠান (SIM Intent)</span>
            </button>

            {/* Action 2: Trigger Live Device Push Notification & Telecom Gateway Simulation */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTriggerDeviceNotification()}
                className="py-2.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer transition-all"
                title="ডিভাইসের স্ক্রিনে তাৎক্ষণিক এলার্ম সাউন্ড ও পুশ ব্যানার সক্রিয় করুন"
              >
                <BellRing className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
                <span>🔔 স্ক্রিনে পুশ অ্যালার্ট</span>
              </button>

              <button
                onClick={() => handleSendRealSmsAlert()}
                disabled={smsSending}
                className="py-2.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs cursor-pointer transition-all"
                title="বিটিআরসি গেটওয়ের ৩-ধাপের প্রোগ্রেস ও কনফার্মেশন পপ-আপ প্রদর্শন করুন"
              >
                <Send className={`w-3.5 h-3.5 ${smsSending ? "animate-spin" : ""}`} />
                <span>{smsSending ? "পাঠানো হচ্ছে..." : "📡 বিটিআরসি গেটওয়ে টেস্ট"}</span>
              </button>
            </div>

            <span className="text-[10px] text-stone-500 text-center">
              *স্মার্টফোন থেকে ১ নম্বর বাটনে চাপলে সরাসরি ফোনের মেসেজিং অ্যাপ ওপেন হবে ও স্ক্রিনে পুশ অ্যালার্ট বাজবে
            </span>
          </div>
        </div>

        {/* 🧪 LIVE TESTING PANEL FOR PRESENTATION IN FRONT OF TEACHER / EVALUATORS */}
        <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3 shadow-md border border-stone-800">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="font-bold text-xs text-amber-400 uppercase tracking-wide">
                🧪 শিক্ষক ও পরীক্ষকদের জন্য লাইভ প্রেজেন্টেশন টেস্টিং প্যানেল (Demo Controls)
              </span>
            </div>
            <span className="text-[10px] font-mono text-stone-400">
              যেকোনো বাটনে এক ক্লিকে সরাসরি পরীক্ষা করুন
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Test 1: Screen Push Alert */}
            <button
              onClick={() => handleTriggerDeviceNotification()}
              className="p-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <BellRing className="w-3.5 h-3.5 group-hover:animate-bounce" />
                <span className="font-bold text-[11px]">১. স্ক্রিন পুশ টেস্ট</span>
              </div>
              <p className="text-[10px] text-stone-300 leading-tight">
                স্ক্রিনের শীর্ষে লাইভ অ্যালার্ট ব্যানার ও সাউন্ড বাজায়
              </p>
            </button>

            {/* Test 2: Native Device SMS Intent */}
            <button
              onClick={() => handleDirectDeviceSms()}
              className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Smartphone className="w-3.5 h-3.5 group-hover:scale-110" />
                <span className="font-bold text-[11px]">২. রিয়েল SMS ইনটেন্ট</span>
              </div>
              <p className="text-[10px] text-stone-300 leading-tight">
                ফোনের মেসেজ অ্যাপে স্বয়ংক্রিয় মেসেজ ওপেন করে
              </p>
            </button>

            {/* Test 3: Telecom Gateway & Pop-up Modal */}
            <button
              onClick={() => handleSendRealSmsAlert()}
              disabled={smsSending}
              className="p-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5" />
                <span className="font-bold text-[11px]">৩. গেটওয়ে ও পপ-আপ</span>
              </div>
              <p className="text-[10px] text-stone-300 leading-tight">
                ৩-ধাপের ডেলিভারি ট্র্যাকার ও কনফার্মেশন পপ-আপ দেখায়
              </p>
            </button>

            {/* Test 4: Bangla Voice TTS Broadcast */}
            <button
              onClick={() => handleVoiceBroadcastFor(activeRiskType)}
              className="p-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                <Volume2 className="w-3.5 h-3.5 group-hover:scale-110" />
                <span className="font-bold text-[11px]">৪. বাংলায় ভয়েস অ্যালার্ট</span>
              </div>
              <p className="text-[10px] text-stone-300 leading-tight">
                কম্পিউটার স্পিকারে বাংলায় পুরো সতর্কতা পড়ে শোনায়
              </p>
            </button>
          </div>
        </div>

        {/* SENDING SMS STATUS UI SIMULATION TRACKER */}
        {smsSending && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>টেলিকম গেটওয়েতে এসএমএস পাঠানো হচ্ছে (Sending SMS in Progress)...</span>
              </span>
              <span className="font-mono">ধাপ {smsSendingStep}/৩</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(smsSendingStep / 3) * 100}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-amber-800 font-medium">
              {smsSendingStep === 1 && "• ধাপ ১: বিটিআরসি অনুমোদিত টেলিকম গেটওয়েতে সংযোগ স্থাপন করা হচ্ছে..."}
              {smsSendingStep === 2 && `• ধাপ ২: ${customPhoneNumber} নম্বরে সতর্কবার্তা এনক্রিপশন ও রাউটিং চলছে (${currentUpazilaMeta.nameBn})...`}
              {smsSendingStep === 3 && "• ধাপ ৩: সিম নেটওয়ার্কে সতর্কবার্তা ডেলিভারি কনফার্মেশন সম্পন্ন হচ্ছে..."}
            </p>
          </div>
        )}

        {/* Live Incoming SMS Handset Simulator Card */}
        {receivedSmsCard && !showSmsConfirmationModal && (
          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono text-xs font-black text-emerald-800 uppercase">
                  ✓ SMS DISPATCH SUCCESSFUL · নম্বর: {receivedSmsCard.phone} ({receivedSmsCard.operator})
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">{receivedSmsCard.timestamp}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-sans text-xs text-stone-800 leading-relaxed">
              <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                <span>Sender: DAE-KRISHI (16123) · এলাকা: {receivedSmsCard.upazila}</span>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Token: {receivedSmsCard.token}
                </span>
              </div>
              <p className="font-medium text-stone-800">
                "{receivedSmsCard.messageText}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>টেলিকম রাউটিং: গ্রামীণফোন / বাংলালিংক / রবি বিটিআরসি এসএমএস প্রটোকল</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSmsConfirmationModal(true)}
                  className="text-[#14532D] font-bold hover:underline cursor-pointer"
                >
                  পপ-আপ দেখুন
                </button>
                <button
                  onClick={() => setReceivedSmsCard(null)}
                  className="text-stone-400 hover:text-stone-700 underline cursor-pointer"
                >
                  লুকান
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SMS CONFIRMATION POP-UP MODAL (Visual Student Presentation Demonstration) */}
      {showSmsConfirmationModal && receivedSmsCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <CheckCheck className="w-6 h-6 text-stone-950" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-stone-900 leading-tight">
                    কৃষকের ফোনে SMS সফলভাবে প্রেরিত হয়েছে!
                  </h3>
                  <p className="text-xs text-stone-500">
                    ডিএই ও কৃষিলিঙ্ক ডিজাস্টার আর্লি ওয়ার্নিং কনফার্মেশন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSmsConfirmationModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono">
              <div>
                <span className="text-stone-500 block text-[10px]">প্রাপক মোবাইল নম্বর:</span>
                <span className="font-bold text-stone-900 text-sm">{receivedSmsCard.phone}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">মোবাইল নেটওয়ার্ক:</span>
                <span className="font-bold text-emerald-700 text-sm">{receivedSmsCard.operator}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">উপজেলা ও অঞ্চল:</span>
                <span className="font-bold text-stone-900">{receivedSmsCard.upazila}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">গেটওয়ে ট্রানজ্যাকশন আইডি:</span>
                <span className="font-bold text-stone-900">{receivedSmsCard.token}</span>
              </div>
            </div>

            {/* SMS Body Bubble */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>প্রেরিত বার্তার বিবরণ (SMS Content):</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-700">{receivedSmsCard.timestamp}</span>
              </div>
              <p className="font-medium text-stone-800 leading-relaxed bg-white p-3 rounded-xl border border-emerald-200">
                "{receivedSmsCard.messageText}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200">
              <button
                onClick={() => handleVoiceBroadcastFor(activeRiskType)}
                className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>🔊 এই সতর্কবার্তা বাংলায় শুনুন</span>
              </button>

              <button
                onClick={() => setShowSmsConfirmationModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                ঠিক আছে (বন্ধ করুন) ✓
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. 72-HOUR AGRO-METEOROLOGICAL SATELLITE RADAR & CROP SHIELD */}
      <div className="rounded-3xl bg-linear-to-br from-slate-900 via-stone-900 to-[#0A2F18] text-white p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">
                  ৭২ ঘণ্টার স্যাটেলাইট আবহাওয়া রাডার ও এআই শস্য সুরক্ষা সিমিউলেটর
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Doppler Radar Telemetry
                </span>
              </div>
              <p className="text-xs text-stone-400">
                জামালপুর জেলা ও ব্রহ্মপুত্র অববাহিকার ৫টি প্রধান উপজেলার প্রেডিক্টিভ ক্লাউড রিফ্লেক্টিভিটি ও ড্রেনেজ লোড
              </p>
            </div>
          </div>

          <button
            onClick={handleActivate72HourCropShield}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer ${
              shieldActive
                ? "bg-emerald-500 text-stone-950 ring-2 ring-emerald-300"
                : "bg-[#FBBF24] hover:bg-amber-400 text-stone-950"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{shieldActive ? "✓ শস্য সুরক্ষা প্রটোকল সক্রিয় রয়েছে" : "জরুরি কৃষি আপদকালীন প্রটোকল সক্রিয় করুন"}</span>
          </button>
        </div>

        {/* 72-Hour Predictive Timeline Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-300 font-bold flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>পূর্বাভাস সময়কাল নির্বাচন করুন: <strong>+{radarTimelineHour} ঘণ্টা পরবর্তী পরিস্থিতি</strong></span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {radarTimelineHour === 0 ? "বর্তমান লাইভ" : `পূর্বাভাস: +${radarTimelineHour}h Lead`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[0, 12, 24, 48, 72].map((hour) => (
              <button
                key={hour}
                onClick={() => setRadarTimelineHour(hour)}
                className={`py-2 px-1 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  radarTimelineHour === hour
                    ? "bg-emerald-500 text-stone-950 shadow-md font-black"
                    : "bg-white/10 hover:bg-white/15 text-stone-300"
                }`}
              >
                {hour === 0 ? "বর্তমান (০h)" : `+${hour} ঘণ্টা`}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Upazila Satellite Radar Grid Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {UPAZILAS.map((upz, idx) => {
            const rainMm = radarTimelineHour > 12 ? (idx === 2 ? 125 : idx === 4 ? 130 : 110) : (idx === 2 ? 45 : 35);
            const risk = radarTimelineHour > 12 ? (idx === 2 || idx === 4 ? "চরম" : "উচ্চ") : "মাঝারি";
            const isSelected = selectedZone === upz.key;
            return (
              <div 
                key={upz.key} 
                onClick={() => toggleUpazilaSelection(upz.key)}
                className={`p-3 rounded-2xl text-center space-y-1 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-emerald-950/80 border-2 border-emerald-400 shadow-lg"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="font-bold text-stone-200 block truncate">{upz.nameBn}</span>
                <span className="text-base font-black font-mono text-[#FBBF24] block">
                  {rainMm} <span className="text-[10px] font-normal">মিমি</span>
                </span>
                <span className="text-[10px] font-bold block text-red-400">
                  ঝুঁকি: {risk}
                </span>
              </div>
            );
          })}
        </div>

        {/* Protection Impact Certificate */}
        {shieldActive && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>৭২ ঘণ্টার কৃষি আপদকালীন প্রটোকল সফলভাবে বাস্তবায়িত হয়েছে:</span>
              </span>
              <span className="font-mono text-amber-300 text-sm font-black">
                আনুমানিক শস্য ক্ষতি রোধ: ৳{protectedValueSaved.toLocaleString()}
              </span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              • {currentUpazilaMeta.nameBn} ইউনিয়নের অগ্রণী খামারিদের মোবাইল নম্বরে ({customPhoneNumber}) স্বয়ংক্রিয় এসএমএস পাঠানো হয়েছে।<br />
              • বেলটিয়া সেন্ট্রাল কোল্ড স্টোরেজে ৫০০ বস্তা ফসল নিরাপদ হোল্ডিংয়ে রিজার্ভেশন লক করা হয়েছে।<br />
              • বাংলা ভয়েস ব্রডকাস্টের মাধ্যমে কৃষকদের দ্রুত ফসল কাটার পরামর্শ প্রদান করা হয়েছে।
            </p>
          </div>
        )}
      </div>

      {/* 6. Agronomist Emergency Action Playbook */}
      <div className="rounded-3xl bg-linear-to-br from-stone-50 via-white to-red-50/30 border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>উপজেলা কৃষি কর্মকর্তা ও আবহাওয়াবিদ কর্তৃক জরুরি পদক্ষেপ নির্দেশিকা ({currentUpazilaMeta.nameBn}):</span>
          </div>
          <span className="text-xs font-mono text-stone-500 font-bold">
            জরুরি হেল্পলাইন: ১৬১২৩
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentRisk.emergencyActionPlaybook.map((step, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-stone-800">
                  পদক্ষেপ #{idx + 1}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {step}
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-1 text-[11px] text-red-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ফসল সুরক্ষা অনুঘটক</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
