import React from 'react';
import { GraduationCap, MapPin, Mail } from 'lucide-react';
import { aboutData } from '../data/portfolioData';

export function About() {
  return (
    <section id="about" class="about-section">
      <div class="section-header">
        <h2 class="section-title">About Me</h2>
        <p class="section-subtitle">Background, education, core technical interests, and career objectives.</p>
      </div>

      <div class="about-cards-column">
        {/* Meta Info Row */}
        <div class="about-card bio-card">
          <div class="about-meta-list" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div class="about-meta-item">
              <GraduationCap style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
              <span>{aboutData.education}</span>
            </div>
            <div class="about-meta-item">
              <MapPin style={{ width: 18, height: 18, color: 'var(--accent-secondary)' }} />
              <span>{aboutData.location}</span>
            </div>
            <div class="about-meta-item">
              <Mail style={{ width: 18, height: 18, color: 'var(--accent-tertiary)' }} />
              <a href={`mailto:${aboutData.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{aboutData.email}</a>
            </div>
          </div>
          <h3 style={{ marginTop: '1.25rem' }}>Short Bio</h3>
          <p>{aboutData.bio}</p>
        </div>

        <div class="about-two-col">
          <div class="about-card interests-card">
            <h3>Core Technical Interests</h3>
            <ul class="interests-list">
              {aboutData.interests.map((item, idx) => (
                <li key={idx}>
                  <span class="interest-bullet"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="about-card seeking-card">
            <h3>Current Focus</h3>
            <p>{aboutData.currentFocus}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
