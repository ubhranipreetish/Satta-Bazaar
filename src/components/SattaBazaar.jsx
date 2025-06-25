import { useNavigate } from "react-router-dom";
import "../styles/SattaBazaar.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SattaBazaar() {
  const navigate = useNavigate();

  const goToMines = () => {
    navigate("/mines");
  };

  const goToDragonTower = () => {
    navigate("/dragon-tower");
  };


  return (
    <div className="satta-container">
      <Navbar />
      <div className="text-center">
        <h1>Welcome to Satta Bazaar</h1>
        <p>Choose a game and start playing instantly</p>
      </div>

      <div className="grid-container">
        <div className="card" onClick={goToMines}>
          <div className="image green"></div>
          <div className="content">
            <h2>Mines</h2>
            <p>Test your intuition and win Big!</p>
          </div>
        </div>

        <div className="card" onClick={goToDragonTower}>
          <div className="image yellow"></div>
          <div className="content">
            <h2>Dragon Tower</h2>
            <p>Climb a tower by selecting tiles, the further you go, the higher the rewards!</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
