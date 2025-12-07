"use client";
import { useState, useEffect } from "react";
import { useBalanceStore } from "@/app/lib/balanceStore";

export default function EditBalancePage() {
  const balance = useBalanceStore((state) => state.balance);
  const setBalance = useBalanceStore((state) => state.setBalance);

  const [mounted, setMounted] = useState(false);
  const [inputBalance, setInputBalance] = useState<number>(balance);

  useEffect(() => {
    setMounted(true); // mark client mount
  }, []);

  if (!mounted) return null; // prevent server/client mismatch

  return (
    <div className="p-4 h-screen">
      <h2 className="text-lg font-bold mb-2">Edit Balance</h2>

      <input
        type="number"
        value={inputBalance}
        onChange={(e) => setInputBalance(parseFloat(e.target.value))}
        className="border px-2 py-1 rounded mr-2"
      />

      <button
        onClick={() => {
          setBalance(inputBalance); // update Zustand store
          localStorage.setItem("balance", inputBalance.toString()); // persist
        }}
        className="px-4 py-1 bg-blue-600 text-white rounded"
      >
        Update Balance
      </button>

      <div className="mt-4 text-gray-700">
        Current Balance: $
        {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
