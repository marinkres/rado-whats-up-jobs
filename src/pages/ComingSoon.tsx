import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useScroll } from "framer-motion";
import { ChevronRight, Mail, MoveRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

// Counter animation component for statistics
const AnimatedCounter = ({ value, suffix = "", className = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const end = parseInt(value.toString(), 10);
    
    // Make sure we don't exceed the end value
    if (start === end) return;
    
    // Calculate duration per increment
    const incrementTime = (duration * 1000) / end;
    
    // Timer to count up to the target value
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <div ref={ref} className={className}>
      <span>{count}</span>
      <span>{suffix}</span>
    </div>
  );
};

const ComingSoon = () => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Track scroll position to determine when to show floating navbar
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setIsScrolled(y > 100);
    });
    
    return () => unsubscribe();
  }, [scrollY]);

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
          <div className="flex justify-between items-center bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg pointer-events-auto">
            <Link to="/" className="flex items-center">
              <img src="/radow.svg" alt="Rado Logo" className="h-8" />
            </Link>
            
            <div className="flex items-center gap-4">
              
              
              <Button 
                asChild
                size="sm"
                variant="outline" 
                className="border border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <Link to="https://dashboard.radojobs.eu/login">
                  <span>Prijava</span>
                </Link>
              </Button>
              
              <Button 
                asChild
                size="sm"
                className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
              >
                <Link to="https://cal.com/marindev-asjghd/30min"
                target="_blank"
                >
                  <span>Zatraži Demo</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header - Original header that gets replaced by the floating navbar */}
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
              <Link to="https://dashboard.radojobs.eu/login">
                <span>Prijava</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </header>
        
        {/* Hero Section - Completely redesigned */}
        <div className="grid md:grid-cols-5 gap-12 md:gap-8 py-10">
          {/* Left column: Text content (3 columns wide) */}
          <motion.div 
            className="md:col-span-3 flex flex-col justify-center"
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
            
            {/* Feature tags */}

            {/* Registration button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white rounded-full px-8 text-lg font-medium"
              >
                <Link to="https://cal.com/marindev-asjghd/30min"
                target="_blank"
                >
                  Zatraži Demo
                  <MoveRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right column: Mockup image (2 columns wide) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="md:col-span-2 relative flex items-center justify-center"
          >
            {/* Background effects */}
            <div className="absolute w-full h-full">
              {/* Glowing circle behind */}
              <div className="absolute w-[80%] h-[80%] rounded-full bg-[#43AA8B]/20 blur-[60px]" />
              
              {/* Animated circles */}
              <motion.div 
                className="absolute top-10 -right-10 h-16 w-16 rounded-full border border-[#43AA8B]/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 4,
                }}
              />
              
              <motion.div 
                className="absolute -bottom-5 left-10 h-20 w-20 rounded-full border border-purple-500/30"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 5,
                  delay: 1
                }}
              />
            </div>
            
            {/* Mockup container with frosted effect */}
            <div className="relative z-10 w-full max-w-lg">
              
              
              {/* Mockup image with elegant border */}
              <motion.div 
                className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-black/60 to-black/20 backdrop-blur-sm p-1"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <img 
                  src="/mockup1.png" 
                  alt="Rado Platform" 
                  className="w-full h-auto rounded-xl"
                  onError={(e) => {
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
              </motion.div>
              
              {/* WhatsApp integration badge */}
              <motion.div 
                className="absolute -bottom-8 inset-x-0 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="bg-black/40 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 shadow-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-white text-sm">WhatsApp integracija</span>
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
                  <span className="text-[#43AA8B]">
                    <AnimatedCounter value={98} suffix="%" className="inline" />
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Zadovoljstvo kandidata</p>
              </div>
              
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold">
                  <span className="text-blue-500">
                    <AnimatedCounter value={77} suffix="%" className="inline" />
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Više prijava</p>
              </div>
              
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold">
                  <span className="text-purple-500">
                    <AnimatedCounter value={5} suffix="x" className="inline" />
                    <span className="text-purple-500 ml-1 text-2xl">brže</span>
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Od prijave do posla</p>
              </div>
              
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gray-100">
                  <AnimatedCounter value={520} suffix="h" className="inline" duration={2.5} />
                </p>
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
              title="Prijave putem WhatsApp-a"
              description="Automatizirano bez životopisa, bez motivacijskih pisama, kandidati se mogu prijaviti za 2 minute na platformama koje svakodnevno koriste."
              alignment="right"
              delay={0}
              animation="chat"
            />

            {/* Step 2 */}
            <TimelineCard 
              number="2"
              title="Automatska predkvalifikacija"
              description="Primajte samo kvalificirane kandidate, pustite da naš softver obavi težak posao - nema više čitanja životopisa!"
              alignment="left"
              delay={0.2}

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
        
        {/* Dashboard Preview Section - New addition */}
        <motion.div 
          className="mt-20 md:mt-32 py-16 px-4 md:px-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gray-100">Moćan i jednostavan </span>
                <span className="text-[#43AA8B]">dashboard</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Pratite sve svoje oglase i prijave na jednom mjestu uz naše intuitivno sučelje
              </p>
            </div>
            
            <div className="relative">
              {/* Shadow blob under the dashboard image */}
              <div className="absolute inset-0 bg-[#43AA8B]/20 rounded-3xl blur-2xl transform translate-y-4 scale-95 opacity-60"></div>
              
              {/* Dashboard image */}
              <motion.div
                className="relative rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
              >
                <img 
                  src="/dashboard.png" 
                  alt="Rado Dashboard Preview" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Gradient overlay on the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* CTA button positioned at the bottom of the image */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white font-medium px-8 py-6 rounded-full shadow-xl"
                  >
                    <Link to="https://cal.com/marindev-asjghd/30min"
                target="_blank"
                >
                  Zatraži Demo
                </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer */}
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
          <h4 className="font-semibold text-white mb-2">Glavno</h4>
          <ul className="space-y-1">
            <li><Link to="/" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Početna</Link></li>
            <li><Link to="https://dashboard.radojobs.eu/login" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Prijava</Link></li>
            <li><Link to="/integrations" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Integracije</Link></li>
          </ul>
              </div>
              <div>
          <h4 className="font-semibold text-white mb-2">Ostalo</h4>
          <ul className="space-y-1">
            <li><Link to="/careers" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Karijere</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Cijene</Link></li>
          </ul>
              </div>
              <div>
          <h4 className="font-semibold text-white mb-2">Korisno</h4>
          <ul className="space-y-1">
            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Politika privatnosti</Link></li>
            <li><Link to="/terms-of-use" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Uvjeti korištenja</Link></li>
            <li><Link to="/changelog" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Dnevnik promjena</Link></li>
          </ul>
              </div>
              <div>
          <h4 className="font-semibold text-white mb-2">Pomoć</h4>
          <ul className="space-y-1">
            <li><Link to="/support" className="text-gray-400 hover:text-[#43AA8B] transition-colors">Podrška</Link></li>
          </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            © {new Date().getFullYear()} Rado. Sva prava pridržana.
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

// Timeline Card Component - Updated with proper WhatsApp logo and fixed timeline line
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

  // Animation components with improved sizing and static options for steps 1 and 3
  const AnimationComponent = () => {
    switch(animation) {
      case 'chat':
        // WhatsApp logo animation for step 1
        return (
          <div className="w-full h-full  rounded-xl flex justify-center items-center overflow-hidden">
            <div className="w-32 h-32 relative">
              {/* WhatsApp logo with proper green color */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-24 h-24">
                  <path fill="#25D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </div>
              
              {/* Pulsing outer circles */}
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-[#25D366]/30"
                animate={{ scale: [1, 1.5, 1.5], opacity: [0.7, 0, 0] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  times: [0, 0.7, 1],
                  repeatDelay: 0.5
                }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-[#25D366]/20"
                animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.5,
                  times: [0, 0.7, 1],
                  repeatDelay: 0.2
                }}
              />
            </div>
          </div>
        );
      case 'filter':
        // Improved filter animation that fits properly within container
        return (
          <div className="w-full h-full  rounded-xl p-4 flex justify-center items-center overflow-hidden">
            <div className="flex flex-col items-center w-full max-w-[200px]">
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
        // Step 3 now uses text.webp image from public folder
        return (
          <div className="w-full h-full  rounded-xl flex justify-center items-center overflow-hidden">
            <img 
              src="/raz.png" 
              alt="Text Message" 
              className="w-fill h-fill object-contain" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerHTML = `<div class="flex items-center justify-center  p-8 h-full">
                  <div class="text-center">
                    <div class="text-[#43AA8B] text-xl font-bold mb-2">${title}</div>
                    <p class="text-gray-400">Slika nije dostupna</p>
                  </div>
                </div>`;
              }}
            />
          </div>
        );
      case 'calendar':
        // Static calendar integration display with proper logos
        return (
          <div className="w-full h-full  rounded-xl flex justify-center items-center overflow-hidden">
            <img 
              src="/mail.png" 
              alt="Text Message" 
              className="w-fill h-fill object-contain" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerHTML = `<div class="flex items-center justify-center  p-8 h-full">
                  <div class="text-center">
                    <div class="text-[#43AA8B] text-xl font-bold mb-2">${title}</div>
                    <p class="text-gray-400">Slika nije dostupna</p>
                  </div>
                </div>`;
              }}
            />
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

  // Check if this is the last item (number 4) to remove the bottom line
  const isLastItem = number === "4";

  return (
    <div ref={ref} className="relative mb-16 md:mb-24">
      {/* Vertical timeline line - positioned to go around the content boxes */}
      <div className="absolute left-8 md:left-1/2 top-0 h-[40px] w-0.5 bg-[#43AA8B]/30" style={{ transform: 'translateX(-50%)' }}></div>
      
      {/* Only show the bottom line if it's not the last item */}
      {!isLastItem && (
        <div className="absolute left-8 md:left-1/2 bottom-0 h-[calc(100%-40px-220px)] w-0.5 bg-[#43AA8B]/30" style={{ transform: 'translateX(-50%)', top: 'calc(40px + 220px)' }}></div>
      )}
      
      {/* Circle marker on timeline - now with border to appear over line */}
      <div className="absolute left-8 md:left-1/2 transform translate-x-[-50%] w-12 h-12 bg-[#43AA8B] rounded-full flex items-center justify-center text-2xl font-bold border-4 border-black dark:border-gray-900 z-10">
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
          <div className="bg-gray-800/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl h-[220px] md:h-[250px] z-20 relative">
            <AnimationComponent />
          </div>
        </div>
      </motion.div>
      
      {/* Ensure the timeline completely ends for the last item */}
      {isLastItem && (
        <div className="absolute left-8 md:left-1/2 transform translate-x-[-50%] bottom-[-20px] w-6 h-6 rounded-full bg-[#43AA8B]/30"></div>
      )}
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
