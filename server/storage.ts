import {
  User,
  Product,
  Event,
  VideoPost,
  Announcement,
  StudentGovPosition,
  Club,
  FormSubmission,
  Purchase,
  type UserType,
  type ProductType,
  type EventType,
  type VideoPostType,
  type AnnouncementType,
  type StudentGovPositionType,
  type ClubType,
  type FormSubmissionType,
  type PurchaseType,
  connectDB
} from "@shared/mongodb-schema";

// MongoDB Storage Interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<UserType | null>;
  getUserByUsername(username: string): Promise<UserType | null>;
  createUser(user: Partial<UserType>): Promise<UserType>;
  
  // Product methods
  getProducts(): Promise<ProductType[]>;
  getProduct(id: string): Promise<ProductType | null>;
  createProduct(product: Partial<ProductType>): Promise<ProductType>;
  updateProduct(id: string, product: Partial<ProductType>): Promise<ProductType | null>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Event methods
  getEvents(): Promise<EventType[]>;
  getEvent(id: string): Promise<EventType | null>;
  createEvent(event: Partial<EventType>): Promise<EventType>;
  updateEvent(id: string, event: Partial<EventType>): Promise<EventType | null>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Video methods
  getVideos(): Promise<VideoPostType[]>;
  getVideo(id: string): Promise<VideoPostType | null>;
  createVideo(video: Partial<VideoPostType>): Promise<VideoPostType>;
  updateVideo(id: string, video: Partial<VideoPostType>): Promise<VideoPostType | null>;
  deleteVideo(id: string): Promise<boolean>;
  
  // Announcement methods
  getAnnouncements(): Promise<AnnouncementType[]>;
  getAnnouncement(id: string): Promise<AnnouncementType | null>;
  createAnnouncement(announcement: Partial<AnnouncementType>): Promise<AnnouncementType>;
  updateAnnouncement(id: string, announcement: Partial<AnnouncementType>): Promise<AnnouncementType | null>;
  deleteAnnouncement(id: string): Promise<boolean>;
  
  // Student Government methods
  getStudentGovPositions(): Promise<StudentGovPositionType[]>;
  getStudentGovPosition(id: string): Promise<StudentGovPositionType | null>;
  createStudentGovPosition(position: Partial<StudentGovPositionType>): Promise<StudentGovPositionType>;
  updateStudentGovPosition(id: string, position: Partial<StudentGovPositionType>): Promise<StudentGovPositionType | null>;
  deleteStudentGovPosition(id: string): Promise<boolean>;
  
  // Club methods
  getClubs(): Promise<ClubType[]>;
  getClub(id: string): Promise<ClubType | null>;
  createClub(club: Partial<ClubType>): Promise<ClubType>;
  updateClub(id: string, club: Partial<ClubType>): Promise<ClubType | null>;
  deleteClub(id: string): Promise<boolean>;
  
  
  // Form Submission methods
  getFormSubmissions(): Promise<FormSubmissionType[]>;
  getFormSubmission(id: string): Promise<FormSubmissionType | null>;
  createFormSubmission(submission: Partial<FormSubmissionType>): Promise<FormSubmissionType>;
  updateFormSubmission(id: string, submission: Partial<FormSubmissionType>): Promise<FormSubmissionType | null>;
  deleteFormSubmission(id: string): Promise<boolean>;
  
  // Purchase methods
  getPurchases(): Promise<PurchaseType[]>;
  getPurchase(id: string): Promise<PurchaseType | null>;
  getPurchaseByCloverOrderId(cloverOrderId: string): Promise<PurchaseType | null>;
  createPurchase(purchase: Partial<PurchaseType>): Promise<PurchaseType>;
  updatePurchase(id: string, purchase: Partial<PurchaseType>): Promise<PurchaseType | null>;
  deletePurchase(id: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  constructor() {
    // Connect to MongoDB when storage is initialized
    connectDB();
  }

  // User methods
  async getUser(id: string): Promise<UserType | null> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<UserType | null> {
    return await User.findOne({ username });
  }

  async createUser(user: Partial<UserType>): Promise<UserType> {
    const newUser = new User(user);
    return await newUser.save();
  }

  // Product methods
  async getProducts(): Promise<ProductType[]> {
    return await Product.find();
  }

  async getProduct(id: string): Promise<ProductType | null> {
    return await Product.findById(id);
  }

  async createProduct(product: Partial<ProductType>): Promise<ProductType> {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async updateProduct(id: string, product: Partial<ProductType>): Promise<ProductType | null> {
    return await Product.findByIdAndUpdate(id, product, { new: true });
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
  }

  // Event methods
  async getEvents(): Promise<EventType[]> {
    return await Event.find();
  }

  async getEvent(id: string): Promise<EventType | null> {
    return await Event.findById(id);
  }

  async createEvent(event: Partial<EventType>): Promise<EventType> {
    const newEvent = new Event(event);
    return await newEvent.save();
  }

  async updateEvent(id: string, event: Partial<EventType>): Promise<EventType | null> {
    return await Event.findByIdAndUpdate(id, event, { new: true });
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await Event.findByIdAndDelete(id);
    return result !== null;
  }

  // Video methods
  async getVideos(): Promise<VideoPostType[]> {
    return await VideoPost.find();
  }

  async getVideo(id: string): Promise<VideoPostType | null> {
    return await VideoPost.findById(id);
  }

  async createVideo(video: Partial<VideoPostType>): Promise<VideoPostType> {
    const newVideo = new VideoPost(video);
    return await newVideo.save();
  }

  async updateVideo(id: string, video: Partial<VideoPostType>): Promise<VideoPostType | null> {
    return await VideoPost.findByIdAndUpdate(id, video, { new: true });
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await VideoPost.findByIdAndDelete(id);
    return result !== null;
  }

  // Announcement methods
  async getAnnouncements(): Promise<AnnouncementType[]> {
    return await Announcement.find().sort({ date: -1 });
  }

  async getAnnouncement(id: string): Promise<AnnouncementType | null> {
    return await Announcement.findById(id);
  }

  async createAnnouncement(announcement: Partial<AnnouncementType>): Promise<AnnouncementType> {
    const newAnnouncement = new Announcement(announcement);
    return await newAnnouncement.save();
  }

  async updateAnnouncement(id: string, announcement: Partial<AnnouncementType>): Promise<AnnouncementType | null> {
    return await Announcement.findByIdAndUpdate(id, announcement, { new: true });
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await Announcement.findByIdAndDelete(id);
    return result !== null;
  }

  // Student Government methods
  async getStudentGovPositions(): Promise<StudentGovPositionType[]> {
    return await StudentGovPosition.find();
  }

  async getStudentGovPosition(id: string): Promise<StudentGovPositionType | null> {
    return await StudentGovPosition.findById(id);
  }

  async createStudentGovPosition(position: Partial<StudentGovPositionType>): Promise<StudentGovPositionType> {
    const newPosition = new StudentGovPosition(position);
    return await newPosition.save();
  }

  async updateStudentGovPosition(id: string, position: Partial<StudentGovPositionType>): Promise<StudentGovPositionType | null> {
    return await StudentGovPosition.findByIdAndUpdate(id, position, { new: true });
  }

  async deleteStudentGovPosition(id: string): Promise<boolean> {
    const result = await StudentGovPosition.findByIdAndDelete(id);
    return result !== null;
  }

  // Club methods
  async getClubs(): Promise<ClubType[]> {
    return await Club.find({ isActive: true });
  }

  async getClub(id: string): Promise<ClubType | null> {
    return await Club.findById(id);
  }

  async createClub(club: Partial<ClubType>): Promise<ClubType> {
    const newClub = new Club(club);
    return await newClub.save();
  }

  async updateClub(id: string, club: Partial<ClubType>): Promise<ClubType | null> {
    return await Club.findByIdAndUpdate(id, club, { new: true });
  }

  async deleteClub(id: string): Promise<boolean> {
    const result = await Club.findByIdAndDelete(id);
    return result !== null;
  }


  // Form Submission methods
  async getFormSubmissions(): Promise<FormSubmissionType[]> {
    return await FormSubmission.find().populate('eventId');
  }

  async getFormSubmission(id: string): Promise<FormSubmissionType | null> {
    return await FormSubmission.findById(id).populate('eventId');
  }

  async createFormSubmission(submission: Partial<FormSubmissionType>): Promise<FormSubmissionType> {
    const newSubmission = new FormSubmission(submission);
    return await newSubmission.save();
  }

  async updateFormSubmission(id: string, submission: Partial<FormSubmissionType>): Promise<FormSubmissionType | null> {
    return await FormSubmission.findByIdAndUpdate(id, submission, { new: true }).populate('eventId');
  }

  async deleteFormSubmission(id: string): Promise<boolean> {
    const result = await FormSubmission.findByIdAndDelete(id);
    return result !== null;
  }

  // Purchase methods
  async getPurchases(): Promise<PurchaseType[]> {
    return await Purchase.find().populate('productId');
  }

  async getPurchase(id: string): Promise<PurchaseType | null> {
    return await Purchase.findById(id).populate('productId');
  }

  async getPurchaseByCloverOrderId(cloverOrderId: string): Promise<PurchaseType | null> {
    return await Purchase.findOne({ cloverOrderId }).populate('productId');
  }

  async createPurchase(purchase: Partial<PurchaseType>): Promise<PurchaseType> {
    const newPurchase = new Purchase(purchase);
    return await newPurchase.save();
  }

  async updatePurchase(id: string, purchase: Partial<PurchaseType>): Promise<PurchaseType | null> {
    return await Purchase.findByIdAndUpdate(id, purchase, { new: true }).populate('productId');
  }

  async deletePurchase(id: string): Promise<boolean> {
    const result = await Purchase.findByIdAndDelete(id);
    return result !== null;
  }
}

export const storage = new MongoStorage();
