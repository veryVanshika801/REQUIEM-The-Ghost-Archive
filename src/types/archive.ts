export type FindingCategory = 
  | 'architecture' 
  | 'unfinished_feature' 
  | 'security_risk' 
  | 'missing_docs' 
  | 'dependency' 
  | 'dead_code';

export type FindingEvidenceType = 'verified' | 'interpretation' | 'unknown';

export interface SourceEvidence {
  filename: string;
  lineStart: number;
  lineEnd: number;
  codeSnippet: string;
  contextDescription: string;
  uncertaintyNotes?: string;
}

export interface AutopsyFinding {
  id: string;
  title: string;
  category: FindingCategory;
  evidenceType: FindingEvidenceType;
  explanation: string;
  confidenceScore: number; // 0 to 1
  confidenceExplanation: string;
  evidence: SourceEvidence;
  isReviewed?: boolean;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  dateStr?: string;
  commitHash?: string;
  isAiInferred: boolean;
  uncertaintyLabel?: string;
  evidenceReference?: string;
  category: 'commit' | 'release' | 'abandonment' | 'ghost_branch' | 'inferred_pivot';
}

export type DreamNodeType = 
  | 'module' 
  | 'feature' 
  | 'file' 
  | 'dependency' 
  | 'doc' 
  | 'proposal';

export type DreamNodeStatus = 'verified' | 'incomplete' | 'uncertain' | 'blocked';

export interface DreamNode {
  id: string;
  label: string;
  type: DreamNodeType;
  status: DreamNodeStatus;
  description: string;
  evidenceSnippet?: string;
  filename?: string;
  x: number;
  y: number;
}

export interface DreamEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationType: 'imports' | 'intends' | 'blocks' | 'documents';
}

export type BlueprintCategory = 
  | 'fix_first' 
  | 'restore_docs' 
  | 'add_tests' 
  | 'complete_feature' 
  | 'improve_architecture' 
  | 'good_first_issue';

export interface RevivalTask {
  id: string;
  title: string;
  category: BlueprintCategory;
  priority: 'P0' | 'P1' | 'P2';
  reason: string;
  supportingEvidence: string;
  suggestedSteps: string[];
  expectedOutcome: string;
  acceptanceCriteria: string[];
  estimatedDifficulty: 'Easy' | 'Moderate' | 'Complex';
  dependencies?: string[];
  status: 'pending' | 'accepted' | 'completed' | 'dismissed';
}

export interface ProjectAutopsyData {
  projectName: string;
  tagline: string;
  repositoryUrl?: string;
  primaryLanguage: string;
  detectedLicense: string;
  licenseSourceFile?: string;
  analysisDate: string;
  isPreloadedSample: boolean;
  modelIdentifierUsed: string;
  
  // Executive summaries
  purposeSummary: string;
  intendedAudience: string;
  techStack: string[];
  architectureOverview: string;
  whyAbandonedAnalysis: string;

  // Granular investigations
  findings: AutopsyFinding[];
  timeline: TimelineMilestone[];
  graphNodes: DreamNode[];
  graphEdges: DreamEdge[];
  revivalTasks: RevivalTask[];
}

export interface ModelSettingsState {
  provider: 'gemma_inference' | 'ollama_local' | 'huggingface' | 'google_ai_studio';
  modelId: string;
  endpointUrl: string;
  isConnected: boolean;
  lastTestedAt?: string;
  latencyMs?: number;
  error?: string;
}

export interface UserSession {
  isGuest: boolean;
  email?: string;
  name?: string;
  avatarSeed?: string;
}

export interface SavedReportMeta {
  id: string;
  projectName: string;
  createdAt: string;
  findingsCount: number;
  revivalTasksCount: number;
  primaryLanguage: string;
  isSample: boolean;
}
