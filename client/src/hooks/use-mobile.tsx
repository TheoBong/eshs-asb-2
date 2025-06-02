import * as React from "react"

// Breakpoints matching Tailwind default breakpoints
export enum Breakpoint {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

/**
 * Detects iOS and Safari specifically for targeted optimizations
 */
export function useIOSDetection() {
  const [isIOS, setIsIOS] = React.useState(false);
  const [isSafari, setIsSafari] = React.useState(false);
  
  React.useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                
    // Detect Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    setIsIOS(iOS);
    setIsSafari(isSafari);
  }, []);
  
  return { isIOS, isSafari, isIOSorSafari: isIOS || isSafari };
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${Breakpoint.MD - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < Breakpoint.MD)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < Breakpoint.MD)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }
    
    // Use a throttle mechanism to prevent excessive updates during rapid resizing
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledCheck = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkBreakpoint, 16); // ~60fps
    };
    
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    mql.addEventListener("change", throttledCheck)
    checkBreakpoint() // Initial check
    
    return () => {
      mql.removeEventListener("change", throttledCheck)
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [breakpoint])

  return !!isBelow
}

export function useResponsiveValue<T>(options: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}): T {
  const [currentValue, setCurrentValue] = React.useState<T>(options.base);
  
  React.useEffect(() => {
    const checkValue = () => {
      const width = window.innerWidth;
      
      // Check from smallest to largest
      if (width < Breakpoint.SM && options.sm !== undefined) {
        setCurrentValue(options.sm);
      } else if (width < Breakpoint.MD && options.md !== undefined) {
        setCurrentValue(options.md);
      } else if (width < Breakpoint.LG && options.lg !== undefined) {
        setCurrentValue(options.lg);
      } else if (width < Breakpoint.XL && options.xl !== undefined) {
        setCurrentValue(options.xl);
      } else if (width < Breakpoint.XXL && options.xxl !== undefined) {
        setCurrentValue(options.xxl);
      } else {
        setCurrentValue(options.base);
      }
    };
    
    // Check immediately
    checkValue();
    
    // Listen for changes
    const handleResize = () => checkValue();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [options.base, options.sm, options.md, options.lg, options.xl, options.xxl]);
  
  return currentValue;
}

/**
 * Returns the appropriate icon layout parameters based on screen size
 * Optimized for mobile devices to ensure icons are properly positioned
 */
export function useIconLayout() {
  const isBelowSM = useBreakpoint(Breakpoint.SM);
  const isBelowMD = useBreakpoint(Breakpoint.MD);
  
  const isMobile = isBelowSM;
  const isTablet = isBelowMD && !isBelowSM;
  
  // Check for screen orientation to optimize vertical spacing
  const [isPortrait, setIsPortrait] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    // Initial check for portrait mode
    setIsPortrait(window.innerHeight > window.innerWidth);
    
    // Update on resize
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    // Bottom positioning - Increased spacing for mobile devices to prevent overlap
    shopBottom: useResponsiveValue({
      base: '0', 
      sm: '1.5rem', // Increased from 0.5rem to provide more space on small devices
      md: '0'
    }),
    theaterBottom: useResponsiveValue({
      base: '7rem',
      sm: '19rem', // Increased from 14rem to 19rem (moved up by 5rem)
      md: '6rem',   // Slightly increased for better spacing on tablets
      lg: '6rem'
    }),
    activitiesBottom: useResponsiveValue({
      base: '0',
      sm: '1.5rem', // Increased from 0.5rem to provide more space on small devices
      md: '0'
    }),
    informationBottom: useResponsiveValue({
      base: '7rem',
      sm: '19rem', // Increased from 14rem to 19rem (moved up by 5rem)
      md: '6rem',   // Slightly increased for better spacing on tablets
      lg: '6rem'
    }),
    
    // Side positioning - Optimized for better icon distribution
    shopLeft: useResponsiveValue({
      base: '12rem',
      sm: '0.5rem', // Moved slightly further left
      md: '6rem',
      lg: '8rem'
    }),
    theaterLeft: useResponsiveValue({
      base: '25rem',
      sm: '1.5rem', // Moved slightly right for better alignment with shop icon
      md: '12rem',
      lg: '18rem'
    }),
    activitiesRight: useResponsiveValue({
      base: '12rem',
      sm: '0.5rem', // Moved slightly further right
      md: '6rem',
      lg: '8rem'
    }),
    informationRight: useResponsiveValue({
      base: '25rem',
      sm: '1.5rem', // Moved slightly left for better alignment with activities icon
      md: '12rem',
      lg: '18rem'
    }),
    
    // Mobile-specific layout adjustments
    isMobileLayout: isMobile,
    useCompactLayout: isMobile || isTablet,
    isPortraitMode: isPortrait,
    
    // Calculate actual vertical spacing needed based on device orientation and size
    verticalIconSpacing: isPortrait ? 
      (isMobile ? '12rem' : isTablet ? '8rem' : '6rem') : 
      (isMobile ? '9rem' : isTablet ? '7rem' : '5rem')
  };
}
