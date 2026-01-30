import React from 'react';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center py-20 px-6 bg-black text-white relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute -bottom-20 -left-20 text-[20vw] font-bold text-white/5 select-none pointer-events-none tracking-tighter">
        AUDIO
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-24 relative z-10">
        <div>
          <h2 className="text-sm uppercase tracking-[0.5em] font-bold text-gray-500 mb-10">Contact</h2>
          <h3 className="text-6xl md:text-7xl font-light tracking-tighter mb-16 leading-[0.9]">
            Laten we samenwerken aan een <span className="italic">beter geluid</span>.
          </h3>
          
          <div className="space-y-10 mt-12">
            <a href="mailto:audio@rikdewit.nl" className="flex items-center gap-8 group cursor-pointer">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-light text-gray-400 group-hover:text-white transition-colors">audio@rikdewit.nl</span>
            </a>
            
            <a href="tel:+31637231247" className="flex items-center gap-8 group cursor-pointer">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-light text-gray-400 group-hover:text-white transition-colors">+31 6 372 312 47</span>
            </a>

            <div className="flex items-center gap-8 group cursor-default">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-light text-gray-400">Eindhoven / Utrecht</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="p-16 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm shadow-2xl">
            <h4 className="text-3xl font-light mb-10 mono uppercase tracking-widest">Volg mij</h4>
            <div className="flex gap-10">
              <a href="https://www.instagram.com/rikdewit.audio" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-4 group">
                <div className="p-4 border border-white/10 rounded-full group-hover:border-white/40 transition-colors">
                  <Instagram size={40} strokeWidth={1} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-white transition-colors">Instagram</span>
                    <span className="text-lg font-light text-gray-400 group-hover:text-white">@rikdewit.audio</span>
                </div>
              </a>
            </div>
            <div className="mt-20 pt-10 border-t border-white/10 text-gray-500 text-lg font-light leading-relaxed">
              Actief als freelance audio technicus met een sterke focus op live sound en muziekproducties, in heel Nederland en daarbuiten.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;