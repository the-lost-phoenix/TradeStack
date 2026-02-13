import React, { useState } from 'react';

// --- ICONS (Inline SVGs for Premium Look) ---
const Icons = {
    Logo: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-solar-flare" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-solar-flare" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-solar-flare" />
        </svg>
    ),
    Speed: () => (
        <svg className="w-8 h-8 text-solar-flare" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    Wallet: () => (
        <svg className="w-8 h-8 text-solar-flare" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    Lock: () => (
        <svg className="w-8 h-8 text-solar-flare" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    ),
    Chart: () => (
        <svg className="w-8 h-8 text-solar-flare" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
    )
};

function LandingPage({ onEnter, darkMode, toggleTheme }) {
    const [showAbout, setShowAbout] = useState(false);
    const [activeTab, setActiveTab] = useState('guide');

    return (
        <div className="min-h-screen bg-space-black text-starlight font-inter relative overflow-hidden">
            {/* --- COSMIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-nebula-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-solar-flare/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div> {/* Optional Noise Texture */}
            </div>

            {/* CONTENT WRAPPER */}
            <div className="relative z-10">

                {/* Navbar */}
                <nav className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 max-w-7xl mx-auto border-b border-white/5 backdrop-blur-sm gap-4">
                    <div className="flex items-center gap-3">
                        <Icons.Logo />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-orbitron font-bold tracking-widest text-starlight">
                                TRADE<span className="text-solar-flare">STACK</span>
                            </h1>
                            <p className="text-[8px] md:text-[10px] uppercase font-bold text-gray-500 tracking-[0.3em] font-rajdhani">
                                INTERSTELLAR TERMINAL
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center w-full md:w-auto justify-center">
                        <button
                            onClick={() => { window.location.hash = "#/login"; onEnter(); }}
                            className="text-sm font-rajdhani font-bold text-gray-400 hover:text-solar-flare transition-colors tracking-widest uppercase border border-transparent hover:border-white/10 px-4 py-2"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { window.location.hash = "#/signup"; onEnter(); }}
                            className="relative px-6 py-2 font-bold text-space-black bg-solar-flare hover:bg-white transition-all duration-300 font-orbitron text-sm tracking-wider clip-path-polygon hover:shadow-[0_0_20px_rgba(252,163,17,0.5)]"
                            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                        >
                            <span className="relative z-10">INITIALIZE</span>
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center text-center mt-24 px-4">

                    {/* Server Status Indicator */}
                    <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-space border border-nebula-blue/50 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-[10px] text-starlight/70 font-rajdhani uppercase tracking-widest">
                            System Status: Online
                        </p>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-orbitron font-black mb-6 leading-tight max-w-5xl drop-shadow-2xl opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                        UNIVERSE OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-starlight via-solar-flare to-starlight animate-gradient-x bg-300%">
                            TRADING
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-starlight/60 font-rajdhani max-w-2xl mb-10 leading-relaxed font-medium tracking-wide opacity-0 animate-fade-in-up delay-200" style={{ animationFillMode: 'forwards' }}>
                        Advanced market simulation powered by sub-millisecond latency.
                        Experience the future of financial data in a secure, escrow-backed environment.
                    </p>

                    <div className="flex gap-6 flex-col sm:flex-row opacity-0 animate-fade-in-up delay-300" style={{ animationFillMode: 'forwards' }}>
                        <button
                            onClick={() => { window.location.hash = "#/signup"; onEnter(); }}
                            className="px-8 py-4 bg-transparent border border-solar-flare text-solar-flare hover:bg-solar-flare hover:text-space-black transition-all duration-300 font-orbitron font-bold text-lg tracking-widest uppercase shadow-[0_0_15px_rgba(252,163,17,0.2)] hover:shadow-[0_0_30px_rgba(252,163,17,0.6)]"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%)' }}
                        >
                            Start Simulation
                        </button>

                        <button
                            onClick={() => { setShowAbout(true); setActiveTab('guide'); }}
                            className="px-8 py-4 bg-deep-space/50 border border-starlight/20 text-starlight hover:border-starlight/50 transition-all duration-300 font-rajdhani font-bold text-lg tracking-widest uppercase backdrop-blur-sm"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%, 0 80%)' }}
                        >
                            System Manual
                        </button>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-7xl w-full text-left relative z-20">
                        <FeatureCard
                            title="Hyperspeed Data"
                            desc="Real-time WebSockets delivering market data at the speed of light."
                            icon={<Icons.Speed />}
                        />
                        <FeatureCard
                            title="Secure Vault"
                            desc="Quantum-encrypted Virtual IBANs for instant settlement."
                            icon={<Icons.Wallet />}
                        />
                        <FeatureCard
                            title="Escrow Protocol"
                            desc="Trustless settlement infrastructure powered by smart contracts."
                            icon={<Icons.Lock />}
                        />
                    </div>
                </main>

                {/* Footer with Warnings */}
                <footer className="mt-32 py-12 border-t border-white/5 bg-deep-space/30 backdrop-blur-sm relative z-20">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div>
                            <h4 className="font-orbitron font-bold text-starlight mb-4 uppercase tracking-widest text-sm">System Warnings</h4>
                            <p className="text-xs text-starlight/40 font-rajdhani leading-relaxed">
                                <span className="text-red-500 font-bold">[CAUTION]</span> simulated market environment. No real currency is processed. All assets are virtual constructs for educational and strategic simulation purposes only.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-orbitron font-bold text-starlight mb-4 uppercase tracking-widest text-sm">Operational Notes</h4>
                            <ul className="text-xs text-starlight/40 font-rajdhani space-y-2 list-disc pl-4">
                                <li>Market volatility is algorithmically generated.</li>
                                <li>Execution latency is simulated for realism.</li>
                                <li>Identity wipe is permanent and irreversible.</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Icons.Logo />
                                <span className="text-lg font-orbitron font-bold text-starlight">TRADE<span className="text-solar-flare">STACK</span></span>
                            </div>
                            <p className="text-starlight/30 font-rajdhani text-xs uppercase tracking-widest">
                                © 2026 TradeStack Systems. <br />
                                Secure Terminal Access v4.2.0
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* UNIFIED INFO MODAL */}
            {showAbout && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-deep-space border border-nebula-blue/30 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300 shadow-[0_0_50px_rgba(20,33,61,0.5)]" style={{ clipPath: 'polygon(2% 0, 100% 0, 100% 95%, 98% 100%, 0 100%, 0 5%)' }}>

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-space-black/50 sticky top-0 z-20 backdrop-blur-md">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('guide')}
                                    className={`px-4 py-2 font-rajdhani font-bold text-sm tracking-widest uppercase transition-all border ${activeTab === 'guide' ? 'bg-solar-flare/10 border-solar-flare text-solar-flare' : 'border-transparent text-gray-500 hover:text-white'}`}
                                >
                                    User Guide
                                </button>
                                <button
                                    onClick={() => setActiveTab('tech')}
                                    className={`px-4 py-2 font-rajdhani font-bold text-sm tracking-widest uppercase transition-all border ${activeTab === 'tech' ? 'bg-nebula-blue/20 border-nebula-blue text-blue-400' : 'border-transparent text-gray-500 hover:text-white'}`}
                                >
                                    System Core
                                </button>
                            </div>
                            <button onClick={() => setShowAbout(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-0 text-starlight">
                            {/* TAB 1: USER GUIDE */}
                            {activeTab === 'guide' && (
                                <div className="p-8 md:p-12">
                                    <h2 className="text-3xl font-orbitron font-bold text-solar-flare mb-2 text-center">SYSTEM MANUAL</h2>
                                    <p className="text-center text-starlight/50 mb-10 font-rajdhani">OPERATIONAL GUIDELINES</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <GuideStep idx="01" title="Initialize Identity" desc="Create secure credentials (OTP/OAuth). Wallet auto-generation sequence initiates." />
                                            <GuideStep idx="02" title="Inject Capital" desc="Access deposit module. Simulate IBAN transfer to load credits." />
                                            <GuideStep idx="03" title="Scan Market" desc="Monitor live streams. Analyze cosmic volatility." />
                                        </div>
                                        <div className="space-y-6">
                                            <GuideStep idx="04" title="Execute Orders" desc="Submit buy/sell commands. Transactions secured by Escrow Protocol." />
                                            <GuideStep idx="05" title="Extract Gains" desc="Initiate withdrawal sequence to external accounts." />
                                            <GuideStep idx="06" title="Terminate" desc="Wipe user data from mainframe memory." />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: TECH */}
                            {activeTab === 'tech' && (
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Left: Profile */}
                                    <div className="md:w-1/3 bg-space-black/30 p-8 border-r border-white/10">
                                        {/* Profile section kept simple/clean */}
                                        <div className="mb-4 text-center">
                                            <div className="inline-block p-1 border-2 border-solar-flare rounded-full mb-4 shadow-[0_0_15px_rgba(252,163,17,0.3)]">
                                                <img src="/profile.jpg" className="w-24 h-24 rounded-full bg-deep-space" alt="Dev" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=V+N&background=0a0e17&color=fca311" }} />
                                            </div>
                                            <h3 className="text-xl font-orbitron text-starlight">Vijay Netekal</h3>
                                            <p className="text-xs text-nebula-blue font-rajdhani tracking-widest uppercase font-bold mt-1">Full Stack Architect</p>
                                        </div>
                                        <div className="space-y-2">
                                            {['React + Vite', 'Tailwind', 'Node.js', 'MongoDB', 'Socket.io', 'Clerk'].map(tag => (
                                                <div key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-center rounded">{tag}</div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Technical */}
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-orbitron text-solar-flare mb-6">CORE ARCHITECTURE</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <TechItem title="Frontend" desc="React 19 + Tailwind" />
                                            <TechItem title="Realtime" desc="Socket.io Event Stream" />
                                            <TechItem title="Security" desc="Clerk Identity Layer" />
                                            <TechItem title="Database" desc="MongoDB Atomic States" />
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

// Helper Components
const FeatureCard = ({ title, desc, icon }) => (
    <div className="group p-8 rounded-none border border-nebula-blue/30 bg-deep-space/50 hover:bg-deep-space/80 transition-all duration-300 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-1 h-full bg-solar-flare opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500 ease-out">{icon}</div>
        <h3 className="text-xl font-orbitron font-bold mb-3 text-starlight group-hover:text-solar-flare transition-colors">{title}</h3>
        <p className="text-sm font-inter text-starlight/60 leading-relaxed group-hover:text-starlight/80">{desc}</p>
    </div>
);

const GuideStep = ({ idx, title, desc }) => (
    <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 hover:border-solar-flare/30 transition-colors">
        <div className="text-2xl font-orbitron font-bold text-solar-flare/50">{idx}</div>
        <div>
            <h4 className="font-rajdhani font-bold text-starlight text-lg uppercase tracking-wide">{title}</h4>
            <p className="text-sm text-starlight/50 font-inter">{desc}</p>
        </div>
    </div>
);

const TechItem = ({ title, desc }) => (
    <div className="p-4 border border-white/10 bg-white/5 flex justify-between items-center">
        <span className="font-rajdhani font-bold text-starlight uppercase tracking-widest">{title}</span>
        <span className="font-mono text-xs text-solar-flare">{desc}</span>
    </div>
);

export default LandingPage;