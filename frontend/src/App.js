import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Explorer from "./components/Explorer/Explorer";
import BlockDetail from "./components/BlockDetail/BlockDetail";
import TransactionDetail from "./components/TransactionDetails/TransactionDetails";

const App = () => {
  return (
    <Router>
      <div className="App min-h-screen">
        <div className="gradient-bg-welcome h-screen w-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/block/:slot" element={<BlockDetail />} />
            <Route path="/tx/:signature" element={<TransactionDetail />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
