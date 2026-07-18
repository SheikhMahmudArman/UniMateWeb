import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();


    const settingsItems = [
        { title: 'Dates', icon: '📅', description: 'View important academic dates' },
        { title: 'Quiz', icon: '📝', description: 'Quiz schedules and results' },
        { title: 'Mid', icon: '📊', description: 'Mid-term exam details' },
        { title: 'Final', icon: '🎯', description: 'Final exam information' },
        { title: 'Marks', icon: '📈', description: 'View your marks' },
        { title: 'CGPA', icon: '🎓', description: 'Your CGPA and GPA details' },
        { title: 'Faculty', icon: '👨‍🏫', description: 'Faculty information' },
        { title: 'About', icon: 'ℹ️', description: 'About UniMateWeb' },
    ];

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] p-6 relative overflow-hidden">

            <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative max-w-7xl mx-auto">

                {/* Top Bar */}
                <div className="glass-premium rounded-2xl p-6 mb-8 flex flex-wrap justify-between items-center gap-4 border-l-4 border-blue-400/30">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            📚 UniMateWeb
                        </h1>
                        <p className="text-gray-400 text-lg font-light mt-1">Settings & Information</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-300 hover:text-white transition border border-white/5 text-sm font-medium"
                        >
                            🏠 Home
                        </button>
                        <button
                            onClick={() => navigate('/drivelinks')}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-300 hover:text-white transition border border-white/5 text-sm font-medium"
                        >
                            🔗 Drive Links
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-300 hover:text-red-200 transition border border-red-500/10 text-sm font-medium"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {settingsItems.map((item, index) => (
                        <div
                            key={index}
                            className="glass-premium rounded-2xl p-5 border-2 border-white/5 hover:border-cyan-400/30 hover:bg-white/5 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                            onClick={() => alert(`Opening ${item.title}...`)}
                        >
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                            <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                            <p className="text-blue-400/30 text-xs mt-2">View →</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center text-gray-600 text-sm font-light tracking-wider">
                    UniMateWeb • Built with ❤️
                </div>
            </div>
        </div>
    );
};

export default Settings;