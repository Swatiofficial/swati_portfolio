'use client';

import React from 'react';
import { SECTION_COPY, TOOLKIT } from '@/data/projects';
import { Cpu, Film, Palette, Sparkles, Image as ImageIcon, Box, Scissors, PenTool } from 'lucide-react';

export function EditingToolkit() {
  // Only display tools configured as enabled
  const activeTools = TOOLKIT.filter((tool) => tool.enabled);

  const getToolIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'davinci resolve':
        return <Palette className="w-5 h-5 text-amber-400" />;
      case 'adobe premiere pro':
        return <Film className="w-5 h-5 text-purple-400" />;
      case 'after effects':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'photoshop':
        return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case 'illustrator':
        return <PenTool className="w-5 h-5 text-orange-400" />;
      case 'blender':
        return <Box className="w-5 h-5 text-orange-500" />;
      case 'final cut pro':
        return <Scissors className="w-5 h-5 text-cyan-400" />;
      default:
        return <Cpu className="w-5 h-5 text-[#D7FF64]" />;
    }
  };

  return (
    <section id="toolkit" className="relative py-28 sm:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#D7FF64]" />
            <span className="text-xs font-mono tracking-widest text-[#D7FF64] uppercase">
              Creative Toolkit
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            {SECTION_COPY.toolkitTitle}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            Design, video, productivity, and AI tools used across creative content workflows.
          </p>
        </div>

        {/* Toolkit Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeTools.map((tool) => (
            <div
              key={tool.name}
              className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/60 hover:border-white/30 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getToolIcon(tool.name)}
                </div>
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                  {tool.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D7FF64] transition-colors">
                  {tool.name}
                </h3>
                <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
                  {tool.level ?? tool.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
