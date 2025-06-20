import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertSMBProfileSchema, 
  insertFIProfileSchema, 
  insertLoanApplicationSchema, 
  insertLoanOfferSchema, 
  insertMessageSchema,
  insertTransactionSchema,
  insertCurrencySchema
} from "@shared/schema";
import type { Express } from "express";

// WebSocket connections for real-time messaging
const connections = new Map<string, { ws: WebSocket; userId?: string }>();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User Management Routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // SMB Profile Routes
  app.post("/api/smb-profiles", async (req, res) => {
    try {
      const profileData = insertSMBProfileSchema.parse(req.body);
      const profile = await storage.createSMBProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/smb-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getSMBProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "SMB profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/smb-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.updateSMBProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // FI Profile Routes
  app.post("/api/fi-profiles", async (req, res) => {
    try {
      const profileData = insertFIProfileSchema.parse(req.body);
      const profile = await storage.createFIProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/fi-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getFIProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "FI profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/fi-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.updateFIProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Loan Application Routes
  app.post("/api/loan-applications", async (req, res) => {
    try {
      const applicationData = insertLoanApplicationSchema.parse(req.body);
      const application = await storage.createLoanApplication(applicationData);
      res.json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/loan-applications", async (req, res) => {
    try {
      const { smbId } = req.query;
      const applications = await storage.getLoanApplications(smbId as string);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/loan-applications/:id", async (req, res) => {
    try {
      const application = await storage.getLoanApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/loan-applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateLoanApplicationStatus(req.params.id, status);
      res.json({ message: "Application status updated" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Loan Offer Routes
  app.post("/api/loan-offers", async (req, res) => {
    try {
      const offerData = insertLoanOfferSchema.parse(req.body);
      const offer = await storage.createLoanOffer(offerData);
      res.json(offer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/loan-offers", async (req, res) => {
    try {
      const { applicationId, fiId } = req.query;
      let offers;
      if (applicationId) {
        offers = await storage.getLoanOffers(applicationId as string);
      } else if (fiId) {
        offers = await storage.getLoanOffersByFI(fiId as string);
      } else {
        return res.status(400).json({ message: "applicationId or fiId required" });
      }
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/loan-offers/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateLoanOfferStatus(req.params.id, status);
      res.json({ message: "Offer status updated" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Message Routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Broadcast to connected users
      broadcastMessage(message);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/conversations/:userId/:otherUserId", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.userId, req.params.otherUserId);
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.id);
      res.json({ message: "Message marked as read" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Currency Routes
  app.get("/api/currencies", async (req, res) => {
    try {
      const currencies = await storage.getCurrencies();
      res.json(currencies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/currencies/:code", async (req, res) => {
    try {
      const { rate } = req.body;
      await storage.updateCurrencyRate(req.params.code, rate);
      res.json({ message: "Currency rate updated" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Transaction Routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(req.params.userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  // WebSocket Setup for Real-time Messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const connectionId = Math.random().toString(36).substring(7);
    connections.set(connectionId, { ws });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          const connection = connections.get(connectionId);
          if (connection) {
            connection.userId = message.userId;
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      connections.delete(connectionId);
    });
  });

  function broadcastMessage(message: any) {
    connections.forEach((connection) => {
      if (connection.ws.readyState === WebSocket.OPEN) {
        if (connection.userId === message.receiverId || connection.userId === message.senderId) {
          connection.ws.send(JSON.stringify({
            type: 'new_message',
            message
          }));
        }
      }
    });
  }

  return httpServer;
}