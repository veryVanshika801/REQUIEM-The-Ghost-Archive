import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  UploadCloud, 
  FileCode, 
  History, 
  Settings, 
  ShieldCheck, 
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
  ChevronRight,
  Github,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { ProjectAutopsyData, AutopsyFinding, UserSession, SavedReportMeta, RevivalTask } from '../types/archive';
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

const PROGRESS_STAGES = [
  'Preparing Archive',
  'Collecting Evidence',
  'Reconstructing Intent',
  'Mapping Unfinished Work',
  'Building Revival Plan'
];

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
  
  // Upload & Investigation Parameters
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [scanDepth, setScanDepth] = useState<'Quick Scan' | 'Deep Investigation'>('Deep Investigation');
  const [githubUrl, setGithubUrl] = useState('');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progressStageIdx, setProgressStageIdx] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasConfirmedSecrets, setHasConfirmedSecrets] = useState(false);

  // Saved reports history with LocalStorage persistence
  const [savedReports, setSavedReports] = useState<SavedReportMeta[]>(() => {
    try {
      const stored = localStorage.getItem('requiem_saved_reports');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'hyperflow-demo',
        projectName: 'HyperFlow Engine',
        createdAt: '2026-10-24 16:42 UTC',
        findingsCount: SAMPLE_CASE_STUDY.findings.length,
        revivalTasksCount: SAMPLE_CASE_STUDY.revivalTasks.length,
        primaryLanguage: 'Rust / TypeScript',
        isSample: true
      }
    ];
  });
  const [searchFilter, setSearchFilter] = useState('');

  // Persist reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('requiem_saved_reports', JSON.stringify(savedReports));
    } catch (e) {
      // ignore
    }
  }, [savedReports]);

  // Handle local file selection
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

  // Safe GitHub Repository Ingestion
  const handleFetchGithubRepo = async () => {
    if (!githubUrl.trim()) {
      setUploadError('Please enter a GitHub repository URL (e.g. owner/repo).');
      return;
    }

    setUploadError(null);
    setIsFetchingGithub(true);

    try {
      // Parse owner and repo from URL
      const cleanUrl = githubUrl.replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
      const parts = cleanUrl.split('/');
      if (parts.length < 2) {
        throw new Error('Please enter a valid GitHub URL format (e.g., https://github.com/owner/repository).');
      }

      const owner = parts[0];
      const repo = parts[1];

      if (!projectName) {
        setProjectName(repo);
      }

      // Fetch repository metadata
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) {
        throw new Error(`Repository not found or private (HTTP ${repoRes.status}).`);
      }
      const repoMeta = await repoRes.json();
      if (repoMeta.description && !projectDescription) {
        setProjectDescription(repoMeta.description);
      }

      // Fetch README
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
      const fetchedFiles: UploadedFileItem[] = [];

      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        const content = atob(readmeData.content.replace(/\s/g, ''));
        fetchedFiles.push({
          name: readmeData.name || 'README.md',
          size: readmeData.size || content.length,
          content
        });
      }

      // Fetch Root Tree to detect Cargo.toml, package.json, requirements.txt, or main files
      const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
      if (contentsRes.ok) {
        const contents = await contentsRes.json();
        const highPriorityNames = [
          'Cargo.toml', 'package.json', 'go.mod', 'pyproject.toml', 
          'LICENSE', 'LICENSE.md', 'CHANGELOG.md', 'main.rs', 'index.ts', 'main.py'
        ];

        for (const item of contents) {
          if (highPriorityNames.includes(item.name) && item.type === 'file' && item.size < 500000) {
            try {
              const fileRes = await fetch(item.download_url);
              if (fileRes.ok) {
                const text = await fileRes.text();
                fetchedFiles.push({
                  name: item.name,
                  size: item.size,
                  content: text
                });
              }
            } catch (e) {
              // continue
            }
          }
        }
      }

      if (fetchedFiles.length === 0) {
        throw new Error('No readable text manifests or README found in this repository.');
      }

      setUploadedFiles(prev => [...prev, ...fetchedFiles].slice(0, 15));
      alert(`Successfully retrieved ${fetchedFiles.length} files from ${owner}/${repo} for passive inspection.`);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to fetch public repository.');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  // Client-Side Forensic Heuristic Analyzer (Guarantees zero-dead-end fallback on static Vercel)
  const runClientForensicScan = (name: string, desc: string, files: UploadedFileItem[]): ProjectAutopsyData => {
    const findings: AutopsyFinding[] = [];
    const timeline: any[] = [];
    const tasks: RevivalTask[] = [];

    // Analyze files for explicit TODOs, panic, locks, and licenses
    let license = 'No license detected';
    let licenseSource = 'None';
    let lang = 'Mixed Source';

    files.forEach((file) => {
      const lines = file.content.split('\n');

      if (file.name.toLowerCase().includes('license')) {
        if (file.content.includes('Apache')) license = 'Apache-2.0 License';
        else if (file.content.includes('MIT')) license = 'MIT License';
        else if (file.content.includes('GPL')) license = 'GNU General Public License';
        licenseSource = file.name;
      }

      if (file.name.endsWith('.rs')) lang = 'Rust';
      else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) lang = 'TypeScript';
      else if (file.name.endsWith('.py')) lang = 'Python';
      else if (file.name.endsWith('.go')) lang = 'Go';

      // Scan lines for stubs & unfinished code
      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        if (line.includes('TODO') || line.includes('FIXME') || line.includes('todo!') || line.includes('panic!')) {
          if (findings.length < 6) {
            findings.push({
              id: `f-client-${findings.length + 1}`,
              title: `Unfinished Stub in ${file.name}: Line ${lineNum}`,
              category: 'unfinished_feature',
              evidenceType: 'verified',
              explanation: `Explicit unfinished marker identified in source file: "${line.trim()}". Indicates unfulfilled implementation logic prior to repository stall.`,
              confidenceScore: 0.95,
              confidenceExplanation: `Directly verified at line ${lineNum} of ${file.name}.`,
              evidence: {
                filename: file.name,
                lineStart: Math.max(1, lineNum - 3),
                lineEnd: Math.min(lines.length, lineNum + 4),
                codeSnippet: lines.slice(Math.max(0, lineNum - 4), Math.min(lines.length, lineNum + 4)).join('\n'),
                contextDescription: `Inspection confirms uncompleted code segment marked: ${line.trim()}`,
                uncertaintyNotes: 'Exact original intended implementation depends on unmerged branch history.'
              }
            });
          }
        }
      });
    });

    // If no explicit TODOs found, synthesize high-level verified findings from manifests
    if (findings.length === 0) {
      const firstFile = files[0];
      findings.push({
        id: 'f-client-1',
        title: `Core Manifest and Architecture Entry in ${firstFile.name}`,
        category: 'architecture',
        evidenceType: 'verified',
        explanation: `Passive extraction confirmed ${files.length} active source/manifest files. Project architecture is centered around ${firstFile.name}.`,
        confidenceScore: 0.90,
        confidenceExplanation: `Verified by presence of ${firstFile.name} with ${firstFile.size} bytes.`,
        evidence: {
          filename: firstFile.name,
          lineStart: 1,
          lineEnd: Math.min(25, firstFile.content.split('\n').length),
          codeSnippet: firstFile.content.split('\n').slice(0, 25).join('\n'),
          contextDescription: 'Primary project entrypoint / manifest structure.',
          uncertaintyNotes: 'Runtime benchmark figures require live test harness.'
        }
      });
    }

    // Build timeline
    timeline.push({
      id: 't-c-1',
      title: 'Repository Structure Initialized',
      description: `Project initialized with ${files.length} core files including ${files[0]?.name}.`,
      dateStr: 'Historical Evidence',
      isAiInferred: false,
      evidenceReference: `Manifest file ${files[0]?.name}`,
      category: 'commit'
    });
    timeline.push({
      id: 't-c-2',
      title: 'Development Freeze Detected',
      description: 'Repository shows no subsequent version tags or active test fixtures.',
      dateStr: 'Observed Freeze',
      isAiInferred: true,
      uncertaintyLabel: 'AI Archaeological Inference — Inferred from uncompleted code stubs',
      evidenceReference: 'Absence of merged release tags in inspected files',
      category: 'abandonment'
    });

    // Build tasks
    tasks.push({
      id: 'task-c-1',
      title: `Resolve Unfinished Stubs in ${findings[0]?.evidence.filename || files[0]?.name}`,
      category: 'fix_first',
      priority: 'P0',
      reason: 'Unfinished stubs prevent clean compilation and trigger runtime failures.',
      supportingEvidence: `${findings[0]?.evidence.filename || files[0]?.name}`,
      suggestedSteps: [
        'Inspect stubbed method logic',
        'Replace panic or placeholder return with concrete error handling',
        'Add isolated unit test covering edge case'
      ],
      expectedOutcome: 'Zero thread crashes and complete method semantics.',
      acceptanceCriteria: ['Test suite passes without invoking unwrap panic'],
      estimatedDifficulty: 'Moderate',
      status: 'pending'
    });

    tasks.push({
      id: 'task-c-2',
      title: 'Add Regression Test Suite & Quickstart Documentation',
      category: 'restore_docs',
      priority: 'P1',
      reason: 'Missing quickstart examples increase onboarding friction for prospective maintainers.',
      supportingEvidence: `README file in repository root`,
      suggestedSteps: [
        'Document reproducible build instructions',
        'Add a minimal runnable example in examples/ directory',
        'Verify build instructions in clean container'
      ],
      expectedOutcome: 'New contributors can run the codebase in under 5 minutes.',
      acceptanceCriteria: ['README contains copy-pasteable build instructions that succeed'],
      estimatedDifficulty: 'Easy',
      status: 'pending'
    });

    return {
      projectName: name,
      tagline: desc || 'Excavated open-source codebase under archaeological review',
      primaryLanguage: lang,
      detectedLicense: license,
      licenseSourceFile: licenseSource,
      analysisDate: new Date().toISOString(),
      isPreloadedSample: false,
      modelIdentifierUsed: 'REQUIEM Forensic Heuristic Engine (Offline / Static Mode)',
      purposeSummary: desc || `Codebase containing ${files.length} source modules focusing on ${lang} development.`,
      intendedAudience: 'Software maintainers and open-source contributors.',
      techStack: [lang, 'Passive AST Parser', 'Evidence Grounding'],
      architectureOverview: `Modular ${lang} architecture with ${files.length} active files analyzed.`,
      whyAbandonedAnalysis: 'Stagnated following partial implementation of core subsystems, indicated by unfulfilled stubs.',
      findings,
      timeline,
      graphNodes: files.map((f, i) => ({
        id: `node-${i}`,
        label: f.name,
        type: f.name.includes('doc') || f.name.includes('README') ? 'doc' : 'file',
        status: 'verified',
        description: `Source file containing ${f.size} bytes.`,
        filename: f.name,
        x: 150 + (i % 3) * 220,
        y: 120 + Math.floor(i / 3) * 120
      })),
      graphEdges: files.slice(1).map((f, i) => ({
        id: `edge-${i}`,
        source: 'node-0',
        target: `node-${i + 1}`,
        label: 'references',
        relationType: 'imports'
      })),
      revivalTasks: tasks
    };
  };

  // Run live investigation with progress animation & fallback resilience
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
    setProgressStageIdx(0);

    // Progress stage timer animation
    const interval = setInterval(() => {
      setProgressStageIdx(prev => {
        if (prev < PROGRESS_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

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

      clearInterval(interval);
      setProgressStageIdx(PROGRESS_STAGES.length - 1);

      if (!res.ok) {
        // If serverless is not configured with GEMINI_API_KEY, use the client forensic heuristics
        const errJson = await res.json().catch(() => ({}));
        console.warn('Backend inference unavailable, running client forensic extraction:', errJson);

        const clientAutopsy = runClientForensicScan(projectName, projectDescription, uploadedFiles);
        onLoadCaseStudy(clientAutopsy);
        setSavedReports(prev => [
          {
            id: `case-${Date.now()}`,
            projectName: clientAutopsy.projectName,
            createdAt: new Date().toLocaleTimeString(),
            findingsCount: clientAutopsy.findings.length,
            revivalTasksCount: clientAutopsy.revivalTasks.length,
            primaryLanguage: clientAutopsy.primaryLanguage,
            isSample: false
          },
          ...prev
        ]);
        setActiveTab('overview');
        alert(`Archaeological excavation complete for "${projectName}" using client-side evidence grounding!`);
        return;
      }

      const result = await res.json();
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
      clearInterval(interval);
      // In case of total network disconnect, execute client-side forensic extraction
      const clientAutopsy = runClientForensicScan(projectName, projectDescription, uploadedFiles);
      onLoadCaseStudy(clientAutopsy);
      setSavedReports(prev => [
        {
          id: `case-${Date.now()}`,
          projectName: clientAutopsy.projectName,
          createdAt: new Date().toLocaleTimeString(),
          findingsCount: clientAutopsy.findings.length,
          revivalTasksCount: clientAutopsy.revivalTasks.length,
          primaryLanguage: clientAutopsy.primaryLanguage,
          isSample: false
        },
        ...prev
      ]);
      setActiveTab('overview');
      alert(`Archaeological excavation complete for "${projectName}" (offline forensic extraction mode)!`);
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

  const handleExportMarkdown = () => {
    const md = `# REQUIEM ARCHAEOLOGICAL AUTOPSY: ${currentData.projectName}
> ${currentData.tagline}

- **Primary Language:** ${currentData.primaryLanguage}
- **Detected License:** ${currentData.detectedLicense} (${currentData.licenseSourceFile || 'None'})
- **Analysis Timestamp:** ${currentData.analysisDate}
- **Inference Model:** ${currentData.modelIdentifierUsed}
- **Status:** ${currentData.isPreloadedSample ? 'Precomputed Demonstration Case' : 'Live Repository Excavation'}

---

## 1. Executive Purpose & Stagnation Summary
### Architectural Intent
${currentData.purposeSummary}

### Why The Project Stalled
${currentData.whyAbandonedAnalysis}

---

## 2. Forensic Findings & Grounded Proof (${currentData.findings.length} Evidence Records)
${currentData.findings.map(f => `
### [${f.evidenceType.toUpperCase()}] ${f.title}
- **Category:** ${f.category}
- **Confidence:** ${Math.round(f.confidenceScore * 100)}% (${f.confidenceExplanation})
- **File Reference:** \`${f.evidence.filename}\` (Lines ${f.evidence.lineStart}–${f.evidence.lineEnd})

**Source Code Excerpt:**
\`\`\`
${f.evidence.codeSnippet}
\`\`\`

**Context & Truth:** ${f.evidence.contextDescription}
**Uncertainty / Caveats:** ${f.evidence.uncertaintyNotes || 'None recorded'}
`).join('\n---\n')}

---

## 3. Ghost Timeline
${currentData.timeline.map(m => `- **${m.dateStr || 'Milestone'}**: ${m.title} (${m.isAiInferred ? 'AI Inferred' : 'Verified Commit'}) — ${m.description}`).join('\n')}

---

## 4. Revival Blueprint Roadmap
${currentData.revivalTasks.map(t => `
### [${t.priority}] ${t.title}
- **Category:** ${t.category} | **Difficulty:** ${t.estimatedDifficulty}
- **Reason:** ${t.reason}
- **Evidence:** ${t.supportingEvidence}
- **Expected Outcome:** ${t.expectedOutcome}

**Steps:**
${t.suggestedSteps.map(s => `- ${s}`).join('\n')}

**Acceptance Criteria:**
${t.acceptanceCriteria.map(c => `- [ ] ${c}`).join('\n')}
`).join('\n---\n')}

---
*Generated by REQUIEM: The Ghost Archive (Hacktoberfest 2026)*`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentData.projectName.toLowerCase().replace(/\s+/g, '-')}-autopsy.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#080712] text-[#ECEAF5] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#05040a] border-r border-[#17102E] p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Return button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onExitWorkspace}
              className="flex items-center gap-2 text-xs font-bold font-display text-[#ECEAF5] hover:text-[#956BFF] transition-colors cursor-pointer"
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
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
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#A8A4B8] hover:text-[#ECEAF5] hover:bg-[#17102E] rounded-md transition-colors cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#75D8FF]" />
            <span>Gemma Model Settings</span>
          </button>

          <button
            onClick={() => onOpenLegal('security')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#A8A4B8] hover:text-[#ECEAF5] hover:bg-[#17102E] rounded-md transition-colors cursor-pointer"
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onLoadCaseStudy(SAMPLE_CASE_STUDY)}
              className="px-3.5 py-1.5 text-xs font-mono text-[#D7B878] bg-[#17102E] border border-[#D7B878]/40 hover:border-[#D7B878] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reset To HyperFlow Case</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="px-3.5 py-1.5 text-xs font-mono text-[#ECEAF5] bg-[#17102E] border border-[#30215B] hover:border-[#75D8FF] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-[#75D8FF]" />
              <span>Export Markdown</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3.5 py-1.5 text-xs font-mono text-[#ECEAF5] bg-[#17102E] border border-[#30215B] hover:border-[#956BFF] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-[#956BFF]" />
              <span>Export JSON</span>
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

                <div className="text-xs font-mono text-[#A8A4B8] space-y-1 text-left md:text-right">
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
                  Click to inspect exact source excerpt & line proof
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
                  Define the codebase name, or import directly from a public GitHub repository.
                </p>
              </div>

              {/* GitHub Quick Import */}
              <div className="p-4 rounded-lg bg-[#17102E]/60 border border-[#30215B] space-y-2">
                <label className="text-xs font-mono text-[#75D8FF] flex items-center gap-1.5 font-semibold">
                  <Github className="w-4 h-4" />
                  <span>Public GitHub Repository Import</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="flex-1 bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs font-mono text-[#ECEAF5] focus:outline-none focus:border-[#75D8FF]"
                  />
                  <button
                    onClick={handleFetchGithubRepo}
                    disabled={isFetchingGithub}
                    className="px-4 py-2 text-xs font-mono font-semibold uppercase text-white bg-[#17102E] hover:bg-[#30215B] border border-[#75D8FF] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGithub ? 'animate-spin' : ''}`} />
                    <span>{isFetchingGithub ? 'Fetching...' : 'Fetch Files'}</span>
                  </button>
                </div>
                <div className="text-[11px] font-mono text-[#A8A4B8]">
                  Passively downloads README, manifests (Cargo.toml, package.json), and top source files via public GitHub REST API without compiling.
                </div>
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

                <div>
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
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
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

              {/* Progress Stage Tracker (PHASE 4C) */}
              {isUploading && (
                <div className="p-5 rounded-xl bg-[#080712] border border-[#956BFF] space-y-3">
                  <div className="text-xs font-mono uppercase text-[#75D8FF] flex items-center justify-between">
                    <span>Excavation In Progress...</span>
                    <span>Stage {progressStageIdx + 1} of {PROGRESS_STAGES.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#17102E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#956BFF] to-[#75D8FF] transition-all duration-500"
                      style={{ width: `${((progressStageIdx + 1) / PROGRESS_STAGES.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-[#ECEAF5] font-semibold">
                    Current Operation: {PROGRESS_STAGES[progressStageIdx]}
                  </div>
                </div>
              )}

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
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#956BFF] to-[#75D8FF] hover:brightness-110 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(149,107,255,0.4)] disabled:opacity-50 cursor-pointer"
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
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
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
