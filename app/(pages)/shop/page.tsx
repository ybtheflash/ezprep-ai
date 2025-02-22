import { Shop } from "@/components/Shop"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

const ShopPage = async () => {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect("/login");
  }
  return (
    <Shop />
  )
}

export default ShopPage;