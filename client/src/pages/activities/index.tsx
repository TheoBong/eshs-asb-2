import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Types for events
export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
  maxTickets: number;
  remainingTickets: number;
  image?: string;
  features?: string[];
  isPopular?: boolean;
  requiresApproval?: boolean; // For dance/events requiring forms
}

// Mock data for school events
export const events: Event[] = [
  {
    id: "homecoming-2024",
    title: "Homecoming Dance",
    category: "Dance",
    date: "2024-10-15",
    time: "7:00 PM - 11:00 PM",
    location: "Main Gymnasium",
    description: "Join us for our annual Homecoming Dance! Dress up in your finest attire and dance the night away with friends.",
    price: 25,
    maxTickets: 500,
    remainingTickets: 342,
    features: [
      "Professional DJ",
      "Photo booth",
      "Refreshments included",
      "Formal dress code"
    ],
    isPopular: true,
    requiresApproval: true
  },
  {
    id: "prom-2025",
    title: "Senior Prom",
    category: "Dance",
    date: "2025-05-20",
    time: "6:00 PM - 12:00 AM",
    location: "Grand Ballroom - Downtown Hotel",
    description: "The most anticipated event of the year! Senior Prom at the elegant Grand Ballroom with dinner and dancing.",
    price: 75,
    maxTickets: 300,
    remainingTickets: 298,
    features: [
      "Three-course dinner",
      "Live band & DJ",
      "Professional photographer",
      "Formal attire required",
      "Transportation provided"
    ],
    isPopular: true,
    requiresApproval: true
  },
  {
    id: "football-championship",
    title: "Football Championship Game",
    category: "Sports",
    date: "2024-11-22",
    time: "7:00 PM",
    location: "Eagles Stadium",
    description: "Cheer on our Eagles as they compete for the regional championship title!",
    price: 12,
    maxTickets: 2000,
    remainingTickets: 1756,
    features: [
      "Reserved seating",
      "Concessions available",
      "Student section included",
      "Pre-game activities"
    ]
  },
  {
    id: "basketball-playoffs",
    title: "Basketball Playoff Game",
    category: "Sports",
    date: "2024-12-05",
    time: "6:30 PM",
    location: "Main Gymnasium",
    description: "Support our varsity basketball team in the playoff semifinals!",
    price: 8,
    maxTickets: 800,
    remainingTickets: 456,
    features: [
      "General admission",
      "Student discounts available",
      "Halftime entertainment",
      "Snack bar open"
    ]
  },
  {
    id: "winter-musical",
    title: "Winter Musical: Les Misérables",
    category: "Performance",
    date: "2024-12-15",
    time: "7:30 PM",
    location: "School Auditorium",
    description: "Experience the magic of Les Misérables performed by our talented drama students.",
    price: 15,
    maxTickets: 400,
    remainingTickets: 287,
    features: [
      "Reserved seating",
      "Program included",
      "Professional lighting & sound",
      "Meet the cast after show"
    ]
  },
  {
    id: "spring-concert",
    title: "Spring Concert",
    category: "Performance",
    date: "2025-04-18",
    time: "7:00 PM",
    location: "School Auditorium",
    description: "Join our choir, band, and orchestra for an evening of beautiful music celebrating spring.",
    price: 10,
    maxTickets: 400,
    remainingTickets: 375,
    features: [
      "Multiple ensembles",
      "Solo performances",
      "Reception following concert",
      "Family-friendly event"
    ]
  },
  {
    id: "graduation-ceremony",
    title: "Graduation Ceremony",
    category: "Ceremony",
    date: "2025-06-10",
    time: "10:00 AM",
    location: "Football Stadium",
    description: "Celebrate our graduating seniors as they receive their diplomas and begin their next chapter.",
    price: 0,
    maxTickets: 3000,
    remainingTickets: 2834,
    features: [
      "Free admission",
      "Live streaming available",
      "Professional photography",
      "Reception follows ceremony"
    ]
  },
  {
    id: "talent-show",
    title: "Annual Talent Show",
    category: "Performance",
    date: "2025-03-28",
    time: "7:00 PM",
    location: "School Auditorium",
    description: "Showcase of amazing talents from our student body - singing, dancing, comedy, and more!",
    price: 8,
    maxTickets: 400,
    remainingTickets: 312,
    features: [
      "Student performances",
      "Audience voting",
      "Prizes for winners",
      "Intermission treats"
    ]
  }
];

export default function Activities() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("All");

  const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    setLocation("/");
  };

  // Filter events by category
  const filteredEvents = activeTab === "All" 
    ? events 
    : events.filter(event => event.category === activeTab);

  const categories = ["All", "Dance", "Sports", "Performance", "Ceremony"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityStatus = (remaining: number, max: number) => {
    const percentage = (remaining / max) * 100;
    if (percentage > 50) return { status: "Available", color: "bg-green-500/20 text-green-200 border-green-500/30" };
    if (percentage > 20) return { status: "Limited", color: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30" };
    if (percentage > 0) return { status: "Few Left", color: "bg-red-500/20 text-red-200 border-red-500/30" };
    return { status: "Sold Out", color: "bg-gray-500/20 text-gray-200 border-gray-500/30" };
  };

  const handleEventDetails = (eventId: string) => {
    setLocation(`/activities/details/${eventId}`);
  };

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

      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
      
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
                <div className="flex space-x-2">
                  <OutlineButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    Event Calendar
                  </OutlineButton>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <Tabs defaultValue="All" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-5 w-full max-w-3xl mx-auto">
              <TabsTrigger value="All" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="Dance" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Dance</TabsTrigger>
              <TabsTrigger value="Sports" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sports</TabsTrigger>
              <TabsTrigger value="Performance" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Performance</TabsTrigger>
              <TabsTrigger value="Ceremony" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Ceremony</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredEvents.map((event) => {
              const availability = getAvailabilityStatus(event.remainingTickets, event.maxTickets);
              
              return (
                <ThemedCard key={event.id} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                          {event.isPopular && (
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30">
                              Popular
                            </Badge>
                          )}
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

                    {/* Availability Status */}
                    <div className={`mb-4 p-3 rounded-lg border ${availability.color}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{availability.status}</span>
                        <span className="text-sm">{event.remainingTickets} of {event.maxTickets} remaining</span>
                      </div>
                    </div>

                    {/* Features */}
                    {event.features && (
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
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">
                            {event.price === 0 ? "FREE" : `$${event.price}`}
                          </span>
                          {event.price > 0 && <span className="text-gray-400 text-sm ml-1">per ticket</span>}
                        </div>
                      </div>
                    </div>

                    {/* Large Details Button */}
                    <PrimaryButton 
                      onClick={() => handleEventDetails(event.id)}
                      className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-semibold py-4 text-lg"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>View Details & Purchase Tickets</span>
                      </div>
                    </PrimaryButton>
                  </div>
                </ThemedCard>
              );
            })}
          </div>

        </div>
      </div>
    </ThemedPageWrapper>
  );
}
