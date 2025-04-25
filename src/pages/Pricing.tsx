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
const PricingContent = () => {
  const [mounted, setMounted] = useState(false);
  const { t, language } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

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
        {/* Replace the header with NavBar component */}
        <NavBar activePage="pricing" />
        
        {/* Main pricing section */}
        <div className="mt-8 mb-20">
          {/* Pricing header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">
                {language === 'hr' ? 'Jednostavno i transparentno ' : 'Simple & transparent '}
              </span>
              <span className="bg-gradient-to-r from-[#43AA8B] via-teal-400 to-emerald-400 text-transparent bg-clip-text">
                {language === 'hr' ? 'određivanje cijena' : 'pricing'}
              </span>
            </h1>          
          </motion.div>
        </div>
        
        {/* CTA section */}
        <motion.div 
          className="my-24 bg-gradient-to-r from-[#43AA8B]/20 to-purple-900/20 border border-white/10 backdrop-blur-sm py-16 px-8 rounded-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'hr' ? 'Spremni za revoluciju u zapošljavanju?' : 'Ready for the recruitment revolution?'}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {language === 'hr' 
              ? 'Isprobajte Rado besplatno i otkrijte zašto nas vodeće tvrtke odabiru za svoje potrebe zapošljavanja.'
              : 'Try Rado for free and discover why leading companies choose us for their recruitment needs.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white px-8 py-6 rounded-full shadow-lg"
            >
              <Link to="https://cal.com/marindev-asjghd/30min" target="_blank">
                {language === 'hr' ? 'Zatraži demonstraciju' : 'Request a demo'}
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Replace the footer with Footer component */}
        <Footer />
      </div>
    </div>
  );
};

// Main component that wraps everything with the language provider
const Pricing = () => {
  return (
    <LanguageProvider>
      <PricingContent />
    </LanguageProvider>
  );
};

export default Pricing;
