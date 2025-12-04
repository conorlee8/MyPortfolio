export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  tags: string[];
  relevance: {
    freelance: number;
    fulltime: number;
  };
  type: 'freelance' | 'fulltime' | 'both';
}

export interface Skill {
  name: string;
  tags: string[];
  relevance: {
    freelance: number;
    fulltime: number;
  };
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
  accent: string;
  tags: string[];
  relevance: {
    freelance: number;
    fulltime: number;
  };
}

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with payment integration, built for a startup client',
    color: 'from-green-500/30 to-emerald-400/30',
    tags: ['freelance', 'client', 'project', 'e-commerce', 'startup'],
    relevance: { freelance: 2.0, fulltime: 1.0 },
    type: 'freelance',
  },
  {
    id: 'proj-2',
    title: 'Enterprise Dashboard',
    description: 'Complex analytics platform built with team collaboration and Agile methodology',
    color: 'from-red-500/30 to-rose-400/30',
    tags: ['fulltime', 'team', 'enterprise', 'analytics', 'agile'],
    relevance: { freelance: 0.8, fulltime: 2.0 },
    type: 'fulltime',
  },
  {
    id: 'proj-3',
    title: 'Interactive 3D Portfolio',
    description: 'Immersive web experience showcasing Three.js and WebGL capabilities',
    color: 'from-cyan-bright/30 to-electric-purple/30',
    tags: ['freelance', 'creative', '3d', 'webgl', 'interactive'],
    relevance: { freelance: 1.8, fulltime: 1.2 },
    type: 'freelance',
  },
  {
    id: 'proj-4',
    title: 'SaaS Product Platform',
    description: 'Multi-tenant application with role-based access and real-time features',
    color: 'from-purple-500/30 to-indigo-400/30',
    tags: ['fulltime', 'saas', 'team', 'architecture', 'scalability'],
    relevance: { freelance: 1.0, fulltime: 2.0 },
    type: 'fulltime',
  },
  {
    id: 'proj-5',
    title: 'Marketing Website',
    description: 'Fast, SEO-optimized landing pages for multiple client campaigns',
    color: 'from-pink-500/30 to-rose-400/30',
    tags: ['freelance', 'client', 'marketing', 'seo', 'quick-turnaround'],
    relevance: { freelance: 2.0, fulltime: 0.5 },
    type: 'freelance',
  },
  {
    id: 'proj-6',
    title: 'Design System Library',
    description: 'Comprehensive component library for company-wide design consistency',
    color: 'from-blue-500/30 to-cyan-400/30',
    tags: ['fulltime', 'team', 'design-system', 'components', 'collaboration'],
    relevance: { freelance: 0.7, fulltime: 2.0 },
    type: 'fulltime',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'React', tags: ['frontend', 'ui'], relevance: { freelance: 2.0, fulltime: 2.0 } },
      { name: 'Next.js', tags: ['frontend', 'ssr'], relevance: { freelance: 2.0, fulltime: 1.8 } },
      { name: 'TypeScript', tags: ['frontend', 'type-safety'], relevance: { freelance: 1.8, fulltime: 2.0 } },
      { name: 'Tailwind CSS', tags: ['frontend', 'styling'], relevance: { freelance: 2.0, fulltime: 1.5 } },
    ],
    accent: 'from-green-500/20',
    tags: ['frontend', 'ui', 'client-side'],
    relevance: { freelance: 2.0, fulltime: 1.8 },
  },
  {
    category: '3D & Animation',
    skills: [
      { name: 'Three.js', tags: ['3d', 'webgl'], relevance: { freelance: 2.0, fulltime: 1.2 } },
      { name: 'React Three Fiber', tags: ['3d', 'react'], relevance: { freelance: 1.8, fulltime: 1.0 } },
      { name: 'GSAP', tags: ['animation'], relevance: { freelance: 1.8, fulltime: 1.2 } },
      { name: 'WebGL Shaders', tags: ['3d', 'graphics'], relevance: { freelance: 1.5, fulltime: 0.8 } },
    ],
    accent: 'from-cyan-500/20',
    tags: ['3d', 'creative', 'interactive'],
    relevance: { freelance: 1.8, fulltime: 1.0 },
  },
  {
    category: 'Backend & Architecture',
    skills: [
      { name: 'Node.js', tags: ['backend', 'server'], relevance: { freelance: 1.5, fulltime: 2.0 } },
      { name: 'System Design', tags: ['architecture', 'scalability'], relevance: { freelance: 1.0, fulltime: 2.0 } },
      { name: 'PostgreSQL', tags: ['database'], relevance: { freelance: 1.3, fulltime: 2.0 } },
      { name: 'Redis', tags: ['caching', 'performance'], relevance: { freelance: 1.0, fulltime: 1.8 } },
    ],
    accent: 'from-red-500/20',
    tags: ['backend', 'architecture', 'scalability'],
    relevance: { freelance: 1.2, fulltime: 2.0 },
  },
  {
    category: 'Collaboration & Process',
    skills: [
      { name: 'Git & GitHub', tags: ['version-control'], relevance: { freelance: 1.8, fulltime: 2.0 } },
      { name: 'Agile/Scrum', tags: ['process', 'team'], relevance: { freelance: 0.8, fulltime: 2.0 } },
      { name: 'Code Review', tags: ['quality', 'team'], relevance: { freelance: 1.0, fulltime: 2.0 } },
      { name: 'Mentorship', tags: ['leadership', 'team'], relevance: { freelance: 0.5, fulltime: 2.0 } },
    ],
    accent: 'from-purple-500/20',
    tags: ['collaboration', 'team', 'process'],
    relevance: { freelance: 1.0, fulltime: 2.0 },
  },
];

export const aboutContent = {
  freelance: {
    whoIAm: `Product Manager turned Full-Stack Developer who brings 5+ years of bridging business and technical teams. Led 75+ SaaS deployments at UFODrive and REEF Technology, managing implementations from requirements to launch. Completed UT Austin's Full-Stack program, now building end-to-end applications that combine product strategy with hands-on development.`,
    whatIDo: [
      'Full-stack development (React, Node.js, MongoDB)',
      'SaaS platform deployments & integrations',
      'Custom web applications with CI/CD pipelines',
      'Product strategy & technical implementations',
      'Process automation & workflow optimization',
      'Client communication & project delivery',
    ],
  },
  fulltime: {
    whoIAm: `Product Manager with proven track record leading 75+ SaaS deployments and recently completed UT Austin's Full-Stack Web Development program. Experienced in bridging technical requirements between customers and engineering teams, ensuring 98% on-time delivery. Now bringing both product management expertise and hands-on development skills to build scalable, maintainable systems.`,
    whatIDo: [
      'Full-stack development (React, TypeScript, Node.js)',
      'Product management & stakeholder alignment',
      'Cross-functional team leadership',
      'Technical documentation & training materials',
      'Agile/Scrum methodologies & sprint planning',
      'API integrations & database architecture',
    ],
  },
  default: {
    whoIAm: `Product Manager turned Full-Stack Developer with 5+ years bridging business and technical teams. Led 75+ SaaS deployments across enterprise accounts, managing implementations from requirements gathering to production launch. Recently completed UT Austin's Full-Stack program, now building end-to-end applications combining product strategy with hands-on development.`,
    whatIDo: [
      'Full-stack development (React, Node.js, MongoDB, MySQL)',
      'Product management & technical implementations',
      'SaaS platform deployments & API integrations',
      'Cross-functional team leadership & stakeholder management',
      'Process automation & workflow optimization',
      'Technical documentation & training materials',
    ],
  },
};
