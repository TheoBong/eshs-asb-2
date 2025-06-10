import {
  Product,
  Event,
  VideoPost,
  Announcement,
  StudentGovPosition,
  Club,
  Athletic,
  Art,
  connectDB
} from "@shared/mongodb-schema";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mock data for seeding
const mockProducts = [
  {
    name: "ESHS Spirit T-Shirt",
    price: 15.99,
    category: "Apparel",
    organization: "ASB",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Gold", "White"],
    image: "/api/placeholder/400/400",
    description: "Show your school spirit with our official ESHS t-shirt.",
    stock: 50
  },
  {
    name: "Drama Club Hoodie",
    price: 35.00,
    category: "Apparel",
    organization: "Drama Club",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Maroon"],
    image: "/api/placeholder/400/400",
    description: "Comfortable hoodie featuring the Drama Club logo.",
    stock: 25
  },
  {
    name: "Senior Class Ring",
    price: 125.00,
    category: "Jewelry",
    organization: "Senior Class",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["Gold", "Silver"],
    image: "/api/placeholder/400/400",
    description: "Commemorate your senior year with our official class ring.",
    stock: 15
  }
];

const mockEvents = [
  {
    title: "Spring Dance",
    category: "Dance",
    date: new Date("2025-04-15"),
    time: "7:00 PM - 11:00 PM",
    location: "School Gymnasium",
    description: "Annual spring formal dance for all students.",
    price: 25.00,
    maxTickets: 200,
    features: ["DJ", "Photo Booth", "Refreshments"],
    requiresApproval: false,
    image: "/api/placeholder/600/400"
  },
  {
    title: "Senior Graduation Ceremony",
    category: "Ceremony",
    date: new Date("2025-06-15"),
    time: "10:00 AM - 12:00 PM",
    location: "Football Stadium",
    description: "Graduation ceremony for the Class of 2025.",
    price: 0,
    maxTickets: 1000,
    features: ["Guest Speakers", "Awards", "Reception"],
    requiresApproval: true,
    image: "/api/placeholder/600/400"
  }
];

const mockVideos = [
  {
    title: "Fall Sports Highlights",
    description: "Best moments from our fall sports season.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/600/400",
    date: new Date("2024-12-01"),
    author: "ESHS Media Team",
    category: "Sports",
    views: 1250,
    featured: true
  },
  {
    title: "Drama Club Performance",
    description: "Highlights from our recent theater production.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/600/400",
    date: new Date("2024-11-15"),
    author: "Drama Club",
    category: "Arts",
    views: 850,
    featured: false
  }
];

const mockAnnouncements = [
  {
    title: "Spring Break Schedule",
    date: new Date("2025-03-01"),
    content: "Spring break will be from March 15-22. Classes resume March 25.",
    priority: "high",
    author: "Administration"
  },
  {
    title: "New Club Fair",
    date: new Date("2025-02-15"),
    content: "Join us for the club fair on March 1st during lunch.",
    priority: "medium",
    author: "ASB"
  }
];

const mockStudentGovPositions = [
  {
    position: "Student Body President",
    gradeLevel: "Senior",
    bio: "Leading the student body with vision and dedication.",
    responsibilities: ["Leading ASB meetings", "Representing student interests", "Organizing school events"],
    description: "The highest elected position in student government.",
    currentRepresentatives: [
      {
        name: "Alex Johnson",
        image: "/api/placeholder/200/200",
        bio: "Senior class president passionate about student advocacy.",
        email: "alex.johnson@student.eshs.edu"
      }
    ]
  },
  {
    position: "Junior Class Representative",
    gradeLevel: "Junior",
    bio: "Representing the interests of the junior class.",
    responsibilities: ["Organizing junior class events", "Representing junior concerns", "Planning prom"],
    description: "Elected representative for the junior class.",
    currentRepresentatives: [
      {
        name: "Sam Wilson",
        image: "/api/placeholder/200/200",
        bio: "Junior class representative focused on academic excellence.",
        email: "sam.wilson@student.eshs.edu"
      }
    ]
  }
];

const mockClubs = [
  {
    name: "Drama Club",
    description: "Explore the world of theater through acting, directing, and technical theater.",
    advisor: "Ms. Rodriguez",
    meetingTime: "Tuesdays and Thursdays, 3:30-5:00 PM",
    location: "Theater",
    category: "Arts",
    contactEmail: "drama@eshs.edu",
    image: "/api/placeholder/400/300",
    memberCount: 35,
    requirements: ["Commitment to attend rehearsals", "Participation in productions"],
    activities: ["Fall Play", "Spring Musical", "One-Act Festival"],
    isActive: true
  },
  {
    name: "Science Olympiad",
    description: "Competitive science team that competes in various STEM events.",
    advisor: "Mr. Chen",
    meetingTime: "Mondays and Wednesdays, 3:30-5:00 PM",
    location: "Science Lab",
    category: "Academic",
    contactEmail: "scioly@eshs.edu",
    image: "/api/placeholder/400/300",
    memberCount: 28,
    requirements: ["Strong science background", "Commitment to competitions"],
    activities: ["Regional Competition", "State Tournament", "Science Fair"],
    isActive: true
  }
];

const mockAthletics = [
  {
    sport: "Basketball",
    season: "Winter",
    coach: "Coach Martinez",
    assistantCoach: "Coach Davis",
    practiceSchedule: "Monday-Friday, 3:30-5:30 PM",
    homeVenue: "ESHS Gymnasium",
    description: "Competitive basketball program focusing on teamwork and excellence.",
    image: "/api/placeholder/400/300",
    rosterCount: 15,
    achievements: ["League Champions 2024", "Regional Finalists"],
    schedule: [
      {
        opponent: "Riverside High",
        date: new Date("2025-01-15"),
        location: "ESHS Gymnasium",
        isHome: true
      },
      {
        opponent: "Mountain View High",
        date: new Date("2025-01-22"),
        location: "Mountain View High",
        isHome: false
      }
    ]
  },
  {
    sport: "Soccer",
    season: "Fall",
    coach: "Coach Thompson",
    assistantCoach: "Coach Lee",
    practiceSchedule: "Monday-Friday, 3:30-5:30 PM",
    homeVenue: "ESHS Soccer Field",
    description: "Dynamic soccer program building character and skill.",
    image: "/api/placeholder/400/300",
    rosterCount: 22,
    achievements: ["District Champions 2023", "State Qualifier"],
    schedule: []
  }
];

const mockArts = [
  {
    program: "Theater Arts",
    type: "Performance",
    instructor: "Ms. Rodriguez",
    description: "Comprehensive theater program covering acting, directing, and technical theater.",
    meetingTime: "Daily, Period 5",
    location: "Theater",
    image: "/api/placeholder/400/300",
    requirements: ["Audition for advanced classes", "Participation in productions"],
    showcaseInfo: "Fall play and spring musical performances",
    memberCount: 45
  },
  {
    program: "Visual Arts",
    type: "Studio Art",
    instructor: "Mr. Anderson",
    description: "Explore various art mediums including painting, drawing, and sculpture.",
    meetingTime: "Daily, Period 3",
    location: "Art Studio",
    image: "/api/placeholder/400/300",
    requirements: ["Basic art supplies", "Portfolio development"],
    showcaseInfo: "Annual art show in spring",
    memberCount: 32
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      Event.deleteMany({}),
      VideoPost.deleteMany({}),
      Announcement.deleteMany({}),
      StudentGovPosition.deleteMany({}),
      Club.deleteMany({}),
      Athletic.deleteMany({}),
      Art.deleteMany({})
    ]);

    console.log("🗑️ Cleared existing data");

    // Insert mock data
    await Promise.all([
      Product.insertMany(mockProducts),
      Event.insertMany(mockEvents),
      VideoPost.insertMany(mockVideos),
      Announcement.insertMany(mockAnnouncements),
      StudentGovPosition.insertMany(mockStudentGovPositions),
      Club.insertMany(mockClubs),
      Athletic.insertMany(mockAthletics),
      Art.insertMany(mockArts)
    ]);

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Seeded data:
    - ${mockProducts.length} products
    - ${mockEvents.length} events
    - ${mockVideos.length} videos
    - ${mockAnnouncements.length} announcements
    - ${mockStudentGovPositions.length} student government positions
    - ${mockClubs.length} clubs
    - ${mockAthletics.length} athletic programs
    - ${mockArts.length} arts programs`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url.includes('seed.ts')) {
  seedDatabase();
}

export { seedDatabase };
