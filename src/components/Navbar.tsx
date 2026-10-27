import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu } from 'lucide-react';

interface NavbarProps {
  onEnterWorkspace: () => void;
  onOpenAuth: () => void;
  onOpenModelSettings: () => void;
  userEmail?: string;
  isGuest?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onEnterWorkspace,
  onOpenAuth,
  onOpenModelSettings,
  userEmail,
  isGuest
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Archive', href: '#archive' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Autopsy', href: '#autopsy' },
    { label: 'Evidence', href: '#evidence' },
    { label: 'Open-Weight AI', href: '#open-ai' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080712]/85 backdrop-blur-md border-b border-[#30215B]/40 shadow-xl shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl md:text-2xl font-bold tracking-widest text-[#ECEAF5] hover:text-[#956BFF] transition-colors whitespace-nowrap shrink-0 font-display flex items-center gap-2.5"
        >
          <span className="w-2.5 h-2.5 rotate-45 bg-[#956BFF] shadow-[0_0_10px_#956BFF]" />
          <span>REQUIEM</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#A8A4B8]">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#ECEAF5] transition-colors whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#956BFF] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary action + Auth/Model triggers */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button
            onClick={onOpenModelSettings}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#A8A4B8] hover:text-[#75D8FF] bg-[#17102E]/60 border border-[#30215B]/60 rounded-md transition-colors whitespace-nowrap shrink-0"
            title="Inspect Open-Weight Model Status"
          >
            <Cpu className="w-3.5 h-3.5 text-[#75D8FF]" />
            <span>Gemma 2 Model</span>
          </button>

          {userEmail || isGuest ? (
            <button
              onClick={onEnterWorkspace}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#956BFF] to-[#75D8FF] rounded-md hover:brightness-110 shadow-[0_0_18px_rgba(149,107,255,0.4)] transition-all whitespace-nowrap shrink-0"
            >
              Archive Chamber
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="text-xs text-[#ECEAF5] hover:text-[#956BFF] transition-colors whitespace-nowrap shrink-0 px-2 py-1"
              >
                Sign In
              </button>
              <button
                onClick={onEnterWorkspace}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] hover:bg-[#8050ff] rounded-md shadow-[0_0_15px_rgba(149,107,255,0.35)] transition-all whitespace-nowrap shrink-0"
              >
                Enter Archive
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#ECEAF5] hover:text-[#956BFF] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#080712]/95 backdrop-blur-xl border-b border-[#30215B] px-6 py-6 flex flex-col gap-4">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-[#ECEAF5] hover:text-[#956BFF] py-2 transition-colors border-b border-[#17102E]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenModelSettings();
              }}
              className="flex items-center justify-center gap-2 py-2.5 text-xs text-[#A8A4B8] bg-[#17102E] border border-[#30215B] rounded-md"
            >
              <Cpu className="w-4 h-4 text-[#75D8FF]" />
              <span>Gemma Model Settings</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onEnterWorkspace();
              }}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] rounded-md"
            >
              Enter The Archive
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
