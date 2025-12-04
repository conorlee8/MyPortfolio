'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  type: 'pm' | 'dev' | 'hybrid';
  description: string;
  achievements: string[];
  skills: string[];
  color: string;
  logo: string;
}

interface CareerJourneyTimelineProps {
  variant?: 'freelance' | 'fulltime' | 'default';
}

export default function CareerJourneyTimeline({ variant = 'default' }: CareerJourneyTimelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Variant colors
  const variantColors = {
    freelance: {
      primary: '#22c55e',
      secondary: '#10b981',
      text: 'text-green-400',
      bg: 'bg-green-500',
    },
    fulltime: {
      primary: '#ef4444',
      secondary: '#dc2626',
      text: 'text-red-400',
      bg: 'bg-red-500',
    },
    default: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500',
    },
  };

  const colors = variantColors[variant];

  const experiences: Experience[] = [
    {
      id: '4',
      company: 'REEF Technology',
      role: 'Launch Manager - Texas Operations',
      location: 'Texas',
      startDate: 'Jan 2020',
      endDate: 'Apr 2021',
      type: 'pm',
      description: 'Led 50+ operational launches with focus on technical system implementations during pandemic conditions.',
      achievements: [
        'Analyzed data using SQL and Excel for workflow optimization',
        'Onboarded and trained 250+ employees',
        'Improved deployment efficiency by 25% quarter-over-quarter',
        'Collaborated with tech teams on system integration',
      ],
      skills: ['Operations', 'SQL', 'Data Analysis', 'Training', 'System Integration'],
      color: '#8b5cf6',
      logo: '/reeftechnology_logo.jpg',
    },
    {
      id: '3',
      company: 'REEF Technology',
      role: 'Project Manager - Wendy\'s Partnership',
      location: 'Miami, FL',
      startDate: 'Apr 2021',
      endDate: 'Aug 2022',
      type: 'pm',
      description: 'Executed complex technology implementations across 100+ franchise locations with 96% SLA compliance.',
      achievements: [
        'Coordinated between franchisees, vendors, and technical teams',
        'Gathered requirements and created development specifications',
        'Partnered with engineering on technical feasibility',
        'Achieved 95% customer satisfaction rate',
      ],
      skills: ['Project Management', 'Technical Requirements', 'Vendor Coordination', 'Implementation', 'Training'],
      color: '#8b5cf6',
      logo: '/reeftechnology_logo.jpg',
    },
    {
      id: '2',
      company: 'UFODrive',
      role: 'Launch Manager',
      location: 'United States',
      startDate: 'Aug 2022',
      endDate: 'Jul 2024',
      type: 'pm',
      description: 'Orchestrated 25+ SaaS deployments with technical configurations including API integrations and database migrations.',
      achievements: [
        'Wrote SQL queries for data analysis and platform metrics',
        'Participated in sprint planning and code reviews',
        'Reduced launch preparation time by 30%',
        'Troubleshot technical issues with development team',
      ],
      skills: ['Launch Management', 'SQL', 'API Integrations', 'Agile/Scrum', 'Technical Documentation'],
      color: colors.primary,
      logo: '/ufodrivelogo.png',
    },
    {
      id: '1',
      company: 'UFODrive',
      role: 'Product Manager - Client Enablement',
      location: 'Luxembourg/Remote',
      startDate: 'Aug 2023',
      endDate: 'Jun 2025',
      type: 'pm',
      description: 'Led 75+ SaaS deployments with 98% on-time delivery. Reduced implementation timeline by 20% through redesigned workflows.',
      achievements: [
        'Managed 40+ concurrent customer deployments globally',
        'Built scalable implementation frameworks across 15+ markets',
        'Created JavaScript automation tools for workflow processes',
        '98% on-time delivery rate for platform deployments',
      ],
      skills: ['Product Management', 'SaaS Deployments', 'JavaScript', 'API Integrations', 'Process Automation'],
      color: colors.primary,
      logo: '/ufodrivelogo.png',
    },
    {
      id: '5',
      company: 'UT Austin Full-Stack Bootcamp',
      role: 'Full-Stack Development Certificate',
      location: 'Austin, TX',
      startDate: 'Aug 2024',
      endDate: 'Jan 2025',
      type: 'hybrid',
      description: 'Intensive bootcamp covering modern web development with focus on React, Node.js, and full-stack architecture.',
      achievements: [
        'Built end-to-end applications from conception to deployment',
        'Mastered React, Node.js, Express, MongoDB, MySQL',
        'Implemented RESTful APIs and authentication systems',
        'Completed while maintaining full-time PM role',
      ],
      skills: ['React', 'Node.js', 'MongoDB', 'MySQL', 'RESTful APIs', 'Git', 'Docker'],
      color: colors.secondary,
      logo: '/University_of_Texas_at_Austin_seal.svg.png',
    },
  ];

  const selectedExperience = experiences.find(exp => exp.id === selectedId);

  // Mouse position tracking for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  return (
    <div className="relative" ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Timeline Container */}
      <div className="relative overflow-x-auto pb-8 scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="flex min-w-max items-center gap-4 sm:gap-6 lg:gap-8 px-4 lg:justify-center lg:min-w-full">
          {experiences.map((exp, index) => {
            // Magnetic interaction component wrapper (disabled on mobile for performance)
            const MagneticNode = ({ children }: { children: React.ReactNode }) => {
              const ref = useRef<HTMLDivElement>(null);
              const x = useMotionValue(0);
              const y = useMotionValue(0);
              const [isMobile, setIsMobile] = React.useState(false);

              React.useEffect(() => {
                setIsMobile(window.innerWidth < 768);
                const handleResize = () => setIsMobile(window.innerWidth < 768);
                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
              }, []);

              const springConfig = { damping: 15, stiffness: 150 };
              const xSpring = useSpring(x, springConfig);
              const ySpring = useSpring(y, springConfig);

              React.useEffect(() => {
                if (isMobile) return; // Disable magnetic effect on mobile

                const unsubscribeX = mouseX.on('change', (latest) => {
                  if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(
                      Math.pow(latest - centerX, 2) + Math.pow(mouseY.get() - centerY, 2)
                    );
                    const magneticRange = 200;
                    if (distance < magneticRange) {
                      const strength = (1 - distance / magneticRange) * 15;
                      x.set((latest - centerX) * strength * 0.01);
                      y.set((mouseY.get() - centerY) * strength * 0.01);
                    } else {
                      x.set(0);
                      y.set(0);
                    }
                  }
                });

                const unsubscribeY = mouseY.on('change', (latest) => {
                  if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(
                      Math.pow(mouseX.get() - centerX, 2) + Math.pow(latest - centerY, 2)
                    );
                    const magneticRange = 200;
                    if (distance < magneticRange) {
                      const strength = (1 - distance / magneticRange) * 15;
                      x.set((mouseX.get() - centerX) * strength * 0.01);
                      y.set((latest - centerY) * strength * 0.01);
                    } else {
                      x.set(0);
                      y.set(0);
                    }
                  }
                });

                return () => {
                  unsubscribeX();
                  unsubscribeY();
                };
              }, [isMobile]);

              return (
                <motion.div ref={ref} style={{ x: xSpring, y: ySpring }}>
                  {children}
                </motion.div>
              );
            };

            return (
            <div key={exp.id} className="relative flex items-center">
              {/* Timeline Node */}
              <MagneticNode>
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Role Title */}
                <div className="mb-2 max-w-[120px] sm:max-w-[160px] lg:max-w-[180px] text-center">
                  <div className="text-xs sm:text-sm font-semibold text-white/90 leading-tight">
                    {exp.role}
                  </div>
                </div>

                {/* Date Label */}
                <div className="mb-3 sm:mb-4 whitespace-nowrap text-center">
                  <div className="text-[10px] sm:text-xs text-white/60">{exp.startDate}</div>
                  {exp.endDate !== exp.startDate && (
                    <div className="text-[10px] sm:text-xs text-white/40">to {exp.endDate}</div>
                  )}
                </div>

                {/* Node Circle */}
                <motion.button
                  onClick={() => setSelectedId(exp.id === selectedId ? null : exp.id)}
                  className="group relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-50"
                    style={{
                      background: `radial-gradient(circle, ${exp.color} 0%, transparent 70%)`,
                      filter: 'blur(15px)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Main circle with holographic effect */}
                  <div
                    className={`group/circle relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-3 sm:border-4 transition-all overflow-hidden ${
                      selectedId === exp.id ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      backgroundColor: exp.color,
                      borderColor: selectedId === exp.id ? '#ffffff' : exp.color,
                      boxShadow: `0 0 30px ${exp.color}66`,
                    }}
                  >
                    {/* Holographic shimmer overlay */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover/circle:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,0,255,0.3) 0%, rgba(0,255,255,0.3) 25%, rgba(255,255,0,0.3) 50%, rgba(0,255,0,0.3) 75%, rgba(255,0,255,0.3) 100%)',
                        backgroundSize: '200% 200%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    {/* Logo in circle */}
                    <div className="relative flex h-full w-full items-center justify-center p-1">
                      <div className="relative w-full h-full">
                        <Image
                          src={exp.logo}
                          alt={exp.company}
                          fill
                          className="object-cover rounded-full"
                          style={{
                            filter: 'brightness(1.1) contrast(1.1)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Company Label */}
                <div className="mt-3 sm:mt-4 w-24 sm:w-32 text-center">
                  <div className="truncate text-xs sm:text-sm font-medium text-white">{exp.company}</div>
                  <div className="text-[10px] sm:text-xs text-white/50">{exp.location}</div>
                </div>
              </motion.div>
              </MagneticNode>

              {/* Connecting Line */}
              {index < experiences.length - 1 && (
                <motion.div
                  className="h-0.5 sm:h-1 w-12 sm:w-16 lg:w-24"
                  style={{
                    background: `linear-gradient(to right, ${exp.color}, ${experiences[index + 1].color})`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              )}
            </div>
            );
          })}
        </div>

        {/* Scroll Hint for Mobile */}
        <div className="mt-4 sm:mt-6 text-center text-xs text-white/40 lg:hidden">
          <span className={colors.text}>← Swipe to explore →</span>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 sm:mt-8 text-center text-xs text-white/40 hidden lg:block">
          <span className={colors.text}>←</span> Product Management Journey → Full-Stack Development <span className={colors.text}>→</span>
        </div>
      </div>

      {/* Detail Card with Holographic Effect */}
      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <div className="glass-gradient-button rounded-xl p-6 relative overflow-hidden group/card">
              {/* Holographic shimmer background */}
              <motion.div
                className="absolute inset-0 opacity-20 group-hover/card:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, rgba(255,0,255,0.2) 0%, rgba(0,255,255,0.2) 20%, rgba(255,255,0,0.2) 40%, rgba(0,255,0,0.2) 60%, rgba(0,0,255,0.2) 80%, rgba(255,0,255,0.2) 100%)',
                  backgroundSize: '400% 400%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Glassmorphic noise texture */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Content with relative positioning */}
              <div className="relative z-10">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedExperience.role}</h3>
                  <p className="text-white/70">
                    {selectedExperience.company} • {selectedExperience.location}
                  </p>
                  <p className="text-sm text-white/50">
                    {selectedExperience.startDate} - {selectedExperience.endDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-white/50 transition-colors hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="mb-4 text-white/80">{selectedExperience.description}</p>

              {/* Key Achievements */}
              <div className="mb-4">
                <h4 className={`mb-2 font-semibold ${colors.text}`}>Key Achievements:</h4>
                <ul className="space-y-2">
                  {selectedExperience.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className={colors.text}>▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h4 className={`mb-2 font-semibold ${colors.text}`}>Skills & Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExperience.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${colors.text}`}
                      style={{
                        backgroundColor: `${selectedExperience.color}22`,
                        borderColor: `${selectedExperience.color}66`,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <div className="glass-button rounded-lg p-4 text-center">
          <div className={`text-3xl font-bold ${colors.text}`}>75+</div>
          <div className="text-xs text-white/50">SaaS Deployments</div>
        </div>
        <div className="glass-button rounded-lg p-4 text-center">
          <div className={`text-3xl font-bold ${colors.text}`}>98%</div>
          <div className="text-xs text-white/50">On-Time Delivery</div>
        </div>
        <div className="glass-button rounded-lg p-4 text-center">
          <div className={`text-3xl font-bold ${colors.text}`}>250+</div>
          <div className="text-xs text-white/50">People Trained</div>
        </div>
        <div className="glass-button rounded-lg p-4 text-center">
          <div className={`text-3xl font-bold ${colors.text}`}>5+</div>
          <div className="text-xs text-white/50">Years Experience</div>
        </div>
      </motion.div>
    </div>
  );
}
