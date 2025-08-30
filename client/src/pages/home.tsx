import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import shopImg from "../../../attached_assets/shop.png";
import activitiesImg from "../../../attached_assets/activities.png";
import informationImg from "../../../attached_assets/information.png";
import theaterImg from "../../../attached_assets/theater.png";
import "./temp-fix.css"; // Import temporary CSS fix

export default function Home() {
  const [, setLocation] = useLocation();
  
  // State for controlling which animation to show
  const [showDrawAnimation, setShowDrawAnimation] = useState(true);
  
  // Check flag on every component mount (SPA navigation) 
  useEffect(() => {
    console.log('=== HOME COMPONENT MOUNTED ===');
    const cameFromInternal = sessionStorage.getItem('came-from-internal') === 'true';
    console.log('Flag value:', cameFromInternal);
    console.log('SessionStorage came-from-internal:', sessionStorage.getItem('came-from-internal'));
    
    if (cameFromInternal) {
      console.log('INTERNAL NAV DETECTED - Setting fade-in');
      // Clear flag immediately
      sessionStorage.removeItem('came-from-internal');
      // Show fade-in animation
      setShowDrawAnimation(false);
    } else {
      console.log('NO FLAG - Setting drawing animation');
      // Show drawing animation (default)
      setShowDrawAnimation(true);
    }
    console.log('Final showDrawAnimation state:', !cameFromInternal);
  }, []); // Empty dependency array means this runs on every mount

  // Prevent scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Navigation handlers - set flag when leaving home for internal pages
  const handleShopClick = () => {
    sessionStorage.setItem('came-from-internal', 'true');
    setLocation("/shop");
  };
  
  const handleTheaterClick = () => {
    sessionStorage.setItem('came-from-internal', 'true');
    setLocation("/birds-eye-view");
  };
  
  const handleActivitiesClick = () => {
    sessionStorage.setItem('came-from-internal', 'true');
    setLocation("/activities");
  };
  
  const handleInformationClick = () => {
    sessionStorage.setItem('came-from-internal', 'true');
    setLocation("/information");
  };

  const handleKeyPress = (event: React.KeyboardEvent, handler: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };

  return (
    <>
      {/* Text Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center justify-center mb-32">
          
          {/* El Segundo High School */}
          {showDrawAnimation ? (
            // Drawing animation for first load
            <h1 className="font-['Great_Vibes',_cursive] text-6xl md:text-7xl lg:text-8xl text-center text-white tracking-wide mb-8">
              <svg width="700" height="100" viewBox="0 0 700 100" className="overflow-hidden">
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  fontFamily="'Great Vibes', cursive"
                  fontSize="58"
                  filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))"
                  initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ delay: 0.5, duration: 3, ease: "easeOut" }}
                >
                  El Segundo High School
                </motion.text>
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontFamily="'Great Vibes', cursive"
                  fontSize="58"
                  filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5, duration: 0.5 }}
                >
                  El Segundo High School
                </motion.text>
              </svg>
            </h1>
          ) : (
            // Fade-in for internal navigation - match SVG sizing
            <motion.h1
              className="font-['Great_Vibes',_cursive] text-center text-white tracking-wide mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ 
                fontSize: '58px', // Match SVG fontSize="58"
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
                WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)'
              }}
            >
              El Segundo High School
            </motion.h1>
          )}

          {/* ASB */}
          {showDrawAnimation ? (
            // Drawing animation for first load
            <h1 className="font-['Great_Vibes',_cursive] text-8xl md:text-9xl lg:text-[10rem] font-bold text-white">
              <svg width="300" height="160" viewBox="0 0 300 160" className="overflow-visible">
                <defs>
                  <clipPath id="textClip">
                    <rect x="0" y="0" width="300" height="160" />
                  </clipPath>
                </defs>
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  fontFamily="'Great Vibes', cursive"
                  fontSize="100"
                  fontWeight="bold"
                  filter="drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5))"
                  clipPath="url(#textClip)"
                  initial={{ strokeDasharray: "1000 1000", strokeDashoffset: 1000 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ delay: 2, duration: 2.5, ease: "easeInOut" }}
                >
                  ASB
                </motion.text>
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontFamily="'Great Vibes', cursive"
                  fontSize="100"
                  fontWeight="bold"
                  filter="drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5))"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.5, duration: 0.5 }}
                >
                  ASB
                </motion.text>
              </svg>
            </h1>
          ) : (
            // Fade-in for internal navigation - match SVG sizing
            <motion.h1
              className="font-['Great_Vibes',_cursive] font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ 
                fontSize: '100px', // Match SVG fontSize="100"
                filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5))',
                WebkitTextStroke: '0.8px rgba(0, 0, 0, 0.3)'
              }}
            >
              ASB
            </motion.h1>
          )}
        </div>
      </div>

      {/* Main content container */}
      <div className="min-h-screen w-screen relative flex items-center justify-center overflow-hidden">
        {/* Interactive elements layout */}
        <div className="absolute bottom-0 w-full h-4/5 flex items-end justify-center pb-4 md:pb-6 lg:pb-8 z-30">
          <div className="relative w-full max-w-[100rem] flex flex-row justify-between px-4 md:px-8 lg:px-0">
            
            {/* LEFT SIDE ELEMENTS */}
            <div className="relative h-full w-1/2">
              {/* Shop Element */}
              <div 
                className="shop-overlay animate-float cursor-pointer transition-all duration-300 ease-out
                           hover:transform hover:-translate-y-3 hover:scale-105 hover:drop-shadow-2xl group"
                style={{ 
                  filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.15))',
                  animationDelay: '0.1s',
                  position: 'absolute',
                  bottom: '0',
                  left: '12rem',
                }}
                onClick={handleShopClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyPress(e, handleShopClick)}
                aria-label="Visit the school merchandise shop"
              >
                <img 
                  src={shopImg}
                  alt="School Merchandise Shop" 
                  className="w-64 sm:w-48 md:w-56 lg:w-64 h-auto relative"
                  style={{ filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.35))' }}
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -z-10 w-40 h-10 bg-amber-100/50 rounded-full blur-md
                                transition-all duration-300 group-hover:bg-amber-200/60 group-hover:w-48 group-hover:h-12"></div>
              </div>
              
              {/* Theater Element */}
              <div 
                className="theater-overlay animate-float cursor-pointer transition-all duration-300 ease-out 
                           hover:transform hover:-translate-y-3 hover:scale-105 hover:drop-shadow-2xl group"
                style={{ 
                  filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.15))',
                  animationDelay: '0.2s',
                  position: 'absolute',
                  bottom: '7rem',
                  left: '25rem',
                }}
                onClick={handleTheaterClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyPress(e, handleTheaterClick)}
                aria-label="Visit the school theater page"
              >
                <img 
                  src={theaterImg}
                  alt="School Theater" 
                  className="w-64 sm:w-48 md:w-52 lg:w-60 h-auto relative"
                  style={{ filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.35))' }}
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -z-10 w-40 h-10 bg-amber-100/50 rounded-full blur-md
                                transition-all duration-300 group-hover:bg-amber-200/60 group-hover:w-48 group-hover:h-12"></div>
              </div>
            </div>
            
            {/* RIGHT SIDE ELEMENTS */}
            <div className="relative h-full w-1/2">
              {/* Activities Element */}
              <div 
                className="activities-overlay animate-float cursor-pointer transition-all duration-300 ease-out
                           hover:transform hover:-translate-y-3 hover:scale-105 hover:drop-shadow-2xl group"
                style={{ 
                  filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.15))',
                  animationDelay: '0.3s',
                  position: 'absolute',
                  bottom: '0',
                  right: '12rem',
                }}
                onClick={handleActivitiesClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyPress(e, handleActivitiesClick)}
                aria-label="Visit the school activities page"
              >
                <img 
                  src={activitiesImg}
                  alt="School Activities" 
                  className="w-64 sm:w-48 md:w-56 lg:w-64 h-auto relative"
                  style={{ filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.35))' }}
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -z-10 w-40 h-10 bg-amber-100/50 rounded-full blur-md
                                transition-all duration-300 group-hover:bg-amber-200/60 group-hover:w-48 group-hover:h-12"></div>
              </div>
              
              {/* Information Element */}
              <div 
                className="information-overlay animate-float cursor-pointer transition-all duration-300 ease-out
                           hover:transform hover:-translate-y-3 hover:scale-105 hover:drop-shadow-2xl group"
                style={{ 
                  filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.15))',
                  animationDelay: '0.4s',
                  position: 'absolute',
                  bottom: '7rem',
                  right: '25rem',
                }}
                onClick={handleInformationClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyPress(e, handleInformationClick)}
                aria-label="Visit the school information page"
              >
                <img 
                  src={informationImg}
                  alt="School Information" 
                  className="w-64 sm:w-48 md:w-52 lg:w-60 h-auto relative"
                  style={{ filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.35))' }}
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -z-10 w-40 h-10 bg-amber-100/50 rounded-full blur-md
                                transition-all duration-300 group-hover:bg-amber-200/60 group-hover:w-48 group-hover:h-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}