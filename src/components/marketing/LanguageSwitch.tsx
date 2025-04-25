import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm">
      <button
        onClick={() => setLanguage('hr')}
        className={`flex items-center px-2.5 py-1.5 text-xs transition-colors ${language === "hr" 
          ? "bg-[#43AA8B]/20 text-[#43AA8B] font-medium" 
          : "text-gray-400 hover:text-white"}`}
      >
        <img src="/Flag_of_Croatia.svg" alt="HR" className="mr-1 h-4 w-5 object-contain" />
        HR
      </button>
      <div className="h-3 w-px bg-white/10"></div>
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center px-2.5 py-1.5 text-xs transition-colors ${language === "en" 
          ? "bg-[#43AA8B]/20 text-[#43AA8B] font-medium" 
          : "text-gray-400 hover:text-white"}`}
      >
        <img src="/Flag_of_the_United_Kingdom.svg" alt="EN" className="mr-1 h-4 w-5 object-contain" />
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch;
