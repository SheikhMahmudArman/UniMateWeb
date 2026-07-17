import { useState } from 'react';

const Login = () => {
    const [studentId, setStudentId] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder – no real authentication yet
        alert('Login successful! (This is placeholder)');
    };

    const handleRegisterClick = () => {
        alert('Registration feature coming soon!');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 p-4">
            {/* Glassmorphism Card */}
            <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">

                {/* Logo & Title */}
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white drop-shadow-lg"> UniMate</h1>
                    <p className="mt-2 text-indigo-200 font-medium">Welcome back, Student!</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Student ID */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">
                            🆔 Student ID
                        </label>
                        <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            placeholder="e.g. 2024-1-60-001"
                            required
                        />
                    </div>

                    {/* Gmail */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">
                            📧 Gmail
                        </label>
                        <input
                            type="email"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            placeholder="student@gmail.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">
                            🔒 Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-indigo-200">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm text-purple-300 hover:text-white transition">
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition duration-200"
                    >
                        Sign In
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm text-indigo-200">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={handleRegisterClick}
                            className="font-semibold text-white hover:text-purple-300 transition underline-offset-2 hover:underline"
                        >
                            Register here →
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;