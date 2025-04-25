import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll } from "framer-motion";
import { LanguageSwitch } from "./LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavBarProps {
  activePage?: 'home' | 'pricing' | 'careers';
}

export const NavBar = ({ activePage = 'home' }: NavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { t } = useLanguage();
  
  // Track scroll position to determine when to show floating navbar
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setIsScrolled(y > 100);
    });
    
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <>
      {/* Floating navbar that appears when scrolled */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 pointer-events-none"
        animate={{
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : -20,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="max-w-6xl mx-auto">
  {/* Mobile: ONLY logo + login */}
  <div className="flex justify-between items-center bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-6 py-3 shadow-lg pointer-events-auto flex md:hidden">
    <Link to="/" className="flex items-center">
      <img src="/radow.svg" alt="Rado Logo" className="h-8" />
    </Link>
    <Button 
      asChild
      size="sm"
      variant="outline" 
      className="border border-white/20 text-white bg-white/5 hover:bg-white/10"
    >
      <Link to="https://dashboard.radojobs.eu/login">
        <span>{t('login')}</span>
      </Link>
    </Button>
  </div>
  {/* Desktop: full nav */}
  <div className="hidden md:flex justify-between items-center bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-6 py-3 shadow-lg pointer-events-auto">
    <Link to="/" className="flex items-center">
      <img src="/radow.svg" alt="Rado Logo" className="h-8" />
    </Link>
    <div className="flex items-center space-x-6 ml-10 mr-auto">
      <Link 
        to="/" 
        className={`${activePage === 'home' ? 'text-white font-medium' : 'text-gray-300'} hover:text-[#43AA8B] transition-colors`}
      >
        {t('home')}
      </Link>
      <Link 
        to="/careers" 
        className={`${activePage === 'careers' ? 'text-white font-medium' : 'text-gray-300'} hover:text-[#43AA8B] transition-colors`}
      >
        {t('careers')}
      </Link>
      <Link 
        to="/pricing" 
        className={`${activePage === 'pricing' ? 'text-white font-medium' : 'text-gray-300'} hover:text-[#43AA8B] transition-colors`}
      >
        {t('pricing')}
      </Link>
    </div>
    <div className="flex items-center gap-4">
      <LanguageSwitch />
      <Button 
        asChild
        size="sm"
        variant="outline" 
        className="border border-white/20 text-white bg-white/5 hover:bg-white/10"
      >
        <Link to="https://dashboard.radojobs.eu/login">
          <span>{t('login')}</span>
        </Link>
      </Button>
      <Button 
        asChild
        size="sm"
        className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
      >
        <Link to="https://cal.com/marindev-asjghd/30min" target="_blank">
          <span>{t('requestDemo')}</span>
        </Link>
      </Button>
    </div>
  </div>
</div>
      </motion.div>
      
      {/* Static header */}
      <header className="flex justify-between items-center mb-12 md:mb-20">
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/radow.svg" alt="Rado Logo" className="h-10 md:h-12" />
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-6 ml-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link 
              to="/" 
              className={`${activePage === 'home' ? 'text-white font-medium' : 'text-gray-300'} hover:text-[#43AA8B] transition-colors`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/careers" 
              className={`${activePage === 'careers' ? 'text-white font-medium' : 'text-gray-300'} hover:text-[#43AA8B] transition-colors`}
            >
              {t('careers')}
            </Link>
            <Link 
              to="/pricing" 
              className={`${activePage === 'pricing' ? 'text-white font-medium' : 'text-gray-300'} hover:text-[#43AA8B] transition-colors`}
            >
              {t('pricing')}
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LanguageSwitch />
          
          <Button 
            asChild
            variant="outline" 
            className="border border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10"
          >
            <Link to="https://dashboard.radojobs.eu/login">
              <span>{t('login')}</span>
            </Link>
          </Button>
          
          <Button 
            asChild
            className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white hidden md:inline-flex"
          >
            <Link to="https://cal.com/marindev-asjghd/30min" target="_blank">
              <span>{t('requestDemo')}</span>
            </Link>
          </Button>
        </motion.div>
      </header>
    </>
  );
};

export default NavBar;
