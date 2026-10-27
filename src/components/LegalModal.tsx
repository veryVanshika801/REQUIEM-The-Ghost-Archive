import React from 'react';
import { X, Shield, Scale, Lock, AlertTriangle, FileText, Mail } from 'lucide-react';

interface LegalModalProps {
  page: string | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ page, onClose }) => {
  if (!page) return null;

  const contentMap: Record<string, { title: string; subtitle: string; body: React.ReactNode }> = {
    privacy: {
      title: 'PRIVACY NOTICE',
      subtitle: 'Data handling, ephemeral processing, and user controls',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            <strong className="text-[#ECEAF5]">1. Zero Training Ingestion:</strong> Source code uploaded to REQUIEM is treated strictly as transient forensic evidence. We do not use, log, or persist user source code to train public foundation models.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">2. Ephemeral Storage:</strong> Guest investigations exist solely in client memory and session storage. When you refresh or clear your browser storage, your investigation data is permanently wiped from memory.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">3. Automated Secret Scrubbing:</strong> Prior to inference, our preprocessing pipeline detects and redacts common token patterns (.env secrets, API keys, private keys, authorization headers) to prevent accidental credential leakage.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">4. Right to Deletion:</strong> Any saved reports in the Archive Chamber can be purged immediately using the "Delete Investigation" control.
          </p>
        </div>
      )
    },
    terms: {
      title: 'TERMS OF USE',
      subtitle: 'Permitted usage and forensic analysis conditions',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            <strong className="text-[#ECEAF5]">1. Acceptance of Terms:</strong> By accessing REQUIEM — The Ghost Archive, you agree to these Terms. This project was developed as a submission for Hacktoberfest 2026.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">2. Authorized Content:</strong> You represent that you have legal permission to inspect and analyze the software files uploaded. Do not upload proprietary code that violates non-disclosure agreements or trade secrets.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">3. No Warranty:</strong> The service is provided "as is". While REQUIEM strives for strict evidence grounding, AI-inferred hypotheses must be reviewed before applying production code changes.
          </p>
        </div>
      )
    },
    copyright: {
      title: 'COPYRIGHT & LICENCES',
      subtitle: 'Intellectual property preservation and open-source compliance',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            <strong className="text-[#ECEAF5]">1. Original Authorship:</strong> REQUIEM never claims ownership of user-uploaded or investigated repositories. All original copyrights, MIT, Apache-2.0, GPL, or BSD licenses belong to their respective authors.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">2. Automatic License Detection:</strong> Our analyzer inspects LICENSE, COPYING, and header comments. When a license cannot be unambiguously determined, REQUIEM explicitly flags it as "No License Detected / Manual Review Required."
          </p>
          <p>
            <strong className="text-[#ECEAF5]">3. Third-Party Libraries:</strong> REQUIEM is constructed using open-source tools: React (MIT), Express (MIT), Lucide (ISC), Tailwind CSS (MIT).
          </p>
        </div>
      )
    },
    security: {
      title: 'SECURITY & DATA HANDLING',
      subtitle: 'Zero-execution guarantee and untrusted input isolation',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            <strong className="text-[#ECEAF5]">1. Absolute Zero-Execution:</strong> Uploaded code is NEVER compiled, interpreted, or executed. Files are parsed strictly as UTF-8 string tokens and abstract syntax fragments.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">2. Prompt Injection Defense:</strong> All uploaded contents are encapsulated in strictly delimited data envelopes with JSON Schema validation to neutralize attempts to hijack model system instructions.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">3. Safe Zip Archive Processing:</strong> ZIP archives are validated with path-traversal checks to prevent zip-slip vulnerabilities and restricted to safe file sizes (&lt; 10MB total, max 15 text files).
          </p>
        </div>
      )
    },
    ai_limits: {
      title: 'AI LIMITATIONS & GROUNDED TRUTH',
      subtitle: 'Distinguishing verifiable facts from machine inferences',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            <strong className="text-[#ECEAF5]">1. The Truth Hierarchy:</strong>
            <br />
            • <strong className="text-emerald-400">Verified Evidence:</strong> Directly backed by explicit lines in the codebase.
            <br />
            • <strong className="text-[#75D8FF]">AI Interpretation:</strong> Reasoned deduction based on patterns, but not explicitly stated.
            <br />
            • <strong className="text-[#D7B878]">Unknown:</strong> Information absent from the repository.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">2. No Hallucinated Commits:</strong> If git commit logs are unavailable or not provided, REQUIEM will state "Git history unavailable" rather than inventing dates or author milestones.
          </p>
        </div>
      )
    },
    gemma: {
      title: 'GEMMA 2 OPEN-WEIGHT ATTRIBUTION',
      subtitle: 'Google DeepMind Gemma model terms and notices',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            <strong className="text-[#ECEAF5]">1. Model Provenance:</strong> The forensic engine leverages Gemma 2 (9B / 27B parameter open-weight architectures created by Google DeepMind).
          </p>
          <p>
            <strong className="text-[#ECEAF5]">2. License Compliance:</strong> Gemma is made available under the Gemma Terms of Use. REQUIEM abides by the responsible generative AI guidelines and prohibits use for malicious vulnerability exploitation.
          </p>
          <p>
            <strong className="text-[#ECEAF5]">3. Modular Deployability:</strong> Gemma weights can be executed self-hosted on custom GPU hardware using Ollama/vLLM or accessed via hosted inference endpoints.
          </p>
        </div>
      )
    },
    contact: {
      title: 'REPORT AN ISSUE / CONTACT',
      subtitle: 'Hacktoberfest 2026 Ghost in the Machine challenge',
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#A8A4B8]">
          <p>
            Encountered an archaeological edge case, parsing bug, or evidence extraction inconsistency?
          </p>
          <div className="p-4 rounded bg-[#080712] border border-[#30215B] font-mono text-xs text-[#ECEAF5]">
            Project: REQUIEM — The Ghost Archive<br />
            Event: Hacktoberfest 2026 Challenge<br />
            Repository: https://github.com/archive-vault/requiem-ghost-archive<br />
            Contact: Vanshika (Maintainer)
          </div>
        </div>
      )
    }
  };

  const activeContent = contentMap[page] || contentMap.privacy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f0b21] border border-[#30215B] rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#A8A4B8] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[#956BFF] mb-1">
            Governance & Legal Disclosure
          </div>
          <h2 className="text-2xl font-bold font-display text-[#ECEAF5]">
            {activeContent.title}
          </h2>
          <div className="text-xs text-[#75D8FF] font-mono mt-0.5">
            {activeContent.subtitle}
          </div>
        </div>

        <div className="py-4 border-t border-b border-[#17102E] mb-6">
          {activeContent.body}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#956BFF] hover:bg-[#8555f5] rounded-md transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
