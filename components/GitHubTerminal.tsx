'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GitHubTerminalProps {
  username: string;
  variant?: 'freelance' | 'fulltime' | 'default';
}

interface GitHubStats {
  totalRepos: number;
  totalCommits: number;
  languages: string[];
  followers: number;
  following: number;
  bio: string;
  avatar: string;
  recentActivity: string[];
}

export default function GitHubTerminal({ username, variant = 'default' }: GitHubTerminalProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Variant colors
  const variantColors = {
    freelance: {
      primary: '#22c55e',
      secondary: '#10b981',
      text: 'text-green-400',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/50',
    },
    fulltime: {
      primary: '#ef4444',
      secondary: '#dc2626',
      text: 'text-red-400',
      border: 'border-red-400/30',
      glow: 'shadow-red-500/50',
    },
    default: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      text: 'text-cyan-400',
      border: 'border-cyan-400/30',
      glow: 'shadow-cyan-500/50',
    },
  };

  const colors = variantColors[variant];

  // Fetch GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);

        if (userResponse.ok && reposResponse.ok) {
          const userData = await userResponse.json();
          const reposData = await reposResponse.json();

          const languages = new Set<string>();
          reposData.forEach((repo: any) => {
            if (repo.language) languages.add(repo.language);
          });

          setStats({
            totalRepos: userData.public_repos,
            totalCommits: reposData.reduce((sum: number, repo: any) => sum + (repo.size || 0), 0),
            languages: Array.from(languages).slice(0, 5),
            followers: userData.followers,
            following: userData.following,
            bio: userData.bio || 'Full-Stack Developer',
            avatar: userData.avatar_url,
            recentActivity: reposData.slice(0, 5).map((repo: any) => repo.name),
          });
        } else {
          // Demo data if API fails
          setStats({
            totalRepos: 45,
            totalCommits: 2847,
            languages: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
            followers: 82,
            following: 45,
            bio: 'Product Manager turned Full-Stack Developer',
            avatar: '/headshot.jpeg',
            recentActivity: ['recruitment-platform', 'event-mapper', 'weather-dashboard', 'ecommerce-api', 'task-manager'],
          });
        }
      } catch (error) {
        console.error('GitHub API error:', error);
        // Use demo data
        setStats({
          totalRepos: 45,
          totalCommits: 2847,
          languages: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
          followers: 82,
          following: 45,
          bio: 'Product Manager turned Full-Stack Developer',
          avatar: '/headshot.jpeg',
          recentActivity: ['recruitment-platform', 'event-mapper', 'weather-dashboard', 'ecommerce-api', 'task-manager'],
        });
      }
    };

    fetchGitHubData();
  }, [username]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-run commands on mount
  useEffect(() => {
    if (!stats) return;

    const commands = [
      { cmd: 'git --version', output: 'git version 2.43.0' },
      { cmd: `git log --author="${username}" --oneline --all`, output: `${stats.totalCommits}+ commits across all repositories` },
      { cmd: 'git status', output: `${stats.totalRepos} repositories\n${stats.languages.length} languages detected\n${stats.followers} followers` },
      { cmd: 'git remote -v', output: `origin  https://github.com/${username} (fetch)\norigin  https://github.com/${username} (push)` },
    ];

    let delay = 0;
    commands.forEach((command, index) => {
      setTimeout(() => {
        typeCommand(command.cmd, command.output);
      }, delay);
      delay += 3000; // 3 seconds between commands
    });
  }, [stats, username]);

  const typeCommand = async (cmd: string, output: string) => {
    setIsTyping(true);

    // Type command
    for (let i = 0; i <= cmd.length; i++) {
      setCurrentCommand(cmd.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    // Add command and output to history
    setCommandOutput(prev => [...prev, `$ ${cmd}`, output]);
    setCurrentCommand('');
    setIsTyping(false);

    // Auto-scroll
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  if (!stats) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <motion.div
          className={`h-12 w-12 rounded-full border-4 border-t-transparent ${colors.border}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`overflow-hidden rounded-lg border ${colors.border} bg-black shadow-2xl ${colors.glow}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="font-mono text-sm text-white/60">
          {username}@github ~ %
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 animate-pulse rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
          <span className="text-xs text-white/40">CONNECTED</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="h-[500px] overflow-y-auto bg-black/95 p-6 font-mono text-sm backdrop-blur-sm"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.primary} transparent`,
        }}
      >
        {/* Initial greeting */}
        <div className="mb-4">
          <div className={colors.text}>
            {`// GitHub Profile Terminal`}
          </div>
          <div className="text-white/60">
            {`// Fetching data for @${username}...`}
          </div>
          <div className={`mt-2 ${colors.text}`}>
            {'>'} System ready. Executing git commands...
          </div>
        </div>

        {/* Command history */}
        <AnimatePresence>
          {commandOutput.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={
                line.startsWith('$')
                  ? `${colors.text} mt-4`
                  : 'text-white/70 mt-1 whitespace-pre-wrap'
              }
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current typing command */}
        {isTyping && (
          <div className={`mt-4 ${colors.text}`}>
            $ {currentCommand}
            {showCursor && <span className="animate-pulse">▊</span>}
          </div>
        )}

        {/* Stats Panel */}
        {!isTyping && commandOutput.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
            <div className={`mb-4 font-bold ${colors.text}`}>
              {`// Profile Summary`}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalRepos}</div>
                <div className="text-xs text-white/50">Repositories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalCommits}+</div>
                <div className="text-xs text-white/50">Total Commits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.followers}</div>
                <div className="text-xs text-white/50">Followers</div>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-2 text-xs text-white/60">Top Languages:</div>
              <div className="flex flex-wrap gap-2">
                {stats.languages.map((lang, i) => (
                  <span
                    key={i}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${colors.text} border ${colors.border} bg-white/5`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-2 text-xs text-white/60">Recent Activity:</div>
              <div className="space-y-1">
                {stats.recentActivity.slice(0, 3).map((repo, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                    <div className={`h-1.5 w-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                    <span className="font-mono">{repo}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* End cursor */}
        {!isTyping && (
          <div className={`mt-4 ${colors.text}`}>
            $ {showCursor && <span className="animate-pulse">▊</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
