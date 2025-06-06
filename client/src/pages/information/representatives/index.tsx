import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for representatives data
interface Representative {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  grade: number;
  bio: string;
  image?: string;
  committee?: string;
  term: string;
  goals: string[];
}

// Mock data for representatives
const representativesData: Record<string, Representative[]> = {
  "2024-2025": [
    {
      id: "pres-2024",
      name: "Emily Johnson",
      position: "Student Body President",
      email: "emily.johnson@student.edu",
      phone: "310-555-1234",
      grade: 12,
      bio: "Emily is passionate about creating an inclusive environment for all students. She has served on the student council for three years.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Improve communication between students and administration",
        "Expand mental health resources for students",
        "Create more inclusive school events"
      ]
    },
    {
      id: "vp-2024",
      name: "Michael Chen",
      position: "Student Body Vice President",
      email: "michael.chen@student.edu",
      grade: 12,
      bio: "Michael is focused on creating more opportunities for students to engage in community service and leadership.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Establish a student mentorship program",
        "Increase participation in community service",
        "Create leadership workshops for all students"
      ]
    },
    {
      id: "secretary-2024",
      name: "Sophia Rodriguez",
      position: "Secretary",
      email: "sophia.rodriguez@student.edu",
      grade: 11,
      bio: "Sophia excels at organization and communication. She's committed to keeping accurate records and improving student body transparency.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Digitize student council records for better accessibility",
        "Create a monthly student newsletter",
        "Improve communication about school events"
      ]
    },
    {
      id: "treasurer-2024",
      name: "David Wilson",
      position: "Treasurer",
      email: "david.wilson@student.edu",
      grade: 12,
      bio: "David has a strong background in mathematics and finance. He's dedicated to responsible fiscal management of student funds.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Increase funding for student clubs and organizations",
        "Implement transparent budget reporting",
        "Organize more effective fundraising events"
      ]
    },
    {
      id: "senior-rep1-2024",
      name: "Olivia Taylor",
      position: "Senior Class Representative",
      email: "olivia.taylor@student.edu",
      grade: 12,
      bio: "Olivia is committed to making senior year memorable for all students. She previously served as a junior class representative.",
      image: "/api/placeholder/200/200",
      committee: "Senior Events Committee",
      term: "2024-2025",
      goals: [
        "Organize an unforgettable prom and graduation",
        "Create senior-specific career and college preparation events",
        "Establish a senior legacy project"
      ]
    },
    {
      id: "senior-rep2-2024",
      name: "Noah Adams",
      position: "Senior Class Representative",
      email: "noah.adams@student.edu",
      grade: 12,
      bio: "Noah is focused on creating unity among seniors and ensuring everyone has a voice in important decisions.",
      image: "/api/placeholder/200/200",
      committee: "Academic Affairs Committee",
      term: "2024-2025",
      goals: [
        "Create study resources for seniors applying to college",
        "Organize senior class bonding events",
        "Advocate for senior privileges"
      ]
    },
    {
      id: "junior-rep1-2024",
      name: "Emma Martinez",
      position: "Junior Class Representative",
      email: "emma.martinez@student.edu",
      grade: 11,
      bio: "Emma is committed to building community among juniors and preparing for leadership roles in senior year.",
      image: "/api/placeholder/200/200",
      committee: "School Spirit Committee",
      term: "2024-2025",
      goals: [
        "Organize junior class social events",
        "Increase junior participation in school activities",
        "Begin planning for senior year events"
      ]
    }
  ],
  "2025-2026": [
    {
      id: "pres-2025",
      name: "Michael Chen",
      position: "Student Body President",
      email: "michael.chen@student.edu",
      phone: "310-555-2345",
      grade: 12,
      bio: "After serving as Vice President, Michael is now leading the student body with a focus on community engagement and student wellness.",
      image: "/api/placeholder/200/200",
      term: "2025-2026",
      goals: [
        "Expand the student mentorship program",
        "Create new wellness initiatives for student mental health",
        "Foster stronger ties with community organizations"
      ]
    },
    {
      id: "vp-2025",
      name: "Sophia Rodriguez",
      position: "Student Body Vice President",
      email: "sophia.rodriguez@student.edu",
      grade: 12,
      bio: "Moving up from her role as Secretary, Sophia aims to support the President while focusing on improving school communication.",
      image: "/api/placeholder/200/200",
      term: "2025-2026",
      goals: [
        "Launch a student council mobile app for better communication",
        "Coordinate with club leaders to increase student involvement",
        "Represent student concerns to the administration"
      ]
    },
    {
      id: "secretary-2025",
      name: "Emma Martinez",
      position: "Secretary",
      email: "emma.martinez@student.edu",
      grade: 12,
      bio: "After serving as a Junior Class Representative, Emma brings her organizational skills to the role of Secretary.",
      image: "/api/placeholder/200/200",
      term: "2025-2026",
      goals: [
        "Continue digitization of student council records",
        "Create a comprehensive student council website",
        "Improve meeting minutes and communication"
      ]
    }
  ]
};

// Available terms for the select dropdown
const availableTerms = ["2025-2026", "2024-2025"];

export default function Representatives() {
  const [, setLocation] = useLocation();
  const [selectedTerm, setSelectedTerm] = useState(availableTerms[0]);
  const [activeTab, setActiveTab] = useState("all");

  const representatives = representativesData[selectedTerm] || [];
  
  // Filter representatives based on active tab
  const filteredRepresentatives = representatives.filter(rep => {
    if (activeTab === "all") return true;
    if (activeTab === "officers" && ["Student Body President", "Student Body Vice President", "Secretary", "Treasurer"].includes(rep.position)) return true;
    if (activeTab === "senior" && rep.position.includes("Senior")) return true;
    if (activeTab === "junior" && rep.position.includes("Junior")) return true;
    if (activeTab === "sophomore" && rep.position.includes("Sophomore")) return true;
    if (activeTab === "freshman" && rep.position.includes("Freshman")) return true;
    return false;
  });

  const handleBackClick = () => {
    setLocation("/information");
  };

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
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">          {/* Navigation */}
          <Button
            onClick={handleBackClick}
            variant="ghost"
            className="mb-6 flex items-center text-white hover:text-blue-200 transition-colors"
          >
            <div className="bg-black/70 backdrop-blur-xl border border-gray-500/50 shadow-xl rounded-full p-2 mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Back to Information
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Student Representatives</h1>
            <p className="text-xl text-blue-100">Meet the students who represent our school</p>
          </div>          {/* Term Selection and Filtering */}
          <div className="bg-black/85 backdrop-blur-xl border border-gray-500/50 shadow-2xl rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto">
                <h2 className="text-lg font-semibold mb-2 text-white">Select Term</h2>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-xl border-white/10 w-[200px]">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTerms.map(term => (
                      <SelectItem key={term} value={term}>
                        {term} School Year
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="officers">Officers</TabsTrigger>
                  <TabsTrigger value="senior">Senior</TabsTrigger>
                  <TabsTrigger value="junior">Junior</TabsTrigger>
                  <TabsTrigger value="sophomore">Sophomore</TabsTrigger>
                  <TabsTrigger value="freshman">Freshman</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Representatives Grid */}
          {filteredRepresentatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepresentatives.map(rep => (                <Card key={rep.id} className="bg-black/80 backdrop-blur-xl border border-gray-500/50 shadow-xl hover:shadow-2xl transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant={rep.position.includes("President") ? "default" : rep.position.includes("Vice") ? "secondary" : "outline"}
                        className={rep.position.includes("President") ? "bg-amber-500" : ""}
                      >
                        {rep.position}
                      </Badge>
                      <div className="text-sm text-gray-400">Grade {rep.grade}</div>
                    </div>
                    <div className="flex items-center mt-4">
                      <Avatar className="h-16 w-16 border-2 border-blue-100">
                        <AvatarImage src={rep.image} alt={rep.name} />
                        <AvatarFallback>{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <CardTitle className="text-lg">{rep.name}</CardTitle>
                        <CardDescription>{rep.email}</CardDescription>
                        {rep.phone && <CardDescription>{rep.phone}</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm text-gray-500 uppercase mb-1">About</h3>
                        <p className="text-sm">{rep.bio}</p>
                      </div>
                      
                      {rep.committee && (
                        <div>
                          <h3 className="text-sm text-gray-500 uppercase mb-1">Committee</h3>
                          <p className="text-sm font-medium">{rep.committee}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm text-gray-500 uppercase mb-1">Goals</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {rep.goals.map((goal, idx) => (
                            <li key={idx}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>          ) : (
            <div className="bg-black/85 backdrop-blur-xl border border-gray-500/50 shadow-2xl rounded-xl p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-white">No representatives found</h3>
              <p className="mt-1 text-gray-300">There are no representatives matching your current filter.</p>
            </div>
          )}
            {/* Elections Information */}
          <div className="mt-12 bg-blue-900/90 backdrop-blur-xl border border-blue-500/50 shadow-2xl rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Interested in Becoming a Representative?</h2>
            <p className="mb-4">
              Elections for the next term's student representatives will be held in April. Visit the Elections page to learn how you can run for a position and make a difference in our school.
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-blue-800"
              onClick={() => setLocation("/information/elections")}
            >
              Learn About Elections
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
