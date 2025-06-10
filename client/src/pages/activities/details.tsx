import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import { getEvents, createFormSubmission, type Event } from "@/lib/api";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Types for form data
interface FormData {
  contractForm: File | null;
  guestForm: File | null;
  studentId: File | null;
  customForms: { [key: string]: File | null };
  studentName: string;
  email: string;
  quantity: number;
  notes: string;
}

// Types for form upload status
interface FormUploadStatus {
  uploading: boolean;
  success: boolean;
  error: boolean;
  message: string;
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
    customForms: {},
    studentName: '',
    email: '',
    quantity: 1,
    notes: ''
  });  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<FormUploadStatus>({
    uploading: false,
    success: false,
    error: false,
    message: ''
  });

  // File input refs
  const fileInputRefs = {
    contractForm: useRef<HTMLInputElement>(null),
    guestForm: useRef<HTMLInputElement>(null),
    studentId: useRef<HTMLInputElement>(null),
  };

  // Custom forms refs object
  const customFormRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

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
    if (field === 'customForms' && file) {
      // This won't be called directly for customForms
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleCustomFileUpload = (formName: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      customForms: {
        ...prev.customForms,
        [formName]: file
      }
    }));
  };

  // Helper to validate email format
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitApproval = async () => {
    if (!event) return;

    // Form validation
    if (!formData.studentName.trim()) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: 'Please enter your name'
      });
      return;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: 'Please enter a valid email address'
      });
      return;
    }

    // Check required forms based on event settings
    if (event.requiredForms) {
      if (event.requiredForms.contractForm && !formData.contractForm) {
        setUploadStatus({
          uploading: false,
          success: false,
          error: true,
          message: 'Contract form is required'
        });
        return;
      }
      
      if (event.requiredForms.guestForm && !formData.guestForm) {
        setUploadStatus({
          uploading: false,
          success: false,
          error: true,
          message: 'Guest form is required'
        });
        return;
      }
      
      if (event.requiredForms.studentIdRequired && !formData.studentId) {
        setUploadStatus({
          uploading: false,
          success: false,
          error: true,
          message: 'Student ID is required'
        });
        return;
      }
      
      // Check custom forms
      if (event.requiredForms.customForms && event.requiredForms.customForms.length > 0) {
        for (const customForm of event.requiredForms.customForms) {
          if (!formData.customForms[customForm]) {
            setUploadStatus({
              uploading: false,
              success: false,
              error: true,
              message: `${customForm} form is required`
            });
            return;
          }
        }
      }
    }

    setIsSubmitting(true);
    setUploadStatus({
      uploading: true,
      success: false,
      error: false,
      message: 'Uploading forms and submitting your request...'
    });

    try {
      // In a real implementation, we'd upload the files to a server/storage
      // For now, we'll simulate the file upload by creating URLs
      const uploadedForms = [];
      
      // Process contract form
      if (formData.contractForm) {
        uploadedForms.push({
          fileName: 'Contract Form',
          fileUrl: URL.createObjectURL(formData.contractForm),
          fileType: formData.contractForm.type
        });
      }
      
      // Process guest form
      if (formData.guestForm) {
        uploadedForms.push({
          fileName: 'Guest Form',
          fileUrl: URL.createObjectURL(formData.guestForm),
          fileType: formData.guestForm.type
        });
      }
      
      // Process student ID
      if (formData.studentId) {
        uploadedForms.push({
          fileName: 'Student ID',
          fileUrl: URL.createObjectURL(formData.studentId),
          fileType: formData.studentId.type
        });
      }
      
      // Process custom forms
      for (const [formName, file] of Object.entries(formData.customForms)) {
        if (file) {
          uploadedForms.push({
            fileName: formName,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type
          });
        }
      }

      // Create form submission record
      await createFormSubmission({
        eventId: event._id,
        studentName: formData.studentName,
        email: formData.email,
        forms: uploadedForms,
        quantity: formData.quantity,
        totalAmount: event.price * formData.quantity,
        notes: formData.notes,
        status: 'pending'
      });

      // Show success message
      setUploadStatus({
        uploading: false,
        success: true,
        error: false,
        message: 'Your forms have been submitted successfully. You will receive an email when your request is approved.'
      });

      // After success, redirect back to activities after 3 seconds
      setTimeout(() => {
        setLocation("/activities");
      }, 3000);
    } catch (error) {
      console.error('Form submission failed:', error);
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: 'Failed to submit forms. Please try again.'
      });
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
          </ThemedCard>          {/* Purchase/Registration Section */}
          <div className="border-t border-white/10 pt-6 mt-6">
            {event.requiresApproval ? (
              // Direct approval form display (no card wrapper)
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Approval Request Form</h3>
                
                {/* Status Messages */}
                {uploadStatus.success && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                    <p className="text-green-200">{uploadStatus.message}</p>
                  </div>
                )}

                {uploadStatus.error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                    <p className="text-red-200">{uploadStatus.message}</p>
                  </div>
                )}

                {!uploadStatus.success && (
                  <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
                    <form className="space-y-6">
                      {/* Student Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="studentName" className="text-white mb-2 block">Student Name</Label>
                          <Input
                            id="studentName"
                            value={formData.studentName}
                            onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                            placeholder="Enter your full name"
                            className="bg-white/5 border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email address"
                            className="bg-white/5 border-white/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Required Forms Section */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-white">Required Forms</h4>
                        
                        {/* Contract Form */}
                        {event.requiredForms?.contractForm && (
                          <div>
                            <Label htmlFor="contractForm" className="text-white mb-2 block">
                              Contract Form {formData.contractForm ? '✓' : '*'}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="contractForm"
                                type="file"
                                ref={fileInputRefs.contractForm}
                                onChange={(e) => handleFileUpload('contractForm', e.target.files?.[0] || null)}
                                className="bg-white/5 border-white/20 text-white"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                required
                              />
                              <a 
                                href="#" 
                                className="text-blue-300 hover:text-blue-200 text-sm whitespace-nowrap"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // In a real implementation, this would link to the form template
                                  alert('Download contract form template (this would be implemented in production)');
                                }}
                              >
                                Download Template
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Guest Form */}
                        {event.requiredForms?.guestForm && (
                          <div>
                            <Label htmlFor="guestForm" className="text-white mb-2 block">
                              Guest Form {formData.guestForm ? '✓' : '*'}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="guestForm"
                                type="file"
                                ref={fileInputRefs.guestForm}
                                onChange={(e) => handleFileUpload('guestForm', e.target.files?.[0] || null)}
                                className="bg-white/5 border-white/20 text-white"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                required
                              />
                              <a 
                                href="#" 
                                className="text-blue-300 hover:text-blue-200 text-sm whitespace-nowrap"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // In a real implementation, this would link to the form template
                                  alert('Download guest form template (this would be implemented in production)');
                                }}
                              >
                                Download Template
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Student ID */}
                        {event.requiredForms?.studentIdRequired && (
                          <div>
                            <Label htmlFor="studentId" className="text-white mb-2 block">
                              Student ID {formData.studentId ? '✓' : '*'}
                            </Label>
                            <Input
                              id="studentId"
                              type="file"
                              ref={fileInputRefs.studentId}
                              onChange={(e) => handleFileUpload('studentId', e.target.files?.[0] || null)}
                              className="bg-white/5 border-white/20 text-white"
                              accept=".jpg,.jpeg,.png,.pdf"
                              required
                            />
                            <p className="text-xs text-gray-400 mt-1">Upload a photo or scan of your student ID</p>
                          </div>
                        )}

                        {/* Custom Forms */}
                        {event.requiredForms?.customForms && event.requiredForms.customForms.length > 0 && (
                          <div className="space-y-3">
                            {event.requiredForms.customForms.map((formName, index) => (
                              <div key={index}>
                                <Label htmlFor={`customForm_${index}`} className="text-white mb-2 block">
                                  {formName} {formData.customForms[formName] ? '✓' : '*'}
                                </Label>
                                <Input
                                  id={`customForm_${index}`}
                                  type="file"
                                  ref={(el) => { customFormRefs.current[formName] = el; }}
                                  onChange={(e) => handleCustomFileUpload(formName, e.target.files?.[0] || null)}
                                  className="bg-white/5 border-white/20 text-white"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  required
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor="notes" className="text-white mb-2 block">Additional Notes (optional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any additional information we should know..."
                          className="bg-white/5 border-white/20 text-white"
                          rows={3}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <PrimaryButton
                          onClick={handleSubmitApproval}
                          disabled={isSubmitting || uploadStatus.success}
                          className="w-full py-3 text-lg font-semibold"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : 'Submit for Approval'}
                        </PrimaryButton>

                        <p className="text-sm text-gray-400 mt-3">
                          * Once submitted, your request will be reviewed by an administrator. 
                          You will receive an email notification when your request is approved or denied.
                        </p>
                      </div>
                    </form>
                  </ThemedCard>
                )}
              </div>
            ) : (
              // Price/Quantity section for non-approval events
              <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Price and Availability */}
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-white">${event.price.toFixed(2)}</div>
                      <Badge variant="outline" className={`${availability.color} ml-2 px-2 py-1`}>
                        {availability.status}
                      </Badge>
                    </div>

                    {/* Quantity Selection */}
                    <div className="flex items-center space-x-4">
                      <label className="text-white">Quantity:</label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-white/5 border-white/20 text-white"
                          onClick={() => handleQuantityChange(formData.quantity - 1)}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </Button>
                        <Input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                          className="w-16 text-center mx-2 bg-white/5 border-white/20 text-white"
                          min="1"
                          max={event.maxTickets || 10}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-white/5 border-white/20 text-white"
                          onClick={() => handleQuantityChange(formData.quantity + 1)}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                      <div className="text-white text-lg font-medium">Total:</div>
                      <div className="text-white text-xl font-bold">${(event.price * formData.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex-1 flex items-end justify-center md:justify-end">
                    <PrimaryButton
                      onClick={handleDirectPurchase}
                      className="w-full md:w-auto px-8 py-4 text-lg font-semibold"
                    >
                      Add to Cart
                    </PrimaryButton>
                  </div>
                </div>
              </ThemedCard>
            )}          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
