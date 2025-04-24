import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#43AA8B]/10"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              opacity: 0 
            }}
            animate={{ 
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 20 + 10,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="relative max-w-4xl w-full backdrop-blur-xl bg-black/30 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img src="/radow.svg" alt="Rado Logo" className="h-16 md:h-24" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-6 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Revolucioniramo zapošljavanje
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-center text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Radimo na novoj platformi koja će promijeniti način na koji tvrtke pronalaze i zapošljavaju talente. Pokrenite svoju karijeru s nama!
        </motion.p>
        
        <motion.div 
          className="flex flex-col md:flex-row justify-center gap-4 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white px-8 py-6 text-lg font-medium rounded-xl transition shadow-lg shadow-[#43AA8B]/20"
          >
            <Link to="/login">
              Prijava za postojeće korisnike
            </Link>
          </Button>
          <Button 
            asChild
            size="lg"
            variant="outline" 
            className="px-8 py-6 text-lg bg-transparent border-white/20 text-white hover:bg-white/10 font-medium rounded-xl transition"
          >
            <a href="mailto:support@rado.ai">
              Kontaktirajte podršku
            </a>
          </Button>
        </motion.div>
        
        
        
        <motion.div 
          className="flex justify-center gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          {['facebook', 'twitter', 'linkedin'].map((social, i) => (
            <motion.a 
              key={social} 
              href="#" 
              className="text-gray-400 hover:text-[#43AA8B] transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social === 'facebook' && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              )}
              {social === 'twitter' && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              )}
              {social === 'linkedin' && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              )}
            </motion.a>
          ))}
        </motion.div>
        
        <motion.p 
          className="text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          © {new Date().getFullYear()} Rado. Sva prava pridržana.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
