import React, { useState } from "react";
import '../styles/DragonTower.css'
import Navbar from "./Navbar";
import { useWallet } from "../contexts/WalletContext";
import Footer from "./Footer";




const difficulties = {
  Easy: 4,
  Medium: 3,
  Hard: 2,
};

const generateDragons = (rows, difficulty) => {
  return Array.from({ length: rows }, () =>
    Math.floor(Math.random() * difficulty)
  );
};

function DragonTower() {

  const { wallet, deductMoney, addMoney } = useWallet();

  const [difficulty, setDifficulty] = useState("Easy");
  const [dragons, setDragons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [cashOut, setCashOut] = useState(false);
  const [amount, setAmount] = useState(0);
  const [started, setStarted] = useState(false);

  const startGame = (e) => {
    e.preventDefault()
    if (amount > wallet) {
      alert("Insufficient balance!");
      return;
    }
    deductMoney(amount);
    const level = difficulties[difficulty];
    setDragons(generateDragons(10, level));
    setSelected([]);
    setGameOver(false);
    setCashOut(false);
    setStarted(true);
  };

  const handleTileClick = (row, index) => {
    if (!started || gameOver || cashOut || selected.length !== row) return;

    if (index === dragons[row]) {
      setGameOver(true);
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleCashOut = () => {
    setGameOver(false);
    setCashOut(false);
    setStarted(false);
    setSelected([]);
    setDragons([]);
    addMoney(parseFloat(earnings));
    alert(`You cashed out with $${earnings}`);
  };

  const handleHalf = (e) => {
    e.preventDefault();
    setAmount((prev) => parseFloat((prev / 2).toFixed(2)));
  };

  const handleDouble = (e) => {
    e.preventDefault();
    setAmount((prev) => parseFloat((prev * 2).toFixed(2)));
  };

  const getMultiplier = () => {
    if (gameOver) return "0.00";
    const base = difficulties[difficulty];
    if (base == 4){
      return (1.4 ** selected.length).toFixed(2);
    }
    else if (base == 3){
      return (1.6 ** selected.length).toFixed(2);
    }
    else {
      return (1.8 ** selected.length).toFixed(2);
    }

  };

  const multiplier = getMultiplier();
  const earnings = (amount * parseFloat(multiplier)).toFixed(2);


  return (
    <>
    <Navbar />
    <div className = 'main-layout2'>
      <div className="container2">
        <div className="tower2">
            {Array.from({ length: 10 }).map((_, row) => (
              <div
                className="row2"
                key={row}
                style={{
                  gridTemplateColumns: `repeat(${difficulties[difficulty]}, 1fr)`,
                }}
              >
              
              {Array.from({ length: difficulties[difficulty] }).map((_, index) => {
                const isRevealed = selected.length > row || gameOver || cashOut;
                const isDragon = dragons[row] === index;
                const isSelected = selected[row] === index;
                const isAvailable = started && row === selected.length && !gameOver && !cashOut;


                return (
                  <div
                    key={index}
                    className={`tile2 ${
                      isRevealed && isDragon
                        ? "dragon2"
                        : isSelected
                        ? "safe2"
                        : isAvailable
                        ? "available2"
                        : ""
                    }`}
                    onClick={() => handleTileClick(row, index)}
                  >
                    {isRevealed
                      ? isDragon
                        ? "🐉"
                        : isSelected
                        ? "💸"
                        : ""
                      : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>


      </div>
      <div className="right-navbar2">
        <form onSubmit={startGame}>
          <label htmlFor="amount2">Bet Amount</label>
          <input
            id="amount2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Enter Amount"
            step="any"
            disabled={started}
            required
          />
          <div className="half-double2">
                <button type="button" id="half2" onClick={handleHalf}>1/2</button>
                <button type="button" id="double2" onClick={handleDouble}>2x</button>
              </div>
          <label htmlFor="difficulty2">Difficulty Level</label>
          <select
            id="difficulty2"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={started}
            required
          >
            {Object.keys(difficulties).map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
          {!started ? (
              <input id="bet2" type="submit" value="Bet" />
            ) : (
              <div className="earnings-display2">
                    <label>Multiplier:</label>
                    <div className="earnings-box2">{multiplier}x</div>
                    <label>Potential Earnings:</label>
                    <div className="earnings-box2">${earnings}</div>
                    <button
                        id="cashout"
                        onClick={handleCashOut}
                    >
                        {gameOver ? 'Reset' : 'Cash Out'}
                    </button>
                  
                  </div>
            )}

        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default DragonTower;
