'use client';

import React from 'react';
import { SECTION_COPY, SERVICES, ServiceItem } from '@/data/projects';
import { Layers, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export function Services({ onSelectService }: ServicesProps) {
  const handleInquire = (service: ServiceItem) => {
    onSelectService(service.title);
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-28 sm:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#D7FF64]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF64]">
                {SECTION_COPY.servicesTitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              {SECTION_COPY.servicesTitle}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md leading-relaxed">
            {SECTION_COPY.servicesSubtitle}
          </p>
        </div>

        {/* Creative capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className="group relative rounded-2xl border border-white/10 bg-zinc-950/60 p-6 sm:p-7 hover:border-[#D7FF64]/40 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4">
                  <span>SERVICE &bull; 0{idx + 1}</span>
                  {service.price ? (
                    <span className="text-[#D7FF64]">{service.price}</span>
                  ) : (
                    <span className="text-zinc-600">CUSTOM SCOPE</span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#D7FF64] transition-colors mb-3">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Working Inquire CTA */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleInquire(service)}
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-white group-hover:text-[#D7FF64] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D7FF64] rounded"
                >
                  <span>Inquire for Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
