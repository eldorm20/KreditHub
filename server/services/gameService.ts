import { IStorage } from "../storage";
import { Game, GameParticipant, User, Question } from "@shared/schema";

export class GameService {
  constructor(private storage: IStorage) {}

  async getGameWithDetails(gameId: string): Promise<(Game & { 
    participants: (GameParticipant & { user: User })[];
    questions: Question[];
    currentQuestionData?: Question;
  }) | null> {
    const game = await this.storage.getGame(gameId);
    if (!game) return null;

    const participants = await this.storage.getGameParticipants(gameId);
    
    // For now, we'll get random questions - in a real implementation,
    // you'd want to store the specific questions for each game
    const questions = await this.storage.getRandomQuestions(
      undefined, 
      undefined, 
      undefined, 
      game.totalQuestions || 10
    );

    const currentQuestionData = game.currentQuestion && game.currentQuestion > 0 && game.currentQuestion <= questions.length
      ? questions[game.currentQuestion - 1]
      : undefined;

    return {
      ...game,
      participants,
      questions,
      currentQuestionData,
    };
  }

  async calculateGameResults(gameId: string, userId: string) {
    const answers = await this.storage.getGameAnswers(gameId, userId);
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalPoints = answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
    const accuracy = answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0;

    return {
      correctAnswers,
      totalAnswers: answers.length,
      totalPoints,
      accuracy,
    };
  }

  async endGame(gameId: string) {
    await this.storage.updateGameStatus(gameId, 'completed');
    
    // Update participant completion times
    const participants = await this.storage.getGameParticipants(gameId);
    
    // Award achievements and update user stats would happen here
    for (const participant of participants) {
      await this.storage.checkAndAwardAchievements(participant.userId);
    }
  }
}
