'use client';

import React, { useState } from 'react';
import { SECTION_COPY, SITE_CONFIG, SERVICES } from '@/data/projects';
import { BUDGET_OPTIONS, DEFAULT_BUDGET, RECIPIENT_EMAIL } from '@/lib/contact';
import { Mail, MessageSquare, Phone, Send, CheckCircle2, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';

interface ContactProps {
  preselectedService?: string;
}

export function Contact({ preselectedService }: ContactProps) {
  const [customService, setCustomService] = useState<string | null>(null);
  const activeService = customService ?? preselectedService ?? SERVICES[0]?.title ?? 'General Inquiry';

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    budgetRange: string;
    description: string;
    botField: string;
  }>({
    name: '',
    email: '',
    budgetRange: DEFAULT_BUDGET,
    description: '',
    botField: '', // Honeypot field for bot suppression
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'unconfigured'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot check
    if (formData.botField) {
      return;
    }

    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      setStatus('error');
      setFeedbackMessage('Please fill in your name, email, and project scope.');
      return;
    }

    // Strict client-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setFeedbackMessage('Please provide a valid email address.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          projectType: activeService,
          budgetRange: formData.budgetRange,
          description: formData.description.trim(),
          botField: formData.botField,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('success');
        setFeedbackMessage('Your project brief has been sent successfully. I’ll get back to you soon.');
        // Clear form only upon confirmed delivery
        setFormData({
          name: '',
          email: '',
          budgetRange: DEFAULT_BUDGET,
          description: '',
          botField: '',
        });
        setCustomService(null);
      } else if (response.status === 503 || data.code === 'UNCONFIGURED') {
        setStatus('unconfigured');
        setFeedbackMessage(
          data.error ||
            'Email delivery service is not configured yet. Please configure RESEND_API_KEY in .env.local.'
        );
      } else {
        setStatus('error');
        setFeedbackMessage(
          data.error || 'Unable to send project brief right now. Please try again or reach out directly.'
        );
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('Network connection error. Please verify your connection and try again.');
    }
  };

  // Filter valid social links
  const activeSocials = SITE_CONFIG.socialLinks.filter((s) => s.url && s.url.trim() !== '');

  const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    `New Project Inquiry: ${activeService} – ${formData.name || 'Client'}`
  )}&body=${encodeURIComponent(
    `Hi ${SITE_CONFIG.ownerName},\n\nName: ${formData.name || '[Your Name]'}\nEmail: ${formData.email || '[Your Email]'}\nProject Type: ${activeService}\nBudget Range: ${formData.budgetRange}\n\nProject Scope & Vision:\n${formData.description}`
  )}`;

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Headline, Copy, and Direct Links */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                <MessageSquare className="w-3.5 h-3.5 text-[#D7FF64]" />
                <span className="text-xs font-mono tracking-widest text-[#D7FF64] uppercase">
                  Start a Collaboration
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] mb-4">
                {SECTION_COPY.contactTitle}
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed mb-8">
                {SECTION_COPY.contactDescription}
              </p>

              {/* Direct Reach-Out Cards */}
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-zinc-950/60 hover:border-[#D7FF64]/40 hover:bg-zinc-900/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[#D7FF64]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-zinc-500 uppercase">Direct Email</span>
                      <p className="text-sm font-semibold text-white group-hover:text-[#D7FF64] transition-colors">
                        {SITE_CONFIG.contactEmail}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#D7FF64] transition-colors" />
                </a>
                {SITE_CONFIG.contactPhone && (
                  <a
                    href={`tel:${SITE_CONFIG.contactPhone}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-zinc-950/60 hover:border-[#D7FF64]/40 hover:bg-zinc-900/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[#D7FF64]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-zinc-500 uppercase">Phone</span>
                        <p className="text-sm font-semibold text-white group-hover:text-[#D7FF64] transition-colors">
                          {SITE_CONFIG.contactPhone}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#D7FF64] transition-colors" />
                  </a>
                )}
              </div>
            </div>

            {/* Social Links */}
            {activeSocials.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                  Connect &amp; Follow
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-zinc-300 hover:text-black hover:bg-[#D7FF64] bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                    >
                      <span>{link.platform}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl relative">
              {/* Notice Banner if backend is unconfigured */}
              {status === 'unconfigured' && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Email Service Setup Required</span>
                  </div>
                  <p className="leading-relaxed text-zinc-300">
                    {feedbackMessage}
                  </p>
                  <div className="pt-2">
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs hover:bg-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Direct via Mail App</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-2xl bg-[#D7FF64]/10 border border-[#D7FF64]/30 text-white text-xs flex items-center gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#D7FF64] shrink-0" />
                  <p className="font-medium text-[#D7FF64] leading-relaxed">{feedbackMessage}</p>
                </div>
              )}

              {/* Error Banner */}
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-3 animate-in fade-in duration-300">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="leading-relaxed">{feedbackMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Honeypot field (hidden from real users to trap spam bots) */}
                <input
                  type="text"
                  name="_honey"
                  value={formData.botField}
                  onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      disabled={status === 'loading'}
                      placeholder="Jane Doe / Brand Producer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#D7FF64] focus:ring-1 focus:ring-[#D7FF64] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      disabled={status === 'loading'}
                      placeholder="producer@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#D7FF64] focus:ring-1 focus:ring-[#D7FF64] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Project Type Select */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="projectType" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      value={activeService}
                      disabled={status === 'loading'}
                      onChange={(e) => setCustomService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D7FF64] focus:ring-1 focus:ring-[#D7FF64] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title} className="bg-zinc-900 text-white">
                          {s.title}
                        </option>
                      ))}
                      <option value="Other / Multi-Service" className="bg-zinc-900 text-white">
                        Other / Multi-Service
                      </option>
                    </select>
                  </div>

                  {/* Budget Range Select (INR) */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="budgetRange" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Budget Range (INR ₹)
                    </label>
                    <select
                      id="budgetRange"
                      value={formData.budgetRange}
                      disabled={status === 'loading'}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D7FF64] focus:ring-1 focus:ring-[#D7FF64] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {BUDGET_OPTIONS.map((range) => (
                        <option key={range} value={range} className="bg-zinc-900 text-white">
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Scope & Vision */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Project Scope &amp; Vision *
                  </label>
                  <textarea
                    id="description"
                    required
                    disabled={status === 'loading'}
                    rows={4}
                    placeholder="Tell me about your vision, raw footage volume, timeline, target platform, pacing, or reference films..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#D7FF64] focus:ring-1 focus:ring-[#D7FF64] disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-full bg-white text-black hover:bg-[#D7FF64] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Sending Transmission...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <span className="text-[11px] font-mono text-zinc-500">
                    * Response typically within 24 hours &bull; Max budget: ₹25,000
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
