import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import { getEvents, type Event } from "@/lib/api";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Types for form data
interface FormData {
  contractForm: File | null;
  guestForm: File | null;
  studentId: File | null;
  quantity: number;
}

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  type?: 'product' | 'event';
  eventId?: string;
}

export default function EventDetails() {
  const [, setLocation] = useLocation();
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    contractForm: null,
    guestForm: null,
    studentId: null,
    quantity: 1
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  // Cart utility functions
  const getCartFromCookies = (): CartItem[] => {
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

  const saveCartToCookies = (cartItems: CartItem[]) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cartItems))}; expires=${expires.toUTCString()}; path=/`;
  };

  const addToCart = (eventItem: CartItem) => {
    const currentCart = getCartFromCookies();
    const existingItemIndex = currentCart.findIndex(item => item.eventId === eventItem.eventId);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = currentCart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + eventItem.quantity }
          : item
      );
    } else {
      updatedCart = [...currentCart, eventItem];
    }
    
    saveCartToCookies(updatedCart);
    setCart(updatedCart);
  };

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract event ID from the URL
        const currentPath = window.location.pathname;
        const matches = currentPath.match(/\/activities\/details\/(.+)$/);
        
        if (matches) {
          const id = matches[1];
          setEventId(id);
          
          // Fetch all events and find the specific one
          const eventsData = await getEvents();
          const selectedEvent = eventsData.find(e => e._id === id);
          
          if (selectedEvent) {
            setEvent(selectedEvent);
            setShowApprovalForm(selectedEvent.requiresApproval || false);
          } else {
            setError('Event not found');
          }
        } else {
          setError('Invalid event URL');
        }

        // Load cart from cookies
        setCart(getCartFromCookies());
      } catch (err) {
        console.error('Failed to load event:', err);
        setError('Failed to load event data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, []);

  const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    setLocation("/activities");
  };
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityStatus = (maxTickets?: number) => {
    if (!maxTickets) return { status: "Available", color: "bg-green-500/20 text-green-200 border-green-500/30" };
    
    // For now, assume tickets are available since we don't track sold tickets yet
    const remaining = maxTickets; // This would be calculated from actual sales in a real system
    const percentage = (remaining / maxTickets) * 100;
    
    if (percentage > 50) return { status: "Available", color: "bg-green-500/20 text-green-200 border-green-500/30" };
    if (percentage > 20) return { status: "Limited", color: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30" };
    if (percentage > 0) return { status: "Few Left", color: "bg-red-500/20 text-red-200 border-red-500/30" };
    return { status: "Sold Out", color: "bg-gray-500/20 text-gray-200 border-gray-500/30" };
  };
  const handleQuantityChange = (quantity: number) => {
    if (event) {
      // For now, allow up to 10 tickets or maxTickets if specified
      const maxAllowed = event.maxTickets ? Math.min(10, event.maxTickets) : 10;
      setFormData(prev => ({
        ...prev,
        quantity: Math.max(1, Math.min(quantity, maxAllowed))
      }));
    }
  };

  const handleFileUpload = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmitApproval = async () => {
    if (!event) return;

    // Validate required forms for approval-required events
    if (event.requiresApproval && (!formData.contractForm || !formData.studentId)) {
      // Could implement a toast notification here instead of alert
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission and approval process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Instead of alert, navigate directly back
      setLocation("/activities");
    } catch (error) {
      // Could implement error handling with toast
      setIsSubmitting(false);
    }
  };

  const handleDirectPurchase = () => {
    if (!event) return;    // Add to cart for non-approval events using cookies
    const cartItem: CartItem = {
      id: event._id,
      name: event.title,
      price: event.price,
      quantity: formData.quantity,
      type: 'event',
      eventId: event._id,
      image: "/api/placeholder/300/300" // Default image for events
    };

    addToCart(cartItem);
    setLocation("/shop/cart");
  };

  if (!event) {
    return (
      <ThemedPageWrapper pageType="information">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
        
        <div className="relative z-10 min-h-screen py-12 flex items-center justify-center">
          <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
            <p className="text-gray-300 mb-6">The event you're looking for doesn't exist.</p>
            <OutlineButton 
              onClick={handleBackClick}
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10"
            >
              Back to Activities
            </OutlineButton>
          </ThemedCard>
        </div>
      </ThemedPageWrapper>
    );
  }

  const availability = getAvailabilityStatus(event.maxTickets);

  return (
    <ThemedPageWrapper pageType="information">
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
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
      
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <OutlineButton
              onClick={handleBackClick}
              className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Activities
            </OutlineButton>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Event Details</h1>
          </div>

          {/* Event Details */}
          <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-8">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-bold text-white">{event.title}</h2>                    {event.requiresApproval && (
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-200 border-orange-500/30">
                        Requires Approval
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-300 text-lg mb-4">{event.description}</p>
                </div>
                <Badge variant="outline" className="ml-4 text-lg px-3 py-1">
                  {event.category}
                </Badge>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-200">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-200">{event.time}</span>
                  </div>
                  <div className="flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-200">{event.location}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">
                      {event.price === 0 ? "FREE" : `$${event.price}`}
                    </span>
                    {event.price > 0 && <p className="text-gray-400">per ticket</p>}
                  </div>
                    <div className={`p-4 rounded-lg border ${availability.color}`}>
                    <div className="text-center">
                      <p className="font-medium">{availability.status}</p>
                      <p className="text-sm">{event.maxTickets ? event.maxTickets : 'Unlimited'} max tickets</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {event.features && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Event Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {event.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ThemedCard>

          {/* Purchase/Approval Form */}
          <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">
                {showApprovalForm ? "Request Approval & Purchase" : "Purchase Tickets"}
              </h3>

              {/* Quantity Selector */}
              <div className="mb-6">
                <Label className="text-white text-lg mb-2 block">Number of Tickets</Label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(formData.quantity - 1)}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
                    disabled={formData.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-white min-w-[3rem] text-center">{formData.quantity}</span>                  <button
                    onClick={() => handleQuantityChange(formData.quantity + 1)}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
                    disabled={formData.quantity >= Math.min(10, event.maxTickets || 100)}
                  >
                    +
                  </button>
                  <div className="ml-4">
                    <p className="text-white text-xl font-semibold">
                      Total: {event.price === 0 ? "FREE" : `$${(event.price * formData.quantity).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Approval Forms for Dance/Events */}
              {showApprovalForm && (
                <div className="space-y-6 mb-6">
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-orange-200 mb-2">Required for Dance Events</h4>
                    <p className="text-orange-100 text-sm">
                      All dance events require manual approval. Please upload the required forms and your student ID. 
                      You will receive purchase instructions via email within 24-48 hours after review.
                    </p>
                  </div>

                  {/* Contract Form */}
                  <div>
                    <Label className="text-white text-lg mb-2 block">
                      Contract Form <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('contractForm', e.target.files?.[0] || null)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <p className="text-gray-400 text-sm mt-1">Upload signed dance contract form</p>
                  </div>

                  {/* Guest Form (Optional) */}
                  <div>
                    <Label className="text-white text-lg mb-2 block">Guest Form (Optional)</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('guestForm', e.target.files?.[0] || null)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <p className="text-gray-400 text-sm mt-1">Upload guest form if bringing a guest</p>
                  </div>

                  {/* Student ID */}
                  <div>
                    <Label className="text-white text-lg mb-2 block">
                      Student ID Photo <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('studentId', e.target.files?.[0] || null)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <p className="text-gray-400 text-sm mt-1">Upload a clear photo of your student ID</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {showApprovalForm ? (                  <PrimaryButton
                    onClick={handleSubmitApproval}
                    disabled={isSubmitting || !formData.contractForm || !formData.studentId}
                    className="flex-1 bg-orange-500/20 border border-orange-500/30 text-orange-200 hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting for Approval...
                      </div>
                    ) : (
                      `Submit for Approval - ${formData.quantity} ticket${formData.quantity > 1 ? 's' : ''}`
                    )}
                  </PrimaryButton>
                ) : (                  <PrimaryButton
                    onClick={handleDirectPurchase}
                    disabled={false} // For now, always allow purchase since we don't track remaining tickets
                    className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-semibold"
                  >
                    {`Add to Cart - ${event.price === 0 ? "FREE" : `$${(event.price * formData.quantity).toFixed(2)}`}`}
                  </PrimaryButton>
                )}
                
                <OutlineButton 
                  onClick={handleBackClick}
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  Cancel
                </OutlineButton>
              </div>
            </div>
          </ThemedCard>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
