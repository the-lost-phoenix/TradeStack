import { useState, useEffect } from "react";

function EscrowModal({ isOpen, onClose, onComplete, mode = "DEPOSIT" }) {
    const [step, setStep] = useState(0);
    const [amount, setAmount] = useState("");

    const isDeposit = mode === "DEPOSIT";

    const steps = isDeposit ? [
        "INITIALIZING SECURE HANDSHAKE...",
        "VERIFYING VIRTUAL IBAN SEQUENCE...",
        "ROUTING QUANTUM FUNDS...",
        "SETTLEMENT CONFIRMED."
    ] : [
        "SCANNING WALLET SIGNATURE...",
        "ESTABLISHING BANK LINK...",
        "EXECUTING WITHDRAWAL PROTOCOL...",
        "ASSETS TRANSFERRED."
    ];

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setAmount("");
        }
    }, [isOpen]);

    const startProcess = (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;

        setStep(1);

        // Fake API delays
        setTimeout(() => setStep(2), 1500);
        setTimeout(() => setStep(3), 3000);
        setTimeout(() => {
            setStep(4);
            setTimeout(() => {
                onComplete(parseFloat(amount));
                onClose();
            }, 1000);
        }, 4500);
    };

    if (!isOpen) return null;

    const isBelowMinDeposit = isDeposit && (!amount || parseFloat(amount) < 1000);

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md">
            <div className={`bg-deep-space p-8 border ${isDeposit ? 'border-nebula-blue/50 shadow-[0_0_50px_rgba(20,33,61,0.5)]' : 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]'} w-full max-w-md text-center relative overflow-hidden`} style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>

                {/* Decorative Scan Line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${isDeposit ? 'bg-gradient-to-r from-transparent via-nebula-blue to-transparent' : 'bg-gradient-to-r from-transparent via-red-500 to-transparent'} animate-pulse`}></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-starlight/50 hover:text-white transition-colors font-bold">✕</button>

                {step === 0 && (
                    <form onSubmit={startProcess}>
                        <h2 className="text-2xl font-black font-orbitron text-starlight mb-2 uppercase tracking-widest">{isDeposit ? "Inject Funds" : "Extract Assets"}</h2>
                        <p className="text-starlight/50 text-xs font-rajdhani mb-8 uppercase tracking-wider">
                            {isDeposit ? "Enter credit quantum for injection." : "Enter value for external extraction."}
                        </p>

                        <div className="relative mb-8">
                            <input
                                type="number"
                                autoFocus
                                className={`w-full bg-space-black border border-white/10 p-4 text-3xl font-orbitron text-white text-center outline-none transition-all placeholder-white/5 focus:border-opacity-100 ${isDeposit ? 'focus:border-nebula-blue shadow-[0_0_20px_rgba(20,33,61,0.2)]' : 'focus:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                step="0.01"
                                min="0.01"
                                required
                            />
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50"></div>
                        </div>

                        <button
                            type="submit"
                            disabled={isBelowMinDeposit}
                            className={`w-full font-bold py-4 transition-all uppercase tracking-widest font-orbitron text-sm clip-path-polygon ${isBelowMinDeposit
                                ? "bg-white/5 text-starlight/20 cursor-not-allowed border border-white/5"
                                : isDeposit ? "bg-nebula-blue hover:bg-white hover:text-deep-space text-white shadow-[0_0_20px_rgba(20,33,61,0.4)]" : "bg-red-600 hover:bg-white hover:text-red-900 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                }`}
                            style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}
                        >
                            {isBelowMinDeposit ? "MINIMUM INJECTION $1,000" : isDeposit ? "INITIATE TRANSFER" : "CONFIRM WITHDRAWAL"}
                        </button>
                    </form>
                )}

                {step > 0 && (
                    <div className="py-4">
                        <h2 className="text-xl font-bold font-orbitron text-starlight mb-8 animate-pulse">PROCESSING SEQUENCE</h2>

                        <div className={`text-4xl font-mono font-bold ${isDeposit ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]'} mb-8`}>
                            {isDeposit ? '+' : '-'}${parseFloat(amount).toLocaleString()}
                        </div>

                        <div className="w-full bg-space-black h-1 mb-8 relative overflow-hidden">
                            <div
                                className={`h-full absolute top-0 left-0 ${isDeposit ? 'bg-nebula-blue shadow-[0_0_15px_#14213d]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'} transition-all duration-500 ease-out`}
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            ></div>
                        </div>

                        <div className="space-y-4 text-left pl-4 font-rajdhani">
                            {steps.map((text, index) => (
                                <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${index + 1 > step ? "opacity-20 blur-[1px]" : "opacity-100"}`}>
                                    {index + 1 < step ? (
                                        <span className={`font-bold ${isDeposit ? 'text-green-400' : 'text-red-400'}`}>[ OK ]</span>
                                    ) : index + 1 === step ? (
                                        <span className={`animate-pulse font-bold ${isDeposit ? 'text-nebula-blue' : 'text-red-500'}`}>[ &gt;&gt; ]</span>
                                    ) : (
                                        <span className="font-bold text-starlight/20">[ .. ]</span>
                                    )}
                                    <span className={`uppercase tracking-wider text-xs font-bold ${index + 1 === step ? "text-white glow-text" : "text-starlight/60"}`}>
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default EscrowModal;