import { useState } from "react";
import GameHeader from "@/components/GameHeader";
import GameModeSelector from "@/components/GameModeSelector";
import GameSession from "@/components/GameSession";
import Dashboard from "@/components/Dashboard";
import ResultsModal from "@/components/ResultsModal";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  const [showGame, setShowGame] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { currentGame, startGame, endGame, gameResults } = useGame();

  const handleStartGame = async (mode: string) => {
    try {
      await startGame(mode);
      setShowGame(true);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const handleGameComplete = () => {
    setShowGame(false);
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    setShowResults(false);
    if (currentGame) {
      handleStartGame(currentGame.mode);
    }
  };

  const handleBackToDashboard = () => {
    setShowResults(false);
    endGame();
  };

  const handleQuickStart = () => {
    handleStartGame('quick');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showGame ? (
          <>
            <GameModeSelector onStartGame={handleStartGame} />
            <Dashboard />
          </>
        ) : (
          <GameSession 
            gameId={currentGame?.id} 
            onGameComplete={handleGameComplete}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleQuickStart}
          className="w-14 h-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Quick Start Game"
        >
          <i className="fas fa-play text-lg"></i>
        </Button>
      </div>

      {/* Results Modal */}
      {showResults && gameResults && (
        <ResultsModal
          results={gameResults}
          onPlayAgain={handlePlayAgain}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}
