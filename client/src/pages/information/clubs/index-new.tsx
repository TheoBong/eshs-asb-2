import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";
import { Club, getClubs } from "@/lib/api";

// Club resources
const clubResources = [
  {
    title: "Club Registration",
    description: "How to join existing clubs or start a new club",
    link: "#club-registration"
  },
  {
    title: "Meeting Calendar",
    description: "Schedule of all club meetings and events",
    link: "#meeting-calendar"
  },
  {
    title: "Club Fair Information",
    description: "Annual club fair dates and participation details",
    link: "#club-fair"
  },
  {
    title: "Leadership Opportunities",
    description: "Information about club officer positions and elections",
    link: "#leadership"
  }
];

export default function Clubs() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("All");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const data = await getClubs();
        setClubs(data);
      } catch (err) {
        setError('Failed to load clubs');
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleBackClick = () => {
    setLocation("/information");
  };

  // Filter clubs by category
  const filteredClubs = activeTab === "All" 
    ? clubs 
    : clubs.filter(club => club.category === activeTab);
  // Get unique categories from the data
  const categories = ["All", ...Array.from(new Set(clubs.map(club => club.category)))];

  if (loading) {
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
        
        {/* Loading content */}
        <div className="relative z-10 min-h-screen py-12 flex items-center justify-center">
          <div className="text-white text-xl">Loading clubs...</div>
        </div>
      </ThemedPageWrapper>
    );
  }

  if (error) {
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
        
        {/* Error content */}
        <div className="relative z-10 min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">{error}</div>
            <OutlineButton
              onClick={handleBackClick}
              className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold"
            >
              Back to Information
            </OutlineButton>
          </div>
        </div>
      </ThemedPageWrapper>
    );
  }

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
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Student Clubs</h1>
          </div>

          {/* Clubs Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Get Involved in School Clubs</h2>
                <p className="mb-4">Join one of our many clubs to pursue your interests and meet like-minded peers.</p>
                <div className="flex space-x-2">
                  <PrimaryButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    Join a Club
                  </PrimaryButton>
                  <OutlineButton className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold">
                    Start a Club
                  </OutlineButton>
                </div>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>          {/* Category Filter Tabs */}
          <Tabs defaultValue="All" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg grid w-full max-w-3xl mx-auto" 
                     style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category}
                  value={category} 
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredClubs.map((club) => (
              <ThemedCard key={club._id} className="hover:shadow-md transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{club.name}</h3>
                      <p className="text-gray-300 mb-3">{club.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {club.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Advisor: <span className="text-white">{club.advisor}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Meeting Time: <span className="text-white">{club.meetingTime}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Location: <span className="text-white">{club.location}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Members: <span className="text-white">{club.memberCount}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Contact: <span className="text-white">{club.contactEmail}</span></p>
                    </div>
                  </div>

                  {club.requirements && club.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-200 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {club.requirements.map((requirement, index) => (
                          <li key={index} className="text-gray-300 text-sm">{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {club.activities && club.activities.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <p className="text-sm font-medium text-blue-200 mb-2">Activities:</p>
                      <ul className="text-sm text-blue-100 space-y-1">
                        {club.activities.map((activity, index) => (
                          <li key={index}>• {activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <OutlineButton className="text-white hover:text-gray-300" size="sm">
                      Join Club
                    </OutlineButton>
                    <OutlineButton className="text-white hover:text-gray-300" size="sm">
                      Contact Advisor
                    </OutlineButton>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>

          {/* Club Resources */}
          <h2 className="text-2xl font-bold text-white mb-6">Club Resources</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clubResources.map((resource, index) => (
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

          {/* Club FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Club FAQ</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">How do I join a club?</h3>
                <p className="text-gray-300">Contact the club advisor or attend one of their meetings. Most clubs welcome new members throughout the year, though some may have specific enrollment periods.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">Can I start a new club?</h3>
                <p className="text-gray-300">To start a new club, you need at least 10 interested students, a faculty advisor, and approval from student activities. Submit a proposal with your club's purpose and planned activities.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">Are there leadership opportunities in clubs?</h3>
                <p className="text-gray-300">Yes! Most clubs elect officers annually, including president, vice president, secretary, and treasurer. These positions provide valuable leadership experience.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Do clubs have membership fees?</h3>
                <p className="text-gray-300">Some clubs may have small dues to cover activities and materials. Check with individual clubs about their fee structure and any available financial assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
