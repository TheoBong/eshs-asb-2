import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemedPageWrapper } from "@/components/ThemedComponents";
import { getVideos, type VideoPost } from "@/lib/api";

const BirdsEyeView = () => {
  const [, setLocation] = useLocation();
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load videos from API
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const data = await getVideos();
        setVideos(data);
        // Set featured video or first video as selected
        const featured = data.find(video => video.featured) || data[0];
        setSelectedVideo(featured || null);
        setError(null);
      } catch (err) {
        console.error('Failed to load videos:', err);
        setError('Failed to load videos. Please try again later.');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);
  
  const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true');
    setLocation("/");
  };
  
  const handleVideoSelect = (video: VideoPost) => {
    setSelectedVideo(video);
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper function to format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to get author initials for avatar
  const getAuthorInitials = (author: string) => {
    return author
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <ThemedPageWrapper pageType="information">
      {/* Light overlay for better text contrast without darkening UI */}
      <div className="fixed inset-0 bg-black bg-opacity-20 -z-10" style={{ pointerEvents: 'none' }}></div>

      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-4 py-8">          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Bird's Eye View</h1>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-white/5 backdrop-blur-xl border border-red-400/50 shadow-2xl rounded-xl">
              <div className="border-red-400/50 bg-red-500/20 p-4 rounded-lg">
                <div className="flex items-center text-red-400 text-sm mb-2">
                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Error Loading Content
                </div>
                <p className="text-red-100">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/90">Loading videos...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Video Player */}
                <div className="lg:col-span-2 space-y-4">                  {selectedVideo ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden">
                      <div className="aspect-video bg-black rounded-t-xl overflow-hidden">
                        {(() => {
                          // Convert YouTube watch URL to embed URL if needed
                          let embedUrl = selectedVideo.videoUrl;
                          if (embedUrl.includes('youtube.com/watch')) {
                            const videoId = embedUrl.split('v=')[1]?.split('&')[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          } else if (embedUrl.includes('youtu.be/')) {
                            const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          }
                          
                          return (
                            <iframe 
                              src={embedUrl}
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="w-full h-full"
                              title={selectedVideo.title}
                            />
                          );
                        })()}
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">
                              {selectedVideo.title}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs bg-blue-600 text-white">
                                    {getAuthorInitials(selectedVideo.author)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{selectedVideo.author}</span>
                              </div>
                              <span>•</span>
                              <span>{selectedVideo.views.toLocaleString()} views</span>
                              <span>•</span>
                              <span>{formatDate(selectedVideo.date)}</span>
                            </div>
                            {selectedVideo.featured && (
                              <div className="flex items-center space-x-2 mb-4">
                                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-200 leading-relaxed">
                          {selectedVideo.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden">
                      <div className="aspect-video bg-gray-800/50 rounded-t-xl flex items-center justify-center">
                        <p className="text-gray-300">Select a video to watch</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video List Sidebar */}
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">All Videos</h3>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {videos.map((video) => (
                      <Card 
                        key={video._id}
                        className={`cursor-pointer transition-all bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-blue-500/50 ${
                          selectedVideo?._id === video._id ? 'ring-2 ring-blue-500 bg-white/10' : ''
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <CardContent className="p-3">
                          <div className="flex space-x-3">
                            <div className="relative flex-shrink-0">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title}
                                className="w-16 h-12 object-cover rounded bg-gray-700"
                              />
                              {video.featured && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                                {video.title}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-gray-300">
                                <span>{video.views.toLocaleString()} views</span>
                                <span>{formatDate(video.date)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ThemedPageWrapper>
  );
};

export default BirdsEyeView;
