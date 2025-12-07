"use client";
import { Urbanist } from "next/font/google";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useBalanceStore } from "@/app/lib/balanceStore";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

interface User {
  name: string;
  username: string;
  email: string;
  mobile: string;
  image: string;
}
interface Activity {
  username: string;
  name: string;
  email: string;
  image: string;
  amount: string;
  date: string;
}
interface ConversionRateProps {
  currency: "PHP" | "EUR" | "GBP";
}

// Get initials from a name
const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0].toUpperCase();
};

// Pick a stable random-ish Tailwind color based on a string
const getRandomBgColor = (str: string) => {
  const colors = [
    "bg-blue-600",
    "bg-blue-500",
    "bg-blue-800",
    "bg-blue-700",
    "bg-blue-900",
    "bg-black",
  ];

  const index =
    str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
};

export default function ReviewPayment({ currency }: ConversionRateProps) {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0.00";
  const [user, setUser] = useState<User | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const router = useRouter();
  const sendMoney = useBalanceStore((state) => state.sendMoney);
  const params = useParams();
  const username = params.username;

  function saveActivity() {
    if (!user) return;

    const newActivity: Activity = {
      username: user.username,
      name: user.name,
      email: user.email,
      image: user.image,
      amount: amount,
      date: new Date().toLocaleString(),
    };

    const existing = localStorage.getItem("recentActivities");
    const activities: Activity[] = existing ? JSON.parse(existing) : [];
    activities.unshift(newActivity);
    localStorage.setItem("recentActivities", JSON.stringify(activities));
  }

  useEffect(() => {
    fetch("/names.json")
      .then((res) => res.json())
      .then((data: User[]) => {
        const found = data.find((u) => u.username === username);
        setUser(found || null);
      })
      .catch((err) => console.error(err));
  }, [username]);

  useEffect(() => {
    if (!currency) return;
    let interval: number;

    async function fetchRate() {
      try {
        const res = await fetch(
          `https://api.exchangerate.host/latest?base=${currency}&symbols=USD`
        );
        const data = await res.json();
        if (data.rates && data.rates.USD) {
          setRate(1 / data.rates.USD);
        } else setRate(null);
      } catch (err) {
        console.error("Failed to fetch conversion rate", err);
        setRate(null);
      }
    }

    fetchRate();
    interval = window.setInterval(fetchRate, 10000);
    return () => window.clearInterval(interval);
  }, [currency]);

  if (!user) {
    return <p className="p-4 text-gray-500">User not found</p>;
  }

  return (
    <div className={`${urbanist.className} container`}>
      <div className="w-screen h-screen flex flex-col justify-start items-center pt-6">
        <div className="w-[390px] h-[190px] border border-black/15 text-black flex flex-col items-center rounded-t-xl mt-6 p-4">
          <div className="flex items-center px-4 py-4 space-x-4">
            {/* Conditional avatar */}
            {user.image !== "no image" ? (
              <img
                src={`/userimage/${user.image}.jpg`}
                className="w-16 h-16 rounded-full"
                alt=""
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${getRandomBgColor(
                  user.name
                )}`}
              >
                {getInitials(user.name)}
              </div>
            )}
            <h1 className="text-lg text-black/80 font-semibold">{user.name}</h1>
          </div>

          <div className="relative flex justify-center items-center px-2">
            <p className="absolute left-[-2] text-sm font-semibold">$</p>
            <p className="font-semibold text-xl">{amount}</p>
          </div>

          <p className="text-xs font-semibold bg-black/15 px-2 py-1 rounded-full">
            USD
          </p>
        </div>

        {/* Payment card */}
        <div className="w-[390px] h-[275px] border border-black/15 text-black flex flex-col items-center rounded-b-xl mt-4 p-2">
          <div className="w-full flex justify-between">
            <div className="flex justify-center items-center p-4 space-x-2">
              <div className="shadow-2xl rounded-full p-1">
                <img src="/icons/paypal23.png" className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-black/70">
                Balance (PHP)
              </p>
            </div>
            <div className="p-4">
              <IoIosArrowForward className="text-black/55" />
            </div>
          </div>

          <div className="flex w-full justify-between mt-[-20]">
            <div className="flex justify-center items-center p-4 space-x-2">
              <div className="shadow-2xl rounded-full p-1">
                <FaUserFriends />
              </div>
              <p className="text-sm font-semibold text-black/70">
                Friends and Family
              </p>
            </div>
            <div className="p-4">
              <IoIosArrowForward className="text-black/55" />
            </div>
          </div>

          <div className="flex w-full justify-between text-black/70 text-xs px-4 font-bold">
            <p>Paypal fee</p>
            <p>$0.00 USD</p>
          </div>
          <div className="flex w-full justify-between text-black text-xs px-4 py-2 font-bold">
            <p>Total</p>
            <p>${amount} USD</p>
          </div>
          <div className="flex w-full justify-between text-black/70 text-xs px-4 font-bold">
            <p>Payment delivery</p>
            <p>In seconds</p>
          </div>
          <div className="flex w-full justify-between text-black/70 text-xs px-4 pt-4 font-bold">
            <p>{user.name} will get</p>
            <p>${amount} USD</p>
          </div>

          <div className="flex w-full text-black/70 text-xs pt-2 px-4 font-bold">
            {rate !== null ? (
              <p>
                Conversion rate: 1 USD = {rate.toFixed(5)} {currency}
              </p>
            ) : (
              <p>Loading rate...</p>
            )}
          </div>

          <div className="flex w-full text-black/70 text-xs pt-2 px-4 font-normal">
            <p>
              Great news! We found a better rate and applied it here. This rate
              includes a currency conversion spread.
            </p>
          </div>
        </div>

        <div className="pt-4 w-[250px] flex flex-col gap-2">
          <button
            onClick={() => {
              sendMoney(parseFloat(amount));
              saveActivity();
              const currentBalance = parseFloat(
                localStorage.getItem("balance") || "0"
              );
              const newBalance = currentBalance - parseFloat(amount);
              localStorage.setItem("balance", newBalance.toString());
              router.push(`/profile/${username}/notify?amount=${amount}`);
            }}
            className="px-4 py-2 w-full bg-blue-700 rounded-full text-sm font-bold"
          >
            Send
          </button>

          <button className="px-4 py-2 w-full text-blue-600 rounded-full text-sm font-bold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
