import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton, ThemedInput } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";
import { getProduct } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

export default function ProductPage() {
  const [match, params] = useRoute("/shop/product/:id");
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return;
      
      try {
        setLoading(true);
        const data = await getProduct(params.id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);  if (loading) {
    return (
      <ThemedPageWrapper pageType="shop">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">Loading Product...</h2>
            <p className="mb-4 text-gray-300">Please wait while we fetch the product details</p>
          </div>
        </div>
      </ThemedPageWrapper>
    );
  }
  
  if (error || !product) {
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
  // Cart utility functions
  const getCartFromCookies = (): any[] => {
    try {
      const cartData = document.cookie
        .split('; ')
        .find(row => row.startsWith('cart='))
        ?.split('=')[1];
      return cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
    } catch {
      return [];
    }
  };

  const saveCartToCookies = (items: any[]) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(items))}; path=/; expires=${expires.toUTCString()}`;
  };

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

    // Add the product to the cart using CartContext
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      type: 'product'
    });

    // Show toast notification
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} (${selectedSize || 'No size'}, ${selectedColor || 'No color'}) added to your cart`,
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
              {/* Product Images */}              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
                  <img
                    src={activeImageIndex === 0 ? 
                      product.image : 
                      (product.images && product.images.length > 0 ? 
                        product.images[activeImageIndex - 1] : 
                        product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/500?text=Product+Image";
                    }}
                  />
                </div>

                {/* Thumbnail Images - Include main image as first thumbnail and any additional images */}
                {((product.images && product.images.length > 0) || product.image) && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {/* Main image thumbnail */}
                    <button
                      onClick={() => setActiveImageIndex(0)}
                      className={`relative rounded-md overflow-hidden h-20 w-20 border-2 ${
                        activeImageIndex === 0 ? "border-blue-400" : "border-white/20"
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={`${product.name} - main view`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/100?text=Thumbnail";
                        }}
                      />
                    </button>
                    
                    {/* Additional image thumbnails */}
                    {product.images && product.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx + 1)}
                        className={`relative rounded-md overflow-hidden h-20 w-20 border-2 ${
                          idx + 1 === activeImageIndex ? "border-blue-400" : "border-white/20"
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
                <div>                  <div className="flex items-center justify-between">
                    <Badge className="mb-2 bg-blue-600 text-white">{product.category}</Badge>
                    <Badge variant={product.stock > 0 ? "outline" : "secondary"} className={product.stock > 0 ? "border-green-400 text-green-400" : "bg-red-600 text-white"}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-white">{product.name}</h1>
                  <p className="text-sm text-gray-300 mb-2">By {product.organization}</p>
                  <div className="mb-4">
                    {product.stock > 0 && (
                      <p className="text-sm text-gray-300">
                        {product.stock} items available
                      </p>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-blue-400">${product.price.toFixed(2)}</div>
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
                  </div>                  {/* Add to Cart Button */}
                  <div className="pt-4">
                    <PrimaryButton 
                      size="lg" 
                      className="w-full bg-white/10 hover:bg-blue-600/80 backdrop-blur-xl border border-white/20 shadow-lg" 
                      onClick={handleAddToCart}
                      disabled={!(product.stock > 0)}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </ThemedCard>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
