import React, { useEffect, useRef } from 'react';
import { ArrowDown, Compass, Sparkles } from 'lucide-react';

interface CinematicHeroProps {
  onEnterArchive: () => void;
  onExploreExperience: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onEnterArchive,
  onExploreExperience
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle floating ember/dust particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#956BFF' : '#75D8FF'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-[95svh] w-full flex items-center overflow-hidden bg-[#080712] pt-20">
      {/* Background Hero Artwork (Dominates Right Half, moody dark gradient on Left) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_archivist_archive_1793105367632.jpg"
          alt="The Digital Archivist overlooking the ancient codex towers during a violet storm"
          className="w-full h-full object-cover object-right md:object-[75%_center] opacity-85 select-none"
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Atmospheric Gradient Masks */}
        {/* Left deep dark vignette for supreme typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080712] via-[#080712]/80 to-transparent w-full md:w-[65%]" />
        
        {/* Bottom fade into section 2 */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080712] via-[#080712]/60 to-transparent" />
        
        {/* Top header protection */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080712]/90 to-transparent" />

        {/* Ambient violet lightning atmospheric flash layer */}
        <div className="absolute inset-0 bg-[#956BFF]/10 mix-blend-color-dodge animate-lightning pointer-events-none" />
      </div>

      {/* Floating dust/ember particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Main Content (Left Half) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full py-16 md:py-24">
        <div className="max-w-2xl">
          {/* Subtle Archaic Kicker */}
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] text-[#A8A4B8] mb-6">
            <span className="w-8 h-[1px] bg-[#956BFF]" />
            <span className="uppercase font-mono text-[#75D8FF]">Digital Archaeology Protocol</span>
            <span className="text-[#30215B]">/</span>
            <span>Hacktoberfest 2026</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#ECEAF5] tracking-tight leading-[1.08] mb-6 font-display">
            EVERY ABANDONED <br />
            <span className="bg-gradient-to-r from-[#ECEAF5] via-[#956BFF] to-[#75D8FF] bg-clip-text text-transparent">
              PROJECT LEAVES A GHOST.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#A8A4B8] leading-relaxed mb-10 max-w-xl font-light">
            Somewhere inside forgotten code, a story remains unfinished. REQUIEM uncovers the evidence, reconstructs the intent, and reveals what can live again.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <button
              onClick={onEnterArchive}
              className="px-8 py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white bg-gradient-to-r from-[#956BFF] to-[#5a32d6] hover:from-[#a580ff] hover:to-[#6c40e8] rounded-md shadow-[0_0_25px_rgba(149,107,255,0.45)] hover:shadow-[0_0_35px_rgba(149,107,255,0.65)] transition-all duration-300 text-center flex items-center justify-center gap-2 group"
            >
              <span>Enter The Archive</span>
              <Sparkles className="w-4 h-4 text-[#75D8FF] group-hover:rotate-12 transition-transform" />
            </button>

            <button
              onClick={onExploreExperience}
              className="px-7 py-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-[#ECEAF5] hover:text-white bg-[#17102E]/60 hover:bg-[#17102E] border border-[#30215B] hover:border-[#956BFF]/60 rounded-md transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              <span>Explore The Experience</span>
              <Compass className="w-4 h-4 text-[#A8A4B8]" />
            </button>
          </div>

          {/* Open-Weight AI Subtitle */}
          <div className="flex items-center gap-3 text-xs tracking-wider text-[#A8A4B8]/80 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#75D8FF] shadow-[0_0_8px_#75D8FF]" />
            <span className="uppercase">An open-weight AI experiment in digital archaeology</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#A8A4B8]/60 hover:text-[#ECEAF5] transition-colors cursor-pointer" onClick={onExploreExperience}>
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono">Scroll Down</span>
        <ArrowDown className="w-4 h-4 animate-bounce text-[#956BFF]" />
      </div>
    </section>
  );
};
