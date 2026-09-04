import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
    Menu,
    X,
    Sparkles,
} from 'lucide-react';

import NotificationBell from './NotificationBell';

import logo from '../assets/govstart-logo.png';
import indiaSkyline from '../assets/india-skyline.png';

import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);

    const sections = [
        ['How It Works', 'how-it-works'],
        ['For Government', 'for-government'],
        ['For Startups', 'for-startups'],
    ];

    const dashboardPath =
        user?.role === 'government'
            ? '/government/dashboard'
            : '/startup/dashboard';

    function click(id) {
        setMobileOpen(false);

        if (location.pathname === '/') {
            document
                .getElementById(id)
                ?.scrollIntoView({
                    behavior: 'smooth',
                });
        } else {
            navigate(`/#${id}`);
        }
    }

    function goHome() {
        setMobileOpen(false);

        if (location.pathname === '/') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            navigate('/');
        }
    }

    return (
        <nav
            className="
                sticky
                top-0
                z-50
                overflow-hidden
                border-b
                border-[#4a3931]/10
                bg-[#fdfcfb]
                shadow-[0_4px_18px_rgba(74,57,49,0.08)]
            "
        >

            {/* =====================================================
                INDIA HERITAGE SKYLINE
            ====================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    overflow-hidden
                "
            >
                <img
                    src={indiaSkyline}
                    alt=""
                    className="
                        absolute
                        bottom-0
                        left-0
                        h-full
                        w-full
                        object-cover
                        object-bottom
                        opacity-[0.75]
                    "
                />
            </div>


            {/* =====================================================
                SOFT BACKGROUND OVERLAY
            ====================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-[1]
                    bg-gradient-to-b
                    from-[#fdfcfb]/95
                    via-[#fdfcfb]/75
                    to-[#fdfcfb]/35
                "
            />


            {/* =====================================================
                MAIN NAVBAR
            ====================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    py-3
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =================================================
                    LOGO
                ================================================== */}

                <Link
                    to="/"
                    className="
                        group
                        flex
                        items-center
                        gap-2.5
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            transition-transform
                            duration-300
                            group-hover:scale-105
                        "
                    >
                        <img
                            src={logo}
                            alt="CivicSyncAI"
                            className="
                                h-9
                                w-9
                                object-contain
                            "
                        />
                    </div>

                    <span
                        className="
                            font-bold
                            tracking-tight
                            text-[#4a3931]
                        "
                    >
                        CivicSync
                        <span className="text-[#806e63]">
                            AI
                        </span>
                    </span>

                </Link>


                {/* =================================================
                    DESKTOP NAV
                ================================================== */}

                <div
                    className="
                        hidden
                        items-center
                        gap-6
                        md:flex
                    "
                >

                    {/* HOME */}

                    <button
                        onClick={goHome}
                        className="
                            group
                            relative
                            text-sm
                            text-[#806e63]
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:text-[#4a3931]
                        "
                    >
                        Home

                        <span
                            className="
                                absolute
                                -bottom-1
                                left-0
                                h-[1.5px]
                                w-0
                                bg-[#8b5e3c]
                                transition-all
                                duration-300
                                group-hover:w-full
                            "
                        />
                    </button>


                    {/* SECTIONS */}

                    {sections.map(([label, id]) => (
                        <button
                            key={id}
                            onClick={() => click(id)}
                            className="
                                group
                                relative
                                text-sm
                                text-[#806e63]
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:text-[#4a3931]
                            "
                        >
                            {label}

                            <span
                                className="
                                    absolute
                                    -bottom-1
                                    left-0
                                    h-[1.5px]
                                    w-0
                                    bg-[#8b5e3c]
                                    transition-all
                                    duration-300
                                    group-hover:w-full
                                "
                            />
                        </button>
                    ))}


                    {/* DIVIDER */}

                    <div
                        className="
                            ml-1
                            h-6
                            w-px
                            bg-[#4a3931]/10
                        "
                    />


                    {/* =================================================
                        USER ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        {/* Notification */}

                        {user && (
                            <div
                                className="
                                    transition-transform
                                    duration-300
                                    hover:scale-105
                                "
                            >
                                <NotificationBell />
                            </div>
                        )}


                        {/* =================================================
                            LOGGED IN
                        ================================================== */}

                        {user ? (
                            <>

                                {/* Dashboard */}

                                <Link
                                    to={dashboardPath}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        rounded-xl
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-[#6b5a50]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:bg-[#e2d1c3]/45
                                        hover:text-[#4a3931]
                                    "
                                >
                                    Dashboard
                                </Link>


                                {/* Logout */}

                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-[#4a3931]/20
                                        bg-[#e2d1c3]/35
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-[#4a3931]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:border-[#4a3931]/30
                                        hover:bg-[#e2d1c3]/60
                                    "
                                >
                                    Logout
                                </button>

                            </>
                        ) : (

                            /* =================================================
                                LOGGED OUT
                            ================================================== */

                            <>

                                {/* Login */}

                                <Link
                                    to="/login"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        rounded-xl
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-[#6b5a50]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:bg-[#e2d1c3]/45
                                        hover:text-[#4a3931]
                                    "
                                >
                                    Login
                                </Link>


                                {/* Register */}

                                <Link
                                    to="/register"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-[#4a3931]
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-[#fdfcfb]
                                        shadow-[0_8px_22px_rgba(74,57,49,0.15)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:bg-[#5b463c]
                                        hover:shadow-[0_10px_28px_rgba(74,57,49,0.22)]
                                    "
                                >

                                    <Sparkles
                                        className="
                                            h-4
                                            w-4
                                            transition-transform
                                            duration-300
                                            group-hover:rotate-12
                                        "
                                    />

                                    Register

                                </Link>

                            </>
                        )}

                    </div>

                </div>


                {/* =================================================
                    MOBILE BUTTON
                ================================================== */}

                <button
                    className="
                        relative
                        z-20
                        rounded-lg
                        p-2
                        text-[#4a3931]
                        transition-all
                        duration-200
                        hover:bg-[#e2d1c3]/40
                        md:hidden
                    "
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >

                    {mobileOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}

                </button>

            </div>


            {/* =====================================================
                MOBILE MENU
            ====================================================== */}

            {mobileOpen && (
                <div
                    className="
                        relative
                        z-20
                        border-t
                        border-[#4a3931]/10
                        bg-[#fdfcfb]/95
                        px-4
                        py-4
                        shadow-lg
                        backdrop-blur-xl
                        md:hidden
                    "
                >

                    {/* Home */}

                    <Link
                        to="/"
                        onClick={() => setMobileOpen(false)}
                        className="
                            block
                            w-full
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            text-[#6b5a50]
                            transition-all
                            duration-200
                            hover:bg-[#e2d1c3]/30
                            hover:text-[#4a3931]
                        "
                    >
                        Home
                    </Link>


                    {/* Sections */}

                    {sections.map(([label, id]) => (
                        <button
                            key={id}
                            onClick={() => click(id)}
                            className="
                                block
                                w-full
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-[#6b5a50]
                                transition-all
                                duration-200
                                hover:bg-[#e2d1c3]/30
                                hover:text-[#4a3931]
                            "
                        >
                            {label}
                        </button>
                    ))}


                    {/* Divider */}

                    <div
                        className="
                            my-3
                            h-px
                            bg-[#4a3931]/10
                        "
                    />


                    {/* Mobile actions */}

                    <div className="mt-3 flex gap-2">

                        {user ? (
                            <>

                                <Link
                                    to={dashboardPath}
                                    onClick={() => setMobileOpen(false)}
                                    className="
                                        flex-1
                                        rounded-xl
                                        bg-[#e2d1c3]/45
                                        px-4
                                        py-2.5
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-[#4a3931]
                                        transition-all
                                        duration-300
                                        hover:bg-[#e2d1c3]/65
                                    "
                                >
                                    Dashboard
                                </Link>


                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileOpen(false);
                                        navigate('/');
                                    }}
                                    className="
                                        flex-1
                                        rounded-xl
                                        bg-[#4a3931]
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-[#fdfcfb]
                                        transition-all
                                        duration-300
                                        hover:bg-[#5b463c]
                                    "
                                >
                                    Logout
                                </button>

                            </>
                        ) : (
                            <>

                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="
                                        flex-1
                                        rounded-xl
                                        bg-[#e2d1c3]/45
                                        px-4
                                        py-2.5
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-[#4a3931]
                                        transition-all
                                        duration-300
                                        hover:bg-[#e2d1c3]/65
                                    "
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="
                                        flex-1
                                        rounded-xl
                                        bg-[#4a3931]
                                        px-4
                                        py-2.5
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-[#fdfcfb]
                                        transition-all
                                        duration-300
                                        hover:bg-[#5b463c]
                                    "
                                >
                                    Register
                                </Link>

                            </>
                        )}

                    </div>

                </div>
            )}


            {/* =====================================================
                SUBTLE BROWN BOTTOM ACCENT
            ====================================================== */}

            <div
                className="
                    relative
                    z-20
                    h-[2px]
                    w-full
                    bg-[#8b5e3c]/20
                "
            />

        </nav>
    );
}