import { useWallet } from "../contexts/WalletContext";
import "../styles/Navbar.css"
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const { wallet, addMoney } = useWallet();
  const navigate = useNavigate();

  const handleAddMoney = () => {
    const amount = parseFloat(prompt("Enter amount to add:"));
    if (!isNaN(amount) && amount > 0) {
      addMoney(amount);
    } else {
      alert("Invalid amount!");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>Satta Bazaar</div>
      <div className="wallet-section">
        <span className="wallet">Wallet: ₹{wallet.toFixed(2)}</span>
        <button className="add-money-btn" onClick={handleAddMoney}>
          Add Money
        </button>
      </div>
    </nav>
  );
}
