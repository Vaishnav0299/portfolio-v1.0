import React, { useEffect, useRef } from 'react';
import { Layout, Server, Database, Cpu } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

const iconMap = {
  Layout: Layout,
  Server: Server,
  Database: Database,
  Cpu: Cpu,
};

export function Skills() {
  const gridRef = useRef(null);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-fill');
            fills.forEach((f) => {
              const pct = f.getAttribute('data-percentage');
              if (pct) f.style.width = pct;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" class="skills-section">
      <div class="section-header">
        <h2 class="section-title">Technical Expertise</h2>
        <p class="section-subtitle">Technologies, frameworks, and core competencies I work with daily.</p>
      </div>
      <div class="skills-grid" ref={gridRef} id="skills-matrix-grid">
        {skillsData.map((cat, idx) => {
          return (
            <div key={idx} class="skill-category-card">
              <h3>{cat.category}</h3>
              {cat.items.map((s, sIdx) => (
                <div key={sIdx} class="skill-bar-container">
                  <div class="skill-info">
                    <span>{s.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.val}</span>
                  </div>
                  <div class="skill-track">
                    <div class="skill-fill" data-percentage={s.val}></div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
