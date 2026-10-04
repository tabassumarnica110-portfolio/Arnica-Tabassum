import React, { useState } from "react";
import { ProductCategory } from "../../types";
import { Sprout, Wheat, Flame } from "lucide-react";

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: ProductCategory | string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = "ALU",
  className = "w-full h-full object-cover",
}) => {
  const [hasError, setHasError] = useState(false);

  // Category fallback visual details
  const getCategoryDetails = () => {
    switch (category) {
      case "DHAN":
        return {
          bg: "from-amber-100 to-amber-200",
          textColor: "text-amber-900",
          icon: "🌾",
          label: "ধান ও চাল (Paddy/Rice)",
        };
      case "ALU":
        return {
          bg: "from-amber-50 to-stone-200",
          textColor: "text-amber-950",
          icon: "🥔",
          label: "ডায়মন্ড আলু (Potato)",
        };
      case "MORICH":
        return {
          bg: "from-red-100 to-rose-200",
          textColor: "text-rose-950",
          icon: "🌶️",
          label: "দেশি শুকনা মরিচ (Chili)",
        };
      case "BEGUN":
        return {
          bg: "from-purple-100 to-indigo-200",
          textColor: "text-purple-950",
          icon: "🍆",
          label: "গোল বেগুন (Brinjal)",
        };
      case "POTOL":
        return {
          bg: "from-emerald-100 to-green-200",
          textColor: "text-emerald-950",
          icon: "🥒",
          label: "কচি পটল (Pointed Gourd)",
        };
      case "PEYAJ":
        return {
          bg: "from-rose-100 to-amber-100",
          textColor: "text-rose-950",
          icon: "🧅",
          label: "তাহেরপুরী পেঁয়াজ (Onion)",
        };
      default:
        return {
          bg: "from-emerald-50 to-stone-100",
          textColor: "text-emerald-950",
          icon: "🌱",
          label: "কৃষি পণ্য (Agri Produce)",
        };
    }
  };

  const details = getCategoryDetails();

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-linear-to-br ${details.bg} ${details.textColor} p-4 text-center select-none`}
      >
        <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs">{details.icon}</span>
        <span className="text-xs font-bold opacity-80">{alt}</span>
        <span className="text-[10px] font-mono opacity-60 mt-0.5">{details.label}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};
