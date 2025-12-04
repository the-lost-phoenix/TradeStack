import { useEffect, useState, useMemo } from "react";
import io from "socket.io-client";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import EscrowModal from "./components/EscrowModal";
import StockChart from "./components/StockChart";
import ProfileModal from "./components/ProfileModal";

// Helper Component for Notifications (Inline for simplicity)
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <div className={`fixed top-4 right-4 z-50 ${bgClass} text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:text-gray-200">×</button>
    </div>
  );
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const socket = io.connect(API_URL);

function App() {
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // UI States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Replaced specific email toast with generic notification system
  const [notification, setNotification] = useState(null);

  const [livePrices, setLivePrices] = useState([]);
  const [stockHistory, setStockHistory] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [availableStocks, setAvailableStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tradeModal, setTradeModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- THEME TOGGLE ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);
  const toggleTheme = () => setDarkMode(!darkMode);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetch(`${API_URL}/api/stocks`)
      .then(res => res.json())
      .then(data => setAvailableStocks(data))
      .catch(console.error);
  }, []);

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("stock_update", (newStocks) => {
      setLivePrices(newStocks);
      setStockHistory((prev) => {
        const next = { ...prev };
        newStocks.forEach((s) => {
          if (!next[s.code]) next[s.code] = [];
          next[s.code] = [...next[s.code], { price: s.price }].slice(-20);
        });
        return next;
      });
    });
    return () => { socket.off("connect"); socket.off("disconnect"); socket.off("stock_update"); };
  }, []);

  // --- HELPERS ---
  const getPrice = (code) => livePrices.find((s) => s.code === code)?.price || 0;

  const showToast = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- ACTIONS ---
  const handleGuestLogin = () => {
    setUser({
      _id: "guest", name: "Guest Trader", email: "guest@tradestack.io",
      virtualIban: "ES-GUEST-8821", walletBalance: 100000,
      subscribedStocks: ["GOOG", "TSLA"], portfolio: []
    });
    setShowLanding(false);
    showToast("Welcome, Guest Trader!");
  };

  const handleDeposit = async (amount) => {
    if (!user || user._id === "guest") {
      if (user._id === "guest") {
        setUser({ ...user, walletBalance: user.walletBalance + amount });
        showToast(`Deposited $${amount}`);
      }
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, amount, type: "DEPOSIT" }),
      });
      const data = await res.json();
      if (data.balance) {
        setUser({ ...user, walletBalance: data.balance });
        showToast(`Deposited $${amount} Successfully`);
      }
    } catch (e) {
      showToast("Deposit failed", "error");
    }
  };

  const handleTrade = async (quantity) => {
    if (!tradeModal || !user) return;

    // GUEST LOGIC
    if (user._id === "guest") {
      const price = getPrice(tradeModal.code);
      const cost = price * quantity;

      if (tradeModal.type === 'BUY') {
        if (user.walletBalance < cost) {
          showToast("Insufficient Funds", "error");
          return;
        }
        const newPortfolio = [...user.portfolio];
        const existing = newPortfolio.find(p => p.stockCode === tradeModal.code);
        if (existing) existing.quantity = parseInt(existing.quantity) + parseInt(quantity);
        else newPortfolio.push({ stockCode: tradeModal.code, quantity: parseInt(quantity), averageBuyPrice: price });

        setUser({ ...user, walletBalance: user.walletBalance - cost, portfolio: newPortfolio });
        showToast(`Bought ${quantity} ${tradeModal.code}`);
      } else if (tradeModal.type === 'SELL') {
        // Simple Guest Sell Logic
        const newPortfolio = [...user.portfolio];
        const existingIndex = newPortfolio.findIndex(p => p.stockCode === tradeModal.code);
        if (existingIndex === -1 || newPortfolio[existingIndex].quantity < quantity) {
          showToast("Not enough shares", "error");
          return;
        }
        newPortfolio[existingIndex].quantity -= quantity;
        if (newPortfolio[existingIndex].quantity <= 0) newPortfolio.splice(existingIndex, 1);

        setUser({ ...user, walletBalance: user.walletBalance + cost, portfolio: newPortfolio });
        showToast(`Sold ${quantity} ${tradeModal.code}`);
      }
      setTradeModal(null);
      return;
    }

    // REAL USER LOGIC
    try {
      const res = await fetch(`${API_URL}/api/trade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, stockCode: tradeModal.code, quantity: parseInt(quantity), type: tradeModal.type }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setTradeModal(null);
        if (tradeModal.type === 'BUY' && !user.subscribedStocks.includes(tradeModal.code)) {
          toggleSubscription(tradeModal.code, true); // Silent subscribe on buy
        }
        showToast(`${tradeModal.type} Successful`);
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("Trade failed", "error");
    }
  };

  const toggleSubscription = async (code, silent = false) => {
    if (!user) return;
    let newSubs = [...(user.subscribedStocks || [])];
    let isRemoving = false;

    if (newSubs.includes(code)) {
      // Removed the confirm() dialog here
      newSubs = newSubs.filter((s) => s !== code);
      isRemoving = true;
    } else {
      newSubs.push(code);
    }

    setUser({ ...user, subscribedStocks: newSubs });

    if (!silent) {
      showToast(isRemoving ? `Removed ${code} from Watchlist` : `Added ${code} to Watchlist`);
    }

    if (user._id !== "guest") {
      await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, subscribedStocks: newSubs }),
      });
    }
  };

  // --- DERIVED STATE ---
  const categories = useMemo(() => ["All", ...Array.from(new Set(availableStocks.map(s => s.category || "General")))], [availableStocks]);

  // Separation of concerns for Dashboard
  const portfolioStocks = useMemo(() => user ? (user.portfolio || []).filter(p => p.quantity > 0) : [], [user]);
  const watchlistStocks = useMemo(() => user ? (user.subscribedStocks || []).filter(code => !user.portfolio?.find(p => p.stockCode === code && p.quantity > 0)) : [], [user]);

  // Filtered Market Stocks
  const filteredMarketStocks = useMemo(() => {
    return availableStocks.filter(s => {
      const matchesSearch = s.code.includes(searchQuery) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableStocks, searchQuery, selectedCategory]);


  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} onGuestLogin={handleGuestLogin} darkMode={darkMode} toggleTheme={toggleTheme} />;
  if (!user) return <Login onLogin={(u) => { setUser(u); showToast("Welcome back!"); }} onBack={() => setShowLanding(true)} />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans p-4 md:p-8 transition-colors duration-300">

      {/* Generic Toast Notification */}
      {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-300 dark:border-gray-700 pb-6 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                Escrow<span className="text-gray-700 dark:text-white">Trade</span>
              </h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isConnected ? "border-green-500 text-green-600 dark:text-green-400" : "border-red-500 text-red-500"}`}>
                {isConnected ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-300 hover:scale-110 transition-transform">{darkMode ? "☀️" : "🌙"}</button>

            <div className="text-right hidden sm:block border-r border-gray-300 dark:border-gray-600 pr-6">
              <p className="text-[10px] uppercase text-gray-500 font-bold">Balance</p>
              <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">${user?.walletBalance?.toLocaleString()}</p>
            </div>

            <button onClick={() => setIsDepositModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all">+ Add</button>

            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 object-cover"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Profile
                  </button>
                  <button onClick={() => setUser(null)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button onClick={() => setActiveTab("dashboard")} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "dashboard" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}>Dashboard</button>
            <button onClick={() => setActiveTab("market")} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "market" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}>Marketplace</button>
          </div>

          {activeTab === "market" && (
            <div className="flex gap-2 w-full md:w-auto">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" placeholder="Search..." className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg w-full md:w-48 focus:outline-none focus:border-blue-500" onChange={(e) => setSearchQuery(e.target.value.toUpperCase())} />
            </div>
          )}
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">

            {/* 1. MY PORTFOLIO SECTION */}
            <div>
              <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                My Portfolio
              </h2>
              {portfolioStocks.length === 0 ? (
                <div className="text-gray-500 italic p-4 bg-white dark:bg-gray-800 rounded-lg">You don't own any stocks yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioStocks.map(holding => {
                    const code = holding.stockCode;
                    const stockData = livePrices.find(s => s.code === code) || { price: 0, name: "Loading..." };
                    const history = stockHistory[code] || [];
                    const isProfit = stockData.price >= (history[0]?.price || stockData.price);

                    return (
                      <div key={code} className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold dark:text-white">{code}</h3>
                            <p className="text-gray-500 text-xs">{stockData.name}</p>
                          </div>
                          <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold">
                            Owned: {holding.quantity}
                          </span>
                        </div>
                        <div className={`text-3xl font-mono font-bold mb-2 ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          ${stockData.price.toFixed(2)}
                        </div>
                        <div className="h-16 mb-4">
                          <StockChart data={history} color={isProfit ? "#16a34a" : "#dc2626"} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setTradeModal({ code, type: 'BUY' })} className="bg-green-100 text-green-700 py-2 rounded font-bold text-sm hover:bg-green-200">BUY</button>
                          <button onClick={() => setTradeModal({ code, type: 'SELL' })} className="bg-red-100 text-red-700 py-2 rounded font-bold text-sm hover:bg-red-200">SELL</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. WATCHLIST SECTION */}
            <div>
              <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                Watchlist
              </h2>
              {watchlistStocks.length === 0 ? (
                <div className="text-gray-500 italic p-4 bg-white dark:bg-gray-800 rounded-lg">Your watchlist is empty.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {watchlistStocks.map(code => {
                    const stockData = livePrices.find(s => s.code === code) || { price: 0, name: "Loading..." };
                    const history = stockHistory[code] || [];
                    const isProfit = stockData.price >= (history[0]?.price || stockData.price);

                    return (
                      <div key={code} className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold dark:text-white">{code}</h3>
                            <p className="text-gray-500 text-xs">{stockData.name}</p>
                          </div>
                          <button onClick={() => toggleSubscription(code)} className="text-gray-400 hover:text-red-500">
                            ✕
                          </button>
                        </div>
                        <div className="text-2xl font-mono font-bold mb-4 dark:text-white">
                          ${stockData.price.toFixed(2)}
                        </div>
                        <div className="h-12 mb-4 opacity-50">
                          <StockChart data={history} color={isProfit ? "#16a34a" : "#dc2626"} />
                        </div>
                        <button onClick={() => setTradeModal({ code, type: 'BUY' })} className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-500">Start Investing</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MARKETPLACE VIEW */}
        {activeTab === "market" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarketStocks.map(stock => {
              const isWatched = user.subscribedStocks.includes(stock.code);
              return (
                <div key={stock.code} className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">{stock.code}</h3>
                      <p className="text-gray-500 text-sm">{stock.name}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {stock.category || "General"}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">

                    <button
                      onClick={() => toggleSubscription(stock.code)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm border transition-colors ${isWatched ? 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-gray-300 text-gray-500 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400'}`}
                    >
                      {isWatched ? 'Watched' : 'Watch'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODALS */}
        <EscrowModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} onComplete={handleDeposit} />
        <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

        {tradeModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in">
              <h3 className="text-xl font-bold dark:text-white mb-4">Trade {tradeModal.code}</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleTrade(e.target.qty.value); }}>
                <input name="qty" type="number" min="1" autoFocus className="w-full bg-gray-100 dark:bg-gray-900 border dark:border-gray-600 p-3 rounded mb-4 dark:text-white focus:ring-2 ring-blue-500 outline-none" required placeholder="Quantity" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setTradeModal(null)} className="flex-1 bg-gray-200 dark:bg-gray-700 dark:text-white py-2 rounded font-medium">Cancel</button>
                  <button type="submit" className={`flex-1 text-white py-2 rounded font-bold ${tradeModal.type === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                    Confirm {tradeModal.type}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;