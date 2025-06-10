// API utility functions for the frontend
const API_BASE_URL = '/api';

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Product API functions
export async function getProducts() {
  return fetchAPI<Product[]>('/products');
}

export async function getProduct(id: string) {
  return fetchAPI<Product>(`/products/${id}`);
}

export async function createProduct(product: Partial<Product>) {
  return fetchAPI<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, product: Partial<Product>) {
  return fetchAPI<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string) {
  return fetchAPI<void>(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Event API functions
export async function getEvents() {
  return fetchAPI<Event[]>('/events');
}

export async function getEvent(id: string) {
  return fetchAPI<Event>(`/events/${id}`);
}

export async function createEvent(event: Partial<Event>) {
  return fetchAPI<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

export async function updateEvent(id: string, event: Partial<Event>) {
  return fetchAPI<Event>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(id: string) {
  return fetchAPI<void>(`/events/${id}`, {
    method: 'DELETE',
  });
}

// Video API functions
export async function getVideos() {
  return fetchAPI<VideoPost[]>('/videos');
}

export async function getVideo(id: string) {
  return fetchAPI<VideoPost>(`/videos/${id}`);
}

export async function createVideo(video: Partial<VideoPost>) {
  return fetchAPI<VideoPost>('/videos', {
    method: 'POST',
    body: JSON.stringify(video),
  });
}

export async function updateVideo(id: string, video: Partial<VideoPost>) {
  return fetchAPI<VideoPost>(`/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(video),
  });
}

export async function deleteVideo(id: string) {
  return fetchAPI<void>(`/videos/${id}`, {
    method: 'DELETE',
  });
}

// Announcement API functions
export async function getAnnouncements() {
  return fetchAPI<Announcement[]>('/announcements');
}

export async function getAnnouncement(id: string) {
  return fetchAPI<Announcement>(`/announcements/${id}`);
}

export async function createAnnouncement(announcement: Partial<Announcement>) {
  return fetchAPI<Announcement>('/announcements', {
    method: 'POST',
    body: JSON.stringify(announcement),
  });
}

export async function updateAnnouncement(id: string, announcement: Partial<Announcement>) {
  return fetchAPI<Announcement>(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(announcement),
  });
}

export async function deleteAnnouncement(id: string) {
  return fetchAPI<void>(`/announcements/${id}`, {
    method: 'DELETE',
  });
}

// Student Government API functions
export async function getStudentGovPositions() {
  return fetchAPI<StudentGovPosition[]>('/student-gov-positions');
}

export async function getStudentGovPosition(id: string) {
  return fetchAPI<StudentGovPosition>(`/student-gov-positions/${id}`);
}

export async function createStudentGovPosition(position: Partial<StudentGovPosition>) {
  return fetchAPI<StudentGovPosition>('/student-gov-positions', {
    method: 'POST',
    body: JSON.stringify(position),
  });
}

export async function updateStudentGovPosition(id: string, position: Partial<StudentGovPosition>) {
  return fetchAPI<StudentGovPosition>(`/student-gov-positions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(position),
  });
}

export async function deleteStudentGovPosition(id: string) {
  return fetchAPI<void>(`/student-gov-positions/${id}`, {
    method: 'DELETE',
  });
}

// Club API functions
export async function getClubs() {
  return fetchAPI<Club[]>('/clubs');
}

export async function getClub(id: string) {
  return fetchAPI<Club>(`/clubs/${id}`);
}

export async function createClub(club: Partial<Club>) {
  return fetchAPI<Club>('/clubs', {
    method: 'POST',
    body: JSON.stringify(club),
  });
}

export async function updateClub(id: string, club: Partial<Club>) {
  return fetchAPI<Club>(`/clubs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(club),
  });
}

export async function deleteClub(id: string) {
  return fetchAPI<void>(`/clubs/${id}`, {
    method: 'DELETE',
  });
}

// Athletic API functions
export async function getAthletics() {
  return fetchAPI<Athletic[]>('/athletics');
}

export async function getAthletic(id: string) {
  return fetchAPI<Athletic>(`/athletics/${id}`);
}

export async function createAthletic(athletic: Partial<Athletic>) {
  return fetchAPI<Athletic>('/athletics', {
    method: 'POST',
    body: JSON.stringify(athletic),
  });
}

export async function updateAthletic(id: string, athletic: Partial<Athletic>) {
  return fetchAPI<Athletic>(`/athletics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(athletic),
  });
}

export async function deleteAthletic(id: string) {
  return fetchAPI<void>(`/athletics/${id}`, {
    method: 'DELETE',
  });
}

// Arts API functions
export async function getArts() {
  return fetchAPI<Art[]>('/arts');
}

export async function getArt(id: string) {
  return fetchAPI<Art>(`/arts/${id}`);
}

export async function createArt(art: Partial<Art>) {
  return fetchAPI<Art>('/arts', {
    method: 'POST',
    body: JSON.stringify(art),
  });
}

export async function updateArt(id: string, art: Partial<Art>) {
  return fetchAPI<Art>(`/arts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(art),
  });
}

export async function deleteArt(id: string) {
  return fetchAPI<void>(`/arts/${id}`, {
    method: 'DELETE',
  });
}

// Form Submission API functions
export async function getFormSubmissions() {
  return fetchAPI<FormSubmission[]>('/form-submissions');
}

export async function getFormSubmission(id: string) {
  return fetchAPI<FormSubmission>(`/form-submissions/${id}`);
}

export async function createFormSubmission(submission: Partial<FormSubmission>) {
  return fetchAPI<FormSubmission>('/form-submissions', {
    method: 'POST',
    body: JSON.stringify(submission),
  });
}

export async function updateFormSubmission(id: string, submission: Partial<FormSubmission>) {
  return fetchAPI<FormSubmission>(`/form-submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(submission),
  });
}

export async function deleteFormSubmission(id: string) {
  return fetchAPI<void>(`/form-submissions/${id}`, {
    method: 'DELETE',
  });
}

// Purchase API functions
export async function getPurchases() {
  return fetchAPI<Purchase[]>('/purchases');
}

export async function getPurchase(id: string) {
  return fetchAPI<Purchase>(`/purchases/${id}`);
}

export async function createPurchase(purchase: Partial<Purchase>) {
  return fetchAPI<Purchase>('/purchases', {
    method: 'POST',
    body: JSON.stringify(purchase),
  });
}

export async function updatePurchase(id: string, purchase: Partial<Purchase>) {
  return fetchAPI<Purchase>(`/purchases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(purchase),
  });
}

export async function deletePurchase(id: string) {
  return fetchAPI<void>(`/purchases/${id}`, {
    method: 'DELETE',
  });
}

// Type definitions that match our MongoDB schema
export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  organization: string;
  sizes: string[];
  colors: string[];
  image: string;
  description: string;
  stock: number;
  createdAt: Date;
}

export interface Event {
  _id: string;
  title: string;
  category: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  price: number;
  maxTickets?: number;
  features: string[];
  requiresApproval: boolean;
  image?: string;
  createdAt: Date;
}

export interface VideoPost {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  date: Date;
  author: string;
  category: string;
  views: number;
  featured: boolean;
  createdAt: Date;
}

export interface Announcement {
  _id: string;
  title: string;
  date: Date;
  content: string;
  priority: 'low' | 'medium' | 'high';
  author: string;
  createdAt: Date;
}

export interface StudentGovPosition {
  _id: string;
  position: string;
  gradeLevel: string;
  bio: string;
  responsibilities: string[];
  description: string;
  currentRepresentatives: {
    name: string;
    image?: string;
    bio?: string;
    email?: string;
  }[];
  createdAt: Date;
}

export interface Club {
  _id: string;
  name: string;
  description: string;
  advisor: string;
  meetingTime: string;
  location: string;
  category: string;
  contactEmail: string;
  image: string;
  memberCount: number;
  requirements: string[];
  activities: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Athletic {
  _id: string;
  sport: string;
  season: string;
  coach: string;
  assistantCoach?: string;
  practiceSchedule: string;
  homeVenue: string;
  description: string;
  image: string;
  rosterCount: number;
  achievements: string[];
  schedule: {
    opponent?: string;
    date?: Date;
    location?: string;
    isHome: boolean;
  }[];
  createdAt: Date;
}

export interface Art {
  _id: string;
  program: string;
  type: string;
  instructor: string;
  description: string;
  meetingTime: string;
  location: string;
  image: string;
  requirements: string[];
  showcaseInfo?: string;
  memberCount: number;
  createdAt: Date;
}

export interface FormSubmission {
  _id: string;
  eventId?: string;
  studentName: string;
  email: string;
  submissionDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  forms: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];
  quantity: number;
  totalAmount: number;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface Purchase {
  _id: string;
  studentName: string;
  studentEmail: string;
  productId?: string;
  productName: string;
  quantity: number;
  size?: string;
  color?: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: Date;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}
