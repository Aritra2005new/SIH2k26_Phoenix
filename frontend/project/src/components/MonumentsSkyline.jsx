export default function MonumentsSkyline({ className = '' }) {
    const INK = '#5C4433';
    const INK_SOFT = '#8A7059';
    const PAPER = '#EFE4CE';

    return (
        <svg
            viewBox="0 0 1600 240"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax slice"
            className={className}
            role="img"
            aria-label="Line illustration of iconic Indian monuments across a skyline"
        >
            <rect x="0" y="0" width="1600" height="240" fill={PAPER} />

            <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {/* Baseline */}
                <line x1="0" y1="228" x2="1600" y2="228" strokeWidth="2.5" stroke={INK_SOFT} />

                {/* ===== INDIA GATE ===== */}
                <g transform="translate(20,0)">
                    <path d="M 10 228 V 128 H 118 V 228" />
                    <path d="M 0 128 H 128 V 114 H 0 Z" />
                    <path d="M 16 114 H 112 V 102 H 16 Z" />
                    <path d="M 28 102 H 100 V 92 H 28 Z" />
                    <path d="M 46 228 V 158 C 46 142, 82 142, 82 158 V 228" />
                    <line x1="30" y1="128" x2="30" y2="228" strokeWidth="1" stroke={INK_SOFT} strokeDasharray="3 4" />
                    <line x1="98" y1="128" x2="98" y2="228" strokeWidth="1" stroke={INK_SOFT} strokeDasharray="3 4" />
                </g>

                {/* ===== HOWRAH BRIDGE ===== */}
                <g transform="translate(175,0)">
                    <path d="M 0 228 L 30 188 L 60 228 L 90 188 L 120 228" strokeWidth="1.6" stroke={INK_SOFT} />
                    <line x1="0" y1="188" x2="120" y2="188" strokeWidth="1.6" stroke={INK_SOFT} />
                    <line x1="10" y1="228" x2="10" y2="188" strokeWidth="1.2" stroke={INK_SOFT} />
                    <line x1="110" y1="228" x2="110" y2="188" strokeWidth="1.2" stroke={INK_SOFT} />
                </g>

                {/* ===== KONARK SUN TEMPLE ===== */}
                <g transform="translate(320,0)">
                    <path d="M 0 228 V 176 L 65 108 L 130 176 V 228 Z" />
                    <path d="M 22 176 H 108" />
                    <path d="M 38 150 H 92" />
                    <path d="M 50 128 H 80" />
                    <path d="M 50 108 V 92 C 50 85, 80 85, 80 92 V 108" />
                    {/* chariot wheel */}
                    <circle cx="65" cy="205" r="22" />
                    <circle cx="65" cy="205" r="4" />
                    {[0, 45, 90, 135].map((a) => (
                        <line
                            key={a}
                            x1={65 - 22 * Math.cos((a * Math.PI) / 180)}
                            y1={205 - 22 * Math.sin((a * Math.PI) / 180)}
                            x2={65 + 22 * Math.cos((a * Math.PI) / 180)}
                            y2={205 + 22 * Math.sin((a * Math.PI) / 180)}
                            strokeWidth="1.2"
                        />
                    ))}
                </g>

                {/* ===== CHARMINAR-STYLE MINARET ===== */}
                <g transform="translate(500,0)">
                    <path d="M 0 228 V 100 H 14 V 228" />
                    <path d="M -4 128 H 18" />
                    <path d="M -4 170 H 18" />
                    <circle cx="7" cy="92" r="6" />
                </g>

                {/* ===== TAJ MAHAL ===== */}
                <g transform="translate(560,0)">
                    {/* left minaret */}
                    <path d="M 0 228 V 92 H 14 V 228" />
                    <path d="M -4 138 H 18" />
                    <path d="M -4 182 H 18" />
                    <circle cx="7" cy="84" r="5.5" />

                    {/* main plinth */}
                    <path d="M 44 228 V 138 H 216 V 228 Z" />

                    {/* grand central arch */}
                    <path d="M 92 228 V 158 C 92 138, 168 138, 168 158 V 228 Z" />
                    <path d="M 106 228 V 182 C 106 168, 154 168, 154 182 V 228 Z" />

                    {/* side arches */}
                    <path d="M 56 172 C 56 160, 78 160, 78 172 V 188 H 56 Z" />
                    <path d="M 56 206 C 56 197, 78 197, 78 206 V 224 H 56 Z" />
                    <path d="M 182 172 C 182 160, 204 160, 204 172 V 188 H 182 Z" />
                    <path d="M 182 206 C 182 197, 204 197, 204 206 V 224 H 182 Z" />

                    {/* main dome */}
                    <path d="M 78 138 C 78 66, 182 66, 182 138 Z" />
                    <line x1="130" y1="66" x2="130" y2="44" strokeWidth="2.2" />
                    <circle cx="130" cy="40" r="3" />

                    {/* flanking cupolas */}
                    <path d="M 58 138 V 116 C 58 106, 78 106, 78 116 V 138" />
                    <path d="M 182 138 V 116 C 182 106, 202 106, 202 116 V 138" />

                    {/* right minaret */}
                    <path d="M 246 228 V 92 H 260 V 228" />
                    <path d="M 242 138 H 264" />
                    <path d="M 242 182 H 264" />
                    <circle cx="253" cy="84" r="5.5" />
                </g>

                {/* ===== GATEWAY OF INDIA ===== */}
                <g transform="translate(870,0)">
                    <path d="M 0 228 V 132 H 130 V 228" />
                    <path d="M -10 132 H 140 V 120 H -10 Z" />
                    <path d="M 40 228 V 160 C 40 144, 90 144, 90 160 V 228" />
                    <path d="M 12 182 V 160 C 12 151, 28 151, 28 160 V 182" />
                    <path d="M 102 182 V 160 C 102 151, 118 151, 118 160 V 182" />
                    <path d="M 48 120 C 48 100, 82 100, 82 120" />
                </g>

                {/* ===== SOUTH INDIAN GOPURAM ===== */}
                <g transform="translate(1055,0)">
                    <path d="M 0 228 L 26 88 H 100 L 126 228 Z" />
                    <path d="M 16 196 H 110" />
                    <path d="M 22 166 H 104" />
                    <path d="M 27 138 H 99" />
                    <path d="M 32 112 H 94" />
                    <path d="M 40 88 V 76" />
                    <path d="M 63 88 V 74" />
                    <path d="M 86 88 V 76" />
                    <path d="M 46 228 V 190 C 46 183, 80 183, 80 190 V 228 Z" />
                </g>

                {/* ===== VICTORIA MEMORIAL ===== */}
                <g transform="translate(1240,0)">
                    <path d="M 0 228 V 168 H 140 V 228" />
                    <path d="M 40 168 C 40 112, 100 112, 100 168" />
                    <line x1="70" y1="112" x2="70" y2="92" strokeWidth="2.2" />
                    <circle cx="70" cy="87" r="3.5" />
                    <path d="M 14 210 V 190 C 14 184, 30 184, 30 190 V 210" strokeWidth="1.3" />
                    <path d="M 110 210 V 190 C 110 184, 126 184, 126 190 V 210" strokeWidth="1.3" />
                </g>

                {/* ===== QUTUB MINAR ===== */}
                <g transform="translate(1430,0)">
                    <path d="M -4 228 L 15 60 H 27 L 46 228 Z" />
                    <path d="M -8 196 H 50" strokeWidth="2" />
                    <path d="M -2 164 H 44" strokeWidth="2" />
                    <path d="M 4 132 H 38" strokeWidth="2" />
                    <path d="M 10 100 H 32" strokeWidth="2" />
                    <path d="M 15 72 H 27" strokeWidth="2" />
                    <circle cx="21" cy="54" r="3.5" />
                </g>
            </g>
        </svg>
    );
}