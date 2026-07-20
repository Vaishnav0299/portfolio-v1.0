import React, { useState, useEffect } from 'react';
import { Search, Home, BarChart2, FolderGit2, Cpu, Briefcase, Terminal as TermIcon, Github, Linkedin } from 'lucide-react';

const cmdItems = [
  { id: 1, label: 'Go to Home', target: '#home', key: '#home', icon: Home, action: 'nav' },
  { id: 2, label: 'Go to About Me', target: '#about', key: '#about', icon: Briefcase, action: 'nav' },
  { id: 3, label: 'Go to Telemetry Dashboard', target: '#dashboard', key: '#dashboard', icon: BarChart2, action: 'nav' },
  { id: 4, label: 'View Projects', target: '#projects', key: '#projects', icon: FolderGit2, action: 'nav' },
  { id: 5, label: 'View Skills & Tech Stack', target: '#skills', key: '#skills', icon: Cpu, action: 'nav' },
  { id: 6, label: 'View Experience & Education', target: '#timeline', key: '#timeline', icon: Briefcase, action: 'nav' },
  { id: 7, label: 'Get in Touch (Contact)', target: '#contact', key: '#contact', icon: TermIcon, action: 'nav' },
  { id: 8, label: 'Open Developer Terminal', target: '#system-terminal', key: '#terminal', icon: TermIcon, action: 'nav' },
  { id: 9, label: 'Open GitHub Profile', target: 'https://github.com/Vaishnav0299', key: '↗', icon: Github, action: 'ext' },
  { id: 10, label: 'Open LinkedIn Profile', target: 'https://www.linkedin.com/in/vaishnav-gaware-107799315/', key: '↗', icon: Linkedin, action: 'ext' }
];

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = cmdItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    onClose();
    if (item.action === 'nav') {
      const targetNode = document.querySelector(item.target);
      if (targetNode) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        window.scrollTo({
          top: targetNode.offsetTop - navHeight,
          behavior: 'smooth'
        });
      }
    } else if (item.action === 'ext') {
      window.open(item.target, '_blank');
    }
  };

  return (
    <div class="cmd-modal-backdrop active" onClick={(e) => e.target.classList.contains('cmd-modal-backdrop') && onClose()}>
      <div class="cmd-modal">
        <div class="cmd-header">
          <Search class="cmd-search-icon" />
          <input
            type="text"
            id="cmd-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or section..."
            autoFocus
            autoComplete="off"
          />
          <span class="cmd-esc-badge" onClick={onClose} style={{ cursor: 'pointer' }}>ESC</span>
        </div>
        <div class="cmd-list" id="cmd-options-list">
          {filtered.length === 0 ? (
            <p style={{ padding: '1rem', textCenter: 'center', color: 'var(--text-muted)' }}>No commands found.</p>
          ) : (
            filtered.map(item => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} class="cmd-item" onClick={() => handleSelect(item)}>
                  <IconComponent />
                  <span>{item.label}</span>
                  <span class="cmd-key">{item.key}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
