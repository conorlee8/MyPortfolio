'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GameHero from '@/components/GameHero';
import MeshGradient from '@/components/MeshGradient';
import { PathProvider, usePath } from '@/contexts/PathContext';
import { projects, skillGroups, aboutContent } from '@/data/portfolioContent';

function PortfolioContent({ isUnlocked }: { isUnlocked: boolean }) {
  const { getFilteredContent, getPersonalizedConfig, selectedPath } = usePath();

  if (!isUnlocked) return null;

  const config = getPersonalizedConfig();
  const filteredProjects = getFilteredContent(projects);
  const filteredSkillGroups = getFilteredContent(skillGroups);

  const aboutData = selectedPath === 'freelance'
    ? aboutContent.freelance
    : selectedPath === 'fulltime'
    ? aboutContent.fulltime
    : aboutContent.default;

  // Debug logging
  console.log('🎯 Selected Path:', selectedPath);
  console.log('📊 Filtered Projects:', filteredProjects.map(p => ({ title: p.title, type: p.type })));
  console.log('🎨 Theme Accent:', config.themeAccent);

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
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 animate-pulse rounded-full ${selectedPath === 'freelance' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`font-mono text-sm font-semibold ${selectedPath === 'freelance' ? 'text-green-400' : 'text-red-400'}`}>
                {selectedPath === 'freelance' ? '🚀 PROJECT MODE' : '💼 HIRING MODE'}
              </span>
            </div>
            <span className="text-xs text-white/50">
              {selectedPath === 'freelance' ? 'Freelance Portfolio' : 'Employment Portfolio'}
            </span>
          </div>
        </motion.div>
      )}

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

          <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:gap-12 sm:px-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Who I Am
              </h3>
              <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                {aboutData.whoIAm}
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                What I Do
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {aboutData.whatIDo.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-base text-white/70 sm:gap-4 sm:text-lg">
                    <div className={`h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
                    {item}
                  </li>
                ))}
              </ul>
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

      {/* Skills Section - Smart Filtered */}
      <section className="grain relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32">
        <div className="relative z-10">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Skills & Technologies
            </h2>
            <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${config.themeAccent}`}></div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-4">
            {filteredSkillGroups.map((group, i) => (
              <div
                key={i}
                className="glass group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-xl sm:rounded-2xl sm:p-6"
              >
                {/* Accent gradient on hover */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${group.accent} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}></div>

                <h3 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.skills.map((skill, j) => (
                    <li key={j} className="text-sm text-white/70 transition-colors group-hover:text-white/90 sm:text-base">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
            href="mailto:your.email@example.com"
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
              © 2025 Developer Portfolio. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6">
              {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs text-white/50 transition-colors hover:text-white sm:text-sm"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  const [portfolioUnlocked, setPortfolioUnlocked] = useState(false);

  return (
    <PathProvider>
      <main className="relative min-h-screen w-full bg-black">
        {/* Hero Section with Interactive Game */}
        <GameHero onUnlock={() => setPortfolioUnlocked(true)} />

        {/* Portfolio Content - Smart Filtered */}
        <PortfolioContent isUnlocked={portfolioUnlocked} />
      </main>
    </PathProvider>
  );
}
