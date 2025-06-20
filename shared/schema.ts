import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  department: varchar("department", { length: 50 }),
  avatarUrl: text("avatar_url"),
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0),
  bestStreak: integer("best_streak").default(0),
  questionsAnswered: integer("questions_answered").default(0),
  culturesExplored: integer("cultures_explored").default(0),
  gamesPlayed: integer("games_played").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cultures = pgTable("cultures", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  region: varchar("region", { length: 50 }),
  description: text("description"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 50 }),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  cultureId: integer("culture_id").references(() => cultures.id),
  categoryId: integer("category_id").references(() => categories.id),
  questionText: text("question_text").notNull(),
  correctAnswer: varchar("correct_answer", { length: 200 }).notNull(),
  options: jsonb("options").notNull(), // Array of answer options
  explanation: text("explanation"),
  difficulty: varchar("difficulty", { length: 10 }).notNull(), // easy, medium, hard
  imageUrl: text("image_url"),
  points: integer("points").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostUserId: uuid("host_user_id").references(() => users.id),
  mode: varchar("mode", { length: 20 }).notNull(), // quick, deepdive, team
  status: varchar("status", { length: 20 }).default("waiting"), // waiting, active, completed
  totalQuestions: integer("total_questions").default(10),
  timePerQuestion: integer("time_per_question").default(30), // seconds
  maxPlayers: integer("max_players").default(1),
  currentQuestion: integer("current_question").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameParticipants = pgTable("game_participants", {
  id: serial("id").primaryKey(),
  gameId: uuid("game_id").references(() => games.id),
  userId: uuid("user_id").references(() => users.id),
  score: integer("score").default(0),
  correctAnswers: integer("correct_answers").default(0),
  questionsAnswered: integer("questions_answered").default(0),
  joinedAt: timestamp("joined_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const gameQuestions = pgTable("game_questions", {
  id: serial("id").primaryKey(),
  gameId: uuid("game_id").references(() => games.id),
  questionId: integer("question_id").references(() => questions.id),
  orderIndex: integer("order_index").notNull(),
  timeLimit: integer("time_limit").default(30),
});

export const gameAnswers = pgTable("game_answers", {
  id: serial("id").primaryKey(),
  gameId: uuid("game_id").references(() => games.id),
  userId: uuid("user_id").references(() => users.id),
  questionId: integer("question_id").references(() => questions.id),
  selectedAnswer: varchar("selected_answer", { length: 200 }),
  isCorrect: boolean("is_correct").default(false),
  timeSpent: integer("time_spent"), // seconds
  pointsEarned: integer("points_earned").default(0),
  answeredAt: timestamp("answered_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 50 }),
  condition: jsonb("condition"), // Achievement criteria
  points: integer("points").default(0),
  rarity: varchar("rarity", { length: 20 }).default("common"), // common, rare, epic, legendary
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gameParticipants: many(gameParticipants),
  gameAnswers: many(gameAnswers),
  userAchievements: many(userAchievements),
  hostedGames: many(games),
}));

export const culturesRelations = relations(cultures, ({ many }) => ({
  questions: many(questions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  culture: one(cultures, {
    fields: [questions.cultureId],
    references: [cultures.id],
  }),
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
  gameQuestions: many(gameQuestions),
  gameAnswers: many(gameAnswers),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  host: one(users, {
    fields: [games.hostUserId],
    references: [users.id],
  }),
  participants: many(gameParticipants),
  questions: many(gameQuestions),
  answers: many(gameAnswers),
}));

export const gameParticipantsRelations = relations(gameParticipants, ({ one }) => ({
  game: one(games, {
    fields: [gameParticipants.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [gameParticipants.userId],
    references: [users.id],
  }),
}));

export const gameQuestionsRelations = relations(gameQuestions, ({ one }) => ({
  game: one(games, {
    fields: [gameQuestions.gameId],
    references: [games.id],
  }),
  question: one(questions, {
    fields: [gameQuestions.questionId],
    references: [questions.id],
  }),
}));

export const gameAnswersRelations = relations(gameAnswers, ({ one }) => ({
  game: one(games, {
    fields: [gameAnswers.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [gameAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [gameAnswers.questionId],
    references: [questions.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
});

export const insertGameParticipantSchema = createInsertSchema(gameParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertGameAnswerSchema = createInsertSchema(gameAnswers).omit({
  id: true,
  answeredAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Culture = typeof cultures.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GameParticipant = typeof gameParticipants.$inferSelect;
export type GameQuestion = typeof gameQuestions.$inferSelect;
export type GameAnswer = typeof gameAnswers.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertGameParticipant = z.infer<typeof insertGameParticipantSchema>;
export type InsertGameAnswer = z.infer<typeof insertGameAnswerSchema>;
