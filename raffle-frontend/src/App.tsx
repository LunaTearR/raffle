import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import WaitingPage from './pages/WaitingPage';
import RafflePage from './pages/RafflePage';
import LogsPage from './pages/LogsPage';
import ItemsPage from './pages/ItemsPage';
import { Button } from "@/components/ui/button";
import { Gift, Play, StopCircle, PackagePlus } from "lucide-react";

import { startRaffle, endRaffle } from './services/api';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const showNav = location.pathname === '/raffle' || location.pathname === '/logs' || location.pathname === '/waiting' || location.pathname === '/items';
  
  if (!showNav) return null;
  
  const isWaitingPage = location.pathname === '/waiting';
  const isRafflePage = location.pathname === '/raffle';
  
  const handleStartRaffle = async () => {
    try {
      if (confirm('Start the raffle? This will close registration.')) {
        await startRaffle();
        navigate('/raffle');
      }
    } catch (err) {
      alert('Failed to start raffle');
    }
  };
  
  const handleEndRaffle = async () => {
    if (confirm('Are you sure you want to end the raffle? This will close all sessions.')) {
      try {
        await endRaffle();
        navigate('/logs');
      } catch (err) {
        alert('Failed to end raffle');
      }
    }
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
            <Gift className="w-5 h-5" />
            <span className="hidden sm:inline">Raffle System</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Admin action buttons */}
            {isWaitingPage && (
              <Button
                onClick={handleStartRaffle}
                className="bg-green-500 hover:bg-green-600"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Raffle
              </Button>
            )}
            {isRafflePage && (
              <Button
                onClick={handleEndRaffle}
                variant="destructive"
                size="sm"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                End Raffle
              </Button>
            )}
            
            {/* Navigation links */}
            {!isWaitingPage && (
              <>
                <Button
                  asChild
                  variant={location.pathname === '/raffle' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link to="/raffle">Control Panel</Link>
                </Button>
                <Button
                  asChild
                  variant={location.pathname === '/logs' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link to="/logs">History</Link>
                </Button>
              </>
            )}
            {!isWaitingPage && (
              <Button
                asChild
                variant={location.pathname === '/items' ? 'default' : 'ghost'}
                size="sm"
              >
                <Link to="/items">
                  <PackagePlus className="w-4 h-4 mr-2" />
                  Items
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname === '/raffle' || location.pathname === '/logs' || location.pathname === '/waiting';
  
  return (
    <>
      <Navigation />
      <div className={showNav ? 'pt-[57px]' : ''}>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/waiting" element={<WaitingPage />} />
          <Route path="/raffle" element={<RafflePage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/items" element={<ItemsPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
