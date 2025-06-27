
import React, { createContext, useContext, useState } from "react";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(100); 

  const addMoney = (amount) => setWallet((prev) => prev + amount);

  const deductMoney = (amount) => {
    if (wallet >= amount) {
      setWallet((prev) => prev - amount);
      return true;
    } else {
      alert("Insufficient balance");
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, addMoney, deductMoney }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
