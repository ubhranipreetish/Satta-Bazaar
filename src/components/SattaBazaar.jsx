import { useNavigate } from "react-router-dom";
import "../styles/SattaBazaar.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WheelOfFortune from "./FortuneWheel";

export default function SattaBazaar() {
  const navigate = useNavigate();

  return (
    <div className="satta-container">
      <Navbar />

      <main className="satta-hero">
        <h1>Welcome to Satta Bazaar 🎲</h1>
        <p>Select a game to test your luck and win big!</p>

        <div className="game-cards">
          <div className="game-card" onClick={() => navigate("/mines")}>
            <div  className="game-icon">
              <img src="/images/Mines2.jpeg" alt="Mines" />
            </div>
            <div>
              <h2>Mines</h2>
              <p>Dodge the mines and multiply your money!</p>
            </div>
          </div>

          <div className="game-card" onClick={() => navigate("/dragon-tower")}>
            <div className="game-icon">
              <img src="/images/D_Tower2.webp" alt="Dragon Tower" />
            </div>
            <div>
              <h2>Dragon Tower</h2>
              <p>Climb levels, avoid dragons, and cash out smartly!</p>
            </div>
          </div>

          <div className="game-card" onClick={() => navigate("/wheel")}>
            <div className="game-icon">
              <img src="/images/wheel.jpg" alt="Dragon Tower" />
            </div>
            <div>
              <h2>Wheel Of Fortune</h2>
              <p>Spin the wheel and multiply your luck!</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

    </div>
  );
}
