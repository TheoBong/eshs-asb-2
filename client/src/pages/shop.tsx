import { useLocation } from "wouter";

export default function Shop() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-500/10 animate-slide-in">
      {/* Back Navigation */}
      <nav className="p-6">
        <button 
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-blue-600 hover:text-orange-500 transition-colors font-semibold"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Campus</span>
        </button>
      </nav>
      
      {/* Shop Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <i className="fas fa-store text-6xl text-orange-500 mb-4"></i>
            <h1 className="font-bold text-4xl text-gray-800 mb-4">
              School Merchandise Shop
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              This is a placeholder page for the school merchandise shop. 
              Here you would find all the amazing products showcased in our interactive display!
            </p>
          </div>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <i className="fas fa-tshirt text-3xl text-orange-500 mb-3"></i>
              <h3 className="font-semibold text-gray-800 mb-2">Apparel</h3>
              <p className="text-gray-600 text-sm">School branded clothing and accessories</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <i className="fas fa-graduation-cap text-3xl text-green-500 mb-3"></i>
              <h3 className="font-semibold text-gray-800 mb-2">Academic</h3>
              <p className="text-gray-600 text-sm">Educational supplies and materials</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <i className="fas fa-gift text-3xl text-blue-500 mb-3"></i>
              <h3 className="font-semibold text-gray-800 mb-2">Gifts</h3>
              <p className="text-gray-600 text-sm">Special items and commemorative products</p>
            </div>
          </div>
          
          <div className="bg-orange-500/10 rounded-xl p-6">
            <p className="text-gray-700">
              <i className="fas fa-info-circle text-orange-500 mr-2"></i>
              This page is ready for your product catalog implementation!
            </p>
          </div>
        </div>
      </div>
      
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </div>
  );
}
