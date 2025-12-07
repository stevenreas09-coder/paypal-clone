"use client";
import { useBalanceStore } from "@/app/lib/balanceStore";
import { Urbanist } from "next/font/google";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export default function SendOptions() {
  const balance = useBalanceStore((state) => state.balance);
  const [selected, setSelected] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const params = useParams();
  const username = params.username;

  return (
    <div className={`${urbanist.className} container text-black`}>
      <div className="w-screen h-screen flex justify-center items-start mt-6">
        <div className="w-[290px] h-[350px] flex flex-col space-y-4">
          <div className="text-xl font-bold pt-4 mt-4">
            How do you want to pay?
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />

            <span className="text-xs font-medium">
              Use my{" "}
              <span className="font-extrabold">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>{" "}
              PayPal balance
            </span>
          </label>
          <div className="w-full pt-10 flex  items-center space-x-4 ">
            <input
              type="radio"
              checked={selected}
              onChange={() => setSelected((prev) => !prev)}
              className="w-4 h-4"
            />
            <img className="w-8 h-5" src="/icons/card.png" alt="" />
            <div className="flex flex-col text-xs font-semibold mt-6">
              <p className="font-bold">S</p>
              <p>Debit ****7568</p>
              <p>
                fee : <span className="text-[10px] font-extrabold">$</span>
                {amount} USD
              </p>
            </div>
          </div>
          <p className="text-blue-500 pt-6 text-xs font-semibold underline">
            +Add a paymnet method
          </p>
          <div className="w-full flex flex-col items-end space-y-2 pt-10 pr-18">
            <Link href={`/profile/${username}/review?amount=${amount}`}>
              <button className="px-4 py-2 bg-black text-white w-20 rounded-full text-sm font-semibold">
                Next
              </button>
            </Link>

            <button className="px-4 py-2  text-blue-500 w-20 rounded-full text-sm font-semibold">
              back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
