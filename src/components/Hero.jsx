import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { aboutData } from '../data/portfolioData';

export function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        
        {/* Profile Avatar Card */}
        <div className="hero-avatar-wrapper">
          <img
            src={aboutData.avatarUrl}
            alt={aboutData.name}
            className="hero-avatar-img"
          />
          <div className="avatar-glow-ring"></div>
        </div>

        <div className="badge-container">
          <span className="status-badge">
            <span className="pulse-dot"></span> Available for Opportunities
          </span>
        </div>
        
        <h1 className="hero-title">
          Hi, I'm <span className="text-gradient">{aboutData.name}</span>
        </h1>
        <p className="hero-subtitle">
          {aboutData.title}
        </p>

        {/* What I Do Tags */}
        <div className="what-i-do-bar" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span className="tech-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)', color: 'var(--text-primary)', fontWeight: 600 }}>⚡ Full-Stack Web Development</span>
          <span class="tech-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)', color: 'var(--text-primary)', fontWeight: 600 }}>🤖 AI & Machine Learning</span>
          <span className="tech-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.3)', color: 'var(--text-primary)', fontWeight: 600 }}>📊 Data Science & Analytics</span>
        </div>

        <p className="hero-description">
          Building high-performance web applications, scalable architectural backends, and intelligent data science pipelines. Focused on clean code, modern engineering, and intuitive user experiences.
        </p>

        <div className="hero-cta-group">
          <Link to="/projects" className="btn btn-primary">
            <span>Explore Projects</span>
            <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            <Mail style={{ width: 18, height: 18 }} />
            <span>Get In Touch</span>
          </Link>
        </div>

        <div className="social-quick-links">
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
