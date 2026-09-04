import { Link, useLocation } from 'react-router-dom';

export default function AuthToggle() {
  const location = useLocation();

  const isLogin = location.pathname === '/login';

  return (
    <div className="mt-6 flex justify-center">
      <div className="relative flex w-full max-w-xs rounded-xl border border-white/10 bg-black/20 p-1 backdrop-blur-md">

        {/* Sliding background */}
        <div
          className={`absolute bottom-1 top-1 w-1/2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-lg transition-all duration-300 ease-out ${
            isLogin ? 'left-1' : 'left-1/2'
          }`}
        />

        {/* Login */}
        <Link
          to="/login"
          className={`relative z-10 w-1/2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors duration-300 ${
            isLogin
              ? 'text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Login
        </Link>

        {/* Sign Up */}
        <Link
          to="/register"
          className={`relative z-10 w-1/2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors duration-300 ${
            !isLogin
              ? 'text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Sign Up
        </Link>

      </div>
    </div>
  );
}