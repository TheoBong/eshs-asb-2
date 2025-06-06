import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemedPageWrapper, PrimaryButton, OutlineButton, ThemedCard, ThemedInput } from "@/components/ThemedComponents";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: "homecoming-2025",
    title: "Homecoming 2025",
    date: "October 15, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "School Gymnasium",
    description: "Annual homecoming dance following the football game.",
    image: "/path/to/homecoming-image.jpg",
    isPinned: true,
    category: "Dance",
    ticketPrice: 25,
    volunteerNeeded: true
  },
  {
    id: "winter-formal-2025",
    title: "Winter Formal",
    date: "December 12, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "Grand Ballroom Hotel",
    description: "Elegant winter formal dance.",
    image: "/path/to/winterformal-image.jpg",
    isPinned: true,
    category: "Dance",
    ticketPrice: 35,
    volunteerNeeded: true
  },
  {
    id: "prom-2026",
    title: "Prom 2026",
    date: "April 18, 2026",
    time: "7:00 PM - 12:00 AM",
    location: "Crystal Ballroom",
    description: "Senior prom night - A Night to Remember",
    image: "/path/to/prom-image.jpg",
    isPinned: true,
    category: "Dance", 
    ticketPrice: 60,
    volunteerNeeded: true
  },
  {
    id: "dodger-game-2025",
    title: "Dodger Game Trip",
    date: "September 22, 2025",
    time: "5:00 PM - 11:00 PM",
    location: "Dodger Stadium",
    description: "School trip to watch the Dodgers play against the Giants.",
    image: "/path/to/dodgers-image.jpg",
    isPinned: true,
    category: "Field Trip",
    ticketPrice: 45,
    volunteerNeeded: false
  },
  {
    id: "talent-show-2025",
    title: "Annual Talent Show",
    date: "November 5, 2025",
    time: "6:00 PM - 8:30 PM",
    location: "School Auditorium",
    description: "Showcase your talents and skills in our annual talent competition.",
    image: "/path/to/talent-image.jpg",
    isPinned: false,
    category: "Performance",
    ticketPrice: 10,
    volunteerNeeded: true
  }
];

// Mock data for past events
const pastEvents = [
  {
    id: "homecoming-2024",
    title: "Homecoming 2024",
    date: "October 17, 2024",
    location: "School Gymnasium",
    description: "Annual homecoming dance following the football game.",
    image: "/path/to/homecoming-2024-image.jpg",
    category: "Dance"
  },
  {
    id: "winter-formal-2024",
    title: "Winter Formal 2024",
    date: "December 15, 2024",
    location: "Grand Ballroom Hotel",
    description: "Elegant winter formal dance.",
    image: "/path/to/winterformal-2024-image.jpg",
    category: "Dance"
  },
  {
    id: "beach-cleanup-2024",
    title: "Annual Beach Cleanup",
    date: "April 22, 2024",
    location: "El Segundo Beach",
    description: "Community service event to clean up our local beaches.",
    image: "/path/to/beach-cleanup-image.jpg",
    category: "Community Service"
  }
];

export default function Activities() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const handleEventClick = (eventId: string) => {
    setLocation(`/activities/event/${eventId}`);
  };

  const handleBackClick = () => {
    setLocation("/");
  };
  
  // Filter events based on search and category
  const filteredUpcomingEvents = upcomingEvents.filter(event => {
    const matchesSearch = searchQuery === "" || 
                         event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories using a simple method to avoid Set iteration issues
  const categoryMap: {[key: string]: boolean} = {};
  upcomingEvents.forEach(event => {
    categoryMap[event.category] = true;
  });
  const uniqueCategories = Object.keys(categoryMap);
  const categories = ["all", ...uniqueCategories];
  
  return (
    <ThemedPageWrapper pageType="activities">
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
      <div className="fixed inset-0 bg-black bg-opacity-85 -z-10"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Transparent back button with title */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center mb-8">
            <OutlineButton
              onClick={handleBackClick}
              className="flex items-center text-white/90 hover:text-white transition-colors p-2 mr-4"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </OutlineButton>
            <h1 className="font-bold text-3xl text-white tracking-tight">
              Event Tickets
            </h1>
          </div>
        
        {/* Activities Content */}
        <main className="pb-16">
          {/* Banner */}
          <div className="bg-gradient-to-r from-green-800 to-emerald-700 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">School Event Tickets</h2>
                <p className="mb-4">Purchase tickets for upcoming school events and activities</p>
                <PrimaryButton onClick={() => setSelectedCategory("Dance")}>
                  Browse Dance Events
                </PrimaryButton>
              </div>
              <div className="mt-4 md:mt-0 h-24 w-24 bg-black/70 backdrop-blur-xl rounded-full flex items-center justify-center border border-gray-500/50 shadow-xl">
                <span className="text-xl font-bold text-white text-center">GO<br/>EAGLES!</span>
              </div>
            </div>
          </div>
          
          {/* Filter and Navigation */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search Box */}
              <div>
                <ThemedInput
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                {/* Category Filter */}                <div className="w-full md:w-auto mb-2 md:mb-0">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-lg">
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
              </div>
              
              {/* Quick Actions Button (Desktop) */}
              <div className="hidden md:flex justify-end">
                <PrimaryButton onClick={() => setActiveTab("upcoming")} className="space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span>View All Events</span>
                </PrimaryButton>
              </div>
            </div>            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              {/* Event Grid */}
              {filteredUpcomingEvents.length > 0 ? (
                <TabsContent value="upcoming" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUpcomingEvents.map(event => (
                      <ThemedCard 
                        key={event.id} 
                        className="hover:shadow-xl transition-transform hover:scale-[1.02] cursor-pointer overflow-hidden"
                        onClick={() => handleEventClick(event.id)}
                      >
                        {/* Event Image */}
                        <div className="h-48 bg-gray-900 overflow-hidden relative">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300?text=Event+Image";
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            {event.isPinned && <Badge variant="default" className="bg-orange-500">Featured</Badge>}
                          </div>
                          {event.ticketPrice > 0 && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="default" className="bg-green-600">${event.ticketPrice}</Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardHeader>
                          <div className="flex justify-between">
                            <Badge variant="outline">{event.category}</Badge>
                            {event.volunteerNeeded && (
                              <Badge variant="secondary" className="bg-blue-600">Volunteers Needed</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg font-semibold text-white mt-2">{event.title}</CardTitle>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xl font-bold text-green-400">
                              {event.ticketPrice > 0 ? `$${event.ticketPrice}` : 'Free'}
                            </span>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <CardDescription className="text-sm mb-2">
                            <i className="far fa-calendar mr-1"></i> {event.date}
                            {event.time && <><span className="mx-1">•</span><i className="far fa-clock mr-1"></i> {event.time}</>}
                          </CardDescription>
                          <CardDescription className="text-sm mb-3">
                            <i className="fas fa-map-marker-alt mr-1"></i> {event.location}
                          </CardDescription>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.description}</p>
                        </CardContent>
                        
                        <CardFooter className="border-t pt-4">
                          <PrimaryButton className="w-full">
                            <i className="fas fa-ticket-alt mr-2"></i>
                            Buy Tickets
                          </PrimaryButton>
                        </CardFooter>
                      </ThemedCard>
                    ))}
                  </div>
                </TabsContent>
              ) : (
                <TabsContent value="upcoming" className="mt-6">
                  <ThemedCard className="p-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                      <p className="text-gray-300">Try adjusting your search or filter criteria</p>
                      
                      <OutlineButton
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                        }}
                      >
                        Reset Filters
                      </OutlineButton>
                    </div>
                  </ThemedCard>
                </TabsContent>
              )}

              {/* Past Events Tab */}
              <TabsContent value="past" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pastEvents.map(event => (
                    <ThemedCard key={event.id} className="hover:shadow-lg transition-transform hover:scale-[1.01] cursor-pointer" onClick={() => handleEventClick(event.id)}>
                      <div className="h-40 bg-gray-800 overflow-hidden relative">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover grayscale opacity-80"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300?text=Past+Event";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-gray-600 text-white">Past</Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <Badge variant="outline" className="bg-gray-700 text-gray-200 mb-2 w-fit">{event.category}</Badge>
                        <CardTitle className="text-lg text-foreground">{event.title}</CardTitle>
                        <CardDescription className="text-sm mt-1 text-gray-300">{event.date}</CardDescription>
                        <CardDescription className="text-sm text-gray-300">{event.location}</CardDescription>
                      </CardHeader>
                      
                      <CardFooter>
                        <OutlineButton size="sm" className="ml-auto">View Gallery</OutlineButton>
                      </CardFooter>
                    </ThemedCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>          {/* Ticket Information Section */}
          <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Ticket Information</h2>            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600/30 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-shopping-cart text-blue-400 text-lg"></i>
                    </div>
                    <CardTitle className="text-lg text-white">Easy Purchase</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Buy tickets online with a few clicks. No need to wait in line!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600/30 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-mobile-alt text-green-400 text-lg"></i>
                    </div>
                    <CardTitle className="text-lg text-white">Digital Tickets</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Get tickets delivered to your email. Just show your phone at the entrance.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-600/30 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-users text-amber-400 text-lg"></i>
                    </div>
                    <CardTitle className="text-lg text-white">Group Discounts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Special rates available for groups of 10 or more. Contact us for details.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600/30 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-question-circle text-purple-400 text-lg"></i>
                    </div>
                    <CardTitle className="text-lg text-white">Help & Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Need assistance? Contact our ticket support team at tickets@eshs.edu
                  </p>
                </CardContent>
              </Card>            </div>
          </div>
        </main>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
