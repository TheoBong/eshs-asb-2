import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton, ThemedInput } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Mock product data (in a real app, this would come from an API)
const productsData = {
  "1": {
    id: 1,
    name: "El Segundo Eagles T-Shirt",
    price: 25.99,
    category: "Apparel",
    description: "Comfortable cotton t-shirt with school logo. Show your school spirit with this high-quality shirt featuring the El Segundo Eagles logo on the front and mascot on the back.",
    inStock: true,
    rating: 4.8,
    images: ["/api/placeholder/500/500", "/api/placeholder/500/500", "/api/placeholder/500/500"],
    organization: "Athletics Department",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "White", "Gray"],
    details: [
      "100% cotton material",
      "Screen printed logo",
      "Machine washable",
      "Unisex fit",
      "Made in USA"
    ],
    reviews: [
      {
        id: 1,
        user: "John S.",
        rating: 5,
        comment: "Great quality shirt! The sizing is accurate and the material is comfortable."
      },
      {
        id: 2,
        user: "Emily R.",
        rating: 4,
        comment: "Nice shirt, I like the design. Washes well without fading."
      }
    ]
  },
  "2": {
    id: 2,
    name: "School Hoodie",
    price: 45.99,
    category: "Apparel",
    description: "Stay warm while showing your school spirit with this comfortable hoodie featuring the El Segundo High School logo.",
    inStock: true,
    rating: 4.9,
    images: ["/api/placeholder/500/500", "/api/placeholder/500/500"],
    organization: "Student Council",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Gray"],
    details: [
      "80% cotton, 20% polyester",
      "Front pocket",
      "Adjustable hood",
      "Printed logo on front and sleeve",
      "Machine washable"
    ],
    reviews: [
      {
        id: 1,
        user: "Mike T.",
        rating: 5,
        comment: "This hoodie is super comfortable and keeps me warm during morning classes."
      }
    ]
  },
  "3": {
    id: 3,
    name: "Eagles Water Bottle",
    price: 15.99,
    category: "Accessories",
    description: "Stainless steel water bottle with school logo. Keep your drinks cold for up to 24 hours or hot for up to 12 hours.",
    inStock: true,
    rating: 4.7,
    images: ["/api/placeholder/500/500"],
    organization: "Environmental Club",
    sizes: ["One Size"],
    colors: ["Silver", "Blue", "Black"],
    details: [
      "24oz capacity",
      "Double-walled stainless steel",
      "BPA free",
      "Leak-proof lid",
      "School logo printed on side"
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah L.",
        rating: 5,
        comment: "Great bottle! Keeps water cold all day and doesn't leak in my backpack."
      }
    ]
  }
};

export default function ProductPage() {
  const [match, params] = useRoute("/shop/product/:id");
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Get product data based on URL parameter
  const product = params?.id ? productsData[params.id as keyof typeof productsData] : null;
  if (!product) {
    return (
      <ThemedPageWrapper pageType="shop">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">Product Not Found</h2>
            <p className="mb-4 text-gray-300">The product you're looking for doesn't exist or has been removed.</p>
            <PrimaryButton onClick={() => setLocation("/shop")}>Return to Shop</PrimaryButton>
          </div>
        </div>
      </ThemedPageWrapper>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive"
      });
      return;
    }

    if (!selectedColor && product.colors.length > 1) {
      toast({
        title: "Please select a color",
        description: "You need to select a color before adding to cart",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you'd add to cart in state/context or send to API
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} (${selectedSize}, ${selectedColor}) added to your cart`,
    });
    
    // Navigate to cart page after short delay
    setTimeout(() => {
      setLocation("/shop/cart");
    }, 1500);
  };

  const handleBackClick = () => {
    setLocation("/shop");
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
      </div>

      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Glassmorphism back button with title */}
          <div className="flex items-center mb-6">
            <OutlineButton
              onClick={handleBackClick}
              className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Shop
            </OutlineButton>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Product Details</h1>
          </div>

          {/* Product Details */}
          <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
                  <img
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/500?text=Product+Image";
                    }}
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {product.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative rounded-md overflow-hidden h-20 w-20 border-2 ${
                          idx === activeImageIndex ? "border-blue-400" : "border-white/20"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - view ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/100?text=Thumbnail";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Header information */}
                <div>
                  <div className="flex items-center justify-between">
                    <Badge className="mb-2 bg-blue-600 text-white">{product.category}</Badge>
                    <Badge variant={product.inStock ? "outline" : "secondary"} className={product.inStock ? "border-green-400 text-green-400" : "bg-red-600 text-white"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-white">{product.name}</h1>
                  <p className="text-sm text-gray-300 mb-2">By {product.organization}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-500"
                          } fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm ml-2 text-gray-300">
                      {product.rating} ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">${product.price}</div>
                </div>

                <div className="space-y-4">
                  {/* Size Selection */}
                  {product.sizes.length > 1 && (
                    <div>
                      <Label htmlFor="size-select" className="block text-sm font-medium mb-2 text-gray-200">
                        Select Size
                      </Label>
                      <RadioGroup
                        id="size-select"
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                        className="flex flex-wrap gap-2"
                      >
                        {product.sizes.map((size: string) => (
                          <div key={size} className="flex items-center">
                            <RadioGroupItem id={`size-${size}`} value={size} className="hidden" />
                            <Label
                              htmlFor={`size-${size}`}
                              className={`px-4 py-2 border rounded-md cursor-pointer text-sm transition-colors ${
                                selectedSize === size
                                  ? "border-blue-400 bg-blue-600 text-white"
                                  : "border-white/20 text-gray-200 hover:border-blue-400 hover:text-blue-400"
                              }`}
                            >
                              {size}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors.length > 1 && (
                    <div>
                      <Label htmlFor="color-select" className="block text-sm font-medium mb-2 text-gray-200">
                        Select Color
                      </Label>
                      <RadioGroup
                        id="color-select"
                        value={selectedColor}
                        onValueChange={setSelectedColor}
                        className="flex flex-wrap gap-2"
                      >
                        {product.colors.map((color: string) => (
                          <div key={color} className="flex items-center">
                            <RadioGroupItem id={`color-${color}`} value={color} className="hidden" />
                            <Label
                              htmlFor={`color-${color}`}
                              className={`px-4 py-2 border rounded-md cursor-pointer text-sm transition-colors ${
                                selectedColor === color
                                  ? "border-blue-400 bg-blue-600 text-white"
                                  : "border-white/20 text-gray-200 hover:border-blue-400 hover:text-blue-400"
                              }`}
                            >
                              {color}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="block text-sm font-medium mb-2 text-gray-200">
                      Quantity
                    </Label>
                    <div className="flex items-center">
                      <OutlineButton
                        type="button"
                        size="icon"
                        className="rounded-r-none bg-white/5 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </OutlineButton>
                      <input
                        id="quantity"
                        type="number"
                        className="h-9 w-16 rounded-none text-center border-y border-x-0 border-white/20 bg-white/5 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min={1}
                        max={10}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1 && val <= 10) {
                            setQuantity(val);
                          }
                        }}
                      />
                      <OutlineButton
                        type="button"
                        size="icon"
                        className="rounded-l-none bg-white/5 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                        onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                        disabled={quantity >= 10}
                      >
                        +
                      </OutlineButton>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="pt-4">
                    <PrimaryButton 
                      size="lg" 
                      className="w-full" 
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </ThemedCard>

          {/* Product Details Tabs */}
          <div className="mt-8">
            <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                  <TabsTrigger value="description" className="text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Reviews ({product.reviews.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">Product Description</h3>
                      <p className="text-gray-300 leading-relaxed">{product.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">Product Details</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {product.details.map((detail: string, index: number) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6 p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Customer Reviews</h3>
                    {product.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {product.reviews.map((review: any) => (
                          <div key={review.id} className="border-b border-white/10 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{review.user}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "text-yellow-400" : "text-gray-500"
                                    } fill-current`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-300">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </ThemedCard>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
