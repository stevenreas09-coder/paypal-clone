"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Urbanist } from "next/font/google";
import { RiArrowDownSLine } from "react-icons/ri";
import { useBalanceStore } from "@/app/lib/balanceStore";
import Modal from "@/app/component/model";
import { PiStorefront } from "react-icons/pi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import Link from "next/link";
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

interface User {
  name: string;
  username: string;
  email: string;
  mobile: string;
  image: string;
}

interface AmountInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

// Helper: get initials
const getInitials = (name: string): string => {
  if (!name) return "";
  const parts = name.split(" ").filter((p) => p.length > 0);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0]?.toUpperCase() || "";
};

// Helper: stable color
const getRandomBgColor = (index: number): string => {
  const colors = [
    "bg-blue-600",
    "bg-blue-500",
    "bg-blue-800",
    "bg-blue-700",
    "bg-blue-900",
    "bg-black",
  ];
  return colors[index % colors.length];
};

export default function ProfilePage({
  value = "0.00",
  onChange,
}: AmountInputProps) {
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [user, setUser] = useState<User | null>(null);
  const balance = useBalanceStore((state) => state.balance);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const maxLength = 280;
  const params = useParams();
  const username = params.username;

  const handleSendTransfer = () => {
    const numericAmount = Number(amount.replace(/,/g, ""));
    if (numericAmount <= 0 || isNaN(numericAmount)) {
      alert("Enter a valid amount");
      return;
    }
    if (numericAmount > balance) {
      alert("Insufficient balance");
      return;
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) val = parts[0] + "." + parts[1];
    let [integerPart, decimalPart] = val.split(".");
    if (integerPart) integerPart = parseInt(integerPart).toLocaleString();
    if (decimalPart !== undefined) val = `${integerPart}.${decimalPart}`;
    else val = integerPart;
    setAmount(val);
    onChange && onChange(val);
  };

  useEffect(() => {
    fetch("/names.json")
      .then((res) => res.json())
      .then((data: User[]) => {
        const found = data.find((u) => u.username === username);
        setUser(found || null);
      })
      .catch((err) => console.error(err));
  }, [username]);

  if (!user) return <p className="p-4 text-gray-500">User not found</p>;

  return (
    <div className={`${urbanist.className} text-black container`}>
      <div className="flex flex-col justify-center items-center items-top h-screen w-screen">
        <div className="flex flex-col items-center justify- space-y-4 border border-black/20 rounded-2xl p-10 mt-10 w-[45%] h-[60%]">
          <div className="flex items-center space-x-2">
            <div>
              {user.image !== "no image" ? (
                <img
                  className="w-15 h-15 rounded-full"
                  src={`/userimage/${user.image}.jpg`}
                  alt={user.name}
                />
              ) : (
                <div
                  className={`w-15 h-15 rounded-full flex items-center justify-center text-white font-bold ${getRandomBgColor(
                    0
                  )}`}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-extrabold">{user.name}</div>
              <div className="font-semibold text-sm">
                <span>@</span>
                {user.username}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full mt-2">
            <div className={`${roboto.className} flex items-center`}>
              <span className="text-[40px] font-light text-black/80 pr-1">
                $
              </span>
              <input
                aria-label="Enter amount field"
                data-nemo="amount"
                dir="ltr"
                autoComplete="off"
                type="text"
                inputMode="numeric"
                name="amount"
                id="fn-amount"
                required
                value={amount}
                onChange={handleChange}
                className="w-[300px] text-left text-[40px] font-light text-black/85 outline-none shadow-none focus:outline-none"
              />
            </div>

            <div className="border flex items-center border-black/30 px-4 py-2 rounded-full">
              <p className="pr-2 text-xs font-extrabold">USD</p>
              <RiArrowDownSLine />
            </div>
          </div>

          <div className="relative w-full">
            <textarea
              id="noteField"
              placeholder=" "
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={maxLength}
              className="peer font-semibold text-sm w-full border rounded-md p-4 pt-6 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              aria-label={`${maxLength} characters max`}
              style={{ height: "100px" }}
            />

            {note.length === 0 && (
              <label
                htmlFor="noteField"
                className="absolute left-2 top-6 text-black text-xs transition-all duration-200
               peer-placeholder-shown:top-6 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-xs peer-placeholder-shown:font-bold
               peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Add a note
              </label>
            )}

            <div
              className="absolute p-2 right-4 bottom-1 text-xs text-black/50 font-bold"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {note.length}/{maxLength}
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold p-6">
          For more information please read our{" "}
          <span className="text-blue-500">user agreement.</span>
        </div>

        <div className="flex space-x-10 pb-40">
          <button className="px-4 py-3 w-[150px] bg-black text-sm font-bold text-white rounded-full">
            Request
          </button>
          <button
            onClick={handleSendTransfer}
            className="px-4 py-3 bg-black w-[150px] text-sm font-bold text-white rounded-full"
          >
            Send
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-extrabold mt-10">Choose a payment type</h2>
        <p
          className="r
      text-sm font-semibold pb-8"
        >
          We’ll save this for all payments to Sd Gador. You can change this on
          the review screen.
        </p>
        <div className="p-4 w-[85%] border flex items-center rounded mb-4 hover:border-blue-400">
          <PiStorefront className="w-8 h-8" />
          <div className="w-[90%] pl-4">
            <p className="text-sm font-semibold pb-2">For good and services</p>
            <p className="text-xs font-semibold">
              Get a full refund if an eligible item gets lost or damaged. seller
              pays a small fee.
            </p>
          </div>
        </div>
        <Link
          href={`/profile/${username}/sendoption?amount=${amount}`}
          className="py-6 px-4 w-[85%] border flex items-center rounded mb-4 hover:border-blue-400"
        >
          <div className="w-full flex" onClick={() => setIsModalOpen(false)}>
            <LiaUserFriendsSolid className="w-8 h-8" />
            <div className="w-[80%] pl-4">
              <p className="text-sm font-semibold pb-2">
                For friends and family
              </p>
              <p className="text-xs font-semibold">
                Buyer protection doesn't apply for this payment.
              </p>
            </div>
          </div>
        </Link>

        <p className="text-blue-600 underline text-xs font-semibold p-4">
          More on goods and services Buyer Protection
        </p>
      </Modal>
    </div>
  );
}
