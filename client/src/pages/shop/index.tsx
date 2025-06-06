import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemedPageWrapper, PrimaryButton, OutlineButton, ThemedCard, ThemedInput } from "@/components/ThemedComponents";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Mock data for organizations
const organizations = [
  { id: "all", name: "All Organizations" },
  { id: "athletics", name: "Athletics Department" },
  { id: "asb", name: "Associated Student Body" },
  { id: "drama", name: "Drama Club" },
  { id: "band", name: "Band" },
  { id: "cheer", name: "Cheerleading" },
  { id: "enviro", name: "Environmental Club" },
];

// Mock merchandise data
const merchandiseItems = [
  {
    id: 1,
    name: "El Segundo Eagles T-Shirt",
    price: 25.99,
    category: "Apparel",
    organization: "athletics",
    image: "/api/placeholder/300/300",
    description: "Comfortable cotton t-shirt with school logo",
    inStock: true,
    rating: 4.8,
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    id: 2,
    name: "School Hoodie",
    price: 45.99,
    category: "Apparel",
    organization: "asb",
    image: "/api/placeholder/300/300",
    description: "Warm hoodie perfect for school spirit",
    inStock: true,
    rating: 4.9,
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true
  },
  {
    id: 3,
    name: "Eagles Water Bottle",
    price: 15.99,
    category: "Accessories",
    organization: "enviro",
    image: "/api/placeholder/300/300",
    description: "Stainless steel water bottle with school logo",
    inStock: true,
    rating: 4.7,
    featured: false
  },
  {
    id: 4,
    name: "School Notebook Set",
    price: 12.99,
    category: "Academic",
    organization: "asb",
    image: "/api/placeholder/300/300",
    description: "Set of 3 notebooks with school branding",
    inStock: true,
    rating: 4.5,
    featured: false
  },
  {
    id: 5,
    name: "Drama Club Sweatshirt",
    price: 39.99,
    category: "Apparel",
    organization: "drama",
    image: "/api/placeholder/300/300",
    description: "Comfortable sweatshirt for drama enthusiasts",
    inStock: true,
    rating: 4.6,
    sizes: ["S", "M", "L", "XL"],
    featured: false
  },
  {
    id: 6,
    name: "Band T-Shirt",
    price: 22.99,
    category: "Apparel",
    organization: "band",
    image: "/api/placeholder/300/300",
    description: "T-shirt featuring the school band logo",
    inStock: true,
    rating: 4.4,
    sizes: ["S", "M", "L", "XL"],
    featured: false
  },
  {
    id: 7,
    name: "Eagles Cap",
    price: 18.99,
    category: "Accessories",
    organization: "athletics",
    image: "/api/placeholder/300/300",
    description: "Adjustable cap with embroidered school logo",
    inStock: true,
    rating: 4.7,
    featured: true
  },
  {
    id: 8,
    name: "Cheer Squad Pom-Poms",
    price: 14.99,
    category: "Spirit",
    organization: "cheer",
    image: "/api/placeholder/300/300",
    description: "Blue and white pom-poms for games and events",
    inStock: false,
    rating: 4.8,
    featured: false
  }
];

export default function Shop() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterOrganization, setFilterOrganization] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(merchandiseItems.map(item => item.category)))];
  
  // Handle search and filtering
  const filteredItems = merchandiseItems.filter(item => {
    // Filter by search term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    
    // Filter by organization
    const matchesOrganization = filterOrganization === "all" || item.organization === filterOrganization;
    
    // Filter by tab
    const matchesTab = activeTab === "all" || 
                      (activeTab === "featured" && item.featured) || 
                      (activeTab === "apparel" && item.category === "Apparel") ||
                      (activeTab === "accessories" && item.category === "Accessories");
    
    return matchesSearch && matchesCategory && matchesOrganization && matchesTab;
  });
  
  const handleProductClick = (productId: number) => {
    setLocation(`/shop/product/${productId}`);
  };

  const handleCartClick = () => {
    setLocation("/shop/cart");
  };
  
  const handleBackClick = () => {
    setLocation("/");
  };
  return (
    <ThemedPageWrapper pageType="shop">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src={schoolVideo} type="video/mp4" />
        </video>
      </div>      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-85 -z-10"></div>      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Transparent back button with title */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300"
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
            </Button>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
              School Shop
            </h1>
          </div>

          {/* Shop Hub Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Eagles Spirit Shop
                </h2>
                <p className="mb-4">
                  Show your school pride with official El Segundo High School merchandise
                </p>
                <div className="flex space-x-2">
                  <PrimaryButton
                    onClick={() => setActiveTab("featured")}
                  >
                    View Featured Items
                  </PrimaryButton>
                  <OutlineButton
                    onClick={() => setActiveTab("apparel")}
                  >
                    Shop Apparel
                  </OutlineButton>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Featured Products Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Featured Merchandise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchandiseItems.filter(item => item.featured).map((item) => (
                <ThemedCard
                  key={item.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-2xl transition-transform hover:scale-[1.01] cursor-pointer"
                  onClick={() => handleProductClick(item.id)}
                >
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
                  <CardHeader className="relative pb-2">
                    <div className="absolute top-4 right-4">
                      <Badge variant="default" className="bg-orange-500">Featured</Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {item.name}
                    </CardTitle>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xl font-bold text-blue-400">${item.price}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                    <div className="text-xs text-gray-400">
                      {organizations.find(org => org.id === item.organization)?.name}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <PrimaryButton className="w-full">
                      Add to Cart
                    </PrimaryButton>
                  </CardFooter>
                </ThemedCard>
              ))}
            </div>
          </div>

          {/* Filter and Navigation */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search Box */}
              <div>
                <ThemedInput
                  type="text"
                  placeholder="Search merchandise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Mobile Filters Toggle Button */}
              <div className="md:hidden">
                <OutlineButton 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </OutlineButton>
              </div>
              
              {/* Filters - Desktop visible always, mobile conditionally */}
              <div className={`md:flex md:space-x-3 ${showFilters ? 'block' : 'hidden md:block'}`}>
                {/* Category Filter */}
                <div className="w-full md:w-auto mb-2 md:mb-0">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                  {/* Organization Filter */}
                <div className="w-full md:w-auto">
                  <Select value={filterOrganization} onValueChange={setFilterOrganization}>
                    <SelectTrigger className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* View Cart Button (Desktop) */}
              <div className="hidden md:flex justify-end">
                <PrimaryButton onClick={handleCartClick} className="space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>View Cart (2)</span>
                </PrimaryButton>
              </div>
            </div>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="apparel">Apparel</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Product Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (                <ThemedCard 
                  key={item.id} 
                  className="hover:shadow-xl transition-transform hover:scale-[1.02] cursor-pointer overflow-hidden"
                  onClick={() => handleProductClick(item.id)}
                >                  {/* Product Image */}
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
                    <div className="flex justify-between">
                      <div className="flex space-x-1">
                        {item.featured && <Badge variant="default" className="bg-orange-500">Featured</Badge>}
                        {!item.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                      </div>
                      <div>
                        <svg className="w-5 h-5 text-yellow-400 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 15.585l-5.445 3.178a1 1 0 01-1.475-1.029l1.341-6.175-4.502-3.63a1 1 0 01.564-1.747l6.204-.528L9.832 1.09a1 1 0 011.897 0l2.53 5.304 6.205.528a1 1 0 01.564 1.748l-4.503 3.63 1.341 6.175a1 1 0 01-1.475 1.029L10 15.585z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>                    <CardTitle className="text-lg font-semibold text-white mt-2">{item.name}</CardTitle>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xl font-bold text-blue-400">${item.price}</span>
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
            </ThemedCard>
          )}
          
          {/* Important Shopping Information */}
          <h2 className="text-2xl font-bold text-white mb-6">Shopping Information</h2>
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
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
