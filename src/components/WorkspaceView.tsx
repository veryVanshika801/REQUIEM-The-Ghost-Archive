import React, { useState } from 'react';
import { 
  FolderKanban, 
  UploadCloud, 
  FileCode, 
  History, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  FileDown, 
  Search, 
  Plus, 
  Sparkles, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ProjectAutopsyData, AutopsyFinding, UserSession, SavedReportMeta } from '../types/archive';
import { SAMPLE_CASE_STUDY } from '../data/sampleArchive';

interface WorkspaceViewProps {
  currentData: ProjectAutopsyData;
  userSession: UserSession;
  onExitWorkspace: () => void;
  onOpenModelSettings: () => void;
  onOpenLegal: (page: string) => void;
  onInspectFinding: (finding: AutopsyFinding) => void;
  onLoadCaseStudy: (data: ProjectAutopsyData) => void;
}

interface UploadedFileItem {
  name: string;
  size: number;
  content: string;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  currentData,
  userSession,
  onExitWorkspace,
  onOpenModelSettings,
  onOpenLegal,
  onInspectFinding,
  onLoadCaseStudy
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'reports'>('overview');
  
  // Upload State
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [scanDepth, setScanDepth] = useState<'Quick Scan' | 'Deep Investigation'>('Deep Investigation');
  const [researchGoal, setResearchGoal] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasConfirmedSecrets, setHasConfirmedSecrets] = useState(false);

  // Saved reports history state (in-memory persistent across session)
  const [savedReports, setSavedReports] = useState<SavedReportMeta[]>([
    {
      id: 'hyperflow-demo',
      projectName: 'HyperFlow Engine',
      createdAt: '2026-10-24 16:42 UTC',
      findingsCount: SAMPLE_CASE_STUDY.findings.length,
      revivalTasksCount: SAMPLE_CASE_STUDY.revivalTasks.length,
      primaryLanguage: 'Rust / TypeScript',
      isSample: true
    }
  ]);
  const [searchFilter, setSearchFilter] = useState('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFileItem[] = [];
    let oversized = false;

    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        oversized = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        newFiles.push({
          name: file.name,
          size: file.size,
          content: reader.result as string
        });
        if (newFiles.length === files.length) {
          setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 15));
        }
      };
      reader.readAsText(file);
    });

    if (oversized) {
      setUploadError('Some files exceeded the 2MB safety threshold and were skipped.');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Run live investigation
  const handleStartInvestigation = async () => {
    if (!projectName.trim()) {
      setUploadError('Please provide a project name.');
      return;
    }
    if (uploadedFiles.length === 0) {
      setUploadError('Please provide at least one source file or README for archaeology.');
      return;
    }
    if (!hasConfirmedSecrets) {
      setUploadError('Please confirm that you have scrubbed private secrets and credentials.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectDescription,
          scanDepth,
          files: uploadedFiles
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Investigation failed.');
      }

      // Update current data and add to saved reports
      onLoadCaseStudy(result);
      setSavedReports(prev => [
        {
          id: `case-${Date.now()}`,
          projectName: result.projectName,
          createdAt: new Date().toLocaleTimeString(),
          findingsCount: result.findings.length,
          revivalTasksCount: result.revivalTasks.length,
          primaryLanguage: result.primaryLanguage,
          isSample: false
        },
        ...prev
      ]);

      setActiveTab('overview');
      alert(`Archaeological autopsy complete for "${result.projectName}"!`);
    } catch (err: any) {
      setUploadError(err.message || 'Investigation error.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedReports(prev => prev.filter(r => r.id !== id));
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentData.projectName.toLowerCase().replace(/\s+/g, '-')}-autopsy.json`);
    downloadAnchor.click();
  };

  return (
    <div className="min-h-screen bg-[#080712] text-[#ECEAF5] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#05040a] border-r border-[#17102E] p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Wordmark */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onExitWorkspace}
              className="flex items-center gap-2 text-sm font-bold font-display text-[#ECEAF5] hover:text-[#956BFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#956BFF]" />
              <span>RETURN TO LANDING</span>
            </button>
          </div>

          <div className="text-xs font-mono uppercase tracking-widest text-[#75D8FF] mb-4">
            Archive Chamber
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#17102E] text-[#ECEAF5] border border-[#956BFF]/50'
                  : 'text-[#A8A4B8] hover:text-white hover:bg-[#0f0b21]'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-[#956BFF]" />
              <span>Active Investigation</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'upload'
                  ? 'bg-[#17102E] text-[#ECEAF5] border border-[#956BFF]/50'
                  : 'text-[#A8A4B8] hover:text-white hover:bg-[#0f0b21]'
              }`}
            >
              <Plus className="w-4 h-4 text-[#75D8FF]" />
              <span>New Investigation</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'reports'
                  ? 'bg-[#17102E] text-[#ECEAF5] border border-[#956BFF]/50'
                  : 'text-[#A8A4B8] hover:text-white hover:bg-[#0f0b21]'
              }`}
            >
              <History className="w-4 h-4 text-[#D7B878]" />
              <span>Saved Reports ({savedReports.length})</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Controls */}
        <div className="pt-6 border-t border-[#17102E] space-y-2">
          <button
            onClick={onOpenModelSettings}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#A8A4B8] hover:text-[#ECEAF5] hover:bg-[#17102E] rounded-md transition-colors"
          >
            <Cpu className="w-4 h-4 text-[#75D8FF]" />
            <span>Gemma Model Settings</span>
          </button>

          <button
            onClick={() => onOpenLegal('security')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#A8A4B8] hover:text-[#ECEAF5] hover:bg-[#17102E] rounded-md transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Execution Protocol</span>
          </button>

          <div className="pt-2 text-[11px] font-mono text-[#A8A4B8]/60 px-3">
            {userSession.isGuest ? 'Session: Guest Archaeologist' : `Session: ${userSession.email}`}
          </div>
        </div>
      </aside>

      {/* Main Content Chamber */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#17102E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#956BFF] uppercase mb-1">
              <span>Chamber Workspace</span>
              <span>·</span>
              <span className="text-[#A8A4B8]">
                {currentData.isPreloadedSample ? 'Demonstration Case' : 'User Excavation'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#ECEAF5] font-display">
              {activeTab === 'overview' && 'THE ARCHIVE REMEMBERS.'}
              {activeTab === 'upload' && 'NEW REPOSITORY EXCAVATION'}
              {activeTab === 'reports' && 'SAVED ARCHAEOLOGY DOSSIERS'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLoadCaseStudy(SAMPLE_CASE_STUDY)}
              className="px-3.5 py-1.5 text-xs font-mono text-[#D7B878] bg-[#17102E] border border-[#D7B878]/40 hover:border-[#D7B878] rounded-md transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reset To HyperFlow Case</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3.5 py-1.5 text-xs font-mono text-[#ECEAF5] bg-[#17102E] border border-[#30215B] hover:border-[#956BFF] rounded-md transition-colors flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-[#75D8FF]" />
              <span>Export Dossier (JSON)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ACTIVE REPORT */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Active Project Banner */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-[#17102E]/80 via-[#0f0b21] to-[#17102E]/40 border border-[#30215B] shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#75D8FF] bg-[#75D8FF]/10 px-2 py-0.5 rounded border border-[#75D8FF]/30">
                    Active Excavation
                  </span>
                  <h2 className="text-2xl font-bold text-[#ECEAF5] font-display mt-2">
                    {currentData.projectName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A8A4B8] mt-1">
                    {currentData.tagline}
                  </p>
                </div>

                <div className="text-xs font-mono text-[#A8A4B8] space-y-1 text-right">
                  <div>Model Used: <strong className="text-[#ECEAF5]">{currentData.modelIdentifierUsed}</strong></div>
                  <div>Analysis Date: <strong className="text-[#ECEAF5]">{currentData.analysisDate}</strong></div>
                  <div>Detected License: <strong className="text-[#D7B878]">{currentData.detectedLicense}</strong></div>
                </div>
              </div>

              {/* Purpose & Why Stalled Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#30215B]/50 text-xs">
                <div>
                  <div className="font-mono text-[#75D8FF] uppercase mb-1">Core Architecture Intent</div>
                  <p className="text-[#ECEAF5] leading-relaxed">{currentData.purposeSummary}</p>
                </div>
                <div>
                  <div className="font-mono text-[#D7B878] uppercase mb-1">Identified Abandonment Trigger</div>
                  <p className="text-[#A8A4B8] leading-relaxed">{currentData.whyAbandonedAnalysis}</p>
                </div>
              </div>
            </div>

            {/* Findings Quick Strip */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#ECEAF5] font-display">
                  Discovered Forensic Evidence ({currentData.findings.length} Artifacts)
                </h3>
                <span className="text-xs font-mono text-[#A8A4B8]">
                  Click to inspect exact source excerpt
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentData.findings.map(finding => (
                  <div
                    key={finding.id}
                    onClick={() => onInspectFinding(finding)}
                    className="p-5 rounded-xl bg-[#0f0b21] border border-[#30215B] hover:border-[#956BFF] cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase mb-2">
                        <span
                          className={
                            finding.evidenceType === 'verified'
                              ? 'text-emerald-400'
                              : finding.evidenceType === 'interpretation'
                              ? 'text-[#75D8FF]'
                              : 'text-[#D7B878]'
                          }
                        >
                          {finding.evidenceType}
                        </span>
                        <span className="text-[#A8A4B8]">{Math.round(finding.confidenceScore * 100)}% conf</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#ECEAF5] mb-2 font-display">
                        {finding.title}
                      </h4>
                      <p className="text-xs text-[#A8A4B8] line-clamp-2 mb-4">
                        {finding.explanation}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#17102E] flex items-center justify-between text-xs font-mono text-[#75D8FF]">
                      <span className="truncate max-w-[180px]">{finding.evidence.filename}</span>
                      <span>Show Proof →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD & SETUP */}
        {activeTab === 'upload' && (
          <div className="max-w-3xl space-y-8">
            <div className="p-6 rounded-xl bg-[#0f0b21] border border-[#30215B] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#ECEAF5] font-display mb-1">
                  1. Project Identity & Parameters
                </h3>
                <p className="text-xs text-[#A8A4B8]">
                  Define the codebase name and what you want the Gemma model to investigate.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    placeholder="e.g. chronos-cache, hyperflow-engine, vortex-kv"
                    className="w-full bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs font-mono text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Optional Context / What You Know</label>
                  <textarea
                    rows={3}
                    value={projectDescription}
                    onChange={e => setProjectDescription(e.target.value)}
                    placeholder="e.g. Abandoned in 2024, was supposed to be a low-latency cache, but tests started failing after Tokio upgrade."
                    className="w-full bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs text-[#ECEAF5] focus:outline-none focus:border-[#956BFF] resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Scan Depth</label>
                    <select
                      value={scanDepth}
                      onChange={e => setScanDepth(e.target.value as any)}
                      className="w-full bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs font-mono text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
                    >
                      <option value="Deep Investigation">Deep Investigation (Extracts code stubs, timelines, node graph)</option>
                      <option value="Quick Scan">Quick Scan (High-level purpose and license check)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="pt-4 border-t border-[#17102E]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#A8A4B8] mb-2">
                  2. Supply Source Files & Manifests
                </h4>
                
                <div className="border-2 border-dashed border-[#30215B] hover:border-[#956BFF] rounded-xl p-8 text-center bg-[#080712] transition-colors relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-[#956BFF] mx-auto mb-2" />
                  <div className="text-xs font-semibold text-[#ECEAF5]">
                    Drop source files, README, or Cargo.toml / package.json here
                  </div>
                  <div className="text-[11px] font-mono text-[#A8A4B8] mt-1">
                    Supports .rs, .ts, .js, .py, .go, .c, .cpp, .md, .toml, .json (Max 2MB per file, safe passive extraction)
                  </div>
                </div>

                {/* Uploaded File List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-mono text-[#75D8FF]">
                      Extracted Files ({uploadedFiles.length} selected):
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-[#17102E]/60 border border-[#30215B] text-xs font-mono"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className="w-3.5 h-3.5 text-[#956BFF]" />
                            <span className="text-[#ECEAF5] truncate">{file.name}</span>
                            <span className="text-[#A8A4B8]">({Math.round(file.size / 1024)} KB)</span>
                          </div>
                          <button
                            onClick={() => removeFile(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Secrets scrubbing confirmation */}
              <div className="p-4 rounded-lg bg-[#17102E]/40 border border-[#30215B] space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="secretsCheck"
                    checked={hasConfirmedSecrets}
                    onChange={e => setHasConfirmedSecrets(e.target.checked)}
                    className="mt-1 accent-[#956BFF] cursor-pointer"
                  />
                  <label htmlFor="secretsCheck" className="text-xs text-[#A8A4B8] leading-relaxed cursor-pointer">
                    <strong className="text-[#ECEAF5]">I confirm that these files contain no active secrets, tokens, or private credentials.</strong> I understand that REQUIEM will extract text snippets for inference grounding, and that code will never be executed.
                  </label>
                </div>
              </div>

              {uploadError && (
                <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleStartInvestigation}
                disabled={isUploading}
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#956BFF] to-[#75D8FF] hover:brightness-110 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(149,107,255,0.4)] disabled:opacity-50"
              >
                <span>{isUploading ? 'Executing Archaeological Extraction...' : 'Begin Archaeological Excavation'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED REPORTS */}
        {activeTab === 'reports' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A8A4B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter saved reports..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#080712] border border-[#30215B] rounded-lg text-xs font-mono text-[#ECEAF5]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {savedReports
                .filter(r => r.projectName.toLowerCase().includes(searchFilter.toLowerCase()))
                .map(report => (
                  <div
                    key={report.id}
                    onClick={() => {
                      if (report.isSample) onLoadCaseStudy(SAMPLE_CASE_STUDY);
                      setActiveTab('overview');
                    }}
                    className="p-5 rounded-xl bg-[#0f0b21] border border-[#30215B] hover:border-[#956BFF] cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-[#17102E] border border-[#30215B] text-[#956BFF]">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-[#ECEAF5] text-sm font-display">{report.projectName}</span>
                          {report.isSample && (
                            <span className="text-[10px] text-[#D7B878] bg-[#D7B878]/10 px-2 py-0.5 rounded border border-[#D7B878]/30">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-[#A8A4B8] mt-1">
                          {report.primaryLanguage} · {report.findingsCount} findings · {report.revivalTasksCount} revival tasks · {report.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-[#A8A4B8]" />
                      {!report.isSample && (
                        <button
                          onClick={e => handleDeleteReport(report.id, e)}
                          className="p-1.5 text-red-400 hover:text-red-300"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
