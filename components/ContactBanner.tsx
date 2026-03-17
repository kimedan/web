
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useSite } from '../contexts/SiteContext';
import { ArrowRight } from 'lucide-react';

const ContactBanner: React.FC = () => {
  const { t } = useSite();

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight whitespace-pre-line">
            {t.contact.banner.title}
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={0.1}>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed font-medium whitespace-pre-line">
            {t.contact.banner.desc}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/contact">
              <button 
                className="group relative overflow-hidden bg-transparent hover:bg-gray-100 text-gray-900 px-10 py-5 text-lg rounded-full transition-all duration-300 ease-spring active:scale-95"
              >
                <span className="relative z-10 font-bold flex items-center gap-2">
                  {t.contact.banner.btn}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                
                {/* Subtle Radial Glow on Hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.03)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />
              </button>
            </Link>
            
            <div className="flex items-center justify-center space-x-3 text-gray-500 bg-transparent px-6 py-3 rounded-full border border-gray-100 hover:border-gray-200 transition-colors">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium transition-colors">{t.contact.banner.hours}</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactBanner;
