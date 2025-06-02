import { useState } from "react";
import { useLocation } from "wouter";
import schoolVideo from "../../../attached_assets/school2.mp4";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";

// Mock merchandise data
const merchandiseItems = [
  {
    id: 1,
    name: "El Segundo Eagles T-Shirt",
    price: 25.99,
    category: "Apparel",
    image: "/api/placeholder/300/300",
    description: "Comfortable cotton t-shirt with school logo",
    inStock: true,
    rating: 4.8,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "School Hoodie",
    price: 45.99,
    category: "Apparel",
    image: "/api/placeholder/300/300",
    description: "Warm hoodie perfect for school spirit",
    inStock: true,
    rating: 4.9,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    name: "Eagles Water Bottle",
    price: 15.99,
    category: "Accessories",
    image: "/api/placeholder/300/300",
    description: "Stainless steel water bottle with school logo",
    inStock: true,
    rating: 4.7,
    sizes: ["One Size"]
  },
  {
    id: 4,
    name: "School Notebook Set",
    price: 12.99,
    category: "Academic",
    image: "/api/placeholder/300/300",
    description: "Set of 3 notebooks with school branding",
    inStock: false,
    rating: 4.5,
    sizes: ["One Size"]
  },
  {
    id: 5,
    name: "Eagles Baseball Cap",
    price: 22.99,
    category: "Accessories",
    image: "/api/placeholder/300/300",
    description: "Adjustable baseball cap with embroidered logo",
    inStock: true,
    rating: 4.6,
    sizes: ["One Size"]
  },
  {
    id: 6,
    name: "School Backpack",
    price: 55.99,
    category: "Academic",
    image: "/api/placeholder/300/300",
    description: "Durable backpack with multiple compartments",
    inStock: true,
    rating: 4.8,
    sizes: ["One Size"]
  },
  {
    id: 7,
    name: "Eagles Sweatpants",
    price: 35.99,
    category: "Apparel",
    image: "/api/placeholder/300/300",
    description: "Comfortable sweatpants for lounging",
    inStock: true,
    rating: 4.4,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "School Mug",
    price: 9.99,
    category: "Accessories",
    image: "/api/placeholder/300/300",
    description: "Ceramic mug with school colors",
    inStock: true,
    rating: 4.3,
    sizes: ["One Size"]
  }
];

export default function Shop() {
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleBackClick = () => {
    // Instant navigation with no animation
    setLocation("/");
  };

  // Filter and sort logic
  const filteredAndSortedItems = merchandiseItems
    .filter(item => {
      const matchesCategory = filterCategory === "all" || item.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ["all", ...Array.from(new Set(merchandiseItems.map(item => item.category)))];

  return (
    <>
      {/* Background Video - same as home page */}
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
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header with navigation */}
        <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleBackClick}
                variant="ghost"
                className="flex items-center space-x-2 text-sky-700 hover:text-orange-500 transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Campus</span>
              </Button>
              
              <h1 className="font-['Great_Vibes',_cursive] text-3xl md:text-4xl text-sky-800">
                Eagles Shop
              </h1>
              
              <div className="w-24"></div> {/* Spacer for centering */}
            </div>
          </div>
        </header>

        {/* Shop Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Filter and Search Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 mb-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <Input
                  type="text"
                  placeholder="Search merchandise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              Showing {filteredAndSortedItems.length} of {merchandiseItems.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} className="h-full bg-white/90 backdrop-blur-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">{item.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-sky-700">${item.price}</span>
                    <Badge variant={item.inStock ? "default" : "secondary"}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-sky-700 hover:bg-orange-500 text-white"
                    disabled={!item.inStock}
                  >
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results message */}
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
