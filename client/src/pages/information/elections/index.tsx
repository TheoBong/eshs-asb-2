import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton } from "@/components/ThemedComponents";
import { StudentGovPosition, getStudentGovPositions } from "@/lib/api";
import { UniversalPageLayout } from "@/components/UniversalPageLayout";
import { BlurContainer, BlurCard, BlurActionButton } from "@/components/UniversalBlurComponents";

// Government resources
const governmentResources = [
  {
    title: "Petition To Run",
    description: "Information about running for student government positions",
    link: "#petition-to-run"
  },
  {
    title: "Teacher Recommendation Forms",
    description: "Required forms for student government candidacy",
    link: "#recommendation-forms"
  },
  {
    title: "ASB Handbook",
    description: "Student government handbook and guidelines",
    link: "#asb-handbook"
  },
  {
    title: "Meeting Minutes",
    description: "Access to student council meeting minutes and records",
    link: "#meeting-minutes"
  }
];

export default function Elections() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("All");
  const [positions, setPositions] = useState<StudentGovPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const data = await getStudentGovPositions();
        setPositions(data);
      } catch (err) {
        setError('Failed to load student government positions');
        console.error('Error fetching student government positions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const handleBackClick = () => {
    // Check if user came from internal navigation
    const referrer = sessionStorage.getItem('info-referrer');
    if (referrer || document.referrer.includes('/information')) {
      // Use browser history to go back
      window.history.back();
    } else {
      // Fallback to information page
      setLocation("/information");
    }
  };

  // Filter positions by grade level
  const filteredPositions = activeTab === "All" 
    ? positions 
    : positions.filter(position => position.gradeLevel === activeTab.toLowerCase());
  // Get unique grade levels from the data
  const gradeLevels = ["All", ...Array.from(new Set(positions.map(position => 
    position.gradeLevel.charAt(0).toUpperCase() + position.gradeLevel.slice(1)
  )))];

  if (loading) {
    return (
      <UniversalPageLayout pageType="information" title="Student Government">
        {({ contentVisible }) => (
          <BlurContainer contentVisible={contentVisible} className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-white text-xl">Loading student government positions...</div>
          </BlurContainer>
        )}
      </UniversalPageLayout>
    );
  }

  if (error) {
    return (
      <UniversalPageLayout pageType="information" title="Student Government">
        {({ contentVisible }) => (
          <BlurContainer contentVisible={contentVisible} className="text-center py-12">
            <div className="text-white text-xl mb-4">{error}</div>
            <BlurActionButton
              contentVisible={contentVisible}
              onClick={handleBackClick}
            >
              Back to Information
            </BlurActionButton>
          </BlurContainer>
        )}
      </UniversalPageLayout>
    );
  }

  return (
    <UniversalPageLayout 
      pageType="information" 
      title="Student Government"
      backButtonText="Back"
    >
      {({ contentVisible }) => (
        <>
          {/* Student Government Banner */}
          <BlurContainer contentVisible={contentVisible} delay="200ms" className="p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Student Government Representatives</h2>
                <p className="mb-4">Meet your student government representatives and learn about their roles in representing your voice at school.</p>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </BlurContainer>
          
          {/* Grade Level Filter Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="All" className="" onValueChange={setActiveTab}>
              <TabsList 
                className="bg-white/5 border border-white/10 shadow-lg grid w-full max-w-4xl mx-auto" 
                style={{
                  gridTemplateColumns: `repeat(${gradeLevels.length}, minmax(0, 1fr))`
                }}
              >
                {gradeLevels.map((level) => (
                  <TabsTrigger 
                    key={level}
                    value={level} 
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                  >
                    {level}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Positions Grid */}
          <div className="mb-8">
            {filteredPositions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPositions.map((position, index) => (
                  <BlurCard
                    key={position._id}
                    contentVisible={contentVisible}
                    index={index}
                    delay={`${500 + (index * 50)}ms`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{position.position}</h3>
                          <p className="text-gray-300 mb-3">{position.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2 capitalize">
                          {position.gradeLevel}
                        </Badge>
                      </div>
                      
                      {position.currentRepresentatives && position.currentRepresentatives.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-200 mb-3">Current Representative(s):</h4>
                          {position.currentRepresentatives.map((rep, index) => (
                            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 mb-3">
                              <div className="flex items-start space-x-4">
                                {rep.image && (
                                  <img 
                                    src={rep.image} 
                                    alt={rep.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-white font-semibold text-lg">{rep.name}</p>
                                  {rep.email && (
                                    <p className="text-sm text-gray-300">{rep.email}</p>
                                  )}
                                  {rep.bio && (
                                    <p className="text-sm text-gray-200 mt-2">{rep.bio}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </BlurCard>
                ))}
              </div>
            ) : (
              <BlurContainer contentVisible={contentVisible} delay="400ms" className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">No positions found</h3>
                <p className="mt-1 text-sm text-gray-300">
                  There are currently no positions listed for this category.
                </p>
              </BlurContainer>
            )}
          </div>

          {/* Government Resources */}
          <h2 className="text-2xl font-bold text-white mb-6">Student Government Resources</h2>
          <BlurContainer contentVisible={contentVisible} delay="700ms" className="p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {governmentResources.map((resource, index) => (
                <BlurCard
                  key={index}
                  contentVisible={contentVisible}
                  index={index}
                  delay={`${800 + (index * 50)}ms`}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="mr-4 h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{resource.title}</h3>
                        <p className="text-sm text-gray-300">{resource.description}</p>
                      </div>
                    </div>
                    <a href={resource.link}>
                      <BlurActionButton
                        contentVisible={contentVisible}
                        onClick={() => {}}
                        className="p-3"
                      >
                        View
                      </BlurActionButton>
                    </a>
                  </div>
                </BlurCard>
              ))}
            </div>
          </BlurContainer>

          {/* Student Government FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Student Government FAQ</h2>
          <BlurContainer contentVisible={contentVisible} delay="1100ms" className="p-6">
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">How can I contact my class representative?</h3>
                <p className="text-gray-300">You can reach out to your class representatives via email or find them around campus.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2 text-white">When does student government meet?</h3>
                <p className="text-gray-300">Every school day during fourth period in Mrs. Richmond's room (B101).</p>
              </div>
            </div>
          </BlurContainer>
        </>
      )}
    </UniversalPageLayout>
  );
}