'use client';

import React from 'react';
import { CREATIVE_PROCESS } from '@/data/projects';
import { GitBranch, CheckCircle2 } from 'lucide-react';

export function CreativeProcess() {
  return (
    <section id="process" className="relative py-28 sm:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <GitBranch className="w-3.5 h-3.5 text-[#D7FF64]" />
            <span className="text-xs font-mono tracking-widest text-[#D7FF64] uppercase">
              Workflow &amp; Pipeline
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            CREATIVE PROCESS &mdash; <span className="text-zinc-500">FROM DUMP TO MASTER</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            A structured, repeatable editing pipeline ensuring clarity, emotional resonance, and timely delivery.
          </p>
        </div>

        {/* 4-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {CREATIVE_PROCESS.map((step, idx) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D7FF64]/40 transition-all duration-300 group"
            >
              {/* Step Number with Accent */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D7FF64] group-hover:scale-105 transition-transform">
                    {step.step}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-[#D7FF64] group-hover:border-[#D7FF64]/40 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-wide uppercase mb-3 group-hover:text-[#D7FF64] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step indicator bar */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>PHASE 0{idx + 1}</span>
                <span className="text-zinc-600">MILESTONE APPROVED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
