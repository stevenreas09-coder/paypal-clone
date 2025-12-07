"use client";
import { Roboto_Slab, Urbanist } from "next/font/google";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useBalanceStore } from "@/app/lib/balanceStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"], // choose what you want
  subsets: ["latin"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface Activity {
  username: string;
  name: string;
  email: string;
  image: string;
  amount: string;
  date: string;
}

export default function HomePage() {
  const balance = useBalanceStore((state) => state.balance);
  const setBalance = useBalanceStore((state) => state.setBalance);
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  function formatShortDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  }

  const clearRecentActivity = () => {
    localStorage.removeItem("recentActivities");
    setActivities([]);
  };

  useEffect(() => {
    const stored = localStorage.getItem("recentActivities");
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
  }, [setBalance]);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    if (balance <= 0) {
      setBalance(100000);
      localStorage.setItem("balance", "100000");
    }
  }, [balance, setBalance]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`${roboto.className} h-screen flex`}>
      <div className="flex-row space-y-5 w-[60%] gap-4 pt-5 pl-[140px] pr-6 bg-zinc-50">
        <div className="bg-white rounded-2xl border flex">
          <div className="w-[90%] flex-row py-4 px-6 gap-4">
            <div className="text-gray-950 font-black text-[18px] ">
              PayPal balance
            </div>
            {mounted && (
              <div className="text-gray-900 flex items-center text-[40px]  pt-6 pb-3">
                <p className={` text-[38px] font-medium ${roboto.className}`}>
                  $
                </p>
                <p className={`text-[42px] font-medium  ${roboto.className}`}>
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}
            <div className="text-gray-950 font-base text-sm">Available</div>
            <div className="pt-6 pb-4">
              <Link href="/send">
                <button className="py-1.5 px-4.5 bg-[#142c8e] text-white text-sm font-bold rounded-full">
                  Transfer Funds
                </button>
              </Link>
            </div>
          </div>
          <div className="w-[10%] flex justify-center items-start pt-5 text-gray-800">
            <BsThreeDotsVertical className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 text-gray-800 rounded-2xl">
          <div className="text-[18px] pb-4 font-black">Recent activity</div>
          <div className="space-y-3">
            {activities.length === 0 && (
              <div className="border border-gray-300 p-4 rounded-xl text-gray-500">
                No recent activity
              </div>
            )}

            {activities.slice(0, 2).map((item, index) => {
              const initials = item.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const colors = [
                "bg-blue-600",
                "bg-blue-500",
                "bg-blue-800",
                "bg-blue-700",
                "bg-blue-900",
                "bg-black",
              ];
              const bgColor = colors[index % colors.length];

              return (
                <div
                  key={index}
                  className="border border-gray-300 p-5 rounded-xl flex justify-between items-center"
                >
                  <div className="flex justify-center items-center space-x-2">
                    {item.image === "no image" ? (
                      <div
                        className={`w-11 h-11 rounded-full flex justify-center items-center text-white font-bold ${bgColor}`}
                      >
                        {initials}
                      </div>
                    ) : (
                      <img
                        className="w-11 h-11 rounded-full"
                        src={`/userimage/${item.image}.jpg`}
                        alt=""
                      />
                    )}
                    <div>
                      <div className="text-[18px] font-black text-gray-950">
                        {item.name}
                      </div>
                      <div className="text-gray-900 font-normal text-[15px]">
                        {formatShortDate(item.date)} . <span>Money sent </span>
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-[17px] text-gray-950">
                    -${item.amount} USD
                  </div>
                </div>
              );
            })}
          </div>
          <div
            onClick={clearRecentActivity}
            className="pt-4 font-black text-blue-800"
          >
            Show all
          </div>
        </div>
      </div>

      <div className="w-[40%] bg-white p-4">
        <div className="">
          <img src="/icons/image1.png" className="contrast-100 w-[400px]" />
        </div>
      </div>
    </div>
  );
}
