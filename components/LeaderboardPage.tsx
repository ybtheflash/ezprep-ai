"use client";

import { getLeaderboard } from "@/lib/actions/getLeaderboard";
import { getUser } from "@/lib/actions/getUser";
import { useEffect, useState } from "react";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!users) return <div>No user data found</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-[#8b5e34] mb-8">
        Leaderboard
      </h1>

      <div className="border rounded-lg">
        {users.map((user, index) => {
          const isCurrentUser = user.id === currentUser?.id;
          return (
            <div key={user.id} className="border-b last:border-b-0">
              <div
                className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                  isCurrentUser ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedUserId(prev => prev === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-8">{index + 1}</span>
                  <h2 className="text-lg font-medium text-[#8b5e34]">
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-sm text-blue-600">(you)</span>
                    )}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-[#8b5e34]">
                    {user.aura}
                  </span>
                </div>
              </div>

              {selectedUserId === user.id && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Streak</p>
                      <p className="font-medium">{user.currentStreak}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Longest Streak</p>
                      <p className="font-medium">{user.longestStreak}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">EzCoins</p>
                      <p className="font-medium">{user.coins}</p>
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