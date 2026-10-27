import React from 'react';
import { Sparkles, UploadCloud, FolderKanban, ShieldCheck } from 'lucide-react';

interface EnterArchiveCtaProps {
  onInvestigateProject: () => void;
  onExploreSample: () => void;
}

export const EnterArchiveCta: React.FC<EnterArchiveCtaProps> = ({
  onInvestigateProject,
  onExploreSample
}) => {
  return (
    <section className="relative py-24 bg-[#080712] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-2xl bg-gradient-to-br from-[#17102E]/80 via-[#0f0b21] to-[#17102E]/50 border border-[#30215B] p-8 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#956BFF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#D7B878] uppercase font-mono mb-4">
              <span className="w-6 h-[1px] bg-[#D7B878]" />
              <span>Interactive Forensic Terminal</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
              THE ARCHIVE IS WAITING.
            </h2>

            <p className="text-base sm:text-lg text-[#A8A4B8] leading-relaxed mb-10 font-light max-w-2xl">
              Begin with your own forgotten codebase, or immediately explore the authentic precomputed archaeological autopsy of <strong className="text-[#ECEAF5]">HyperFlow Engine</strong> — zero API key or sign-up required.
            </p>

            {/* Two Main Branching Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Action A: Investigate a Project */}
              <div
                onClick={onInvestigateProject}
                className="group cursor-pointer rounded-xl bg-[#080712]/90 border border-[#30215B] hover:border-[#956BFF] p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(149,107,255,0.25)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[#17102E] border border-[#30215B] text-[#956BFF] group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-[#A8A4B8] uppercase">Custom Repo</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#ECEAF5] mb-2 font-display">
                    Investigate A Project
                  </h3>
                  <p className="text-xs text-[#A8A4B8] leading-relaxed mb-4">
                    Upload source files, manifests, or README archives. REQUIEM parses evidence and runs forensic extraction through the configured Gemma inference adapter.
                  </p>
                </div>
                <button className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] hover:bg-[#8555f5] rounded-md transition-colors text-center">
                  Start Investigation
                </button>
              </div>

              {/* Action B: Explore Sample Case */}
              <div
                onClick={onExploreSample}
                className="group cursor-pointer rounded-xl bg-[#080712]/90 border border-[#D7B878]/40 hover:border-[#D7B878] p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(215,184,120,0.2)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[#17102E] border border-[#D7B878]/30 text-[#D7B878] group-hover:scale-110 transition-transform">
                      <FolderKanban className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-[#D7B878] uppercase">Instant Access</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#ECEAF5] mb-2 font-display">
                    Explore A Sample Case
                  </h3>
                  <p className="text-xs text-[#A8A4B8] leading-relaxed mb-4">
                    Inspect the fully reconstructed autopsy of HyperFlow Engine: 6 evidence-backed findings with real line proofs, git ghost timeline, and interactive dreams map.
                  </p>
                </div>
                <button className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#080712] bg-[#D7B878] hover:bg-[#e4ca8c] rounded-md transition-colors text-center font-bold">
                  Open HyperFlow Case Study
                </button>
              </div>
            </div>

            {/* Transparent disclosure */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#A8A4B8]/70">
              <ShieldCheck className="w-4 h-4 text-[#75D8FF]" />
              <span>Sample cases are precomputed from authentic historical open-source repositories without simulated latency.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
