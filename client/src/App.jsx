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

// Helper Component for Notifications (Inline for simplicity)
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <div className={`fixed top-4 right-4 z-[100] ${bgClass} text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:text-gray-200">×</button>
    </div>
  );
};

import { API_URL } from "./config";
const socket = io.connect(API_URL);

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

  const handleDeposit = async (amountInput) => {
    const amount = parseFloat(amountInput);
    if (amount < 1000) {
      showToast("Minimum deposit is $1000", "error");
      return;
    }
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
      if (data.balance !== undefined) {
        setUser({ ...user, walletBalance: data.balance, history: data.history });
        showToast(`Deposited $${amount} Successfully`);
      }
    } catch (e) {
      showToast("Deposit failed", "error");
    }
  };

  const handleWithdraw = async (amountInput) => {
    const amount = parseFloat(amountInput);
    if (amount <= 0) {
      showToast("Invalid amount", "error");
      return;
    }
    if (user.walletBalance < amount) {
      showToast("Insufficient Funds", "error");
      return;
    }

    if (!user || user._id === "guest") {
      if (user._id === "guest") {
        setUser({ ...user, walletBalance: user.walletBalance - amount });
        showToast(`Withdrew $${amount}`);
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
        showToast(`Withdrew $${amount} Successfully`);
      } else {
        showToast(data.message || "Withdrawal failed", "error");
      }
    } catch (e) {
      showToast("Withdrawal failed", "error");
    }
  };

  const handleTrade = async (quantity) => {
    if (!tradeModal || !user) return;

    // PRE-VALIDATION (Check locally first)
    const price = getPrice(tradeModal.code);
    const cost = price * quantity;

    if (tradeModal.type === 'BUY') {
      if (user.walletBalance < cost) {
        alert(`Insufficient Funds!\n\nCost: $${cost.toFixed(2)}\nBalance: $${user.walletBalance.toFixed(2)}`);
        return;
      }
    } else if (tradeModal.type === 'SELL') {
      const existing = user.portfolio?.find(p => p.stockCode === tradeModal.code);
      if (!existing || existing.quantity < quantity) {
        alert(`Not enough shares to sell!\n\nOwned: ${existing ? existing.quantity : 0}\nSelling: ${quantity}`);
        return;
      }
    }

    // CONFIRM
    if (!confirm(`Are you sure you want to ${tradeModal.type} ${quantity} shares of ${tradeModal.code}?`)) return;

    // GUEST LOGIC
    if (user._id === "guest") {
      if (tradeModal.type === 'BUY') {
        const newPortfolio = [...user.portfolio];
        const existing = newPortfolio.find(p => p.stockCode === tradeModal.code);
        if (existing) existing.quantity = parseInt(existing.quantity) + parseInt(quantity);
        else newPortfolio.push({ stockCode: tradeModal.code, quantity: parseInt(quantity), averageBuyPrice: price });

        setUser({ ...user, walletBalance: user.walletBalance - cost, portfolio: newPortfolio });
        alert(`Successfully Bought ${quantity} ${tradeModal.code}!`);
      } else if (tradeModal.type === 'SELL') {
        const newPortfolio = [...(user.portfolio || [])];
        const existingIndex = newPortfolio.findIndex(p => p.stockCode === tradeModal.code);
        if (existingIndex !== -1) {
          newPortfolio[existingIndex].quantity -= quantity;
          if (newPortfolio[existingIndex].quantity <= 0) newPortfolio.splice(existingIndex, 1);
          setUser({ ...user, walletBalance: user.walletBalance + cost, portfolio: newPortfolio });
          alert(`Successfully Sold ${quantity} ${tradeModal.code}!`);
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
        alert(`Transaction Successful!\n${tradeModal.type} ${quantity} ${tradeModal.code}`);
      } else {
        alert(data.message || "Trade Failed");
      }
    } catch (e) {
      alert("Trade failed: Server Error");
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

  const handleDeleteAccount = async () => {
    // Check for remaining balance
    if (user.walletBalance > 0) {
      alert(`Cannot Delete Account!\n\nYou still have $${user.walletBalance.toLocaleString()} in your wallet.\nPlease withdraw all funds before deleting your account.`);
      return;
    }

    // Check for remaining stocks
    const hasStocks = user.portfolio.some(p => p.quantity > 0);
    if (hasStocks) {
      alert(`Cannot Delete Account!\n\nYou still own shares in your portfolio.\nPlease sell all shares before deleting your account.`);
      return;
    }

    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_URL}/api/user/${user._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Account deleted successfully");
        // Force logout from Clerk as well
        handleLogout();
      } else {
        showToast("Failed to delete account", "error");
      }
    } catch (e) {
      showToast("Error deleting account", "error");
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-700">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Account Not Found</h2>
          <p className="text-gray-400 mb-6">
            It looks like you don't have a TradeStack account linked to <b>{clerkUser?.primaryEmailAddress?.emailAddress}</b>.
          </p>
          <button
            onClick={handleCreateAccount}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mb-3 transition-colors"
          >
            Create New Account
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

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

            <div className="flex gap-2">
              <button onClick={() => setIsWithdrawModalOpen(true)} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all">Withdraw</button>
              <button onClick={() => setIsDepositModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all">+ Add</button>
            </div>

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
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold">
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
            <button onClick={() => setActiveTab("history")} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "history" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}>History</button>
            <button onClick={() => setActiveTab("faq")} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "faq" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}>FAQ</button>
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
                      <div key={code}
                        onClick={() => setSelectedStock(stockData)}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm relative overflow-hidden cursor-pointer transform hover:scale-[1.02] duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              {stockData.logo && <img src={stockData.logo} alt={code} className="w-6 h-6 rounded-full object-contain bg-white" />}
                              <h3 className="text-xl font-bold dark:text-white">{code}</h3>
                            </div>
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
                          <button onClick={(e) => { e.stopPropagation(); setTradeModal({ code, type: 'BUY' }); }} className="bg-green-100 text-green-700 py-2 rounded font-bold text-sm hover:bg-green-200">BUY</button>
                          <button onClick={(e) => { e.stopPropagation(); setTradeModal({ code, type: 'SELL' }); }} className="bg-red-100 text-red-700 py-2 rounded font-bold text-sm hover:bg-red-200">SELL</button>
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
                      <div key={code}
                        onClick={() => setSelectedStock(stockData)}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer transform hover:scale-[1.02] duration-200 relative">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              {stockData.logo && <img src={stockData.logo} alt={code} className="w-6 h-6 rounded-full object-contain bg-white" />}
                              <h3 className="text-lg font-bold dark:text-white">{code}</h3>
                            </div>
                            <p className="text-gray-500 text-xs">{stockData.name}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleSubscription(code); }} className="text-gray-400 hover:text-red-500 z-10 p-1">
                            ✕
                          </button>
                        </div>
                        <div className="text-2xl font-mono font-bold mb-4 dark:text-white">
                          ${stockData.price.toFixed(2)}
                        </div>
                        <div className="h-12 mb-4 opacity-50">
                          <StockChart data={history} color={isProfit ? "#16a34a" : "#dc2626"} />
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setTradeModal({ code, type: 'BUY' }); }} className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-500 z-10 relative">Start Investing</button>
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
                      <div className="flex items-center gap-2">
                        {stock.logo && <img src={stock.logo} alt={stock.code} className="w-8 h-8 rounded-full object-contain bg-white border border-gray-100" />}
                        <h3 className="text-xl font-bold dark:text-white">{stock.code}</h3>
                      </div>
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

        {/* HISTORY VIEW */}
        {activeTab === "history" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {user?.history?.slice().reverse().map((txn, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${txn.type === 'DEPOSIT' ? 'bg-green-100 text-green-700' :
                          txn.type === 'WITHDRAW' ? 'bg-red-100 text-red-700' :
                            txn.type === 'BUY' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-bold">{txn.stockCode || '-'}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{txn.quantity || '-'}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono">{txn.price ? `$${txn.price.toFixed(2)}` : '-'}</td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${txn.type === 'DEPOSIT' || txn.type === 'SELL' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'DEPOSIT' || txn.type === 'SELL' ? '+' : '-'}${txn.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!user?.history || user.history.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No transaction history found.</td>
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