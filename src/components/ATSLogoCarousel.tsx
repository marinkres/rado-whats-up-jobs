import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// ATS companies commonly used in Croatia
const atsCompanies = [
  {
    name: "eRecruiter",
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFgSenxQ6YR6A/company-logo_200_200/company-logo_200_200/0/1630598431463/erecruiter_a_logo?e=2147483647&v=beta&t=5e9_Jn7ir_0ZOC5NzF2mIXFfblGkUipaRKme-rWFOTk",
  },
  {
    name: "MojPosao (TauOn)",
    logo: "https://storage.moj-posao.net/images/mojposao-fb-logo.png",
  },
  {
    name: "HRnest",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-e6nT0XAfOJEsGXnpPoC9dYgNJU6u13OuNQ&s",
  },
  {
    name: "TalentLyft",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuYO_2rEXIRMt0yrm_roXu4lC9Zq8qNnR1sg&s",
  },
  {
    name: "SAP SuccessFactors",
    logo: "https://www.freelogovectors.net/wp-content/uploads/2023/05/sap-successfactor-logo-freelogovectors.net_.png",
  },
  {
    name: "Workday",
    logo: "https://media.licdn.com/dms/image/v2/D4D0BAQGKeNem9seahg/company-logo_200_200/company-logo_200_200/0/1730301071878/workday_logo?e=2147483647&v=beta&t=0kH-6WKEl8ebq92a-L0un9EKXpY_tIyd7j6bSk5EoHM",
  },
  {
    name: "Cornerstone",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd2iIfj9mN2m8LO2-zhTb8qXNCxKC6wrouKg&s",
  },
  {
    name: "Personio",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNUWc3sOO9kgeYDS6fEc4vHlWUoj9fReAPSQ&s",
  },
  {
    name: "Zoho Recruit",
    logo: "https://media.licdn.com/dms/image/v2/D4E0BAQGomGM_KbxsKw/company-logo_200_200/company-logo_200_200/0/1686637256165/zohorecruit_logo?e=2147483647&v=beta&t=BVqc6DehJ4EgdnF5ktNMiJA8YMjwxCxsFqTNCQ8GYIg",
  },
];

interface ATSLogoCarouselProps {
  className?: string;
}

const ATSLogoCarousel: React.FC<ATSLogoCarouselProps> = ({ className }) => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Animation logic
  useEffect(() => {
    if (isPaused) {
      controls.stop();
      return;
    }
    controls.start({
      x: [0, -((atsCompanies.length) * 140)],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: atsCompanies.length * 2.5,
          ease: "linear",
        },
      },
    });
  }, [isPaused, controls]);

  return (
    <div
      className={`relative w-full select-none overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg ${className || ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ height: 70 }}
      ref={carouselRef}
    >
      <motion.div
        className="flex items-center gap-6 px-4"
        animate={controls}
        initial={{ x: 0 }}
        style={{ width: atsCompanies.length * 140 * 2, minWidth: '100%' }}
      >
        {/* Duplicate logos for seamless looping */}
        {[...atsCompanies, ...atsCompanies].map((ats, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center w-[120px] h-[70px] bg-white rounded-lg shadow border border-gray-100 mx-2"
          >
            <img
              src={ats.logo}
              alt={ats.name}
              className="h-10 object-contain mb-1"
              style={{ maxHeight: 40, maxWidth: 100 }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xs text-gray-700 font-medium truncate w-full text-center px-1">
              {ats.name}
            </span>
          </div>
        ))}
      </motion.div>
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default ATSLogoCarousel;
