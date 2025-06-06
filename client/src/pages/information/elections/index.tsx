import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for election data
interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "past";
  positions: ElectionPosition[];
}

interface ElectionPosition {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  applicants?: number;
}

// Mock data for elections
const electionsData: Election[] = [
  {
    id: "fall2025",
    title: "Fall 2025 Student Council Elections",
    description: "Election for student council positions for the upcoming 2025-2026 academic year.",
    startDate: "September 15, 2025",
    endDate: "September 30, 2025",
    status: "upcoming",
    positions: [
      {
        id: "president-fall2025",
        title: "Student Body President",
        description: "Lead the student council and represent the student body in school-wide decisions.",
        requirements: [
          "Must be a senior in good academic standing",
          "Minimum GPA of 3.0",
          "At least one year of prior student council experience"
        ],
        applicants: 0
      },
      {
        id: "vice-president-fall2025",
        title: "Student Body Vice President",
        description: "Assist the president and lead specific initiatives as assigned.",
        requirements: [
          "Must be a junior or senior in good academic standing",
          "Minimum GPA of 3.0",
          "Prior leadership experience preferred"
        ],
        applicants: 0
      },
      {
        id: "secretary-fall2025",
        title: "Secretary",
        description: "Record meeting minutes, manage communications, and maintain records.",
        requirements: [
          "Must be a sophomore, junior, or senior in good academic standing",
          "Strong organizational and communication skills",
          "Minimum GPA of 2.75"
        ],
        applicants: 0
      },
      {
        id: "treasurer-fall2025",
        title: "Treasurer",
        description: "Manage budget, track expenses, and lead fundraising efforts.",
        requirements: [
          "Must be a sophomore, junior, or senior in good academic standing",
          "Strong math skills and attention to detail",
          "Minimum GPA of 3.0"
        ],
        applicants: 0
      }
    ]
  },
  {
    id: "spring2025",
    title: "Spring 2025 Class Representatives",
    description: "Election for class representatives for the remainder of the 2024-2025 academic year.",
    startDate: "February 1, 2025",
    endDate: "February 15, 2025",
    status: "active",
    positions: [
      {
        id: "senior-rep-spring2025",
        title: "Senior Class Representative",
        description: "Represent senior class interests on the student council.",
        requirements: [
          "Must be a current senior in good academic standing",
          "Minimum GPA of 2.75",
          "Strong communication skills"
        ],
        applicants: 3
      },
      {
        id: "junior-rep-spring2025",
        title: "Junior Class Representative",
        description: "Represent junior class interests on the student council.",
        requirements: [
          "Must be a current junior in good academic standing",
          "Minimum GPA of 2.75",
          "Strong communication skills"
        ],
        applicants: 5
      },
      {
        id: "sophomore-rep-spring2025",
        title: "Sophomore Class Representative",
        description: "Represent sophomore class interests on the student council.",
        requirements: [
          "Must be a current sophomore in good academic standing",
          "Minimum GPA of 2.75",
          "Strong communication skills"
        ],
        applicants: 2
      },
      {
        id: "freshman-rep-spring2025",
        title: "Freshman Class Representative",
        description: "Represent freshman class interests on the student council.",
        requirements: [
          "Must be a current freshman in good academic standing",
          "Minimum GPA of 2.75",
          "Strong communication skills"
        ],
        applicants: 4
      }
    ]
  },
  {
    id: "fall2024",
    title: "Fall 2024 Student Council Elections",
    description: "Election for student council positions for the 2024-2025 academic year.",
    startDate: "September 10, 2024",
    endDate: "September 25, 2024",
    status: "past",
    positions: [
      {
        id: "president-fall2024",
        title: "Student Body President",
        description: "Lead the student council and represent the student body in school-wide decisions.",
        requirements: [
          "Must be a senior in good academic standing",
          "Minimum GPA of 3.0",
          "At least one year of prior student council experience"
        ]
      },
      {
        id: "vice-president-fall2024",
        title: "Student Body Vice President",
        description: "Assist the president and lead specific initiatives as assigned.",
        requirements: [
          "Must be a junior or senior in good academic standing",
          "Minimum GPA of 3.0",
          "Prior leadership experience preferred"
        ]
      }
    ]
  }
];

// Election resources
const electionResources = [
  {
    title: "Election Guidelines",
    description: "Official rules and procedures for school elections",
    link: "#election-guidelines"
  },
  {
    title: "Position Descriptions",
    description: "Detailed information about each position's responsibilities",
    link: "#position-descriptions"
  },
  {
    title: "Campaign Rules",
    description: "Rules for campaign posters, speeches, and other materials",
    link: "#campaign-rules"
  },
  {
    title: "Election Timeline",
    description: "Important dates and deadlines for the election process",
    link: "#election-timeline"
  }
];

export default function Elections() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<ElectionPosition | null>(null);

  const handleBackClick = () => {
    setLocation("/information");
  };

  const handlePositionClick = (position: ElectionPosition) => {
    setSelectedPosition(position);
    setApplicationDialogOpen(true);
  };

  // Filter elections based on active tab
  const filteredElections = electionsData.filter(election => {
    if (activeTab === "upcoming") return election.status === "upcoming";
    if (activeTab === "active") return election.status === "active";
    if (activeTab === "past") return election.status === "past";
    return true;
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
      </div>      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
      
      {/* Main content */}
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
            </Button>            <h1 className="text-3xl font-bold text-white">School Elections</h1>
          </div>

          {/* Elections Banner */}
          <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Student Government Elections</h2>                <p className="mb-4">Make your voice heard! Learn about upcoming elections, positions, and how to run for office.</p>
                <div className="flex space-x-2">
                  <Button className="bg-amber-700 text-white hover:bg-amber-600">
                    Election Guidelines
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-amber-700">
                    View Election Calendar
                  </Button>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Election Tabs */}
          <Tabs defaultValue="upcoming" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            {/* Tab contents */}
            <div className="mt-6">
              {filteredElections.length > 0 ? (
                filteredElections.map((election) => (
                  <Card key={election.id} className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <CardHeader>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <CardTitle className="text-xl text-white">{election.title}</CardTitle>
                          <CardDescription className="text-gray-300">{election.description}</CardDescription>
                        </div>
                        <Badge variant={
                          election.status === "upcoming" ? "outline" : 
                          election.status === "active" ? "default" : 
                          "secondary"
                        }>
                          {election.status === "upcoming" ? "Upcoming" : 
                           election.status === "active" ? "Active Now" : 
                           "Completed"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{election.startDate} - {election.endDate}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold mb-4">Available Positions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {election.positions.map((position) => (
                          <Card 
                            key={position.id} 
                            className={`hover:shadow-md transition-all cursor-pointer border ${
                              election.status === 'active' ? 'border-amber-300 hover:border-amber-500' : 'border-gray-200'
                            }`}
                            onClick={() => election.status === "active" && handlePositionClick(position)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold">{position.title}</h4>
                                {position.applicants !== undefined && (
                                  <Badge variant="outline" className="ml-2">{position.applicants} Applicant(s)</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 my-2">{position.description}</p>
                              <div className="text-xs mt-2">
                                <p className="font-medium">Requirements:</p>
                                <ul className="list-disc list-inside">
                                  {position.requirements.map((req, index) => (
                                    <li key={index} className="text-gray-600">{req}</li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {election.status === "active" && (
                        <div className="mt-6 text-center">
                          <Button className="bg-amber-600 hover:bg-amber-700">
                            Run for Office
                          </Button>
                        </div>
                      )}
                      
                      {election.status === "past" && (
                        <div className="mt-6 text-center">
                          <Button variant="outline">
                            View Election Results
                          </Button>
                        </div>
                      )}                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">No {activeTab} elections</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    There are currently no {activeTab} elections scheduled.
                  </p>
                </div>              )}
            </div>
          </Tabs>

          {/* Election Resources */}
          <h2 className="text-2xl font-bold text-white mb-6">Election Resources</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {electionResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-all bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{resource.title}</h3>
                      <p className="text-sm text-gray-300">{resource.description}</p>
                    </div>
                    <Button variant="ghost" className="ml-auto" asChild>
                      <a href={resource.link}>View</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}            </div>
          </div>

          {/* Election FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Election FAQ</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              <div className="border-b border-gray-600 pb-4">
                <h3 className="font-semibold mb-2 text-white">Who can run for student government positions?</h3>
                <p className="text-gray-300">Any student in good academic standing who meets the specific requirements for the position. Requirements vary by position and are listed in the position details.</p>
              </div>
              <div className="border-b border-gray-600 pb-4">
                <h3 className="font-semibold mb-2">How do I run for a position?</h3>
                <p className="text-gray-600">Complete the application form during the application period, gather the required signatures, and submit all materials by the deadline. Candidates must also attend a mandatory information session.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">What are the campaign rules?</h3>
                <p className="text-gray-600">Campaigns must follow school guidelines, including poster size restrictions, approval for all materials, and limitations on campaign spending. See the Campaign Rules document for details.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">When and how do voting take place?</h3>
                <p className="text-gray-600">Voting takes place online through the school portal during the designated election period. All currently enrolled students are eligible to vote for positions that represent them.</p>              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedPosition?.title}</DialogTitle>
            <DialogDescription>
              Please complete the application form below. All fields are required.
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
            <div className="space-y-2">
              <Label htmlFor="grade">Current Grade</Label>
              <select id="grade" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Select your grade</option>
                <option value="9">9th Grade (Freshman)</option>
                <option value="10">10th Grade (Sophomore)</option>
                <option value="11">11th Grade (Junior)</option>
                <option value="12">12th Grade (Senior)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statement">Personal Statement</Label>
              <Textarea id="statement" placeholder="Why are you running for this position? What qualifies you? What are your goals if elected?" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements Confirmation</Label>
              <div className="space-y-2 bg-gray-800 border border-gray-600 p-3 rounded-md">
                {selectedPosition?.requirements.map((req, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <input type="checkbox" id={`req-${index}`} className="mt-1" />
                    <Label htmlFor={`req-${index}`} className="text-sm">{req}</Label>
                  </div>
                ))}
              </div>
            </div>          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplicationDialogOpen(false)}>Cancel</Button>
            <Button>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
