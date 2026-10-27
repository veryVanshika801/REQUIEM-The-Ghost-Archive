import React from 'react';
import { ArrowDown, Cpu, Server, Shield, Unlock, RefreshCw, Database } from 'lucide-react';

export const WhyOpenWeightSection: React.FC = () => {
  const pipelineSteps = [
    { label: 'User Project', sub: 'Untrusted input', icon: Database },
    { label: 'Safe File Extraction', sub: 'Sanitized & secret-scrubbed', icon: Shield },
    { label: 'Evidence Selection', sub: 'High-signal code & manifests', icon: RefreshCw },
    { label: 'Open-Weight Model Inference', sub: 'Gemma 2 / Modular adapter', icon: Cpu },
    { label: 'Evidence-Backed Analysis', sub: 'Verified facts vs hypotheses', icon: Server },
    { label: 'Revival Blueprint', sub: 'P0–P2 contribution roadmap', icon: Unlock }
  ];

  const pillars = [
    {
      title: 'Provider Independence',
      body: 'Commercial AI APIs deprecate endpoints, change terms, or shut down entirely. Open-weight models like Gemma ensure an archaeological tool created today can still be audited and executed a decade from now.'
    },
    {
      title: 'Modular Inference Adapters',
      body: 'REQUIEM uses an abstraction layer that can target local Ollama/vLLM instances on an air-gapped laptop, a self-hosted cloud GPU container, or Google AI Studio endpoints without rewriting business logic.'
    },
    {
      title: 'Inspectability & Academic Rigor',
      body: 'Because open weights are verifiable, researchers can reproduce how prompt structures and temperature influence archaeological findings. There are no silent backend system prompts injecting marketing bias.'
    },
    {
      title: 'Real Trade-Offs (No Hype)',
      body: 'Local weights require dedicated VRAM (e.g., 18GB+ for Gemma 2 9B at fp16). Hosted inference trades offline execution for instant accessibility. We disclose exactly where inference happens.'
    }
  ];

  return (
    <section id="open-ai" className="relative py-28 bg-[#0b081a] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#956BFF] uppercase font-mono mb-4">
            <span className="w-6 h-[1px] bg-[#956BFF]" />
            <span>Section 10 · The Open-Source Ethos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
            WHAT SURVIVES WHEN <br />
            <span className="bg-gradient-to-r from-[#956BFF] to-[#75D8FF] bg-clip-text text-transparent">
              THE SERVER GOES DARK?
            </span>
          </h2>
          <p className="text-base text-[#A8A4B8] leading-relaxed font-light">
            An archaeological tool cannot depend on a fragile proprietary monolith. To investigate abandoned software with integrity, the analytical engine itself must be reproducible and inspectable.
          </p>
        </div>

        {/* Real Interactive Architecture Flowchart */}
        <div className="p-8 rounded-2xl bg-[#080712] border border-[#30215B] mb-16 shadow-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#75D8FF] mb-6 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>Forensic Execution Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <div className="bg-[#0f0b21] border border-[#30215B] hover:border-[#956BFF] p-4 rounded-xl flex flex-col items-center text-center transition-all group">
                    <div className="p-3 rounded-lg bg-[#17102E] border border-[#30215B] text-[#75D8FF] group-hover:text-[#956BFF] mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#ECEAF5] font-display mb-1">
                      {step.label}
                    </div>
                    <div className="text-[10px] font-mono text-[#A8A4B8]">
                      {step.sub}
                    </div>
                  </div>

                  {/* Flow Arrow (except last) */}
                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden lg:flex justify-center text-[#30215B]">
                      <span className="text-lg font-mono">→</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-[#0f0b21] border border-[#30215B]/60 hover:border-[#956BFF]/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-[#ECEAF5] font-display mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#75D8FF]" />
                <span>{pillar.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#A8A4B8] leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
