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
import { ThemedPageWrapper, ThemedCard, PrimaryButton, SecondaryButton, OutlineButton, ThemedInput, ThemedTabs } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for organizations data
interface Organization {
  id: string;
  name: string;
  type: "club" | "sport" | "academic" | "service" | "arts";
  description: string;
  meetingSchedule?: string;
  location?: string;
  advisor: string;
  president?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  members?: number;
  image?: string;
  events?: OrganizationEvent[];
  requirements?: string;
  applicationProcess?: string;
}

interface OrganizationEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
}

// Mock data for organizations
const organizationsData: Organization[] = [
  {
    id: "key-club",
    name: "Key Club",
    type: "service",
    description: "Key Club is an international, student-led organization providing its members with opportunities to perform service, build character and develop leadership.",
    meetingSchedule: "Every Tuesday, 3:30 PM - 4:30 PM",
    location: "Room 201",
    advisor: "Ms. Johnson",
    president: "Alex Thompson",
    email: "keyclub@elsegundohs.org",
    website: "https://www.keyclub.org",
    socialMedia: {
      instagram: "@eshs_keyclub"
    },
    members: 75,
    image: "/api/placeholder/400/300",
    events: [
      {
        id: "beach-cleanup",
        title: "Beach Cleanup",
        date: "2023-06-15",
        time: "9:00 AM - 12:00 PM",
        location: "El Segundo Beach",
        description: "Join us for our monthly beach cleanup! Bring gloves and sunscreen."
      },
      {
        id: "food-drive",
        title: "Food Drive",
        date: "2023-06-22",
        time: "All Day",
        location: "School Quad",
        description: "Collecting non-perishable food items for the local food bank."
      }
    ],
    requirements: "Open to all students. Service hour requirements apply.",
    applicationProcess: "Attend the first meeting of the year and fill out the membership form."
  },
  {
    id: "debate-team",
    name: "Debate Team",
    type: "academic",
    description: "The debate team participates in regional and state competitions, debating current events and philosophical topics.",
    meetingSchedule: "Monday and Wednesday, 3:30 PM - 5:00 PM",
    location: "Room 105",
    advisor: "Mr. Richards",
    president: "Morgan Lee",
    email: "debate@elsegundohs.org",
    members: 20,
    image: "/api/placeholder/400/300",
    events: [
      {
        id: "regional-competition",
        title: "Regional Debate Competition",
        date: "2023-06-18",
        time: "9:00 AM - 5:00 PM",
        location: "Torrance High School",
        description: "Regional debate competition with schools from across the district."
      }
    ],
    requirements: "Tryouts required. Prior debate experience recommended.",
    applicationProcess: "Attend tryouts at the beginning of the school year."
  },
  {
    id: "basketball-team",
    name: "Basketball Team",
    type: "sport",
    description: "El Segundo High School's boys and girls basketball teams compete in the regional league.",
    meetingSchedule: "Practice: Monday-Friday, 4:00 PM - 6:00 PM",
    location: "School Gymnasium",
    advisor: "Coach Williams",
    email: "basketball@elsegundohs.org",
    website: "https://www.eshsbasketball.org",
    socialMedia: {
      instagram: "@eshs_basketball",
      twitter: "@EshsBasketball"
    },
    members: 30,
    image: "/api/placeholder/400/300",
    events: [
      {
        id: "home-game",
        title: "Home Game vs. Torrance High",
        date: "2023-06-10",
        time: "6:00 PM",
        location: "School Gymnasium",
        description: "Come support our Eagles as they take on the Torrance High Tartars!"
      },
      {
        id: "away-game",
        title: "Away Game vs. Redondo Union",
        date: "2023-06-17",
        time: "7:00 PM",
        location: "Redondo Union High School",
        description: "Away game against the Redondo Union Sea Hawks."
      }
    ],
    requirements: "Tryouts required. Physical examination form must be on file.",
    applicationProcess: "Tryouts are held at the beginning of the basketball season."
  },
  {
    id: "drama-club",
    name: "Drama Club",
    type: "arts",
    description: "The Drama Club puts on several productions throughout the year and provides opportunities for students interested in acting, directing, and technical theater.",
    meetingSchedule: "Thursday, 3:30 PM - 5:00 PM",
    location: "School Auditorium",
    advisor: "Mrs. Patel",
    president: "Jamie Wilson",
    email: "drama@elsegundohs.org",
    socialMedia: {
      instagram: "@eshs_drama"
    },
    members: 45,
    image: "/api/placeholder/400/300",
    events: [
      {
        id: "spring-musical",
        title: "Spring Musical: The Sound of Music",
        date: "2023-06-23",
        time: "7:00 PM",
        location: "School Auditorium",
        description: "Our annual spring musical featuring talented student actors and musicians."
      },
      {
        id: "auditions",
        title: "Fall Play Auditions",
        date: "2023-08-15",
        time: "3:30 PM - 6:00 PM",
        location: "School Auditorium",
        description: "Auditions for the fall play. No preparation necessary!"
      }
    ],
    requirements: "Open to all students. Auditions required for performance roles.",
    applicationProcess: "Attend an informational meeting at the beginning of the school year."
  },
  {
    id: "robotics-club",
    name: "Robotics Club",
    type: "academic",
    description: "The Robotics Club designs, builds, and programs robots to compete in regional and state competitions.",
    meetingSchedule: "Tuesday and Friday, 3:30 PM - 5:30 PM",
    location: "Engineering Lab (Room 305)",
    advisor: "Ms. Garcia",
    president: "Tyler Zhang",
    email: "robotics@elsegundohs.org",
    website: "https://www.eshsrobotics.org",
    socialMedia: {
      instagram: "@eshs_robotics"
    },
    members: 25,
    image: "/api/placeholder/400/300",
    events: [
      {
        id: "regional-competition",
        title: "FIRST Robotics Regional Competition",
        date: "2023-07-08",
        time: "8:00 AM - 6:00 PM",
        location: "Long Beach Convention Center",
        description: "Regional robotics competition featuring teams from across Southern California."
      }
    ],
    requirements: "Open to all students. Programming or engineering experience helpful but not required.",
    applicationProcess: "Attend the first meeting of the school year."
  },
  {
    id: "environmental-club",
    name: "Environmental Club",
    type: "service",
    description: "The Environmental Club works to promote sustainability and environmental awareness on campus and in the community.",
    meetingSchedule: "Every other Wednesday, 3:30 PM - 4:30 PM",
    location: "Room 210",
    advisor: "Mr. Turner",
    president: "Sam Rivera",
    email: "environment@elsegundohs.org",
    members: 30,
    image: "/api/placeholder/400/300",
    events: [
      {
        id: "tree-planting",
        title: "Community Tree Planting",
        date: "2023-06-24",
        time: "10:00 AM - 1:00 PM",
        location: "City Park",
        description: "Join us as we partner with the city to plant trees in our local park."
      }
    ],
    requirements: "Open to all students.",
    applicationProcess: "Simply attend a meeting to join."
  }
];

export default function OrganizationsPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [interestForm, setInterestForm] = useState({
    name: "",
    email: "",
    grade: "",
    reason: ""
  });

  // Handle back button click
  const handleBackClick = () => {
    setLocation("/information");
  };

  // Filter organizations based on active tab and search term
  const filteredOrganizations = organizationsData.filter(org => {
    const matchesTab = activeTab === "all" || org.type === activeTab;
    const matchesSearch = searchTerm === "" || 
                          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle organization click
  const handleOrganizationClick = (org: Organization) => {
    setSelectedOrganization(org);
    setShowModal(true);
  };

  // Handle interest form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInterestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle interest form submission
  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    alert(`Interest form submitted for ${selectedOrganization?.name}!`);
    setInterestForm({
      name: "",
      email: "",
      grade: "",
      reason: ""
    });
    setShowModal(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'club': return 'bg-blue-100 text-blue-800';
      case 'sport': return 'bg-green-100 text-green-800';
      case 'academic': return 'bg-amber-100 text-amber-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      case 'arts': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <ThemedPageWrapper pageType="information">
      {/* Background Video with Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          src={schoolVideo}
          className="absolute min-w-full min-h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>      <div className="relative z-10 flex-1 container mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold text-white">School Organizations</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
            <div className="relative w-full md:w-1/3">
              <Input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-3 md:grid-cols-6 gap-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="club">Clubs</TabsTrigger>
                <TabsTrigger value="sport">Sports</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="arts">Arts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org) => (
              <ThemedCard 
                key={org.id} 
                className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleOrganizationClick(org)}
              >
                <div className="h-48 bg-gray-200">
                  <img 
                    src={org.image || "https://via.placeholder.com/400x300"} 
                    alt={org.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="px-4 py-3 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold">{org.name}</CardTitle>
                    <Badge className={getTypeColor(org.type)}>
                      {org.type.charAt(0).toUpperCase() + org.type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Advisor: {org.advisor}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <p className="text-sm line-clamp-3">{org.description}</p>
                </CardContent>
                <CardFooter className="px-4 py-3 pt-0 text-xs text-gray-500 flex justify-between">
                  <span><i className="fas fa-users mr-1"></i> {org.members || "N/A"} members</span>
                  <span><i className="fas fa-calendar mr-1"></i> {org.meetingSchedule || "Schedule varies"}</span>                </CardFooter>
              </ThemedCard>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg">
              <i className="fas fa-search text-4xl text-gray-400 mb-2"></i>
              <p className="text-xl text-gray-500">No organizations match your search criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setActiveTab("all");
                  setSearchTerm("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Organization Details Modal */}
      {selectedOrganization && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl">{selectedOrganization.name}</DialogTitle>
                <Badge className={getTypeColor(selectedOrganization.type)}>
                  {selectedOrganization.type.charAt(0).toUpperCase() + selectedOrganization.type.slice(1)}
                </Badge>
              </div>
              <DialogDescription>
                {selectedOrganization.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <img 
                  src={selectedOrganization.image || "https://via.placeholder.com/600x400"} 
                  alt={selectedOrganization.name}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Advisor:</span> {selectedOrganization.advisor}</p>
                      {selectedOrganization.president && <p><span className="font-medium">President:</span> {selectedOrganization.president}</p>}
                      {selectedOrganization.email && <p><span className="font-medium">Email:</span> {selectedOrganization.email}</p>}
                      {selectedOrganization.website && (
                        <p>
                          <span className="font-medium">Website:</span>{" "}
                          <a href={selectedOrganization.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            Visit Website
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Meeting Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Schedule:</span> {selectedOrganization.meetingSchedule || "Varies"}</p>
                      <p><span className="font-medium">Location:</span> {selectedOrganization.location || "TBD"}</p>
                    </div>
                  </div>
                  
                  {selectedOrganization.socialMedia && Object.values(selectedOrganization.socialMedia).some(Boolean) && (
                    <div>
                      <h3 className="font-semibold mb-2">Social Media</h3>
                      <div className="flex space-x-2">
                        {selectedOrganization.socialMedia.instagram && (
                          <Button size="sm" variant="outline" className="text-pink-500">
                            <i className="fab fa-instagram mr-1"></i> Instagram
                          </Button>
                        )}
                        {selectedOrganization.socialMedia.twitter && (
                          <Button size="sm" variant="outline" className="text-blue-400">
                            <i className="fab fa-twitter mr-1"></i> Twitter
                          </Button>
                        )}
                        {selectedOrganization.socialMedia.facebook && (
                          <Button size="sm" variant="outline" className="text-blue-600">
                            <i className="fab fa-facebook mr-1"></i> Facebook
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedOrganization.events && selectedOrganization.events.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Upcoming Events</h3>
                    <div className="space-y-3">
                      {selectedOrganization.events.map((event) => (
                        <Card key={event.id} className="overflow-hidden border">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-md">{event.title}</CardTitle>
                            <CardDescription className="text-xs">
                              <span className="block"><i className="far fa-calendar mr-1"></i> {event.date}</span>
                              {event.time && <span className="block"><i className="far fa-clock mr-1"></i> {event.time}</span>}
                              {event.location && <span className="block"><i className="fas fa-map-marker-alt mr-1"></i> {event.location}</span>}
                            </CardDescription>
                          </CardHeader>
                          {event.description && (
                            <CardContent className="py-2 px-4">
                              <p className="text-sm">{event.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold mb-3">How to Join</h3>
                  <div className="space-y-3 text-sm">
                    {selectedOrganization.requirements && (
                      <p><span className="font-medium">Requirements:</span> {selectedOrganization.requirements}</p>
                    )}
                    {selectedOrganization.applicationProcess && (
                      <p><span className="font-medium">Application Process:</span> {selectedOrganization.applicationProcess}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Express Interest</h3>
                  <form onSubmit={handleSubmitInterest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name"
                          name="name"
                          value={interestForm.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade">Grade</Label>
                        <Input 
                          id="grade"
                          name="grade"
                          value={interestForm.grade}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={interestForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Why are you interested in joining?</Label>
                      <Textarea 
                        id="reason"
                        name="reason"
                        value={interestForm.reason}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Interest</Button>
                  </form>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </DialogContent>        </Dialog>
      )}
    </ThemedPageWrapper>
  );
}
