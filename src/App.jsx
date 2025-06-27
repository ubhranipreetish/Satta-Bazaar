import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SattaBazaar from "./components/SattaBazaar";
import Mines from "./components/Mines";
import DragonTower from "./components/DragonTower";
import { WalletProvider } from "./contexts/WalletContext"; 
import FortuneWheel from "./components/FortuneWheel";

function App() {
  return (
    <Router>
      <WalletProvider>
        <Routes>
          <Route path="/" element={<SattaBazaar />} />
          <Route path="/mines" element={<Mines />} />
          <Route path="/dragon-tower" element={<DragonTower />} />
          <Route path="/wheel" element={<FortuneWheel />} />
        </Routes>
      </WalletProvider>
    </Router>
  );
}

export default App;
