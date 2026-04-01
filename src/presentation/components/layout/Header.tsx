import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme, useScrollPosition } from '../../hooks';
import { Button } from '../ui/Button';

const navLinks = [
  { path: '/', label: 'Home' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const scrollPosition = useScrollPosition();
  const location = useLocation();

  const isScrolled = scrollPosition > 50;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 h-[72px] z-50 transition-all duration-250
        ${isScrolled ? 'bg-white dark:bg-slate-900 shadow-md' : 'bg-transparent'}
      `}
    >
      <div className="px-6 h-full flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          irello
        </Link>

        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                text-sm font-medium relative py-1
                ${location.pathname === link.path
                  ? 'text-blue-600'
                  : 'text-slate-700 dark:text-slate-200'
                }
              `}
            >
              {link.label}
              <span
                className={`
                  absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-150
                  ${location.pathname === link.path ? 'w-full' : 'w-0'}
                `}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 right-0 w-full max-w-[320px] h-screen bg-white dark:bg-slate-900 shadow-xl z-[200] p-6"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-blue-600">irello</span>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`
                      block text-lg font-medium p-3 rounded-md transition-all duration-150
                      ${location.pathname === link.path
                        ? 'bg-slate-100 dark:bg-slate-800 text-blue-600'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
