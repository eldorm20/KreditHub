import { Card, CardContent } from "@/components/ui/card";

interface GameModeSelectorProps {
  onStartGame: (mode: string) => void;
}

export default function GameModeSelector({ onStartGame }: GameModeSelectorProps) {
  const gameModes = [
    {
      id: 'quick',
      title: 'Quick Challenge',
      description: '5-minute rapid-fire questions about world cultures',
      duration: '5 min',
      players: '1-4 players',
      icon: 'fas fa-bolt',
      gradient: 'gradient-primary',
    },
    {
      id: 'deepdive',
      title: 'Cultural Deep Dive',
      description: 'Explore one culture in detail with interactive content',
      duration: '10-15 min',
      players: 'Solo',
      icon: 'fas fa-mountain',
      gradient: 'gradient-accent',
    },
    {
      id: 'team',
      title: 'Team Battle',
      description: 'Compete with colleagues in cultural knowledge showdown',
      duration: '15 min',
      players: '2-8 players',
      icon: 'fas fa-trophy',
      gradient: 'gradient-secondary',
    },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Adventure</h2>
        <p className="text-gray-600">Perfect for your lunch break - each game takes 5-15 minutes</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {gameModes.map((mode) => (
          <Card 
            key={mode.id}
            className="cursor-pointer transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
            onClick={() => onStartGame(mode.id)}
          >
            <CardContent className="p-6">
              <div className={`w-16 h-16 ${mode.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`${mode.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{mode.title}</h3>
              <p className="text-gray-600 mb-4">{mode.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ 
                  color: mode.id === 'quick' ? 'hsl(249, 82%, 61%)' : 
                         mode.id === 'deepdive' ? 'hsl(158, 73%, 39%)' : 
                         'hsl(39, 91%, 48%)'
                }}>
                  {mode.duration}
                </span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-users text-gray-400 text-sm"></i>
                  <span className="text-sm text-gray-500">{mode.players}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
