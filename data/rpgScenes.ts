export interface Choice {
  text: string;
  nextScene: string;
  xp?: number;
  personality?: 'curious' | 'direct' | 'creative' | 'analytical';
}

export interface Scene {
  id: string;
  question: string; // Single question, no typing animation
  choices: Choice[];
  progress?: number; // 1, 2, 3, etc
  totalSteps?: number; // Total questions in path
}

export const rpgScenes: Record<string, Scene> = {
  start: {
    id: 'start',
    question: 'What brings you here today?',
    progress: 0,
    totalSteps: 0,
    choices: [
      {
        text: 'I need a project built',
        nextScene: 'client_q1',
        xp: 10,
        personality: 'creative',
      },
      {
        text: "I'm looking to hire someone",
        nextScene: 'employer_q1',
        xp: 10,
        personality: 'analytical',
      },
      {
        text: 'Just exploring',
        nextScene: 'explorer_path',
        xp: 10,
        personality: 'curious',
      },
    ],
  },

  // CLIENT PATH
  client_q1: {
    id: 'client_q1',
    question: 'What kind of project are we talking about?',
    progress: 1,
    totalSteps: 3,
    choices: [
      {
        text: 'Brand new website or landing page',
        nextScene: 'client_q2',
        xp: 15,
        personality: 'creative',
      },
      {
        text: 'Web app with custom features',
        nextScene: 'client_q2',
        xp: 15,
        personality: 'analytical',
      },
      {
        text: 'Refresh or update existing site',
        nextScene: 'client_q2',
        xp: 15,
        personality: 'direct',
      },
    ],
  },

  client_q2: {
    id: 'client_q2',
    question: "What's your top priority?",
    progress: 2,
    totalSteps: 3,
    choices: [
      {
        text: 'Speed - I need it done fast',
        nextScene: 'client_match',
        xp: 20,
        personality: 'direct',
      },
      {
        text: 'Design - make it look incredible',
        nextScene: 'client_match',
        xp: 20,
        personality: 'creative',
      },
      {
        text: 'Budget - keep costs reasonable',
        nextScene: 'client_match',
        xp: 20,
        personality: 'curious',
      },
      {
        text: 'Quality - clean, maintainable code',
        nextScene: 'client_match',
        xp: 20,
        personality: 'analytical',
      },
    ],
  },

  client_match: {
    id: 'client_match',
    question: "Here's what I bring to the table: Fast delivery with modern tools, AI-enhanced workflows for efficiency, and transparent communication throughout. Ready to see what I've built?",
    progress: 3,
    totalSteps: 3,
    choices: [
      {
        text: "Let's see your work",
        nextScene: 'unlock',
        xp: 25,
      },
    ],
  },

  // EMPLOYER PATH
  employer_q1: {
    id: 'employer_q1',
    question: 'Looking for a full-time developer or exploring options?',
    progress: 1,
    totalSteps: 3,
    choices: [
      {
        text: 'Full-time position',
        nextScene: 'employer_q2',
        xp: 15,
        personality: 'direct',
      },
      {
        text: 'Contract or freelance work',
        nextScene: 'employer_q2',
        xp: 15,
        personality: 'analytical',
      },
      {
        text: 'Just seeing what\'s out there',
        nextScene: 'employer_q2',
        xp: 15,
        personality: 'curious',
      },
    ],
  },

  employer_q2: {
    id: 'employer_q2',
    question: 'How does your team move?',
    progress: 2,
    totalSteps: 3,
    choices: [
      {
        text: 'Fast-paced, ship and learn',
        nextScene: 'employer_match',
        xp: 20,
        personality: 'direct',
      },
      {
        text: 'Collaborative, lots of pairing',
        nextScene: 'employer_match',
        xp: 20,
        personality: 'creative',
      },
      {
        text: 'Async-first, documentation matters',
        nextScene: 'employer_match',
        xp: 20,
        personality: 'analytical',
      },
      {
        text: 'Flexible, we figure it out',
        nextScene: 'employer_match',
        xp: 20,
        personality: 'curious',
      },
    ],
  },

  employer_match: {
    id: 'employer_match',
    question: "I think we'd click. Here's my approach: Modern React/Next.js stack, AI tools to move faster, clear communication, and I leave my ego at the door. Want to see what I've shipped?",
    progress: 3,
    totalSteps: 3,
    choices: [
      {
        text: 'Show me your work',
        nextScene: 'unlock',
        xp: 25,
      },
    ],
  },

  explorer_path: {
    id: 'explorer_path',
    question: "Just checking things out? That's cool. Feel free to explore.",
    progress: 1,
    totalSteps: 1,
    choices: [
      {
        text: "Show me what you've got",
        nextScene: 'unlock',
        xp: 15,
      },
    ],
  },

  unlock: {
    id: 'unlock',
    question: 'Access Granted. Welcome to the portfolio.',
    choices: [],
  },
};
