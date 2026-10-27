import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, AlertTriangle, FileCode, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { ProjectAutopsyData, AutopsyFinding, FindingEvidenceType } from '../types/archive';

interface ProjectAutopsySectionProps {
  data: ProjectAutopsyData;
  onInspectFinding: (finding: AutopsyFinding) => void;
}

export const ProjectAutopsySection: React.FC<ProjectAutopsySectionProps> = ({
  data,
  onInspectFinding
}) => {
  const [filterType, setFilterType] = useState<FindingEvidenceType | 'all'>('all');
  const [selectedFindingId, setSelectedFindingId] = useState<string>(data.findings[0]?.id || '');

  const filteredFindings = data.findings.filter(f => {
    if (filterType === 'all') return true;
    return f.evidenceType === filterType;
  });

  const activeFinding = data.findings.find(f => f.id === selectedFindingId) || data.findings[0];

  const countVerified = data.findings.filter(f => f.evidenceType === 'verified').length;
  const countInterpretation = data.findings.filter(f => f.evidenceType === 'interpretation').length;
  const countUnknown = data.findings.filter(f => f.evidenceType === 'unknown').length;

  return (
    <section id="autopsy" className="relative py-28 bg-[#080712] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#956BFF] uppercase font-mono mb-4">
              <span className="w-6 h-[1px] bg-[#956BFF]" />
              <span>Section 05 · Forensic Autopsy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
              PROJECT AUTOPSY
            </h2>
            <p className="text-base text-[#A8A4B8] leading-relaxed font-light">
              Forensic reconstruction of <strong className="text-[#ECEAF5]">{data.projectName}</strong>. Every statement is strictly grounded in the extracted codebase and categorized by certainty.
            </p>
          </div>

          {/* Project Summary Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#A8A4B8] bg-[#17102E]/70 p-3 rounded-lg border border-[#30215B]">
            <span className="text-[#75D8FF]">{data.primaryLanguage}</span>
            <span>·</span>
            <span className="text-[#D7B878]">{data.detectedLicense}</span>
            <span>·</span>
            <span>{data.isPreloadedSample ? 'Demonstration Case' : 'Live Ingestion'}</span>
          </div>
        </div>

        {/* Executive Dossier Card */}
        <div className="mb-12 p-8 rounded-xl bg-gradient-to-br from-[#17102E]/80 via-[#0f0b21] to-[#17102E]/50 border border-[#30215B] shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A8A4B8]">Purpose & Core Intent</div>
              <p className="text-sm text-[#ECEAF5] leading-relaxed">
                {data.purposeSummary}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A8A4B8]">Intended Target Audience</div>
              <p className="text-sm text-[#ECEAF5] leading-relaxed">
                {data.intendedAudience}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A8A4B8]">Why The Project Stalled</div>
              <p className="text-sm text-[#D7B878] leading-relaxed">
                {data.whyAbandonedAnalysis}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs (Interactive controls with functional handlers) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#17102E]">
          <div className="flex items-center gap-2 p-1 bg-[#17102E] rounded-lg border border-[#30215B]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-[#956BFF] text-white'
                  : 'text-[#A8A4B8] hover:text-[#ECEAF5]'
              }`}
            >
              All Findings ({data.findings.length})
            </button>
            <button
              onClick={() => setFilterType('verified')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                filterType === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#A8A4B8] hover:text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Evidence ({countVerified})</span>
            </button>
            <button
              onClick={() => setFilterType('interpretation')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                filterType === 'interpretation'
                  ? 'bg-[#75D8FF] text-[#080712] font-semibold'
                  : 'text-[#A8A4B8] hover:text-[#75D8FF]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AI Hypothesis ({countInterpretation})</span>
            </button>
            <button
              onClick={() => setFilterType('unknown')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                filterType === 'unknown'
                  ? 'bg-[#D7B878] text-[#080712] font-semibold'
                  : 'text-[#A8A4B8] hover:text-[#D7B878]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Unknowns ({countUnknown})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-[#A8A4B8]">
            Click finding to view analysis · Click <span className="text-[#75D8FF]">"Show Me The Proof"</span> for code
          </div>
        </div>

        {/* Master-Detail Investigation Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Findings List (Left column - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {filteredFindings.map(finding => {
              const isSelected = activeFinding?.id === finding.id;
              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFindingId(finding.id)}
                  className={`cursor-pointer rounded-lg p-5 transition-all duration-200 border text-left ${
                    isSelected
                      ? 'bg-[#17102E] border-[#956BFF] shadow-[0_0_20px_rgba(149,107,255,0.2)]'
                      : 'bg-[#0f0b21] border-[#30215B]/50 hover:border-[#30215B] hover:bg-[#130f2b]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider ${
                        finding.evidenceType === 'verified'
                          ? 'text-emerald-400'
                          : finding.evidenceType === 'interpretation'
                          ? 'text-[#75D8FF]'
                          : 'text-[#D7B878]'
                      }`}
                    >
                      {finding.evidenceType === 'verified'
                        ? 'VERIFIED EVIDENCE'
                        : finding.evidenceType === 'interpretation'
                        ? 'AI HYPOTHESIS'
                        : 'UNKNOWN / MISSING'}
                    </span>
                    <span className="text-xs font-mono text-[#A8A4B8] tabular-nums">
                      {Math.round(finding.confidenceScore * 100)}% conf
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#ECEAF5] mb-2 font-display">
                    {finding.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs font-mono text-[#A8A4B8] pt-2 border-t border-[#30215B]/30">
                    <span className="truncate max-w-[200px] text-[#75D8FF]">
                      {finding.evidence.filename}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-1 text-[#956BFF]' : 'text-[#30215B]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Finding Inspection Panel (Right column - 7 cols) */}
          {activeFinding && (
            <div className="lg:col-span-7 bg-[#0f0b21] border border-[#30215B] rounded-xl p-8 relative">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#30215B]">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#956BFF] mb-1">
                    Finding Dossier · {activeFinding.category.replace('_', ' ')}
                  </div>
                  <h3 className="text-xl font-bold text-[#ECEAF5] font-display">
                    {activeFinding.title}
                  </h3>
                </div>

                {/* THE SIGNATURE INTERACTION BUTTON */}
                <button
                  onClick={() => onInspectFinding(activeFinding)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#956BFF] to-[#75D8FF] hover:brightness-110 rounded-md shadow-[0_0_15px_rgba(149,107,255,0.4)] transition-all flex items-center gap-2 shrink-0"
                >
                  <FileCode className="w-4 h-4" />
                  <span>SHOW ME THE PROOF</span>
                </button>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-[#A8A4B8] mb-2">
                  Archaeological Finding
                </div>
                <p className="text-sm text-[#ECEAF5] leading-relaxed">
                  {activeFinding.explanation}
                </p>
              </div>

              {/* Source Evidence Preview Teaser */}
              <div className="mb-6 p-4 rounded-lg bg-[#080712] border border-[#30215B]">
                <div className="flex items-center justify-between text-xs font-mono text-[#A8A4B8] mb-2">
                  <span className="text-[#75D8FF] font-semibold">{activeFinding.evidence.filename}</span>
                  <span>Lines {activeFinding.evidence.lineStart}–{activeFinding.evidence.lineEnd}</span>
                </div>
                <pre className="text-xs font-mono text-[#A8A4B8] overflow-x-auto p-2 bg-[#05040a] rounded border border-[#17102E] leading-relaxed">
                  {activeFinding.evidence.codeSnippet}
                </pre>
              </div>

              {/* Confidence notes */}
              <div className="p-4 rounded-lg bg-[#17102E]/60 border border-[#30215B]/70 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#75D8FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#ECEAF5] mb-1">
                    Confidence Explanation ({Math.round(activeFinding.confidenceScore * 100)}% Certainty)
                  </div>
                  <div className="text-xs text-[#A8A4B8] leading-relaxed">
                    {activeFinding.confidenceExplanation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
