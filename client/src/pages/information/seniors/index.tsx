import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for senior events data
interface SeniorEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
  cost?: string;
  coordinator?: string;
  category: "graduation" | "social" | "academic" | "preparation";
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

// Mock data for senior events
const seniorEventsData: SeniorEvent[] = [
  {
    id: "cap-gown",
    title: "Cap and Gown Distribution",
    description: "Pick up your graduation cap and gown. Bring your student ID and confirmation of order.",
    date: "May 15, 2025",
    time: "12:00 PM - 4:00 PM",
    location: "School Gymnasium",
    image: "/api/placeholder/500/300",
    registrationRequired: false,
    category: "graduation"
  },
  {
    id: "senior-breakfast",
    title: "Senior Breakfast",
    description: "Join your fellow seniors for a special breakfast celebration with faculty and staff.",
    date: "May 20, 2025",
    time: "8:00 AM - 10:00 AM",
    location: "School Cafeteria",
    image: "/api/placeholder/500/300",
    registrationRequired: true,
    registrationDeadline: "May 15, 2025",
    cost: "$10",
    coordinator: "Ms. Johnson",
    category: "social"
  },
  {
    id: "grad-practice",
    title: "Graduation Rehearsal",
    description: "Mandatory rehearsal for the graduation ceremony. Learn the processional order and procedures.",
    date: "May 25, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Football Stadium",
    registrationRequired: false,
    category: "graduation"
  },
  {
    id: "senior-prom",
    title: "Senior Prom",
    description: "A night to remember! Join us for an evening of dining, dancing, and celebration.",
    date: "May 10, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "Grand Ballroom Hotel",
    image: "/api/placeholder/500/300",
    registrationRequired: true,
    registrationDeadline: "April 25, 2025",
    cost: "$85 per person",
    coordinator: "Ms. Davis",
    category: "social"
  },
  {
    id: "graduation",
    title: "Graduation Ceremony",
    description: "The official graduation ceremony for the Class of 2025.",
    date: "May 30, 2025",
    time: "6:00 PM",
    location: "Football Stadium",
    image: "/api/placeholder/500/300",
    registrationRequired: false,
    category: "graduation"
  },
  {
    id: "senior-picnic",
    title: "Senior Picnic",
    description: "End-of-year celebration with food, games, and yearbook signing.",
    date: "May 28, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "School Field",
    registrationRequired: true,
    registrationDeadline: "May 20, 2025",
    cost: "$15",
    category: "social"
  },
  {
    id: "college-prep",
    title: "College Transition Workshop",
    description: "Get prepared for the transition to college with advice from counselors and alumni.",
    date: "May 18, 2025",
    time: "1:00 PM - 3:00 PM",
    location: "School Library",
    registrationRequired: true,
    registrationDeadline: "May 15, 2025",
    category: "preparation"
  },
  {
    id: "senior-awards",
    title: "Senior Awards Night",
    description: "Ceremony to honor outstanding seniors for academic and extracurricular achievements.",
    date: "May 22, 2025",
    time: "7:00 PM",
    location: "School Auditorium",
    registrationRequired: false,
    category: "academic"
  }
];

// Mock announcements for seniors
const seniorAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Graduation Ticket Distribution",
    content: "Each senior will receive 8 tickets for the graduation ceremony. Additional tickets may be requested starting May 10th if available.",
    date: "April 28, 2025",
    priority: "high"
  },
  {
    id: 2,
    title: "Senior Quote Deadline Extended",
    content: "The deadline for submitting your senior quote for the yearbook has been extended to May 5th. Submit through the yearbook portal.",
    date: "April 25, 2025",
    priority: "medium"
  },
  {
    id: 3,
    title: "Senior Fees Due",
    content: "All senior fees must be paid by May 1st to participate in graduation. See the front office for payment options.",
    date: "April 20, 2025",
    priority: "high"
  },
  {
    id: 4,
    title: "Grad Night Ticket Sales",
    content: "Tickets for the all-night graduation celebration are now on sale for $75. Price increases to $90 after May 15th.",
    date: "April 15, 2025",
    priority: "medium"
  }
];

// Senior milestones and deadlines
const seniorMilestones: Milestone[] = [
  {
    id: "cap-gown-order",
    title: "Order Cap and Gown",
    date: "December 15, 2024",
    description: "Deadline to order graduation cap and gown through the school's vendor",
    completed: true
  },
  {
    id: "senior-dues",
    title: "Pay Senior Dues",
    date: "January 30, 2025",
    description: "Pay $50 senior dues to cover graduation costs and activities",
    completed: true
  },
  {
    id: "senior-photos",
    title: "Submit Senior Portrait",
    date: "February 15, 2025",
    description: "Deadline to submit official senior portrait for the yearbook",
    completed: false
  },
  {
    id: "senior-quote",
    title: "Submit Senior Quote",
    date: "May 5, 2025",
    description: "Submit your senior quote for the yearbook",
    completed: false
  },
  {
    id: "clear-obligations",
    title: "Clear All Obligations",
    date: "May 15, 2025",
    description: "Return all textbooks, equipment, and pay any outstanding fees",
    completed: false
  },
  {
    id: "final-exams",
    title: "Senior Final Exams",
    date: "May 20-22, 2025",
    description: "Complete all final exams",
    completed: false
  },
  {
    id: "graduation-clearance",
    title: "Graduation Clearance",
    date: "May 23, 2025",
    description: "Receive final clearance to participate in graduation ceremony",
    completed: false
  }
];

export default function Seniors() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SeniorEvent | null>(null);

  const handleBackClick = () => {
    setLocation("/information");
  };

  const handleRegisterClick = (event: SeniorEvent) => {
    setSelectedEvent(event);
    setRegisterDialogOpen(true);
  };

  // Filter events based on active tab
  const filteredEvents = seniorEventsData.filter(event => {
    if (activeTab === "all") return true;
    return event.category === activeTab;
  });

  return (
    <>
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
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>      {/* Main content */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              className="text-white/90 hover:text-white p-2 mr-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 className="text-3xl font-bold text-white">Senior Information</h1>
          </div>

          {/* Seniors Banner */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Class of 2025</h2>
                <p className="mb-4">Everything seniors need to know about graduation, events, and important deadlines.</p>                <div className="flex space-x-2">
                  <Button className="bg-emerald-700 text-white hover:bg-emerald-600">
                    Graduation Info
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-emerald-700">
                    Senior Checklist
                  </Button>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
            </div>
          </div>          {/* Important Announcements */}
          <h2 className="text-2xl font-bold text-white mb-6">Senior Announcements</h2>
          <div className="card-themed backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
            <div className="space-y-4">
              {seniorAnnouncements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className={`p-4 rounded-lg border ${
                    announcement.priority === 'high' 
                      ? 'border-red-300 bg-red-50' 
                      : announcement.priority === 'medium'
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-blue-300 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                  </div>
                  <p className="text-sm mt-2">{announcement.content}</p>
                  {announcement.priority === 'high' && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Important Announcement
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>          {/* Senior Milestones and Timeline */}
          <h2 className="text-2xl font-bold text-white mb-6">Senior Timeline & Milestones</h2>
          <div className="card-themed backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
            <div className="space-y-6">
              {seniorMilestones.map((milestone, index) => (
                <div key={milestone.id} className="relative pl-8">
                  {/* Timeline connector */}
                  {index < seniorMilestones.length - 1 && (
                    <div className="absolute top-6 left-3 h-full w-0.5 bg-emerald-200"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`absolute top-1 left-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    milestone.completed 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-500' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {milestone.completed && (
                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      <Badge variant={milestone.completed ? "success" : "outline"} className={milestone.completed ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : ""}>
                        {milestone.date}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button>
                View Complete Senior Checklist
              </Button>
            </div>
          </div>

          {/* Senior Events */}
          <h2 className="text-2xl font-bold text-white mb-6">Senior Events</h2>
          
          {/* Event categories tabs */}
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-5 w-full max-w-3xl mx-auto">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="graduation">Graduation</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="preparation">Preparation</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow card-themed backdrop-blur-md">
                {event.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/500x300?text=${event.title}`;
                      }}
                    />
                  </div>
                )}
                <CardHeader className={event.image ? "" : "pt-6"}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant={
                      event.category === "graduation" ? "default" : 
                      event.category === "social" ? "secondary" : 
                      event.category === "academic" ? "outline" : 
                      "destructive"
                    }>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-0">
                  <div className="flex items-center text-sm">
                    <svg className="h-4 w-4 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="h-4 w-4 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  {event.cost && (
                    <div className="flex items-center text-sm">
                      <svg className="h-4 w-4 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.cost}</span>
                    </div>
                  )}
                  {event.registrationDeadline && (
                    <div className="flex items-center text-sm">
                      <svg className="h-4 w-4 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-500">Registration Deadline: {event.registrationDeadline}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4 pb-4">
                  {event.registrationRequired ? (
                    <Button onClick={() => handleRegisterClick(event)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Register / RSVP
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Additional Resources */}          <h2 className="text-2xl font-bold text-white mb-6">Senior Resources</h2>
          <div className="card-themed backdrop-blur-md rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="font-semibold">Senior Handbook</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Complete guide to senior year requirements and events</p>
                  <Button variant="link" className="p-0 h-auto text-emerald-700">Download PDF</Button>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold">Counseling Support</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">College application and career resources</p>
                  <Button variant="link" className="p-0 h-auto text-emerald-700">Contact Counselors</Button>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold">Graduation Information</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Everything you need to know about graduation day</p>
                  <Button variant="link" className="p-0 h-auto text-emerald-700">Learn More</Button>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold">Senior Photos</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Information about senior portraits and yearbook photos</p>
                  <Button variant="link" className="p-0 h-auto text-emerald-700">Schedule Now</Button>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-semibold">Senior Fees</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Information about required senior fees and payment options</p>
                  <Button variant="link" className="p-0 h-auto text-emerald-700">Pay Fees Online</Button>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="font-semibold">Senior Trip</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Information about the senior class trip and payment deadlines</p>
                  <Button variant="link" className="p-0 h-auto text-emerald-700">Register for Trip</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for {selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Complete the form below to register for this event.
              {selectedEvent?.cost && <span className="block mt-1 font-semibold">Cost: {selectedEvent.cost}</span>}
              {selectedEvent?.registrationDeadline && <span className="block mt-1 text-red-500">Registration Deadline: {selectedEvent.registrationDeadline}</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Your school email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" placeholder="Your student ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Your phone number" />
              </div>
            </div>
            {selectedEvent?.cost && (
              <div className="space-y-2">
                <Label htmlFor="payment">Payment Method</Label>
                <select id="payment" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select payment method</option>
                  <option value="online">Pay Online Now</option>
                  <option value="cash">Pay Cash at Event</option>
                  <option value="check">Pay by Check</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="special-requests">Special Requests or Accommodations</Label>
              <Textarea id="special-requests" placeholder="Any special requests or accommodations you may need" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
