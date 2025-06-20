import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Game {
  id: string;
  mode: string;
  status: string;
  totalQuestions: number;
  currentQuestion: number;
}

interface GameResults {
  correctAnswers: number;
  totalAnswers: number;
  totalPoints: number;
  accuracy: number;
  culture?: string;
}

export function useGame() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startGameMutation = useMutation({
    mutationFn: async (mode: string) => {
      // For demo, create a mock game
      const mockGame = {
        id: `game-${Date.now()}`,
        mode,
        status: 'active',
        totalQuestions: 10,
        currentQuestion: 1,
        hostUserId: 'demo-user-1',
      };
      
      return mockGame;
    },
    onSuccess: (game) => {
      setCurrentGame(game);
      toast({
        title: "Game Started!",
        description: `Starting ${game.mode} challenge`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to start game",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startGame = useCallback(async (mode: string) => {
    return startGameMutation.mutateAsync(mode);
  }, [startGameMutation]);

  const endGame = useCallback(() => {
    if (currentGame) {
      // Calculate mock results
      const mockResults = {
        correctAnswers: Math.floor(Math.random() * currentGame.totalQuestions) + 1,
        totalAnswers: currentGame.totalQuestions,
        totalPoints: Math.floor(Math.random() * 300) + 100,
        accuracy: Math.floor(Math.random() * 40) + 60, // 60-100%
        culture: currentGame.mode === 'deepdive' ? 'Japanese' : undefined,
      };
      
      setGameResults(mockResults);
    }
    setCurrentGame(null);
  }, [currentGame]);

  return {
    currentGame,
    gameResults,
    startGame,
    endGame,
    isStarting: startGameMutation.isPending,
  };
}
