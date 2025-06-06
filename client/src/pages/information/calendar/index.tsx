import { useState } from "react";
import { useLocation } from "wouter";
import { ThemedPageWrapper, ThemedCard, ThemedInput, ThemedTabs, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
// import schoolVideo from "../../../../../attached_assets/school2.mp4"; // No longer needed

// Types for calendar data
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: "academic" | "asb" | "sports" | "arts" | "holiday" | "service";
  allDay: boolean;
  recurring?: boolean;
  recurringPattern?: string;
  reminder?: boolean;
  organizerId?: string;
  organizerName?: string;
}

// Mock data for calendar months
interface CalendarMonth {
  name: string;
  value: string;
  days: number;
  firstDay: number; // 0 = Sunday, 1 = Monday, etc.
}

const calendarMonths: CalendarMonth[] = [
  { name: "January", value: "jan", days: 31, firstDay: 0 },
  { name: "February", value: "feb", days: 28, firstDay: 3 },
  { name: "March", value: "mar", days: 31, firstDay: 3 },
  { name: "April", value: "apr", days: 30, firstDay: 6 },
  { name: "May", value: "may", days: 31, firstDay: 1 },
  { name: "June", value: "jun", days: 30, firstDay: 4 }
];

// Mock data for calendar events
const calendarEventsData: CalendarEvent[] = [
  {
    id: "finals-week-start",
    title: "Finals Week Begins",
    description: "First day of final exams for the spring semester.",
    date: "2023-06-05",
    category: "academic",
    allDay: true
  },
  {
    id: "graduation-rehearsal",
    title: "Graduation Rehearsal",
    description: "Mandatory rehearsal for all graduating seniors.",
    date: "2023-06-09",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    location: "Football Field",
    category: "academic",
    allDay: false
  },
  {
    id: "graduation",
    title: "Graduation Ceremony",
    description: "Commencement ceremony for the Class of 2023.",
    date: "2023-06-10",
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    location: "Football Stadium",
    category: "academic",
    allDay: false
  },
  {
    id: "last-day",
    title: "Last Day of School",
    description: "Final day of classes for the 2022-2023 school year.",
    date: "2023-06-15",
    category: "academic",
    allDay: true
  },
  {
    id: "basketball-game",
    title: "Basketball Game vs. Torrance High",
    description: "Home game against Torrance High School.",
    date: "2023-06-02",
    startTime: "7:00 PM",
    endTime: "9:00 PM",
    location: "Gymnasium",
    category: "sports",
    allDay: false,
    organizerName: "Athletics Department"
  },
  {
    id: "baseball-game",
    title: "Baseball Game vs. West High",
    description: "Home game against West High School.",
    date: "2023-06-07",
    startTime: "3:30 PM",
    endTime: "6:00 PM",
    location: "Baseball Field",
    category: "sports",
    allDay: false,
    organizerName: "Athletics Department"
  },
  {
    id: "spring-musical",
    title: "Spring Musical: The Sound of Music",
    description: "School production of The Sound of Music.",
    date: "2023-06-02",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    location: "Auditorium",
    category: "arts",
    allDay: false,
    recurring: true,
    recurringPattern: "June 2-4, 7:00 PM",
    organizerName: "Drama Department"
  },
  {
    id: "spring-musical-2",
    title: "Spring Musical: The Sound of Music",
    description: "School production of The Sound of Music.",
    date: "2023-06-03",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    location: "Auditorium",
    category: "arts",
    allDay: false,
    recurring: true,
    recurringPattern: "June 2-4, 7:00 PM",
    organizerName: "Drama Department"
  },
  {
    id: "spring-musical-3",
    title: "Spring Musical: The Sound of Music",
    description: "School production of The Sound of Music.",
    date: "2023-06-04",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    location: "Auditorium",
    category: "arts",
    allDay: false,
    recurring: true,
    recurringPattern: "June 2-4",
    organizerName: "Drama Department"
  },
  {
    id: "asb-meeting",
    title: "ASB Meeting",
    description: "Weekly ASB planning meeting.",
    date: "2023-06-01",
    startTime: "12:30 PM",
    endTime: "1:15 PM",
    location: "Room 210",
    category: "asb",
    allDay: false,
    recurring: true,
    recurringPattern: "Every Thursday",
    organizerName: "ASB"
  },
  {
    id: "asb-meeting-2",
    title: "ASB Meeting",
    description: "Weekly ASB planning meeting.",
    date: "2023-06-08",
    startTime: "12:30 PM",
    endTime: "1:15 PM",
    location: "Room 210",
    category: "asb",
    allDay: false,
    recurring: true,
    recurringPattern: "Every Thursday",
    organizerName: "ASB"
  },
  {
    id: "beach-cleanup",
    title: "Beach Cleanup",
    description: "Community service event at El Segundo Beach.",
    date: "2023-06-17",
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    location: "El Segundo Beach",
    category: "service",
    allDay: false,
    organizerName: "Environmental Club"
  },
  {
    id: "memorial-day",
    title: "Memorial Day",
    description: "School Closed - Memorial Day Holiday",
    date: "2023-05-29",
    category: "holiday",
    allDay: true
  },
  {
    id: "staff-development",
    title: "Staff Development Day",
    description: "No School for Students - Teacher Training",
    date: "2023-06-16",
    category: "academic",
    allDay: true
  }
];

export default function CalendarPage() {
  // const [, setLocation] = useLocation(); // No longer needed for custom back button
  const [activeMonth, setActiveMonth] = useState<string>("jun");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Get current month data
  const currentMonth = calendarMonths.find(month => month.value === activeMonth) || calendarMonths[5]; // Default to June

  // Generate days array for current month
  const daysArray = Array.from({ length: currentMonth.days }, (_, i) => i + 1);
  
  // Add empty slots for days before the 1st of the month
  const emptyDaysAtStart = Array.from({ length: currentMonth.firstDay }, (_, i) => `empty-${i}`);
  const calendarDays = [...emptyDaysAtStart, ...daysArray];

  // Filter events based on active month, category, and search term
  const filteredEvents = calendarEventsData.filter(event => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.toLocaleString('default', { month: 'short' }).toLowerCase();
    
    const matchesMonth = eventMonth === activeMonth;
    const matchesCategory = activeCategory === "all" || event.category === activeCategory;
    const matchesSearch = searchTerm === "" || 
                         event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesMonth && matchesCategory && matchesSearch;
  });

  // Group events by day
  const eventsByDay: { [key: number]: CalendarEvent[] } = {};
  filteredEvents.forEach(event => {
    const day = new Date(event.date).getDate();
    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }
    eventsByDay[day].push(event);
  });

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Get events for a specific day
  const getEventsForDay = (day: number): CalendarEvent[] => {
    return eventsByDay[day] || [];
  };

  // Get color class based on event category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'asb': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sports': return 'bg-green-100 text-green-800 border-green-200';
      case 'arts': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'service': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get color class for day cell based on whether it has events
  const getDayColor = (day: number) => {
    const events = getEventsForDay(day);
    if (events.length > 0) {
      const categories = new Set(events.map(event => event.category));      if (categories.has('holiday')) return 'bg-purple-900/30';
      if (categories.has('academic') && events.some(e => e.allDay)) return 'bg-blue-900/30';
      return events.length > 2 ? 'bg-gray-800/30' : '';
    }
    return '';
  };

  // Get formatted list of upcoming events (across all months)
  const upcomingEvents = calendarEventsData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())    .filter(event => new Date(event.date) >= new Date('2023-05-28')) // Show events from the current date forward
    .slice(0, 5); // Show only the next 5 events
      return (
    <ThemedPageWrapper pageType="information">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => setLocation("/information")}
            variant="ghost"
            className="text-white/90 hover:text-white p-2 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-3xl font-bold text-white">School Calendar</h1>
        </div>

        {/* Calendar Controls */}
        <ThemedCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
            <div className="relative w-full md:w-1/3">
              <ThemedInput
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <ThemedTabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-3 md:grid-cols-7 gap-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="asb">ASB</TabsTrigger>
                <TabsTrigger value="sports">Sports</TabsTrigger>
                <TabsTrigger value="arts">Arts</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="holiday">Holidays</TabsTrigger>
              </TabsList>
            </ThemedTabs>
          </div>

          <div className="flex justify-center mt-4">
            <ThemedTabs value={activeMonth} onValueChange={setActiveMonth} className="w-full">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-3 md:grid-cols-6 gap-1">
                {calendarMonths.map((month) => (
                  <TabsTrigger key={month.value} value={month.value}>
                    {month.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ThemedTabs>
          </div>
        </ThemedCard>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid - Takes up 3/4 of the space on large screens */}
          <div className="lg:col-span-3">
            <ThemedCard className="border-2">
              <CardHeader className="border-b">
                <CardTitle className="text-center text-xl">
                  {currentMonth.name} 2023
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Calendar Header (Day Names) */}
                <div className="grid grid-cols-7 border-b text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 font-medium bg-gray-800 text-white text-sm border-b border-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    // Empty cells at start of month
                    if (typeof day === 'string') {
                      return <div key={day} className="aspect-square p-1 border-b border-r"></div>;
                    }

                    // Regular day cells
                    const dayEvents = getEventsForDay(day);
                    const hasEvents = dayEvents.length > 0;
                    const dayColor = getDayColor(day);

                    return (
                      <div 
                        key={`day-${day}`} 
                        className={`aspect-square p-1 border-b border-r border-gray-600 relative ${dayColor} hover:bg-gray-700/30`}
                      >
                        <div className="flex flex-col h-full">
                          <div className="text-right text-sm font-medium p-1">
                            {day}
                          </div>
                          
                          {/* Event indicators */}
                          <div className="flex-grow overflow-hidden">
                            {hasEvents && dayEvents.slice(0, 3).map((event) => (
                              <div 
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                className={`text-xs mb-1 px-1 py-0.5 truncate border rounded cursor-pointer ${getCategoryColor(event.category)}`}
                              >
                                {event.allDay ? "• " : ""}{event.title}
                              </div>
                            ))}
                            
                            {/* More events indicator */}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-center text-gray-500 mt-1">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </ThemedCard>
            
            {/* Legend */}
            <ThemedCard className="mt-4 p-3 flex flex-wrap gap-2 justify-center">
              <div className="text-sm font-medium mr-2 text-card-foreground">Legend:</div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Academic</Badge>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">ASB</Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">Sports</Badge>
              <Badge className="bg-rose-100 text-rose-800 border-rose-200">Arts</Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">Holiday</Badge>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200">Service</Badge>            </ThemedCard>
          </div>

          {/* Sidebar - Takes up 1/4 of the space on large screens */}
          <div className="lg:col-span-1">
          <div className="lg:col-span-1">
            {/* Upcoming Events */}
            <ThemedCard className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="border-b border-gray-600 pb-2 last:border-0 cursor-pointer hover:bg-gray-700/30 -mx-2 px-2"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="min-w-[40px] text-center">                            <div className="bg-gray-700 rounded-t-md py-0.5 text-xs font-medium text-gray-300">
                              {new Date(event.date).toLocaleString('default', { month: 'short' })}
                            </div>
                            <div className="bg-gray-800 border border-gray-600 rounded-b-md py-1 font-bold text-white">
                              {new Date(event.date).getDate()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium line-clamp-1">{event.title}</div>
                            <div className="text-xs text-gray-500">
                              {event.allDay ? "All Day" : `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ""}`}
                              {event.location && <span> • {event.location}</span>}
                            </div>
                            <Badge className={`mt-1 text-xs ${getCategoryColor(event.category)}`}>
                              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No upcoming events
                  </div>
                )}
              </CardContent>
            </ThemedCard>

            {/* Event Categories */}
            <ThemedCard>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Event Categories</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <PrimaryButton 
                    variant={activeCategory === "all" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory("all")}
                  >
                    <i className="fas fa-calendar-alt mr-2"></i>
                    All Events
                  </PrimaryButton>
                  <OutlineButton 
                    className="w-full justify-start text-blue-400"
                    onClick={() => setActiveCategory("academic")}
                  >
                    <i className="fas fa-graduation-cap mr-2"></i>
                    Academic
                  </OutlineButton>
                  <OutlineButton 
                    className="w-full justify-start text-amber-400"
                    onClick={() => setActiveCategory("asb")}
                  >
                    <i className="fas fa-users mr-2"></i>
                    ASB Events
                  </OutlineButton>
                  <OutlineButton 
                    className="w-full justify-start text-green-400"
                    onClick={() => setActiveCategory("sports")}
                  >
                    <i className="fas fa-basketball-ball mr-2"></i>
                    Sports
                  </OutlineButton>
                  <OutlineButton 
                    className="w-full justify-start text-rose-400"
                    onClick={() => setActiveCategory("arts")}
                  >
                    <i className="fas fa-paint-brush mr-2"></i>
                    Arts
                  </OutlineButton>
                  <OutlineButton 
                    className="w-full justify-start text-teal-400"
                    onClick={() => setActiveCategory("service")}
                  >
                    <i className="fas fa-hands-helping mr-2"></i>
                    Service
                  </OutlineButton>                  <OutlineButton 
                    className="w-full justify-start text-purple-400"
                    onClick={() => setActiveCategory("holiday")}
                  >
                    <i className="fas fa-star mr-2"></i>
                    Holidays
                  </OutlineButton>
                </div>
              </CardContent>
            </ThemedCard>
          </div>
        </div>
      </div>      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                <Badge className={getCategoryColor(selectedEvent?.category || '')}>
                  {selectedEvent?.category ? selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1) : ''}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                <p className="text-sm">
                  {selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                  <br />
                  {selectedEvent?.allDay ? 
                    "All Day" : 
                    `${selectedEvent?.startTime || ''}${selectedEvent?.endTime ? ` - ${selectedEvent.endTime}` : ""}`
                  }
                  {selectedEvent?.recurring && (
                    <span className="block text-xs text-gray-500 mt-0.5">
                      <i className="fas fa-redo-alt mr-1"></i>
                      {selectedEvent?.recurringPattern || ''}
                    </span>
                  )}
                </p>
              </div>

              {selectedEvent?.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-sm">{selectedEvent.location}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-sm">{selectedEvent?.description || ''}</p>
              </div>
              
              {selectedEvent?.organizerName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Organized By</h3>
                  <p className="text-sm">{selectedEvent.organizerName}</p>
                </div>
              )}
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-end gap-2">
              <OutlineButton onClick={() => setShowModal(false)}>Close</OutlineButton>
              <PrimaryButton>
                <i className="far fa-calendar-plus mr-2"></i>
                Add to My Calendar
              </PrimaryButton>            </div>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </ThemedPageWrapper>
  );
}
