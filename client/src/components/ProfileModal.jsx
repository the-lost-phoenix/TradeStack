import React from 'react';

function ProfileModal({ user, isOpen, onClose }) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">

                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white font-bold">✕</button>

                <div className="px-6 pb-6 relative">
                    {/* Avatar */}
                    <div className="w-20 h-20 -mt-10 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white shadow-md">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="mt-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Virtual IBAN</p>
                                <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{user.virtualIban}</p>
                            </div>
                            <button className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:opacity-80">Copy</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] uppercase font-bold text-gray-500">Wallet Balance</p>
                                <p className="font-bold text-green-500">${user.walletBalance?.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] uppercase font-bold text-gray-500">Total Trades</p>
                                <p className="font-bold text-gray-900 dark:text-white">{(user.portfolio?.length || 0) * 12} <span className="text-[10px] font-normal text-gray-400">(Simulated)</span></p>
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform">
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;