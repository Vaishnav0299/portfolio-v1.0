import React from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { aboutData } from '../data/portfolioData';

export function Hero() {
  return (
    <section id="home" class="hero-section">
      <div class="hero-container">
        
        {/* Profile Avatar Card */}
        <div class="hero-avatar-wrapper">
          <img
            src={aboutData.avatarUrl}
            alt={aboutData.name}
            class="hero-avatar-img"
          />
          <div class="avatar-glow-ring"></div>
        </div>

        <div class="badge-container">
          <span class="status-badge">
            <span class="pulse-dot"></span> Available for Opportunities
          </span>
        </div>
        
        <h1 class="hero-title">
          Hi, I'm <span class="text-gradient">{aboutData.name}</span>
        </h1>
        <p class="hero-subtitle">
          {aboutData.title}
        </p>

        {/* What I Do Tags */}
        <div class="what-i-do-bar" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span class="tech-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)', color: 'var(--text-primary)', fontWeight: 600 }}>⚡ Full-Stack Web Development</span>
          <span class="tech-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)', color: 'var(--text-primary)', fontWeight: 600 }}>🤖 AI & Machine Learning</span>
          <span class="tech-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.3)', color: 'var(--text-primary)', fontWeight: 600 }}>📊 Data Science & Analytics</span>
        </div>

        <p class="hero-description">
          Building high-performance web applications, scalable architectural backends, and intelligent data science pipelines. Focused on clean code, modern engineering, and intuitive user experiences.
        </p>

        <div class="hero-cta-group">
          <a href="#projects" class="btn btn-primary">
            <span>Explore Projects</span>
            <ArrowRight style={{ width: 18, height: 18 }} />
          </a>
          <a href="#contact" class="btn btn-secondary">
            <Mail style={{ width: 18, height: 18 }} />
            <span>Get In Touch</span>
          </a>
        </div>

        <div class="social-quick-links">
          <a href={aboutData.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub Profile">
            <Github style={{ width: 20, height: 20 }} />
          </a>
          <a href={aboutData.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn Profile">
            <Linkedin style={{ width: 20, height: 20 }} />
          </a>
          <a href={`mailto:${aboutData.email}`} aria-label="Mail" title="Send Email">
            <Mail style={{ width: 20, height: 20 }} />
          </a>
        </div>
      </div>
    </section>
  );
}
