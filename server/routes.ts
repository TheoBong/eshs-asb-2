import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from 'express';
import {
  User, Product, Event, VideoPost, Announcement,
  StudentGovPosition, Club, FormSubmission, Purchase, File
} from '../shared/mongodb-schema';
import { connectWithRetry as connectDB } from './mongo-utils';
import { requireAdminAuth, handleAdminLogin, handleAdminLogout, checkAdminAuth } from './auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { emailService } from './email-service';

// Ensure upload directory exists
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for disk storage
const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      const filename = `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedMimes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// Create router
export const router = express.Router();

// Connect to MongoDB
connectDB().catch(console.error);

// General error handler
const handleError = (res: express.Response, error: any) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadDir));

  // Authentication routes
  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/check-auth", checkAdminAuth);

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  });

  app.get("/api/users/username/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error });
    }
  });

  app.post("/api/products", requireAdminAuth, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Error creating product", error });
    }
  });

  app.put("/api/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Error updating product", error });
    }
  });

  app.delete("/api/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events", error });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event", error });
    }
  });

  app.post("/api/events", requireAdminAuth, async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Error creating event", error });
    }
  });

  app.put("/api/events/:id", requireAdminAuth, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Error updating event", error });
    }
  });

  app.delete("/api/events/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  });

  // Video routes
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos", error });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Error fetching video", error });
    }
  });

  app.post("/api/videos", requireAdminAuth, async (req, res) => {
    try {
      const video = await storage.createVideo(req.body);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Error creating video", error });
    }
  });

  app.put("/api/videos/:id", requireAdminAuth, async (req, res) => {
    try {
      const video = await storage.updateVideo(req.params.id, req.body);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: "Error updating video", error });
    }
  });

  app.delete("/api/videos/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteVideo(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting video", error });
    }
  });

  // Announcement routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching announcements", error });
    }
  });

  app.get("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.getAnnouncement(req.params.id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: "Error fetching announcement", error });
    }
  });

  app.post("/api/announcements", requireAdminAuth, async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement(req.body);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Error creating announcement", error });
    }
  });

  app.put("/api/announcements/:id", requireAdminAuth, async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Error updating announcement", error });
    }
  });

  app.delete("/api/announcements/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteAnnouncement(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting announcement", error });
    }
  });

  // Student Government Position routes
  app.get("/api/student-gov-positions", async (req, res) => {
    try {
      const positions = await storage.getStudentGovPositions();
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student government positions", error });
    }
  });

  app.get("/api/student-gov-positions/:id", async (req, res) => {
    try {
      const position = await storage.getStudentGovPosition(req.params.id);
      if (!position) {
        return res.status(404).json({ message: "Student government position not found" });
      }
      res.json(position);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student government position", error });
    }
  });

  app.post("/api/student-gov-positions", requireAdminAuth, async (req, res) => {
    try {
      const position = await storage.createStudentGovPosition(req.body);
      res.status(201).json(position);
    } catch (error) {
      res.status(400).json({ message: "Error creating student government position", error });
    }
  });

  app.put("/api/student-gov-positions/:id", requireAdminAuth, async (req, res) => {
    try {
      const position = await storage.updateStudentGovPosition(req.params.id, req.body);
      if (!position) {
        return res.status(404).json({ message: "Student government position not found" });
      }
      res.json(position);
    } catch (error) {
      res.status(400).json({ message: "Error updating student government position", error });
    }
  });

  app.delete("/api/student-gov-positions/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteStudentGovPosition(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Student government position not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting student government position", error });
    }
  });

  // Club routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubs = await storage.getClubs();
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clubs", error });
    }
  });

  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.getClub(req.params.id);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      res.status(500).json({ message: "Error fetching club", error });
    }
  });

  app.post("/api/clubs", requireAdminAuth, async (req, res) => {
    try {
      const club = await storage.createClub(req.body);
      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ message: "Error creating club", error });
    }
  });

  app.put("/api/clubs/:id", requireAdminAuth, async (req, res) => {
    try {
      const club = await storage.updateClub(req.params.id, req.body);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      res.status(400).json({ message: "Error updating club", error });
    }
  });

  app.delete("/api/clubs/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteClub(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Club not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting club", error });
    }
  });



  // Form Submission routes
  app.get("/api/form-submissions", async (req, res) => {
    try {
      const submissions = await storage.getFormSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching form submissions", error });
    }
  });

  app.get("/api/form-submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getFormSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Form submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Error fetching form submission", error });
    }
  });

  app.post("/api/form-submissions", async (req, res) => {
    try {
      const submission = await storage.createFormSubmission(req.body);
      
      // Send email notification to admin
      try {
        // Get event details
        const event = await storage.getEvent(submission.eventId.toString());
        
        // Prepare attachments if forms are included
        const attachments = [];
        if (submission.forms && submission.forms.length > 0) {
          for (const form of submission.forms) {
            // Read file from disk if it exists
            const filePath = path.join(__dirname, '..', form.fileUrl);
            if (fs.existsSync(filePath)) {
              const fileContent = fs.readFileSync(filePath);
              attachments.push({
                filename: form.fileName,
                content: fileContent,
                contentType: form.fileType
              });
            }
          }
        }
        
        // Prepare email data
        const emailData = {
          eventName: event?.title || 'Unknown Event',
          studentName: submission.studentName,
          email: submission.email,
          submissionDate: submission.submissionDate,
          quantity: submission.quantity || 1,
          totalAmount: submission.totalAmount || 0,
          notes: submission.notes,
          forms: submission.forms
        };
        
        // Send notification to admin
        await emailService.sendFormSubmissionNotification(emailData, attachments);
        
        // Send receipt to student with the same attachments
        await emailService.sendFormSubmissionReceipt(
          submission.email,
          emailData,
          attachments
        );
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Error creating form submission", error });
    }
  });

  app.post('/api/form-submissions/upload', upload.array('forms'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      // Create file URLs
      const fileDetails = files.map(file => ({
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype
      }));
      
      res.status(201).json(fileDetails);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.put("/api/form-submissions/:id", requireAdminAuth, async (req, res) => {
    try {
      // Get the original submission to check status change
      const originalSubmission = await storage.getFormSubmission(req.params.id);
      
      const submission = await storage.updateFormSubmission(req.params.id, req.body);
      if (!submission) {
        return res.status(404).json({ message: "Form submission not found" });
      }
      
      // Send email if status changed from pending to approved/rejected
      if (originalSubmission?.status === 'pending' && submission.status !== 'pending') {
        try {
          // Get event details
          const event = await storage.getEvent(submission.eventId.toString());
          
          if (submission.status === 'approved') {
            // Send approval email
            await emailService.sendApprovalNotification(submission.email, {
              eventName: event?.title || 'Unknown Event',
              studentName: submission.studentName,
              ticketPurchaseUrl: `https://eshs-asb.edu/activities/purchase/${submission.eventId}`, // Placeholder URL
              quantity: submission.quantity || 1,
              totalAmount: submission.totalAmount || 0
            });
          } else if (submission.status === 'rejected') {
            // Send rejection email
            const reason = req.body.rejectionReason || 'Your request did not meet the requirements. Please review the guidelines and try again.';
            await emailService.sendRejectionNotification(submission.email, {
              eventName: event?.title || 'Unknown Event',
              studentName: submission.studentName,
              reason: reason,
              retryUrl: `https://eshs-asb.edu/activities/details/${submission.eventId}` // Placeholder URL
            });
          }
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
          // Don't fail the request if email fails
        }
      }
      
      res.json(submission);
    } catch (error) {
      res.status(400).json({ message: "Error updating form submission", error });
    }
  });

  app.delete("/api/form-submissions/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteFormSubmission(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Form submission not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting form submission", error });
    }
  });

  // Purchase routes
  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching purchases", error });
    }
  });

  app.get("/api/purchases/:id", async (req, res) => {
    try {
      const purchase = await storage.getPurchase(req.params.id);
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      res.json(purchase);
    } catch (error) {
      res.status(500).json({ message: "Error fetching purchase", error });
    }
  });

  app.post("/api/purchases", async (req, res) => {
    try {
      const purchase = await storage.createPurchase(req.body);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(400).json({ message: "Error creating purchase", error });
    }
  });

  app.put("/api/purchases/:id", requireAdminAuth, async (req, res) => {
    try {
      const purchase = await storage.updatePurchase(req.params.id, req.body);
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      res.json(purchase);
    } catch (error) {
      res.status(400).json({ message: "Error updating purchase", error });
    }
  });

  app.delete("/api/purchases/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deletePurchase(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting purchase", error });
    }
  });

  // File upload endpoints
  // Simple test endpoint to verify upload route is working
  app.get("/api/upload-test", (req, res) => {
    res.json({ message: "Upload endpoint is accessible", timestamp: new Date().toISOString() });
  });

  app.post("/api/upload", (req, res, next) => {
    console.log('Upload request headers:', req.headers);
    console.log('Content-Length:', req.headers['content-length']);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    // Set a timeout for the upload request
    req.setTimeout(60000, () => {
      console.log('Upload request timed out');
      if (!res.headersSent) {
        res.status(408).json({ message: "Upload timed out" });
      }
    });
    
    next();
  }, requireAdminAuth, (req, res, next) => {
    console.log('Auth check passed, proceeding to multer');
    next();
  }, (req, res, next) => {
    console.log('About to call multer');
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ 
            message: "File too large", 
            maxSize: "50MB",
            error: err.message 
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ 
            message: "Unexpected file field", 
            error: err.message 
          });
        }
        return res.status(400).json({ 
          message: "Upload error", 
          error: err.message 
        });
      }
      console.log('Multer completed successfully');
      next();
    });
  }, async (req, res) => {
    try {
      console.log('Upload request received');
      console.log('Body size:', JSON.stringify(req.body).length);
      
      if (!req.file) {
        console.log('No file in request');
        console.log('Request files:', req.files);
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { originalname, mimetype, size, filename, path: filePath } = req.file;
      console.log(`Processing file: ${originalname}, size: ${size}, type: ${mimetype}, saved as: ${filename}`);
      
      console.log('Saving metadata to database...');
      // Save file metadata to database (not the file data itself)
      const file = new File({
        filename,
        originalName: originalname,
        mimeType: mimetype,
        size,
        data: filePath // Store file path instead of base64 data
      });

      const savedFile = await file.save();
      console.log('File metadata saved successfully');
      
      res.json({
        id: savedFile._id,
        filename: savedFile.filename,
        originalName: savedFile.originalName,
        mimeType: savedFile.mimeType,
        size: savedFile.size,
        url: `/api/files/${savedFile._id}`,
        uploadedAt: savedFile.uploadedAt
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: "Error uploading file", error: error.message });
    }
  });

  // File serving endpoint
  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check if file exists on disk
      const filePath = file.data; // data field now contains file path
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Physical file not found" });
      }
      
      // Set appropriate headers
      res.set({
        'Content-Type': file.mimeType,
        'Content-Disposition': `inline; filename="${file.originalName}"`
      });
      
      // Stream the file from disk
      res.sendFile(path.resolve(filePath));
    } catch (error) {
      console.error('File serving error:', error);
      res.status(500).json({ message: "Error serving file", error: error.message });
    }
  });

  // File deletion endpoint
  app.delete("/api/files/:id", requireAdminAuth, async (req, res) => {
    try {
      const file = await File.findByIdAndDelete(req.params.id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('File deletion error:', error);
      res.status(500).json({ message: "Error deleting file", error: error.message });
    }
  });

  // Email test endpoint (admin only)
  app.post("/api/test-email", requireAdminAuth, async (req, res) => {
    try {
      const { to, type = 'test' } = req.body;
      
      if (!to) {
        return res.status(400).json({ message: "Email address is required" });
      }

      switch (type) {
        case 'test':
          await emailService.sendTestEmail(to);
          break;
        case 'approval':
          await emailService.sendApprovalNotification(to, {
            eventName: 'Test Event',
            studentName: 'Test Student',
            ticketPurchaseUrl: 'https://eshsasb.org/activities/purchase/test',
            quantity: 1,
            totalAmount: 10.00
          });
          break;
        case 'rejection':
          await emailService.sendRejectionNotification(to, {
            eventName: 'Test Event',
            studentName: 'Test Student',
            reason: 'This is a test rejection email.',
            retryUrl: 'https://eshsasb.org/activities/details/test'
          });
          break;
        case 'submission':
          await emailService.sendFormSubmissionNotification({
            eventName: 'Test Event',
            studentName: 'Test Student',
            email: to,
            submissionDate: new Date(),
            quantity: 1,
            totalAmount: 10.00,
            notes: 'This is a test submission notification.',
            forms: [{ fileName: 'test-form.pdf', fileUrl: '/test', fileType: 'application/pdf' }]
          });
          break;
        case 'receipt':
          await emailService.sendFormSubmissionReceipt(to, {
            eventName: 'Test Event',
            studentName: 'Test Student',
            email: to,
            submissionDate: new Date(),
            quantity: 1,
            totalAmount: 10.00,
            notes: 'This is a test receipt email.',
            forms: [{ fileName: 'test-form.pdf', fileUrl: '/test', fileType: 'application/pdf' }]
          });
          break;
        default:
          return res.status(400).json({ message: "Invalid email type" });
      }

      res.json({ message: `${type} email sent successfully to ${to}` });
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({ message: "Error sending test email", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
