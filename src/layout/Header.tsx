import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { toggleDarkMode, setMobileMenuOpen } from '../redux/slices/uiSlice';
import { NAV_ITEMS } from '../constants';

function serviceAnchor(service: { id: string }) {
  return `/services#${service.id}`;
}

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode, mobileMenuOpen, scrollProgress } = useSelector((s: RootState) => s.ui);
  const { phone, email } = useSelector((s: RootState) => s.company.profile);
  const services = useSelector((s: RootState) => s.content.services);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dispatch(setMobileMenuOpen(false));
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;
    const id = window.decodeURIComponent(location.hash.slice(1));
    const element = document.getElementById(id);
    if (!element) return;

    window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [location.pathname, location.hash, services.length]);

  const navItems = NAV_ITEMS.map((item) => {
    if (item.href !== '/services') return item;
    return {
      ...item,
      children: services.length
        ? services.map((service) => ({ label: service.title, href: serviceAnchor(service) }))
        : item.children,
    };
  });

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 z-[100] h-0.5 bg-accent/30 w-full">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <motion.header
        className={`fixed top-0.5 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-primary/95 backdrop-blur-md shadow-2xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Top bar */}
        {!scrolled && (
          <div className="hidden lg:block bg-primary border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
              <div className="flex items-center gap-6 text-white/60 text-xs">
                <span className="flex items-center gap-1.5">
                  <Phone size={12} />
                  {phone}
                </span>
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span>Mon–Fri: 8am–6pm EAT</span>
                <Link to="/admin/login" className="text-accent hover:text-white transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        )}

        {/* Main nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-accent flex items-center justify-center font-display font-bold text-white text-xl">
                R
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl tracking-tight">
                  REAL
                </span>
                <span className="block text-white/50 text-[9px] tracking-[0.3em] uppercase -mt-1">
                  Construction
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item: import('../types').NavItem) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-accent'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent"
                      layoutId="activeTab"
                    />
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-primary/95 backdrop-blur border border-white/10 shadow-2xl"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/contact" className="hidden lg:flex btn-primary text-xs px-5 py-2.5">
                Get a Quote
              </Link>

              <button
                onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
                className="lg:hidden p-2 text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-primary flex flex-col pt-24 px-6 pb-8 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={item.href}
                    className={`block py-4 text-xl font-display font-semibold border-b border-white/10 transition-colors ${
                      isActive(item.href) ? 'text-accent' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 border-b border-white/10 pb-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block py-2 text-sm text-white/60 hover:text-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Link to="/contact" className="btn-primary w-full justify-center">
                Get a Free Quote
              </Link>
              <div className="mt-6 text-white/50 text-sm">
                <p>{phone}</p>
                <p>{email}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
