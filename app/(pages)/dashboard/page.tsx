import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { LeaderboardPreview } from '@/components/dashboard/LeaderboardPreview';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { UserStats } from '@/components/dashboard/UserStats';
import { DailyQuote } from '@/components/dashboard/DailyQuote';
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
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#8b5e34] tracking-tight">
          Welcome back, {session.user?.name} 👋
        </h1>
        <DailyQuote />
      </div>

      {/* Rest of your component remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-6">
          <UserStats />
        </div>

        <div className="md:col-span-4">
          <ProgressChart />
        </div>
        <div className="md:col-span-2">
          <LeaderboardPreview />
        </div>

        <div className="md:col-span-6">
          <DashboardCalendar />
        </div>
      </div>
    </div>
  );
}