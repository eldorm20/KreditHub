import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, uuid, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export type UserType = 'smb' | 'fi' | 'admin';
export type ApplicationStatus = 'pending' | 'under_review' | 'offer_sent' | 'accepted' | 'rejected';
export type OfferStatus = 'pending_acceptance' | 'accepted' | 'rejected_by_smb';
export type LoanType = 'working_capital' | 'equipment_purchase' | 'investment' | 'other';
export type LegalForm = 'llc' | 'individual_entrepreneur' | 'joint_stock' | 'other';

// Sessions table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  userType: varchar("user_type", { length: 20 }).notNull().$type<UserType>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMB Profiles
export const smbProfiles = pgTable("smb_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  tin: varchar("tin", { length: 50 }).notNull(),
  legalForm: varchar("legal_form", { length: 50 }).notNull().$type<LegalForm>(),
  legalAddress: text("legal_address").notNull(),
  contactPerson: varchar("contact_person", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  industrySector: varchar("industry_sector", { length: 100 }).notNull(),
  numEmployees: integer("num_employees").notNull(),
  annualRevenue: varchar("annual_revenue", { length: 50 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  documentsUrls: jsonb("documents_urls").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FI Profiles
export const fiProfiles = pgTable("fi_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  institutionName: varchar("institution_name", { length: 200 }).notNull(),
  contactPerson: varchar("contact_person", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }),
  loanTypesOffered: jsonb("loan_types_offered").$type<LoanType[]>().default([]),
  websiteUrl: varchar("website_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Applications
export const loanApplications = pgTable("loan_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  smbId: uuid("smb_id").references(() => smbProfiles.id).notNull(),
  loanAmountRequested: decimal("loan_amount_requested", { precision: 15, scale: 2 }).notNull(),
  loanPurpose: text("loan_purpose").notNull(),
  repaymentPeriodRequested: integer("repayment_period_requested").notNull(),
  loanType: varchar("loan_type", { length: 50 }).notNull().$type<LoanType>(),
  applicationStatus: varchar("application_status", { length: 20 }).notNull().$type<ApplicationStatus>(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow(),
  supportingDocuments: jsonb("supporting_documents").$type<string[]>().default([]),
});

// Loan Offers
export const loanOffers = pgTable("loan_offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  loanApplicationId: uuid("loan_application_id").references(() => loanApplications.id).notNull(),
  fiId: uuid("fi_id").references(() => fiProfiles.id).notNull(),
  offeredAmount: decimal("offered_amount", { precision: 15, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  repaymentPeriodOffered: integer("repayment_period_offered").notNull(),
  offerConditions: text("offer_conditions"),
  offerStatus: varchar("offer_status", { length: 20 }).notNull().$type<OfferStatus>(),
  offeredAt: timestamp("offered_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  receiverId: uuid("receiver_id").references(() => users.id).notNull(),
  loanApplicationId: uuid("loan_application_id").references(() => loanApplications.id),
  messageContent: text("message_content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

// Currencies
export const currencies = pgTable("currencies", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currencyCode: varchar("currency_code", { length: 3 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  smbProfile: one(smbProfiles),
  fiProfile: one(fiProfiles),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  transactions: many(transactions),
}));

export const smbProfilesRelations = relations(smbProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [smbProfiles.userId],
    references: [users.id],
  }),
  loanApplications: many(loanApplications),
}));

export const fiProfilesRelations = relations(fiProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [fiProfiles.userId],
    references: [users.id],
  }),
  loanOffers: many(loanOffers),
}));

export const loanApplicationsRelations = relations(loanApplications, ({ one, many }) => ({
  smbProfile: one(smbProfiles, {
    fields: [loanApplications.smbId],
    references: [smbProfiles.id],
  }),
  loanOffers: many(loanOffers),
  messages: many(messages),
}));

export const loanOffersRelations = relations(loanOffers, ({ one }) => ({
  loanApplication: one(loanApplications, {
    fields: [loanOffers.loanApplicationId],
    references: [loanApplications.id],
  }),
  fiProfile: one(fiProfiles, {
    fields: [loanOffers.fiId],
    references: [fiProfiles.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  loanApplication: one(loanApplications, {
    fields: [messages.loanApplicationId],
    references: [loanApplications.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SMBProfile = typeof smbProfiles.$inferSelect;
export type InsertSMBProfile = typeof smbProfiles.$inferInsert;
export type FIProfile = typeof fiProfiles.$inferSelect;
export type InsertFIProfile = typeof fiProfiles.$inferInsert;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = typeof loanApplications.$inferInsert;
export type LoanOffer = typeof loanOffers.$inferSelect;
export type InsertLoanOffer = typeof loanOffers.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Currency = typeof currencies.$inferSelect;
export type InsertCurrency = typeof currencies.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSMBProfileSchema = createInsertSchema(smbProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFIProfileSchema = createInsertSchema(fiProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  submittedAt: true,
  lastUpdatedAt: true,
});

export const insertLoanOfferSchema = createInsertSchema(loanOffers).omit({
  id: true,
  offeredAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertSMBProfileType = z.infer<typeof insertSMBProfileSchema>;
export type InsertFIProfileType = z.infer<typeof insertFIProfileSchema>;
export type InsertLoanApplicationType = z.infer<typeof insertLoanApplicationSchema>;
export type InsertLoanOfferType = z.infer<typeof insertLoanOfferSchema>;
export type InsertMessageType = z.infer<typeof insertMessageSchema>;