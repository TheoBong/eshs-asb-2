import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.post("/api/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Error creating product", error });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
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

  app.delete("/api/products/:id", async (req, res) => {
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

  app.post("/api/events", async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Error creating event", error });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
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

  app.delete("/api/events/:id", async (req, res) => {
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

  app.post("/api/videos", async (req, res) => {
    try {
      const video = await storage.createVideo(req.body);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Error creating video", error });
    }
  });

  app.put("/api/videos/:id", async (req, res) => {
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

  app.delete("/api/videos/:id", async (req, res) => {
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

  app.post("/api/announcements", async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement(req.body);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Error creating announcement", error });
    }
  });

  app.put("/api/announcements/:id", async (req, res) => {
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

  app.delete("/api/announcements/:id", async (req, res) => {
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

  app.post("/api/student-gov-positions", async (req, res) => {
    try {
      const position = await storage.createStudentGovPosition(req.body);
      res.status(201).json(position);
    } catch (error) {
      res.status(400).json({ message: "Error creating student government position", error });
    }
  });

  app.put("/api/student-gov-positions/:id", async (req, res) => {
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

  app.delete("/api/student-gov-positions/:id", async (req, res) => {
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

  app.post("/api/clubs", async (req, res) => {
    try {
      const club = await storage.createClub(req.body);
      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ message: "Error creating club", error });
    }
  });

  app.put("/api/clubs/:id", async (req, res) => {
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

  app.delete("/api/clubs/:id", async (req, res) => {
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

  // Athletic routes
  app.get("/api/athletics", async (req, res) => {
    try {
      const athletics = await storage.getAthletics();
      res.json(athletics);
    } catch (error) {
      res.status(500).json({ message: "Error fetching athletics", error });
    }
  });

  app.get("/api/athletics/:id", async (req, res) => {
    try {
      const athletic = await storage.getAthletic(req.params.id);
      if (!athletic) {
        return res.status(404).json({ message: "Athletic program not found" });
      }
      res.json(athletic);
    } catch (error) {
      res.status(500).json({ message: "Error fetching athletic program", error });
    }
  });

  app.post("/api/athletics", async (req, res) => {
    try {
      const athletic = await storage.createAthletic(req.body);
      res.status(201).json(athletic);
    } catch (error) {
      res.status(400).json({ message: "Error creating athletic program", error });
    }
  });

  app.put("/api/athletics/:id", async (req, res) => {
    try {
      const athletic = await storage.updateAthletic(req.params.id, req.body);
      if (!athletic) {
        return res.status(404).json({ message: "Athletic program not found" });
      }
      res.json(athletic);
    } catch (error) {
      res.status(400).json({ message: "Error updating athletic program", error });
    }
  });

  app.delete("/api/athletics/:id", async (req, res) => {
    try {
      const success = await storage.deleteAthletic(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Athletic program not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting athletic program", error });
    }
  });

  // Arts routes
  app.get("/api/arts", async (req, res) => {
    try {
      const arts = await storage.getArts();
      res.json(arts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching arts programs", error });
    }
  });

  app.get("/api/arts/:id", async (req, res) => {
    try {
      const art = await storage.getArt(req.params.id);
      if (!art) {
        return res.status(404).json({ message: "Arts program not found" });
      }
      res.json(art);
    } catch (error) {
      res.status(500).json({ message: "Error fetching arts program", error });
    }
  });

  app.post("/api/arts", async (req, res) => {
    try {
      const art = await storage.createArt(req.body);
      res.status(201).json(art);
    } catch (error) {
      res.status(400).json({ message: "Error creating arts program", error });
    }
  });

  app.put("/api/arts/:id", async (req, res) => {
    try {
      const art = await storage.updateArt(req.params.id, req.body);
      if (!art) {
        return res.status(404).json({ message: "Arts program not found" });
      }
      res.json(art);
    } catch (error) {
      res.status(400).json({ message: "Error updating arts program", error });
    }
  });

  app.delete("/api/arts/:id", async (req, res) => {
    try {
      const success = await storage.deleteArt(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Arts program not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting arts program", error });
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
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Error creating form submission", error });
    }
  });

  app.put("/api/form-submissions/:id", async (req, res) => {
    try {
      const submission = await storage.updateFormSubmission(req.params.id, req.body);
      if (!submission) {
        return res.status(404).json({ message: "Form submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(400).json({ message: "Error updating form submission", error });
    }
  });

  app.delete("/api/form-submissions/:id", async (req, res) => {
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

  app.put("/api/purchases/:id", async (req, res) => {
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

  app.delete("/api/purchases/:id", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
