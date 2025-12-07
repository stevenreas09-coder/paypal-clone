import { create } from "zustand";

interface BalanceState {
  balance: number;
  sendMoney: (amount: number) => void;
  addMoney: (amount: number) => void;
  setBalance: (amount: number) => void;
}

export const useBalanceStore = create<BalanceState>((set) => {
  // Read initial balance from localStorage, fallback to 100000
  const storedBalance =
    typeof window !== "undefined" ? localStorage.getItem("balance") : null;
  const initialBalance = storedBalance ? parseFloat(storedBalance) : 100000;

  return {
    balance: initialBalance,

    // Simple setter
    setBalance: (amount: number) => {
      localStorage.setItem("balance", amount.toString());
      set({ balance: amount });
    },

    sendMoney: (amount: number) =>
      set((state) => {
        let newBalance = state.balance - amount;

        // Reset if balance goes zero or below
        if (newBalance <= 0) {
          newBalance = 100000;
        }

        localStorage.setItem("balance", newBalance.toString());
        return { balance: newBalance };
      }),

    addMoney: (amount: number) =>
      set((state) => {
        const newBalance = state.balance + amount;
        localStorage.setItem("balance", newBalance.toString());
        return { balance: newBalance };
      }),
  };
});
