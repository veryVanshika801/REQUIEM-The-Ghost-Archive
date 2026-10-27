import React, { useState } from 'react';
import { X, Check, Copy, FileCode, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { AutopsyFinding } from '../types/archive';

interface ProofDrawerProps {
  finding: AutopsyFinding | null;
  onClose: () => void;
}

export const ProofDrawer: React.FC<ProofDrawerProps> = ({ finding, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!finding) return null;

  const handleCopyCitation = () => {
    const citation = `[REQUIEM ARCHAEOLOGY PROOF]
Finding: ${finding.title}
File: ${finding.evidence.filename} (lines ${finding.evidence.lineStart}–${finding.evidence.lineEnd})
Evidence Classification: ${finding.evidenceType.toUpperCase()}
Snippet:
${finding.evidence.codeSnippet}
Context: ${finding.evidence.contextDescription}
Uncertainty: ${finding.evidence.uncertaintyNotes || 'None recorded'}`;

    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = finding.evidence.codeSnippet.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f0b21] border border-[#956BFF]/40 rounded-xl shadow-2xl shadow-black/80 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30215B] sticky top-0 bg-[#0f0b21]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#17102E] border border-[#30215B] text-[#956BFF]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A8A4B8]">
                <span>FORENSIC EVIDENCE INSPECTION</span>
                <span>·</span>
                <span className="uppercase text-[#75D8FF]">{finding.category.replace('_', ' ')}</span>
              </div>
              <h3 className="text-lg font-bold text-[#ECEAF5] font-display">
                {finding.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A8A4B8] hover:text-white rounded-md hover:bg-[#17102E] transition-colors"
            aria-label="Close proof inspection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Classification Banner */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#080712] border border-[#30215B]">
            <div className="flex items-center gap-3">
              {finding.evidenceType === 'verified' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : finding.evidenceType === 'interpretation' ? (
                <HelpCircle className="w-5 h-5 text-[#956BFF]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#D7B878]" />
              )}
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#ECEAF5]">
                  Status: {finding.evidenceType === 'verified' ? 'Indisputable Evidence' : finding.evidenceType === 'interpretation' ? 'AI Reasoned Deduction' : 'Unknown / Missing Data'}
                </div>
                <div className="text-xs text-[#A8A4B8]">
                  Confidence: {Math.round(finding.confidenceScore * 100)}% · {finding.confidenceExplanation}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyCitation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#ECEAF5] bg-[#17102E] hover:bg-[#30215B] border border-[#30215B] rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Proof'}</span>
            </button>
          </div>

          {/* Source Code Excerpt with Line Numbers */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#A8A4B8] mb-2 px-1">
              <span className="text-[#75D8FF]">{finding.evidence.filename}</span>
              <span>Lines {finding.evidence.lineStart}–{finding.evidence.lineEnd}</span>
            </div>
            <div className="rounded-lg bg-[#080712] border border-[#30215B] p-4 overflow-x-auto font-mono text-xs text-[#ECEAF5] leading-relaxed">
              {lines.map((line, index) => {
                const lineNum = finding.evidence.lineStart + index;
                const isHighlight = line.includes('TODO') || line.includes('FIXME') || line.includes('BUG') || line.includes('lock') || line.includes('todo!');
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-4 py-0.5 px-2 rounded ${
                      isHighlight ? 'bg-[#956BFF]/15 text-[#ECEAF5] font-semibold' : 'text-[#A8A4B8]'
                    }`}
                  >
                    <span className="w-8 text-right shrink-0 select-none text-[#30215B] tabular-nums">
                      {lineNum}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What this establishes vs What remains uncertain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#17102E]/60 border border-[#30215B]">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>What This Establishes</span>
              </div>
              <p className="text-xs text-[#ECEAF5] leading-relaxed">
                {finding.evidence.contextDescription}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#17102E]/60 border border-[#30215B]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#D7B878] mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>What Remains Uncertain</span>
              </div>
              <p className="text-xs text-[#A8A4B8] leading-relaxed">
                {finding.evidence.uncertaintyNotes || 'No unresolved ambiguities for this finding.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#30215B] bg-[#0f0b21] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] hover:bg-[#8555f5] rounded-md transition-colors"
          >
            Close Evidence View
          </button>
        </div>
      </div>
    </div>
  );
};
