import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for arts programs
interface ArtsProgram {
  id: string;
  name: string;
  type: "Visual Arts" | "Performing Arts" | "Music";
  description: string;
  instructor: string;
  schedule: string;
  location: string;
  requirements: string[];
  upcomingEvents?: string[];
}

// Mock data for arts programs
const artsPrograms: ArtsProgram[] = [
  {
    id: "theater",
    name: "Theater Arts",
    type: "Performing Arts",
    description: "Join our award-winning theater program and participate in fall and spring productions.",
    instructor: "Ms. Anderson",
    schedule: "Monday-Thursday 3:30-5:30 PM",
    location: "Auditorium",
    requirements: [
      "Audition required for major roles",
      "Commitment to full rehearsal schedule",
      "Participation in at least one production per year",
      "Background check for chaperones"
    ],
    upcomingEvents: [
      "Fall Play: 'Our Town' - November 2024",
      "Winter Showcase - December 2024",
      "Spring Musical: 'Grease' - March 2025"
    ]
  },
  {
    id: "visual-arts",
    name: "Visual Arts",
    type: "Visual Arts",
    description: "Explore painting, drawing, sculpture, and digital arts in our comprehensive visual arts program.",
    instructor: "Mr. Chen",
    schedule: "Daily during class periods",
    location: "Art Studios A & B",
    requirements: [
      "Basic art supplies provided",
      "Students may need specialized materials for advanced projects",
      "Portfolio development required",
      "Participation in art shows encouraged"
    ],
    upcomingEvents: [
      "Student Art Exhibition - October 2024",
      "Regional Art Competition - February 2025",
      "Senior Portfolio Show - May 2025"
    ]
  },
  {
    id: "band",
    name: "Concert Band",
    type: "Music",
    description: "Our concert band performs at school events, competitions, and community functions.",
    instructor: "Mr. Rodriguez",
    schedule: "Monday-Friday 7:30-8:30 AM",
    location: "Band Room",
    requirements: [
      "Own instrument or rent through school program",
      "Previous musical experience preferred",
      "Participation in all concerts mandatory",
      "Sectional rehearsals as needed"
    ],
    upcomingEvents: [
      "Fall Concert - November 2024",
      "Holiday Performance - December 2024",
      "Spring Concert - April 2025",
      "Graduation Ceremony - June 2025"
    ]
  },
  {
    id: "choir",
    name: "School Choir",
    type: "Music",
    description: "Vocal ensemble performing a variety of musical styles from classical to contemporary.",
    instructor: "Ms. Johnson",
    schedule: "Monday-Friday 8:30-9:30 AM",
    location: "Choir Room",
    requirements: [
      "Vocal audition required",
      "Commitment to all performances",
      "Purchase of choir dress/tuxedo",
      "Attendance at extra rehearsals before concerts"
    ],
    upcomingEvents: [
      "Fall Choral Festival - October 2024",
      "Winter Concert - December 2024",
      "State Competition - March 2025"
    ]
  },
  {
    id: "dance",
    name: "Dance Team",
    type: "Performing Arts",
    description: "Competitive dance team performing at games, competitions, and school events.",
    instructor: "Ms. Martinez",
    schedule: "Monday-Friday 3:00-5:00 PM",
    location: "Dance Studio",
    requirements: [
      "Tryouts held in spring for following year",
      "Previous dance experience required",
      "Physical fitness assessment",
      "Commitment to competition schedule"
    ],
    upcomingEvents: [
      "Football Game Performances - Fall 2024",
      "Winter Dance Competition - January 2025",
      "Spring Showcase - April 2025"
    ]
  },
  {
    id: "photography",
    name: "Photography Club",
    type: "Visual Arts",
    description: "Learn digital photography, photo editing, and visual storytelling techniques.",
    instructor: "Mr. Davis",
    schedule: "Wednesdays 3:30-4:30 PM",
    location: "Media Lab",
    requirements: [
      "Digital camera recommended (school cameras available)",
      "Basic computer skills helpful",
      "Participation in photo exhibitions",
      "Field trip permission forms"
    ],
    upcomingEvents: [
      "Nature Photography Workshop - October 2024",
      "Student Photo Exhibition - December 2024",
      "Regional Photography Contest - March 2025"
    ]
  }
];

// Arts resources
const artsResources = [
  {
    title: "Performance Calendar",
    description: "Schedule of all upcoming performances and exhibitions",
    link: "#performance-calendar"
  },
  {
    title: "Audition Information",
    description: "Dates and requirements for arts program auditions",
    link: "#auditions"
  },
  {
    title: "Equipment & Supplies",
    description: "Information about renting or purchasing arts equipment",
    link: "#equipment"
  },
  {
    title: "Portfolio Guidelines",
    description: "Requirements for visual arts and performance portfolios",
    link: "#portfolios"
  }
];

export default function Arts() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("All");

  const handleBackClick = () => {
    setLocation("/information");
  };

  // Filter programs by type
  const filteredPrograms = activeTab === "All" 
    ? artsPrograms 
    : artsPrograms.filter(program => program.type === activeTab);

  const types = ["All", "Visual Arts", "Performing Arts", "Music"];

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
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Arts Programs</h1>
          </div>

          {/* Arts Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Creative Arts at Our School</h2>
                <p className="mb-4">Express yourself through visual arts, music, theater, dance, and more.</p>
                <div className="flex space-x-2">
                  <PrimaryButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    Join a Program
                  </PrimaryButton>
                  <OutlineButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    View Performances
                  </OutlineButton>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Type Filter Tabs */}
          <Tabs defaultValue="All" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="All" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="Visual Arts" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Visual Arts</TabsTrigger>
              <TabsTrigger value="Performing Arts" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Performing Arts</TabsTrigger>
              <TabsTrigger value="Music" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Music</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Arts Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredPrograms.map((program) => (
              <ThemedCard key={program.id} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{program.name}</h3>
                      <p className="text-gray-300 mb-3">{program.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {program.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Instructor: <span className="text-white">{program.instructor}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Schedule: <span className="text-white">{program.schedule}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Location: <span className="text-white">{program.location}</span></p>
                    </div>
                  </div>

                  {program.upcomingEvents && (
                    <div className="mb-4 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <p className="text-sm font-medium text-purple-200 mb-2">Upcoming Events:</p>
                      <ul className="text-sm text-purple-100 space-y-1">
                        {program.upcomingEvents.map((event, index) => (
                          <li key={index}>• {event}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-200 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {program.requirements.map((requirement, index) => (
                        <li key={index} className="text-gray-300 text-sm">{requirement}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <OutlineButton className="text-white hover:text-gray-300" size="sm">
                      Join Program
                    </OutlineButton>
                    <OutlineButton className="text-white hover:text-gray-300" size="sm">
                      Learn More
                    </OutlineButton>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>

          {/* Arts Resources */}
          <h2 className="text-2xl font-bold text-white mb-6">Arts Resources</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artsResources.map((resource, index) => (
                <ThemedCard key={index} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <div className="p-4 flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{resource.title}</h3>
                      <p className="text-sm text-gray-300">{resource.description}</p>
                    </div>
                    <OutlineButton className="ml-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3" asChild>
                      <a href={resource.link}>View</a>
                    </OutlineButton>
                  </div>
                </ThemedCard>
              ))}
            </div>
          </div>

          {/* Arts FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Arts FAQ</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">Do I need previous experience to join?</h3>
                <p className="text-gray-300">Most programs welcome beginners, though some advanced programs may require auditions or previous experience. Check individual program requirements.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">What equipment do I need to provide?</h3>
                <p className="text-gray-300">Basic supplies are usually provided by the school. Students may need to purchase specialized items for advanced projects or personal instruments for music programs.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">Can I participate in multiple arts programs?</h3>
                <p className="text-gray-300">Yes! Many students participate in multiple programs. Just be mindful of scheduling conflicts, especially during performance seasons.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Are there opportunities for advanced students?</h3>
                <p className="text-gray-300">We offer advanced courses, independent study options, and opportunities to compete in regional and state competitions for qualified students.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
