import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Types for athletic programs
interface AthleticProgram {
  id: string;
  name: string;
  season: string;
  description: string;
  coach: string;
  practiceSchedule: string;
  location: string;
  requirements: string[];
  achievements?: string[];
}

// Mock data for athletic programs
const athleticPrograms: AthleticProgram[] = [
  {
    id: "football",
    name: "Football",
    season: "Fall",
    description: "Varsity football team competing in the regional league.",
    coach: "Coach Johnson",
    practiceSchedule: "Monday-Friday 3:30-5:30 PM",
    location: "Main Football Field",
    requirements: [
      "Physical examination required",
      "Minimum 2.0 GPA",
      "Attendance at tryouts",
      "Parent consent form"
    ],
    achievements: [
      "Regional Champions 2024",
      "League Champions 2023",
      "State Semifinalists 2023"
    ]
  },
  {
    id: "basketball",
    name: "Basketball",
    season: "Winter",
    description: "Boys and Girls varsity basketball teams.",
    coach: "Coach Martinez",
    practiceSchedule: "Monday-Friday 3:00-5:00 PM",
    location: "Main Gymnasium",
    requirements: [
      "Physical examination required",
      "Minimum 2.0 GPA",
      "Attendance at tryouts",
      "Previous basketball experience preferred"
    ],
    achievements: [
      "District Champions 2024",
      "Regional Tournament 2024"
    ]
  },
  {
    id: "soccer",
    name: "Soccer",
    season: "Spring",
    description: "Competitive soccer program for boys and girls.",
    coach: "Coach Rodriguez",
    practiceSchedule: "Monday-Friday 3:30-5:30 PM",
    location: "Soccer Fields",
    requirements: [
      "Physical examination required",
      "Minimum 2.0 GPA",
      "Soccer cleats required",
      "Team physical fitness test"
    ],
    achievements: [
      "League Champions 2024",
      "State Tournament Qualifiers 2024"
    ]
  },
  {
    id: "track",
    name: "Track & Field",
    season: "Spring",
    description: "Track and field events including running, jumping, and throwing.",
    coach: "Coach Thompson",
    practiceSchedule: "Monday-Friday 3:00-5:00 PM",
    location: "Track & Field Complex",
    requirements: [
      "Physical examination required",
      "Minimum 2.0 GPA",
      "Running shoes required",
      "Commitment to training schedule"
    ],
    achievements: [
      "Individual State Champions 2024",
      "Regional Team Champions 2024"
    ]
  },
  {
    id: "volleyball",
    name: "Volleyball",
    season: "Fall",
    description: "Girls varsity volleyball team.",
    coach: "Coach Davis",
    practiceSchedule: "Monday-Friday 3:00-5:00 PM",
    location: "Gymnasium B",
    requirements: [
      "Physical examination required",
      "Minimum 2.0 GPA",
      "Volleyball shoes required",
      "Height advantage preferred"
    ],
    achievements: [
      "District Champions 2024",
      "Regional Tournament 2024"
    ]
  },
  {
    id: "tennis",
    name: "Tennis",
    season: "Spring",
    description: "Boys and Girls tennis teams.",
    coach: "Coach Wilson",
    practiceSchedule: "Monday-Friday 3:30-5:30 PM",
    location: "Tennis Courts",
    requirements: [
      "Physical examination required",
      "Minimum 2.0 GPA",
      "Tennis racket required",
      "Basic tennis skills preferred"
    ]
  }
];

// Athletic resources
const athleticResources = [
  {
    title: "Athletic Calendar",
    description: "Schedules for all sports seasons and events",
    link: "#athletic-calendar"
  },
  {
    title: "Tryout Information",
    description: "Dates, requirements, and preparation for sports tryouts",
    link: "#tryouts"
  },
  {
    title: "Physical Forms",
    description: "Required medical forms for athletic participation",
    link: "#physical-forms"
  },
  {
    title: "Transportation",
    description: "Information about transportation to away games",
    link: "#transportation"
  }
];

export default function Athletics() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("All");

  const handleBackClick = () => {
    setLocation("/information");
  };

  // Filter programs by season
  const filteredPrograms = activeTab === "All" 
    ? athleticPrograms 
    : athleticPrograms.filter(program => program.season === activeTab);

  const seasons = ["All", "Fall", "Winter", "Spring"];

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
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Athletics</h1>
          </div>

          {/* Athletics Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">School Athletic Programs</h2>
                <p className="mb-4">Join one of our competitive athletic teams and represent our school with pride.</p>
                <div className="flex space-x-2">
                  <PrimaryButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    Tryout Information
                  </PrimaryButton>
                  <OutlineButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    Athletic Calendar
                  </OutlineButton>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Season Filter Tabs */}
          <Tabs defaultValue="All" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="All" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="Fall" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Fall</TabsTrigger>
              <TabsTrigger value="Winter" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Winter</TabsTrigger>
              <TabsTrigger value="Spring" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Spring</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Athletic Programs Grid */}
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
                      {program.season}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Coach: <span className="text-white">{program.coach}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Practice: <span className="text-white">{program.practiceSchedule}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Location: <span className="text-white">{program.location}</span></p>
                    </div>
                  </div>

                  {program.achievements && (
                    <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <p className="text-sm font-medium text-blue-200 mb-2">Recent Achievements:</p>
                      <ul className="text-sm text-blue-100 space-y-1">
                        {program.achievements.map((achievement, index) => (
                          <li key={index}>• {achievement}</li>
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
                      Join Team
                    </OutlineButton>
                    <OutlineButton className="text-white hover:text-gray-300" size="sm">
                      Learn More
                    </OutlineButton>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>

          {/* Athletic Resources */}
          <h2 className="text-2xl font-bold text-white mb-6">Athletic Resources</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {athleticResources.map((resource, index) => (
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

          {/* Athletic FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Athletic FAQ</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">When do tryouts typically occur?</h3>
                <p className="text-gray-300">Tryouts usually occur 2-3 weeks before each season begins. Fall sports tryouts are in August, winter sports in October, and spring sports in February.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">What do I need to participate in athletics?</h3>
                <p className="text-gray-300">You need a current physical examination, signed parent consent forms, proof of insurance, and must maintain a minimum 2.0 GPA throughout the season.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">Can I play multiple sports?</h3>
                <p className="text-gray-300">Yes! We encourage multi-sport athletes. However, you cannot participate in two sports during the same season due to scheduling conflicts.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">How are teams selected?</h3>
                <p className="text-gray-300">Teams are selected based on skill level, attitude, commitment, and coachability demonstrated during tryouts and practice sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
