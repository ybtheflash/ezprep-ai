"use client";

import { useState } from "react";
import { redeemCode } from "@/lib/actions/redeemCode";
import { getUser } from "@/lib/actions/getUser";
import { useEffect } from "react";

interface User {
  name: string;
  coins: number;
}

export function Shop() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [redeemInput, setRedeemInput] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    coins?: number;
  }>({ type: null, message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const result = await redeemCode(redeemInput);

    if (result.success) {
      setStatus({
        type: "success",
        message: result.message,
        coins: result.coins,
      });
      setRedeemInput("");
      // Refresh user data
      const user = await getUser();
      setCurrentUser(user);
    } else {
      setStatus({
        type: "error",
        message: result.message,
      });
    }
  };

  const purchaseCoins = async (amount: number) => {
    setStatus({ type: null, message: "" });

    try {
      // Replace with actual purchase API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus({
        type: "success",
        message: `Successfully purchased ₹{amount} EzCoins!`,
      });
      // Refresh user data
      const user = await getUser();
      setCurrentUser(user);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Purchase failed. Please try again.",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#8b5e34]">EzCoins Shop</h1>
        <div className="bg-[#e8f4f8] px-4 py-2 rounded-lg">
          <span className="font-medium text-[#8b5e34]">
            Your Balance: {currentUser?.coins ?? 0} EzCoins
          </span>
        </div>
      </div>

      <div className="border rounded-lg mb-8">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-[#8b5e34] mb-2">
            Buy EzCoins
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {[
            { amount: 100, price: 10 },
            { amount: 500, price: 45 },
            { amount: 1000, price: 80 },
          ].map((packageInfo) => (
            <div
              key={packageInfo.amount}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-[#8b5e34]">
                  {packageInfo.amount}
                </span>
                <span className="text-gray-600">EzCoins</span>
                <button
                  onClick={() => purchaseCoins(packageInfo.amount)}
                  className="w-full mt-2 bg-[#8b5e34] text-white py-2 rounded hover:bg-[#76533a] transition-colors"
                >
                  ₹{packageInfo.price}.00
                </button>
                {packageInfo.amount === 500 && (
                  <span className="text-xs text-green-600 mt-1">Best Value</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-[#8b5e34] mb-2">
            Redeem Code
          </h2>
        </div>

        <div className="p-4">
          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={redeemInput}
              onChange={(e) => setRedeemInput(e.target.value)}
              placeholder="Enter redemption code"
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b5e34]"
            />
            <button
              type="submit"
              className="bg-[#8b5e34] text-white px-6 py-2 rounded-lg hover:bg-[#76533a] transition-colors"
            >
              Redeem
            </button>
          </form>

          {status.type === "error" && (
            <div className="text-red-500 mt-2">{status.message}</div>
          )}

          {status.type === "success" && (
            <div className="text-green-600 mt-2">
              <p>{status.message}</p>
              {status.coins !== undefined && (
                <p className="mt-1">New balance: {status.coins} EzCoins</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}