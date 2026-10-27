import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { UserSession } from '../types/archive';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  onOpenLegal: (page: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenLegal
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        isGuest: false,
        email,
        name: name || email.split('@')[0]
      });
      onClose();
    }, 600);
  };

  const handleGuestEntry = () => {
    onLoginSuccess({
      isGuest: true,
      name: 'Archaeologist Guest'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f0b21] border border-[#956BFF]/50 rounded-2xl p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#A8A4B8] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2 font-display text-xl font-bold text-[#ECEAF5]">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#956BFF]" />
            <span>REQUIEM</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-[#ECEAF5]">
            {mode === 'signin' ? 'RETURN TO THE ARCHIVE' : 'CREATE RESEARCHER ACCOUNT'}
          </h2>
          <p className="text-xs text-[#A8A4B8] mt-1 font-light">
            {mode === 'signin'
              ? 'Access saved excavations and ongoing project autopsies.'
              : 'Join the community of digital archaeologists.'}
          </p>
        </div>

        {/* Guest Demo Priority Button (Judges never blocked) */}
        <div className="mb-6">
          <button
            onClick={handleGuestEntry}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#17102E] to-[#30215B] border border-[#956BFF]/40 hover:border-[#956BFF] text-[#ECEAF5] hover:text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#75D8FF] group-hover:rotate-12 transition-transform" />
            <span>Instant Guest Entry (Explore Without Account)</span>
          </button>
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="w-16 h-[1px] bg-[#30215B]" />
            <span className="text-[11px] font-mono text-[#A8A4B8] uppercase">Or Authenticate</span>
            <span className="w-16 h-[1px] bg-[#30215B]" />
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded bg-red-950/50 border border-red-500/40 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A8A4B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Archaeologist Ada"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#080712] border border-[#30215B] rounded-lg text-xs text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A8A4B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="researcher@archive.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-[#080712] border border-[#30215B] rounded-lg text-xs text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A8A4B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-[#080712] border border-[#30215B] rounded-lg text-xs text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] hover:bg-[#8555f5] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(149,107,255,0.4)]"
          >
            <span>{loading ? 'Entering Chamber...' : mode === 'signin' ? 'Sign In To Archive' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#17102E] text-center text-xs text-[#A8A4B8]">
          {mode === 'signin' ? (
            <div>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className="text-[#75D8FF] hover:underline font-semibold"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setError(null);
                  setMode('signin');
                }}
                className="text-[#75D8FF] hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          )}

          <div className="mt-4 text-[11px] text-[#A8A4B8]/70">
            By continuing, you agree to our{' '}
            <button onClick={() => onOpenLegal('terms')} className="underline">
              Terms
            </button>{' '}
            and{' '}
            <button onClick={() => onOpenLegal('privacy')} className="underline">
              Privacy Notice
            </button>.
          </div>
        </div>
      </div>
    </div>
  );
};
