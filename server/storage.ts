import { 
  users, type User, type InsertUser,
  smbProfiles, type SMBProfile, type InsertSMBProfile,
  fiProfiles, type FIProfile, type InsertFIProfile,
  loanApplications, type LoanApplication, type InsertLoanApplication,
  loanOffers, type LoanOffer, type InsertLoanOffer,
  messages, type Message, type InsertMessage,
  currencies, type Currency, type InsertCurrency,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // SMB Profile operations
  getSMBProfile(userId: string): Promise<SMBProfile | undefined>;
  createSMBProfile(profile: InsertSMBProfile): Promise<SMBProfile>;
  updateSMBProfile(id: string, profile: Partial<SMBProfile>): Promise<SMBProfile>;
  
  // FI Profile operations
  getFIProfile(userId: string): Promise<FIProfile | undefined>;
  createFIProfile(profile: InsertFIProfile): Promise<FIProfile>;
  updateFIProfile(id: string, profile: Partial<FIProfile>): Promise<FIProfile>;
  
  // Loan Application operations
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplications(smbId?: string): Promise<LoanApplication[]>;
  getLoanApplication(id: string): Promise<LoanApplication | undefined>;
  updateLoanApplicationStatus(id: string, status: string): Promise<void>;
  
  // Loan Offer operations
  createLoanOffer(offer: InsertLoanOffer): Promise<LoanOffer>;
  getLoanOffers(applicationId: string): Promise<LoanOffer[]>;
  getLoanOffersByFI(fiId: string): Promise<LoanOffer[]>;
  updateLoanOfferStatus(id: string, status: string): Promise<void>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(userId: string): Promise<Message[]>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // Currency operations
  getCurrencies(): Promise<Currency[]>;
  updateCurrencyRate(code: string, rate: number): Promise<void>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(userId: string): Promise<Transaction[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async getSMBProfile(userId: string): Promise<SMBProfile | undefined> {
    const [profile] = await db.select().from(smbProfiles).where(eq(smbProfiles.userId, userId));
    return profile;
  }

  async createSMBProfile(profileData: InsertSMBProfile): Promise<SMBProfile> {
    const [profile] = await db
      .insert(smbProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateSMBProfile(id: string, profileData: Partial<SMBProfile>): Promise<SMBProfile> {
    const [profile] = await db
      .update(smbProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(smbProfiles.id, id))
      .returning();
    return profile;
  }

  async getFIProfile(userId: string): Promise<FIProfile | undefined> {
    const [profile] = await db.select().from(fiProfiles).where(eq(fiProfiles.userId, userId));
    return profile;
  }

  async createFIProfile(profileData: InsertFIProfile): Promise<FIProfile> {
    const [profile] = await db
      .insert(fiProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateFIProfile(id: string, profileData: Partial<FIProfile>): Promise<FIProfile> {
    const [profile] = await db
      .update(fiProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(fiProfiles.id, id))
      .returning();
    return profile;
  }

  async createLoanApplication(applicationData: InsertLoanApplication): Promise<LoanApplication> {
    const [application] = await db
      .insert(loanApplications)
      .values(applicationData)
      .returning();
    return application;
  }

  async getLoanApplications(smbId?: string): Promise<LoanApplication[]> {
    if (smbId) {
      return await db.select().from(loanApplications).where(eq(loanApplications.smbId, smbId));
    }
    return await db.select().from(loanApplications);
  }

  async getLoanApplication(id: string): Promise<LoanApplication | undefined> {
    const [application] = await db.select().from(loanApplications).where(eq(loanApplications.id, id));
    return application;
  }

  async updateLoanApplicationStatus(id: string, status: string): Promise<void> {
    await db
      .update(loanApplications)
      .set({ applicationStatus: status as any, lastUpdatedAt: new Date() })
      .where(eq(loanApplications.id, id));
  }

  async createLoanOffer(offerData: InsertLoanOffer): Promise<LoanOffer> {
    const [offer] = await db
      .insert(loanOffers)
      .values(offerData)
      .returning();
    return offer;
  }

  async getLoanOffers(applicationId: string): Promise<LoanOffer[]> {
    return await db.select().from(loanOffers).where(eq(loanOffers.loanApplicationId, applicationId));
  }

  async getLoanOffersByFI(fiId: string): Promise<LoanOffer[]> {
    return await db.select().from(loanOffers).where(eq(loanOffers.fiId, fiId));
  }

  async updateLoanOfferStatus(id: string, status: string): Promise<void> {
    await db
      .update(loanOffers)
      .set({ offerStatus: status as any })
      .where(eq(loanOffers.id, id));
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async getMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.sentAt));
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.sentAt);
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  async getCurrencies(): Promise<Currency[]> {
    return await db.select().from(currencies);
  }

  async updateCurrencyRate(code: string, rate: number): Promise<void> {
    await db
      .update(currencies)
      .set({ exchangeRate: rate.toString(), lastUpdated: new Date() })
      .where(eq(currencies.code, code));
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }
}

export const storage = new DatabaseStorage();