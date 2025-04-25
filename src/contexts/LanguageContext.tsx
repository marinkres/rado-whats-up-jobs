import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'hr' | 'en';

export interface TranslationContent {
  // Navigation
  home: string;
  integrations: string;
  pricing: string;
  login: string;
  requestDemo: string;
  
  // Hero section
  revolutionIn: string;
  recruitment: string;
  heroDescription: string;
  
  // Testimonial section
  testimonialTitle: string;
  testimonialDescription: string;
  candidateSatisfaction: string;
  moreApplications: string;
  faster: string;
  fasterJobs: string;
  timesSaved: string;
  
  // How it works section
  howItWorksTitle: string;
  howItWorksDescription: string;
  
  // Timeline steps
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  step4Title: string;
  step4Description: string;
  
  // Dashboard section
  dashboardTitle1: string;
  dashboardTitle2: string;
  dashboardDescription: string;
  
  // Footer
  mainLinks: string;
  other: string;
  useful: string;
  help: string;
  careers: string;
  privacyPolicy: string;
  termsOfUse: string;
  changelog: string;
  support: string;
  allRightsReserved: string;

  // Pricing page
  pricingTitle: string;
  pricingSubtitle: string;
  monthly: string;
  annual: string;
  yearlyDiscount: string;
  startFreeTrial: string;
  requestQuote: string;
  compareFeatures: string;
  features: string;
  activeJobOpenings: string;
  monthlyApplications: string;
  unlimited: string;
  basic: string;
  advanced: string;
  custom: string;
  frequently_asked_questions: string;
}

export const translations: Record<Language, TranslationContent> = {
  hr: {
    // Navigation
    home: 'Početna',
    integrations: 'Integracije',
    pricing: 'Cijene',
    login: 'Prijava',
    requestDemo: 'Zatraži Demo',
    
    // Hero section
    revolutionIn: 'Revolucija u',
    recruitment: 'zapošljavanju',
    heroDescription: 'Iskoristite snagu WhatsApp-a za povezivanje s idealnim kandidatima brže i učinkovitije nego ikad prije.',
    
    // Testimonial section
    testimonialTitle: '"Naš tim radi brže i pametnije a kandidatima pruža iskustvo koje se pamti."',
    testimonialDescription: 'Pomažemo poslodavcima da popune pozicije bez napora, za manje od 5 dana',
    candidateSatisfaction: 'Zadovoljstvo kandidata',
    moreApplications: 'Više prijava',
    faster: 'brže',
    fasterJobs: 'Od prijave do posla',
    timesSaved: 'Ušteđeno u 90 dana',
    
    // How it works section
    howItWorksTitle: 'Kako naši korisnici zapošljavaju 5x brže',
    howItWorksDescription: 'Naši klijenti zapošljavaju kandidate unutar 5 dana rada s nama. Evo kako...',
    
    // Timeline steps
    step1Title: 'Prijave putem WhatsApp-a',
    step1Description: 'Automatizirano bez životopisa, bez motivacijskih pisama, kandidati se mogu prijaviti za 2 minute na platformama koje svakodnevno koriste.',
    step2Title: 'Automatska predkvalifikacija',
    step2Description: 'Primajte samo kvalificirane kandidate, pustite da naš softver obavi težak posao - nema više čitanja životopisa!',
    step3Title: 'Komunikacija izravno u chatu',
    step3Description: 'Skratite vrijeme potrebno za zapošljavanje i razgovarajte izravno s kandidatima. Nema više čekanja na e-mail.',
    step4Title: 'Do intervjua jednim klikom',
    step4Description: 'Kandidati mogu rezervirati svoje najbolje vrijeme jednim klikom na svoj chat, sinkroniziranim izravno u vaš kalendar.',
    
    // Dashboard section
    dashboardTitle1: 'Moćan i jednostavan',
    dashboardTitle2: 'dashboard',
    dashboardDescription: 'Pratite sve svoje oglase i prijave na jednom mjestu uz naše intuitivno sučelje',
    
    // Footer
    mainLinks: 'Glavno',
    other: 'Ostalo',
    useful: 'Korisno',
    help: 'Pomoć',
    careers: 'Karijere',
    privacyPolicy: 'Politika privatnosti',
    termsOfUse: 'Uvjeti korištenja',
    changelog: 'Dnevnik promjena',
    support: 'Podrška',
    allRightsReserved: 'Sva prava pridržana',

    // Pricing page
    pricingTitle: 'Jednostavno i transparentno određivanje cijena',
    pricingSubtitle: 'Odaberite plan koji odgovara vašim potrebama. Svi planovi dolaze s besplatnim probnim razdobljem bez kreditne kartice.',
    monthly: 'Mjesečno',
    annual: 'Godišnje',
    yearlyDiscount: '-20%',
    startFreeTrial: 'Započni besplatnu probu',
    requestQuote: 'Zatražite ponudu',
    compareFeatures: 'Usporedite značajke',
    features: 'Značajke',
    activeJobOpenings: 'Aktivna zapošljavanja',
    monthlyApplications: 'Mjesečne prijave',
    unlimited: 'Neograničeno',
    basic: 'Osnovna',
    advanced: 'Napredna',
    custom: 'Prilagođena',
    frequently_asked_questions: 'Često postavljana pitanja',
  },
  en: {
    // Navigation
    home: 'Home',
    integrations: 'Integrations',
    pricing: 'Pricing',
    login: 'Login',
    requestDemo: 'Request Demo',
    
    // Hero section
    revolutionIn: 'Revolution in',
    recruitment: 'recruitment',
    heroDescription: 'Harness the power of WhatsApp to connect with ideal candidates faster and more effectively than ever before.',
    
    // Testimonial section
    testimonialTitle: '"Our team works faster and smarter while providing candidates with a memorable experience."',
    testimonialDescription: 'We help employers fill positions effortlessly in less than 5 days',
    candidateSatisfaction: 'Candidate Satisfaction',
    moreApplications: 'More applicants',
    faster: 'faster',
    fasterJobs: 'Time-to-hire',
    timesSaved: 'Saved in 90 days',
    
    // How it works section
    howItWorksTitle: 'How our users hire 5x faster',
    howItWorksDescription: 'Our clients hire candidates within 5 days of working with us. Here\'s how...',
    
    // Timeline steps
    step1Title: 'Apply via WhatsApp',
    step1Description: 'Automated with no resumes, no cover letters, candidates can apply in 2 minutes on platforms they use daily.',
    step2Title: 'Automatic Pre-qualification',
    step2Description: 'Receive only qualified candidates, let our software do the heavy lifting - no more resume reading!',
    step3Title: 'Direct Chat Communication',
    step3Description: 'Shorten the recruitment time and chat directly with candidates. No more waiting for emails.',
    step4Title: 'One-Click Interviews',
    step4Description: 'Candidates can book their preferred time with one click in their chat, synced directly to your calendar.',
    
    // Dashboard section
    dashboardTitle1: 'Powerful and simple',
    dashboardTitle2: 'dashboard',
    dashboardDescription: 'Track all your job postings and applications in one place with our intuitive interface',
    
    // Footer
    mainLinks: 'Main',
    other: 'Other',
    useful: 'Useful',
    help: 'Help',
    careers: 'Careers',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    changelog: 'Changelog',
    support: 'Support',
    allRightsReserved: 'All rights reserved',

    // Pricing page
    pricingTitle: 'Simple & transparent pricing',
    pricingSubtitle: 'Choose a plan that fits your needs. All plans come with a free trial period, no credit card required.',
    monthly: 'Monthly',
    annual: 'Annual',
    yearlyDiscount: '-20%',
    startFreeTrial: 'Start free trial',
    requestQuote: 'Request a quote',
    compareFeatures: 'Compare features',
    features: 'Features',
    activeJobOpenings: 'Active job openings',
    monthlyApplications: 'Monthly applications',
    unlimited: 'Unlimited',
    basic: 'Basic',
    advanced: 'Advanced',
    custom: 'Custom',
    frequently_asked_questions: 'Frequently Asked Questions',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationContent) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hr',
  setLanguage: () => {},
  t: (key) => key as string,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('hr');

  const t = (key: keyof TranslationContent): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
