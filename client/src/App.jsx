import { useEffect, useState, useMemo } from "react";
import io from "socket.io-client";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react"; // CLERK IMPORTS

import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import EscrowModal from "./components/EscrowModal";
import StockChart from "./components/StockChart";
import ProfileModal from "./components/ProfileModal";
import StockDetailsModal from "./components/StockDetailsModal";
import FAQ from "./components/FAQ";
import LoadingAnimation from "./components/LoadingAnimation";
import NewsFeed from "./components/NewsFeed"; // <--- IMPORT NEWS FEED

import { API_URL } from "./config";
const socket = io.connect(API_URL);

// Helper Component for Notifications (Inline for simplicity)
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const borderClass = type === 'error' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500';
  return (
    <div className={`fixed top-4 right-4 z-[100] bg-space-black/90 backdrop-blur-md border ${borderClass} text-starlight px-6 py-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-bounce-in font-rajdhani uppercase tracking-widest clip-path-polygon`} style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}>
      <span className="font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:text-white transition-colors">✕</button>
    </div>
  );
};

// Helper to generate a logo URL
const getStockLogo = (code, logoUrl) => {
  if (logoUrl) return logoUrl;
  return `https://ui-avatars.com/api/?name=${code}&background=0D8ABC&color=fff&size=128&bold=true`;
};

function App() {
  // CLERK HOOKS
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(!isSignedIn);
  const [darkMode, setDarkMode] = useState(true);

  // UI States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
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
  const [selectedStock, setSelectedStock] = useState(null);

  const [newsList, setNewsList] = useState([]); // <--- NEWS STATE

  // --- CLERK USER SYNC ---
  const [syncError, setSyncError] = useState(false);
  const [requiresSignup, setRequiresSignup] = useState(false);

  const syncUser = async (retryWithCreate = false) => {
    if (isSignedIn && clerkUser) {
      try {
        const res = await fetch(`${API_URL}/api/auth/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
            avatar: clerkUser.imageUrl,
            createIfMissing: retryWithCreate // Control flag
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setShowLanding(false);
          setSyncError(false);
          setRequiresSignup(false);
        } else if (res.status === 404) {
          // User doesn't exist yet -> show signup prompt
          setRequiresSignup(true);
          setShowLanding(false); // Hide landing to show signup prompt
        } else {
          console.error("Sync API Error:", data);
          setSyncError(true);
        }
      } catch (error) {
        console.error("Sync Network Error:", error);
        setSyncError(true);
      }
    }
  };

  useEffect(() => {
    if (isClerkLoaded && isSignedIn) {
      syncUser(false); // Default: Try to find, do not create
    }
  }, [isClerkLoaded, isSignedIn, clerkUser]);

  const handleCreateAccount = () => {
    syncUser(true);
  };


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

    // Fetch Initial News
    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => setNewsList(data))
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
        return next;
      });
    });

    socket.on("news_update", (newItem) => {
      setNewsList((prev) => [newItem, ...prev].slice(0, 50)); // Keep last 50
      showToast("Incoming Data Stream: Market Update", "info");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("stock_update");
      socket.off("news_update");
    };
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
    showToast("Login Sequence Complete: Guest Access Granted");
  };

  const handleDeposit = async (amountInput) => {
    const amount = parseFloat(amountInput);
    if (amount < 1000) {
      showToast("Minimum injection required: $1000", "error");
      return;
    }
    if (!user || user._id === "guest") {
      if (user._id === "guest") {
        setUser({ ...user, walletBalance: user.walletBalance + amount });
        showToast(`Credits Injected: $${amount}`);
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
      if (data.balance !== undefined) {
        setUser({ ...user, walletBalance: data.balance, history: data.history });
        showToast(`Transfer Confirmed: +$${amount}`);
      }
    } catch (e) {
      showToast("Transaction Failed: API Error", "error");
    }
  };

  const handleWithdraw = async (amountInput) => {
    const amount = parseFloat(amountInput);
    if (amount <= 0) {
      showToast("Invalid quantum", "error");
      return;
    }
    if (user.walletBalance < amount) {
      showToast("Insufficient Credits", "error");
      return;
    }

    if (!user || user._id === "guest") {
      if (user._id === "guest") {
        setUser({ ...user, walletBalance: user.walletBalance - amount });
        showToast(`Credits Withdrawn: -$${amount}`);
      }
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, amount, type: "WITHDRAW" }),
      });
      const data = await res.json();
      if (data.balance !== undefined) {
        setUser({ ...user, walletBalance: data.balance, history: data.history });
        showToast(`Withdrawal Processed: -$${amount}`);
      } else {
        showToast(data.message || "Withdrawal failed", "error");
      }
    } catch (e) {
      showToast("Withdrawal Error: Network Failure", "error");
    }
  };

  const handleTrade = async (quantity) => {
    if (!tradeModal || !user) return;

    // PRE-VALIDATION (Check locally first)
    const price = getPrice(tradeModal.code);
    const cost = price * quantity;

    if (tradeModal.type === 'BUY') {
      if (user.walletBalance < cost) {
        alert(`Insufficient Credits!\n\nCost: $${cost.toFixed(2)}\nBalance: $${user.walletBalance.toFixed(2)}`);
        return;
      }
    } else if (tradeModal.type === 'SELL') {
      const existing = user.portfolio?.find(p => p.stockCode === tradeModal.code);
      if (!existing || existing.quantity < quantity) {
        alert(`Insufficient Assets!\n\nOwned: ${existing ? existing.quantity : 0}\nSelling: ${quantity}`);
        return;
      }
    }

    // CONFIRM
    if (!confirm(`Confirm execution: ${tradeModal.type} ${quantity} units of ${tradeModal.code}?`)) return;

    // GUEST LOGIC
    if (user._id === "guest") {
      if (tradeModal.type === 'BUY') {
        const newPortfolio = [...user.portfolio];
        const existing = newPortfolio.find(p => p.stockCode === tradeModal.code);
        if (existing) existing.quantity = parseInt(existing.quantity) + parseInt(quantity);
        else newPortfolio.push({ stockCode: tradeModal.code, quantity: parseInt(quantity), averageBuyPrice: price });

        setUser({ ...user, walletBalance: user.walletBalance - cost, portfolio: newPortfolio });
        alert(`Trade Executed: Acquired ${quantity} ${tradeModal.code}`);
      } else if (tradeModal.type === 'SELL') {
        const newPortfolio = [...(user.portfolio || [])];
        const existingIndex = newPortfolio.findIndex(p => p.stockCode === tradeModal.code);
        if (existingIndex !== -1) {
          newPortfolio[existingIndex].quantity -= quantity;
          if (newPortfolio[existingIndex].quantity <= 0) newPortfolio.splice(existingIndex, 1);
          setUser({ ...user, walletBalance: user.walletBalance + cost, portfolio: newPortfolio });
          alert(`Trade Executed: Liquidated ${quantity} ${tradeModal.code}`);
        }
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
        alert(`Market Order Complete!\n${tradeModal.type} ${quantity} ${tradeModal.code}`);
      } else {
        alert(data.message || "Execution Failed");
      }
    } catch (e) {
      alert("Execution Error: Network Fault");
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
      showToast(isRemoving ? `Removed ${code} from Monitor` : `Tracking ${code}`);
    }

    if (user._id !== "guest") {
      await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, subscribedStocks: newSubs }),
      });
    }
  };

  const handleDeleteAccount = async () => {
    // Check for remaining balance
    if (user.walletBalance > 0) {
      alert(`Termination Blocked!\n\nWallet contains $${user.walletBalance.toLocaleString()}.\nWithdraw funds before termination.`);
      return;
    }

    // Check for remaining stocks
    const hasStocks = user.portfolio.some(p => p.quantity > 0);
    if (hasStocks) {
      alert(`Termination Blocked!\n\nPortfolio contains active assets.\nLiquidate positions before termination.`);
      return;
    }

    if (!confirm("WARN: Irreversible data wipe initiated. Confirm termination?")) return;

    try {
      const res = await fetch(`${API_URL}/api/user/${user._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("User Data Wiped");
        // Force logout from Clerk as well
        handleLogout();
      } else {
        showToast("Wipe Failed", "error");
      }
    } catch (e) {
      showToast("System Error", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setShowLanding(true);
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Logout Error:", err);
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


  if (requiresSignup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-space-black text-starlight">
        <div className="bg-deep-space p-8 rounded-none border border-nebula-blue/30 shadow-[0_0_50px_rgba(20,33,61,0.5)] max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-solar-flare to-transparent"></div>
          <div className="w-20 h-20 bg-nebula-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10 border border-nebula-blue/40">
            <svg className="w-10 h-10 text-solar-flare" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-orbitron font-bold mb-2 text-starlight">IDENTITY NOT FOUND</h2>
          <p className="text-starlight/60 mb-6 font-rajdhani">
            No secure clearance found for <b>{clerkUser?.primaryEmailAddress?.emailAddress}</b>.
          </p>
          <button
            onClick={handleCreateAccount}
            className="w-full bg-solar-flare hover:bg-white text-space-black font-orbitron font-bold py-3 uppercase tracking-widest mb-3 transition-colors clip-path-polygon"
            style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}
          >
            Initialize Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-white/20 hover:border-solar-flare/50 text-starlight/70 hover:text-white font-rajdhani font-bold py-3 uppercase tracking-widest transition-colors"
          >
            Abort Connection
          </button>
        </div>
      </div>
    );
  }


  if (!isClerkLoaded || (isSignedIn && !user && !requiresSignup)) {
    return <LoadingAnimation />;
  }

  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} onGuestLogin={handleGuestLogin} darkMode={darkMode} toggleTheme={toggleTheme} />;
  if (!user) return <Login onLogin={(u) => { setUser(u); showToast("Access Granted"); }} onBack={() => setShowLanding(true)} />;

  return (
    <div className="min-h-screen bg-space-black text-starlight font-inter p-4 md:p-8 overflow-x-hidden relative">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-nebula-blue/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      {/* Generic Toast Notification */}
      {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/5 pb-6 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-starlight via-solar-flare to-starlight tracking-widest uppercase">
                Trade<span className="text-stroke-solar-flare">Stack</span>
              </h1>
              <span className={`px-2 py-0.5 mt-2 text-[10px] font-bold font-rajdhani uppercase tracking-widest border ${isConnected ? "border-green-500/50 text-green-400 bg-green-900/10" : "border-red-500/50 text-red-500 bg-red-900/10"}`}>
                {isConnected ? "System: Online" : "System: Offline"}
              </span>
            </div>
            <p className="text-starlight/40 text-xs font-rajdhani font-medium mt-1 uppercase tracking-[0.2em]">
              Welcome back, Commander <span className="text-solar-flare font-bold">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-deep-space/50 p-4 border border-nebula-blue/30 backdrop-blur-md shadow-[0_0_20px_rgba(20,33,61,0.3)] clip-path-polygon" style={{ clipPath: 'polygon(2% 0, 100% 0, 100% 90%, 98% 100%, 0 100%, 0 10%)' }}>
              <div className="text-right hidden sm:block border-r border-white/10 pr-6 mr-2">
                <p className="text-[10px] uppercase text-nebula-blue font-bold tracking-widest font-rajdhani">Credit Balance</p>
                <p className="font-orbitron text-xl font-bold text-starlight drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">${user?.walletBalance?.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setIsWithdrawModalOpen(true)} className="bg-transparent border border-white/20 hover:border-red-500 hover:text-red-400 text-starlight/70 px-4 py-2 font-rajdhani font-bold text-xs uppercase tracking-wider transition-all">Withdraw</button>
                <button onClick={() => setIsDepositModalOpen(true)} className="bg-solar-flare hover:bg-white text-space-black px-4 py-2 font-orbitron font-bold text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(252,163,17,0.3)] transition-all">+ Inject</button>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity border-2 border-solar-flare rounded-full p-0.5 shadow-[0_0_10px_rgba(252,163,17,0.4)] bg-deep-space">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-64 bg-deep-space border border-nebula-blue/50 shadow-[0_0_30px_rgba(20,33,61,0.8)] z-50 animate-fade-in-up origin-top-right">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-solar-flare to-transparent"></div>
                  <div className="px-4 py-4 border-b border-white/5">
                    <p className="text-sm font-bold text-starlight font-orbitron truncate">{user.name}</p>
                    <p className="text-xs text-starlight/40 truncate font-mono mb-2">{user.email}</p>
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/5">
                      <span className="text-[10px] text-starlight/50 font-rajdhani uppercase">IV-IBAN:</span>
                      <span className="text-xs text-solar-flare font-mono font-bold tracking-wider">{user.virtualIban || "----"}</span>
                    </div>
                  </div>
                  <button onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-starlight/80 hover:bg-white/5 hover:text-solar-flare font-rajdhani uppercase tracking-wider transition-colors">
                    Access Profile
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 font-bold font-rajdhani uppercase tracking-wider transition-colors border-t border-white/5 flex justify-between items-center group">
                    <span>Disconnect</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">[LOGOUT]</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="flex bg-deep-space/30 p-1 border border-white/5 w-full overflow-x-auto no-scrollbar clip-path-polygon" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
            {["dashboard", "market", "history", "faq"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap flex-shrink-0 px-6 py-2 text-sm font-bold uppercase tracking-widest font-orbitron transition-all relative overflow-hidden ${activeTab === tab
                  ? "text-space-black bg-starlight shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "text-starlight/40 hover:text-starlight hover:bg-white/5"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "market" && (
            <div className="flex gap-2 w-full md:w-auto font-rajdhani">
              <select
                className="bg-deep-space/50 border border-white/10 text-starlight px-4 py-2 focus:outline-none focus:border-solar-flare uppercase tracking-wide text-xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-deep-space text-starlight">{cat}</option>)}
              </select>
              <input
                type="text"
                placeholder="SEARCH ASSETS..."
                className="bg-deep-space/50 border border-white/10 text-starlight px-4 py-2 w-full md:w-64 focus:outline-none focus:border-solar-flare placeholder-starlight/20 uppercase tracking-widest text-xs font-bold"
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              />
            </div>
          )}
        </div>





        {/* DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: Portfolio & Watchlist (Takes 2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-8">

              {/* 1. MY PORTFOLIO SECTION */}
              <div>
                <h2 className="text-xl font-orbitron font-bold text-starlight mb-6 flex items-center gap-3 border-b border-white/5 pb-2">
                  <span className="w-1 h-6 bg-solar-flare shadow-[0_0_10px_#fca311]"></span>
                  Active Assets
                </h2>
                {portfolioStocks.length === 0 ? (
                  <div className="text-starlight/30 italic p-8 bg-deep-space/30 border border-white/5 text-center font-rajdhani">No active holdings detected in portfolio matrix.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioStocks.map(holding => {
                      const code = holding.stockCode;
                      const stockData = livePrices.find(s => s.code === code) || { price: 0, name: "Loading...", category: "Unknown" };
                      const history = stockHistory[code] || [];
                      const isProfit = stockData.price >= (history[0]?.price || stockData.price);

                      return (
                        <div key={code}
                          onClick={() => setSelectedStock(stockData)}
                          className="group bg-deep-space/40 hover:bg-deep-space/60 p-6 border border-white/5 hover:border-solar-flare/50 shadow-lg relative overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-sm"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%, 0 90%)' }}>

                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                              <img
                                src={getStockLogo(code, stockData.logo)}
                                alt={code}
                                className="w-12 h-12 rounded-full border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-white p-1"
                              />
                              <div>
                                <h3 className="text-2xl font-orbitron font-bold text-starlight group-hover:text-solar-flare transition-colors">{code}</h3>
                                <p className="text-starlight/60 text-xs uppercase font-rajdhani tracking-wider font-bold">{stockData.name}</p>
                                <span className="text-[10px] text-nebula-blue font-bold uppercase tracking-widest">{stockData.category || "General"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-end mb-4 relative z-10">
                            <div className={`text-3xl font-orbitron font-bold drop-shadow-md ${isProfit ? "text-green-400" : "text-red-500"}`}>
                              ${stockData.price.toFixed(2)}
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-starlight/50 uppercase tracking-widest mb-1">Quantity</p>
                              <span className="bg-solar-flare/20 border border-solar-flare/50 text-solar-flare font-orbitron font-bold px-3 py-1 text-sm shadow-[0_0_10px_rgba(252,163,17,0.2)]">
                                {holding.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="h-16 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <StockChart data={history} color={isProfit ? "#4ade80" : "#f87171"} />
                          </div>

                          <div className="grid grid-cols-2 gap-2 relative z-10">
                            <button onClick={(e) => { e.stopPropagation(); setTradeModal({ code, type: 'BUY' }); }} className="bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black py-2 font-orbitron font-bold text-xs transition-all uppercase">BUY</button>
                            <button onClick={(e) => { e.stopPropagation(); setTradeModal({ code, type: 'SELL' }); }} className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black py-2 font-orbitron font-bold text-xs transition-all uppercase">SELL</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. WATCHLIST SECTION */}
              <div>
                <h2 className="text-xl font-orbitron font-bold text-starlight mb-6 flex items-center gap-3 border-b border-white/5 pb-2">
                  <span className="w-1 h-6 bg-nebula-blue shadow-[0_0_10px_#14213d]"></span>
                  Surveillance List
                </h2>
                {watchlistStocks.length === 0 ? (
                  <div className="text-starlight/30 italic p-8 bg-deep-space/30 border border-white/5 text-center font-rajdhani">Surveillance matrix is empty.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchlistStocks.map(code => {
                      const stockData = livePrices.find(s => s.code === code) || { price: 0, name: "Loading...", category: "Unknown" };
                      const history = stockHistory[code] || [];
                      const isProfit = stockData.price >= (history[0]?.price || stockData.price);

                      return (
                        <div key={code}
                          onClick={() => setSelectedStock(stockData)}
                          className="group bg-deep-space/20 hover:bg-deep-space/40 p-6 border border-white/5 hover:border-nebula-blue/50 cursor-pointer transition-all duration-300 relative">

                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getStockLogo(code, stockData.logo)}
                                alt={code}
                                className="w-10 h-10 rounded-full border border-white/10 opacity-80 bg-white p-0.5"
                              />
                              <div>
                                <h3 className="text-lg font-orbitron font-bold text-starlight/80 group-hover:text-solar-flare transition-colors">{code}</h3>
                                <p className="text-starlight/40 text-[10px] uppercase font-rajdhani tracking-wider font-bold">{stockData.name}</p>
                                <span className="text-[9px] text-nebula-blue uppercase tracking-widest font-bold block mt-0.5">{stockData.category || "General"}</span>
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); toggleSubscription(code); }} className="text-starlight/20 hover:text-red-500 z-10 p-1 transition-colors">
                              ✕
                            </button>
                          </div>
                          <div className="text-2xl font-mono font-bold mb-4 text-starlight drop-shadow-sm pl-2 border-l-2 border-white/10">
                            ${stockData.price.toFixed(2)}
                          </div>
                          <div className="h-12 mb-4 opacity-30 group-hover:opacity-60 transition-opacity">
                            <StockChart data={history} color={isProfit ? "#4ade80" : "#f87171"} />
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setTradeModal({ code, type: 'BUY' }); }} className="w-full border border-solar-flare/30 text-solar-flare hover:bg-solar-flare hover:text-space-black py-2 font-orbitron font-bold text-xs uppercase transition-all z-10 relative">Initialize Purchase</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: AI News Feed (Takes 1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <NewsFeed news={newsList} stocks={availableStocks} />
            </div>

          </div>
        )}

        {/* MARKETPLACE VIEW */}
        {activeTab === "market" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarketStocks.map(stock => {
              const isWatched = user.subscribedStocks.includes(stock.code);
              return (
                <div key={stock.code} className="bg-deep-space/30 p-6 border border-white/5 hover:border-solar-flare/20 flex flex-col justify-between transition-all hover:bg-deep-space/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getStockLogo(stock.code, stock.logo)}
                        alt={stock.code}
                        className="w-12 h-12 rounded-full border border-white/10 bg-white p-1"
                      />
                      <div>
                        <h3 className="text-2xl font-orbitron font-bold text-starlight">{stock.code}</h3>
                        <p className="text-starlight/50 text-xs font-rajdhani uppercase tracking-wider font-bold">{stock.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-nebula-blue/20 text-nebula-blue font-rajdhani px-2 py-1 tracking-widest border border-nebula-blue/30 rounded-sm">
                      {stock.category || "General"}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => toggleSubscription(stock.code)}
                      className={`w-full px-4 py-2 font-bold text-xs uppercase tracking-widest font-orbitron border transition-colors ${isWatched ? 'border-amber-500 text-amber-500 bg-amber-900/10' : 'border-white/10 text-starlight/40 hover:text-starlight hover:border-white/30'}`}
                    >
                      {isWatched ? 'MONITORED' : 'ADD TO MONITOR'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY VIEW */}
        {activeTab === "history" && (
          <div className="bg-deep-space/30 border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-rajdhani">
                <thead className="bg-white/5 text-starlight/50 uppercase font-bold text-xs tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Operation</th>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">Units</th>
                    <th className="px-6 py-4">Unit Price</th>
                    <th className="px-6 py-4 text-right">Net Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {user?.history?.slice().reverse().map((txn, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors text-starlight/80">
                      <td className="px-6 py-4 font-mono text-xs">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${txn.type === 'DEPOSIT' ? 'border-green-500/30 text-green-400' :
                          txn.type === 'WITHDRAW' ? 'border-red-500/30 text-red-400' :
                            txn.type === 'BUY' ? 'border-blue-500/30 text-blue-400' : 'border-amber-500/30 text-amber-400'
                          }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold font-orbitron">{txn.stockCode || '-'}</td>
                      <td className="px-6 py-4 font-mono">{txn.quantity || '-'}</td>
                      <td className="px-6 py-4 font-mono text-starlight/60">{txn.price ? `$${txn.price.toFixed(2)}` : '-'}</td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${txn.type === 'DEPOSIT' || txn.type === 'SELL' ? 'text-green-400' : 'text-red-400'}`}>
                        {txn.type === 'DEPOSIT' || txn.type === 'SELL' ? '+' : '-'}${txn.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!user?.history || user.history.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-starlight/30 italic">No historical data logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ VIEW */}
        {activeTab === "faq" && <FAQ />}

        {/* MODALS */}
        <EscrowModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} onComplete={handleDeposit} mode="DEPOSIT" />
        <EscrowModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} onComplete={handleWithdraw} mode="WITHDRAW" />


        <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onDelete={handleDeleteAccount} />

        <StockDetailsModal stock={selectedStock} isOpen={!!selectedStock} onClose={() => setSelectedStock(null)} />

        {tradeModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-deep-space p-8 border border-nebula-blue/40 shadow-[0_0_50px_rgba(252,163,17,0.2)] w-full max-w-sm animate-fade-in relative overflow-hidden" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-solar-flare to-transparent"></div>

              <h3 className="text-2xl font-black font-orbitron text-starlight mb-6 uppercase">Execute: <span className="text-solar-flare">{tradeModal.code}</span></h3>

              <form onSubmit={(e) => { e.preventDefault(); handleTrade(e.target.qty.value); }}>
                <div className="mb-6">
                  <label className="block text-xs font-rajdhani font-bold text-starlight/50 uppercase tracking-widest mb-2">Quantity</label>
                  <input name="qty" type="number" min="1" autoFocus className="w-full bg-space-black border border-white/20 p-4 text-starlight font-mono text-xl focus:border-solar-flare focus:ring-1 focus:ring-solar-flare/50 outline-none transition-all placeholder-white/10" required placeholder="00" />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setTradeModal(null)} className="flex-1 bg-transparent border border-white/20 text-starlight/60 hover:text-white hover:border-white py-3 font-rajdhani font-bold uppercase tracking-wider text-xs transition-all">Cancel</button>
                  <button type="submit" className={`flex-1 text-space-black font-orbitron font-bold uppercase tracking-widest text-xs py-3 border border-transparent shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all transform hover:scale-105 ${tradeModal.type === 'BUY' ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'}`}>
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