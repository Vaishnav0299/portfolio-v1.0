import React from 'react';
import { timelineData } from '../data/portfolioData';

export function Timeline() {
  return (
    <section id="timeline" class="timeline-section">
      <div class="section-header">
        <h2 class="section-title">Career & Education</h2>
        <p class="section-subtitle">Engineering experience, academic milestones, and open-source contributions.</p>
      </div>
      <div class="timeline-container" id="vertical-timeline">
        {timelineData.map((node, idx) => (
          <div key={idx} class="timeline-node">
            <span class="timeline-time">{node.time}</span>
            <div class="timeline-body">
              <h3>{node.title}</h3>
              <div class="timeline-institution">{node.inst}</div>
              <p class="timeline-desc">{node.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
