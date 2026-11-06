'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SelectedWork } from '@/components/SelectedWork';
import { Graphics } from '@/components/Graphics';
import { Showreel } from '@/components/Showreel';
import { About } from '@/components/About';
import { Resume } from '@/components/Resume';
import { Services } from '@/components/Services';
import { EditingToolkit } from '@/components/EditingToolkit';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { VideoModal } from '@/components/VideoModal';
import { Project, SERVICES } from '@/data/projects';

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>(
    SERVICES[0]?.title ?? 'General Inquiry'
  );

  const handleOpenProjectModal = (project: Project) => {
    setActiveProject(project);
    setIsModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectService = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
  };

  return (
    <main className="min-h-screen bg-black text-[#F5F5F5] flex flex-col relative selection:bg-[#D7FF64] selection:text-black">
      {/* Navigation */}
      <Navbar
        onOpenContact={() => {
          const contact = document.querySelector('#contact');
          contact?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section - With integrated large player and 4-card slider */}
      <Hero />

      {/* Selected Work Portfolio Grid with Filter System */}
      <SelectedWork onSelectProject={handleOpenProjectModal} />

      {/* Graphic design collections */}
      <Graphics />

      {/* Official 60s Showreel Player */}
      <Showreel />

      {/* Profile summary */}
      <About />

      {/* Resume details */}
      <Resume />

      {/* Creative capabilities */}
      <Services onSelectService={handleSelectService} />

      {/* Resume tools and platforms */}
      <EditingToolkit />

      {/* Contact Form & Collaboration Channel */}
      <Contact preselectedService={preselectedService} />

      {/* Footer */}
      <Footer />

      {/* Accessible Universal Video Player Dialog */}
      <VideoModal
        key={activeProject?.id}
        project={activeProject}
        isOpen={isModalOpen}
        onClose={handleCloseProjectModal}
      />
    </main>
  );
}
