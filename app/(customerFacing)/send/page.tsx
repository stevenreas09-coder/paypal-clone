"use client";
import { Urbanist } from "next/font/google";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiInvoice } from "react-icons/pi";
import { useRouter } from "next/navigation";

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

// Extract two letters from name
const getInitials = (name: string): string => {
  if (!name) return "";
  const parts = name.split(" ").filter((p) => p.length > 0);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0]?.toUpperCase() || "";
};

// Stable random color based on index
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

export default function SendAndTransfer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [searchData, setSearchData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentResults, setRecentResults] = useState<User[]>([]);

  // Load JSON data
  useEffect(() => {
    fetch("/names.json")
      .then((res) => res.json())
      .then((data: User[]) => setSearchData(data))
      .catch((err) => console.error(err));
  }, []);

  // Load recent results from localStorage safely
  useEffect(() => {
    const saved = localStorage.getItem("recentResults");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentResults(parsed);
      } catch (e) {
        console.error("Failed to parse recentResults", e);
        setRecentResults([]);
      }
    }
  }, []);

  // Save recentResults to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recentResults", JSON.stringify(recentResults));
  }, [recentResults]);

  // Filter search with debounce (1.5 seconds)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (name.trim() === "") {
        setFilteredData([]);
        setShowDropdown(recentResults.length > 0);
      } else {
        const filtered = searchData.filter((user) =>
          `${user.name} ${user.username} ${user.email} ${user.mobile}`
            .toLowerCase()
            .includes(name.toLowerCase())
        );

        setFilteredData(filtered);
        setShowDropdown(filtered.length > 0);
      }
    }, 1000); // ⬅️ delay (1500ms = 1.5 seconds)

    return () => clearTimeout(delay);
  }, [name, searchData, recentResults]);

  // Handle click on user (both search & recent)
  const handleUserClick = (user: User) => {
    setName(user.name);
    setShowDropdown(false);

    setRecentResults((prev) => {
      const exists = prev.find((u) => u.username === user.username);
      if (exists) return prev;
      return [user, ...prev].slice(0, 5); // keep last 5
    });

    router.push(`/profile/${user.username}`);
  };

  return (
    <div className="container">
      <div className="w-full h-screen p-4 flex text-black">
        <div className="w-[60%] pl-[200px] flex-col space-y-4">
          <h1 className={`${urbanist.className} mt-4 font-black text-xl`}>
            Send and request money
          </h1>

          {/* Input + Dropdown */}
          <div className="relative w-[90%] mt-2">
            {name.length === 0 && (
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            )}
            <input
              placeholder="Name, username, email, mobile"
              className={`p-4 border border-gray-300 rounded-full text-xs w-full 
              transition-all duration-200
              outline-none shadow-none
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
              ${name.length === 0 ? "pl-10" : "p-2"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />

            {showDropdown && (
              <div
                className={`${urbanist.className} absolute mt-1 p-4 z-10 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto`}
              >
                <div className="flex">
                  <FiSearch className="w-5 h-5 ml-2 text-blue-500" />
                  <p className="px-7 font-semibold text-sm">
                    {name.length === 0 ? "Recent results" : "Search results"}
                  </p>
                </div>

                {/* Recent results */}
                {name.length === 0 &&
                  recentResults.length > 0 &&
                  recentResults.map((user, index) => (
                    <div
                      key={index}
                      className="py-4 hover:bg-gray-100 cursor-pointer text-xs flex flex-col"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-center">
                        <div className="pr-4">
                          {user.image !== "no image" ? (
                            <img
                              className="rounded-full w-10 h-10 object-fill"
                              src={`/userimage/${user.image}.jpg`}
                              alt={user.name}
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRandomBgColor(
                                index
                              )}`}
                            >
                              {getInitials(user.name)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{user.username}</div>
                          <div className="text-black font-semibold">
                            <span className="font-normal">@</span>
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Live search results */}
                {name.length > 0 &&
                  filteredData.map((user, index) => (
                    <div
                      key={index}
                      className="py-4 hover:bg-gray-100 cursor-pointer text-xs flex flex-col"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-center">
                        <div className="pr-4">
                          {user.image !== "no image" ? (
                            <img
                              className="rounded-full w-10 h-10 object-fill"
                              src={`/userimage/${user.image}.jpg`}
                              alt={user.name}
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRandomBgColor(
                                index
                              )}`}
                            >
                              {getInitials(user.name)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-black font-semibold">
                            <span className="font-normal">@</span>
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button className="text-black/10 font-bold px-6 py-2 mt-2 border-2 rounded-full bg-black/5">
            Next
          </button>

          <p
            className={`${urbanist.className} mt-4 p-2 text-blue-500 underline text-xs font-semibold`}
          >
            Show all contact
          </p>
        </div>

        <div className="w-[40%]">
          <h1
            className={`${urbanist.className} pb-4 mt-4 font-black text-xl w-[40%]`}
          >
            More options
          </h1>
          <div className="flex mt-2 items-center">
            <PiInvoice className="w-8 h-8" />
            <div className={`${urbanist.className} pl-2 text-xs font-semibold`}>
              Send an invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
