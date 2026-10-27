import React, { useState, useEffect } from 'react';
import { SAMPLE_CASE_STUDY } from './data/sampleArchive';
import { ProjectAutopsyData, AutopsyFinding, UserSession } from './types/archive';

// Components for all 13 sections
import { Navbar } from './components/Navbar';
import { CinematicHero } from './components/CinematicHero';
import { LostArchiveStory } from './components/LostArchiveStory';
import { HowRequiemWorks } from './components/HowRequiemWorks';
import { EnterArchiveCta } from './components/EnterArchiveCta';
import { ProjectAutopsySection } from './components/ProjectAutopsySection';
import { GhostTimelineSection } from './components/GhostTimelineSection';
import { EvidenceVaultSection } from './components/EvidenceVaultSection';
import { UnfinishedDreamsMapSection } from './components/UnfinishedDreamsMapSection';
import { RevivalBlueprintSection } from './components/RevivalBlueprintSection';
import { WhyOpenWeightSection } from './components/WhyOpenWeightSection';
import { PrivacyTrustSection } from './components/PrivacyTrustSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { FooterSection } from './components/FooterSection';

// Modals & Alternative Views
import { ProofDrawer } from './components/ProofDrawer';
import { AuthModal } from './components/AuthModal';
import { ModelSettingsModal } from './components/ModelSettingsModal';
import { LegalModal } from './components/LegalModal';
import { WorkspaceView } from './components/WorkspaceView';

export function App() {
  const [currentData, setCurrentData] = useState<ProjectAutopsyData>(SAMPLE_CASE_STUDY);
  const [activeProofFinding, setActiveProofFinding] = useState<AutopsyFinding | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState(false);
  const [legalModalPage, setLegalModalPage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');
  const [scrollProgress, setScrollProgress] = useState(0);

  const [userSession, setUserSession] = useState<UserSession>({
    isGuest: true,
    name: 'Guest Archaeologist'
  });

  // Ensure page always opens at the top when loaded or refreshed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInspectFinding = (finding: AutopsyFinding) => {
    setActiveProofFinding(finding);
  };

  const handleEnterWorkspace = () => {
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleExploreExperience = () => {
    const el = document.getElementById('archive');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080712] text-[#ECEAF5] overflow-x-hidden">
      {/* Scroll Progress Bar at very top */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#956BFF] via-[#75D8FF] to-[#D7B878] z-50 transition-all duration-150 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {viewMode === 'workspace' ? (
        /* Workspace / Chamber View */
        <WorkspaceView
          currentData={currentData}
          userSession={userSession}
          onExitWorkspace={() => {
            setViewMode('landing');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onOpenModelSettings={() => setIsModelSettingsOpen(true)}
          onOpenLegal={page => setLegalModalPage(page)}
          onInspectFinding={handleInspectFinding}
          onLoadCaseStudy={data => setCurrentData(data)}
        />
      ) : (
        /* 13-Section Long-Scroll Cinematic Homepage */
        <main className="relative">
          {/* Global Navbar */}
          <Navbar
            onEnterWorkspace={handleEnterWorkspace}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenModelSettings={() => setIsModelSettingsOpen(true)}
            userEmail={userSession.isGuest ? undefined : userSession.email}
            isGuest={userSession.isGuest}
          />

          {/* SECTION 1 — CINEMATIC HERO */}
          <CinematicHero
            onEnterArchive={handleEnterWorkspace}
            onExploreExperience={handleExploreExperience}
          />

          {/* SECTION 2 — THE LOST ARCHIVE / PROBLEM STORY */}
          <LostArchiveStory />

          {/* SECTION 3 — HOW REQUIEM WORKS */}
          <HowRequiemWorks />

          {/* SECTION 4 — ENTER THE ARCHIVE / INTERACTIVE DEMO */}
          <EnterArchiveCta
            onInvestigateProject={handleEnterWorkspace}
            onExploreSample={() => {
              setCurrentData(SAMPLE_CASE_STUDY);
              const autopsyEl = document.getElementById('autopsy');
              if (autopsyEl) {
                autopsyEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* SECTION 5 — PROJECT AUTOPSY */}
          <ProjectAutopsySection
            data={currentData}
            onInspectFinding={handleInspectFinding}
          />

          {/* SECTION 6 — THE GHOST TIMELINE */}
          <GhostTimelineSection
            milestones={currentData.timeline}
          />

          {/* SECTION 7 — THE EVIDENCE VAULT */}
          <EvidenceVaultSection
            findings={currentData.findings}
            onInspectFinding={handleInspectFinding}
          />

          {/* SECTION 8 — THE UNFINISHED DREAMS MAP */}
          <UnfinishedDreamsMapSection
            nodes={currentData.graphNodes}
            edges={currentData.graphEdges}
          />

          {/* SECTION 9 — THE REVIVAL BLUEPRINT */}
          <RevivalBlueprintSection
            tasks={currentData.revivalTasks}
          />

          {/* SECTION 10 — WHY OPEN-WEIGHT AI MATTERS */}
          <WhyOpenWeightSection />

          {/* SECTION 11 — PRIVACY, COPYRIGHT AND TRUST */}
          <PrivacyTrustSection
            onOpenLegal={page => setLegalModalPage(page)}
          />

          {/* SECTION 12 — FINAL CALL TO ACTION */}
          <FinalCtaSection
            onBeginInvestigation={handleEnterWorkspace}
            onExploreSample={() => {
              setCurrentData(SAMPLE_CASE_STUDY);
              const autopsyEl = document.getElementById('autopsy');
              if (autopsyEl) {
                autopsyEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* SECTION 13 — EXTENSIVE FOOTER */}
          <FooterSection
            onOpenLegal={page => setLegalModalPage(page)}
            onOpenModelSettings={() => setIsModelSettingsOpen(true)}
          />
        </main>
      )}

      {/* Signature Proof Drawer / Modal */}
      <ProofDrawer
        finding={activeProofFinding}
        onClose={() => setActiveProofFinding(null)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={session => {
          setUserSession(session);
          setIsAuthOpen(false);
          handleEnterWorkspace();
        }}
        onOpenLegal={page => {
          setIsAuthOpen(false);
          setLegalModalPage(page);
        }}
      />

      {/* Model Settings Modal */}
      <ModelSettingsModal
        isOpen={isModelSettingsOpen}
        onClose={() => setIsModelSettingsOpen(false)}
      />

      {/* Legal & Governance Modal */}
      <LegalModal
        page={legalModalPage}
        onClose={() => setLegalModalPage(null)}
      />
    </div>
  );
}

export default App;
