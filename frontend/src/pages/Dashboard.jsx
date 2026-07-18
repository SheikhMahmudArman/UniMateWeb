import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const quickActions = [
        { title: 'Daily Routine', icon: '📋', path: '/dashboard' },
        { title: 'Documents', icon: '📄', path: '/dashboard' },
        { title: 'Drive Link', icon: '🔗', path: '/drivelinks' },
        { title: 'Theory', icon: '📚', path: '/dashboard' },
        { title: 'Lab', icon: '🧪', path: '/dashboard' },
    ];

    const stats = [
        { label: 'Courses', value: '6', icon: '📚' },
        { label: 'Quizzes', value: '2', icon: '📝' },
        { label: 'Tasks', value: '3', icon: '📄' },
    ];

    const handleMainCircleClick = () => {
        alert('📅 Navigating to Semester Details page! (Coming soon)');
    };

    const handleLogout = () => {
        console.log("🔴 Logging out...");
        navigate('/login');
    };

    return (
        <div className="h-screen w-full bg-[#0a0a0a] p-3 relative overflow-hidden flex flex-col">

            <div className="absolute top-[-100px] right-[-100px] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[200px] h-[200px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative w-full max-w-7xl mx-auto flex flex-col h-full">

                <div className="glass-premium rounded-xl p-3 mb-3 flex flex-wrap justify-between items-center border-l-4 border-blue-400/30 w-full flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            📚 UniMateWeb
                        </h1>
                        <p className="text-gray-400 text-xs font-light">Welcome back!</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition border border-white/5 text-xs cursor-pointer"
                        >
                            ⚙️ Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-300 hover:text-red-200 transition border border-red-500/10 text-xs cursor-pointer"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 flex-shrink-0">
                    {stats.map((stat, index) => (
                        <div key={index} className="glass-premium rounded-xl p-3 border border-white/5 hover:border-blue-400/20 transition-all duration-300">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{stat.icon}</span>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">{stat.label}</p>
                                    <p className="text-white text-xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 w-full min-h-0">
                    <div className="lg:col-span-3 flex justify-center items-center">
                        <button
                            onClick={handleMainCircleClick}
                            className="relative w-56 h-56 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-500/20 border-4 border-blue-400/30 hover:border-blue-400/70 hover:scale-[1.05] transition-all duration-300 flex flex-col items-center justify-center shadow-2xl hover:shadow-blue-500/20 group cursor-pointer"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/5 to-cyan-400/5 blur-xl"></div>
                            <span className="text-5xl font-extrabold text-white relative z-10">3.1</span>
                            <span className="text-xl font-semibold text-cyan-300/80 relative z-10">Fall-2025</span>
                            <span className="text-[10px] text-gray-500 mt-1.5 relative z-10 group-hover:text-blue-400 transition">Click →</span>
                            <div className="absolute inset-[-6px] rounded-full border-2 border-blue-400/10 animate-ping"></div>
                        </button>
                    </div>

                    <div className="lg:col-span-2 flex flex-col justify-center space-y-1.5">
                        <h2 className="text-white/40 text-[10px] font-medium uppercase tracking-wider text-center mb-1">Quick Actions</h2>
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(action.path)}
                                className="glass-premium rounded-xl p-2.5 border border-white/5 hover:border-blue-400/30 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] text-left flex items-center gap-2.5 cursor-pointer"
                            >
                                <span className="text-xl">{action.icon}</span>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium text-xs">{action.title}</h3>
                                    <p className="text-blue-400/30 text-[9px]">Click →</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-center text-gray-600 text-[10px] font-light tracking-wider mt-1 flex-shrink-0">
                    UniMateWeb • Built with ❤️
                </div>
            </div>
        </div>
    );
};

export default Dashboard;