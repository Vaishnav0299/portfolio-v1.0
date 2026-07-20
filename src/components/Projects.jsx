import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

export function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  return (
    <section id="projects" class="projects-section">
      <div class="section-header">
        <h2 class="section-title">Featured Projects</h2>
        <p class="section-subtitle">Production-grade web applications, AI models, and automated data pipelines.</p>
      </div>

      {/* Category Filter Bar */}
      <div class="project-filter-bar">
        <button
          class={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </button>
        <button
          class={`filter-btn ${activeFilter === 'fullstack' ? 'active' : ''}`}
          onClick={() => setActiveFilter('fullstack')}
        >
          Full-Stack
        </button>
        <button
          class={`filter-btn ${activeFilter === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ai')}
        >
          AI & Automation
        </button>
      </div>

      {/* Projects Grid */}
      <div class="projects-grid" id="portfolio-project-grid">
        {filteredProjects.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No projects found in this category.
          </p>
        ) : (
          filteredProjects.map(proj => (
            <div key={proj.id} class="portfolio-card" data-category={proj.category}>
              <div>
                <span class={`proj-badge ${proj.badgeClass}`}>{proj.type}</span>
                <h3>{proj.name}</h3>
                <p>{proj.desc}</p>
                <div class="tech-tag-wrap">
                  {proj.stack.map((tag, idx) => (
                    <span key={idx} class="tech-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div class="project-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <a href={proj.github} target="_blank" rel="noreferrer" class="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderRadius: '6px' }}>
                  <Github style={{ width: 14, height: 14 }} /> GitHub
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
