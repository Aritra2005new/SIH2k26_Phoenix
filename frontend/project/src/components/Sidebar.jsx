import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/govstart-logo.png';

import {
  LayoutDashboard,
  Search,
  LogOut,
  Briefcase,
  Bell,
  ClipboardList,
} from 'lucide-react';

export default function Sidebar({ role = 'government' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const gov = [
    ['Dashboard', '/government/dashboard', LayoutDashboard],
    ['Create Challenge', '/government/search', Search],
    ['Applications & Projects', '/government/applications', ClipboardList],
    ['Notifications', '/government/notifications', Bell],
  ];

  const start = [
    ['Dashboard', '/startup/dashboard', LayoutDashboard],
    ['My Profile', '/startup/profile', Briefcase],
    ['Challenge Requests', '/startup/requests', ClipboardList],
    ['Active Projects', '/startup/projects', ClipboardList],
    ['Notifications', '/startup/notifications', Bell],
  ];

  const links = role === 'government' ? gov : start;

  return (
    <aside
      className="
        fixed left-0 top-0 z-40
        flex h-screen w-64 flex-col
        border-r border-[#4a3931]/10
        bg-[#fdfcfb]/95
        backdrop-blur-2xl
      "
    >
      {/* =====================================================
          LOGO
      ====================================================== */}
      <Link
        to="/"
        className="
          flex items-center gap-3
          border-b border-[#4a3931]/10
          px-5 py-5
          transition-colors
          hover:bg-[#e2d1c3]/20
        "
      >
        <img
          src={logo}
          alt="CivicSync"
          className="
            h-10 w-10
            shrink-0
            object-contain
          "
        />

        <span className="font-bold tracking-tight text-[#4a3931]">
          CivicSync
          <span className="text-[#806e63]">
            AI
          </span>
        </span>
      </Link>

      {/* =====================================================
          USER INFORMATION
      ====================================================== */}
      <div
        className="
          mx-3 mt-4
          rounded-2xl
          border border-[#4a3931]/10
          bg-[#e2d1c3]/30
          p-4
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.15em]
            text-[#9b877b]
          "
        >
          Signed in as
        </p>

        <p
          className="
            mt-1
            truncate
            text-sm
            font-semibold
            text-[#4a3931]
          "
        >
          {user?.username || 'User'}
        </p>

        <p
          className="
            mt-1
            text-xs
            capitalize
            text-[#806e63]
          "
        >
          {role} portal
        </p>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {links.map(([label, to, Icon]) => {
          const active = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`
                group
                flex items-center gap-3
                rounded-xl
                px-3 py-3
                text-sm font-medium
                transition-all duration-200

                ${
                  active
                    ? `
                      bg-[#e2d1c3]
                      text-[#4a3931]
                      shadow-sm
                    `
                    : `
                      text-[#806e63]
                      hover:bg-[#e2d1c3]/40
                      hover:text-[#4a3931]
                    `
                }
              `}
            >
              <Icon
                className={`
                  h-4 w-4
                  shrink-0
                  transition-colors duration-200

                  ${
                    active
                      ? 'text-[#4a3931]'
                      : `
                        text-[#9b877b]
                        group-hover:text-[#4a3931]
                      `
                  }
                `}
              />

              <span>{label}</span>

              {active && (
                <span
                  className="
                    ml-auto
                    h-1.5 w-1.5
                    rounded-full
                    bg-[#4a3931]
                  "
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          LOGOUT
      ====================================================== */}
      <div className="border-t border-[#4a3931]/10 p-3">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="
            group
            flex w-full
            items-center gap-3
            rounded-xl
            px-3 py-3
            text-sm
            text-[#806e63]
            transition-all duration-200
            hover:bg-[#e2d1c3]/40
            hover:text-[#4a3931]
          "
        >
          <LogOut
            className="
              h-4 w-4
              text-[#9b877b]
              transition-colors
              group-hover:text-[#4a3931]
            "
          />

          Logout
        </button>
      </div>
    </aside>
  );
}