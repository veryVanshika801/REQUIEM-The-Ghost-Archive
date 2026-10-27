import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface FinalCtaSectionProps {
  onBeginInvestigation: () => void;
  onExploreSample: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onBeginInvestigation,
  onExploreSample
}) => {
  return (
    <section className="relative py-32 bg-[#080712] overflow-hidden border-t border-[#17102E] flex items-center justify-center text-center">
      {/* Background artwork overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_archivist_archive_1793105367632.jpg"
          alt="Archivist in the storm"
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080712] via-[#080712]/70 to-[#080712]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17102E] border border-[#30215B] text-xs font-mono text-[#956BFF] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#75D8FF]" />
          <span>The Next Chapter Awaits</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-6">
          THE STORY DOESN'T <br />
          <span className="bg-gradient-to-r from-[#ECEAF5] via-[#956BFF] to-[#75D8FF] bg-clip-text text-transparent">
            HAVE TO END HERE.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-[#A8A4B8] leading-relaxed mb-10 max-w-2xl mx-auto font-light">
          Bring the forgotten into the light. Find the evidence. Discover what can live again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBeginInvestigation}
            className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white bg-gradient-to-r from-[#956BFF] to-[#5a32d6] hover:from-[#a580ff] hover:to-[#6c40e8] rounded-md shadow-[0_0_30px_rgba(149,107,255,0.45)] hover:shadow-[0_0_40px_rgba(149,107,255,0.65)] transition-all flex items-center justify-center gap-2"
          >
            <span>BEGIN AN INVESTIGATION</span>
            <Sparkles className="w-4 h-4 text-[#75D8FF]" />
          </button>

          <button
            onClick={onExploreSample}
            className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#ECEAF5] hover:text-white bg-[#17102E] hover:bg-[#201740] border border-[#30215B] hover:border-[#956BFF] rounded-md transition-all flex items-center justify-center gap-2"
          >
            <span>EXPLORE THE SAMPLE</span>
            <Compass className="w-4 h-4 text-[#A8A4B8]" />
          </button>
        </div>

        {/* Luminous trail leading toward the footer */}
        <div className="mt-20 flex flex-col items-center">
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#956BFF] to-transparent" />
        </div>
      </div>
    </section>
  );
};
