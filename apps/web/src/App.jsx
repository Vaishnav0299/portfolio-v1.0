import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ThreeBackground } from './components/ThreeBackground';

// Public Pages
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ContactPage } from './pages/ContactPage';
import { TerminalPage } from './pages/TerminalPage';

// Admin Panel
import { AdminLogin }     from './admin/AdminLogin';
import { AdminLayout }    from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProjects }  from './admin/AdminProjects';
import { AdminSkills }    from './admin/AdminSkills';
import { AdminTimeline }  from './admin/AdminTimeline';
import { AdminBio }       from './admin/AdminBio';

export function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('os-theme') || 'dark');
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
      const card = e.target.closest('.portfolio-card, .metric-card, .skill-category-card, .visualization-card, .about-card, .contact-card, .portal-card');
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
      const card = e.target.closest('.portfolio-card, .metric-card, .skill-category-card, .visualization-card, .about-card, .contact-card, .portal-card');
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0deg) scale(1)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Admin Panel (isolated layout) ─────────────────────────────── */}
        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/admin"          element={<AdminLayout />}>
          <Route index                element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"     element={<AdminDashboard />} />
          <Route path="projects"      element={<AdminProjects />} />
          <Route path="skills"        element={<AdminSkills />} />
          <Route path="timeline"      element={<AdminTimeline />} />
          <Route path="bio"           element={<AdminBio />} />
        </Route>

        {/* ── Public Site (main layout) ─────────────────────────────────── */}
        <Route path="*" element={
          <div className="app-root">
            <div className="bg-grid-overlay"></div>
            <ThreeBackground />
            <div className="ambient-glow">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>

            <Toast toast={toast} />

            <Navbar
              onOpenCmd={() => setIsCmdOpen(true)}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />

            <main className="main-content">
              <Routes>
                <Route path="/"        element={<Home />} />
                <Route path="/about"   element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/skills"  element={<SkillsPage />} />
                <Route path="/contact" element={<ContactPage onShowToast={showToast} />} />
                <Route path="/terminal" element={<TerminalPage />} />
              </Routes>
            </main>

            <CommandPalette
              isOpen={isCmdOpen}
              onClose={() => setIsCmdOpen(false)}
            />

            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
