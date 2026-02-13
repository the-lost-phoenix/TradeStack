import React from 'react';

function ProfileModal({ user, isOpen, onClose, onDelete }) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-deep-space border border-solar-flare/20 shadow-[0_0_50px_rgba(252,163,17,0.1)] w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>

                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-space-black via-nebula-blue/40 to-space-black relative">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
                    <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-solar-flare to-transparent"></div>
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-starlight/50 hover:text-white font-bold transition-colors">✕</button>

                <div className="px-6 pb-8 relative">
                    {/* Avatar */}
                    <div className="w-24 h-24 -mt-12 mx-auto rounded-full border-2 border-solar-flare/50 overflow-hidden bg-space-black shadow-[0_0_20px_rgba(252,163,17,0.3)] relative z-10 p-1">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <h2 className="text-2xl font-black font-orbitron text-starlight tracking-wide uppercase">{user.name}</h2>
                        <p className="text-starlight/40 font-mono text-xs tracking-widest uppercase">{user.email}</p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="bg-white/5 p-4 border border-white/10 flex justify-between items-center relative overflow-hidden group hover:border-solar-flare/30 transition-colors">
                            <div className="absolute top-0 left-0 w-1 h-full bg-solar-flare/50"></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-starlight/40 tracking-widest font-rajdhani">Secure ID / IV-IBAN</p>
                                <p className="font-orbitron font-bold text-solar-flare text-lg tracking-wider">{user.virtualIban}</p>
                            </div>
                            <button className="text-[10px] uppercase font-bold bg-transparent border border-white/20 text-starlight/60 px-3 py-1 hover:bg-white hover:text-space-black transition-all">Copy</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 border border-white/10 relative group hover:bg-white/10 transition-colors">
                                <p className="text-[10px] uppercase font-bold text-starlight/40 tracking-widest font-rajdhani">Credit Balance</p>
                                <p className="font-orbitron font-bold text-green-400 text-xl tracking-tight">${user.walletBalance?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 p-4 border border-white/10 relative group hover:bg-white/10 transition-colors">
                                <p className="text-[10px] uppercase font-bold text-starlight/40 tracking-widest font-rajdhani">Ops Count</p>
                                <p className="font-orbitron font-bold text-white text-xl tracking-tight">
                                    {user.history?.filter(t => t.type === 'BUY' || t.type === 'SELL').length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-starlight font-bold py-3 uppercase tracking-widest text-xs font-orbitron border border-white/10 hover:border-white/30 transition-all">
                            Close Access
                        </button>
                        <button onClick={onDelete} className="flex-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-bold py-3 uppercase tracking-widest text-xs font-orbitron border border-red-500/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            Burn Identity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;