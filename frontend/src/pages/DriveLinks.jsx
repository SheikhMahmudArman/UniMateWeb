import { useNavigate } from 'react-router-dom';

const DriveLinks = () => {
    const navigate = useNavigate();

    // YOUR FEATURES: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2
    const driveLinks = [
        { id: '1.1', icon: '📁' },
        { id: '1.2', icon: '📁' },
        { id: '2.1', icon: '📁' },
        { id: '2.2', icon: '📁' },
        { id: '3.1', icon: '📁' },
        { id: '3.2', icon: '📁' },
        { id: '4.1', icon: '📁' },
        { id: '4.2', icon: '📁' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 relative overflow-hidden">

            <div className="absolute top-[-200px] right-[-200px] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-200px] left-[-200px] w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative max-w-7xl mx-auto">

                {/* Top Bar */}
                <div className="glass-premium rounded-2xl p-6 mb-8 flex flex-wrap justify-between items-center gap-4 border-l-4 border-cyan-400/30">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            📚 UniMateWeb
                        </h1>
                        <p className="text-gray-400 text-sm font-light mt-0.5">
                            All Drive Links
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-300 hover:text-white transition border border-white/5 text-sm font-medium"
                        >
                            🏠 Home
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-300 hover:text-white transition border border-white/5 text-sm font-medium"
                        >
                            ⚙️ Settings
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-300 hover:text-red-200 transition border border-red-500/10 text-sm font-medium"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>


                <div>
                    <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">🔗 All Drive Links</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {driveLinks.map((link, index) => (
                            <div
                                key={index}
                                className="glass-premium rounded-2xl p-6 text-center border-2 border-white/5 hover:border-blue-400/30 hover:bg-white/5 transition-all duration-300 hover:scale-[1.05] cursor-pointer"
                                onClick={() => alert(`Opening Drive Link for ${link.id}`)}
                            >
                                <div className="text-4xl mb-2">{link.icon}</div>
                                <p className="text-white font-bold text-xl">{link.id}</p>
                                <p className="text-blue-400/50 text-xs mt-1">Open Drive →</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-600 text-xs font-light tracking-wider">
                    UniMateWeb • Built with ❤️
                </div>
            </div>
        </div>
    );
};

export default DriveLinks;