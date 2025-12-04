import { useState, useEffect } from "react";

function EscrowModal({ isOpen, onClose, onComplete }) {
    const [step, setStep] = useState(0); // 0 = Input, 1-4 = Animation
    const [amount, setAmount] = useState("");

    const steps = [
        "Initiating Secure Handshake...",
        "Verifying Virtual IBAN...",
        "Routing Funds via Escrow Stack...",
        "Settlement Complete."
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

        setStep(1); // Start Animation

        // Fake API delays
        setTimeout(() => setStep(2), 1500);
        setTimeout(() => setStep(3), 3000);
        setTimeout(() => {
            setStep(4);
            setTimeout(() => {
                onComplete(parseInt(amount)); // Send the amount back to App
                onClose();
            }, 1000);
        }, 4500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 p-8 rounded-2xl border border-blue-500 shadow-2xl w-full max-w-md text-center relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                {/* STEP 0: INPUT AMOUNT */}
                {step === 0 && (
                    <form onSubmit={startProcess}>
                        <h2 className="text-2xl font-bold text-white mb-2">Deposit Funds</h2>
                        <p className="text-gray-400 text-sm mb-6">Enter amount to transfer via Virtual IBAN.</p>

                        <input
                            type="number"
                            autoFocus
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-2xl font-mono text-white text-center mb-6 focus:border-blue-500 outline-none"
                            placeholder="$0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min="1"
                            required
                        />

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
                            Initiate Transfer
                        </button>
                    </form>
                )}

                {/* STEP 1-4: ANIMATION */}
                {step > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Processing Transaction</h2>
                        <div className="text-3xl font-mono font-bold text-green-400 mb-6">
                            +${parseInt(amount).toLocaleString()}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            ></div>
                        </div>

                        {/* Logs */}
                        <div className="space-y-3 text-left">
                            {steps.map((text, index) => (
                                <div key={index} className={`flex items-center gap-3 transition-opacity duration-500 ${index + 1 > step ? "opacity-20" : "opacity-100"}`}>
                                    {index + 1 < step ? (
                                        <span className="text-green-500 font-bold">✓</span>
                                    ) : index + 1 === step ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                                    ) : (
                                        <span className="h-4 w-4 rounded-full border border-gray-600"></span>
                                    )}
                                    <span className={index + 1 === step ? "text-blue-400 font-bold" : "text-gray-400"}>
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