import { useQuery } from "@tanstack/react-query";
import GameHeader from "@/components/GameHeader";
import Leaderboard from "@/components/Leaderboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard?limit=50"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
              <p className="text-gray-600">See how you rank against players worldwide</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Game
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Leaderboard users={leaderboard || []} />
        )}
      </main>
    </div>
  );
}
