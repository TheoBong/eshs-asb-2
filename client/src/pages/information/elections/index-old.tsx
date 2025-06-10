import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for student government positions
interface Position {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  currentHolder?: string;
  term: string;
}

interface ClassPositions {
  class: string;
  positions: Position[];
}

// Mock data for class positions
const classPositions: ClassPositions[] = [
  {
    class: "Officer",
    positions: [
      {
        id: "president",
        title: "Student Body President",
        description: "Lead the student council and represent the student body in school-wide decisions.",
        responsibilities: [
          "Preside over student council meetings",
          "Represent students in administrative meetings",
          "Lead school-wide initiatives and events",
          "Coordinate with school administration"
        ],
        currentHolder: "Sarah Johnson",
        term: "2024-2025"
      },
      {
        id: "vice-president",
        title: "Student Body Vice President",
        description: "Assist the president and lead specific initiatives as assigned.",
        responsibilities: [
          "Support the president in all duties",
          "Lead special committees and projects",
          "Fill in for president when needed",
          "Coordinate class representatives"
        ],
        currentHolder: "Marcus Chen",
        term: "2024-2025"
      },
      {
        id: "secretary",
        title: "Secretary",
        description: "Record meeting minutes, manage communications, and maintain records.",
        responsibilities: [
          "Take detailed meeting minutes",
          "Manage official communications",
          "Maintain student government records",
          "Coordinate meeting schedules"
        ],
        currentHolder: "Emma Rodriguez",
        term: "2024-2025"
      },
      {
        id: "treasurer",
        title: "Treasurer",
        description: "Manage budget, track expenses, and lead fundraising efforts.",
        responsibilities: [
          "Manage student government budget",
          "Track all expenses and income",
          "Coordinate fundraising activities",
          "Present financial reports"
        ],
        currentHolder: "David Kim",
        term: "2024-2025"
      }
    ]
  },
  {
    class: "Senior",
    positions: [
      {
        id: "senior-class-president",
        title: "Senior Class President",
        description: "Lead the senior class and coordinate graduation events.",
        responsibilities: [
          "Organize senior class activities",
          "Coordinate graduation planning",
          "Represent senior interests",
          "Lead prom committee"
        ],
        currentHolder: "Ashley Park",
        term: "2024-2025"
      },
      {
        id: "senior-class-representative",
        title: "Senior Class Representative",
        description: "Represent senior class interests on the student council.",
        responsibilities: [
          "Attend student council meetings",
          "Communicate senior class concerns",
          "Assist with senior events",
          "Coordinate with other representatives"
        ],
        currentHolder: "Jordan Smith",
        term: "2024-2025"
      }
    ]
  },
  {
    class: "Junior",
    positions: [
      {
        id: "junior-class-president",
        title: "Junior Class President",
        description: "Lead the junior class and coordinate junior-specific events.",
        responsibilities: [
          "Organize junior class activities",
          "Plan junior prom",
          "Represent junior interests",
          "Coordinate fundraising efforts"
        ],
        currentHolder: "Alex Thompson",
        term: "2024-2025"
      },
      {
        id: "junior-class-representative",
        title: "Junior Class Representative",
        description: "Represent junior class interests on the student council.",
        responsibilities: [
          "Attend student council meetings",
          "Communicate junior class concerns",
          "Assist with junior events",
          "Coordinate with other representatives"
        ],
        currentHolder: "Maya Patel",
        term: "2024-2025"
      }
    ]
  },
  {
    class: "Sophomore",
    positions: [
      {
        id: "sophomore-class-president",
        title: "Sophomore Class President",
        description: "Lead the sophomore class and coordinate sophomore-specific events.",
        responsibilities: [
          "Organize sophomore class activities",
          "Plan sophomore events",
          "Represent sophomore interests",
          "Coordinate class fundraising"
        ],
        currentHolder: "Tyler Martinez",
        term: "2024-2025"
      },
      {
        id: "sophomore-class-representative",
        title: "Sophomore Class Representative",
        description: "Represent sophomore class interests on the student council.",
        responsibilities: [
          "Attend student council meetings",
          "Communicate sophomore class concerns",
          "Assist with sophomore events",
          "Coordinate with other representatives"
        ],
        currentHolder: "Zoe Williams",
        term: "2024-2025"
      }
    ]
  },
  {
    class: "Freshman",
    positions: [
      {
        id: "freshman-class-president",
        title: "Freshman Class President",
        description: "Lead the freshman class and help new students get involved.",
        responsibilities: [
          "Organize freshman class activities",
          "Plan freshman events",
          "Represent freshman interests",
          "Help integrate new students"
        ],
        currentHolder: "Cameron Lee",
        term: "2024-2025"
      },
      {
        id: "freshman-class-representative",
        title: "Freshman Class Representative",
        description: "Represent freshman class interests on the student council.",
        responsibilities: [
          "Attend student council meetings",
          "Communicate freshman class concerns",
          "Assist with freshman events",
          "Coordinate with other representatives"
        ],
        currentHolder: "Riley Anderson",
        term: "2024-2025"
      }
    ]
  },
  {
    class: "Committee",
    positions: [
      {
        id: "events-coordinator",
        title: "Events Coordinator",
        description: "Organize and coordinate all school-wide events and activities.",
        responsibilities: [
          "Plan and execute school events",
          "Coordinate with administration",
          "Manage event budgets",
          "Recruit event volunteers"
        ],
        currentHolder: "Sam Davis",
        term: "2024-2025"
      },
      {
        id: "communications-director",
        title: "Communications Director",
        description: "Manage student government communications and social media.",
        responsibilities: [
          "Manage social media accounts",
          "Create promotional materials",
          "Coordinate announcements",
          "Maintain website content"
        ],
        currentHolder: "Quinn Taylor",
        term: "2024-2025"
      },
      {
        id: "community-outreach",
        title: "Community Outreach Coordinator",
        description: "Coordinate volunteer activities and community service projects.",
        responsibilities: [
          "Organize community service projects",
          "Coordinate volunteer opportunities",
          "Build community partnerships",
          "Track service hours"
        ],
        currentHolder: "Avery Johnson",
        term: "2024-2025"
      },
      {
        id: "spirit-coordinator",
        title: "Spirit Coordinator",
        description: "Organize school spirit events and promote school pride.",
        responsibilities: [
          "Plan spirit weeks and events",
          "Coordinate pep rallies",
          "Promote school traditions",
          "Organize themed days"
        ],
        currentHolder: "Casey Wilson",
        term: "2024-2025"
      }
    ]
  }
];

// Government resources
const governmentResources = [
  {
    title: "Petition To Run",
    description: "Detailed information about each position's responsibilities",
    link: "#position-descriptions"
  },
  {
    title: "Teacher Recommendation Forms",
    description: "Access to student council meeting minutes and records",
    link: "#meeting-minutes"
  },
  {
    title: "ASB Handbook",
    description: "How to contact your class representatives and officers",
    link: "#contact-reps"
  },
  {
    title: "Meeting Minutes",
    description: "Information on how to participate in student government",
    link: "#get-involved"
  }
];

export default function Elections() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Officer");

  const handleBackClick = () => {
    setLocation("/information");
  };

  // Get positions for active tab
  const currentPositions = classPositions.find(cp => cp.class === activeTab)?.positions || [];

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
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Student Government</h1>
          </div>

          {/* Student Government Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Student Government Representatives</h2>
                <p className="mb-4">Meet your student government representatives and learn about their roles in representing your voice at school.</p>
                
              </div>
            </div>
          </div>

          {/* Class Position Tabs */}
          <Tabs defaultValue="Officer" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-6 w-full max-w-4xl mx-auto">
              <TabsTrigger value="Officer" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Officer</TabsTrigger>
              <TabsTrigger value="Senior" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Senior</TabsTrigger>
              <TabsTrigger value="Junior" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Junior</TabsTrigger>
              <TabsTrigger value="Sophomore" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sophomore</TabsTrigger>
              <TabsTrigger value="Freshman" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Freshman</TabsTrigger>
              <TabsTrigger value="Committee" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Committee</TabsTrigger>
            </TabsList>

            {/* Tab contents */}
            <div className="mt-6">
              {currentPositions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPositions.map((position) => (
                    <ThemedCard key={position.id} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{position.title}</h3>
                            <p className="text-gray-300 mb-3">{position.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {position.term}
                          </Badge>
                        </div>
                        
                        {position.currentHolder && (
                          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-sm font-medium text-gray-200">Current Representative</p>
                            <p className="text-white font-semibold">{position.currentHolder}</p>
                          </div>
                        )}

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-200 mb-2">Key Responsibilities:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {position.responsibilities.map((responsibility, index) => (
                              <li key={index} className="text-gray-300 text-sm">{responsibility}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex space-x-2">
                          <Button className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3 mr-4" size="sm">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </ThemedCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">No positions found</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    There are currently no positions listed for this category.
                  </p>
                </div>
              )}
            </div>
          </Tabs>

          {/* Government Resources */}
          <h2 className="text-2xl font-bold text-white mb-6">Student Government Resources</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {governmentResources.map((resource, index) => (
                <ThemedCard key={index} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
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
                    <OutlineButton className="ml-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3 mr-4" asChild>
                      <a href={resource.link}>View</a>
                    </OutlineButton>
                  </div>
                </ThemedCard>
              ))}
            </div>
          </div>

          {/* Student Government FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Student Government FAQ</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">How can I contact my class representative?</h3>
                <p className="text-gray-300">You can reach out to your class representatives through the school's student portal or by visiting the student government office during lunch hours.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">When does the student council meet?</h3>
                <p className="text-gray-300">The student council meets every other Wednesday during lunch in the main conference room. All meetings are open to student observers.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">How can I get involved in student government?</h3>
                <p className="text-gray-300">You can attend meetings, join committees, volunteer for events, or consider running for office during the next election cycle. Contact any representative to learn about opportunities.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">How do I submit ideas or concerns to student government?</h3>
                <p className="text-gray-300">Submit suggestions through the student portal, speak with your class representative, or attend a student council meeting to voice your ideas during the public comment period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
