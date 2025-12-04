'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GameHero from '@/components/GameHero';
import MeshGradient from '@/components/MeshGradient';
import ASCIIPortrait from '@/components/ASCIIPortrait';
import GitHubTerminal from '@/components/GitHubTerminal';
import CareerJourneyTimeline from '@/components/CareerJourneyTimeline';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SkillsShowcase from '@/components/SkillsShowcase';
import ProjectBuilderModal from '@/components/ProjectBuilderModal';
import { PathProvider, usePath } from '@/contexts/PathContext';
import { projects, skillGroups, aboutContent } from '@/data/portfolioContent';

function PortfolioContent({ isUnlocked }: { isUnlocked: boolean }) {
  const { getFilteredContent, getPersonalizedConfig, selectedPath } = usePath();
  const [showProjectModal, setShowProjectModal] = useState(false);

  if (!isUnlocked) return null;

  const config = getPersonalizedConfig();
  const filteredProjects = getFilteredContent(projects);
  const filteredSkillGroups = getFilteredContent(skillGroups);

  const aboutData = selectedPath === 'freelance'
    ? aboutContent.freelance
    : selectedPath === 'fulltime'
    ? aboutContent.fulltime
    : aboutContent.default;

  return (
    <>
      {/* Path Indicator Banner - Very Visible */}
      {selectedPath && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl"
          style={{
            backgroundColor: selectedPath === 'freelance'
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            borderColor: selectedPath === 'freelance'
              ? 'rgba(34, 197, 94, 0.3)'
              : 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:py-3">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 animate-pulse rounded-full ${selectedPath === 'freelance' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`font-mono text-xs sm:text-sm font-semibold ${selectedPath === 'freelance' ? 'text-green-400' : 'text-red-400'}`}>
                {selectedPath === 'freelance' ? '🚀 PROJECT MODE' : '💼 HIRING MODE'}
              </span>
            </div>

            {/* CTA Button in Nav */}
            {selectedPath === 'freelance' ? (
              <button
                onClick={() => setShowProjectModal(true)}
                className="rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-4 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-green-500/25"
              >
                Start Project
              </button>
            ) : (
              <a
                href="#contact"
                className="rounded-full bg-gradient-to-r from-red-500 to-rose-400 px-4 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-red-500/25"
              >
                Schedule Interview
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Project Builder Modal */}
      <ProjectBuilderModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      {/* About Section - Personalized */}
      <section id="about" className="grain relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32">
        <MeshGradient variant="section" />
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Me
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
          </div>

          {/* ASCII Portrait - Centered */}
          <div className="mb-16 flex justify-center px-6 sm:mb-24 sm:px-8">
            <ASCIIPortrait
              src="/headshot.jpeg"
              alt="Developer Profile"
              variant={selectedPath || 'default'}
            />
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:gap-8 sm:px-8 lg:grid-cols-2">
            {/* Who I Am Card */}
            <div className="glass-gradient-button group relative overflow-hidden rounded-2xl p-8 sm:p-10 transition-all hover:shadow-2xl" style={{
              boxShadow: `0 20px 40px -10px ${config.themeAccent === 'from-green-500 to-emerald-400' ? 'rgba(34, 197, 94, 0.15)' : config.themeAccent === 'from-red-500 to-rose-400' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.15)'}`,
            }}>
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Border glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.themeAccent} opacity-20 blur-xl`} />

              <div className="relative space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${config.themeAccent}`} />
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    Who I Am
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                  {aboutData.whoIAm}
                </p>
              </div>
            </div>

            {/* What I Do Card */}
            <div className="glass-gradient-button group relative overflow-hidden rounded-2xl p-8 sm:p-10 transition-all hover:shadow-2xl" style={{
              boxShadow: `0 20px 40px -10px ${config.themeAccent === 'from-green-500 to-emerald-400' ? 'rgba(34, 197, 94, 0.15)' : config.themeAccent === 'from-red-500 to-rose-400' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.15)'}`,
            }}>
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Border glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.themeAccent} opacity-20 blur-xl`} />

              <div className="relative space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${config.themeAccent}`} />
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    What I Do
                  </h3>
                </div>
                <ul className="space-y-4">
                  {aboutData.whatIDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <div className="relative mt-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${config.themeAccent}`} />
                        <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full bg-gradient-to-r ${config.themeAccent} opacity-50 group-hover/item:opacity-100 blur transition-opacity`} />
                      </div>
                      <span className="text-base text-white/80 sm:text-lg group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section - Smart Filtered */}
      <section id="work" className="grain relative overflow-hidden bg-gradient-to-b from-black via-purple-deep/10 to-black py-16 sm:py-24 lg:py-32">
        <MeshGradient variant="section" />
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Featured Work
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
          </div>

          {/* Project Cards Grid - Shows ONLY path-specific projects */}
          <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:gap-8">
            {filteredProjects
              .filter((p) => !selectedPath || p.type === selectedPath || p.type === 'both')
              .slice(0, 3)
              .map((project) => (
              <div
                key={project.id}
                className="glass group overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-2xl sm:rounded-3xl sm:p-6"
                style={{
                  boxShadow: `0 0 0 rgba(0, 0, 0, 0)`,
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const gradient = selectedPath === 'freelance'
                    ? 'rgba(34, 197, 94, 0.2)'
                    : selectedPath === 'fulltime'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(6, 182, 212, 0.2)';
                  e.currentTarget.style.boxShadow = `0 10px 40px ${gradient}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 0, 0, 0)';
                }}
              >
                {/* Project Image/Thumbnail */}
                <div className={`relative mb-4 aspect-video overflow-hidden rounded-xl bg-gradient-to-br sm:mb-6 sm:rounded-2xl ${project.color}`}>
                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

                  {/* Grid pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  ></div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-white/60 sm:text-base">
                  {project.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
                  style={{
                    color: selectedPath === 'freelance'
                      ? 'rgb(34, 197, 94)'
                      : selectedPath === 'fulltime'
                      ? 'rgb(239, 68, 68)'
                      : 'rgb(6, 182, 212)'
                  }}
                >
                  View Project
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Journey Timeline Section */}
      <section id="experience" className="grain relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32">
        <MeshGradient variant="section" />
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Career Journey
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
              From Product Management to Full-Stack Development
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <CareerJourneyTimeline variant={selectedPath || 'default'} />
          </div>
        </div>
      </section>

      {/* GitHub Terminal Section */}
      <section id="github" className="grain relative overflow-hidden bg-gradient-to-b from-black via-purple-deep/10 to-black py-16 sm:py-24 lg:py-32">
        <MeshGradient variant="section" />
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              GitHub Activity
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
              Real-time development activity in terminal format
            </p>
          </div>

          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <GitHubTerminal
              username="conorlee8"
              variant={selectedPath || 'default'}
            />
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section id="testimonials" className="grain relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32">
        <MeshGradient variant="section" />
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Recommendations
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
              What colleagues say about working with me
            </p>
          </div>

          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <TestimonialsCarousel variant={selectedPath || 'default'} />
          </div>
        </div>
      </section>

      {/* Skills Section - Advanced Interactive Showcase */}
      <section className="grain relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32">
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Skills & Technologies
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
              Interactive 3D skill cards with magnetic cursor interaction
            </p>
          </div>

          <SkillsShowcase skillGroups={filteredSkillGroups} variant={selectedPath || 'default'} />
        </div>
      </section>

      {/* Contact Section - Personalized CTA */}
      <section id="contact" className="grain relative overflow-hidden bg-gradient-to-t from-black via-purple-deep/10 to-black py-16 sm:py-24 lg:py-32">
        <MeshGradient variant="hero" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {selectedPath === 'freelance' ? "Let's Build Your Project" : selectedPath === 'fulltime' ? "Let's Talk Opportunities" : "Let's Work Together"}
          </h2>
          <div className={`mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent} sm:mb-8`}></div>

          <p className="mb-8 text-lg leading-relaxed text-white/70 sm:mb-12 sm:text-xl">
            {selectedPath === 'freelance'
              ? "Ready to bring your vision to life? Let's discuss your project requirements and timeline."
              : selectedPath === 'fulltime'
              ? "Interested in adding me to your team? Let's explore how I can contribute to your organization."
              : "Have a project in mind? Let's create something extraordinary together."}
          </p>

          <a
            href="mailto:Conorlee8@gmail.com"
            className={`inline-block rounded-full bg-gradient-to-r ${config.primaryGradient} px-10 py-4 text-base font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:px-12 sm:py-5 sm:text-lg`}
          >
            {config.ctaText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/50 sm:text-sm">
              © 2025 Conor Lee. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <a
                href="https://github.com/conorlee8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 transition-colors hover:text-white sm:text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/conormlee/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 transition-colors hover:text-white sm:text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FixedVideoBackground() {
  const { selectedPath } = usePath();

  // No video for browse/neutral mode
  if (!selectedPath) return null;

  const videoConfig = {
    freelance: {
      src: '/videos/cyberpunk-city.mp4',
      tintFrom: 'from-green-900/30',
      tintVia: 'via-black/50',
      tintTo: 'to-black/80',
      overlay: 'bg-green-500/5',
    },
    fulltime: {
      src: '/videos/hire-mode.mp4',
      tintFrom: 'from-red-900/30',
      tintVia: 'via-black/50',
      tintTo: 'to-black/80',
      overlay: 'bg-red-500/5',
    },
  };

  const config = videoConfig[selectedPath];
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
        style={{ filter: 'brightness(0.4) saturate(1.2)' }}
      >
        <source src={config.src} type="video/mp4" />
      </video>
      {/* Themed tint overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${config.tintFrom} ${config.tintVia} ${config.tintTo} pointer-events-none`} />
      <div className={`absolute inset-0 ${config.overlay} mix-blend-overlay pointer-events-none`} />
    </div>
  );
}

export default function Home() {
  const [portfolioUnlocked, setPortfolioUnlocked] = useState(false);

  return (
    <PathProvider>
      <main className="relative min-h-screen w-full bg-black">
        {/* Fixed Video Background for Freelance - stays pinned while scrolling */}
        <FixedVideoBackground />

        {/* Hero Section with Interactive Game */}
        <GameHero onUnlock={() => setPortfolioUnlocked(true)} />

        {/* Portfolio Content - Smart Filtered */}
        <PortfolioContent isUnlocked={portfolioUnlocked} />
      </main>
    </PathProvider>
  );
}
