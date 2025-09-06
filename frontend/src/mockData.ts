import type { DirectoryNode } from './types';

export const MOCK_FS: DirectoryNode = {
  name: 'root',
  type: 'directory',
  children: [
    {
      name: 'src',
      type: 'directory',
      children: [
        { name: 'index.ts', type: 'file' },
        { name: 'App.tsx', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ],
};
