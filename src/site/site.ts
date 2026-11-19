/** Site-wide settings in one place. */
export const SITE = {
  name: 'Frontend Explore',
  /** Header wordmark, split so the separator can be colored. Owner's choice is pending (spec: Naming). */
  wordmark: { start: 'frontend', separator: '-', end: 'explore' },
  githubUrl: 'https://github.com/nadine-codes/frontend-explore',
  builtWith: 'Built with React, TypeScript and Vite.',
  footerNote: 'New patterns launch regularly 🚀',
} as const;
