
import React from 'react';

const LoadingAnimation = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer Pulsing Ring */}
                <div className="absolute w-32 h-32 border-4 border-blue-500/30 rounded-full animate-ping"></div>

                {/* Middle Rotating Ring */}
                <div className="absolute w-24 h-24 border-4 border-purple-500/40 border-t-transparent border-b-transparent rounded-full animate-spin-slow"></div>

                {/* Inner Fast Spinner */}
                <div className="absolute w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                {/* Icon/Logo */}
                <div className="relative z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x bg-300% tracking-tight">
                    TradeStack
                </h2>
                <div className="flex items-center gap-1 mt-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-0"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></span>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase animate-pulse">
                    Authenticating Securely
                </p>

                <div className="mt-8 max-w-xs text-center space-y-2 opacity-80">
                    <p className="text-xs text-cool-gray-400 dark:text-gray-500 font-light italic">
                        Please be patient
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 leading-relaxed">
                        Our secure servers on Render may take a brief moment to wake up if they've been inactive.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingAnimation;
