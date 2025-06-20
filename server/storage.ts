import {
  users,
  games,
  gameParticipants,
  gameQuestions,
  gameAnswers,
  questions,
  cultures,
  categories,
  achievements,
  userAchievements,
  type User,
  type InsertUser,
  type Game,
  type InsertGame,
  type GameParticipant,
  type InsertGameParticipant,
  type Question,
  type Culture,
  type Achievement,
  type UserAchievement,
  type InsertGameAnswer,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: string, stats: Partial<Pick<User, 'totalPoints' | 'currentStreak' | 'bestStreak' | 'questionsAnswered' | 'culturesExplored' | 'gamesPlayed'>>): Promise<void>;
  
  // Game operations
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: string): Promise<Game | undefined>;
  updateGameStatus(id: string, status: string, currentQuestion?: number): Promise<void>;
  getActiveGames(): Promise<Game[]>;
  
  // Game participant operations
  addGameParticipant(participant: InsertGameParticipant): Promise<GameParticipant>;
  getGameParticipants(gameId: string): Promise<(GameParticipant & { user: User })[]>;
  updateParticipantScore(gameId: string, userId: string, score: number, correctAnswers: number): Promise<void>;
  
  // Question operations
  getRandomQuestions(cultureId?: number, categoryId?: number, difficulty?: string, limit?: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  getCultures(): Promise<Culture[]>;
  getFeaturedCulture(): Promise<Culture | undefined>;
  
  // Game answer operations
  recordAnswer(answer: InsertGameAnswer): Promise<void>;
  getGameAnswers(gameId: string, userId: string): Promise<any[]>;
  
  // Leaderboard operations
  getLeaderboard(limit?: number): Promise<(User & { rank?: number })[]>;
  getUserRank(userId: string): Promise<number>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  checkAndAwardAchievements(userId: string): Promise<UserAchievement[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUserStats(userId: string, stats: Partial<Pick<User, 'totalPoints' | 'currentStreak' | 'bestStreak' | 'questionsAnswered' | 'culturesExplored' | 'gamesPlayed'>>): Promise<void> {
    await db.update(users)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createGame(gameData: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(gameData).returning();
    return game;
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async updateGameStatus(id: string, status: string, currentQuestion?: number): Promise<void> {
    const updateData: any = { status };
    if (currentQuestion !== undefined) {
      updateData.currentQuestion = currentQuestion;
    }
    if (status === 'active' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    await db.update(games).set(updateData).where(eq(games.id, id));
  }

  async getActiveGames(): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.status, 'active'));
  }

  async addGameParticipant(participantData: InsertGameParticipant): Promise<GameParticipant> {
    const [participant] = await db.insert(gameParticipants).values(participantData).returning();
    return participant;
  }

  async getGameParticipants(gameId: string): Promise<(GameParticipant & { user: User })[]> {
    return await db
      .select({
        id: gameParticipants.id,
        gameId: gameParticipants.gameId,
        userId: gameParticipants.userId,
        score: gameParticipants.score,
        correctAnswers: gameParticipants.correctAnswers,
        questionsAnswered: gameParticipants.questionsAnswered,
        joinedAt: gameParticipants.joinedAt,
        completedAt: gameParticipants.completedAt,
        user: users,
      })
      .from(gameParticipants)
      .innerJoin(users, eq(gameParticipants.userId, users.id))
      .where(eq(gameParticipants.gameId, gameId));
  }

  async updateParticipantScore(gameId: string, userId: string, score: number, correctAnswers: number): Promise<void> {
    await db
      .update(gameParticipants)
      .set({ score, correctAnswers })
      .where(and(eq(gameParticipants.gameId, gameId), eq(gameParticipants.userId, userId)));
  }

  async getRandomQuestions(cultureId?: number, categoryId?: number, difficulty?: string, limit: number = 10): Promise<Question[]> {
    let query = db.select().from(questions);
    
    const conditions = [];
    if (cultureId) conditions.push(eq(questions.cultureId, cultureId));
    if (categoryId) conditions.push(eq(questions.categoryId, categoryId));
    if (difficulty) conditions.push(eq(questions.difficulty, difficulty));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(sql`RANDOM()`).limit(limit);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question;
  }

  async getCultures(): Promise<Culture[]> {
    return await db.select().from(cultures).orderBy(cultures.name);
  }

  async getFeaturedCulture(): Promise<Culture | undefined> {
    const [culture] = await db.select().from(cultures).where(eq(cultures.featured, true)).limit(1);
    return culture;
  }

  async recordAnswer(answerData: InsertGameAnswer): Promise<void> {
    await db.insert(gameAnswers).values(answerData);
  }

  async getGameAnswers(gameId: string, userId: string): Promise<any[]> {
    return await db
      .select()
      .from(gameAnswers)
      .where(and(eq(gameAnswers.gameId, gameId), eq(gameAnswers.userId, userId)));
  }

  async getLeaderboard(limit: number = 10): Promise<(User & { rank?: number })[]> {
    const leaderboardUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.totalPoints))
      .limit(limit);
    
    return leaderboardUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }

  async getUserRank(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    if (!user) return 0;
    
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`total_points > ${user.totalPoints}`);
    
    return (result?.count || 0) + 1;
  }

  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return await db
      .select({
        id: userAchievements.id,
        userId: userAchievements.userId,
        achievementId: userAchievements.achievementId,
        earnedAt: userAchievements.earnedAt,
        achievement: achievements,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
  }

  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    // This would contain logic to check various achievement conditions
    // For now, return empty array - implement specific achievement logic later
    return [];
  }
}

export const storage = new DatabaseStorage();
