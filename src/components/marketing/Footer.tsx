import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Social Icons
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const SocialLink = ({ icon, href }) => (
  <motion.a 
    href={href} 
    className="text-gray-400 hover:text-[#43AA8B] transition-colors"
    whileHover={{ scale: 1.1 }}
  >
    {icon}
  </motion.a>
);

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <motion.footer 
      className="mt-24 py-8 border-t border-white/10 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.7 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8 px-4">
        {/* Logo and Socials */}
        <div className="flex flex-col items-center md:items-start gap-4 md:w-1/4">
          <img src="/radow.svg" alt="Rado Logo" className="h-8 mb-2" />
          <div className="flex gap-4">
            <SocialLink icon={<TwitterIcon />} href="#" />
            <SocialLink icon={<LinkedInIcon />} href="#" />
          </div>
        </div>
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
          <div>
            <h4 className="font-semibold text-white mb-2">{t('mainLinks')}</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('home')}</Link></li>
              <li><Link to="https://dashboard.radojobs.eu/login" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('login')}</Link></li>
              <li><Link to="/integrations" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('integrations')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">{t('other')}</h4>
            <ul className="space-y-1">
              <li><Link to="/careers" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('careers')}</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('pricing')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">{t('useful')}</h4>
            <ul className="space-y-1">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link to="/terms-of-use" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('termsOfUse')}</Link></li>
              <li><Link to="/changelog" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('changelog')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">{t('help')}</h4>
            <ul className="space-y-1">
              <li><Link to="/support" className="text-gray-400 hover:text-[#43AA8B] transition-colors">{t('support')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-400">
        © {new Date().getFullYear()} Rado. {t('allRightsReserved')}
      </div>
    </motion.footer>
  );
};

export default Footer;
