import React from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border border-white/5 bg-deep-space/50 hover:bg-deep-space transition-all mb-4 overflow-hidden group">
            <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold font-orbitron text-starlight group-hover:text-solar-flare transition-colors uppercase tracking-wider text-sm">{question}</span>
                <span className={`transform transition-transform text-solar-flare ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-6 bg-white/5 text-starlight/70 border-t border-white/5 font-rajdhani leading-relaxed text-sm">
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "How do I deposit funds?",
            answer: "Click the '+ Inject' button in the header. You can simulate a deposit using a quantum-encrypted Virtual IBAN. The minimum injection amount is $1,000 Credits."
        },
        {
            question: "Is this real liquidity?",
            answer: "Negative. This is a high-fidelity market simulation for strategic training. All credits and assets are virtual constructs."
        },
        {
            question: "How do I liquidate assets?",
            answer: "Navigate to 'Dashboard'. In the 'Active Assets' matrix, identify the asset and execute the 'SELL' command."
        },
        {
            question: "Can I purge my identity?",
            answer: "Affirmative. You can burn your identity from the Profile Nexus. Protocol dictates you must liquidate all positions and withdraw funds before termination."
        },
        {
            question: "How are valuations determined?",
            answer: "Asset prices are derived from a stochastic volatility algorithm, updating in real-time to simulate market unpredictability."
        },
        {
            question: "Protocol for insolvency?",
            answer: "In the event of total credit depletion, you may re-initialize your profile or inject fresh virtual capital to resume operations."
        }
    ];

    return (
        <div className="bg-deep-space/30 border border-white/5 p-6 md:p-12 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-nebula-blue/5 rounded-full blur-[100px]"></div>
            <h2 className="text-3xl font-black font-orbitron text-starlight mb-10 flex items-center gap-4 relative z-10">
                <span className="w-2 h-8 bg-solar-flare"></span>
                SYSTEM KNOWLEDGE BASE
            </h2>
            <div className="max-w-4xl mx-auto relative z-10">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
};

export default FAQ;
