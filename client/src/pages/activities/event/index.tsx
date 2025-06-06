import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ThemedPageWrapper, PrimaryButton, SecondaryButton, OutlineButton, ThemedCard } from "@/components/ThemedComponents";

// Define a type for the event
type Event = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  image?: string;
  isPinned?: boolean;
  category: string;
  ticketPrice?: number;
  volunteerNeeded?: boolean;
  volunteerPositions?: VolunteerPosition[];
  ticketTypes?: TicketType[];
  details?: string;
  organizer?: string;
  contactEmail?: string;
};

type VolunteerPosition = {
  id: string;
  title: string;
  description: string;
  spotsAvailable: number;
  timeCommitment: string;
};

type TicketType = {
  id: string;
  name: string;
  price: number;
  available: number;
  description?: string;
};

// Mock data for events (in a real app this would come from an API)
const eventsData: Record<string, Event> = {
  "homecoming-2025": {
    id: "homecoming-2025",
    title: "Homecoming 2025",
    date: "October 15, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "School Gymnasium",
    description: "Annual homecoming dance following the football game. Join us for a night of fun, dancing, and school spirit as we celebrate our Eagles!",
    image: "/path/to/homecoming-image.jpg",
    isPinned: true,
    category: "Dance",
    ticketPrice: 25,
    volunteerNeeded: true,
    details: "Homecoming is one of the most anticipated events of the school year. The evening begins with the homecoming football game, followed by the dance in our beautifully decorated gymnasium. There will be a DJ, photo booth, refreshments, and much more!",
    organizer: "Student Council",
    contactEmail: "studentcouncil@eshs.edu",
    volunteerPositions: [
      {
        id: "setup",
        title: "Setup Crew",
        description: "Help set up decorations, tables, and chairs before the event.",
        spotsAvailable: 10,
        timeCommitment: "4:00 PM - 6:30 PM"
      },
      {
        id: "food",
        title: "Refreshment Station",
        description: "Manage refreshment tables during the event.",
        spotsAvailable: 6,
        timeCommitment: "6:30 PM - 11:30 PM"
      },
      {
        id: "cleanup",
        title: "Cleanup Crew",
        description: "Help clean up after the event.",
        spotsAvailable: 8,
        timeCommitment: "11:00 PM - 12:30 AM"
      }
    ],
    ticketTypes: [
      {
        id: "standard",
        name: "Standard Ticket",
        price: 25,
        available: 300,
        description: "General admission to the dance"
      },
      {
        id: "couple",
        name: "Couple Ticket",
        price: 40,
        available: 150,
        description: "Admission for two people (save $10)"
      },
      {
        id: "vip",
        name: "VIP Ticket",
        price: 40,
        available: 50,
        description: "Includes priority entry, special photo opportunities, and premium refreshments"
      }
    ]
  },
  "winter-formal-2025": {
    id: "winter-formal-2025",
    title: "Winter Formal",
    date: "December 12, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "Grand Ballroom Hotel",
    description: "Elegant winter formal dance held at the prestigious Grand Ballroom Hotel.",
    image: "/path/to/winterformal-image.jpg",
    isPinned: true,
    category: "Dance",
    ticketPrice: 35,
    volunteerNeeded: true,
    details: "Winter Formal is our elegant holiday celebration. This year's theme is 'Winter Wonderland'. The event will be held at the beautiful Grand Ballroom Hotel, featuring professional photography, catered hors d'oeuvres, and a professional DJ.",
    organizer: "Senior Class Council",
    contactEmail: "seniorclass@eshs.edu",
    volunteerPositions: [
      {
        id: "decorations",
        title: "Decoration Committee",
        description: "Help set up decorations at the venue.",
        spotsAvailable: 8,
        timeCommitment: "3:00 PM - 6:30 PM"
      },
      {
        id: "check-in",
        title: "Check-in Table",
        description: "Verify tickets and manage entry.",
        spotsAvailable: 4,
        timeCommitment: "6:30 PM - 9:00 PM"
      }
    ],
    ticketTypes: [
      {
        id: "standard",
        name: "Standard Ticket",
        price: 35,
        available: 250,
        description: "General admission to the winter formal"
      },
      {
        id: "couple",
        name: "Couple Ticket",
        price: 60,
        available: 125,
        description: "Admission for two people (save $10)"
      }
    ]
  }
};

export default function EventPage() {
  // Extract the event ID from the URL
  const [match, params] = useRoute("/activities/event/:id");
  const [, setLocation] = useLocation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");

  useEffect(() => {
    if (match && params?.id) {
      // In a real app, this would be an API call
      const eventData = eventsData[params.id];
      
      if (eventData) {
        setEvent(eventData);
      }
      
      setLoading(false);

      // Check if we should open the volunteer dialog directly
      if (window.location.search.includes('volunteer=true')) {
        setActiveTab('volunteer');
      }
    }
  }, [match, params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  if (!event) {
    return (
      <ThemedPageWrapper pageType="activities">        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-xl text-gray-200 mb-8">The event you're looking for doesn't exist or may have been removed.</p>
          <OutlineButton onClick={() => setLocation("/")}>Back to Campus</OutlineButton>
        </div>
      </ThemedPageWrapper>
    );
  }

  return (
    <ThemedPageWrapper pageType="activities">
      <div className="container mx-auto px-4 py-12">        {/* Back button */}
        <OutlineButton 
          className="mb-6 flex items-center space-x-2" 
          onClick={() => setLocation("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
          Back to Campus
        </OutlineButton>
          {/* Event Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-2/3">
            <ThemedCard className="p-6 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">{event.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-green-700/50 border-green-500 text-green-200">{event.category}</Badge>
                    {event.isPinned && <Badge className="bg-orange-500">Featured Event</Badge>}
                  </div>
                </div>
                {event.ticketPrice !== undefined && (
                  <div className="text-xl font-bold text-emerald-400">
                    {event.ticketPrice > 0 ? `$${event.ticketPrice}` : 'Free'}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Date & Time</h3>
                  <p className="font-medium text-white">{event.date}</p>
                  {event.time && <p className="text-gray-300">{event.time}</p>}
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Location</h3>
                  <p className="font-medium text-white">{event.location}</p>
                </div>
              </div>
              
              <div className="my-6">
                <h3 className="text-sm text-gray-400 uppercase mb-2">About This Event</h3>
                <p className="whitespace-pre-line text-gray-200">{event.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <PrimaryButton size="lg" onClick={() => setTicketDialogOpen(true)}>
                  Get Tickets
                </PrimaryButton>
                {event.volunteerNeeded && (
                  <OutlineButton size="lg" onClick={() => setVolunteerDialogOpen(true)}>
                    Volunteer for This Event
                  </OutlineButton>
                )}
                <SecondaryButton size="lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v5.5"/><path d="M16 8h-8"/><path d="M9 12H8"/><path d="M16 12h-3"/><path d="M22 16.5h-5.5"/><path d="M22 20h-5.5"/><path d="M19.3 20.3a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4z"/><path d="M19.3 17.2a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4z"/></svg>
                  Add to Calendar
                </SecondaryButton>
                <SecondaryButton size="lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Share                </SecondaryButton>
              </div>
            </ThemedCard>
          </div>
          
          <div className="w-full md:w-1/3">
            {event.image ? (
              <div className="h-64 md:h-72 w-full rounded-xl overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Event+Image";
                  }}
                />
              </div>
            ) : (
              <div className="h-64 md:h-72 w-full bg-blue-800 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-medium">No image available</span>
              </div>
            )}
              {/* Organizer Info */}
            {(event.organizer || event.contactEmail) && (
              <ThemedCard className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Organizer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.organizer && <p className="text-sm mb-1 text-gray-300"><span className="font-medium">Organized by:</span> {event.organizer}</p>}
                  {event.contactEmail && <p className="text-sm text-gray-300"><span className="font-medium">Contact:</span> {event.contactEmail}</p>}
                </CardContent>
              </ThemedCard>
            )}
          </div>
        </div>
          {/* Event Details Tabs */}
        <ThemedCard className="p-6 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              {event.ticketTypes && <TabsTrigger value="tickets">Tickets</TabsTrigger>}
              {event.volunteerNeeded && <TabsTrigger value="volunteer">Volunteer</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4 text-white">Event Details</h2>
                <p className="whitespace-pre-line text-gray-200">{event.details || event.description}</p>
              </div>
            </TabsContent>
          
          {event.ticketTypes && (            <TabsContent value="tickets" className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-white">Available Tickets</h2>
              <div className="grid gap-4">
                {event.ticketTypes.map((ticket) => (
                  <ThemedCard key={ticket.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">{ticket.name}</CardTitle>
                        <div className="text-xl font-bold text-emerald-400">${ticket.price}</div>
                      </div>
                      {ticket.description && <CardDescription className="text-gray-300">{ticket.description}</CardDescription>}
                    </CardHeader>
                    <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                      <div className="text-sm text-gray-300">
                        {ticket.available > 0 ? `${ticket.available} available` : 'Sold Out'}
                      </div>
                      <PrimaryButton 
                        disabled={ticket.available <= 0}
                        onClick={() => {
                          setSelectedTicketType(ticket.id);
                          setTicketDialogOpen(true);
                        }}
                      >
                        Select
                      </PrimaryButton>
                    </CardFooter>
                  </ThemedCard>
                ))}
              </div>
            </TabsContent>
          )}
          
          {event.volunteerNeeded && (            <TabsContent value="volunteer" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Volunteer Opportunities</h2>
                <PrimaryButton onClick={() => setVolunteerDialogOpen(true)}>Apply to Volunteer</PrimaryButton>
              </div>
              
              {event.volunteerPositions ? (
                <div className="grid gap-4">
                  {event.volunteerPositions.map((position) => (
                    <ThemedCard key={position.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{position.title}</CardTitle>
                            <CardDescription className="text-gray-300">{position.description}</CardDescription>
                          </div>
                          <Badge variant={position.spotsAvailable > 0 ? 'outline' : 'secondary'}>
                            {position.spotsAvailable} spot{position.spotsAvailable !== 1 ? 's' : ''} left
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                        <div className="text-sm text-gray-300">
                          Time commitment: <span className="font-medium">{position.timeCommitment}</span>
                        </div>
                        <OutlineButton 
                          disabled={position.spotsAvailable <= 0}
                          onClick={() => {
                            setSelectedPosition(position.id);
                            setVolunteerDialogOpen(true);
                          }}
                        >
                          Apply
                        </OutlineButton>
                      </CardFooter>
                    </ThemedCard>
                  ))}
                </div>
              ) : (
                <ThemedCard>
                  <CardHeader>
                    <CardTitle className="text-white">Volunteer Information</CardTitle>
                    <CardDescription className="text-gray-300">
                      We need volunteers to help make this event a success!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200">Please use the button above to apply as a volunteer. Our team will contact you with available positions and details.</p>
                  </CardContent>
                </ThemedCard>
              )}</TabsContent>
          )}
        </Tabs>
        </ThemedCard>
      </div>
      
      {/* Ticket Purchase Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Tickets</DialogTitle>
            <DialogDescription>
              Get your tickets for {event.title} on {event.date}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticketType">Select Ticket Type</Label>
              <Select 
                value={selectedTicketType || (event.ticketTypes?.[0]?.id ?? "")} 
                onValueChange={setSelectedTicketType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a ticket type" />
                </SelectTrigger>
                <SelectContent>
                  {event.ticketTypes?.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - ${type.price}
                    </SelectItem>
                  )) || (
                    <SelectItem value="standard">
                      Standard Ticket - ${event.ticketPrice}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-r-none" 
                    onClick={() => ticketQuantity > 1 && setTicketQuantity(ticketQuantity - 1)}
                    disabled={ticketQuantity <= 1}
                  >
                    -
                  </Button>
                  <Input 
                    id="quantity"
                    type="number" 
                    className="h-9 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    min={1}
                    max={10}
                    value={ticketQuantity}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= 10) {
                        setTicketQuantity(val);
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-l-none"
                    onClick={() => ticketQuantity < 10 && setTicketQuantity(ticketQuantity + 1)}
                    disabled={ticketQuantity >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">
                  ${((event.ticketTypes?.find(t => t.id === selectedTicketType)?.price || event.ticketPrice || 0) * ticketQuantity).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setTicketDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={() => {
              setLocation("/shop/checkout?event=" + event.id + "&type=" + selectedTicketType + "&quantity=" + ticketQuantity);
            }}>Proceed to Checkout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Volunteer Application Dialog */}
      <Dialog open={volunteerDialogOpen} onOpenChange={setVolunteerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Volunteer Application</DialogTitle>
            <DialogDescription>
              Apply to volunteer for {event.title}. We appreciate your help in making this event a success!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {event.volunteerPositions && (
              <div className="space-y-2">
                <Label htmlFor="position">Select Position</Label>
                <Select 
                  value={selectedPosition || ""} 
                  onValueChange={setSelectedPosition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a volunteer position" />
                  </SelectTrigger>
                  <SelectContent>
                    {event.volunteerPositions.map(position => (
                      <SelectItem key={position.id} value={position.id} disabled={position.spotsAvailable <= 0}>
                        {position.title} ({position.spotsAvailable} spot{position.spotsAvailable !== 1 ? 's' : ''} left)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {selectedPosition && 
                    event.volunteerPositions.find(p => p.id === selectedPosition)?.description
                  }
                </FormDescription>
              </div>
            )}
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="johndoe@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="(123) 456-7890" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Why would you like to volunteer?</Label>
                <Textarea id="message" placeholder="Tell us why you'd like to volunteer and any relevant experience you have." />
              </div>
            </div>
          </div>
            <DialogFooter>
            <Button type="submit" onClick={() => {
              // Here you would submit the volunteer application
              setVolunteerDialogOpen(false);
              alert("Thank you for volunteering! We'll be in touch soon.");
            }}>Submit Application</Button>
          </DialogFooter>        </DialogContent>
      </Dialog>
    </ThemedPageWrapper>
  );
}
