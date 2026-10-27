import React from 'react';
import { Shield, Lock, FileCheck, Scale, AlertTriangle, ExternalLink } from 'lucide-react';

interface PrivacyTrustSectionProps {
  onOpenLegal: (page: string) => void;
}

export const PrivacyTrustSection: React.FC<PrivacyTrustSectionProps> = ({ onOpenLegal }) => {
  const policies = [
    {
      title: 'Copyright Preservation',
      description: 'REQUIEM respects existing author copyrights. Uploaded source code remains the sole intellectual property of its original creators. We never ingest code into public model training datasets.',
      action: 'copyright',
      icon: Scale
    },
    {
      title: 'Zero-Execution Sandbox',
      description: 'Source files are parsed as passive AST tokens and text strings. Code is never compiled, linked, or executed in our runtime environment, guaranteeing safety against malicious repositories.',
      action: 'security',
      icon: Lock
    },
    {
      title: 'Transparent Model Attribution',
      description: 'Gemma 2 open weights are subject to the Gemma Terms of Use. Archaeological findings are attributed as forensic interpretations, not legal audits.',
      action: 'gemma',
      icon: FileCheck
    },
    {
      title: 'Ephemeral Processing',
      description: 'Guest investigations exist strictly in browser memory and local session cache unless you explicitly choose to export or save a report. Data can be purged with one click.',
      action: 'privacy',
      icon: Shield
    }
  ];

  return (
    <section id="trust" className="relative py-28 bg-[#080712] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#D7B878] uppercase font-mono mb-4">
            <span className="w-6 h-[1px] bg-[#D7B878]" />
            <span>Section 11 · Forensic Integrity & Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
            PRIVACY, COPYRIGHT & TRUST
          </h2>
          <p className="text-base text-[#A8A4B8] leading-relaxed font-light">
            Digital archaeology requires absolute respect for authorship and privacy. We uphold strict standards for copyright attribution, zero code execution, and data control.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {policies.map(p => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                onClick={() => onOpenLegal(p.action)}
                className="p-8 rounded-xl bg-[#0f0b21] border border-[#30215B] hover:border-[#956BFF] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[#17102E] border border-[#30215B] text-[#956BFF] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-[#A8A4B8] flex items-center gap-1 group-hover:text-[#75D8FF]">
                      <span>Read Policy</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#ECEAF5] mb-2 font-display">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A8A4B8] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimers Banner */}
        <div className="p-6 rounded-xl bg-[#17102E]/40 border border-[#30215B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D7B878] shrink-0" />
            <div className="text-xs text-[#A8A4B8] leading-relaxed">
              <strong className="text-[#ECEAF5]">Disclaimer:</strong> AI-generated autopsies provide forensic guidance and hypothesis generation for software revival. They do not constitute formal legal clearance or warranty of merchantability for open-source codebases.
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenLegal('terms')}
              className="text-xs font-mono text-[#75D8FF] hover:underline"
            >
              Terms of Use
            </button>
            <span className="text-[#30215B]">·</span>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="text-xs font-mono text-[#75D8FF] hover:underline"
            >
              Privacy Notice
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
