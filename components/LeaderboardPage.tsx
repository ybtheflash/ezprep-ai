"use client";

import { getLeaderboard } from "@/lib/actions/getLeaderboard";
import { getUser } from "@/lib/actions/getUser";
import { useEffect, useState } from "react";
import { FloatingShip } from "./FloatingShip";

interface User {
  name: string;
  id: number;
  email: string;
  username: string;
  longestStreak: number;
  currentStreak: number;
  aura: number;
  coins: number;
}

export function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leaderboardResponse, userResponse] = await Promise.all([
          getLeaderboard(),
          getUser(),
        ]);
        setUsers(leaderboardResponse);
        setCurrentUser(userResponse);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="retro-loading"></div>
      <p className="text-[#8b5e34] font-bold mt-4 tracking-wider">LOADING...</p>
    </div>
  );
  
  if (error) return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="retro-card p-8 text-center">
        <p className="text-[#8b5e34] font-bold mb-2">ERROR!</p>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );
  
  if (!users) return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="retro-card p-8 text-center">
        <p className="text-[#8b5e34] font-bold">NO DATA FOUND</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-[#8b5e34] mb-8 tracking-wider relative z-10"
          style={{
            textShadow: '2px 2px 0 #DFD2BC, 4px 4px 0 #8b5e34'
          }}>
        LEADERBOARD
      </h1>

      <FloatingShip shipNumber={1} initialX={100} initialY={150} pattern="around" />
      <FloatingShip shipNumber={2} initialX={600} initialY={250} pattern="across" />
      <FloatingShip shipNumber={4} initialX={400} initialY={200} pattern="free" />

      <div className="relative">
        {users.map((user, index) => {
          const isCurrentUser = user.id === currentUser?.id;
          const rank = index + 1;
          const rankColor = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? '#cd7f32' : '#8b5e34';
          
          return (
            <div
              key={user.id}
              className={`mb-4 retro-card relative z-10 ${isCurrentUser ? "border-[3px]" : ""}`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setSelectedUserId(prev => prev === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="pixel-number" style={{ backgroundColor: rankColor }}>
                    #{rank}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#8b5e34]">
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 px-2 py-1 text-sm bg-[#8b5e34] text-[#fcf3e4] rounded-sm">YOU</span>
                      )}
                    </h2>
                    <p className="text-sm text-[#8b5e34] opacity-75">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/stars.png"
                    alt="aura"
                    className="w-6 h-6"
                  />
                  <span className="text-lg font-bold text-[#8b5e34]">
                    {user.aura}
                  </span>
                </div>
              </div>

              {selectedUserId === user.id && (
                <div className="retro-stats m-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#8b5e34] uppercase tracking-wider font-bold mb-1">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-[#8b5e34] uppercase tracking-wider font-bold mb-1">Current Streak</p>
                      <p className="font-medium">🔥 {user.currentStreak}</p>
                    </div>
                    <div>
                      <p className="text-[#8b5e34] uppercase tracking-wider font-bold mb-1">Best Streak</p>
                      <p className="font-medium">⚡ {user.longestStreak}</p>
                    </div>
                    <div>
                      <p className="text-[#8b5e34] uppercase tracking-wider font-bold mb-1">EzCoins</p>
                      <p className="font-medium">💰 {user.coins}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}