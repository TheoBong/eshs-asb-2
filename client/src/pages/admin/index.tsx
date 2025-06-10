import React, { useState } from 'react';
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Package, Calendar, Info, Video, FileText, Check, X, Eye, BarChart3, TrendingUp, DollarSign, Users, CheckCircle, Filter } from 'lucide-react';
import { ThemedCard, PrimaryButton, SecondaryButton, OutlineButton } from '@/components/ThemedComponents';
import schoolVideo from "../../../../attached_assets/school2.mp4";

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
  requiresApproval?: boolean;
  requiredForms?: {
    contractForm?: boolean;
    guestForm?: boolean;
    studentIdRequired?: boolean;
    customForms?: string[];
  };
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

interface StudentGovMember {
  name: string;
  contactEmail: string;
}

interface StudentGovPosition {
  id: string;
  position: string;
  gradeLevel: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'officer' | 'committee';
  bio: string;
  responsibilities: string[];
  description: string;
  currentRepresentatives: StudentGovMember[];
}

interface Club {
  id: string;
  name: string;
  description: string;
  advisor: string;
  meetingTime: string;
  location: string;
  category: string;
  contactEmail: string;
  image: string;
  memberCount: number;
  isActive: boolean;
}

interface Athletic {
  id: string;
  sport: string;
  season: 'fall' | 'winter' | 'spring' | 'year-round';
  coach: string;
  assistantCoach?: string;
  practiceSchedule: string;
  homeVenue: string;
  description: string;
  image: string;
  rosterCount: number;
  isActive: boolean;
}

interface Art {
  id: string;
  program: string;
  type: 'visual' | 'performing' | 'media';
  instructor: string;
  description: string;
  meetingTime: string;
  location: string;
  image: string;
  requirements: string;
  showcaseInfo: string;
  isActive: boolean;
}

interface FormSubmission {
  id: string;
  eventId: string;
  eventName: string;
  studentName: string;
  studentEmail: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  forms: {
    contractForm?: {
      fileName: string;
      fileUrl: string;
    };
    guestForm?: {
      fileName: string;
      fileUrl: string;
    };
    studentId?: {
      fileName: string;
      fileUrl: string;
    };
  };
  quantity: number;
  totalAmount: number;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
}

interface Purchase {
  id: string;
  productId: string;
  productName: string;
  studentName: string;
  studentEmail: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  purchaseDate: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'online' | 'school_account';
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  formSubmissionStats: {
    totalSubmissions: number;
    approvalRate: number;
    averageProcessingTime: number;
  };
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
    maxTickets: 300,
    requiresApproval: true,
    requiredForms: {
      contractForm: true,
      guestForm: true,
      studentIdRequired: true,
      customForms: ["Photo Release Form"]
    }
  },
  {
    id: "2",
    title: "Winter Concert",
    category: "Music",
    date: "2024-12-15",
    time: "7:00 PM - 9:00 PM",
    location: "Auditorium",
    description: "Holiday music performance by school bands and choir",
    price: 5,
    maxTickets: 500,
    requiresApproval: false
  },
  {
    id: "3",
    title: "Senior Trip",
    category: "Trip",
    date: "2024-05-20",
    time: "8:00 AM - 6:00 PM",
    location: "Theme Park",
    description: "End of year celebration trip for seniors",
    price: 85,
    maxTickets: 150,
    requiresApproval: true,
    requiredForms: {
      contractForm: true,
      guestForm: false,
      studentIdRequired: true,
      customForms: ["Medical Form", "Emergency Contact Form"]
    }
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
    gradeLevel: "senior",
    bio: "Leading ESHS with passion and dedication.",
    responsibilities: ["Lead ASB meetings", "Represent student body", "Coordinate school events", "Liaison with administration"],
    description: "The ASB President serves as the primary student leader and representative of the student body.",
    currentRepresentatives: [
      { name: "Sarah Johnson", contactEmail: "sarah.johnson@eshs.edu" }
    ]
  }
];

const mockClubs: Club[] = [
  {
    id: "1",
    name: "Drama Club",
    description: "Explore theater arts through performances, workshops, and productions.",
    advisor: "Ms. Rodriguez",
    meetingTime: "Tuesdays & Thursdays 3:30-5:00 PM",
    location: "Theater Arts Room",
    category: "Arts & Performance",
    contactEmail: "drama@eshs.edu",
    image: "/api/placeholder/400/300",
    memberCount: 25,
    isActive: true
  },
  {
    id: "2",
    name: "Robotics Club",
    description: "Build and program robots for competitions and STEM learning.",
    advisor: "Mr. Chen",
    meetingTime: "Mondays & Wednesdays 3:30-5:30 PM",
    location: "Engineering Lab",
    category: "STEM",
    contactEmail: "robotics@eshs.edu",
    image: "/api/placeholder/400/300",
    memberCount: 18,
    isActive: true
  }
];

const mockAthletics: Athletic[] = [
  {
    id: "1",
    sport: "Basketball",
    season: "winter",
    coach: "Coach Martinez",
    assistantCoach: "Coach Davis",
    practiceSchedule: "Monday-Friday 3:30-5:30 PM",
    homeVenue: "ESHS Gymnasium",
    description: "Varsity and JV basketball teams competing in league championships.",
    image: "/api/placeholder/400/300",
    rosterCount: 24,
    isActive: true
  },
  {
    id: "2",
    sport: "Track & Field",
    season: "spring",
    coach: "Coach Thompson",
    practiceSchedule: "Monday-Friday 3:30-5:00 PM",
    homeVenue: "ESHS Track",
    description: "Individual and team events in track and field competitions.",
    image: "/api/placeholder/400/300",
    rosterCount: 35,
    isActive: true
  }
];

const mockArts: Art[] = [
  {
    id: "1",
    program: "Concert Band",
    type: "performing",
    instructor: "Mr. Williams",
    description: "Full concert band performing classical and contemporary pieces.",
    meetingTime: "Period 4 (12:30-1:15 PM)",
    location: "Band Room",
    image: "/api/placeholder/400/300",
    requirements: "Audition required, must own or rent instrument",
    showcaseInfo: "Fall and Spring concerts, competition participation",
    isActive: true
  },
  {
    id: "2",
    program: "Visual Arts",
    type: "visual",
    instructor: "Ms. Parker",
    description: "Explore various visual art mediums including painting, drawing, and sculpture.",
    meetingTime: "Period 2 (9:45-10:30 AM)",
    location: "Art Studio",
    image: "/api/placeholder/400/300",
    requirements: "No prior experience required",
    showcaseInfo: "Student art gallery displays throughout the year",
    isActive: true
  }
];

const mockFormSubmissions: FormSubmission[] = [
  {
    id: "fs1",
    eventId: "event1",
    eventName: "Winter Formal",
    studentName: "Emma Johnson",
    studentEmail: "emma.johnson@student.edu",
    submissionDate: "2024-01-15T10:30:00Z",
    status: "pending",
    forms: {
      contractForm: {
        fileName: "winter_formal_contract.pdf",
        fileUrl: "/uploads/contracts/winter_formal_contract_fs1.pdf"
      },
      guestForm: {
        fileName: "guest_registration.pdf",
        fileUrl: "/uploads/guests/guest_registration_fs1.pdf"
      },
      studentId: {
        fileName: "student_id_emma.jpg",
        fileUrl: "/uploads/ids/student_id_emma_fs1.jpg"
      }
    },
    quantity: 2,
    totalAmount: 120.00
  },
  {
    id: "fs2",
    eventId: "event2",
    eventName: "Spring Concert",
    studentName: "Michael Chen",
    studentEmail: "michael.chen@student.edu",
    submissionDate: "2024-01-14T14:20:00Z",
    status: "approved",
    forms: {
      contractForm: {
        fileName: "concert_participation_form.pdf",
        fileUrl: "/uploads/contracts/concert_participation_fs2.pdf"
      },
      studentId: {
        fileName: "student_id_michael.jpg",
        fileUrl: "/uploads/ids/student_id_michael_fs2.jpg"
      }
    },
    quantity: 1,
    totalAmount: 25.00,
    reviewedBy: "Mrs. Davis",
    reviewedDate: "2024-01-15T09:15:00Z"
  },
  {
    id: "fs3",
    eventId: "event3",
    eventName: "Senior Trip",
    studentName: "Sarah Williams",
    studentEmail: "sarah.williams@student.edu",
    submissionDate: "2024-01-13T16:45:00Z",
    status: "rejected",
    forms: {
      contractForm: {
        fileName: "trip_liability_waiver.pdf",
        fileUrl: "/uploads/contracts/trip_liability_waiver_fs3.pdf"
      },
      guestForm: {
        fileName: "emergency_contact.pdf",
        fileUrl: "/uploads/guests/emergency_contact_fs3.pdf"
      },
      studentId: {
        fileName: "student_id_sarah.jpg",
        fileUrl: "/uploads/ids/student_id_sarah_fs3.jpg"
      }
    },
    quantity: 1,
    totalAmount: 250.00,
    reviewedBy: "Mr. Thompson",
    reviewedDate: "2024-01-14T11:30:00Z",
    rejectionReason: "Incomplete emergency contact information"
  },
  {
    id: "fs4",
    eventId: "event1",
    eventName: "Winter Formal",
    studentName: "Alex Rodriguez",
    studentEmail: "alex.rodriguez@student.edu",
    submissionDate: "2024-01-16T08:15:00Z",
    status: "pending",
    forms: {
      contractForm: {
        fileName: "winter_formal_contract_alex.pdf",
        fileUrl: "/uploads/contracts/winter_formal_contract_fs4.pdf"
      },
      studentId: {
        fileName: "student_id_alex.jpg",
        fileUrl: "/uploads/ids/student_id_alex_fs4.jpg"
      }
    },
    quantity: 1,
    totalAmount: 60.00
  },
  {
    id: "fs5",
    eventId: "event4",
    eventName: "Drama Club Performance",
    studentName: "Jessica Park",
    studentEmail: "jessica.park@student.edu",
    submissionDate: "2024-01-12T13:00:00Z",
    status: "approved",
    forms: {
      contractForm: {
        fileName: "performance_agreement.pdf",
        fileUrl: "/uploads/contracts/performance_agreement_fs5.pdf"
      },
      guestForm: {
        fileName: "audience_guest_list.pdf",
        fileUrl: "/uploads/guests/audience_guest_list_fs5.pdf"
      },
      studentId: {
        fileName: "student_id_jessica.jpg",
        fileUrl: "/uploads/ids/student_id_jessica_fs5.jpg"
      }
    },
    quantity: 3,
    totalAmount: 45.00,
    reviewedBy: "Ms. Garcia",
    reviewedDate: "2024-01-13T10:20:00Z"
  }
];

const mockPurchases: Purchase[] = [
  {
    id: "p1",
    productId: "1",
    productName: "ESHS Spirit T-Shirt",
    studentName: "John Smith",
    studentEmail: "john.smith@student.edu",
    quantity: 2,
    unitPrice: 25.00,
    totalAmount: 50.00,
    purchaseDate: "2024-06-01T10:30:00Z",
    status: "completed",
    paymentMethod: "card"
  },
  {
    id: "p2",
    productId: "2",
    productName: "ESHS Hoodie",
    studentName: "Emma Johnson",
    studentEmail: "emma.johnson@student.edu",
    quantity: 1,
    unitPrice: 45.00,
    totalAmount: 45.00,
    purchaseDate: "2024-06-02T14:15:00Z",
    status: "completed",
    paymentMethod: "online"
  },
  {
    id: "p3",
    productId: "1",
    productName: "ESHS Spirit T-Shirt",
    studentName: "Michael Chen",
    studentEmail: "michael.chen@student.edu",
    quantity: 1,
    unitPrice: 25.00,
    totalAmount: 25.00,
    purchaseDate: "2024-06-03T09:45:00Z",
    status: "pending",
    paymentMethod: "cash"
  },
  {
    id: "p4",
    productId: "3",
    productName: "School Water Bottle",
    studentName: "Sarah Williams",
    studentEmail: "sarah.williams@student.edu",
    quantity: 3,
    unitPrice: 15.00,
    totalAmount: 45.00,
    purchaseDate: "2024-06-04T16:20:00Z",
    status: "completed",
    paymentMethod: "school_account"
  },
  {
    id: "p5",
    productId: "2",
    productName: "ESHS Hoodie",
    studentName: "Alex Rodriguez",
    studentEmail: "alex.rodriguez@student.edu",
    quantity: 1,
    unitPrice: 45.00,
    totalAmount: 45.00,
    purchaseDate: "2024-06-05T11:30:00Z",
    status: "refunded",
    paymentMethod: "card"
  }
];

const mockAnalyticsData: AnalyticsData = {
  totalRevenue: 2850.00,
  totalOrders: 127,
  averageOrderValue: 22.44,
  topSellingProducts: [
    {
      productId: "1",
      productName: "ESHS Spirit T-Shirt",
      totalSold: 45,
      revenue: 1125.00
    },
    {
      productId: "2",
      productName: "ESHS Hoodie",
      totalSold: 28,
      revenue: 1260.00
    },
    {
      productId: "3",
      productName: "School Water Bottle",
      totalSold: 32,
      revenue: 480.00
    }
  ],
  revenueByMonth: [
    { month: "January", revenue: 450.00, orders: 18 },
    { month: "February", revenue: 620.00, orders: 25 },
    { month: "March", revenue: 380.00, orders: 15 },
    { month: "April", revenue: 520.00, orders: 22 },
    { month: "May", revenue: 680.00, orders: 28 },
    { month: "June", revenue: 200.00, orders: 8 }
  ],
  formSubmissionStats: {
    totalSubmissions: 5,
    approvalRate: 0.4,
    averageProcessingTime: 1.2
  }
};

// Form Components
function ProductForm({ product, onSubmit, onCancel }: {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      price: 0,
      category: '',
      organization: '',
      sizes: [],
      colors: [],
      image: '',
      description: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Product Name</label>
        <Input
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Price ($)</label>
          <Input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apparel">Apparel</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="School Supplies">School Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Organization</label>
        <Input
          value={formData.organization || ''}
          onChange={(e) => setFormData({...formData, organization: e.target.value})}
          placeholder="ASB, Drama Club, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Available Sizes</label>
          <Input
            value={formData.sizes?.join(', ') || ''}
            onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
            placeholder="S, M, L, XL"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Available Colors</label>
          <Input
            value={formData.colors?.join(', ') || ''}
            onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
            placeholder="Blue, Gold, Red"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Image URL</label>
        <Input
          value={formData.image || ''}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="/api/placeholder/400/400"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function EventForm({ event, onSubmit, onCancel }: {
  event?: Event;
  onSubmit: (data: Partial<Event>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Event>>(
    event || {
      title: '',
      category: '',
      date: '',
      time: '',
      location: '',
      description: '',
      price: 0,
      maxTickets: 0,
      requiresApproval: false,
      requiredForms: {
        contractForm: false,
        guestForm: false,
        studentIdRequired: false,
        customForms: []
      }
    }
  );

  const [newCustomForm, setNewCustomForm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addCustomForm = () => {
    if (newCustomForm.trim() && formData.requiredForms) {
      setFormData({
        ...formData,
        requiredForms: {
          ...formData.requiredForms,
          customForms: [...(formData.requiredForms.customForms || []), newCustomForm.trim()]
        }
      });
      setNewCustomForm('');
    }
  };

  const removeCustomForm = (index: number) => {
    if (formData.requiredForms) {
      setFormData({
        ...formData,
        requiredForms: {
          ...formData.requiredForms,
          customForms: formData.requiredForms.customForms?.filter((_, i) => i !== index) || []
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Event Title</label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dance">Dance</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
              <SelectItem value="Community Service">Community Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Date</label>
          <Input
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Time</label>
          <Input
            value={formData.time || ''}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            placeholder="7:00 PM - 11:00 PM"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Location</label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="School Gymnasium"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Price ($)</label>
          <Input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Max Tickets</label>
          <Input
            type="number"
            value={formData.maxTickets || ''}
            onChange={(e) => setFormData({...formData, maxTickets: parseInt(e.target.value)})}
            placeholder="300"
          />
        </div>
      </div>

      {/* Form Requirements Section */}
      <div className="border border-white/20 rounded-lg p-4 bg-white/5 space-y-4">
        <h3 className="text-lg font-semibold text-white">Form Requirements</h3>
        
        {/* Requires Approval Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requiresApproval"
            checked={formData.requiresApproval || false}
            onChange={(e) => setFormData({...formData, requiresApproval: e.target.checked})}
            className="rounded border-gray-600 bg-gray-700"
          />
          <label htmlFor="requiresApproval" className="text-sm font-medium text-white">
            Event Requires Form Approval
          </label>
        </div>

        {/* Standard Forms */}
        {formData.requiresApproval && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="contractForm"
                checked={formData.requiredForms?.contractForm || false}
                onChange={(e) => setFormData({
                  ...formData,
                  requiredForms: {
                    ...formData.requiredForms,
                    contractForm: e.target.checked
                  }
                })}
                className="rounded border-gray-600 bg-gray-700"
              />
              <label htmlFor="contractForm" className="text-sm font-medium text-gray-300">
                Contract Form Required
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="guestForm"
                checked={formData.requiredForms?.guestForm || false}
                onChange={(e) => setFormData({
                  ...formData,
                  requiredForms: {
                    ...formData.requiredForms,
                    guestForm: e.target.checked
                  }
                })}
                className="rounded border-gray-600 bg-gray-700"
              />
              <label htmlFor="guestForm" className="text-sm font-medium text-gray-300">
                Guest Form Required
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="studentIdRequired"
                checked={formData.requiredForms?.studentIdRequired || false}
                onChange={(e) => setFormData({
                  ...formData,
                  requiredForms: {
                    ...formData.requiredForms,
                    studentIdRequired: e.target.checked
                  }
                })}
                className="rounded border-gray-600 bg-gray-700"
              />
              <label htmlFor="studentIdRequired" className="text-sm font-medium text-gray-300">
                Student ID Required
              </label>
            </div>

            {/* Custom Forms Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">Custom Forms</label>
              
              {/* Add Custom Form */}
              <div className="flex gap-2 mb-3">
                <Input
                  value={newCustomForm}
                  onChange={(e) => setNewCustomForm(e.target.value)}
                  placeholder="Enter custom form name"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomForm();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addCustomForm}
                  variant="outline" 
                  size="sm"
                  className="border-white/20 text-gray-300 hover:bg-white/10"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Custom Forms List */}
              {formData.requiredForms?.customForms && formData.requiredForms.customForms.length > 0 && (
                <div className="space-y-2">
                  {formData.requiredForms.customForms.map((form, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                      <span className="text-sm text-gray-300">{form}</span>
                      <Button
                        type="button"
                        onClick={() => removeCustomForm(index)}
                        variant="destructive"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {event ? 'Update Event' : 'Add Event'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function VideoForm({ video, onSubmit, onCancel }: {
  video?: VideoPost;
  onSubmit: (data: Partial<VideoPost>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<VideoPost>>(
    video || {
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      author: '',
      category: '',
      featured: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Video Title</label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter video title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Video description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Video URL</label>
        <Input
          value={formData.videoUrl || ''}
          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Thumbnail URL</label>
        <Input
          value={formData.thumbnailUrl || ''}
          onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
          placeholder="/api/placeholder/400/225"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Author</label>
          <Input
            value={formData.author || ''}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            placeholder="ASB Media Team"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
              <SelectItem value="Academics">Academics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured || false}
          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
          className="rounded border-gray-600 bg-gray-700"
        />
        <label htmlFor="featured" className="text-sm font-medium text-white">
          Featured Video
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {video ? 'Update Video' : 'Add Video'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function AnnouncementForm({ announcement, onSubmit, onCancel }: {
  announcement?: Announcement;
  onSubmit: (data: Partial<Announcement>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Announcement>>(
    announcement || {
      title: '',
      content: '',
      priority: 'medium'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Announcement Title</label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter announcement title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Content</label>
        <Textarea
          value={formData.content || ''}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Announcement content"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Priority</label>
        <Select value={formData.priority || 'medium'} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({...formData, priority: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {announcement ? 'Update Announcement' : 'Add Announcement'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function StudentGovForm({ member, onSubmit, onCancel }: {
  member?: StudentGovPosition;
  onSubmit: (data: Partial<StudentGovPosition>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<StudentGovPosition>>(
    member || {
      position: '',
      gradeLevel: 'freshman',
      bio: '',
      responsibilities: [],
      description: '',
      currentRepresentatives: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addRepresentative = () => {
    setFormData({
      ...formData,
      currentRepresentatives: [
        ...(formData.currentRepresentatives || []),
        { name: '', contactEmail: '' }
      ]
    });
  };

  const removeRepresentative = (index: number) => {
    setFormData({
      ...formData,
      currentRepresentatives: formData.currentRepresentatives?.filter((_, i) => i !== index) || []
    });
  };

  const updateRepresentative = (index: number, field: 'name' | 'contactEmail', value: string) => {
    const updated = [...(formData.currentRepresentatives || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, currentRepresentatives: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Position Title</label>
        <Input
          value={formData.position || ''}
          onChange={(e) => setFormData({...formData, position: e.target.value})}
          placeholder="ASB President, Secretary, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Grade Level</label>
        <Select value={formData.gradeLevel || 'freshman'} onValueChange={(value: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'officer' | 'committee') => setFormData({...formData, gradeLevel: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freshman">Freshman</SelectItem>
            <SelectItem value="sophomore">Sophomore</SelectItem>
            <SelectItem value="junior">Junior</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
            <SelectItem value="officer">Officer</SelectItem>
            <SelectItem value="committee">Committee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Brief description of the position"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Responsibilities</label>
        <Textarea
          value={formData.responsibilities?.join('\n') || ''}
          onChange={(e) => setFormData({...formData, responsibilities: e.target.value.split('\n').filter(r => r.trim())})}
          placeholder="Enter each responsibility on a new line"
          rows={4}
        />
        <p className="text-xs text-gray-400 mt-1">Enter each responsibility on a new line</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Bio</label>
        <Textarea
          value={formData.bio || ''}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          placeholder="Brief bio or description"
          rows={3}
        />
      </div>

      {/* Current Representatives Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-white">Current Representatives</label>
          <Button type="button" onClick={addRepresentative} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Representative
          </Button>
        </div>
        
        {formData.currentRepresentatives && formData.currentRepresentatives.length > 0 ? (
          <div className="space-y-3">
            {formData.currentRepresentatives.map((rep, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                    <Input
                      value={rep.name}
                      onChange={(e) => updateRepresentative(index, 'name', e.target.value)}
                      placeholder="Representative name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Contact Email</label>
                    <Input
                      type="email"
                      value={rep.contactEmail}
                      onChange={(e) => updateRepresentative(index, 'contactEmail', e.target.value)}
                      placeholder="contact@eshs.edu"
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={() => removeRepresentative(index)} 
                  variant="destructive" 
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No representatives added yet. Click "Add Representative" to add one.</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {member ? 'Update Position' : 'Add Position'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function ClubForm({ club, onSubmit, onCancel }: {
  club?: Club;
  onSubmit: (data: Partial<Club>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Club>>(
    club || {
      name: '',
      description: '',
      advisor: '',
      meetingTime: '',
      location: '',
      category: '',
      contactEmail: '',
      image: '',
      memberCount: 0,
      isActive: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Club Name</label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Drama Club"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Input
            value={formData.category || ''}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="Arts & Performance"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Club description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Advisor</label>
          <Input
            value={formData.advisor || ''}
            onChange={(e) => setFormData({...formData, advisor: e.target.value})}
            placeholder="Ms. Rodriguez"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Contact Email</label>
          <Input
            type="email"
            value={formData.contactEmail || ''}
            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
            placeholder="drama@eshs.edu"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Meeting Time</label>
          <Input
            value={formData.meetingTime || ''}
            onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
            placeholder="Tuesdays & Thursdays 3:30-5:00 PM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Location</label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Theater Arts Room"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Member Count</label>
          <Input
            type="number"
            value={formData.memberCount || ''}
            onChange={(e) => setFormData({...formData, memberCount: parseInt(e.target.value)})}
            placeholder="25"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Image URL</label>
          <Input
            value={formData.image || ''}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="/api/placeholder/400/300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="clubActive"
          checked={formData.isActive || false}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded border-gray-600 bg-gray-700"
        />
        <label htmlFor="clubActive" className="text-sm font-medium text-white">
          Active Club
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {club ? 'Update Club' : 'Add Club'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function AthleticForm({ athletic, onSubmit, onCancel }: {
  athletic?: Athletic;
  onSubmit: (data: Partial<Athletic>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Athletic>>(
    athletic || {
      sport: '',
      season: 'fall',
      coach: '',
      assistantCoach: '',
      practiceSchedule: '',
      homeVenue: '',
      description: '',
      image: '',
      rosterCount: 0,
      isActive: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Sport</label>
          <Input
            value={formData.sport || ''}
            onChange={(e) => setFormData({...formData, sport: e.target.value})}
            placeholder="Basketball"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Season</label>
          <Select value={formData.season || 'fall'} onValueChange={(value: 'fall' | 'winter' | 'spring' | 'year-round') => setFormData({...formData, season: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fall">Fall</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="year-round">Year Round</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Sport description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Head Coach</label>
          <Input
            value={formData.coach || ''}
            onChange={(e) => setFormData({...formData, coach: e.target.value})}
            placeholder="Coach Martinez"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Assistant Coach</label>
          <Input
            value={formData.assistantCoach || ''}
            onChange={(e) => setFormData({...formData, assistantCoach: e.target.value})}
            placeholder="Coach Davis (optional)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Practice Schedule</label>
          <Input
            value={formData.practiceSchedule || ''}
            onChange={(e) => setFormData({...formData, practiceSchedule: e.target.value})}
            placeholder="Monday-Friday 3:30-5:30 PM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Home Venue</label>
          <Input
            value={formData.homeVenue || ''}
            onChange={(e) => setFormData({...formData, homeVenue: e.target.value})}
            placeholder="ESHS Gymnasium"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Roster Count</label>
          <Input
            type="number"
            value={formData.rosterCount || ''}
            onChange={(e) => setFormData({...formData, rosterCount: parseInt(e.target.value)})}
            placeholder="24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Image URL</label>
          <Input
            value={formData.image || ''}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="/api/placeholder/400/300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="athleticActive"
          checked={formData.isActive || false}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded border-gray-600 bg-gray-700"
        />
        <label htmlFor="athleticActive" className="text-sm font-medium text-white">
          Active Program
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {athletic ? 'Update Program' : 'Add Program'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function ArtForm({ art, onSubmit, onCancel }: {
  art?: Art;
  onSubmit: (data: Partial<Art>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Art>>(
    art || {
      program: '',
      type: 'visual',
      instructor: '',
      description: '',
      meetingTime: '',
      location: '',
      image: '',
      requirements: '',
      showcaseInfo: '',
      isActive: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Program Name</label>
          <Input
            value={formData.program || ''}
            onChange={(e) => setFormData({...formData, program: e.target.value})}
            placeholder="Concert Band"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Type</label>
          <Select value={formData.type || 'visual'} onValueChange={(value: 'visual' | 'performing' | 'media') => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">Visual Arts</SelectItem>
              <SelectItem value="performing">Performing Arts</SelectItem>
              <SelectItem value="media">Media Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Program description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Instructor</label>
          <Input
            value={formData.instructor || ''}
            onChange={(e) => setFormData({...formData, instructor: e.target.value})}
            placeholder="Mr. Williams"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Meeting Time</label>
          <Input
            value={formData.meetingTime || ''}
            onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
            placeholder="Period 4 (12:30-1:15 PM)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Location</label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Band Room"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Image URL</label>
          <Input
            value={formData.image || ''}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="/api/placeholder/400/300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Requirements</label>
        <Textarea
          value={formData.requirements || ''}
          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          placeholder="Audition required, must own or rent instrument"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Showcase Information</label>
        <Textarea
          value={formData.showcaseInfo || ''}
          onChange={(e) => setFormData({...formData, showcaseInfo: e.target.value})}
          placeholder="Fall and Spring concerts, competition participation"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="artActive"
          checked={formData.isActive || false}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded border-gray-600 bg-gray-700"
        />
        <label htmlFor="artActive" className="text-sm font-medium text-white">
          Active Program
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {art ? 'Update Program' : 'Add Program'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

export default function Admin() {
  // State for managing data
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [videos, setVideos] = useState<VideoPost[]>(mockVideoPosts);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [studentGov, setStudentGov] = useState<StudentGovPosition[]>(mockStudentGov);
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [athletics, setAthletics] = useState<Athletic[]>(mockAthletics);
  const [arts, setArts] = useState<Art[]>(mockArts);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(mockFormSubmissions);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData);

  // State for modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showStudentGovModal, setShowStudentGovModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showAthleticModal, setShowAthleticModal] = useState(false);
  const [showArtModal, setShowArtModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionSubmissionId, setRejectionSubmissionId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);

  // State for form approvals filtering and search
  const [formApprovalFilter, setFormApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [formApprovalSearch, setFormApprovalSearch] = useState<string>('');

  // Handlers
  const handleAddProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      id: Date.now(),
      name: productData.name || '',
      price: productData.price || 0,
      category: productData.category || '',
      organization: productData.organization || '',
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      image: productData.image || '/api/placeholder/400/400',
      description: productData.description || ''
    };
    setProducts([...products, newProduct]);
    setShowProductModal(false);
    console.log('Product added:', newProduct);
  };

  const handleAddEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title || '',
      category: eventData.category || '',
      date: eventData.date || '',
      time: eventData.time || '',
      location: eventData.location || '',
      description: eventData.description || '',
      price: eventData.price,
      maxTickets: eventData.maxTickets
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
    console.log('Event added:', newEvent);
  };

  const handleAddVideo = (videoData: Partial<VideoPost>) => {
    const newVideo: VideoPost = {
      id: Date.now().toString(),
      title: videoData.title || '',
      description: videoData.description || '',
      videoUrl: videoData.videoUrl || '',
      thumbnailUrl: videoData.thumbnailUrl || '/api/placeholder/400/225',
      date: new Date().toISOString().split('T')[0],
      author: videoData.author || '',
      category: videoData.category || '',
      views: 0,
      featured: videoData.featured || false
    };
    setVideos([...videos, newVideo]);
    setShowVideoModal(false);
    console.log('Video added:', newVideo);
  };

  const handleAddAnnouncement = (announcementData: Partial<Announcement>) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: announcementData.title || '',
      content: announcementData.content || '',
      priority: announcementData.priority || 'medium',
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setShowAnnouncementModal(false);
    console.log('Announcement added:', newAnnouncement);
  };

  const handleAddStudentGov = (memberData: Partial<StudentGovPosition>) => {
    const newPosition: StudentGovPosition = {
      id: Date.now().toString(),
      position: memberData.position || '',
      gradeLevel: memberData.gradeLevel || 'freshman',
      bio: memberData.bio || '',
      responsibilities: memberData.responsibilities || [],
      description: memberData.description || '',
      currentRepresentatives: memberData.currentRepresentatives || []
    };
    setStudentGov([...studentGov, newPosition]);
    setShowStudentGovModal(false);
    console.log('Student Gov position added:', newPosition);
  };

  const handleAddClub = (clubData: Partial<Club>) => {
    const newClub: Club = {
      id: Date.now().toString(),
      name: clubData.name || '',
      description: clubData.description || '',
      advisor: clubData.advisor || '',
      meetingTime: clubData.meetingTime || '',
      location: clubData.location || '',
      category: clubData.category || '',
      contactEmail: clubData.contactEmail || '',
      image: clubData.image || '/api/placeholder/400/300',
      memberCount: clubData.memberCount || 0,
      isActive: clubData.isActive || true
    };
    setClubs([...clubs, newClub]);
    setShowClubModal(false);
    console.log('Club added:', newClub);
  };

  const handleAddAthletic = (athleticData: Partial<Athletic>) => {
    const newAthletic: Athletic = {
      id: Date.now().toString(),
      sport: athleticData.sport || '',
      season: athleticData.season || 'fall',
      coach: athleticData.coach || '',
      assistantCoach: athleticData.assistantCoach,
      practiceSchedule: athleticData.practiceSchedule || '',
      homeVenue: athleticData.homeVenue || '',
      description: athleticData.description || '',
      image: athleticData.image || '/api/placeholder/400/300',
      rosterCount: athleticData.rosterCount || 0,
      isActive: athleticData.isActive || true
    };
    setAthletics([...athletics, newAthletic]);
    setShowAthleticModal(false);
    console.log('Athletic added:', newAthletic);
  };

  const handleAddArt = (artData: Partial<Art>) => {
    const newArt: Art = {
      id: Date.now().toString(),
      program: artData.program || '',
      type: artData.type || 'visual',
      instructor: artData.instructor || '',
      description: artData.description || '',
      meetingTime: artData.meetingTime || '',
      location: artData.location || '',
      image: artData.image || '/api/placeholder/400/300',
      requirements: artData.requirements || '',
      showcaseInfo: artData.showcaseInfo || '',
      isActive: artData.isActive || true
    };
    setArts([...arts, newArt]);
    setShowArtModal(false);
    console.log('Art program added:', newArt);
  };

    const [, setLocation] = useLocation();

  const handleDelete = (type: string, id: string | number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch (type) {
        case 'product':
          setProducts(products.filter(p => p.id !== id));
          break;
        case 'event':
          setEvents(events.filter(e => e.id !== id));
          break;
        case 'video':
          setVideos(videos.filter(v => v.id !== id));
          break;
        case 'announcement':
          setAnnouncements(announcements.filter(a => a.id !== id));
          break;
        case 'studentgov':
          setStudentGov(studentGov.filter(s => s.id !== id));
          break;
        case 'club':
          setClubs(clubs.filter(c => c.id !== id));
          break;
        case 'athletic':
          setAthletics(athletics.filter(a => a.id !== id));
          break;
        case 'art':
          setArts(arts.filter(a => a.id !== id));
          break;
      }
      console.log(`${type} deleted:`, id);
    }
  };

  const handleFormApproval = (submissionId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    setFormSubmissions(formSubmissions.map(submission => {
      if (submission.id === submissionId) {
        return {
          ...submission,
          status,
          reviewedBy: 'Admin User', // In a real app, this would be the current user
          reviewedDate: new Date().toISOString(),
          rejectionReason: status === 'rejected' ? rejectionReason : undefined
        };
      }
      return submission;
    }));
    
    console.log(`Form submission ${submissionId} ${status}`, rejectionReason ? `with reason: ${rejectionReason}` : '');
  };

  const handleRejectWithReason = (submissionId: string) => {
    setRejectionSubmissionId(submissionId);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const confirmRejection = () => {
    if (rejectionReason.trim()) {
      handleFormApproval(rejectionSubmissionId, 'rejected', rejectionReason);
      setShowRejectionModal(false);
      setRejectionSubmissionId('');
      setRejectionReason('');
    }
  };

  const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
    setLocation("/");
  };

  // Filter and search form submissions
  const filteredFormSubmissions = formSubmissions.filter(submission => {
    // Filter by status
    const statusMatch = formApprovalFilter === 'all' || submission.status === formApprovalFilter;
    
    // Filter by search term (student name or event name)
    const searchMatch = formApprovalSearch === '' || 
      submission.studentName.toLowerCase().includes(formApprovalSearch.toLowerCase()) ||
      submission.eventName.toLowerCase().includes(formApprovalSearch.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen relative">
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
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {/* Transparent back button with title */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300"
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
            </Button>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
              Admin Dashboard
            </h1>
          </div>
        
        <div className="mt-8">
          <p className="text-gray-300 mb-8">Manage merchandise, activities, information, and birds eye view content</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Products</h3>
                <Package className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{products.length}</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Events</h3>
                <Calendar className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Form Submissions</h3>
                <FileText className="h-4 w-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formSubmissions.length}</div>
              <div className="text-xs text-gray-400 mt-1">
                {formSubmissions.filter(fs => fs.status === 'pending').length} pending
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Videos</h3>
                <Video className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{videos.length}</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Announcements</h3>
                <Info className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{announcements.length}</div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <TabsTrigger value="home" className="text-white data-[state=active]:bg-amber-600 data-[state=active]:text-white">Home</TabsTrigger>
              <TabsTrigger value="merchandise" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Merchandise</TabsTrigger>
              <TabsTrigger value="activities" className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-white">Activities</TabsTrigger>
              <TabsTrigger value="form-approvals" className="text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white">Form Approvals</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Analytics</TabsTrigger>
              <TabsTrigger value="information" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">Information</TabsTrigger>
              <TabsTrigger value="birds-eye-view" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white">Birds Eye View</TabsTrigger>
            </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Admin Dashboard Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Statistics */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  System Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Products</span>
                    <span className="font-bold text-blue-400">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Events</span>
                    <span className="font-bold text-green-400">{events.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Form Submissions</span>
                    <span className="font-bold text-orange-400">{formSubmissions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Purchases</span>
                    <span className="font-bold text-purple-400">{purchases.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Clubs</span>
                    <span className="font-bold text-cyan-400">{clubs.filter(c => c.isActive).length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowProductModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button 
                    onClick={() => setShowEventModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button 
                    onClick={() => setShowVideoModal(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button 
                    onClick={() => setShowAnnouncementModal(true)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Announcement
                  </Button>
                </div>
              </div>

              {/* Recent Activity Summary */}
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Recent Activity Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Pending Actions</h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">
                        Form Approvals: <span className="font-semibold text-yellow-400">
                          {formSubmissions.filter(fs => fs.status === 'pending').length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Recent Purchases: <span className="font-semibold text-green-400">
                          {purchases.filter(p => p.status === 'pending').length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">This Month</h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">
                        New Events: <span className="font-semibold text-blue-400">
                          {events.filter(e => new Date(e.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Revenue: <span className="font-semibold text-green-400">
                          ${analyticsData.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">System Health</h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">
                        Active Content: <span className="font-semibold text-green-400">
                          {clubs.filter(c => c.isActive).length + athletics.filter(a => a.isActive).length + arts.filter(a => a.isActive).length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Status: <span className="font-semibold text-green-400">All Systems Normal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Merchandise Tab */}
          <TabsContent value="merchandise" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Merchandise Management</h2>
              <PrimaryButton onClick={() => setShowProductModal(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product
              </PrimaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-white text-lg font-semibold mb-4">{product.name}</h3>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-green-400">${product.price}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.organization}</Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{product.description}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <OutlineButton size="sm" onClick={() => { setEditingItem(product); setShowProductModal(true); }}>
                        <Edit className="h-4 w-4" />
                      </OutlineButton>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete('product', product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Activities & Events</h2>
              <SecondaryButton onClick={() => setShowEventModal(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Event
              </SecondaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">{event.title}</h3>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      <p className="text-gray-300"><strong>Date:</strong> {event.date}</p>
                      <p className="text-gray-300"><strong>Time:</strong> {event.time}</p>
                      <p className="text-gray-300"><strong>Location:</strong> {event.location}</p>
                      <p className="text-gray-400">{event.description}</p>
                      {event.price && <p className="text-green-400 font-semibold">${event.price}</p>}
                      
                      {/* Required Forms Section */}
                      {event.requiresApproval && (
                        <div className="mt-3 p-3 bg-white/10 rounded-lg">
                          <h4 className="text-sm font-medium text-white mb-2">Required Forms:</h4>
                          <div className="space-y-1">
                            {event.requiredForms?.contractForm && (
                              <div className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-gray-300">Contract Form</span>
                              </div>
                            )}
                            {event.requiredForms?.guestForm && (
                              <div className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-gray-300">Guest Form</span>
                              </div>
                            )}
                            {event.requiredForms?.studentIdRequired && (
                              <div className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-gray-300">Student ID Required</span>
                              </div>
                            )}
                            {event.requiredForms?.customForms?.map((form, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-gray-300">{form}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <OutlineButton size="sm" onClick={() => { setEditingItem(event); setShowEventModal(true); }}>
                        <Edit className="h-4 w-4" />
                      </OutlineButton>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete('event', event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Form Approvals Tab */}
          <TabsContent value="form-approvals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Form Approvals</h2>
              <div className="flex gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm text-gray-300">Pending: </span>
                  <span className="font-bold text-yellow-400">
                    {formSubmissions.filter(fs => fs.status === 'pending').length}
                  </span>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm text-gray-300">Approved: </span>
                  <span className="font-bold text-green-400">
                    {formSubmissions.filter(fs => fs.status === 'approved').length}
                  </span>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm text-gray-300">Rejected: </span>
                  <span className="font-bold text-red-400">
                    {formSubmissions.filter(fs => fs.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
                <Select value={formApprovalFilter} onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => setFormApprovalFilter(value)}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-lg">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Search by Name</label>
                <Input
                  type="text"
                  placeholder="Search by student name or event name..."
                  value={formApprovalSearch}
                  onChange={(e) => setFormApprovalSearch(e.target.value)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 shadow-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFormSubmissions.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-8 text-center">
                  <p className="text-gray-300 text-lg">No form submissions found matching your criteria.</p>
                  {formApprovalFilter !== 'all' && (
                    <p className="text-gray-400 text-sm mt-2">Try changing the filter or search terms.</p>
                  )}
                </div>
              ) : (
                filteredFormSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white text-lg font-semibold">{submission.eventName}</h3>
                      <p className="text-gray-300">{submission.studentName} ({submission.studentEmail})</p>
                      <p className="text-sm text-gray-400">
                        Submitted: {new Date(submission.submissionDate).toLocaleDateString()} at {new Date(submission.submissionDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          submission.status === 'approved' ? 'default' : 
                          submission.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                        className={
                          submission.status === 'approved' ? 'bg-green-600 text-white' :
                          submission.status === 'rejected' ? 'bg-red-600 text-white' :
                          'bg-yellow-600 text-white'
                        }
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">Qty: {submission.quantity}</p>
                        <p className="text-sm font-semibold text-green-400">${submission.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Files Section */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Submitted Forms:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {submission.forms.contractForm && (
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-sm text-gray-300 mb-1">Contract Form</p>
                          <p className="text-xs text-gray-400 mb-2">{submission.forms.contractForm.fileName}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                            onClick={() => window.open(submission.forms.contractForm?.fileUrl, '_blank')}
                          >
                            View File
                          </Button>
                        </div>
                      )}
                      {submission.forms.guestForm && (
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-sm text-gray-300 mb-1">Guest Form</p>
                          <p className="text-xs text-gray-400 mb-2">{submission.forms.guestForm.fileName}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                            onClick={() => window.open(submission.forms.guestForm?.fileUrl, '_blank')}
                          >
                            View File
                          </Button>
                        </div>
                      )}
                      {submission.forms.studentId && (
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-sm text-gray-300 mb-1">Student ID</p>
                          <p className="text-xs text-gray-400 mb-2">{submission.forms.studentId.fileName}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                            onClick={() => window.open(submission.forms.studentId?.fileUrl, '_blank')}
                          >
                            View File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Information */}
                  {submission.status !== 'pending' && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Review Information:</h4>
                      <p className="text-sm text-gray-300">
                        Reviewed by: {submission.reviewedBy} on {new Date(submission.reviewedDate!).toLocaleDateString()}
                      </p>
                      {submission.rejectionReason && (
                        <p className="text-sm text-red-400 mt-1">
                          Reason: {submission.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {submission.status === 'pending' && (
                    <div className="flex gap-3">
                      <PrimaryButton 
                        onClick={() => handleFormApproval(submission.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </PrimaryButton>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectWithReason(submission.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Revenue Overview Cards */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400">${analyticsData.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-xs text-gray-400 mt-2">+12% from last month</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-400">{analyticsData.totalOrders}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 mt-2">+8% from last month</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Avg Order Value</p>
                    <p className="text-2xl font-bold text-purple-400">${analyticsData.averageOrderValue}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-xs text-gray-400 mt-2">+5% from last month</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Active Users</p>
                    <p className="text-2xl font-bold text-cyan-400">2,847</p>
                  </div>
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
                <p className="text-xs text-gray-400 mt-2">+15% from last month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Revenue by Month</h3>
                <div className="h-64 flex items-end space-x-2">
                  {analyticsData.revenueByMonth.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-cyan-500 rounded-t-sm mb-2 transition-all hover:bg-cyan-600"
                        style={{ height: `${(item.revenue / Math.max(...analyticsData.revenueByMonth.map(i => i.revenue))) * 200}px` }}
                      ></div>
                      <span className="text-xs text-gray-400 transform -rotate-45">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Top Selling Products</h3>
                <div className="space-y-4">
                  {analyticsData.topSellingProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-400 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.productName}</p>
                          <p className="text-sm text-gray-400">{product.totalSold} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">${product.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Analytics and Recent Purchases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Submission Analytics */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Form Submissions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-white">Contract Forms</span>
                    </div>
                    <span className="text-blue-400 font-semibold">{analyticsData.formSubmissionStats.totalSubmissions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-medium text-white">Guest Forms</span>
                    </div>
                    <span className="text-green-400 font-semibold">{analyticsData.formSubmissionStats.totalSubmissions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="font-medium text-white">Custom Forms</span>
                    </div>
                    <span className="text-purple-400 font-semibold">{analyticsData.formSubmissionStats.totalSubmissions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-orange-400" />
                      <span className="font-medium text-white">Student ID Verifications</span>
                    </div>
                    <span className="text-orange-400 font-semibold">{analyticsData.formSubmissionStats.totalSubmissions}</span>
                  </div>
                </div>
              </div>

              {/* Recent Purchases */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Purchases</h3>
                  <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {purchases.slice(0, 5).map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {purchase.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{purchase.studentName}</p>
                          <p className="text-xs text-gray-400">{purchase.productName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">${purchase.totalAmount}</p>
                        <p className="text-xs text-gray-500">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Purchase Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">All Purchases</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10">
                    Export
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 font-medium text-gray-300">Student</th>
                      <th className="text-left p-3 font-medium text-gray-300">Product</th>
                      <th className="text-left p-3 font-medium text-gray-300">Amount</th>
                      <th className="text-left p-3 font-medium text-gray-300">Status</th>
                      <th className="text-left p-3 font-medium text-gray-300">Date</th>
                      <th className="text-left p-3 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {purchase.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-white">{purchase.studentName}</p>
                              <p className="text-sm text-gray-400">Email: {purchase.studentEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-white">{purchase.productName}</p>
                          <p className="text-sm text-gray-400">Qty: {purchase.quantity}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-green-400">${purchase.totalAmount}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            purchase.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                            purchase.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                            'bg-red-500/20 text-red-400 border border-red-400/30'
                          }`}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Information Tab */}
          <TabsContent value="information" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Information Management</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Announcements Management */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Announcements
                  </h3>
                  <PrimaryButton 
                    onClick={() => setShowAnnouncementModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </PrimaryButton>
                </div>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{announcement.title}</h4>
                        <Badge 
                          variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{announcement.content.substring(0, 80)}...</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(announcement);
                            setShowAnnouncementModal(true);
                          }}
                          className="text-xs border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete('announcement', announcement.id)}
                          className="text-xs border-red-400/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Government Management */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Student Government
                  </h3>
                  <PrimaryButton 
                    onClick={() => setShowStudentGovModal(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </PrimaryButton>
                </div>
                <div className="space-y-3">
                  {studentGov.slice(0, 3).map((position) => (
                    <div key={position.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{position.position}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {position.gradeLevel}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">
                        {position.currentRepresentatives.length} representatives
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(position);
                            setShowStudentGovModal(true);
                          }}
                          className="text-xs border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete('studentgov', position.id)}
                          className="text-xs border-red-400/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clubs Management */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Clubs
                  </h3>
                  <PrimaryButton 
                    onClick={() => setShowClubModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </PrimaryButton>
                </div>
                <div className="space-y-3">
                  {clubs.slice(0, 3).map((club) => (
                    <div key={club.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{club.name}</h4>
                        <Badge 
                          variant={club.isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {club.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{club.memberCount} members</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(club);
                            setShowClubModal(true);
                          }}
                          className="text-xs border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete('club', club.id)}
                          className="text-xs border-red-400/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Athletics Management */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Athletics
                  </h3>
                  <PrimaryButton 
                    onClick={() => setShowAthleticModal(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </PrimaryButton>
                </div>
                <div className="space-y-3">
                  {athletics.slice(0, 3).map((sport) => (
                    <div key={sport.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{sport.sport}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {sport.season}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{sport.rosterCount} players</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(sport);
                            setShowAthleticModal(true);
                          }}
                          className="text-xs border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete('athletic', sport.id)}
                          className="text-xs border-red-400/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arts Management */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Arts Programs
                  </h3>
                  <PrimaryButton 
                    onClick={() => setShowArtModal(true)}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </PrimaryButton>
                </div>
                <div className="space-y-3">
                  {arts.slice(0, 3).map((art) => (
                    <div key={art.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{art.program}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {art.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">Instructor: {art.instructor}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(art);
                            setShowArtModal(true);
                          }}
                          className="text-xs border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete('art', art.id)}
                          className="text-xs border-red-400/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Birds Eye View Tab */}
          <TabsContent value="birds-eye-view" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Birds Eye View Management</h2>
              <SecondaryButton onClick={() => setShowVideoModal(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Video/Post
              </SecondaryButton>
            </div>

            {/* Video/Post Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-300">Total Videos</h3>
                  <Video className="h-4 w-4 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-white">{videos.length}</div>
                <p className="text-xs text-gray-400 mt-1">Published videos</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-300">Featured</h3>
                  <CheckCircle className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{videos.filter(v => v.featured).length}</div>
                <p className="text-xs text-gray-400 mt-1">Featured content</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-300">Total Views</h3>
                  <Eye className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 mt-1">All-time views</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-300">Categories</h3>
                  <Badge className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {new Set(videos.map(v => v.category)).size}
                </div>
                <p className="text-xs text-gray-400 mt-1">Content categories</p>
              </div>
            </div>

            {/* Videos Management */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Manage Videos & Posts
                </h3>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Student Government">Student Government</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg rounded-xl overflow-hidden">
                    {/* Video Thumbnail */}
                    <div className="relative h-48 bg-gray-900">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x225?text=Video+Thumbnail";
                        }}
                      />
                      {video.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-600 text-white">Featured</Badge>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.views.toLocaleString()} views
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm line-clamp-2">{video.title}</h4>
                        <Badge variant="secondary" className="ml-2 text-xs">{video.category}</Badge>
                      </div>
                      
                      <p className="text-gray-300 text-xs mb-3 line-clamp-2">{video.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>By {video.author}</span>
                        <span>{video.date}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(video);
                            setShowVideoModal(true);
                          }}
                          className="flex-1 text-xs border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete('video', video.id)}
                          className="flex-1 text-xs border-red-400/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {videos.length === 0 && (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No videos posted yet</h3>
                  <p className="text-gray-400 mb-4">Start by adding your first video to the Birds Eye View page</p>
                  <SecondaryButton onClick={() => setShowVideoModal(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Video
                  </SecondaryButton>
                </div>
              )}
            </div>

            {/* Quick Management Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowVideoModal(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white justify-start"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Upload New Video
                  </Button>
                  <Button 
                    onClick={() => {
                      // Set the most recent video as featured
                      if (videos.length > 0) {
                        const latestVideo = videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                        setVideos(videos.map(v => ({ ...v, featured: v.id === latestVideo.id })));
                      }
                    }}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white justify-start"
                    disabled={videos.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Feature Latest Video
                  </Button>
                  <Button 
                    onClick={() => {
                      // Bulk action example - could implement later
                      console.log('Bulk manage videos');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Bulk Edit Videos
                  </Button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Content Analytics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Most Viewed</span>
                    <span className="font-bold text-blue-400">
                      {videos.length > 0 ? Math.max(...videos.map(v => v.views)).toLocaleString() + ' views' : '0 views'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Views</span>
                    <span className="font-bold text-green-400">
                      {videos.length > 0 ? Math.round(videos.reduce((sum, v) => sum + v.views, 0) / videos.length).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Popular Category</span>
                    <span className="font-bold text-purple-400">
                      {videos.length > 0 ? 
                        Object.entries(
                          videos.reduce((acc, v) => ({ ...acc, [v.category]: (acc[v.category] || 0) + 1 }), {} as Record<string, number>)
                        ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                        : 'None'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Content Status</span>
                    <span className="font-bold text-green-400">
                      {videos.length > 0 ? 'Active' : 'No Content'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Modal */}
        <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setProducts(products.map(p => p.id === editingItem.id ? {...p, ...data} : p));
                } else {
                  handleAddProduct(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowProductModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Event Modal */}
        <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Event' : 'Add Event'}</DialogTitle>
            </DialogHeader>
            <EventForm 
              event={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setEvents(events.map(e => e.id === editingItem.id ? {...e, ...data} : e));
                } else {
                  handleAddEvent(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowEventModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Video Modal */}
        <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Video' : 'Add Video'}</DialogTitle>
            </DialogHeader>
            <VideoForm 
              video={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setVideos(videos.map(v => v.id === editingItem.id ? {...v, ...data} : v));
                } else {
                  handleAddVideo(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowVideoModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Announcement Modal */}
        <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
            </DialogHeader>
            <AnnouncementForm 
              announcement={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setAnnouncements(announcements.map(a => a.id === editingItem.id ? {...a, ...data} : a));
                } else {
                  handleAddAnnouncement(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowAnnouncementModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Student Government Modal */}
        <Dialog open={showStudentGovModal} onOpenChange={setShowStudentGovModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Position' : 'Add Position'}</DialogTitle>
            </DialogHeader>
            <StudentGovForm 
              member={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setStudentGov(studentGov.map(s => s.id === editingItem.id ? {...s, ...data} : s));
                } else {
                  handleAddStudentGov(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowStudentGovModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Club Modal */}
        <Dialog open={showClubModal} onOpenChange={setShowClubModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Club' : 'Add Club'}</DialogTitle>
            </DialogHeader>
            <ClubForm 
              club={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setClubs(clubs.map(c => c.id === editingItem.id ? {...c, ...data} : c));
                } else {
                  handleAddClub(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowClubModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Athletic Modal */}
        <Dialog open={showAthleticModal} onOpenChange={setShowAthleticModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Program' : 'Add Program'}</DialogTitle>
            </DialogHeader>
            <AthleticForm 
              athletic={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setAthletics(athletics.map(a => a.id === editingItem.id ? {...a, ...data} : a));
                } else {
                  handleAddAthletic(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowAthleticModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Art Modal */}
        <Dialog open={showArtModal} onOpenChange={setShowArtModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Program' : 'Add Program'}</DialogTitle>
            </DialogHeader>
            <ArtForm 
              art={editingItem}
              onSubmit={(data) => {
                if (editingItem) {
                  setArts(arts.map(a => a.id === editingItem.id ? {...a, ...data} : a));
                } else {
                  handleAddArt(data);
                }
                setEditingItem(null);
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowArtModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Form Rejection Modal */}
        <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Form Submission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please provide a reason for rejecting this form submission:
              </p>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
              />
              <div className="flex gap-3 justify-end">
                <SecondaryButton 
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                    setRejectionSubmissionId('');
                  }}
                >
                  Cancel
                </SecondaryButton>
                <Button 
                  variant="destructive"
                  onClick={confirmRejection}
                  disabled={!rejectionReason.trim()}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject Submission
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </main>
      </div>
    </div>
  );
}