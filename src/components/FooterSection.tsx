import React from 'react';
import { Terminal, Shield, Github, Heart, Cpu } from 'lucide-react';

interface FooterSectionProps {
  onOpenLegal: (page: string) => void;
  onOpenModelSettings: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenLegal,
  onOpenModelSettings
}) => {
  return (
    <footer className="relative bg-[#05040a] border-t border-[#17102E] pt-20 pb-12 text-[#A8A4B8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5 text-xl font-bold font-display text-[#ECEAF5]">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#956BFF] shadow-[0_0_10px_#956BFF]" />
              <span>REQUIEM</span>
            </a>
            <div className="text-sm font-medium text-[#ECEAF5]">
              "Every abandoned project leaves a ghost."
            </div>
            <p className="text-xs text-[#A8A4B8] leading-relaxed max-w-sm font-light">
              Recover the intent. Trace the unfinished. Give forgotten code another life. An open-weight AI experiment in digital archaeology for Hacktoberfest 2026.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenModelSettings}
                className="flex items-center gap-2 text-xs font-mono text-[#75D8FF] bg-[#17102E] border border-[#30215B] px-3 py-1.5 rounded hover:border-[#75D8FF] transition-colors"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Gemma 2 Architecture</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ECEAF5]">Navigation</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-[#ECEAF5] transition-colors">Home Archive</a></li>
              <li><a href="#how-it-works" className="hover:text-[#ECEAF5] transition-colors">Forensic Method</a></li>
              <li><a href="#autopsy" className="hover:text-[#ECEAF5] transition-colors">Project Autopsy</a></li>
              <li><a href="#timeline" className="hover:text-[#ECEAF5] transition-colors">Ghost Timeline</a></li>
              <li><a href="#evidence" className="hover:text-[#ECEAF5] transition-colors">Evidence Vault</a></li>
              <li><a href="#dreams-map" className="hover:text-[#ECEAF5] transition-colors">Unfinished Dreams Map</a></li>
              <li><a href="#blueprint" className="hover:text-[#ECEAF5] transition-colors">Revival Blueprint</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Governance */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ECEAF5]">Governance</div>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-[#ECEAF5] transition-colors">Privacy Notice</button></li>
              <li><button onClick={() => onOpenLegal('terms')} className="hover:text-[#ECEAF5] transition-colors">Terms of Use</button></li>
              <li><button onClick={() => onOpenLegal('copyright')} className="hover:text-[#ECEAF5] transition-colors">Copyright & Licences</button></li>
              <li><button onClick={() => onOpenLegal('security')} className="hover:text-[#ECEAF5] transition-colors">Security & Zero-Execution</button></li>
              <li><button onClick={() => onOpenLegal('ai_limits')} className="hover:text-[#ECEAF5] transition-colors">AI Limitations & Truth</button></li>
              <li><button onClick={() => onOpenLegal('gemma')} className="hover:text-[#ECEAF5] transition-colors">Gemma Terms of Use</button></li>
            </ul>
          </div>

          {/* Col 4: Community & Technical */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ECEAF5]">Hacktoberfest</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/hacktoberfest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ECEAF5] transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Ghost in the Machine</span>
                </a>
              </li>
              <li><button onClick={() => onOpenLegal('contact')} className="hover:text-[#ECEAF5] transition-colors">Report an Archaeological Issue</button></li>
              <li><button onClick={onOpenModelSettings} className="hover:text-[#ECEAF5] transition-colors">Test Model Connection</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Attributions */}
        <div className="pt-8 border-t border-[#17102E] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            © 2026 REQUIEM — The Ghost Archive. Built with pride for open-source resurrection.
          </div>
          <div className="text-[#A8A4B8]/60 text-center md:text-right">
            Model weights: Gemma 2 (Google DeepMind) · Open weights under Gemma Terms of Use
          </div>
        </div>
      </div>
    </footer>
  );
};
