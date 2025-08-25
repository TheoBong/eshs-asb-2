import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import { getEvents, type Event } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

// Mock data for school events (fallback)
const mockEvents: Event[] = [];

export default function Activities() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartCount } = useCart();

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events. Please try again later.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true');
    setLocation("/");
  };

  // Filter events by category
  const filteredEvents = activeTab === "All" 
    ? events 
    : events.filter(event => event.category === activeTab);

  const categories = ["All", ...Array.from(new Set(events.map(event => event.category)))];

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleEventDetails = (eventId: string) => {
    setLocation(`/activities/details/${eventId}`);
  };

  const handleCartClick = () => {
    sessionStorage.setItem('cart-referrer', '/activities');
    setLocation("/shop/cart");
  };

  return (
    <ThemedPageWrapper pageType="information">
      {/* Light overlay for better text contrast without darkening UI */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10" style={{ pointerEvents: 'none' }}></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <OutlineButton
              onClick={handleBackClick}
              className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </OutlineButton>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">School Activities</h1>
          </div>

          {/* Activities Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Upcoming Events & Ticket Sales</h2>
                <p className="mb-4">Don't miss out on exciting school events! View event details and purchase tickets.</p>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>          {/* Category Filter Tabs with Cart Button */}
          <div className="mb-8 flex items-center justify-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 max-w-3xl">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid w-full h-10" 
                        style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category}
                    value={category} 
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white h-8"
                  >
                    {category}
                  </TabsTrigger>
                ))}
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-white">Loading events...</p>
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
              <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Events</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <PrimaryButton onClick={() => window.location.reload()}>
                Try Again
              </PrimaryButton>
            </ThemedCard>
          )}

          {/* No Events State */}
          {!loading && !error && events.length === 0 && (
            <ThemedCard className="p-6 text-center mb-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Events Available</h3>
              <p className="text-gray-300">Check back later for upcoming events!</p>
            </ThemedCard>
          )}

          {/* Events Grid */}
          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredEvents.map((event) => (
                <ThemedCard key={event._id} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                          {event.requiresApproval && (
                            <Badge variant="outline" className="bg-orange-500/20 text-orange-200 border-orange-500/30">
                              Requires Approval
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-300 mb-3">{event.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {event.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-200">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-200">{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-200">{event.location}</span>
                      </div>
                    </div>

                    {/* Features */}
                    {event.features && event.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-200 mb-2">Event Features:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {event.features.map((feature, index) => (
                            <li key={index} className="text-gray-300 text-sm">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Price Display */}
                    <div className="border-t border-white/10 pt-4 mb-4">
                      {event.ticketTypes && event.ticketTypes.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-gray-200 mb-3">Ticket Options:</h4>
                          <div className="space-y-2">
                            {event.ticketTypes.map((ticket, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex-1">
                                  <div className="font-medium text-white">{ticket.name}</div>
                                  <div className="text-sm text-gray-300">{ticket.description}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-400">${ticket.price.toFixed(2)}</div>
                                  <div className="text-xs text-gray-400">Max: {ticket.maxTickets}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-white">
                              {event.price === 0 ? "FREE" : `$${event.price}`}
                            </span>
                            {event.price > 0 && <span className="text-gray-400 text-sm ml-1">per ticket</span>}
                          </div>
                          {event.maxTickets && (
                            <div className="text-sm text-gray-400">
                              Max: {event.maxTickets} tickets
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Large Details Button */}
                    <PrimaryButton 
                      onClick={() => handleEventDetails(event._id)}
                      className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-semibold py-4 text-lg"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>View Details</span>
                      </div>
                    </PrimaryButton>
                  </div>
                </ThemedCard>
              ))}
            </div>
          )}

        </div>
      </div>
    </ThemedPageWrapper>
  );
}
