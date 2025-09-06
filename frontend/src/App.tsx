import { useState, useMemo, useEffect } from 'react';
import type { DirectoryNode } from './types';
import { MOCK_FS } from './mockData';
import { API_BASE } from './lib/http';
import './App.css';

function getDirectory(root: DirectoryNode, path: string[]): DirectoryNode {
  let current = root;
  for (let i = 1; i < path.length; i++) {
    const segment = path[i];
    const next = current.children.find(
      c => c.type === 'directory' && c.name === segment
    ) as DirectoryNode | undefined;
    if (!next) break;
    current = next;
  }
  return current;
}

export default function App() {
  const [path, setPath] = useState<string[]>([MOCK_FS.name]);
  const [health, setHealth] = useState<'healthy' | 'unhealthy'>('unhealthy');

  const currentDir = useMemo(() => getDirectory(MOCK_FS, path), [path]);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.text())
      .then(text => setHealth(text.trim() === 'healthy' ? 'healthy' : 'unhealthy'))
      .catch(() => setHealth('unhealthy'));
  }, []);

  return (
    <div className="app-container">
      <div className="path-bar">
        <div className="breadcrumbs">
          {path.map((segment, idx) => {
            const fullPath = path.slice(0, idx + 1).join('/');
            return (
              <span key={fullPath} onClick={() => setPath(path.slice(0, idx + 1))}>
                {segment}
                {idx < path.length - 1 && <span className="separator">/</span>}
              </span>
            );
          })}
        </div>
        <span className="health">{health}</span>
      </div>
      <div className="content">
        <aside className="sidebar">
          <ul>
            {currentDir.children.map(child => (
              <li key={child.name}>
                {child.type === 'directory' ? (
                  <button className="link" onClick={() => setPath([...path, child.name])}>
                    {child.name}/
                  </button>
                ) : (
                  child.name
                )}
              </li>
            ))}
          </ul>
        </aside>
        <main className="main">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </main>
      </div>
    </div>
  );
}
