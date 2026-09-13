import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  ShieldAlert, ScanLine, FileCheck, 
  BarChart2, Activity, Network, Info
} from 'lucide-react';
import MLForensics from './pages/MLForensics';
import DLForensics from './pages/DLForensics';
import RealPassport from './pages/RealPassport';
import EDAInsights from './pages/EDAInsights';
import ModelEval from './pages/ModelEval';
import IdentityGraph from './pages/IdentityGraph';
import About from './pages/About';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <ShieldAlert size={32} color="var(--accent-primary)" />
        <span className="gradient-text">BORDER-AI</span>
      </div>
      
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <ScanLine size={20} /> ML Forensics
        </NavLink>
        <NavLink to="/dl-forensics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity size={20} /> DL Forensics
        </NavLink>
        <NavLink to="/real-passport" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FileCheck size={20} /> Real Passport
        </NavLink>
        <NavLink to="/eda" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <BarChart2 size={20} /> EDA & Insights
        </NavLink>
        <NavLink to="/model-eval" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity size={20} /> Model Eval
        </NavLink>
        <NavLink to="/graph" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Network size={20} /> Identity Graph
        </NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Info size={20} /> About
        </NavLink>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MLForensics />} />
            <Route path="/dl-forensics" element={<DLForensics />} />
            <Route path="/real-passport" element={<RealPassport />} />
            <Route path="/eda" element={<EDAInsights />} />
            <Route path="/model-eval" element={<ModelEval />} />
            <Route path="/graph" element={<IdentityGraph />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
