import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface LeaderboardUser {
  id: string;
  name: string;
  department?: string;
  totalPoints: number;
  rank?: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  showHeader?: boolean;
  showViewMore?: boolean;
}

export default function Leaderboard({ users, showHeader = true, showViewMore = true }: LeaderboardProps) {
  const getRankBadgeClass = (rank?: number) => {
    switch (rank) {
      case 1:
        return 'gradient-secondary';
      case 2:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      case 3:
        return 'bg-gradient-to-br from-amber-400 to-yellow-600';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  const getRankTextClass = (rank?: number) => {
    switch (rank) {
      case 1:
      case 2:
      case 3:
        return 'text-white';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Office Leaderboard</CardTitle>
            <span className="text-sm text-gray-500">This Week</span>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={showHeader ? "pt-0" : "p-6"}>
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id}
              className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors ${
                user.isCurrentUser ? 'bg-primary/10 border border-primary/20' : ''
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 font-bold text-sm rounded-full ${getRankBadgeClass(user.rank)} ${getRankTextClass(user.rank)}`}>
                {user.rank}
              </div>
              
              {user.avatarUrl && (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover" 
                />
              )}
              
              <div className="flex-1">
                <div className={`font-semibold ${user.isCurrentUser ? 'text-primary' : 'text-gray-900'}`}>
                  {user.isCurrentUser ? `You (${user.name})` : user.name}
                </div>
                {user.department && (
                  <div className={`text-sm ${user.isCurrentUser ? 'text-primary/70' : 'text-gray-600'}`}>
                    {user.department}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className={`font-bold ${
                  user.rank === 1 ? 'text-secondary' : 
                  user.isCurrentUser ? 'text-primary' : 'text-gray-600'
                }`}>
                  {user.totalPoints.toLocaleString()}
                </div>
                <div className={`text-xs ${user.isCurrentUser ? 'text-primary/70' : 'text-gray-500'}`}>
                  points
                </div>
              </div>
            </div>
          ))}
        </div>

        {showViewMore && (
          <Link href="/leaderboard">
            <Button 
              variant="ghost" 
              className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
            >
              View Full Leaderboard
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
