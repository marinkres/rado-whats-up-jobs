import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/marketing/NavBar";
import Footer from "@/components/marketing/Footer";

// FAQ Accordion Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button 
        className="flex justify-between items-center w-full py-5 text-left" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mb-5' : 'max-h-0'}`}
      >
        <p className="text-gray-300 pb-5">{answer}</p>
      </div>
    </div>
  );
};

// Feature check item component
const FeatureItem = ({ included, text }) => (
  <div className="flex items-center py-3">
    {included ? (
      <Check className="h-5 w-5 text-[#43AA8B] mr-3 flex-shrink-0" />
    ) : (
      <X className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
    )}
    <span className={included ? "text-gray-200" : "text-gray-500"}>{text}</span>
  </div>
);

// Main Content Component
const CareersContent = () => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#43AA8B]/70 to-purple-700/20 blur-[80px] opacity-70" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-blue-800/20 to-[#43AA8B]/40 blur-[100px] opacity-50" />
      </div>
      {/* Grid pattern effect */}
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M99,0 L99,100 L0,100' fill='none' stroke='%23333' stroke-width='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
          opacity: 0.15
        }}
      />
      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <NavBar activePage="careers" />
        <div className="flex flex-col items-center mt-10 mb-24">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-8">
  {language === 'hr' ? 'Radite u Rado' : 'Work At Rado'}
</h1>
          <div className="w-full max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500 text-xs">●</span>
              <span className="text-gray-400 font-medium text-sm">{language === 'hr' ? 'Karijere' : 'Careers'}</span>
              <span className="flex-1 border-t border-gray-600 ml-4"></span>
            </div>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
  {language === 'hr' ? 'Zapošljavamo! Pridruži nam se i budi dio našeg early tima u Rado.' : "We're hiring! join us—and be part of our early team at Rado."}
</p>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-8">
              <button className="px-4 py-1 rounded-full text-sm font-medium bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43AA8B]">
  {language === 'hr' ? 'Prikaži sve' : 'Show all'} <span className="ml-1 text-gray-400">1</span>
</button>
<button className="px-4 py-1 rounded-full text-sm font-medium bg-white text-black shadow focus:outline-none">
  {language === 'hr' ? 'Operacije' : 'Operations'}
</button>
<button className="px-4 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
  {language === 'hr' ? 'Inženjering' : 'Engineering'}
</button>
<button className="px-4 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
  {language === 'hr' ? 'Biznis' : 'Business'}
</button>
            </div>
            {/* Job Cards */}
            <div className="flex flex-col gap-8">
              
              {/* Card 2 */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 shadow-md">
  <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
    <img src="https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Job" className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover bg-gray-200 mb-3 sm:mb-0" />
  </div>
  <div className="flex-1 flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
    <div className="font-semibold text-lg sm:text-base text-white">{language === 'hr' ? 'Tester (m/ž) - Hrvatska' : 'Tester (m/f) - Croatia'}</div>
    <div className="text-gray-400 text-base sm:text-sm mb-1">{language === 'hr' ? 'Remote' : 'Remote'}</div>
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-gray-400 mt-2">
      <span>{language === 'hr' ? 'Puno radno vrijeme' : 'Full-time'}</span>
      <span>Zagreb</span>
    </div>
  </div>
  <div className="flex flex-col items-center sm:items-end justify-between min-w-[110px] w-full sm:w-auto mt-4 sm:mt-0">
    <span className="text-gray-400 text-xs mb-2 md:mb-4">{language === 'hr' ? 'prije 8 dana' : '8 days ago'}</span>
    <a
  href="https://t.me/RadoJobsBot?start=5328dea9-a66c-4093-a91e-126112368feb"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1d8cc3] text-white rounded-full py-2 px-7 text-base font-semibold transition w-full sm:w-auto"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M22 2L2 12.5l5.5 2.1L20 6.1l-9.1 9.1v4.7l3.3-3.3 4.6 1.8c.4.2.8.3 1.2.3.6 0 1.1-.3 1.3-.9L24 3.2C24 2.5 23.1 1.9 22 2z"/>
  </svg>
  {language === 'hr' ? 'Telegram prijava' : 'Telegram Apply'}
</a>
  </div>
</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

// Main component that wraps everything with the language provider
const Careers = () => {
  return (
    <LanguageProvider>
      <CareersContent />
    </LanguageProvider>
  );
};

export default Careers;
