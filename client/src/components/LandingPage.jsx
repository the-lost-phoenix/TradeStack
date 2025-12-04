import React, { useState } from 'react';

// The "Stack" Logo Component
const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-blue-600 dark:fill-blue-500" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function LandingPage({ onEnter }) {
    const [showAbout, setShowAbout] = useState(false);

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative transition-colors duration-300"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            {/* THE OVERLAY: Makes text readable on top of the image */}
            {/* Light Mode: White 90% opacity | Dark Mode: Black 85% opacity */}
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/85 z-0"></div>

            {/* CONTENT WRAPPER (z-10 puts it above the overlay) */}
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
                    <div className="flex gap-4">
                        <button onClick={onEnter} className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-500">Log In</button>
                        <button onClick={onEnter} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-500/30">
                            Launch Terminal
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide border border-blue-200 dark:border-blue-800 backdrop-blur-md">
                        🚀 Powered by Escrow Stack API
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl drop-shadow-sm">
                        The Professional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            Stock Trading Terminal
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed font-medium">
                        Experience real-time market data, instant execution, and secure settlement via Virtual IBANs. Built for the modern trader.
                    </p>

                    <div className="flex gap-4 flex-col sm:flex-row">
                        <button
                            onClick={onEnter}
                            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                        >
                            Start Trading
                        </button>

                        <button
                            onClick={() => setShowAbout(true)}
                            className="px-8 py-4 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-lg hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <span>👨‍💻</span> Meet the Developer
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

            {/* ABOUT ME MODAL */}
            {showAbout && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 relative animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row">

                        <button
                            onClick={() => setShowAbout(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white z-10"
                        >
                            ✕
                        </button>

                        {/* LEFT COLUMN: Profile Card */}
                        <div className="md:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-8 text-center border-r border-gray-200 dark:border-gray-700 sticky top-0">
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg relative group">
                                <img
                                    src="/profile.jpg"
                                    alt="Vijay Netekal"
                                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=Vijay+Netekal&background=0D8ABC&color=fff" }}
                                />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Vijay Netekal
                            </h2>
                            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">
                                AI/ML Engineer & Full Stack Developer
                            </p>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed text-left">
                                Computer Science student (CGPA: 8.43) and National Hackathon Winner. I specialize in building intelligent systems using <b>LLMs, RAG,</b> and scalable <b>Web Infrastructure</b>.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {['Web Development', 'MERN Stack', 'Python', 'AI/ML', 'RAG', 'Socket.io'].map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded font-bold">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <a href="https://github.com/the-lost-phoenix" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                    GitHub Profile
                                </a>
                                <a href="https://www.linkedin.com/in/vijay-netekal-a603b2280/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The Beginner-Friendly README */}
                        <div className="md:w-2/3 p-8 bg-white dark:bg-gray-800 text-left overflow-y-auto">
                            <div className="prose dark:prose-invert max-w-none">

                                {/* Header */}
                                <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                                        How TradeStack Works
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                                        A Simple Guide to the Engineering Behind the Screen
                                    </p>
                                </div>

                                {/* Section 1: The Concept */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">1. The Problem: "The Waiter vs. The Megaphone"</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        Imagine you are at a restaurant. If you want to know if your food is ready, you have two choices:
                                    </p>
                                    <ul className="list-none space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex gap-3">
                                            <span className="text-red-500 font-bold">❌ The Old Way (HTTP):</span>
                                            <span>You ask the waiter every 5 seconds, "Is it ready? Is it ready?" This is annoying and slow.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-green-500 font-bold">✅ My Way (WebSockets):</span>
                                            <span>The chef holds a megaphone. When the food is ready, he shouts, "Order 5 is ready!" You hear it instantly without asking.</span>
                                        </li>
                                    </ul>
                                    <p className="mt-3 text-sm italic text-gray-500">
                                        **In this app:** I used <b>Socket.io</b> to create that "Megaphone." The server shouts stock prices to the dashboard in real-time without you refreshing the page.
                                    </p>
                                </div>

                                {/* Section 2: The Infrastructure */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2. The "Three Pillars" Architecture</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TechItem
                                            title="The Face (Frontend)"
                                            desc="React + Tailwind"
                                            detail="It's what you see. I built it with React because it's like Lego blocks—I build a 'Stock Card' once and reuse it 100 times."
                                        />
                                        <TechItem
                                            title="The Brain (Backend)"
                                            desc="Node.js + Express"
                                            detail="It decides who can log in and simulates the stock market. It runs a loop every second to change prices randomly."
                                        />
                                        <TechItem
                                            title="The Memory (Database)"
                                            desc="MongoDB"
                                            detail="A digital notebook that remembers your User ID, your Wallet Balance, and which stocks you own."
                                        />
                                        <TechItem
                                            title="The Bridge (API)"
                                            desc="REST + Sockets"
                                            detail="The secure line that lets the Face talk to the Brain to deposit money or place trades."
                                        />
                                    </div>
                                </div>

                                {/* Section 3: The Escrow Feature */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">3. The "Escrow" Logic</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        To align with <b>Escrow Stack's</b> mission, I didn't just add money instantly. I built a simulation of a secure transaction:
                                    </p>
                                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300">
                                        1. User clicks "Deposit" <br />
                                        2. System generates a unique <b>Virtual IBAN</b> <br />
                                        3. Funds are "Held" in Escrow (simulated delay) <br />
                                        4. Once verified, the Wallet updates.
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mt-6">
                                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium text-center">
                                        "I built this to show that I don't just write code; I understand how systems talk to each other."
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Helper Component
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

export default LandingPage;