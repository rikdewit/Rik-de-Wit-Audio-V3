'use client';
import React from 'react';

const About: React.FC = () => {
  return (
    <section className="flex items-center py-16 md:py-20 px-6 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <div className="mb-6 relative group">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 ease-out hover:scale-[1.03] hover:rotate-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] cursor-pointer">
            <img
              src="/Rik.jpeg"
              alt="Rik de Wit"
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://s6.imgcdn.dev/Y0aAnN.jpg';
              }}
            />
          </div>
          <div className="absolute inset-0 rounded-full border border-black/5 -m-2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="w-8 h-px bg-black/10 mb-8" />

        <div className="max-w-2xl text-gray-500 font-light text-sm sm:text-base leading-relaxed px-4">
          <span className="block text-xl sm:text-2xl text-black mb-2">
            <span className="handwritten text-3xl sm:text-4xl inline-block">Hoi ik ben Rik!</span>
          </span>
          <p>
            Audio technicus voor evenementen en live muziek. Door mijn achtergrond als muzikant en producer combineer ik technische kennis met inzicht in wat een goede show nodig heeft. Zo zorg ik voor een betrouwbaar en prettig klinkend resultaat, ook onder druk.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
