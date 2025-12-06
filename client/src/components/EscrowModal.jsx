import { useState, useEffect } from "react";

function EscrowModal({ isOpen, onClose, onComplete, mode = "DEPOSIT" }) {
    const [step, setStep] = useState(0);
    const [amount, setAmount] = useState("");

    const isDeposit = mode === "DEPOSIT";

    const steps = isDeposit ? [
        "Initiating Secure Handshake...",
        "Verifying Virtual IBAN...",
        "Routing Funds via Escrow Stack...",
        "Settlement Complete."
    ] : [
        "Verifying Wallet Balance...",
        "Initiating Bank Transfer...",
        "Processing Withdrawal...",
        "Funds Transferred."
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className={`bg-gray-800 p-8 rounded-2xl border ${isDeposit ? 'border-blue-500' : 'border-red-500'} shadow-2xl w-full max-w-md text-center relative`}>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                {step === 0 && (
                    <form onSubmit={startProcess}>
                        <h2 className="text-2xl font-bold text-white mb-2">{isDeposit ? "Deposit Funds" : "Withdraw Funds"}</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            {isDeposit ? "Enter amount to transfer via Virtual IBAN." : "Enter amount to withdraw to your bank."}
                        </p>

                        <input
                            type="number"
                            autoFocus
                            className={`w-full bg-gray-900 border ${isDeposit ? 'border-gray-600 focus:border-blue-500' : 'border-gray-600 focus:border-red-500'} rounded-lg p-4 text-2xl font-mono text-white text-center mb-6 outline-none`}
                            placeholder="$0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            step="0.01"
                            min="0.01"
                            required
                        />

                        <button
                            type="submit"
                            disabled={isBelowMinDeposit}
                            className={`w-full font-bold py-3 rounded-lg transition-all ${isBelowMinDeposit
                                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                : isDeposit ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                                }`}
                        >
                            {isBelowMinDeposit ? "Minimum Deposit $1,000" : isDeposit ? "Initiate Transfer" : "Confirm Withdrawal"}
                        </button>
                    </form>
                )}

                {step > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Processing Transaction</h2>
                        <div className={`text-3xl font-mono font-bold ${isDeposit ? 'text-green-400' : 'text-red-400'} mb-6`}>
                            {isDeposit ? '+' : '-'}${parseFloat(amount).toLocaleString()}
                        </div>

                        <div className="w-full bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
                            <div
                                className={`h-full ${isDeposit ? 'bg-blue-500' : 'bg-red-500'} transition-all duration-500 ease-out`}
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            ></div>
                        </div>

                        <div className="space-y-3 text-left">
                            {steps.map((text, index) => (
                                <div key={index} className={`flex items-center gap-3 transition-opacity duration-500 ${index + 1 > step ? "opacity-20" : "opacity-100"}`}>
                                    {index + 1 < step ? (
                                        <span className={`font-bold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>✓</span>
                                    ) : index + 1 === step ? (
                                        <span className={`animate-spin h-4 w-4 border-2 ${isDeposit ? 'border-blue-500' : 'border-red-500'} border-t-transparent rounded-full`}></span>
                                    ) : (
                                        <span className="h-4 w-4 rounded-full border border-gray-600"></span>
                                    )}
                                    <span className={index + 1 === step ? (isDeposit ? "text-blue-400 font-bold" : "text-red-400 font-bold") : "text-gray-400"}>
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