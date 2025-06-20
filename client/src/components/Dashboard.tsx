import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Leaderboard from "./Leaderboard";

// Mock data for demo
const mockWeeklyStats = {
  questionsAnswered: 47,
  culturesExplored: 8,
  accuracy: 92,
};

const mockWeekDays = [
  { day: 'Mon', progress: 100, count: 15 },
  { day: 'Tue', progress: 80, count: 12 },
  { day: 'Wed', progress: 100, count: 18 },
  { day: 'Today', progress: 20, count: 2, isToday: true },
];

const mockAchievements = [
  {
    id: 1,
    name: "Asian Culture Expert",
    description: "Answered 50 Asian culture questions correctly",
    iconName: "medal",
    earnedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    gradient: "gradient-secondary",
  },
  {
    id: 2,
    name: "Streak Master",
    description: "Maintained 7-day learning streak",
    iconName: "fire",
    earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    gradient: "gradient-accent",
  },
  {
    id: 3,
    name: "Team Player",
    description: "Won 3 team battles this week",
    iconName: "users",
    earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    gradient: "gradient-primary",
  },
];

const mockLeaderboard = [
  {
    id: "1",
    name: "Sarah K.",
    department: "Marketing",
    totalPoints: 3240,
    rank: 1,
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  },
  {
    id: "2",
    name: "Mike R.",
    department: "Engineering",
    totalPoints: 2890,
    rank: 2,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  },
  {
    id: "3",
    name: "Alex",
    department: "Design",
    totalPoints: 2450,
    rank: 3,
    isCurrentUser: true,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  },
  {
    id: "4",
    name: "Emma L.",
    department: "Sales",
    totalPoints: 2120,
    rank: 4,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  },
];

const mockFeaturedCulture = {
  name: "Indian Culture",
  description: "Discover the rich traditions of India, from vibrant festivals like Holi and Diwali to diverse regional cuisines and ancient practices.",
  imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
};

const mockUserStats = {
  totalQuestions: 847,
  culturesExplored: 23,
  bestStreak: "14 days",
  globalRank: "#1,247",
};

export default function Dashboard() {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Stats & Progress */}
      <div className="lg:col-span-2 space-y-6">
        {/* Weekly Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">This Week's Journey</h3>
              <div className="flex items-center space-x-2 text-accent">
                <i className="fas fa-chart-line"></i>
                <span className="text-sm font-medium">+12% from last week</span>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockWeeklyStats.questionsAnswered}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mockWeeklyStats.culturesExplored}</div>
                <div className="text-sm text-gray-600">Cultures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{mockWeeklyStats.accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            {/* Daily Progress Visualization */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Daily Progress</span>
                <span>Goal: 10 questions/day</span>
              </div>
              {mockWeekDays.map((day, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={`text-sm font-medium w-12 ${day.isToday ? 'text-secondary' : 'text-gray-700'}`}>
                    {day.day}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${day.isToday ? 'gradient-secondary animate-pulse' : 'gradient-primary'}`}
                      style={{ width: `${day.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{day.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {mockAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-secondary/10 to-orange-50 rounded-xl">
                  <div className={`w-12 h-12 ${achievement.gradient} rounded-xl flex items-center justify-center`}>
                    <i className={`fas fa-${achievement.iconName} text-white text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(achievement.earnedAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Leaderboard & Quick Actions */}
      <div className="space-y-6">
        {/* Office Leaderboard */}
        <Leaderboard users={mockLeaderboard} />

        {/* Culture Spotlight */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Culture Spotlight</h3>
            
            <div className="mb-4">
              <img 
                src={mockFeaturedCulture.imageUrl} 
                alt="Featured culture" 
                className="w-full h-32 object-cover rounded-xl" 
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-gray-900">{mockFeaturedCulture.name}</h4>
                <span className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">Featured</span>
              </div>
              <p className="text-sm text-gray-600">
                {mockFeaturedCulture.description}
              </p>
              <Button className="w-full gradient-accent text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Explore Indian Culture
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="gradient-primary text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Your Learning Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Total Questions</span>
                <span className="font-bold">{mockUserStats.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Cultures Explored</span>
                <span className="font-bold">{mockUserStats.culturesExplored}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Best Streak</span>
                <span className="font-bold">{mockUserStats.bestStreak}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Rank</span>
                <span className="font-bold">{mockUserStats.globalRank}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
