import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';

export function Navbar({ activeSection, onOpenCmd, theme, onToggleTheme }) {
  return (
    <header class="navbar">
      <div class="nav-container">
        <a href="#home" class="nav-logo">
          <span class="logo-accent">&lt;</span>VG<span class="logo-accent"> /&gt;</span>
        </a>
        <nav class="nav-links">
          <a href="#home" class={activeSection === 'home' ? 'active' : ''}>Home</a>
          <a href="#about" class={activeSection === 'about' ? 'active' : ''}>About</a>
          <a href="#dashboard" class={activeSection === 'dashboard' ? 'active' : ''}>Dashboard</a>
          <a href="#projects" class={activeSection === 'projects' ? 'active' : ''}>Projects</a>
          <a href="#skills" class={activeSection === 'skills' ? 'active' : ''}>Skills</a>
          <a href="#timeline" class={activeSection === 'timeline' ? 'active' : ''}>Experience</a>
          <a href="#contact" class={activeSection === 'contact' ? 'active' : ''}>Contact</a>
          <a href="#system-terminal" class={activeSection === 'system-terminal' ? 'active' : ''}>Terminal</a>
        </nav>
        <div class="nav-actions">
          <button class="cmd-k-btn" onClick={onOpenCmd} title="Search website...">
            <Search style={{ width: 15, height: 15 }} />
            <span>Search</span>
          </button>
          <button id="theme-toggle" onClick={onToggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun class="sun-icon" /> : <Moon class="moon-icon" />}
          </button>
          <a href="#dashboard" class="btn btn-primary btn-sm">Live Dashboard</a>
        </div>
      </div>
    </header>
  );
}
