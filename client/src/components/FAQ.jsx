import React from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
            <button
                className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold text-gray-900 dark:text-white">{question}</span>
                <span className={`transform transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
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
            answer: "Click the '+ Add' button in the top right corner. You can simulate a deposit using a virtual IBAN. The minimum deposit amount is $1,000."
        },
        {
            question: "Is this real money?",
            answer: "No. This is a simulation platform for educational purposes. All funds and stocks are virtual."
        },
        {
            question: "How do I sell my stocks?",
            answer: "Go to your 'Dashboard'. In the 'My Portfolio' section, find the stock you want to sell and click the 'SELL' button."
        },
        {
            question: "Can I delete my account?",
            answer: "Yes, you can delete your account from the Profile menu. However, you must sell all your stocks and withdraw your funds before deletion is allowed."
        },
        {
            question: "How are stock prices determined?",
            answer: "Stock prices are simulated using a random walk algorithm that updates every second to mimic market volatility."
        },
        {
            question: "What happens if I run out of money?",
            answer: "Since this is a simulation, you can simply create a new account or deposit more virtual funds to continue trading."
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="max-w-3xl">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
};

export default FAQ;
