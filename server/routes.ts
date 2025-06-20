import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertGameParticipantSchema, insertGameAnswerSchema } from "@shared/schema";
import { GameService } from "./services/gameService";
import { QuestionGenerator } from "./services/questionGenerator";

const gameService = new GameService(storage);
const questionGenerator = new QuestionGenerator(storage);

// WebSocket connections map
const connections = new Map<string, { ws: WebSocket; userId?: string; gameId?: string }>();

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/users/:id/stats', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const rank = await storage.getUserRank(req.params.id);
      const achievements = await storage.getUserAchievements(req.params.id);
      
      res.json({
        ...user,
        rank,
        achievements: achievements.slice(0, 3), // Recent 3 achievements
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Game routes
  app.post('/api/games', async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      
      // Generate questions for the game
      const questions = await questionGenerator.generateQuestionsForGame(
        game.id,
        gameData.mode || 'quick',
        gameData.totalQuestions || 10
      );
      
      res.status(201).json({ game, questionsCount: questions.length });
    } catch (error) {
      console.error("Game creation error:", error);
      res.status(400).json({ message: "Invalid game data" });
    }
  });

  app.get('/api/games/:id', async (req, res) => {
    try {
      const game = await gameService.getGameWithDetails(req.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/games/:id/join', async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const participantData = insertGameParticipantSchema.parse({
        gameId: req.params.id,
        userId,
      });

      const participant = await storage.addGameParticipant(participantData);
      
      // Notify other players via WebSocket
      broadcastToGame(req.params.id, {
        type: 'player_joined',
        participant: {
          ...participant,
          user: await storage.getUser(userId),
        },
      });

      res.status(201).json(participant);
    } catch (error) {
      console.error("Join game error:", error);
      res.status(400).json({ message: "Failed to join game" });
    }
  });

  app.post('/api/games/:id/start', async (req, res) => {
    try {
      await storage.updateGameStatus(req.params.id, 'active', 1);
      const game = await gameService.getGameWithDetails(req.params.id);
      
      // Notify all players that game has started
      broadcastToGame(req.params.id, {
        type: 'game_started',
        game,
        question: game?.questions?.[0],
      });

      res.json({ message: "Game started" });
    } catch (error) {
      res.status(500).json({ message: "Failed to start game" });
    }
  });

  app.post('/api/games/:id/answer', async (req, res) => {
    try {
      const { userId, questionId, selectedAnswer, timeSpent } = req.body;
      
      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const isCorrect = selectedAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;

      const answerData = insertGameAnswerSchema.parse({
        gameId: req.params.id,
        userId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent,
        pointsEarned,
      });

      await storage.recordAnswer(answerData);

      // Update participant score
      const answers = await storage.getGameAnswers(req.params.id, userId);
      const totalScore = answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0) + pointsEarned;
      const correctCount = answers.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
      
      await storage.updateParticipantScore(req.params.id, userId, totalScore, correctCount);

      // Check if this was the last question and update user stats
      const game = await storage.getGame(req.params.id);
      if (game && answers.length + 1 >= (game.totalQuestions || 10)) {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUserStats(userId, {
            totalPoints: (user.totalPoints || 0) + totalScore,
            questionsAnswered: (user.questionsAnswered || 0) + (game.totalQuestions || 10),
            gamesPlayed: (user.gamesPlayed || 0) + 1,
            currentStreak: (user.currentStreak || 0) + 1,
            bestStreak: Math.max(user.bestStreak || 0, (user.currentStreak || 0) + 1),
          });
        }
      }

      res.json({
        isCorrect,
        pointsEarned,
        explanation: question.explanation,
        correctAnswer: question.correctAnswer,
      });
    } catch (error) {
      console.error("Answer submission error:", error);
      res.status(400).json({ message: "Failed to submit answer" });
    }
  });

  // Question routes
  app.get('/api/questions/random', async (req, res) => {
    try {
      const { culture, category, difficulty, limit } = req.query;
      const questions = await storage.getRandomQuestions(
        culture ? parseInt(culture as string) : undefined,
        category ? parseInt(category as string) : undefined,
        difficulty as string,
        limit ? parseInt(limit as string) : 10
      );
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Culture routes
  app.get('/api/cultures', async (req, res) => {
    try {
      const cultures = await storage.getCultures();
      res.json(cultures);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/cultures/featured', async (req, res) => {
    try {
      const culture = await storage.getFeaturedCulture();
      res.json(culture || null);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Achievement routes
  app.get('/api/users/:id/achievements', async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const connectionId = Math.random().toString(36).substring(7);
    connections.set(connectionId, { ws });

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const connection = connections.get(connectionId);
        
        if (!connection) return;

        switch (data.type) {
          case 'join_game':
            connection.userId = data.userId;
            connection.gameId = data.gameId;
            connections.set(connectionId, connection);
            break;
            
          case 'game_update':
            if (connection.gameId) {
              broadcastToGame(connection.gameId, data.payload, connectionId);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      connections.delete(connectionId);
    });
  });

  function broadcastToGame(gameId: string, message: any, excludeConnectionId?: string) {
    connections.forEach((connection, connId) => {
      if (
        connection.gameId === gameId &&
        connId !== excludeConnectionId &&
        connection.ws.readyState === WebSocket.OPEN
      ) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }

  return httpServer;
}
