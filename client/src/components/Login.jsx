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
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 bg-cover bg-center bg-no-repeat bg-fixed relative"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/85 z-0"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex justify-center">
                    {mode === "login" ? (
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none bg-transparent w-full",
                                    headerTitle: "text-gray-900 dark:text-white",
                                    headerSubtitle: "text-gray-500 dark:text-gray-400",
                                    socialButtonsBlockButton: "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600",
                                    dividerText: "text-gray-400",
                                    formFieldLabel: "text-gray-700 dark:text-gray-300",
                                    formFieldInput: "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
                                    footerActionText: "text-gray-500 dark:text-gray-400",
                                    footerActionLink: "text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                                }
                            }}
                            signUpUrl="#/signup"
                        />
                    ) : (
                        <SignUp
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none bg-transparent w-full",
                                    headerTitle: "text-gray-900 dark:text-white",
                                    headerSubtitle: "text-gray-500 dark:text-gray-400",
                                    socialButtonsBlockButton: "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600",
                                    dividerText: "text-gray-400",
                                    formFieldLabel: "text-gray-700 dark:text-gray-300",
                                    formFieldInput: "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
                                    footerActionText: "text-gray-500 dark:text-gray-400",
                                    footerActionLink: "text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                                }
                            }}
                            signInUrl="#/login"
                        />
                    )}
                </div>
                <div className="text-center mt-8 relative z-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tighter drop-shadow-sm mb-2">
                        TradeStack
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Professional Terminal
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;