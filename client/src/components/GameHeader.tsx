import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// Mock user for demo - in real app this would come from auth
const DEMO_USER = {
  id: "demo-user-1",
  name: "Alex",
  username: "alex_demo",
  email: "alex@company.com",
  department: "Design",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
  totalPoints: 2450,
  currentStreak: 7,
  bestStreak: 14,
  questionsAnswered: 847,
  culturesExplored: 23,
  gamesPlayed: 156,
};

export default function GameHeader() {
  const [currentUser] = useState(DEMO_USER);

  const { data: userStats } = useQuery({
    queryKey: [`/api/users/${currentUser.id}/stats`],
    enabled: false, // Disabled for demo
  });

  return (
    <header className="bg-white shadow-sm border-b-2 border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-globe-americas text-white text-lg"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CultureQuest</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Streak */}
            <div className="flex items-center space-x-2 bg-secondary/10 px-3 py-1 rounded-full">
              <i className="fas fa-fire text-secondary"></i>
              <span className="text-sm font-medium text-gray-700">
                {currentUser.currentStreak} day streak
              </span>
            </div>
            
            {/* Points */}
            <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
              <i className="fas fa-star text-primary"></i>
              <span className="text-sm font-medium text-gray-700">
                {currentUser.totalPoints.toLocaleString()} pts
              </span>
            </div>

            {/* User Profile */}
            <Link href="/leaderboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src={currentUser.avatarUrl} 
                alt="User Avatar" 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
