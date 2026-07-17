import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('🎉 Welcome back! Redirecting to Dashboard...');
            navigate('/dashboard');
        }, 800);
    };

    const handleRegisterClick = () => {
        alert('✨ Registration feature coming soon!');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative w-full max-w-md p-10 space-y-8 bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/5 glow-animate">
                <div className="text-center space-y-3">
                    <div className="inline-block p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-6xl">📚</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                        UniMateWeb
                    </h1>
                    <p className="text-gray-400 font-light tracking-wide">Welcome back, Scholar</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🆔</span>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your student ID"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Gmail</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">📧</span>
                            <input
                                type="text"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your Gmail"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🔒</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400/50 focus:ring-2 cursor-pointer"
                            />
                            <span className="text-sm text-gray-500 group-hover:text-gray-300 transition">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-400/70 hover:text-blue-300 transition font-medium">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`relative w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        <span className="shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"></span>
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <span
                            onClick={handleRegisterClick}
                            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 transition cursor-pointer"
                        >
                            Create account →
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;