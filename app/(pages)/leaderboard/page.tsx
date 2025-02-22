import { LeaderboardPage } from "@/components/LeaderboardPage";
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

const LeaderBoard = async () => {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect("/login");
  }
  return (
    <div>
      <LeaderboardPage />
    </div>
  )
}
export default LeaderBoard;