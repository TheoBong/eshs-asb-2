import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import shopImg from "../../../attached_assets/shop.png";
import activitiesImg from "../../../attached_assets/activities.png";
import informationImg from "../../../attached_assets/information.png";
import theaterImg from "../../../attached_assets/theater.png";
import "./temp-fix.css"; // Import temporary CSS fix

// Cloud component for animation
type CloudSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type CloudPosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
};

// Dust particle component for background atmosphere
const Dust = ({ 
  count = 10,
  baseDelay = 0.5 
}: { 
  count?: number;
  baseDelay?: number;
}) => {
  // Generate random particles
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1 + Math.random() * 3.5, // Slightly larger particles
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: baseDelay + Math.random() * 2,
    duration: 10 + Math.random() * 20,
    opacity: 0.35 + Math.random() * 0.55 // Adjusted opacity for better visibility with subtle clouds
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0,
            boxShadow: "0 0 2px 1px rgba(255, 255, 255, 0.4)", // Subtle glow effect
            pointerEvents: "none" // Ensure dust particles don't block clicks
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 120], // Increased movement range
            y: [0, (Math.random() - 0.5) * 120]
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      ))}
    </>
  );
};

const Cloud = ({ 
  delay = 0, 
  position, 
  size = "md" as CloudSize,
  opacity = 0.8,
  direction = "center" as "left" | "right" | "center"
}: { 
  delay?: number; 
  position: CloudPosition; 
  size?: CloudSize;
  opacity?: number;
  direction?: "left" | "right" | "center";
}) => {
  const sizeClasses = {
    sm: "w-64 h-24",
    md: "w-80 h-44",
    lg: "w-96 h-64",
    xl: "w-[36rem] h-96", // Increased from 30rem to 36rem for bigger clouds
    xxl: "w-[50rem] h-[35rem]", // Extra large size for maximum coverage (increased further)
  };
  
  // Generate movement vectors for curtain-like animation
  const getDirectionalMovement = () => {
    if (direction === "left") {
      return { x: [-50, -250, -600] }; // Even more dramatic movement for quicker exit
    } else if (direction === "right") {
      return { x: [50, 250, 600] }; // Even more dramatic movement for quicker exit
    } else {
      // Random displacement for center clouds
      const xDisplacement = (Math.random() - 0.5) * 50; // Larger random movement
      const yDisplacement = (Math.random() - 0.5) * 50; // Larger random movement
      return { 
        x: [0, xDisplacement/1.5, xDisplacement],
        y: [0, yDisplacement/1.5, yDisplacement]
      };
    }
  };
  
  const movement = getDirectionalMovement();
  
  return (
    <motion.div
      className={`absolute rounded-[50%] bg-gray-100 ${sizeClasses[size as CloudSize]}`}
      style={{ 
        ...position,
        filter: "blur(8px)", // Reduced blur to make outlines more visible
        boxShadow: "inset 0 0 40px 5px rgba(255, 255, 255, 0.4), 0 0 4px 2px rgba(255, 255, 255, 0.35), 0 0 10px 0px rgba(180, 180, 200, 0.5)",
        border: "1.5px solid rgba(255, 255, 255, 0.6)", // Slightly thicker and more visible border
        pointerEvents: "none" // Ensure clouds don't block click events
      }}
      initial={{ opacity: opacity }}
      animate={{ 
        opacity: [opacity * 0.9, opacity * 0.9, opacity * 0.9, opacity * 0.85, opacity * 0.7, opacity * 0.5, opacity * 0.25, 0], 
        scale: [1, 1.005, 1.01, 1.015, 1.02, 1.04, 1.08, 1.12],
        ...movement
      }}
      onAnimationComplete={() => {
        // This ensures cloud elements are removed from DOM after animation
        return undefined;
      }}
      transition={{
        delay: delay + 0.05, // Almost no delay to make animation start immediately
        duration: 2.5, // Even longer duration to make clouds stay visible longer
        times: [0, 0.5, 0.75, 0.8, 0.85, 0.9, 0.95, 1], // Stay at full opacity for 75% of the animation time, then quick fade out
        ease: "easeOut",
      }}
    />
  );
};

export default function Home() {
  const [, setLocation] = useLocation();
  // More reliable internal navigation detection
  const isInternalNavigation = () => {
    // Check if we have an internal navigation flag in sessionStorage
    const internalNav = sessionStorage.getItem('internal-navigation');
    
    // Also check document.referrer as backup
    let hasInternalReferrer = false;
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        const currentUrl = new URL(window.location.href);
        hasInternalReferrer = referrerUrl.origin === currentUrl.origin;
      } catch (e) {
        hasInternalReferrer = false;
      }
    }
    
    // Clear the flag after checking
    sessionStorage.removeItem('internal-navigation');
    
    // Debug logging
    console.log('Internal navigation check:', {
      sessionStorageFlag: internalNav,
      hasInternalReferrer,
      referrer: document.referrer,
      result: internalNav === 'true' || hasInternalReferrer
    });
    
    // Return true if either method indicates internal navigation
    return internalNav === 'true' || hasInternalReferrer;
  };
  // Separate state for clouds and text animations
  const [showClouds, setShowClouds] = useState(!isInternalNavigation()); // Clouds only for external navigation
  const [showTextAnimation, setShowTextAnimation] = useState(true); // Text animation always shows
  const [textFadingOut, setTextFadingOut] = useState(false); // Track text fade out state
  const [cloudsReady, setCloudsReady] = useState(!showClouds); // If not showing clouds, they're "ready" immediately

  // Debug logging
  console.log('Animation states:', {
    showClouds,
    showTextAnimation,
    textFadingOut,
    cloudsReady,
    isInternal: !showClouds
  });// Set up initial background hiding and animation sequence
  useEffect(() => {
    // Only run cloud animation setup if showing clouds
    if (showClouds) {
      // Keep content hidden at the start
      // The clouds will naturally dissipate during the animation sequence
      const timer = setTimeout(() => {
        setCloudsReady(true);
      }, 100); // Reduced to 0.1 seconds as requested
      
      return () => clearTimeout(timer);
    }
  }, [showClouds]);
  // Generate small cloud particles for the animation - with minimal delay (only if showing clouds)
  const cloudParticles = showClouds ? Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1.0, // Less random delay to better align with the longer cloud display time
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() < 0.5 ? "sm" : "md",
    opacity: 0.25 + Math.random() * 0.35, // Reduced opacity for less brightness
  })) : [];

  // Animation stays on screen indefinitely
  useEffect(() => {
    // No timeout to remove the animation - text will stay indefinitely as requested
  }, []);  const handleShopClick = () => {
    setTextFadingOut(true); // Start text fade out animation
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    
    // Hide text animation after fade out completes
    setTimeout(() => {
      setShowTextAnimation(false);
    }, 400); // Fade out duration
    
    // Navigate with fade transition
    setTimeout(() => {
      setLocation("/shop");
    }, 400);
  };
  // Handlers for the other icons
  const handleTheaterClick = () => {
    setTextFadingOut(true); // Start text fade out animation
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    
    // Hide text animation after fade out completes
    setTimeout(() => {
      setShowTextAnimation(false);
    }, 400); // Fade out duration
    
    // Navigate to birds eye view page (now under theater)
    setTimeout(() => {
      setLocation("/birds-eye-view");
    }, 400);
  };

  const handleActivitiesClick = () => {
    setTextFadingOut(true); // Start text fade out animation
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    
    // Hide text animation after fade out completes
    setTimeout(() => {
      setShowTextAnimation(false);
    }, 400); // Fade out duration
    
    // Navigate to activities page
    setTimeout(() => {
      setLocation("/activities");
    }, 400);
  };

  const handleInformationClick = () => {
    setTextFadingOut(true); // Start text fade out animation
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    
    // Hide text animation after fade out completes
    setTimeout(() => {
      setShowTextAnimation(false);
    }, 400); // Fade out duration
    
    // Navigate to information page
    setTimeout(() => {
      setLocation("/information");
    }, 400);
  };

  const handleKeyPress = (event: React.KeyboardEvent, handler: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };
  return (
    <>      {/* Initial white overlay that ensures nothing shows before clouds are ready - only for cloud animation */}
      {showClouds && (
        <div 
          className={`fixed inset-0 bg-white z-[60] transition-opacity duration-1000`}
          style={{ 
            opacity: cloudsReady ? 0 : 1,
            pointerEvents: cloudsReady ? 'none' : 'auto'
          }}
        ></div>
      )}      {/* Cloud Animation Overlay - only when showing clouds */}
      <AnimatePresence>
        {showClouds && (
          <motion.div 
            className="fixed inset-0 bg-gradient-to-br from-sky-700/50 via-gray-800/40 to-blue-900/50 z-40 flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 20%, #F0F8FF 40%, #FFFFFF 60%, #F0F8FF 80%, #87CEEB 100%)',
              backgroundColor: "transparent", // Allow background to show through after clouds dissipate
              pointerEvents: "none" // Ensure underlying elements are clickable through this layer
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ exit: { duration: 1 } }}
          >
            {/* Full-screen cloud cover - First layer (back) - reduced delays and brightness */}
            <Cloud delay={0} position={{ top: '-15%', left: '-15%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ top: '-15%', left: '15%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ top: '-15%', left: '45%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ top: '-15%', right: '15%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ top: '10%', left: '-10%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ top: '10%', left: '20%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ top: '10%', right: '20%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ top: '10%', right: '-10%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ top: '35%', left: '-15%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ top: '35%', left: '15%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ top: '35%', right: '15%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ top: '35%', right: '-15%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ bottom: '20%', left: '-15%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '20%', left: '15%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ bottom: '20%', right: '15%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '20%', right: '-15%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ bottom: '-10%', left: '-10%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '-10%', left: '20%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ bottom: '-10%', right: '20%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '-10%', right: '-10%' }} size="xl" opacity={0.85} />
            <Cloud delay={0} position={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} size="xl" opacity={0.87} />
            
            {/* Left side clouds (will part to the left) - staggered for extended initial display */}
            <Cloud delay={0} position={{ top: '-10%', left: '-5%' }} size="xl" opacity={0.85} direction="left" />
            <Cloud delay={0.03} position={{ top: '10%', left: '5%' }} size="xl" opacity={0.82} direction="left" />
            <Cloud delay={0.06} position={{ top: '30%', left: '-2%' }} size="xl" opacity={0.83} direction="left" />
            <Cloud delay={0.09} position={{ top: '50%', left: '8%' }} size="lg" opacity={0.84} direction="left" />
            <Cloud delay={0.12} position={{ bottom: '20%', left: '-8%' }} size="xl" opacity={0.85} direction="left" />
            <Cloud delay={0.15} position={{ bottom: '-5%', left: '10%' }} size="xl" opacity={0.87} direction="left" />
            
            {/* Right side clouds (will part to the right) - staggered for extended initial display */}
            <Cloud delay={0} position={{ top: '-10%', right: '-5%' }} size="xl" opacity={0.85} direction="right" />
            <Cloud delay={0.03} position={{ top: '10%', right: '5%' }} size="xl" opacity={0.82} direction="right" />
            <Cloud delay={0.06} position={{ top: '30%', right: '-2%' }} size="xl" opacity={0.83} direction="right" />
            <Cloud delay={0.09} position={{ top: '50%', right: '8%' }} size="lg" opacity={0.84} direction="right" />
            <Cloud delay={0.12} position={{ bottom: '20%', right: '-8%' }} size="xl" opacity={0.85} direction="right" />
            <Cloud delay={0.15} position={{ bottom: '-5%', right: '10%' }} size="xl" opacity={0.87} direction="right" />
            
            {/* Center clouds (will fade out naturally) - staggered for extended initial display */}
            <Cloud delay={0.18} position={{ top: '15%', left: '35%' }} size="xl" opacity={0.78} />
            <Cloud delay={0.21} position={{ top: '40%', left: '42%' }} size="lg" opacity={0.75} />
            <Cloud delay={0.24} position={{ bottom: '30%', left: '38%' }} size="xl" opacity={0.78} />
            <Cloud delay={0.18} position={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} size="xl" opacity={0.78} />
            
            {/* Center bottom clouds (additional coverage) - Using extra large clouds */}
            <Cloud delay={0} position={{ bottom: '15%', left: '25%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '5%', left: '45%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '12%', right: '35%' }} size="xl" opacity={0.87} />
            <Cloud delay={0} position={{ bottom: '-5%', left: '50%', transform: 'translateX(-50%)' }} size="xxl" opacity={0.9} />
            <Cloud delay={0} position={{ bottom: '-8%', left: '25%' }} size="xxl" opacity={0.9} />
            <Cloud delay={0} position={{ bottom: '-5%', right: '25%' }} size="xxl" opacity={0.9} />
            <Cloud delay={0} position={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)' }} size="xxl" opacity={0.9} />
            
            {/* Extra clouds for absolute bottom center coverage */}
            <Cloud delay={0} position={{ bottom: '-10%', left: '40%' }} size="xxl" opacity={0.9} />
            <Cloud delay={0} position={{ bottom: '-15%', left: '50%', transform: 'translateX(-50%)' }} size="xxl" opacity={0.9} />
            <Cloud delay={0} position={{ bottom: '-10%', right: '40%' }} size="xxl" opacity={0.9} />
            
            {/* Additional small cloud particles - reduced delay */}
            {cloudParticles.map((particle) => (
              <Cloud 
                key={particle.id}
                delay={particle.delay + 0.2} 
                position={{ top: particle.top, left: particle.left }} 
                size={particle.size as CloudSize} 
                opacity={particle.opacity}
              />
            ))}
            
            {/* Dust particles for atmospheric effect - adjusted for longer cloud display time */}
            <Dust count={80} baseDelay={1.2} />
              {/* Text Animation - Cursive white text with drawing effect - adjusted for longer cloud display */}
            <motion.div
              className="relative z-10 mb-32" /* Moved text higher by adding margin-bottom */
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: textFadingOut ? 0 : 1,
                scale: textFadingOut ? 0.95 : 1,
                y: textFadingOut ? -10 : 0
              }}
              transition={{ 
                delay: textFadingOut ? 0 : 1.0, 
                duration: textFadingOut ? 0.4 : 0.8,
                ease: textFadingOut ? "easeIn" : "easeOut"
              }}
            >
              {/* El Segundo High School text with handwriting animation */}
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial={{ filter: "blur(2px)" }}
                animate={{ 
                  filter: textFadingOut ? "blur(4px)" : "blur(0px)",
                  opacity: textFadingOut ? 0 : 1,
                  y: textFadingOut ? -15 : 0
                }}
                transition={{ 
                  delay: textFadingOut ? 0 : 1.0, 
                  duration: textFadingOut ? 0.4 : 0.8,
                  ease: textFadingOut ? "easeIn" : "easeOut"
                }}
              >                {/* First line - El Segundo High School */}
                <motion.h1
                  className="font-['Great_Vibes',_cursive] text-6xl md:text-7xl lg:text-8xl text-center text-white tracking-wide"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
                    WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)'
                  }}
                  initial={{ filter: "blur(2px)" }}
                  animate={{ 
                    filter: textFadingOut ? "blur(4px)" : "blur(0px)",
                    opacity: textFadingOut ? 0 : 1,
                    y: textFadingOut ? -15 : 0,
                    scale: textFadingOut ? 0.95 : 1
                  }}
                  transition={{ 
                    delay: textFadingOut ? 0 : 1.0, 
                    duration: textFadingOut ? 0.4 : 0.8,
                    ease: textFadingOut ? "easeIn" : "easeOut"
                  }}
                >
                  <div className="relative">
                    {/* Invisible text to maintain layout */}
                    <span className="invisible whitespace-nowrap">El Segundo High School</span>
                    
                    {/* SVG Text Drawing Animation */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: textFadingOut ? 0 : 1,
                        scale: textFadingOut ? 0.95 : 1,
                        y: textFadingOut ? -10 : 0
                      }}
                      transition={{ 
                        delay: textFadingOut ? 0 : 1.3, 
                        duration: textFadingOut ? 0.4 : 0.3,
                        ease: textFadingOut ? "easeIn" : "easeOut"
                      }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 700 120" className="absolute inset-0">
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
                          className="text-shadow-sm"
                          initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                          animate={{ 
                            strokeDashoffset: textFadingOut ? 1000 : 0,
                            opacity: textFadingOut ? 0 : 1
                          }}
                          transition={{ 
                            delay: textFadingOut ? 0 : 2.0, 
                            duration: textFadingOut ? 0.4 : 3.0,
                            ease: textFadingOut ? "easeIn" : "easeOut"
                          }}
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
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: textFadingOut ? 0 : 1,
                            scale: textFadingOut ? 0.9 : 1
                          }}
                          transition={{ 
                            delay: textFadingOut ? 0 : 5.0, 
                            duration: textFadingOut ? 0.4 : 0.3,
                            ease: textFadingOut ? "easeIn" : "easeOut"
                          }}
                        >
                          El Segundo High School
                        </motion.text>
                      </svg>
                    </motion.div>
                  </div>
                </motion.h1>
                  {/* Second line - ASB */}
                <motion.div 
                  className="mt-8 block text-center" // Increased margin-top for spacing
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: textFadingOut ? 0 : 1, 
                    y: textFadingOut ? -15 : 0,
                    scale: textFadingOut ? 0.95 : 1
                  }}
                  transition={{ 
                    delay: textFadingOut ? 0 : 3.5, 
                    duration: textFadingOut ? 0.4 : 0.5,
                    ease: textFadingOut ? "easeIn" : "easeOut"
                  }}
                >
                  <motion.h1
                    className="font-['Great_Vibes',_cursive] text-8xl md:text-9xl lg:text-[10rem] font-bold text-white" // Further increased text size
                    style={{ 
                      filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5))',
                      WebkitTextStroke: '0.8px rgba(0, 0, 0, 0.3)'
                    }}
                    initial={{ filter: "blur(2px)" }}
                    animate={{ 
                      filter: textFadingOut ? "blur(4px)" : "blur(0px)",
                      opacity: textFadingOut ? 0 : 1,
                      y: textFadingOut ? -10 : 0,
                      scale: textFadingOut ? 0.95 : 1
                    }}
                    transition={{ 
                      delay: textFadingOut ? 0 : 3.0, 
                      duration: textFadingOut ? 0.4 : 0.8,
                      ease: textFadingOut ? "easeIn" : "easeOut"
                    }}
                  >
                    <div className="relative">
                      {/* Invisible text to maintain layout */}
                      <span className="invisible whitespace-nowrap">ASB</span>
                      
                      {/* SVG Text Drawing Animation */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: textFadingOut ? 0 : 1,
                          scale: textFadingOut ? 0.95 : 1,
                          y: textFadingOut ? -10 : 0
                        }}
                        transition={{ 
                          delay: textFadingOut ? 0 : 3.3, 
                          duration: textFadingOut ? 0.4 : 0.3,
                          ease: textFadingOut ? "easeIn" : "easeOut"
                        }}
                      >
                        <svg width="100%" height="100%" viewBox="0 0 250 140" className="absolute inset-0">
                          <motion.text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5" // Further increased stroke width
                            fontFamily="'Great Vibes', cursive"
                            fontSize="100" // Further increased font size
                            fontWeight="bold"
                            className="text-shadow-sm"
                            initial={{ strokeDasharray: 600, strokeDashoffset: 600 }}
                            animate={{ 
                              strokeDashoffset: textFadingOut ? 600 : 0,
                              opacity: textFadingOut ? 0 : 1
                            }}
                            transition={{ 
                              delay: textFadingOut ? 0 : 3.7, 
                              duration: textFadingOut ? 0.4 : 2.0,
                              ease: textFadingOut ? "easeIn" : "easeOut"
                            }}
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
                            fontSize="100" // Match the increased font size
                            fontWeight="bold"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: textFadingOut ? 0 : 1,
                              scale: textFadingOut ? 0.9 : 1
                            }}
                            transition={{ 
                              delay: textFadingOut ? 0 : 5.7, 
                              duration: textFadingOut ? 0.4 : 0.3,
                              ease: textFadingOut ? "easeIn" : "easeOut"
                            }}
                          >
                            ASB
                          </motion.text>
                        </svg>
                      </motion.div>
                    </div>
                  </motion.h1>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>        )}
      </AnimatePresence>      {/* Standalone Text Animation - Always shows regardless of internal navigation */}
      <AnimatePresence>
        {showTextAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: textFadingOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: textFadingOut ? 0.4 : 0.8,
              ease: textFadingOut ? "easeIn" : "easeOut"
            }}
          >
            {/* Text Animation - Cursive white text with drawing effect */}
            <motion.div
              className="relative z-10 mb-32" /* Moved text higher by adding margin-bottom */
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: textFadingOut ? 0 : 1,
                scale: textFadingOut ? 0.95 : 1,
                y: textFadingOut ? -10 : 0
              }}
              transition={{ 
                delay: showClouds ? 1.0 : 0.2, 
                duration: textFadingOut ? 0.4 : 0.8,
                ease: textFadingOut ? "easeIn" : "easeOut"
              }}
            >              {/* El Segundo High School text with handwriting animation */}
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial={{ filter: "blur(2px)" }}
                animate={{ 
                  filter: textFadingOut ? "blur(4px)" : "blur(0px)",
                  opacity: textFadingOut ? 0 : 1,
                  y: textFadingOut ? -15 : 0
                }}
                transition={{ 
                  delay: textFadingOut ? 0 : (showClouds ? 1.0 : 0.2), 
                  duration: textFadingOut ? 0.4 : 0.8,
                  ease: textFadingOut ? "easeIn" : "easeOut"
                }}
              >                {/* First line - El Segundo High School */}
                <motion.h1
                  className="font-['Great_Vibes',_cursive] text-6xl md:text-7xl lg:text-8xl text-center text-white tracking-wide"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
                    WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {showClouds ? (
                    // Drawing animation for cloud animation (first load/refresh)
                    <div className="relative">
                      {/* Invisible text to maintain layout */}
                      <span className="invisible whitespace-nowrap">El Segundo High School</span>
                      
                      {/* SVG Text Drawing Animation */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.3 }}
                      >
                        <svg width="100%" height="100%" viewBox="0 0 700 120" className="absolute inset-0">
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
                            className="text-shadow-sm"
                            initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ 
                              delay: 2.0, 
                              duration: 3.0,
                              ease: "easeOut"
                            }}
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ 
                              delay: 5.0,
                              duration: 0.3,
                            }}
                          >
                            El Segundo High School
                          </motion.text>
                        </svg>
                      </motion.div>
                    </div>                  ) : (
                    // Direct fade-in for internal navigation - matching finished SVG text
                    <div className="relative">
                      {/* Invisible text to maintain layout */}
                      <span className="invisible whitespace-nowrap">El Segundo High School</span>
                      
                      {/* Finished SVG Text - Direct fade-in */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <svg width="100%" height="100%" viewBox="0 0 700 120" className="absolute inset-0">
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontFamily="'Great Vibes', cursive"
                            fontSize="58"
                          >
                            El Segundo High School
                          </text>
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </motion.h1>                {/* Second line - ASB */}
                <motion.div 
                  className="mt-8 block text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: textFadingOut ? 0 : 1, 
                    y: textFadingOut ? -15 : 0,
                    scale: textFadingOut ? 0.95 : 1
                  }}
                  transition={{ 
                    delay: textFadingOut ? 0 : (showClouds ? 3.5 : 0.6), 
                    duration: textFadingOut ? 0.4 : 0.5,
                    ease: textFadingOut ? "easeIn" : "easeOut"
                  }}
                >
                  <motion.h1
                    className="font-['Great_Vibes',_cursive] text-8xl md:text-9xl lg:text-[10rem] font-bold text-white"
                    style={{ 
                      filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5))',
                      WebkitTextStroke: '0.8px rgba(0, 0, 0, 0.3)'
                    }}
                    initial={{ filter: "blur(2px)" }}
                    animate={{ 
                      filter: textFadingOut ? "blur(4px)" : "blur(0px)",
                      opacity: textFadingOut ? 0 : 1,
                      y: textFadingOut ? -10 : 0,
                      scale: textFadingOut ? 0.95 : 1
                    }}                    transition={{ 
                      delay: textFadingOut ? 0 : (showClouds ? 3.0 : 0.5), 
                      duration: textFadingOut ? 0.4 : 0.8,
                      ease: textFadingOut ? "easeIn" : "easeOut"
                    }}>
                    {showClouds ? (
                      // Drawing animation for cloud animation (first load/refresh)
                      <div className="relative">
                        {/* Invisible text to maintain layout */}
                        <span className="invisible whitespace-nowrap">ASB</span>
                        
                        {/* SVG Text Drawing Animation */}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: textFadingOut ? 0 : 1,
                            scale: textFadingOut ? 0.95 : 1,
                            y: textFadingOut ? -10 : 0
                          }}
                          transition={{ 
                            delay: textFadingOut ? 0 : 3.3, 
                            duration: textFadingOut ? 0.4 : 0.3,
                            ease: textFadingOut ? "easeIn" : "easeOut"
                          }}
                        >
                          <svg width="100%" height="100%" viewBox="0 0 250 140" className="absolute inset-0">
                            <motion.text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="none"
                              stroke="white"
                              strokeWidth="2.5"
                              fontFamily="'Great Vibes', cursive"
                              fontSize="100"
                              fontWeight="bold"
                              className="text-shadow-sm"
                              initial={{ strokeDasharray: 400, strokeDashoffset: 400 }}
                              animate={{ 
                                strokeDashoffset: textFadingOut ? 400 : 0,
                                opacity: textFadingOut ? 0 : 1
                              }}
                              transition={{ 
                                delay: textFadingOut ? 0 : 4.5, 
                                duration: textFadingOut ? 0.4 : 2.0,
                                ease: textFadingOut ? "easeIn" : "easeOut"
                              }}
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
                              initial={{ opacity: 0 }}
                              animate={{ 
                                opacity: textFadingOut ? 0 : 1,
                                scale: textFadingOut ? 0.9 : 1
                              }}
                              transition={{ 
                                delay: textFadingOut ? 0 : 6.5, 
                                duration: textFadingOut ? 0.4 : 0.3,
                                ease: textFadingOut ? "easeIn" : "easeOut"
                              }}
                            >
                              ASB
                            </motion.text>
                          </svg>
                        </motion.div>
                      </div>                    ) : (
                      // Direct fade-in for internal navigation - matching finished SVG text
                      <div className="relative">
                        {/* Invisible text to maintain layout */}
                        <span className="invisible whitespace-nowrap">ASB</span>
                        
                        {/* Finished SVG Text - Direct fade-in */}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.6 }}
                        >
                          <svg width="100%" height="100%" viewBox="0 0 250 140" className="absolute inset-0">
                            <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="white"
                              fontFamily="'Great Vibes', cursive"
                              fontSize="100"
                              fontWeight="bold"
                            >
                              ASB
                            </text>
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </motion.h1>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      <div 
        className="min-h-screen w-screen relative flex items-center justify-center overflow-hidden"
        style={{
          zIndex: 20, // Increased z-index to ensure background comes above animation after it completes
          backgroundImage: "none", // Ensure no background image is applied
        }}
      >
        {/* Vignette effects overlay - video is now persistent in App.tsx */}
        <div className="absolute inset-0 bg-black overflow-hidden">
          
          {/* Main vignette effect overlay - darker in the corners, smoother transition */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,1) 100%)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}></div>
          
          {/* Enhanced corner vignette overlays - extremely dark corners with very sharp fade */}
          <div className="absolute top-0 left-0 w-2/3 h-2/3" style={{
            background: 'radial-gradient(circle at top left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.99) 5%, rgba(0,0,0,0.98) 10%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute top-0 right-0 w-2/3 h-2/3" style={{
            background: 'radial-gradient(circle at top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.99) 5%, rgba(0,0,0,0.98) 10%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3" style={{
            background: 'radial-gradient(circle at bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.99) 5%, rgba(0,0,0,0.98) 10%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3" style={{
            background: 'radial-gradient(circle at bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.99) 5%, rgba(0,0,0,0.98) 10%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
          }}></div>
          
          {/* Diagonal cross-corner gradients for seamless blending - made much darker */}
          <div className="absolute top-0 left-0 w-full h-full" style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 50%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute top-0 right-0 w-full h-full" style={{
            background: 'linear-gradient(225deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 50%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute bottom-0 left-0 w-full h-full" style={{
            background: 'linear-gradient(45deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 50%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute bottom-0 right-0 w-full h-full" style={{
            background: 'linear-gradient(315deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 50%)',
            pointerEvents: 'none',
          }}></div>
          
          {/* Additional edge gradients for extremely dark edges */}
          <div className="absolute top-0 inset-x-0 h-2/5" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute bottom-0 inset-x-0 h-2/5" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute left-0 inset-y-0 w-2/5" style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}></div>
          <div className="absolute right-0 inset-y-0 w-2/5" style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}></div>
          
          {/* Additional dark overlay for better contrast and deeper corner shadows */}
          <div className="absolute inset-0 bg-black/35" style={{ 
            pointerEvents: 'none',
          }}></div>

          {/* Interactive elements layout */}
          <div className="absolute bottom-0 w-full h-4/5 flex items-end justify-center pb-4 md:pb-6 lg:pb-8 z-50">
            <div className="relative w-full max-w-[100rem] flex flex-row justify-between px-4 md:px-8 lg:px-0">
              
              {/* LEFT SIDE ELEMENTS - using absolute positioning for more control */}
              <div className="relative h-full w-1/2">
                {/* Shop Element - Bottom element positioned lower and further out */}
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
                
                {/* Theater Element - Positioned slightly above shop, closer to center */}
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
              
              {/* RIGHT SIDE ELEMENTS - using absolute positioning for more control */}
              <div className="relative h-full w-1/2">
                {/* Activities Element - Bottom element positioned lower and further out */}
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
                
                {/* Information Element - Positioned slightly above activities, closer to center */}
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
          </div>        </div>
      </div>
    </>
  );
}
