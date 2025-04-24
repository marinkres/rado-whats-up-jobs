import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Mail, MoveRight } from "lucide-react";

const ComingSoon = () => {
  const [mounted, setMounted] = useState(false);

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
        {/* Header */}
        <header className="flex justify-between items-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/radow.svg" alt="Rado Logo" className="h-10 md:h-12" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button 
              asChild
              variant="outline" 
              className="border border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10"
            >
              <Link to="/login">
                <span>Prijava</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </header>
        
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 py-10">
          {/* Left column: Text content */}
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block">Revolucija u</span>
              <span className="bg-gradient-to-r from-[#43AA8B] via-teal-400 to-emerald-400 text-transparent bg-clip-text">
                zapošljavanju
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg">
            Upotrijebite snagu WhatsApp-a za povezivanje sa idealnim kandidatima brže i učinkovitije nego ikad prije.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white rounded-full px-8 text-lg font-medium"
              >
                <Link to="/signup">
                  Registracija
                  <MoveRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right column: Mockup image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing circle behind */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-[#43AA8B]/20 blur-[60px]" />
            
            {/* Mockup image with local fallback */}
            <div className="relative z-10 w-full max-w-lg mx-auto">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Using the mockup.png image from public folder */}
                <img 
                  src="/mockup1.png" 
                  alt="Rado Platform" 
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback in case image fails to load
                    e.currentTarget.style.display = 'none';
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full aspect-[3/2] bg-gray-800 flex items-center justify-center p-4 text-center';
                      fallback.innerHTML = `
                        <div>
                          <div class="text-[#43AA8B] text-xl font-bold mb-2">Rado Platform</div>
                          <p class="text-gray-400">AI-powered recruitment solution</p>
                        </div>
                      `;
                      container.appendChild(fallback);
                    }
                  }}
                />
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-black/90 backdrop-blur-sm border border-white/10 p-4 rounded-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#43AA8B]/30 flex items-center justify-center">
                    <CheckIcon className="h-4 w-4 text-[#43AA8B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI matchmaking</p>
                    <p className="text-xs text-gray-400">Pametno spajanje</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-black/90 backdrop-blur-sm border border-white/10 p-4 rounded-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <SparkleIcon className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Brze prijave</p>
                    <p className="text-xs text-gray-400">Automatizacija procesa</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Testimonial Section - New Addition */}
        <motion.div 
          className="mt-20 py-16 px-4 md:px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              "Naš tim radi<span className="text-blue-500 font-bold"> brže i pametnije</span> a kandidatima pruža iskustvo koje se pamti."
            </h2>
            
            <div className="text-center mb-12">
              <p className="text-lg text-gray-300">
              Pomažemo poslodavcima da popune pozicije bez napora, za manje od<span className="font-semibold"> 5 dana</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold">
                  <span className="text-[#43AA8B]">98</span>
                  <span className="text-[#43AA8B]">%</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Zadovoljstvo kandidata</p>
              </div>
              
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold">
                  <span className="text-blue-500">77</span>
                  <span className="text-blue-500">%</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Više prijava</p>
              </div>
              
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold">
                  <span className="text-purple-500">5</span>
                  <span className="text-purple-500">x</span>
                  <span className="text-purple-500 ml-2 text-2xl">brže</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Od prijave do posla</p>
              </div>
              
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gray-100">520h</p>
                <p className="text-sm text-gray-400 mt-2">Ušteđeno u 90 dana</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Features Section */}
        <motion.div 
          className="mt-20 md:mt-32 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-16 max-w-2xl mx-auto">
            Kako naši korisnici zapošljavaju 5x brže
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<SearchIcon />}
              title="Komunikacija izravno u chatu"
              description="Skratite vrijeme potrebno za zapošljavanje i razgovarajte izravno s kandidatima. Nema više čekanja na e-mail."
            />
            <FeatureCard 
              icon={<WhatsAppIcon />}
              title="WhatsApp integracija"
              description="Nema životopisa, nema motivacijskih pisama, kandidati se mogu prijaviti za 2 minute na platformama koje svakodnevno koriste."
            />
            <FeatureCard 
              icon={<ChartIcon />}
              title="Do intervjua jednim klikom"
              description="Kandidati mogu rezervirati svoje najbolje vrijeme jednim klikom na svoj chat, sinkroniziranim izravno u vaš kalendar."
            />
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.footer 
          className="mt-24 py-8 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src="/radow.svg" alt="Rado Logo" className="h-8" />
            </div>
            
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Rado. Sva prava pridržana.
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-4">
              <SocialLink icon={<TwitterIcon />} href="#" />
              <SocialLink icon={<LinkedInIcon />} href="#" />
              <SocialLink icon={<FacebookIcon />} href="#" />
              <SocialLink icon={<InstagramIcon />} href="#" />
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

// Icon components
const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.67 5h5.33l-4.33 3.33L16 16l-4-3-4 3 1.33-4.67L5 8h5.33z"></path>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

// Social icons
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

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01-3.96-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.012 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

// Components
const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-2xl"
    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="h-12 w-12 rounded-full bg-[#43AA8B]/20 flex items-center justify-center mb-5 text-[#43AA8B]">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
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

export default ComingSoon;
