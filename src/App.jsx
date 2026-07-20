import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Dashboard } from './components/Dashboard';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';
import { Terminal } from './components/Terminal';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

export function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('os-theme') || 'dark');
  const [activeSection, setActiveSection] = useState('home');
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('os-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next} mode`);
  };

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // 3D Card Tilt Mouse Interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = e.target.closest('.portfolio-card, .metric-card, .skill-category-card, .visualization-card, .about-card, .contact-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.02)`;
    };

    const handleMouseLeave = (e) => {
      const card = e.target.closest('.portfolio-card, .metric-card, .skill-category-card, .visualization-card, .about-card, .contact-card');
      if (card) {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0deg) scale(1)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  // Section Scroll Tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('id'));
          }
        });
      },
      { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <div class="app-root">
      {/* Background Grid & Ambient Glow Orbs */}
      <div class="bg-grid-overlay"></div>
      <div class="ambient-glow">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <Toast toast={toast} />

      <Navbar
        activeSection={activeSection}
        onOpenCmd={() => setIsCmdOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main class="main-content">
        <Hero />
        <About />
        <Dashboard />
        <Projects />
        <Skills />
        <Timeline />
        <Contact onShowToast={showToast} />
        <Terminal />
      </main>

      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default App;
