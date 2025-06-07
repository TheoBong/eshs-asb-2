import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, SecondaryButton, OutlineButton, ThemedTabs } from "@/components/ThemedComponents";
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
      bio: "Michael brings experience from the debate team and Model UN to help coordinate school events and represent student interests.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Organize more inter-grade activities",
        "Implement a student feedback system",
        "Support environmental initiatives on campus"
      ]
    },
    {
      id: "sec-2024",
      name: "Sarah Williams",
      position: "Secretary",
      email: "sarah.williams@student.edu",
      grade: 11,
      bio: "Sarah is dedicated to keeping accurate records and improving communication between the student body and council.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Digitize all student council records",
        "Create a monthly newsletter for students",
        "Establish regular town halls with students"
      ]
    },
    {
      id: "treas-2024",
      name: "David Kim",
      position: "Treasurer",
      email: "david.kim@student.edu",
      grade: 12,
      bio: "David manages the student council budget and helps fund various school programs and activities.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Increase funding for student clubs",
        "Implement transparent budget reporting",
        "Support fundraising for school improvements"
      ]
    },
    {
      id: "senior-rep-2024",
      name: "Jessica Martinez",
      position: "Senior Class Representative",
      email: "jessica.martinez@student.edu",
      grade: 12,
      bio: "Jessica represents the senior class and works to make the final year memorable for all students.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Plan memorable senior events",
        "Coordinate graduation preparations",
        "Leave a positive legacy for future classes"
      ]
    },
    {
      id: "junior-rep-2024",
      name: "Alex Thompson",
      position: "Junior Class Representative",
      email: "alex.thompson@student.edu",
      grade: 11,
      bio: "Alex advocates for junior class interests and helps prepare students for their senior year.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Improve college preparation resources",
        "Organize junior class fundraisers",
        "Support academic excellence initiatives"
      ]
    },
    {
      id: "soph-rep-2024",
      name: "Maya Patel",
      position: "Sophomore Class Representative",
      email: "maya.patel@student.edu",
      grade: 10,
      bio: "Maya works to ensure sophomore voices are heard and helps new students adjust to high school life.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Create mentorship programs for freshmen",
        "Organize sophomore social events",
        "Improve study resources for underclassmen"
      ]
    },
    {
      id: "fresh-rep-2024",
      name: "Tyler Brown",
      position: "Freshman Class Representative",
      email: "tyler.brown@student.edu",
      grade: 9,
      bio: "Tyler represents the freshman class and helps new students get involved in school activities.",
      image: "/api/placeholder/200/200",
      term: "2024-2025",
      goals: [
        "Help freshmen adjust to high school",
        "Increase freshman participation in clubs",
        "Create a welcoming environment for new students"
      ]
    }
  ],
  "2025-2026": [
    {
      id: "pres-2025",
      name: "Jordan Alexander",
      position: "Student Body President",
      email: "jordan.alexander@student.edu",
      grade: 12,
      bio: "Jordan is a returning council member who previously served as Vice President and is committed to student advocacy.",
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
  });  const handleBackClick = () => {
    // Push state with internal navigation marker
    window.history.pushState({ internal: true }, '', '/information');
    setLocation("/information");
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
        <div className="container mx-auto px-4">          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Student Representatives</h1>
          </div>{/* Term selector */}
          <div className="mb-6">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-48 bg-white/5 backdrop-blur-xl border border-white/10 text-white">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {availableTerms.map(term => (
                  <SelectItem key={term} value={term} className="text-white hover:bg-gray-800">
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>          {/* Tabs for filtering representatives */}
          <ThemedTabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="officers" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Officers</TabsTrigger>
              <TabsTrigger value="senior" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Seniors</TabsTrigger>
              <TabsTrigger value="junior" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Juniors</TabsTrigger>
              <TabsTrigger value="sophomore" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sophomores</TabsTrigger>
              <TabsTrigger value="freshman" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Freshmen</TabsTrigger>
            </TabsList>
          </ThemedTabs>{/* Representatives grid */}
          {filteredRepresentatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredRepresentatives.map((rep) => (
                <div key={rep.id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        Grade {rep.grade}
                      </Badge>
                      <Badge variant="outline" className="border-gray-400 text-gray-300">
                        {rep.term}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-4">
                      <Avatar className="h-16 w-16 border-2 border-blue-200">
                        <AvatarImage src={rep.image} alt={rep.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-800">{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <CardTitle className="text-lg text-white">{rep.name}</CardTitle>
                        <CardDescription className="font-medium text-blue-300">{rep.position}</CardDescription>
                        <CardDescription className="text-sm text-gray-300">{rep.email}</CardDescription>
                        {rep.phone && <CardDescription className="text-sm text-gray-300">{rep.phone}</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 uppercase mb-1">About</h3>
                        <p className="text-sm text-gray-200">{rep.bio}</p>
                      </div>
                      
                      {rep.committee && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 uppercase mb-1">Committee</h3>
                          <p className="text-sm font-medium text-white">{rep.committee}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 uppercase mb-1">Goals</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-200">
                          {rep.goals.map((goal, idx) => (
                            <li key={idx}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-white">No representatives found</h3>
              <p className="mt-1 text-gray-300">There are no representatives matching your current filter.</p>
            </div>
          )}

          {/* Elections Information */}
          <div className="bg-blue-900/90 backdrop-blur-xl border border-blue-500/50 shadow-2xl rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Interested in Becoming a Representative?</h2>
            <p className="text-blue-100 mb-4">
              Elections for the next term's student representatives will be held in April. Visit the Elections page to learn how you can run for a position and make a difference in our school.
            </p>
            <OutlineButton 
              className="bg-transparent border-white text-white hover:bg-blue-800 transition-colors"
              onClick={() => setLocation("/information/elections")}
            >
              Learn About Elections
            </OutlineButton>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
