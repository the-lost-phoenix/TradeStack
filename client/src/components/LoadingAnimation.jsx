import React from 'react';

const LoadingAnimation = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-black transition-colors duration-300 overflow-hidden">
            {/* Background Stars/Nebula Effect (CSS driven or simple divs) */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nebula-blue/20 via-space-black to-space-black animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Cosmic Loader */}
                <div className="relative w-32 h-32 mb-8">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 border-4 border-none border-t-solar-flare/50 border-r-solar-flare/50 rounded-full animate-spin-slow shadow-[0_0_15px_rgba(252,163,17,0.3)]"></div>

                    {/* Middle Ring (Reverse) */}
                    <div className="absolute inset-4 border-4 border-none border-b-nebula-blue border-l-nebula-blue rounded-full animate-spin shadow-[0_0_10px_rgba(20,33,61,0.5)]" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>

                    {/* Inner Core */}
                    <div className="absolute inset-10 bg-solar-flare/10 rounded-full animate-pulse shadow-[0_0_20px_rgba(252,163,17,0.2)] backdrop-blur-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-solar-flare rounded-full shadow-[0_0_10px_#fca311]"></div>
                    </div>
                </div>

                {/* Brand Text */}
                <h2 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight via-solar-flare to-starlight animate-gradient-x bg-300% tracking-widest uppercase mb-2 drop-shadow-md">
                    TradeStack
                </h2>

                {/* Status Text */}
                <div className="flex flex-col items-center space-y-1">
                    <p className="text-solar-flare/80 font-rajdhani font-semibold tracking-[0.2em] text-sm animate-pulse">
                        INITIALIZING SYSTEM PROTOCOLS
                    </p>

                    {/* Loading Bars */}
                    <div className="flex space-x-1 mt-2">
                        <div className="w-12 h-1 bg-deep-space rounded overflow-hidden">
                            <div className="h-full bg-solar-flare animate-[progress_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>

                {/* Server Wake-up Notice */}
                <div className="mt-8 max-w-sm text-center space-y-1 opacity-70">
                    <p className="text-xs text-starlight/50 font-inter font-light tracking-wide">
                        Establishing secure connection to mainframe...
                    </p>
                    <p className="text-[10px] text-nebula-blue/80 font-rajdhani uppercase tracking-widest">
                        (Render Server Wake-up Sequence)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingAnimation;
