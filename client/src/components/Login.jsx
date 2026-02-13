import { useState, useEffect } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

function Login() {
    const [mode, setMode] = useState("login"); // 'login' or 'signup'

    useEffect(() => {
        const checkHash = () => {
            if (window.location.hash === "#/signup") {
                setMode("signup");
            } else {
                setMode("login");
            }
        };

        checkHash(); // Initial check
        window.addEventListener("hashchange", checkHash);
        return () => window.removeEventListener("hashchange", checkHash);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 bg-space-black relative overflow-hidden">
            {/* Cosmic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-nebula-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-solar-flare/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-deep-space/80 backdrop-blur-xl p-8 rounded-none border border-nebula-blue/30 shadow-[0_0_50px_rgba(20,33,61,0.5)] transition-all duration-300 flex justify-center relative group" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-solar-flare opacity-50"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-solar-flare opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-solar-flare opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-solar-flare opacity-50"></div>

                    {mode === "login" ? (
                        <SignIn
                            appearance={{
                                layout: { socialButtonsPlacement: "bottom", socialButtonsVariant: "iconButton" },
                                variables: {
                                    colorPrimary: "#fca311",
                                    colorText: "#e5e5e5",
                                    colorBackground: "transparent",
                                    colorInputBackground: "rgba(5, 5, 5, 0.5)",
                                    colorInputText: "#e5e5e5",
                                    colorTextSecondary: "rgba(229, 229, 229, 0.5)",
                                    fontFamily: '"Rajdhani", sans-serif',
                                    borderRadius: "0px"
                                },
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none bg-transparent w-full p-0 gap-6",
                                    headerTitle: "text-starlight font-orbitron text-2xl mb-1 uppercase tracking-widest",
                                    headerSubtitle: "text-starlight/50 font-rajdhani tracking-wide",
                                    socialButtonsBlockButton: "text-starlight border border-white/10 hover:bg-white/5 font-rajdhani rounded-none transition-colors",
                                    dividerLine: "bg-white/10",
                                    dividerText: "text-starlight/30 font-rajdhani uppercase tracking-widest text-xs",
                                    formFieldLabel: "text-starlight/70 font-rajdhani uppercase tracking-wide text-xs mb-1",
                                    formFieldInput: "bg-space-black/50 text-starlight border border-white/10 focus:border-solar-flare focus:ring-0 rounded-none font-mono placeholder-starlight/20 px-4 py-3 transition-colors",
                                    footer: "hidden", // Hide default footer to control navigation manually if needed
                                    footerActionText: "text-starlight/50 font-rajdhani text-xs",
                                    footerActionLink: "text-solar-flare hover:text-white font-bold uppercase tracking-wider",
                                    formButtonPrimary: "bg-solar-flare hover:bg-white text-space-black font-orbitron font-bold uppercase tracking-widest rounded-none transition-all shadow-[0_0_15px_rgba(252,163,17,0.3)] hover:shadow-[0_0_25px_rgba(252,163,17,0.5)] py-3 mobile:py-4"
                                }
                            }}
                            signUpUrl="#/signup"
                        />
                    ) : (
                        <SignUp
                            appearance={{
                                layout: { socialButtonsPlacement: "bottom", socialButtonsVariant: "iconButton" },
                                variables: {
                                    colorPrimary: "#fca311",
                                    colorText: "#e5e5e5",
                                    colorBackground: "transparent",
                                    colorInputBackground: "rgba(5, 5, 5, 0.5)",
                                    colorInputText: "#e5e5e5",
                                    colorTextSecondary: "rgba(229, 229, 229, 0.5)",
                                    fontFamily: '"Rajdhani", sans-serif',
                                    borderRadius: "0px"
                                },
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none bg-transparent w-full p-0 gap-6",
                                    headerTitle: "text-starlight font-orbitron text-2xl mb-1 uppercase tracking-widest",
                                    headerSubtitle: "text-starlight/50 font-rajdhani tracking-wide",
                                    socialButtonsBlockButton: "text-starlight border border-white/10 hover:bg-white/5 font-rajdhani rounded-none transition-colors",
                                    dividerLine: "bg-white/10",
                                    dividerText: "text-starlight/30 font-rajdhani uppercase tracking-widest text-xs",
                                    formFieldLabel: "text-starlight/70 font-rajdhani uppercase tracking-wide text-xs mb-1",
                                    formFieldInput: "bg-space-black/50 text-starlight border border-white/10 focus:border-solar-flare focus:ring-0 rounded-none font-mono placeholder-starlight/20 px-4 py-3 transition-colors",
                                    footer: "hidden",
                                    footerActionText: "text-starlight/50 font-rajdhani text-xs",
                                    footerActionLink: "text-solar-flare hover:text-white font-bold uppercase tracking-wider",
                                    formButtonPrimary: "bg-solar-flare hover:bg-white text-space-black font-orbitron font-bold uppercase tracking-widest rounded-none transition-all shadow-[0_0_15px_rgba(252,163,17,0.3)] hover:shadow-[0_0_25px_rgba(252,163,17,0.5)] py-3 mobile:py-4"
                                }
                            }}
                            signInUrl="#/login"
                        />
                    )}
                </div>
                <div className="text-center mt-8 relative z-10 space-y-4">
                    <div>
                        <h1 className="text-3xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-starlight via-solar-flare to-starlight tracking-widest drop-shadow-sm mb-1 opacity-80">
                            TRADESTACK
                        </h1>
                        <p className="text-[10px] font-bold text-nebula-blue font-rajdhani uppercase tracking-[0.5em]">
                            SECURE TERMINAL ACCESS
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.hash = ""}
                        className="text-starlight/30 hover:text-white text-xs font-rajdhani uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>← Return to Public Net</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;