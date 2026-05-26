'use client';
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
    <section id="expertises" className="py-16 md:py-20 px-6 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold text-gray-400 mb-4">Mijn Expertise</h2>
          <div className="w-12 h-px bg-black/20 mx-auto" />
        </div>

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
