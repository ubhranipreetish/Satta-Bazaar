import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import "../styles/FortuneWheel.css";
import Navbar from "./Navbar";
import Footer from "./Footer";


const FortuneWheel = () => {

    const { wallet, deductMoney, addMoney } = useWallet();
  
    const [difficulty, setDifficulty] = useState("medium");
    const [segmentCount, setSegmentCount] = useState(20);
    const [amount, setAmount] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [earningsDisplay, setEarningsDisplay] = useState(false);
    const [started, setStarted] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [segments, setSegments] = useState([]);
    const [result, setResult] = useState(null);
    const [idx, setIdx] = useState(0);
    
    const winSound = useRef(null);
    const spinSound = useRef(null);
    
    const probabilityMap = {
        low: {
          "0x": 2,
          "1.20x": 7,
          "1.50x": 1
        },
        medium: {
          "0x": 5,
          "1.50x": 3,
          "2x": 1,
          "3x": 1
        },
        hard: (n) => ({
          "0.00x": n - 1,
          [`${(n - 0.50).toFixed(2)}x`]: 1
        })
      };

    const segment_structure = {
        low: ["0.00x","1.20x","1.20x","1.20x","1.50x","0.00x","1.20x","1.20x","1.20x","1.20x"],
        medium: ["0.00x","1.50x","0.00x","2.00x","0.00x","1.50x","0.00x","3.00x","0.00x","1.50x"]
    }

    const multi_divs = {
        low: ["0.00x","1.20x","1.50x"],
        medium: ["0.00x","1.50x","2.00x","3.00x"]
        
    }
    
      const difficulties = {
        low: 4,
        medium: 3,
        hard: 2
      };
      
      
    const multiplierColors = {
        "0.00x": "#406C82",
        "1.20x": "#D5E8F2",
        "1.50x": "#01E405",
        "2.00x": "#FDE908",
        "3.00x": "#8046FD",
        "9.50x": "#FC1144",
        "19.50x": "#FC1144",
        "29.50x": "#FC1144",
        "39.50x": "#FC1144",
      };
      
    const no_of_segments = [10, 20, 30, 40]
    const strokeWidth = 20;
    const wheelRef = useRef(null);


    useEffect(() => {
        winSound.current = new Audio("/sounds/win_wheel.mp3");
        spinSound.current = new Audio("/sounds/spin.mp3");
        
        winSound.current.preload = "auto";
        spinSound.current.preload = "auto";
        
        const unlockAudio = () => {
            winSound.current.load(); 
            spinSound.current.load(); 
            window.removeEventListener("touchstart", unlockAudio);
        };
        window.addEventListener("touchstart", unlockAudio, { once: true });
    }, []);


    const getResponsiveRadius = () => {
        const width = window.innerWidth;
      
        if (width > 1024) return 250;
        if (width > 500) return 200;
        if (width > 450) return 175;
        if (width > 400) return 150;
        return 125; 
      };
    
    const [radius, setRadius] = useState(getResponsiveRadius());

    useEffect(() => {
        const handleResize = () => {
          setRadius(getResponsiveRadius());
        };
      
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
      

    const generateSegments = (difficulty, segmentCount) => {

        const segments = [];

        if (difficulty === "hard") {
            const distribution = probabilityMap.hard(segmentCount);
            const totalParts = Object.values(distribution).reduce((sum, val) => sum + val, 0);
        
            Object.entries(distribution).forEach(([label, weight]) => {
            const count = Math.round((weight / totalParts) * segmentCount);
            for (let i = 0; i < count; i++) {
                segments.push({
                label,
                color: multiplierColors[label] || "#ccc"
                });
            }
            });
        } else {

            const times = Math.floor(segmentCount / 10);
            
            for (let i = 0; i < times; i++) {
                for (let j = 0; j < 10; j++) {
                const label = segment_structure[difficulty][j];
                segments.push({
                    label,
                    color: multiplierColors[label] || "#ccc"
                });
                }
            }
        }

    
        return segments
    };
  
    
  



    const createSegments = () => {
        const paths = [];
        const anglePerSegment = (2 * Math.PI) / segments.length;
      
        for (let i = 0; i < segments.length; i++) {
          const startAngle = (i * anglePerSegment) - (Math.PI/2) - (Math.PI/segments.length);
          const endAngle = startAngle + anglePerSegment;
      
          const x1 = radius + radius * Math.cos(startAngle);
          const y1 = radius + radius * Math.sin(startAngle);
          const x2 = radius + radius * Math.cos(endAngle);
          const y2 = radius + radius * Math.sin(endAngle);
      
          const path = `
            M ${radius + (radius - strokeWidth) * Math.cos(startAngle)} ${radius + (radius - strokeWidth) * Math.sin(startAngle)}
            A ${radius - strokeWidth} ${radius - strokeWidth} 0 0 1 ${radius + (radius - strokeWidth) * Math.cos(endAngle)} ${radius + (radius - strokeWidth) * Math.sin(endAngle)}
            L ${x2} ${y2}
            A ${radius} ${radius} 0 0 0 ${x1} ${y1}
            Z
          `;
      
          paths.push(
            <path d={path} fill={segments[i].color} key={i} />
          );
        }
      
        return paths;
      };
      
      const spinWheel = () => {
        const spins = Math.floor(Math.random() * 5) + 5;
        const anglePerSegment = 360 / segments.length;
        const picked = Math.floor(Math.random() * segments.length);
        const rotate = spins * 360 + (segments.length - picked) * anglePerSegment;

        const resultIndex = (idx + picked) % segments.length; 
        console.log(picked)
        console.log(resultIndex)

        setIdx(resultIndex); 

        if (spinSound.current) {
            spinSound.current.currentTime = 0;
            spinSound.current.play().catch(() => {});
          }
        
      
        setRotation((prevRotation) => {
          const newRotation = prevRotation + rotate;
      
          if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${newRotation}deg)`;
          }
      
          setTimeout(() => {
            const resultText = segments[resultIndex]?.label || "Unknown";
            setResult(resultText);
          
            const label = segments[resultIndex]?.label || "0x";
            const multiplier = parseFloat(label); 
            const earned = amount * (isNaN(multiplier) ? 0 : multiplier);
          
            addMoney(earned); 
            setStarted(false);
            setEarnings(earned)
            if (multiplier != 0){
                if (winSound.current) {
                    winSound.current.currentTime = 0;
                    winSound.current.play().catch(() => {});
                }
            }
            setEarningsDisplay(true)
          }, 4200);
          
      
          return newRotation;
        });
      };


    useEffect(() => {
        const newSegments = generateSegments(difficulty, segmentCount);
        setSegments(newSegments);
        setEarningsDisplay(false)
        setIdx(0)

         const wheel = wheelRef.current;
        if (wheel) {
            wheel.classList.add("no-transition");
            wheel.style.transform = `rotate(0deg)`;

            setTimeout(() => {
                wheel.classList.remove("no-transition");
                setRotation(0);
            }, 50);
        }
    }, [difficulty, segmentCount]);


    const startGame = (e) => {
      e.preventDefault()
      if (amount > wallet) {
        alert("Insufficient balance!");
        return;
      }
      deductMoney(amount);
      setStarted(true);
      setResult(null);
      setEarningsDisplay(false)
      spinWheel()
    };
  
    const handleHalf = (e) => {
      e.preventDefault();
      setAmount((prev) => parseFloat((prev / 2).toFixed(2)));
    };
  
    const handleDouble = (e) => {
      e.preventDefault();
      setAmount((prev) => parseFloat((prev * 2).toFixed(2)));
    };

  return (
    <>
        <Navbar />
        <div className="main-layout3">
            <div className="container3">
                <div className="wheel-wrapper">
                    <div className="pointer" />



  
  <svg
    width={radius * 2}
    height={radius * 2}
    className="wheel-svg"
    ref={wheelRef}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    {createSegments()}
    <circle
      cx={radius}
      cy={radius}
      r={radius / 3}
      stroke="#c0c0c0"
      strokeWidth="3"
      fill="none"
    />
  </svg>

  {earningsDisplay && (
    <div className="earnings-overlay">
      <div className="earnings-content earn-box">
        <div  style={{borderBottom:'3px solid #284654'}}>{result}</div>
        <div>${earnings.toFixed(2)}</div>
      </div>
    </div>
  )}
</div>
                    {
                        (difficulty == 'hard') ? (
                            <div className="multipliers">
                                <div className="multi" style={{borderBottomColor:multiplierColors['0.00x']}}>0.00x</div>
                                <div className="multi" style={{borderBottomColor:multiplierColors[`${(segmentCount-0.50).toFixed(2)}x`]}}>{(segmentCount-0.50).toFixed(2)}x</div>
                            </div>
                        ) : (
                            <div className="multipliers">
                                {
                                    multi_divs[difficulty].map((elem,idx) => (
                                        <div className="multi" key={idx} style={{borderBottomColor:multiplierColors[elem]}}>{elem}</div>
                                    ))
                                }
                            </div>
                        )
                    }

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
                <label htmlFor="difficulty2">Risk</label>
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

                <label htmlFor="segments-count">Segments</label>
                <select
                    id="segments-count"
                    value={segmentCount}
                    onChange={(e) => setSegmentCount(Number(e.target.value))}
                    disabled={started}
                    required
                >
                { no_of_segments.map((count) => (
                    <option key={count} value={count}>
                    {count}
                    </option>
                ))}
                </select>
                <input id="bet2" type="submit" value="Bet" disabled={started} />

                </form>
            </div>
        </div>
        <Footer />
    </>
  );
};

export default FortuneWheel;
