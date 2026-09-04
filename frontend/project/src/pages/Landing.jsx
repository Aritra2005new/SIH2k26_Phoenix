import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

import Navbar from '../components/Navbar';
import Button from '../components/Button';
import BorderGlow from '../components/visuals/BorderGlow';

import logo from '../assets/govstart-logo.png';
import indiaGateway from '../assets/try1.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import aiNetwork from '../assets/v31.png';
import procurement from '../assets/v22.png';
import startups from '../assets/v3.png';
import transparency from '../assets/v4.png';

import 'swiper/css';
import 'swiper/css/pagination';

import {
  Brain,
  Target,
  ArrowRight,
  Building2,
  Network,
  Rocket,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart3,
  FileText,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

/* count-up hook */
function useCountUp(target, duration = 1800, triggered = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return value;
}

/* animated stat card */
function StatItem({ value, suffix = '', label, icon: Icon, triggered, delay = 0 }) {
  const count = useCountUp(value, 1800, triggered);
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={triggered ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#4a3931]/12 bg-[#e2d1c3]/40">
        <Icon className="h-5 w-5 text-[#8b4f25]" />
      </div>
      <p className="font-['Manrope'] text-3xl font-bold tracking-tight text-[#4a3931]">
        {count}{suffix}
      </p>
      <p className="mt-1 text-xs font-medium text-[#806f65]">{label}</p>
    </motion.div>
  );
}

/* scroll-reveal section header */
function SectionHeader({ label, heading, align = 'center', children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={align === 'center' ? 'text-center' : ''}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-['Manrope'] text-xs font-bold uppercase tracking-[.2em] text-[#8b4f25]">
        {label}
      </p>
      <h2 className="mt-3 font-['Manrope'] text-3xl font-bold tracking-tight text-[#4a3931] sm:text-5xl">
        {heading}
      </h2>
      {align === 'center' && (
        <div className="mx-auto mt-5 flex items-center justify-center gap-3">
          <div className="gradient-rule" />
        </div>
      )}
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const section = document.getElementById('how-it-works');
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setWorkflowVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = document.getElementById('stats-strip');
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const governmentCta = user?.role === 'government' ? '/government/dashboard' : '/login';
  const startupCta    = user?.role === 'startup'    ? '/startup/profile'      : '/register';

  const steps = [
    { num: '01', title: 'Government Problem',  desc: 'Describe a real challenge in natural language.',                              icon: Building2 },
    { num: '02', title: 'AI Analysis',          desc: 'Requirements are structured and interpreted automatically.',                   icon: Brain     },
    { num: '03', title: 'Capability Matching',  desc: 'The matching engine compares the challenge with startup capabilities.',        icon: Network   },
    { num: '04', title: 'Ranked Results',        desc: 'Review relevant startups with scores and explanations.',                      icon: Target    },
  ];

  const benefits = [
    { icon: Rocket,      title: 'Startup Discovery',           desc: 'Connect government departments with innovative startups solving real-world problems.',                             image: startups     },
    { icon: Brain,       title: 'AI-Powered Startup Matching', desc: "Discover the most relevant startups for your department's specific problem.",                                      image: aiNetwork    },
    { icon: Zap,         title: 'Faster Procurement',          desc: 'Reduce the time required to discover, evaluate and pilot innovative solutions.',                                   image: procurement  },
    { icon: ShieldCheck, title: 'Transparent Decisions',       desc: 'Make procurement decisions with structured data, clear recommendations and greater transparency.',                 image: transparency },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Startups Registered',    icon: Rocket    },
    { value: 12,  suffix: '',  label: 'Government Departments', icon: Building2 },
    { value: 80,  suffix: '+', label: 'Challenges Posted',      icon: FileText  },
    { value: 94,  suffix: '%', label: 'AI Match Accuracy',      icon: BarChart3 },
  ];

  const partners = [
    'Ministry of Electronics & IT', 'Startup India', 'DPIIT', 'Ministry of Commerce',
    'NITI Aayog', 'Atal Innovation Mission', 'Ministry of Science & Technology',
    'iDEX — Defence Innovation', 'Digital India', 'Ministry of Health', 'SIDBI', 'GeM Portal',
  ];

  const heroWords  = ['Solve', 'Public', 'Problems.'];
  const heroAccent = ['Discover', 'the', 'Right', 'Startups.'];

  return (
    <div className="landing-page min-h-screen bg-[#fdfcfb] text-[#4a3931]">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative min-h-[calc(100vh-65px)] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={indiaGateway} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#21140f]/80 via-[#3b2117]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#fdfcfb] via-[#fdfcfb]/55 to-transparent" />
            <div className="absolute inset-0 bg-[#5b321f]/10" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">

              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-white/30 badge-shimmer px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                <Sparkles className="h-4 w-4" />
                Government Innovation · Powered by AI
              </motion.div>

              <h1 className="mt-7 font-['Manrope'] text-5xl font-medium leading-[1.08] tracking-[-0.04em] lg:text-6xl">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={word}
                    className="mr-3 inline-block"
                    initial={{ opacity: 0, y: 38 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                {heroAccent.map((word, i) => (
                  <motion.span
                    key={word}
                    className="mr-3 inline-block text-[#f7d7ae]"
                    initial={{ opacity: 0, y: 38 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="mt-7 max-w-2xl text-base leading-7 text-white/85 sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Connecting government challenges with innovative startups
                through an AI-powered procurement and discovery platform.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.15 }}
              >
                <Button
                  to={governmentCta}
                  className="border-[#3d2114] bg-[#3d2114] px-7 py-3.5 text-base text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#2c160d]"
                >
                  <Building2 className="h-4 w-4" />
                  Explore Challenges
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  to={startupCta}
                  variant="secondary"
                  className="border-white/70 bg-white/90 px-7 py-3.5 text-base text-[#3d2114] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <Rocket className="h-4 w-4" />
                  I'm a Startup
                </Button>
              </motion.div>

              <motion.div
                className="mt-8 flex flex-wrap gap-3 text-xs"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.35 }}
              >
                {['Natural-language challenges', 'AI-assisted matching', 'Transparent procurement'].map((pill) => (
                  <span key={pill} className="rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-white/90 backdrop-blur-md">
                    {pill}
                  </span>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* STATS STRIP (Commented out)
        <section id="stats-strip" className="relative border-t border-[#4a3931]/10 bg-[#fdfcfb] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map(({ value, suffix, label, icon }, i) => (
                <StatItem key={label} value={value} suffix={suffix} label={label} icon={icon} triggered={statsVisible} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </section>
        */}

        {/* PLATFORM BENEFITS */}
        <section className="relative border-t border-[#4a3931]/10 bg-[#fdfcfb] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Platform Benefits" heading="A Smarter Way to Innovate" />
            <div className="mt-14">
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={24}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="civic-benefits-swiper pb-14"
              >
                {benefits.map(({ icon: Icon, image, title, desc }, index) => (
                  <SwiperSlide key={title}>
                    <div
                      className="relative min-h-[420px] overflow-hidden rounded-3xl border border-[#8b5e3c]/15 bg-[#f2e2d0] bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    >
                      <div className="absolute inset-0 bg-white/10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#f2e2d0]/85 via-[#f2e2d0]/35 to-transparent" />
                      <div className="relative z-10 flex min-h-[420px] flex-col justify-between p-8 sm:p-12 lg:p-16">
                        <div className="max-w-3xl">
                          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5b321f] shadow-lg">
                            <Icon className="h-7 w-7 text-[#fdfcfb]" />
                          </div>
                          <p className="mb-3 font-['Manrope'] text-xs font-bold uppercase tracking-[.2em] text-[#8b4f25]">Why CivicSyncAI</p>
                          <h3 className="font-['Manrope'] text-3xl font-semibold tracking-tight text-[#4a3931] sm:text-4xl lg:text-5xl">{title}</h3>
                          <p className="mt-5 max-w-2xl text-base leading-7 text-[#6b5a50] sm:text-lg">{desc}</p>
                        </div>
                        <div className="mt-10 flex items-end justify-between">
                          <div className="h-px flex-1 bg-[#8b5e3c]/20" />
                          <span className="ml-6 font-['Manrope'] text-sm font-semibold text-[#8b4f25]">
                            {String(index + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* TRUST MARQUEE */}
        <section className="relative overflow-hidden border-t border-[#4a3931]/10 bg-[#f5eee9] py-16">
          <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="font-['Manrope'] text-xs font-bold uppercase tracking-[.2em] text-[#8b4f25]">Trusted by Government Innovators</p>
            <p className="mt-2 text-sm text-[#806f65]">Designed for India's innovation ecosystem</p>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#f5eee9] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#f5eee9] to-transparent" />
          <div className="overflow-hidden">
            <div className="marquee-track">
              {[...partners, ...partners].map((name, i) => (
                <span
                  key={i}
                  className="marquee-item mx-3 inline-flex items-center whitespace-nowrap rounded-full border border-[#4a3931]/14 bg-white/70 px-5 py-2.5 text-xs font-semibold text-[#4a3931] shadow-sm backdrop-blur-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="relative scroll-mt-20 border-t border-[#4a3931]/10 bg-[#fdfcfb] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label="One platform. Four steps." heading="The Workflow" align="left">
              <p className="mt-4 text-[#6b5a50]">
                A focused platform designed around the actual government-to-startup matching workflow.
              </p>
            </SectionHeader>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ num, title, desc, icon: Icon }, index) => (
                <BorderGlow
                  key={num}
                  className="!rounded-2xl !border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  backgroundColor="#fdfcfb"
                  borderRadius={16}
                  glowRadius={26}
                  glowIntensity={0.35}
                  colors={['#4a3931', '#8a7163', '#e2d1c3']}
                  fillOpacity={0.15}
                >
                  <div
                    className={`relative overflow-hidden p-6 transition-all duration-700 ease-out ${workflowVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    style={{ transitionDelay: workflowVisible ? `${index * 780}ms` : '0ms' }}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#e2d1c3]/50 blur-2xl" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#4a3931]/15 bg-[#e2d1c3]/40">
                        <Icon className="h-5 w-5 text-[#4a3931]" />
                      </div>
                      <span className="font-mono text-xs text-[#9b877b]">{num}</span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-[#4a3931]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6b5a50]">{desc}</p>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative overflow-hidden border-t border-[#4a3931]/10 bg-[#3d2114] py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(253,252,251,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(253,252,251,0.07) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#8b4f25] opacity-20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#c68642] opacity-15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-['Manrope'] text-xs font-bold uppercase tracking-[.2em] text-[#e2b98a]">Get Started Today</p>
              <h2 className="mt-4 font-['Manrope'] text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to transform<br />government procurement?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/70">
                Join India's most innovative AI-powered platform connecting government departments with cutting-edge startups.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  to={governmentCta}
                  variant="white"
                  className="px-8 py-3.5 text-base font-semibold !text-[#3d2114] shadow-xl"
                >
                  <Building2 className="h-4 w-4 text-[#3d2114]" />
                  <span className="text-[#3d2114]">Post a Challenge</span>
                  <ArrowRight className="h-4 w-4 text-[#3d2114]" />
                </Button>
                <Button
                  to={startupCta}
                  variant="ghost"
                  className="border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10"
                >
                  <Rocket className="h-4 w-4" />
                  Register as Startup
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#4a3931]/10 bg-[#2d1e17]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">

            <div>
              <div className="flex items-center gap-3">
                <img src={logo} alt="CivicSyncAI" className="h-8 w-8 object-contain brightness-0 invert" />
                <span className="font-['Manrope'] text-lg font-bold text-white">CivicSyncAI</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
                AI-powered startup discovery for government innovation. Connecting public challenges with private innovation.
              </p>
              <div className="mt-5 inline-flex items-center rounded-full border border-[#e2b98a]/30 bg-[#8b4f25]/20 px-3 py-1.5 text-xs font-semibold text-[#e2b98a]">
                🏆 Smart India Hackathon 2026
              </div>
            </div>

            <div>
              <p className="font-['Manrope'] text-xs font-bold uppercase tracking-[.18em] text-white/40">Navigation</p>
              <ul className="mt-5 space-y-3">
                {[
                  ['Home', '/'],
                  ['How It Works', '/#how-it-works'],
                  ['For Government', '/login'],
                  ['For Startups', '/register'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-white/55 transition-colors hover:text-white">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-['Manrope'] text-xs font-bold uppercase tracking-[.18em] text-white/40">Built With</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['React 18', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Python FastAPI', 'Gemini AI', 'Vite'].map((tech) => (
                  <span key={tech} className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/55">{tech}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
        <div className="border-t border-white/8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/35 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 CivicSyncAI · AI-powered procurement for India</p>
            <p>Smart India Hackathon 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}