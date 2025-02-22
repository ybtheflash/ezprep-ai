import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { LeaderboardPreview } from '@/components/dashboard/LeaderboardPreview';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { UserStats } from '@/components/dashboard/UserStats';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-[#fcf3e4]/30">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#8b5e34] tracking-tight">
          Welcome to EzPrep.ai
        </h1>
        <p className="text-[#6d4a29] text-lg">
          Track your progress and upcoming events
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Row 1: Calendar */}
        <div className="md:col-span-6">
          <DashboardCalendar />
        </div>

        {/* Row 2: Stats Card */}
        <div className="md:col-span-6">
          <UserStats />
        </div>

        {/* Row 3: Progress Chart and Leaderboard */}
        <div className="md:col-span-4">
          <ProgressChart />
        </div>
        <div className="md:col-span-2">
          <LeaderboardPreview />
        </div>
      </div>
    </div>
  );
}