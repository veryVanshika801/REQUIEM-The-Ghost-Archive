import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, HelpCircle, AlertTriangle, FileCode, Copy, Check, CheckCircle } from 'lucide-react';
import { AutopsyFinding, FindingCategory } from '../types/archive';

interface EvidenceVaultSectionProps {
  findings: AutopsyFinding[];
  onInspectFinding: (finding: AutopsyFinding) => void;
}

export const EvidenceVaultSection: React.FC<EvidenceVaultSectionProps> = ({
  findings,
  onInspectFinding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'lines'>('confidence');
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'unfinished_feature', label: 'Unfinished Code' },
    { id: 'security_risk', label: 'Security & Deadlocks' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'missing_docs', label: 'Missing Docs' },
    { id: 'dead_code', label: 'Dead Modules' }
  ];

  const filteredFindings = useMemo(() => {
    return findings
      .filter(f => {
        const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
        const matchesSearch =
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.evidence.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.evidence.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore;
        return a.evidence.lineStart - b.evidence.lineStart;
      });
  }, [findings, searchQuery, selectedCategory, sortBy]);

  const toggleReviewed = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyCitation = (finding: AutopsyFinding, e: React.MouseEvent) => {
    e.stopPropagation();
    const citation = `[REQUIEM] ${finding.title} | ${finding.evidence.filename}:${finding.evidence.lineStart}-${finding.evidence.lineEnd}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="evidence" className="relative py-28 bg-[#080712] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#956BFF] uppercase font-mono mb-4">
              <span className="w-6 h-[1px] bg-[#956BFF]" />
              <span>Section 07 · Verified Knowledge Base</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
              THE EVIDENCE VAULT
            </h2>
            <p className="text-base text-[#A8A4B8] leading-relaxed font-light">
              Every single archaeological claim supported by line-level proof. Search, filter, inspect syntax snippets, and cite verified findings.
            </p>
          </div>

          <div className="text-xs font-mono text-[#A8A4B8]">
            <span className="text-[#ECEAF5] font-bold">{reviewedIds.size}</span> of {findings.length} findings marked reviewed
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-xl bg-[#0f0b21] border border-[#30215B] mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 text-[#A8A4B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search findings, code snippets, or filenames (e.g. backpressure, mutex, Tokio)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#080712] border border-[#30215B] rounded-lg text-xs text-[#ECEAF5] focus:outline-none focus:border-[#956BFF] font-mono"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 text-xs font-mono">
              <span className="text-[#A8A4B8]">Sort:</span>
              <button
                onClick={() => setSortBy('confidence')}
                className={`px-3 py-1.5 rounded border transition-colors ${
                  sortBy === 'confidence'
                    ? 'bg-[#17102E] border-[#956BFF] text-[#ECEAF5]'
                    : 'border-[#30215B] text-[#A8A4B8] hover:text-[#ECEAF5]'
                }`}
              >
                Confidence
              </button>
              <button
                onClick={() => setSortBy('lines')}
                className={`px-3 py-1.5 rounded border transition-colors ${
                  sortBy === 'lines'
                    ? 'bg-[#17102E] border-[#956BFF] text-[#ECEAF5]'
                    : 'border-[#30215B] text-[#A8A4B8] hover:text-[#ECEAF5]'
                }`}
              >
                File Line Order
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#17102E]">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#956BFF] text-white'
                    : 'bg-[#17102E]/60 text-[#A8A4B8] hover:text-[#ECEAF5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFindings.map(finding => {
            const isReviewed = reviewedIds.has(finding.id);

            return (
              <div
                key={finding.id}
                className={`rounded-xl border p-6 flex flex-col justify-between transition-all duration-300 relative group ${
                  isReviewed
                    ? 'bg-[#0b1411]/50 border-emerald-900/50'
                    : 'bg-[#0f0b21] border-[#30215B]/60 hover:border-[#956BFF]/60 hover:shadow-[0_0_20px_rgba(149,107,255,0.15)]'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {finding.evidenceType === 'verified' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ) : finding.evidenceType === 'interpretation' ? (
                        <HelpCircle className="w-4 h-4 text-[#75D8FF]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#D7B878]" />
                      )}
                      <span className="text-[11px] font-mono text-[#A8A4B8] uppercase">
                        {finding.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={e => toggleReviewed(finding.id, e)}
                        className={`p-1.5 rounded transition-colors ${
                          isReviewed ? 'text-emerald-400' : 'text-[#30215B] hover:text-[#A8A4B8]'
                        }`}
                        title={isReviewed ? 'Mark Unreviewed' : 'Mark Reviewed'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => handleCopyCitation(finding, e)}
                        className="p-1.5 rounded text-[#A8A4B8] hover:text-white transition-colors"
                        title="Copy Citation"
                      >
                        {copiedId === finding.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Explanation */}
                  <h3 className="text-base font-bold text-[#ECEAF5] mb-2 font-display leading-snug">
                    {finding.title}
                  </h3>
                  <p className="text-xs text-[#A8A4B8] leading-relaxed mb-4 line-clamp-3">
                    {finding.explanation}
                  </p>
                </div>

                <div>
                  {/* Filename & Line range badge */}
                  <div className="p-2.5 rounded bg-[#080712] border border-[#30215B]/50 text-[11px] font-mono mb-4 flex items-center justify-between">
                    <span className="text-[#75D8FF] truncate max-w-[170px]">
                      {finding.evidence.filename}
                    </span>
                    <span className="text-[#A8A4B8] shrink-0">
                      L{finding.evidence.lineStart}–{finding.evidence.lineEnd}
                    </span>
                  </div>

                  {/* THE SIGNATURE BUTTON */}
                  <button
                    onClick={() => onInspectFinding(finding)}
                    className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#956BFF] to-[#75D8FF] hover:brightness-110 rounded-md transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(149,107,255,0.3)]"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>SHOW ME THE PROOF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFindings.length === 0 && (
          <div className="text-center py-16 text-[#A8A4B8] font-mono text-xs">
            No archaeological findings matched your search query. Try broadening your keywords.
          </div>
        )}
      </div>
    </section>
  );
};
