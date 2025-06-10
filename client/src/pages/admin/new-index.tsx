import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Package, Calendar, Info, Video } from 'lucide-react';

// Types
interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  organization: string;
  sizes: string[];
  colors: string[];
  image: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price?: number;
  maxTickets?: number;
}

interface VideoPost {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  date: string;
  author: string;
  category: string;
  views: number;
  featured: boolean;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

interface StudentGovPosition {
  id: string;
  position: string;
  name: string;
  grade: string;
  image: string;
  bio: string;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "ESHS Spirit T-Shirt",
    price: 20,
    category: "Apparel",
    organization: "ASB",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Gold"],
    image: "/api/placeholder/400/400",
    description: "Show your El Segundo High School spirit!"
  }
];

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Homecoming Dance",
    category: "Dance",
    date: "2024-10-25",
    time: "7:00 PM - 11:00 PM",
    location: "School Gymnasium",
    description: "Annual homecoming dance with DJ and refreshments",
    price: 15,
    maxTickets: 300
  }
];

const mockVideoPosts: VideoPost[] = [
  {
    id: "1",
    title: "Homecoming Week Highlights",
    description: "Check out the best moments from Homecoming Week 2024!",
    videoUrl: "https://www.youtube.com/watch?v=example",
    thumbnailUrl: "/api/placeholder/400/225",
    date: "2024-10-20",
    author: "ASB Media Team",
    category: "Events",
    views: 1250,
    featured: true
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Fall Assembly Schedule",
    date: "2024-10-15",
    content: "The fall assembly will be held on Friday during 4th period.",
    priority: "high"
  }
];

const mockStudentGov: StudentGovPosition[] = [
  {
    id: "1",
    position: "ASB President",
    name: "Sarah Johnson",
    grade: "12th",
    image: "/api/placeholder/300/300",
    bio: "Leading ESHS with passion and dedication."
  }
];

export default function Admin() {
  // State for managing data
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [videos, setVideos] = useState<VideoPost[]>(mockVideoPosts);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [studentGov, setStudentGov] = useState<StudentGovPosition[]>(mockStudentGov);

  // State for modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ESHS ASB Admin Dashboard</h1>
          <p className="text-gray-400">Manage merchandise, activities, information, and birds eye view content</p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Products</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Events</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Videos</CardTitle>
              <Video className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{videos.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Announcements</CardTitle>
              <Info className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{announcements.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="merchandise" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">            <TabsTrigger value="merchandise" className="text-white">Merchandise</TabsTrigger>
            <TabsTrigger value="activities" className="text-white">Activities</TabsTrigger>
            <TabsTrigger value="information" className="text-white">Information</TabsTrigger>
            <TabsTrigger value="birds-eye-view" className="text-white">Birds Eye View</TabsTrigger>
          </TabsList>

          {/* Merchandise Tab */}
          <TabsContent value="merchandise" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Merchandise Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <CardTitle className="text-white">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-green-400">${product.price}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.organization}</Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{product.description}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Activities & Events</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      <p><strong>Date:</strong> {event.date}</p>
                      <p><strong>Time:</strong> {event.time}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <p className="text-gray-400">{event.description}</p>
                      {event.price && <p className="text-green-400 font-semibold">${event.price}</p>}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Information Tab */}
          <TabsContent value="information" className="space-y-6">
            <h2 className="text-2xl font-bold">Information Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Announcements */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Announcements</h3>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Announcement
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{announcement.title}</h4>
                          <Badge 
                            variant={announcement.priority === 'high' ? 'destructive' : 
                                   announcement.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{announcement.date}</p>
                        <p className="text-gray-300">{announcement.content}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Student Government */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Student Government</h3>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Position
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {studentGov.map((member) => (
                    <Card key={member.id} className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{member.name}</h4>
                            <p className="text-blue-400">{member.position}</p>
                            <p className="text-sm text-gray-400">Grade {member.grade}</p>
                            <p className="text-sm text-gray-300 mt-1">{member.bio}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Birds Eye View Tab */}
          <TabsContent value="birds-eye-view" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Birds Eye View Videos</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <CardTitle className="text-white">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-gray-400">{video.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{video.category}</Badge>
                        {video.featured && <Badge variant="default">Featured</Badge>}
                      </div>
                      <p className="text-sm text-gray-400">By {video.author}</p>
                      <p className="text-sm text-gray-400">{video.views} views • {video.date}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
