import React, { useState } from 'react';

// The "Stack" Logo Component
const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-blue-600 dark:fill-blue-500" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function LandingPage({ onEnter, darkMode, toggleTheme }) {
    const [showAbout, setShowAbout] = useState(false);
    const [activeTab, setActiveTab] = useState('guide');

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative transition-colors duration-300"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            {/* THE OVERLAY */}
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/85 z-0"></div>

            {/* CONTENT WRAPPER */}
            <div className="relative z-10 text-gray-900 dark:text-white">

                {/* Navbar */}
                <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Logo />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tighter leading-none">Trade<span className="text-blue-600 dark:text-blue-400">Stack</span></h1>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">by Escrow Stack</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-300 hover:scale-110 transition-transform">
                            {darkMode ? "☀️" : "🌙"}
                        </button>
                        <button
                            onClick={() => { window.location.hash = "#/login"; onEnter(); }}
                            className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-500 hidden sm:block"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { window.location.hash = "#/signup"; onEnter(); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-500/30"
                        >
                            Sign Up
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center text-center mt-20 px-4">

                    {/* Render Cold Start Warning */}
                    <div className="mb-6 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg max-w-lg animate-fade-in-up">
                        <p className="text-xs text-amber-800 dark:text-amber-200 font-bold flex items-center gap-2 justify-center">
                            <span>⏳</span> NOTE: Server may sleep when inactive. Please wait 30-60s for initial load.
                        </p>
                    </div>

                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide border border-blue-200 dark:border-blue-800 backdrop-blur-md">
                        🚀 Powered by Escrow Stack API
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl drop-shadow-sm">
                        The Professional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            Stock Trading Terminal
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-6 leading-relaxed font-medium">
                        Experience real-time market data, instant execution, and secure settlement via Virtual IBANs.
                    </p>

                    <div className="mb-10 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 max-w-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-bold text-red-500">IMPORTANT:</span> Please use a <b>legitimate email address</b>.
                            If you sign up with Email/Password, you will receive an OTP for verification.
                        </p>
                    </div>

                    <div className="flex gap-4 flex-col sm:flex-row">
                        <button
                            onClick={() => { window.location.hash = "#/signup"; onEnter(); }}
                            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                        >
                            Start Trading Now
                        </button>

                        <button
                            onClick={() => { setShowAbout(true); setActiveTab('guide'); }}
                            className="px-8 py-4 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-lg hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <span>📖</span> About the Project
                        </button>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
                        <FeatureCard
                            title="Real-Time Data"
                            desc="Sub-millisecond latency updates via WebSockets for over 100+ global stocks."
                            icon="⚡"
                        />
                        <FeatureCard
                            title="Secure Wallet"
                            desc="Integrated Virtual IBANs for instant deposits and automated reconciliation."
                            icon="💳"
                        />
                        <FeatureCard
                            title="Escrow Settlement"
                            desc="Every trade is secured by Escrow Stack's conditional payment infrastructure."
                            icon="🔒"
                        />
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-24 py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
                    <p>© 2025 TradeStack. Infrastructure provided by Escrow Stack.</p>
                </footer>
            </div>

            {/* UNIFIED INFO MODAL */}
            {showAbout && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 relative animate-in fade-in zoom-in duration-300 flex flex-col">

                        {/* Modal Header & Tabs */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-20 backdrop-blur-md">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('guide')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'guide' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                >
                                    📖 User Guide
                                </button>
                                <button
                                    onClick={() => setActiveTab('tech')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'tech' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                >
                                    👨‍💻 Developer & Tech
                                </button>
                            </div>
                            <button onClick={() => setShowAbout(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl font-bold">✕</button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-0">

                            {/* TAB 1: USER GUIDE */}
                            {activeTab === 'guide' && (
                                <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">How to Use TradeStack</h2>
                                    <p className="text-center text-gray-500 mb-10">Your complete guide to mastering the terminal.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <GuideStep emoji="1️⃣" title="Create an Account" desc="Use Google or a real Email (OTP required). Your secure wallet is automatically generated." />
                                            <GuideStep emoji="2️⃣" title="Deposit Funds" desc="Click '+ Add' in the top right. Enter an amount (e.g. $5000) to simulate a transfer via Virtual IBAN." />
                                            <GuideStep emoji="3️⃣" title="Explore the Market" desc="Navigate to the 'Marketplace' tab. Watch stocks stream in real-time. Click 'Trade' to buy." />
                                        </div>
                                        <div className="space-y-6">
                                            <GuideStep emoji="4️⃣" title="Execute Trades" desc="Buy low, sell high. Your portfolio updates instantly. Checks prevent buying more than you can afford." />
                                            <GuideStep emoji="5️⃣" title="Withdraw Profits" desc="Made a profit? Click 'Withdraw' to move funds back (simulated) to your bank account." />
                                            <GuideStep emoji="6️⃣" title="Manage Identity" desc="Click your avatar to view your profile or delete your account (wipes all data)." />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: DEVELOPER & TECH (Restored) */}
                            {activeTab === 'tech' && (
                                <div className="flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    {/* Left: Profile */}
                                    <div className="md:w-1/3 bg-gray-50 dark:bg-gray-900/30 p-8 text-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                                        <div className="w-32 h-32 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg relative group">
                                            <img
                                                src="/profile.jpg"
                                                alt="Vijay Netekal"
                                                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=Vijay+Netekal&background=0D8ABC&color=fff" }}
                                            />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Vijay Netekal</h2>
                                        <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">AI/ML & Web Development Enthusiast</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed text-left">
                                            Computer Science student and National Hackathon Winner. I specialize in building intelligent systems using <b>LLMs, RAG,</b> and scalable <b>Web Infrastructure</b>.
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                                            {['Web Development', 'MERN Stack', 'Python', 'AI/ML', 'RAG', 'Socket.io', 'Clerk Auth'].map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded font-bold">{skill}</span>
                                            ))}
                                        </div>

                                        {/* Social Links */}
                                        <div className="flex justify-center gap-4">
                                            <a href="https://github.com/the-lost-phoenix" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 text-white rounded-full hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.03.66-3.84-1.47-3.84-1.47-.54-1.38-1.335-1.755-1.335-1.755-.99-.675.075-.66.075-.66 1.095.075 1.665 1.125 1.665 1.125.975 1.665 2.565 1.185 3.195.9.105-.705.375-1.185.69-1.455-2.43-.27-4.995-1.215-4.995-5.4 0-1.185.42-2.16 1.11-2.91-.105-.285-.495-1.38.105-2.88 0 0 .915-.285 3 .96 1.8-.495 3.555-.495 3.555-.285 24 0 .915 24 2.13 24 3.795 24 5.25.975 8.205 2.91 9.795 24 5.31 24 12 24 0 5.37-5.37 12-12 12z" /></svg>
                                            </a>
                                            <a href="https://www.linkedin.com/in/vijay-netekal-a603b2280/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0077b5] text-white rounded-full hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                            </a>
                                            <a href="mailto:vijaynetekal28@gmail.com" className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Right: Technical Readme */}
                                    <div className="md:w-2/3 p-8 bg-white dark:bg-gray-800 text-left">
                                        <div className="prose dark:prose-invert max-w-none">
                                            <h3 className="text-2xl font-extrabold mb-4">Under the Hood ⚙️</h3>

                                            <div className="mb-6">
                                                <h4 className="font-bold text-lg mb-2">Architecture: "The Three Pillars"</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <TechItem title="The Face" desc="React + Tailwind" detail="Component-based UI with modular design." />
                                                    <TechItem title="The Brain" desc="Node.js + Express" detail="REST API + Real-time logic." />
                                                    <TechItem title="The Memory" desc="MongoDB" detail="Atomic transactions for wallet consistency." />
                                                    <TechItem title="The Gatekeeper" desc="Clerk Auth" detail="Industrial-grade security. Top-tier identity management." />
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-bold text-lg mb-2">Why Clerk? 🔒</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                    Authentication is critical. Instead of rolling a custom (and potentially vulnerable) auth system, I integrated **Clerk**.
                                                </p>
                                                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                    <li><b>Security First:</b> No raw passwords stored in my DB.</li>
                                                    <li><b>Seamless UX:</b> Social Login (Google) + Email OTP out of the box.</li>
                                                    <li><b>Session Management:</b> Robust token handling and expiry.</li>
                                                </ul>
                                            </div>

                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 mt-4">
                                                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-200">
                                                    ⚡ Performance Note:
                                                    This app is deployed on Render's Free Tier. If you notice a delay in the initial connection, it's the server waking up from sleep mode.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Helper Components
const FeatureCard = ({ title, desc, icon }) => (
    <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all backdrop-blur-sm">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-300 leading-relaxed">{desc}</p>
    </div>
);

const TechItem = ({ title, desc, detail }) => (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide">{title}</p>
        <p className="text-base font-bold text-gray-900 dark:text-white mb-2">{desc}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{detail}</p>
    </div>
);

const GuideStep = ({ emoji, title, desc }) => (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700">
        <div className="text-3xl bg-white dark:bg-gray-700 h-12 w-12 flex items-center justify-center rounded-full shadow-sm flex-shrink-0">
            {emoji}
        </div>
        <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{desc}</p>
        </div>
    </div>
);

export default LandingPage;