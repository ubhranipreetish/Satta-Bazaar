import { useState } from "react";
import Tile from "./Tile";
import { Howl } from "howler";
import "../styles/Mines.css"
import Navbar from "./Navbar";
import { useWallet } from "../contexts/WalletContext"; 


const TILE_COUNT = 25;
const gemSound = new Howl({ src: ["/sounds/gem.mp3"] });
const mineSound = new Howl({ src: ["/sounds/mine.mp3"] });

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

  // const revealTile = (index) => {
  //   if (!started || board[index].revealed || gameOver || cashedOut) return;

  //   const updatedBoard = [...board];
  //   updatedBoard[index] = { ...updatedBoard[index], revealed: true };

  //   if (updatedBoard[index].isMine) {
  //     mineSound.play();
  //     setGameOver(true);
  //     setEarnings(0);
  //   } else {
  //     gemSound.play();
  //     const newRevealed = revealedCount + 1;
  //     setRevealedCount(newRevealed);
  //     const newEarnings = calculateEarnings(newRevealed, amount, TILE_COUNT, mineCount);
  //     setEarnings(newEarnings);
  //   }
    

  //   setBoard(updatedBoard);
  // };

  const revealTile = (index) => {
    if (!started || board[index].revealed || gameOver || cashedOut) return;
  
    const updatedBoard = [...board];
    updatedBoard[index] = { ...updatedBoard[index], revealed: true };
  
    if (updatedBoard[index].isMine) {
      mineSound.play();
  
      // Reveal all tiles
      const fullyRevealedBoard = updatedBoard.map(tile => ({
        ...tile,
        revealed: true
      }));
  
      setBoard(fullyRevealedBoard);
      setGameOver(true);
      setEarnings(0);
      setMultiplier('0.00')
    } else {
      gemSound.play();
      const newRevealed = revealedCount + 1;
      setRevealedCount(newRevealed);
      const newEarnings = calculateEarnings(newRevealed, amount, TILE_COUNT, mineCount);
      setEarnings(newEarnings);
      setBoard(updatedBoard); // <- This was missing in your original for non-mine click
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
        <div className="left-navbar1">
            <form onSubmit={startGame}>
            <label htmlFor="amount1">Bet Amount</label>
            <br />
            <input
                id="amount1"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Enter Amount"
                step="any"
                required
            />
            <br />
            <button id="half1" onClick={handleHalf}>1/2</button>
            <button id="double1" onClick={handleDouble}>2x</button>
            <br />
            <label htmlFor="no-of-mines1">Mines</label>
            <br />
            <input
                id="no-of-mines1"
                type="number"
                value={mineCount}
                onChange={(e) => setMineCount(parseInt(e.target.value))}
                min="3"
                max="23"
                required
            />
            <br />
            {!started ? (
                <input id="bet1" type="submit" value="Bet" />
            ) : (
                <div className="earnings-display1">
                <label>Multiplier:</label>
                <div className="earnings-box1">{multiplier}x</div>
                <label>Potential Earnings:</label>
                <div className="earnings-box1">${earnings}</div>
                <button
                    style={{
                    marginTop: "10px",
                    width: "308px",
                    height: "40px",
                    backgroundColor: "#FFD700",
                    border: "none",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer"
                    }}
                    onClick={handleCashOut}
                >
                    Cash Out
                </button>
                
                </div>
            )}
            </form>
        </div>
        <div className="container1">
            <div className="child1111"></div>
            {[...Array(TILE_COUNT)].map((_, index) => (
            <Tile
                key={index}
                tile={board[index] || { revealed: false, isMine: false }}
                onClick={() => revealTile(index)}
            />
            ))}
            <div className="child21"></div>
        </div>
        </div>
    </div>
    </>
  );
}