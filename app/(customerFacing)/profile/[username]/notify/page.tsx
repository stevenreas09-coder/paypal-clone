"use client";

import { useState, useEffect } from "react";
import { Urbanist } from "next/font/google";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export default function NotifyPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const username = params.username;
  const amount = searchParams.get("amount") || "0.00";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 1-second delay to show loading screen
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-25 h-25">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${urbanist.className} text-black/80 container`}>
      <div className="w-screen h-[60vh] flex flex-col justify-start items-center">
        <div className="popIn w-[300px] h-[120px] border border-black/5 shadow-sm flex flex-col rounded-md justify-center items-center mt-6 font-bold">
          <p>
            You've sent ${amount} USD to {username}
          </p>
          <p>Account</p>
        </div>
        <Link href="/">
          <button className="py-2 mt-6 bg-blue-800 text-sm text-white w-46 font-bold rounded-full">
            Send More Money
          </button>
        </Link>

        <p className="text-blue-800 text-sm font-bold pt-3">Go to Summary</p>
      </div>
    </div>
  );
}
