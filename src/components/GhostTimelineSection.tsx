import React, { useState } from 'react';
import { GitCommit, Tag, GitBranch, Sparkles, Clock, AlertCircle, ExternalLink, X } from 'lucide-react';
import { TimelineMilestone } from '../types/archive';

interface GhostTimelineSectionProps {
  milestones: TimelineMilestone[];
}

export const GhostTimelineSection: React.FC<GhostTimelineSectionProps> = ({ milestones }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);

  const getEventIcon = (category: TimelineMilestone['category'], isAi: boolean) => {
    if (isAi) return Sparkles;
    switch (category) {
      case 'commit': return GitCommit;
      case 'release': return Tag;
      case 'ghost_branch': return GitBranch;
      case 'abandonment': return Clock;
      default: return GitCommit;
    }
  };

  return (
    <section id="timeline" className="relative py-28 bg-[#0b081a] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#75D8FF] uppercase font-mono mb-4">
            <span className="w-6 h-[1px] bg-[#75D8FF]" />
            <span>Section 06 · Temporal Reconstruction</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
            THE GHOST TIMELINE
          </h2>
          <p className="text-base text-[#A8A4B8] leading-relaxed font-light">
            Reconstructing the chronology of human effort, branch pivots, and final abandonment. Verified commit logs are strictly demarcated from AI archaeological deductions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-12 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#ECEAF5]">
            <span className="w-3 h-3 rounded-full bg-[#75D8FF] shadow-[0_0_8px_#75D8FF]" />
            <span>Verified Git History (Commits & Tags)</span>
          </div>
          <div className="flex items-center gap-2 text-[#ECEAF5]">
            <span className="w-3 h-3 rounded-full bg-[#956BFF] shadow-[0_0_8px_#956BFF]" />
            <span>AI Archaeological Inference (Uncertainty Labeled)</span>
          </div>
          <div className="flex items-center gap-2 text-[#D7B878]">
            <span className="w-3 h-3 rounded-full bg-[#D7B878] shadow-[0_0_8px_#D7B878]" />
            <span>Repository Freeze / Final Commit</span>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="relative border-l-2 border-[#30215B] ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
          {milestones.map((m, index) => {
            const Icon = getEventIcon(m.category, m.isAiInferred);
            const isFreeze = m.category === 'abandonment';

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMilestone(m)}
                className="relative group cursor-pointer"
              >
                {/* Node Icon on Timeline Line */}
                <div
                  className={`absolute -left-[45px] md:-left-[61px] top-1 p-2 rounded-full border-2 transition-transform group-hover:scale-125 ${
                    isFreeze
                      ? 'bg-[#080712] border-[#D7B878] text-[#D7B878] shadow-[0_0_15px_#D7B878]'
                      : m.isAiInferred
                      ? 'bg-[#080712] border-[#956BFF] text-[#956BFF] shadow-[0_0_15px_#956BFF]'
                      : 'bg-[#080712] border-[#75D8FF] text-[#75D8FF] shadow-[0_0_15px_#75D8FF]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Date indicator in left gutter for desktop */}
                <div className="hidden md:block absolute -left-44 top-2 text-xs font-mono text-[#A8A4B8] text-right w-24">
                  {m.dateStr || 'Undated'}
                </div>

                {/* Milestone Card */}
                <div
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    m.isAiInferred
                      ? 'bg-[#17102E]/60 border-[#956BFF]/50 hover:border-[#956BFF] hover:bg-[#17102E]'
                      : isFreeze
                      ? 'bg-[#1a1208]/60 border-[#D7B878]/50 hover:border-[#D7B878] hover:bg-[#1a1208]'
                      : 'bg-[#0f0b21] border-[#30215B] hover:border-[#75D8FF]/60 hover:bg-[#130f2b]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-xs font-mono text-[#A8A4B8]">
                        {m.dateStr} ·
                      </span>
                      {m.isAiInferred ? (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#956BFF] bg-[#956BFF]/15 px-2 py-0.5 rounded border border-[#956BFF]/30">
                          AI Inferred Event
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#75D8FF] bg-[#75D8FF]/15 px-2 py-0.5 rounded border border-[#75D8FF]/30">
                          Verified Git History
                        </span>
                      )}
                    </div>

                    {m.commitHash && (
                      <span className="text-xs font-mono text-[#A8A4B8] bg-[#080712] px-2 py-1 rounded border border-[#30215B]">
                        commit {m.commitHash}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#ECEAF5] mb-2 font-display">
                    {m.title}
                  </h3>
                  <p className="text-sm text-[#A8A4B8] leading-relaxed mb-4">
                    {m.description}
                  </p>

                  {m.uncertaintyLabel && (
                    <div className="text-xs font-mono text-[#D7B878] bg-[#080712] p-2.5 rounded border border-[#D7B878]/30 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{m.uncertaintyLabel}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#30215B]/30 flex items-center justify-between text-xs font-mono text-[#A8A4B8]">
                    <span className="truncate max-w-[280px]">{m.evidenceReference}</span>
                    <span className="text-[#956BFF] group-hover:underline">Inspect Milestone →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0f0b21] border border-[#956BFF] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[#75D8FF]">
                {selectedMilestone.dateStr} · {selectedMilestone.commitHash ? `Commit ${selectedMilestone.commitHash}` : 'Chronological Node'}
              </span>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-1 text-[#A8A4B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#ECEAF5] font-display mb-3">
              {selectedMilestone.title}
            </h3>
            <p className="text-sm text-[#A8A4B8] leading-relaxed mb-6">
              {selectedMilestone.description}
            </p>

            <div className="p-4 rounded bg-[#080712] border border-[#30215B] text-xs font-mono text-[#ECEAF5] space-y-2 mb-6">
              <div className="text-[#956BFF] font-semibold">Supporting Evidence</div>
              <div>{selectedMilestone.evidenceReference}</div>
            </div>

            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
