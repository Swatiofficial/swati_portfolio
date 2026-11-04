'use client';

import React from 'react';
import { BriefcaseBusiness, GraduationCap, Sparkles } from 'lucide-react';
import { RESUME, SECTION_COPY } from '@/data/projects';

export function Resume() {
  return (
    <section id="resume" className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div id="expertise" className="scroll-mt-24 mb-24">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#D7FF64]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF64]">
                {SECTION_COPY.expertiseLabel}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              {SECTION_COPY.expertiseTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESUME.expertise.map((area) => (
              <article
                key={area.title}
                className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6"
              >
                <h3 className="text-base font-bold text-white mb-4">{area.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {area.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-xs font-mono text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div id="experience" className="scroll-mt-24 mb-24">
          <div className="flex items-center gap-2 mb-3">
            <BriefcaseBusiness className="w-4 h-4 text-[#D7FF64]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF64]">
              {SECTION_COPY.experienceTitle}
            </span>
          </div>
          <div className="mt-8 space-y-5">
            {RESUME.experience.map((job) => (
              <article
                key={`${job.company}-${job.role}`}
                className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.role}</h3>
                    <p className="text-sm text-[#D7FF64] mt-1">{job.company}</p>
                  </div>
                  <span className="w-fit text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                    {job.dates}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {job.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                      <span className="text-[#D7FF64] mt-0.5" aria-hidden="true">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div id="education" className="scroll-mt-24 lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-4 h-4 text-[#D7FF64]" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {SECTION_COPY.educationTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESUME.education.map((item) => (
                <article
                  key={`${item.qualification}-${item.institution}`}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5"
                >
                  <h3 className="text-sm font-bold text-white">{item.qualification}</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.institution}</p>
                  <p className="text-xs font-mono text-[#D7FF64] mt-3">{item.dates}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#D7FF64]" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {SECTION_COPY.achievementsTitle}
              </h2>
            </div>
            <ul className="space-y-3">
              {RESUME.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-sm text-zinc-300 leading-relaxed"
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
