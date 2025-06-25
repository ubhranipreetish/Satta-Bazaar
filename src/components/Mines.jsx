import { useState, useRef, useEffect } from "react";
import Tile from "./Tile";
import { Howl } from "howler";
import "../styles/Mines.css"
import Navbar from "./Navbar";
import { useWallet } from "../contexts/WalletContext"; 
import Footer from "./Footer";


const TILE_COUNT = 25;


const generateBoard = (mineCount) => {
  const board = Array.from({ length: TILE_COUNT }, () => ({ isMine: false, revealed: false }));
  let minesPlaced = 0;
  let arrr = []
  while (minesPlaced < mineCount) {
    const index = Math.floor(Math.random() * TILE_COUNT);
    if (!board[index].isMine) {
      board[index] = { ...board[index], isMine: true };
      minesPlaced++;
      arrr.push(index)
    }
  }
  arrr.sort()
  console.log(arrr)
  return board;
};

export default function Mines() {

  const gemSound = useRef(null);
  const mineSound = useRef(null);

  useEffect(() => {
    gemSound.current = new Audio("/sounds/gem.mp3");
    mineSound.current = new Audio("/sounds/mine.mp3");

    gemSound.current.preload = "auto";
    mineSound.current.preload = "auto";

    const unlockAudio = () => {
      gemSound.current.load(); 
      mineSound.current.load(); 
      window.removeEventListener("touchstart", unlockAudio);
    };
    window.addEventListener("touchstart", unlockAudio, { once: true });
  }, []);

  const { wallet, deductMoney, addMoney } = useWallet();

  const [amount, setAmount] = useState(0);
  const [mineCount, setMineCount] = useState(3);
  const [board, setBoard] = useState([]);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [multiplier, setMultiplier] = useState('1.00');
  const [cashedOut, setCashedOut] = useState(false);

  const startGame = (e) => {
    e.preventDefault();
    if (amount > wallet) {
      alert("Insufficient balance!");
      return;
    }
    deductMoney(amount);
    setBoard(generateBoard(mineCount));
    setStarted(true);
    setGameOver(false);
    setRevealedCount(0);
    setEarnings(0);
    setMultiplier('1.00');
    setCashedOut(false);
  };
  

  const calculateEarnings = (revealed, bet, totalTiles, mines) => {
    const safeTiles = totalTiles - mines;
    if (revealed === 0) return bet;
    const multiplier2 = Math.pow((totalTiles / safeTiles), revealed) * 0.96;
    setMultiplier(String(multiplier2.toFixed(2)))
    return (bet * multiplier2).toFixed(2);
  };


  const revealTile = (index) => {
    if (!started || board[index].revealed || gameOver || cashedOut) return;
  
    const updatedBoard = [...board];
    updatedBoard[index] = { ...updatedBoard[index], revealed: true };
  
    if (updatedBoard[index].isMine) {
      if (mineSound.current) {
        mineSound.current.currentTime = 0;
        mineSound.current.play().catch(() => {});
      }
    
      const fullyRevealedBoard = updatedBoard.map(tile => ({
        ...tile,
        revealed: true
      }));
    
      setBoard(fullyRevealedBoard);
      setGameOver(true);
      setEarnings(0);
      setMultiplier("0.00");
    } else {
      if (gemSound.current) {
        gemSound.current.currentTime = 0;
        gemSound.current.play().catch(() => {});
      }
    
      const newRevealed = revealedCount + 1;
      setRevealedCount(newRevealed);
      const newEarnings = calculateEarnings(newRevealed, amount, TILE_COUNT, mineCount);
      setEarnings(newEarnings);
      setBoard(updatedBoard);
    
    }
  };
  
  

  const handleHalf = (e) => {
    e.preventDefault();
    setAmount((prev) => prev / 2);
  };

  const handleDouble = (e) => {
    e.preventDefault();
    setAmount((prev) => prev * 2);
  };

  const handleCashOut = () => {
    setStarted(false);
    setCashedOut(true);
    setBoard([]);
    addMoney(parseFloat(earnings));
    alert(`You cashed out with $${earnings}`);
  };
  
  
  

  return (
    <>
    <Navbar />
    <div className="app-wrapper1">
        <div className="main-layout1">
          <div className="container1">
              {[...Array(TILE_COUNT)].map((_, index) => (
              <Tile
                  key={index}
                  tile={board[index] || { revealed: false, isMine: false }}
                  onClick={() => revealTile(index)}
              />
              ))}
          </div>
          <div className="right-navbar1">
            <form onSubmit={startGame}>
              <label htmlFor="amount1">Bet Amount</label>
              <input
                  id="amount1"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  placeholder="Enter Amount"
                  step="any"
                  required
              />
              <div className="half-double">
                <button id="half1" onClick={handleHalf}>1/2</button>
                <button id="double1" onClick={handleDouble}>2x</button>
              </div>
              <label htmlFor="no-of-mines1">Mines</label>
              <input
                  id="no-of-mines1"
                  type="number"
                  value={mineCount}
                  onChange={(e) => setMineCount(parseInt(e.target.value))}
                  min="3"
                  max="23"
                  required
              />
              {!started ? (
                  <input id="bet1" type="submit" value="Bet" />
              ) : (
                  <div className="earnings-display1">
                    <label>Multiplier:</label>
                    <div className="earnings-box1">{multiplier}x</div>
                    <label>Potential Earnings:</label>
                    <div className="earnings-box1">${earnings}</div>
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
    </div>
    <Footer />
    </>
  );
}