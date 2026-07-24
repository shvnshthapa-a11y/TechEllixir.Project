import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/vite.svg";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const indianLanguages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളம்)" },
  { code: "or", name: "Odia (ଓଡ଼ิଆ)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "mai", name: "Maithili (मैथिली)" },
  { code: "sa", name: "Sanskrit (संस्कृत)" }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { title: t("nav.home"), path: "/" },
    { title: t("nav.about"), path: "/about" },
    { title: t("nav.services"), path: "/services" },
    { title: t("nav.resources"), path: "/resources" },
    { title: t("nav.career"), path: "/career" },
    { title: t("nav.contact"), path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/92 dark:bg-[#0d111a]/92 shadow-[0_14px_34px_rgba(24,32,51,0.08)] backdrop-blur-xl py-3"
          : "bg-white/75 dark:bg-[#0d111a]/75 backdrop-blur-xl py-5"
      }`}
    >
      <div className="container-shell">

        <div className="flex items-center justify-between">

          <NavLink
            to="/"
            aria-label="TechEllixir home"
            className="group flex items-center gap-3"
          >
            <motion.img
              src={Logo}
              alt="TechEllixir Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
              whileHover={{ rotate: 15, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              <span className="text-[#FF4D37]">Tech</span>
              <span className="text-[#182033] group-hover:text-[#111827] dark:text-white transition">
                Ellixir
              </span>
            </h1>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-2 rounded-2xl border border-[#efe6df] dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-1 shadow-sm">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-bold transition duration-200 ${
                    isActive
                      ? "bg-[#FFF1EC] text-[#DF3420]"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 hover:text-[#182033] dark:hover:text-white"
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative flex items-center rounded-xl border border-[#efe6df] dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 px-2 py-1.5 shadow-sm text-sm font-bold text-gray-700 dark:text-gray-200">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none outline-none cursor-pointer pr-1 text-xs font-bold text-gray-600 dark:text-gray-200"
              >
                {indianLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900 dark:text-white text-gray-700">
                    {lang.code.toUpperCase()} - {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#efe6df] dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-gray-700 hover:bg-white dark:text-gray-200 transition cursor-pointer hover:text-[#ff4d37] dark:hover:text-[#ff4d37]"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <NavLink to="/contact">
              <motion.span
                className="brand-button px-6 py-3 cursor-pointer text-sm"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {t("nav.getStarted")}
                <ArrowRight size={18} />
              </motion.span>
            </NavLink>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center rounded-xl border border-[#efe6df] dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 px-2 py-1 text-xs font-bold text-gray-700 dark:text-gray-200">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none outline-none cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-200"
              >
                {indianLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900 dark:text-white text-gray-700">
                    {lang.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#efe6df] dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-gray-700 dark:text-gray-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#efe6df] dark:border-slate-800 bg-white text-[#182033] dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="mx-4 mb-4 rounded-2xl border border-[#efe6df] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              <motion.nav
                variants={{
                  open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
                }}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {menuItems.map((item) => (
                  <motion.div
                    key={item.path}
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: -15, opacity: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl transition duration-200 ${
                          isActive
                            ? "text-[#DF3420] bg-[#FFF3EF] dark:bg-slate-800"
                            : "text-gray-700 dark:text-gray-200 hover:bg-[#FFF8F5] dark:hover:bg-slate-800/50"
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Navbar;
