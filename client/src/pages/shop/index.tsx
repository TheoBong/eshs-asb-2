import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemedPageWrapper, PrimaryButton, OutlineButton, ThemedCard, ThemedInput } from "@/components/ThemedComponents";
import { getProducts, type Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

export default function Shop() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterOrganization, setFilterOrganization] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  // Get unique categories from actual products
  const categories = ["all", ...Array.from(new Set(products.map(item => item.category)))];
  
  // Get unique organizations from actual products
  const organizations = [
    { id: "all", name: "All Organizations" },
    ...Array.from(new Set(products.map(item => item.organization)))
      .map(org => ({ id: org.toLowerCase(), name: org }))
  ];
  
  // Handle search and filtering
  const filteredItems = products.filter(item => {
    // Filter by search term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    
    // Filter by organization
    const matchesOrganization = filterOrganization === "all" || 
                               item.organization.toLowerCase() === filterOrganization;
    
    // Filter by tab
    const matchesTab = activeTab === "all" || 
                      (activeTab === "apparel" && item.category.toLowerCase().includes("apparel")) ||
                      (activeTab === "accessories" && item.category.toLowerCase().includes("accessories")) ||
                      (activeTab === "jewelry" && item.category.toLowerCase().includes("jewelry"));
    
    return matchesSearch && matchesCategory && matchesOrganization && matchesTab;
  });
  
  const handleProductClick = (productId: string) => {
    setLocation(`/shop/product/${productId}`);
  };  // Use cart count from CartContext
  const { cartCount } = useCart();

  const handleCartClick = () => {
    sessionStorage.setItem('cart-referrer', '/shop');
    setLocation("/shop/cart");
  };
    const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    setLocation("/");
  };
  return (
    <ThemedPageWrapper pageType="shop">
      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>    {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Transparent back button with title */}          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
              School Shop
            </h1>
          </div>

          {/* Important Shopping Information */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-blue-400/50 bg-blue-500/20">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white">Free Shipping on Orders Over $50</h3>
                  <span className="text-sm text-gray-300">Offer</span>
                </div>
                <p className="text-sm mt-2 text-gray-200">Get free standard shipping on all orders over $50. No promo code needed!</p>
              </div>
              <div className="p-4 rounded-lg border border-green-400/50 bg-green-500/20">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white">Student Discounts Available</h3>
                  <span className="text-sm text-gray-300">Discount</span>
                </div>
                <p className="text-sm mt-2 text-gray-200">Current students get 15% off with valid student ID at pickup.</p>
              </div>
              <div className="p-4 rounded-lg border border-amber-400/50 bg-amber-500/20">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white">Pickup Available at School Office</h3>
                  <span className="text-sm text-gray-300">Pickup</span>
                </div>
                <p className="text-sm mt-2 text-gray-200">Order online and pick up your items during school hours at the main office.</p>
              </div>
            </div>
          </div>

          <br />


          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-white">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <ThemedCard className="p-6 text-center mb-8">
              <div className="text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Products</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <PrimaryButton onClick={() => window.location.reload()}>
                Try Again
              </PrimaryButton>
            </ThemedCard>
          )}          {!loading && !error && (
            <>
              {/* Filter and Navigation */}
              <div className="mb-8">
                <div className="flex items-center mt-6">
                  {/* Tab Navigation */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl h-10">
                      <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white h-8">All Products</TabsTrigger>
                      <TabsTrigger value="apparel" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white h-8">Apparel</TabsTrigger>
                      <TabsTrigger value="accessories" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white h-8">Accessories</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {/* Cart Button - Inline with tabs */}
                  <PrimaryButton 
                    onClick={handleCartClick} 
                    className="bg-white/10 hover:bg-white/20 text-white shadow-xl border border-white/20 backdrop-blur-xl px-4 h-10 text-sm font-medium rounded-lg flex items-center space-x-2 ml-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
                  </PrimaryButton>
                </div>
              </div>
              
              {/* Product Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">              {filteredItems.map(item => (
                  <ThemedCard 
                    key={item._id} 
                    className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-2xl transition-transform hover:scale-[1.01] cursor-pointer"
                    onClick={() => handleProductClick(item._id)}
                  >{/* Product Image */}
                    <div className="h-48 bg-gray-900 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300?text=Product+Image";
                        }}
                      />
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-white">{item.name}</CardTitle>                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xl font-bold text-blue-400">${item.price.toFixed(2)}</span>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                      <div className="text-xs text-gray-400">
                        {organizations.find(org => org.id === item.organization)?.name}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t pt-4">
                      <PrimaryButton className="w-full">
                        View Details
                      </PrimaryButton>
                    </CardFooter>
                  </ThemedCard>
                ))}
              </div>
            ) : (            <ThemedCard className="p-12 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                  <p className="text-gray-300">Try adjusting your filters or search terms</p>
                  
                  <OutlineButton
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("all");
                      setFilterOrganization("all");
                      setActiveTab("all");
                    }}
                  >
                    Reset Filters
                  </OutlineButton>
                </div>
              </ThemedCard>            )}
            </>
          )}        </div>
      </div>

    </ThemedPageWrapper>
  );
}
