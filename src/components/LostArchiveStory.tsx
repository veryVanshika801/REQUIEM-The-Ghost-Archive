import React from 'react';
import { FileQuestion, GitBranch, Layers, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export const LostArchiveStory: React.FC = () => {
  const observations = [
    {
      number: '01',
      title: 'The Intent Remains Buried',
      tagline: 'Code outlives memory',
      description: 'The maintainer had a vision: a reason why that thread-pool was sized to 32, why that proto enum was commented out. When they moved on, the architectural soul stayed locked in silent source files.',
      artifact: 'src/core/scheduler.rs:49 // FIXME: reconsider backpressure buffer depth',
      icon: FileQuestion
    },
    {
      number: '02',
      title: 'The Evidence Becomes Scattered',
      tagline: 'Broken trails of truth',
      description: 'README claims 4.2M ops/sec, but the test suite tests 100 loops. The issue tracker has 40 stale requests. Half-finished branches sit orphaned in git ref logs. The truth is fragmented across hundreds of disparate artifacts.',
      artifact: 'git branch -a -> feat/distributed-raft (last commit: 18 months ago)',
      icon: GitBranch
    },
    {
      number: '03',
      title: 'The Next Step Becomes Uncertain',
      tagline: 'The paralysis of revival',
      description: 'Would-be maintainers and Hacktoberfest contributors open the repository, stare at 20,000 lines of unmaintained code, and fear breaking an unknown dependency. Without an archaeological roadmap, no one dares touch it.',
      artifact: 'Cargo.lock -> tokio 0.2.22 (vulnerability advisory RUSTSEC-2021-0124)',
      icon: ShieldAlert
    }
  ];

  return (
    <section id="archive" className="relative py-28 bg-[#080712] overflow-hidden border-t border-[#17102E]">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#30215B]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#956BFF] uppercase font-mono mb-4">
            <span className="w-6 h-[1px] bg-[#956BFF]" />
            <span>The Silent Cemetery of Open Source</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-6">
            NOT EVERY ENDING <br />
            <span className="text-[#A8A4B8]">WAS INTENDED.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A8A4B8] leading-relaxed font-light">
            Every year, hundreds of thousands of promising open-source repositories go dark. Maintainers burn out, careers pivot, life intervenes. What remains is not junk — it is an archaeological dig site waiting for an investigator to reconstruct what was and what could be.
          </p>
        </div>

        {/* 3 Visual Observations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {observations.map(obs => {
            const Icon = obs.icon;
            return (
              <div
                key={obs.number}
                className="bg-[#0f0b21] border border-[#30215B]/60 hover:border-[#956BFF]/60 rounded-lg p-8 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  {/* Top bar with observation number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold font-mono text-[#75D8FF]/60 group-hover:text-[#75D8FF] transition-colors">
                      {obs.number}
                    </span>
                    <div className="p-2.5 rounded-md bg-[#17102E] border border-[#30215B] text-[#956BFF]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#ECEAF5] mb-2 font-display">
                    {obs.title}
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-[#A8A4B8] font-mono mb-4">
                    {obs.tagline}
                  </div>
                  <p className="text-sm text-[#A8A4B8] leading-relaxed mb-6">
                    {obs.description}
                  </p>
                </div>

                {/* Evidence Artifact Snippet */}
                <div className="pt-4 border-t border-[#17102E]">
                  <div className="text-[11px] font-mono text-[#75D8FF] bg-[#080712] p-3 rounded border border-[#30215B]/50 truncate flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 shrink-0 text-[#956BFF]" />
                    <span className="truncate">{obs.artifact}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Quote Callout */}
        <div className="p-8 rounded-xl bg-gradient-to-r from-[#17102E]/60 via-[#30215B]/30 to-[#17102E]/60 border border-[#30215B] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="text-lg font-bold text-[#ECEAF5] font-display mb-1">
              "We don't need another generic code generator. We need a way to listen to what was already written."
            </h4>
            <p className="text-xs text-[#A8A4B8] font-mono">
              The Digital Archaeology Manifesto · Hacktoberfest 2026
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#D7B878] bg-[#080712] px-4 py-2.5 rounded border border-[#D7B878]/30 shrink-0">
            <Sparkles className="w-4 h-4 text-[#D7B878]" />
            <span>Open-Weight AI as Forensic Tool</span>
          </div>
        </div>
      </div>
    </section>
  );
};
