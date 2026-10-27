import React, { useState } from 'react';
import { Search, Cpu, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowRequiemWorks: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Bring the forgotten project into the light.',
      description: 'Supply README manifests, source trees, or git history. REQUIEM performs safe offline extraction, strips private credentials, isolates core modules, and prepares an evidence corpus without executing untrusted code.',
      tags: ['Zero-execution safe ingestion', 'Secret & token scrub', 'Git ref inspection'],
      icon: Search,
      metric: 'Safe Ingestion Corpus'
    },
    {
      step: '02',
      title: 'RECONSTRUCT',
      subtitle: 'Follow the evidence left behind.',
      description: 'Using open-weight Gemma models with strict evidence grounding, REQUIEM separates indisputable facts from hypotheses. It traces unmerged branches, isolates panic stubs, and builds an architectural dependency graph.',
      tags: ['Verified evidence vs inference', 'Ghost branch analysis', 'Deadlock detection'],
      icon: Cpu,
      metric: 'Gemma 2 Inference Engine'
    },
    {
      step: '03',
      title: 'REVIVE',
      subtitle: 'Give the unfinished a next chapter.',
      description: 'Rather than hallucinating boilerplate, REQUIEM generates an actionable revival blueprint. Broken mutexes, missing test fixtures, and orphaned RFCs are prioritized into concrete contribution-ready tasks.',
      tags: ['P0/P1/P2 Roadmap', 'GitHub Issue drafts', 'Contribution criteria'],
      icon: Compass,
      metric: 'Executable Blueprint'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-28 bg-[#0b081a] overflow-hidden border-t border-[#17102E]">
      {/* Background visual asset: Ancient Archive Vault */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-luminosity overflow-hidden">
        <img
          src="/src/assets/images/ancient_archive_vault_1793105368236.jpg"
          alt="Ancient vault archive cathedral"
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b081a] via-transparent to-[#0b081a]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#75D8FF] uppercase font-mono mb-4">
            <span className="w-6 h-[1px] bg-[#75D8FF]" />
            <span>Digital Archaeology Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-6">
            HOW REQUIEM WORKS
          </h2>
          <p className="text-base sm:text-lg text-[#A8A4B8] leading-relaxed font-light">
            A three-stage forensic pipeline that treats abandoned codebases not as dead text, but as archaeological sites to be documented with strict academic rigor.
          </p>
        </div>

        {/* 3-Stage Interactive Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <div
                key={stage.step}
                onClick={() => setActiveStage(idx)}
                className={`cursor-pointer rounded-xl p-8 transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#17102E]/90 border border-[#956BFF] shadow-[0_0_30px_rgba(149,107,255,0.25)] scale-[1.02]'
                    : 'bg-[#0f0b21]/70 border border-[#30215B]/50 hover:border-[#30215B] hover:bg-[#130f2b]'
                }`}
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-3xl font-extrabold font-display ${
                        isSelected ? 'text-[#956BFF]' : 'text-[#30215B]'
                      }`}
                    >
                      {stage.step}
                    </span>
                    <div
                      className={`p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-[#956BFF]/20 border-[#956BFF] text-[#ECEAF5]'
                          : 'bg-[#17102E] border-[#30215B] text-[#A8A4B8]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="text-xs font-mono uppercase tracking-widest text-[#75D8FF] mb-2">
                    Stage {stage.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[#ECEAF5] mb-2 font-display">
                    {stage.title}
                  </h3>
                  <div className="text-sm font-medium text-[#D7B878] mb-4">
                    "{stage.subtitle}"
                  </div>

                  <p className="text-sm text-[#A8A4B8] leading-relaxed mb-6 font-light">
                    {stage.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="pt-4 border-t border-[#30215B]/40 flex flex-col gap-2">
                    {stage.tags.map((tag, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-2 text-xs text-[#ECEAF5]/90">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-[#75D8FF]' : 'text-[#A8A4B8]'
                          }`}
                        />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-mono text-[#A8A4B8]">
                    <span>{stage.metric}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-1 text-[#956BFF]' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
