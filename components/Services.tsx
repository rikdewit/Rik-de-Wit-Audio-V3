
import React from 'react';
import { Mic2, Speaker, Settings } from 'lucide-react';
import { SERVICES } from '../constants';


const IconMap: Record<string, React.ReactNode> = {
  Mic2: <Mic2 strokeWidth={1} size={40} />,
  Speaker: <Speaker strokeWidth={1} size={40} />,
  Settings: <Settings strokeWidth={1} size={40} />,
};

const Services: React.FC = () => {
  return (
    <section id="expertises" className="min-h-screen flex items-center py-12 md:py-16 px-6 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center flex flex-col items-center">
          {/* Profile Photo */}
          <div className="mb-6 relative group">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 ease-out hover:scale-[1.03] hover:rotate-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] cursor-pointer">
              <img 
                src="/Rik.jpeg" 
                alt="Rik de Wit" 
                className="w-full h-full object-cover scale-110"
                onError={(e) => {
                  // Fallback to placeholder if Rik.jpeg is missing
                  (e.target as HTMLImageElement).src = "https://s6.imgcdn.dev/Y0aAnN.jpg";
                }}
              />
            </div>
            {/* Subtle decorative ring that expands on hover */}
            <div className="absolute inset-0 rounded-full border border-black/5 -m-2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Separator line between photo and text */}
          <div className="w-8 h-px bg-black/10 mb-8" />

          {/* About Text */}
          <div className="max-w-2xl mx-auto text-gray-500 font-light text-sm sm:text-base leading-relaxed mb-10 px-4">
            <span className="block text-xl sm:text-2xl text-black mb-2">
              <span className="handwritten text-3xl sm:text-4xl inline-block">Hoi ik ben Rik!</span>
            </span>
            <p>
              Audio technicus voor evenementen en live muziek. Door mijn achtergrond als muzikant en producer combineer ik technische kennis met inzicht in wat een goede show nodig heeft. Zo zorg ik voor een betrouwbaar en prettig klinkend resultaat, ook onder druk.
            </p>
          </div>

          <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold text-gray-400 mb-4">Mijn Expertise</h2>
          <div className="w-12 h-px bg-black/20 mx-auto" />
        </div>

        {/* Smaller grid (max-w-5xl instead of 6xl) and more compact padding (p-6) */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="group flex flex-col items-center text-center p-6 sm:p-8 bg-white border border-gray-50 hover:border-gray-100 hover:shadow-xl transition-all duration-500 rounded-sm"
            >
              <div className="mb-4 text-black group-hover:scale-110 transition-transform duration-500">
                {IconMap[service.icon]}
              </div>
              <h3 className="text-lg font-medium mb-3 tracking-wide mono uppercase">{service.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
