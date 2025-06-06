import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemedPageWrapper, TheaterButton, TheaterCard } from "@/components/ThemedComponents";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Video/Blog Post Type
interface VideoPost {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  date: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  category: string;
  views: number;
  featured?: boolean;
}

// Mock data for video blog posts
const videoPosts: VideoPost[] = [
  {
    id: "homecoming-recap-2025",
    title: "Homecoming Week Highlights 2025",
    description: "Catch all the excitement from this year's homecoming festivities! From the rally to the game to the dance, see what made this year special.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "October 18, 2025",
    author: {
      name: "ASB Media Team",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Events",
    views: 1247,
    featured: true
  },
  {
    id: "digital-art-showcase",
    title: "Digital Art Showcase: Spring Exhibition",
    description: "Students from the Digital Arts program showcase their incredible work from the spring semester.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "May 15, 2025",
    author: {
      name: "Arts Department",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Arts",
    views: 856,
    featured: true
  },
  {
    id: "eagles-championship",
    title: "Eagles Basketball Championship Victory",
    description: "Relive the excitement as our Eagles basketball team wins the regional championship!",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "March 25, 2025",
    author: {
      name: "Sports Media Club",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Sports",
    views: 1532,
    featured: true
  },
  {
    id: "science-fair-2025",
    title: "Science Fair 2025: Innovation on Display",
    description: "Take a tour of the incredible projects at this year's science fair, featuring interviews with our young scientists.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "April 12, 2025",
    author: {
      name: "Science Department",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Academics",
    views: 745
  },
  {
    id: "earth-day-cleanup",
    title: "Earth Day Beach Cleanup Initiative",
    description: "Students join forces with local environmental groups for our annual Earth Day beach cleanup event.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "April 22, 2025",
    author: {
      name: "Environmental Club",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Community",
    views: 632
  },
  {
    id: "theater-behind-scenes",
    title: "Behind the Scenes: Spring Musical Preparation",
    description: "Get an exclusive look at the preparation for this year's spring musical, featuring interviews with the cast and crew.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "March 5, 2025",
    author: {
      name: "Drama Club",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Arts",
    views: 923
  },
  {
    id: "college-application-tips",
    title: "College Application Tips from Recent Grads",
    description: "Recent graduates share their advice on navigating the college application process successfully.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "February 18, 2025",
    author: {
      name: "College Counseling",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Academics",
    views: 1126
  },
  {
    id: "student-council-debate",
    title: "Student Council Debate: Election 2025",
    description: "Watch the full debate between candidates for next year's student council positions.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/640/360",
    date: "April 5, 2025",
    author: {
      name: "ASB Media Team",
      avatarUrl: "/api/placeholder/40/40"
    },
    category: "Student Government",
    views: 876
  }
];

// Get the featured video (most recent)
const featuredVideo = videoPosts.find(post => post.featured) || videoPosts[0];

export default function BirdsEyeView() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<VideoPost>(featuredVideo);
  
  // Filter videos based on active tab
  const filteredVideos = videoPosts.filter(video => {
    if (activeTab === "all") return true;
    return video.category.toLowerCase() === activeTab.toLowerCase();
  });
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(videoPosts.map(video => video.category.toLowerCase())))];
  
  const handleBackClick = () => {
    setLocation("/");
  };
  
  const handleVideoSelect = (video: VideoPost) => {
    setSelectedVideo(video);
    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <ThemedPageWrapper pageType="theater">
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
      <div className="fixed inset-0 bg-black bg-opacity-70 -z-10"></div>      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {/* Transparent back button with title */}
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
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
              Theater & Productions
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Player Column */}
            <div className="lg:col-span-2">              {/* Featured Video */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden mb-6">
                <div className="aspect-video w-full">
                  <iframe 
                    src={selectedVideo.videoUrl} 
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-amber-600 text-white hover:bg-amber-700">{selectedVideo.category}</Badge>
                    <div className="text-sm text-gray-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {selectedVideo.views.toLocaleString()} views
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-300 mb-4">{selectedVideo.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={selectedVideo.author.avatarUrl} />
                        <AvatarFallback>{selectedVideo.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-gray-300">{selectedVideo.author.name}</div>
                    </div>
                    <div className="text-sm text-gray-400">{selectedVideo.date}</div>
                  </div>
                </div>
              </div>{/* Video Description and Theater Info */}              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-6">
                <CardHeader>
                  <CardTitle>About This Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    {selectedVideo.description} This video showcases our talented drama department's productions and performances.
                  </p>
                  <p className="mb-4">
                    The El Segundo High School Theater Department produces multiple shows each year, including a fall play, spring musical, and various showcases.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button className="btn-primary">
                      <i className="fas fa-ticket-alt mr-2"></i> Buy Tickets
                    </Button>
                    <Button variant="outline" className="btn-outline">
                      <i className="fas fa-calendar-alt mr-2"></i> View Event Schedule
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-800/80 backdrop-blur-md border-t border-gray-500/50 pt-4 flex justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="btn-outline">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="btn-outline">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-accent">Report</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Video List Column */}
            <div className="lg:col-span-1">              {/* Category Filter */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl w-full grid grid-cols-3 h-auto">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category} 
                      className="text-xs md:text-sm capitalize py-2 data-[state=active]:bg-amber-700 data-[state=active]:text-white"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Video List */}
              <div className="space-y-4">
                {filteredVideos.map(video => (                  <Card
                    key={video.id}
                    className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all cursor-pointer ${
                      selectedVideo.id === video.id ? "border-amber-600" : "border-transparent"
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <CardContent className="p-0 flex flex-row">
                      {/* Thumbnail */}
                      <div className="w-1/3 h-24 bg-gray-900">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/640x360?text=Video+Thumbnail";
                          }}
                        />
                      </div>
                      
                      {/* Video Info */}
                      <div className="w-2/3 p-3">
                        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        <div className="flex flex-col text-xs text-gray-400">
                          <span>{video.author.name}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span>{video.views.toLocaleString()} views</span>
                            <span>•</span>
                            <span>{video.date}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>                {/* Season Tickets Card */}
              <Card className="bg-gradient-to-r from-amber-900 to-orange-800 text-white mt-6">
                <CardHeader>
                  <CardTitle>Season Tickets</CardTitle>
                  <CardDescription className="text-amber-100">
                    Get access to all of our productions for the 2025-2026 season
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold mb-2">$65.00</div>
                  <p className="text-sm mb-4">Includes tickets to our Fall Play, Winter Showcase, and Spring Musical - a $20 savings!</p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li className="flex items-center">
                      <i className="fas fa-check-circle mr-2 text-amber-300"></i>
                      Reserved premium seating
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle mr-2 text-amber-300"></i>
                      Early access to ticket selection
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle mr-2 text-amber-300"></i>
                      Exclusive behind-the-scenes content
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full theater-action">
                    <i className="fas fa-ticket-alt mr-2"></i>
                    Buy Season Pass
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>            {/* Theater Information Section */}
          <div className="mt-12 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6">Theater Department Information</h2>            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">              {/* Upcoming Productions */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-theater-masks text-amber-500 text-xl mr-2"></i>
                    <CardTitle>Upcoming Productions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Fall Play 2025: "A Midsummer Night's Dream"</h4>
                    <p className="text-sm text-gray-300">October 22-24, 2025</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Winter Showcase</h4>
                    <p className="text-sm text-gray-300">December 12, 2025</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Spring Musical 2026: "Hairspray"</h4>
                    <p className="text-sm text-gray-300">April 15-18, 2026</p>
                  </div>
                  <Button variant="outline" className="btn-outline w-full mt-2">View All Shows</Button>
                </CardContent>
              </Card>              {/* Audition Info */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-microphone text-amber-500 text-xl mr-2"></i>
                    <CardTitle>Auditions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Interested in auditioning for our next production? Check our schedule for upcoming audition dates.</p>
                  <p className="text-sm text-gray-300 mb-4">Next auditions: August 28-29, 2025 for the Fall Play</p>
                  <Button variant="outline" className="btn-outline w-full">Audition Information</Button>
                </CardContent>
              </Card>              {/* Tech Crew */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-sliders-h text-amber-500 text-xl mr-2"></i>
                    <CardTitle>Tech Crew</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Not interested in being on stage? Join our technical crew and learn about lighting, sound, set design, and more!</p>
                  <p className="text-sm text-gray-300 mb-4">No experience necessary - we'll train you!</p>
                  <Button variant="outline" className="btn-outline w-full">Join Tech Crew</Button>
                </CardContent>
              </Card>              {/* Contact */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-envelope text-amber-500 text-xl mr-2"></i>
                    <CardTitle>Contact Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Have questions about our theater program or upcoming productions?</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="font-medium">Director:</span> Ms. Amanda Patel</p>
                    <p><span className="font-medium">Email:</span> theater@elsegundohs.org</p>
                    <p><span className="font-medium">Phone:</span> (310) 555-0123</p>
                    <p><span className="font-medium">Office:</span> Room 214</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
            {/* Get Involved Banner */}
          <div className="mt-12 theater-accent rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Want to Get Involved?</h2>
                <p className="mb-4">Join the Drama Club! We're always looking for actors, tech crew, directors, and more!</p>
                <Button className="bg-amber-700 text-white hover:bg-amber-600">
                  <i className="fas fa-user-plus mr-2"></i> Join Drama Club
                </Button>
              </div>
              <div className="mt-6 md:mt-0 h-24 w-24 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full flex items-center justify-center">
                <i className="fas fa-theater-masks text-white text-4xl"></i>
              </div>
            </div>          </div>
        </main>
      </div>
    </ThemedPageWrapper>
  );
}
