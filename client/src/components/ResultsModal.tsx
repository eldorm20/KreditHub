import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameResults {
  correctAnswers: number;
  totalAnswers: number;
  totalPoints: number;
  accuracy: number;
  culture?: string;
  achievements?: any[];
}

interface ResultsModalProps {
  results: GameResults;
  onPlayAgain: () => void;
  onBackToDashboard: () => void;
}

export default function ResultsModal({ results, onPlayAgain, onBackToDashboard }: ResultsModalProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="p-8 text-center">
          {/* Celebration Animation */}
          <div className="w-20 h-20 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <i className="fas fa-trophy text-white text-3xl"></i>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Challenge Complete!</h3>
          <p className="text-gray-600 mb-6">
            Great job learning about {results.culture || 'world'} culture
          </p>
          
          {/* Results Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{results.correctAnswers}</div>
              <div className="text-xs text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{results.totalPoints}</div>
              <div className="text-xs text-gray-600">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{results.accuracy}%</div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
          </div>
          
          {/* New Achievements */}
          {results.achievements && results.achievements.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">New Achievements!</h4>
              <div className="space-y-2">
                {results.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
                    <i className="fas fa-medal text-accent"></i>
                    <span className="text-sm font-medium text-gray-700">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onPlayAgain}
              className="w-full py-3 px-4 gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Play Again
            </Button>
            <Button 
              onClick={onBackToDashboard}
              variant="outline"
              className="w-full py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
