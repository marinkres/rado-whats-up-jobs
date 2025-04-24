import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { ChevronRight, Mail, MoveRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

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
              Iskoristite snagu WhatsApp-a za povezivanje s idealnim kandidatima brže i učinkovitije nego ikad prije.
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
        
        {/* Testimonial Section - Updated with complete content and colored text */}
        <motion.div 
          className="mt-20 py-16 px-4 md:px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              "Naš tim radi <span className="text-[#43AA8B]">brže i pametnije</span> a kandidatima pruža iskustvo koje se pamti."
            </h2>
            
            <div className="text-center mb-12">
              <p className="text-lg text-gray-300">
                Pomažemo poslodavcima da popune pozicije bez napora, za manje od 5 dana
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
                  <span className="text-purple-500 ml-1 text-2xl">brže</span>
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
        
        {/* Features Section - Updated with Timeline Style */}
        <div className="mt-20 md:mt-32 max-w-5xl mx-auto px-4 md:px-0">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gray-100">Kako naši korisnici zapošljavaju </span>
              <span className="text-[#43AA8B] font-bold">5x brže</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Naši klijenti zapošljavaju kandidate unutar 5 dana rada s nama. Evo kako...
            </p>
          </motion.div>

          {/* Timeline feature cards */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 transform md:translate-x-[-50%] top-0 bottom-0 w-0.5 bg-[#43AA8B]"></div>
            
            {/* Step 1 */}
            <TimelineCard 
              number="1"
              title="Prijave putem WhatsApp i iMessage-a"
              description="Bez životopisa, bez motivacijskih pisama, kandidati se mogu prijaviti za 2 minute na platformama koje svakodnevno koriste."
              alignment="right"
              delay={0}
              buttonText="Isprobajte sada (~50 sekundi)"
              animation="chat"
            />

            {/* Step 2 */}
            <TimelineCard 
              number="2"
              title="Automatska predkvalifikacija"
              description="Primajte samo kvalificirane kandidate, pustite da naš softver obavi težak posao - nema više čitanja životopisa!"
              alignment="left"
              delay={0.2}
              buttonText="Zatražite ponudu"
              animation="filter"
            />

            {/* Step 3 - Updated from the image */}
            <TimelineCard 
              number="3"
              title="Komunikacija izravno u chatu"
              description="Skratite vrijeme potrebno za zapošljavanje i razgovarajte izravno s kandidatima. Nema više čekanja na e-mail."
              alignment="right"
              delay={0.4}
              animation="messages"
            />

            {/* Step 4 - Added from the image */}
            <TimelineCard 
              number="4"
              title="Do intervjua jednim klikom"
              description="Kandidati mogu rezervirati svoje najbolje vrijeme jednim klikom na svoj chat, sinkroniziranim izravno u vaš kalendar."
              alignment="left"
              delay={0.6}
              animation="calendar"
            />
          </div>
        </div>
        
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

// Timeline Card Component - Improved for better appearance and animations
const TimelineCard = ({ number, title, description, alignment, delay = 0, buttonText = undefined, animation }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      controls.start({ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.7, delay }
      });
    }
  }, [controls, inView, delay]);

  // Animation components with improved sizing
  const AnimationComponent = () => {
    switch(animation) {
      case 'chat':
        // Custom WhatsApp animation for first step (replacing static image)
        return (
          <div className="w-full h-full bg-gray-800 rounded-xl flex justify-center items-center overflow-hidden">
            <div className="w-full max-w-[280px] p-4">
              <div className="relative bg-[#075e54] w-full h-10 flex items-center px-3 rounded-t-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                  <div className="text-white text-sm font-medium">WhatsApp</div>
                </div>
              </div>
              
              <div className="bg-[#ece5dd] h-[180px] px-3 py-2 flex flex-col justify-between">
                <div className="space-y-2 overflow-hidden">
                  <motion.div 
                    className="bg-white rounded-lg p-2 text-sm ml-auto max-w-[70%] relative"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-gray-800 text-xs">Je li još otvoren oglas za posao?</div>
                    <div className="text-[10px] text-gray-500 text-right">12:01</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-[#dcf8c6] rounded-lg p-2 text-sm mr-auto max-w-[70%] relative"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <div className="text-gray-800 text-xs">Da, pošaljite nam svoju prijavu!</div>
                    <div className="text-[10px] text-gray-500 text-right">12:02</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white rounded-lg p-2 text-sm ml-auto max-w-[70%] relative"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
                    <div className="text-gray-800 text-xs">Odlično! Kako se mogu prijaviti?</div>
                    <div className="text-[10px] text-gray-500 text-right">12:03</div>
                  </motion.div>
                </div>
                
                <div className="flex items-center bg-white rounded-full px-3 py-1.5 mt-2">
                  <div className="text-gray-400 text-xs flex-1">Odgovorite ovdje...</div>
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-[#43AA8B] flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'filter':
        // Improved filter animation that fits properly within container
        return (
          <div className="w-full h-full bg-gray-800 rounded-xl p-4 flex justify-center items-center overflow-hidden">
            <div className="flex flex-col items-center w-full max-w-[250px]">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-sm text-white font-medium">Kandidati</div>
                <div className="text-xs text-gray-400">24 rezultata</div>
              </div>
              
              <div className="bg-gray-700/50 w-full rounded-lg p-3 mb-3">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded bg-[#43AA8B] mr-2"></div>
                  <div className="text-xs text-white">Kriteriji</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      className="bg-[#43AA8B]/20 text-[#43AA8B] py-1 px-2 rounded text-[10px] text-center"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5,
                        delay: i * 0.3
                      }}
                    >
                      {i === 1 ? "Iskustvo" : i === 2 ? "Lokacija" : "Jezik"}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i} 
                    className={`p-3 rounded-lg ${i <= 2 ? "bg-[#43AA8B]/20 border border-[#43AA8B]/30" : "bg-gray-700/50"}`}
                    animate={{ 
                      y: i <= 2 ? [0, -4, 0] : 0
                    }}
                    transition={{ 
                      repeat: i <= 2 ? Infinity : 0, 
                      duration: 2,
                      delay: i * 0.2
                    }}
                  >
                    <div className="w-8 h-8 bg-gray-600 rounded-full mb-2"></div>
                    <div className="h-2 bg-gray-600 rounded w-full mb-1"></div>
                    <div className="h-2 bg-gray-600 rounded w-2/3"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'messages':
        // Better chat animation with proper sizing
        return (
          <div className="w-full h-full bg-gray-800 rounded-xl p-4 flex justify-center items-center overflow-hidden">
            <div className="w-full max-w-[250px]">
              <div className="bg-gray-700 rounded-t-lg p-3">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#43AA8B] rounded-full mr-2 flex items-center justify-center text-white font-medium text-sm">JD</div>
                  <div>
                    <div className="text-xs font-medium text-white">Josip Došen</div>
                    <div className="text-[10px] text-gray-300">online</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-3 h-[160px] flex flex-col justify-end">
                <div className="space-y-3">
                  <motion.div 
                    className="bg-gray-700 text-white rounded-lg p-2 text-xs mr-auto max-w-[70%]"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xs">Poštovani, kada možete doći na intervju?</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-[#43AA8B] text-white rounded-lg p-2 text-xs ml-auto max-w-[70%]"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <p className="text-xs">Mogu doći sutra u 14:00h ako vam odgovara.</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gray-700 text-white rounded-lg p-2 text-xs mr-auto max-w-[70%]"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                  >
                    <p className="text-xs">Odlično, vidimo se sutra u 14h!</p>
                  </motion.div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-b-lg p-2 flex items-center">
                <div className="bg-gray-600 rounded-full flex-1 h-6 px-2 mr-2"></div>
                <motion.div 
                  className="w-6 h-6 rounded-full bg-[#43AA8B] flex items-center justify-center"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        // Better calendar animation that fits within container
        return (
          <div className="w-full h-full bg-gray-800 rounded-xl p-4 flex justify-center items-center overflow-hidden">
            <div className="w-full max-w-[270px] bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-[#43AA8B] p-3 text-center">
                <div className="text-white font-medium text-sm">Svibanj 2024</div>
              </div>
              
              <div className="p-3">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["P", "U", "S", "Č", "P", "S", "N"].map((day, i) => (
                    <div key={i} className="text-gray-400 text-xs">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === 15;
                    const isAvailable = [10, 12, 15, 18, 20, 22].includes(day);
                    
                    return (
                      <motion.div 
                        key={i}
                        className={`text-center p-1 text-xs rounded-full ${
                          isSelected 
                            ? "bg-[#43AA8B] text-white" 
                            : isAvailable 
                              ? "text-[#43AA8B]" 
                              : "text-gray-500"
                        }`}
                        animate={
                          isSelected 
                            ? { scale: [1, 1.2, 1] } 
                            : isAvailable 
                              ? { opacity: [0.7, 1, 0.7] } 
                              : {}
                        }
                        transition={{ 
                          repeat: Infinity, 
                          duration: isSelected ? 2 : 3
                        }}
                      >
                        {day}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-3 border-t border-gray-700">
                <div className="text-xs text-white mb-2">Dostupni termini - 15. Svibanj</div>
                <div className="grid grid-cols-3 gap-2">
                  {["09:00", "13:30", "16:00"].map((time, i) => (
                    <motion.div 
                      key={i}
                      className={`text-center py-1 rounded ${i === 1 ? "bg-[#43AA8B] text-white" : "bg-gray-700 text-gray-300"}`}
                      animate={i === 1 ? { y: [0, -2, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="text-xs">{time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-[#43AA8B] text-lg font-bold mb-2">{title}</div>
              <p className="text-gray-400 text-sm">Feature visualization</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={ref} className="relative mb-16 md:mb-24">
      {/* Vertical timeline line - positioned behind circles */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#43AA8B]/30" style={{ transform: 'translateX(-50%)' }}></div>
      
      {/* Circle marker on timeline - now with border to appear over line */}
      <div className="absolute left-8 md:left-1/2 transform translate-x-[-50%] w-16 h-16 bg-[#43AA8B] rounded-full flex items-center justify-center text-2xl font-bold border-4 border-black dark:border-gray-900 z-10">
        {number}
      </div>
      
      {/* Content card - adjusted for better mobile display */}
      <motion.div 
        className={`flex flex-col ${alignment === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-4 md:gap-6 lg:gap-12`}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
      >
        {/* Text content - better spacing for mobile */}
        <div className={`ml-16 md:ml-0 mt-6 md:mt-0 md:w-1/2 ${alignment === 'left' ? 'md:pl-12' : 'md:pr-12'} text-left`}>
          <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4 text-white">
            {title}
          </h3>
          <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
            {description}
          </p>
          {buttonText && (
            <Button
              className="bg-[#43AA8B] hover:bg-[#43AA8B]/80 text-white rounded-full text-sm md:text-base"
            >
              {buttonText}
            </Button>
          )}
        </div>

        {/* Animation/Image section - fixed height and contained animations */}
        <div className="w-full md:w-1/2 p-3 md:p-4">
          <div className="bg-gray-800/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl h-[220px] md:h-[250px]">
            <AnimationComponent />
          </div>
        </div>
      </motion.div>
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
