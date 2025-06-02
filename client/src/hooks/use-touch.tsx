import * as React from 'react';

type TouchState = {
  isTouched: boolean;
};

/**
 * Custom hook that provides touch detection for better touch device interaction
 * Can be used to add special effects for touch interactions that mimic hover effects
 */
export function useTouchDetection(): {
  isTouchDevice: boolean;
  touchProps: {
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  touchState: TouchState;
} {
  const [isTouchDevice, setIsTouchDevice] = React.useState<boolean>(false);
  const [touchState, setTouchState] = React.useState<TouchState>({ isTouched: false });

  // Detect touch device on mount
  React.useEffect(() => {
    const isTouch = 
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);
    
    setIsTouchDevice(isTouch);
  }, []);

  const handleTouchStart = React.useCallback(() => {
    setTouchState({ isTouched: true });
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    // Small delay to allow visual feedback before removing the touch state
    setTimeout(() => {
      setTouchState({ isTouched: false });
    }, 200);
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (!isTouchDevice) {
      setTouchState({ isTouched: true });
    }
  }, [isTouchDevice]);

  const handleMouseLeave = React.useCallback(() => {
    if (!isTouchDevice) {
      setTouchState({ isTouched: false });
    }
  }, [isTouchDevice]);

  return {
    isTouchDevice,
    touchProps: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
      ...(isTouchDevice ? {} : {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }),
    },
    touchState,
  };
}

/**
 * Custom hook for managing active touch/tap states
 * Helps simulate hover states on touch devices
 */
export function useTapState(): [boolean, {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}] {
  const [isActive, setIsActive] = React.useState(false);
  
  return [
    isActive,
    {
      onTouchStart: () => setIsActive(true),
      onTouchEnd: () => setTimeout(() => setIsActive(false), 300),
      onTouchCancel: () => setIsActive(false),
      onMouseEnter: () => setIsActive(true),
      onMouseLeave: () => setIsActive(false),
    }
  ];
}
