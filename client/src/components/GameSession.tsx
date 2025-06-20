import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GameSessionProps {
  gameId?: string;
  onGameComplete: () => void;
}

export default function GameSession({ gameId, onGameComplete }: GameSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const { toast } = useToast();

  // Mock game data for demo
  const mockGame = {
    id: gameId || 'demo-game',
    mode: 'quick',
    totalQuestions: 10,
    currentQuestion: currentQuestionIndex + 1,
    questions: [
      {
        id: 1,
        questionText: "What is the traditional Japanese tea ceremony called?",
        imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        options: ["Sado (Chado)", "Ikebana", "Origami", "Kabuki"],
        correctAnswer: "Sado (Chado)",
        explanation: "Sado or Chado (The Way of Tea) is the traditional Japanese art of tea ceremony.",
        points: 10,
        culture: { name: "Japanese" }
      },
      {
        id: 2,
        questionText: "Which Indian festival is known as the 'Festival of Colors'?",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        options: ["Diwali", "Holi", "Dussehra", "Karva Chauth"],
        correctAnswer: "Holi",
        explanation: "Holi is celebrated by throwing colored powders and water, marking the arrival of spring.",
        points: 10,
        culture: { name: "Indian" }
      },
      // Add more mock questions as needed
    ]
  };

  const currentQuestion = mockGame.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / mockGame.totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !selectedAnswer) {
      handleTimeUp();
    }
  }, [timeRemaining, selectedAnswer]);

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswering || selectedAnswer) return;
    
    setSelectedAnswer(answer);
    setIsAnswering(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isCorrect = answer === currentQuestion.correctAnswer;
      const pointsEarned = isCorrect ? currentQuestion.points : 0;
      
      const answerData = {
        questionId: currentQuestion.id,
        selectedAnswer: answer,
        isCorrect,
        pointsEarned,
        timeSpent: 30 - timeRemaining,
      };
      
      setUserAnswers(prev => [...prev, answerData]);
      
      toast({
        title: isCorrect ? "Correct!" : "Incorrect",
        description: isCorrect ? `+${pointsEarned} points` : currentQuestion.explanation,
        variant: isCorrect ? "default" : "destructive",
      });

      setTimeout(() => {
        nextQuestion();
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
      setIsAnswering(false);
      setSelectedAnswer(null);
    }
  };

  const handleTimeUp = () => {
    setSelectedAnswer(""); // Empty string to indicate time up
    setTimeout(nextQuestion, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= mockGame.totalQuestions) {
      onGameComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(30);
      setSelectedAnswer(null);
      setIsAnswering(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Game Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {mockGame.totalQuestions}
              </span>
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-primary">
                  {currentQuestion.culture?.name} Culture
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-secondary">
              <i className="fas fa-clock"></i>
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent className="p-8">
          {/* Cultural Context Image */}
          {currentQuestion.imageUrl && (
            <div className="mb-6">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Cultural context" 
                className="w-full h-64 object-cover rounded-xl" 
              />
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.questionText}
            </h3>
            <p className="text-gray-600">
              This ceremonial preparation and presentation of tea is an important cultural practice.
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showResult = selectedAnswer !== null;
              
              let buttonClasses = "p-4 border-2 rounded-xl text-left transition-all duration-200 group ";
              
              if (showResult) {
                if (isSelected && isCorrect) {
                  buttonClasses += "bg-accent/20 border-accent text-accent";
                } else if (isSelected && !isCorrect) {
                  buttonClasses += "bg-destructive/20 border-destructive text-destructive";
                } else if (isCorrect) {
                  buttonClasses += "bg-accent/20 border-accent text-accent";
                } else {
                  buttonClasses += "bg-gray-50 border-transparent text-gray-700";
                }
              } else {
                buttonClasses += "bg-gray-50 hover:bg-primary/10 border-transparent hover:border-primary text-gray-900";
              }

              return (
                <Button
                  key={option}
                  variant="ghost"
                  className={buttonClasses}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      showResult && isSelected && isCorrect ? "bg-accent text-white" :
                      showResult && isSelected && !isCorrect ? "bg-destructive text-white" :
                      showResult && isCorrect ? "bg-accent text-white" :
                      showResult ? "bg-gray-200 text-gray-600" :
                      "bg-gray-200 group-hover:bg-primary group-hover:text-white"
                    }`}>
                      {optionLetter}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
