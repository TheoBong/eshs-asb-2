import { useState } from "react";
import { useLocation } from "wouter";
import schoolBg from "@assets/school.png";
import shopImg from "@assets/shop.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleShopClick = () => {
    setIsNavigating(true);
    setShowLoading(true);
    
    // Wait for swoop animation to complete
    setTimeout(() => {
      setLocation("/shop");
    }, 800);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleShopClick();
    }
  };

  return (
    <>
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${schoolBg})`,
          transform: isNavigating ? 'translateX(-100%)' : 'translateX(0)',
          opacity: isNavigating ? 0 : 1
        }}
      >
        {/* Overlay gradient for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10"></div>
        
        {/* Navigation Header */}
        <nav className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <i className="fas fa-graduation-cap text-2xl text-white"></i>
              <h1 className="font-bold text-xl text-white">EduHub</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-white">
              <a href="#" className="hover:text-orange-500 transition-colors">About</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Programs</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
            </div>
          </div>
        </nav>
        
        {/* Main Content Container */}
        <div className="relative z-10 text-center px-6">
          {/* Welcome Message */}
          <div className="mb-12 animate-fade-in">
            <h2 className="font-bold text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">
              Welcome to Our
              <span className="text-orange-500 ml-3">Learning Hub</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Discover amazing educational resources and merchandise in our interactive school marketplace
            </p>
          </div>
          
          {/* Interactive Shop Element */}
          <div className="relative inline-block">
            {/* Pulse Ring Animation */}
            <div className="absolute inset-0 rounded-full animate-pulse-ring border-4 border-orange-500 opacity-20"></div>
            
            {/* Shop Image with Hover Effects */}
            <div 
              className={`shop-overlay animate-float cursor-pointer transition-all duration-300 ease-out hover:transform hover:-translate-y-3 hover:scale-105 active:transform active:-translate-y-2 active:scale-102 ${
                isNavigating ? 'animate-swoop' : ''
              }`}
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                ...(isNavigating && {
                  animation: 'swoop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                })
              }}
              onClick={handleShopClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyPress}
              aria-label="Visit the school merchandise shop"
            >
              <img 
                src={shopImg}
                alt="School Merchandise Shop" 
                className="w-48 md:w-56 lg:w-64 h-auto max-w-[90vw] relative z-10"
              />
            </div>
            
            {/* Call to Action */}
            <div className="mt-6 animate-slide-up">
              <p className="font-semibold text-white text-lg mb-2 drop-shadow-md">
                <i className="fas fa-hand-pointer mr-2 text-orange-500"></i>
                Click to explore our shop!
              </p>
              <div className="flex items-center justify-center space-x-4 text-white/80 flex-wrap gap-2">
                <span className="flex items-center">
                  <i className="fas fa-tshirt mr-1"></i>
                  Merchandise
                </span>
                <span className="flex items-center">
                  <i className="fas fa-book mr-1"></i>
                  Supplies
                </span>
                <span className="flex items-center">
                  <i className="fas fa-star mr-1"></i>
                  Exclusive Items
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-6 left-6 text-white/60 hidden sm:block">
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt"></i>
            <span className="text-sm">Education District Campus</span>
          </div>
        </div>
        
        <div className="absolute bottom-6 right-6 text-white/60">
          <div className="flex items-center space-x-4">
            <i className="fab fa-facebook hover:text-orange-500 cursor-pointer transition-colors"></i>
            <i className="fab fa-twitter hover:text-orange-500 cursor-pointer transition-colors"></i>
            <i className="fab fa-instagram hover:text-orange-500 cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {showLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading shop...</p>
          </div>
        </div>
      )}
      
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </>
  );
}
