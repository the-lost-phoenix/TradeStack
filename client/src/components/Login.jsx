import { useState } from "react";

function Login({ onLogin, onBack }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState(""); // NEW: Name state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const endpoint = isRegistering ? "/api/register" : "/api/login";

        // Include 'name' only if registering
        const payload = isRegistering
            ? { name, email, password }
            : { email, password };

        try {
            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data.user);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Server error. Is the backend running?");
        }
    };

    // MOCK GOOGLE LOGIN
    const handleGoogleLogin = async () => {
        const mockGoogleUser = {
            name: "Vijay Netekal", // Simulation
            email: "vijay.demo@gmail.com",
            photoUrl: "https://ui-avatars.com/api/?name=Vijay+Netekal&background=random"
        };

        try {
            const response = await fetch("http://localhost:3001/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mockGoogleUser),
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data.user);
            }
        } catch (err) {
            setError("Google Login Failed");
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 bg-cover bg-center bg-no-repeat bg-fixed relative"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/85 z-0"></div>

            <button onClick={onBack} className="absolute top-6 left-6 text-gray-600 dark:text-gray-400 hover:text-blue-500 font-bold flex items-center gap-2 z-20">
                ← Back to Home
            </button>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative z-10">
                <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-500 mb-2">
                    {isRegistering ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                    Login to access your TradeStack Terminal.
                </p>

                {/* GOOGLE BUTTON */}
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 font-bold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Sign in with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Or with Email</span>
                    <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* NEW: Full Name Input (Only shows when Registering) */}
                    {isRegistering && (
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-colors" placeholder="name@example.com" required />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" required />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
                        {isRegistering ? "Create Account" : "Login to Terminal"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                    {isRegistering ? "Already have an account?" : "Need an account?"}{" "}
                    <button onClick={() => setIsRegistering(!isRegistering)} className="text-blue-500 hover:underline font-bold">
                        {isRegistering ? "Login" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;