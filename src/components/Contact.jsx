import React from 'react';
import { Mail } from 'lucide-react';
import { aboutData } from '../data/portfolioData';

export function Contact({ onShowToast }) {

  return (
    <section id="contact" class="contact-section">
      <div class="section-header">
        <h2 class="section-title">Get In Touch</h2>
        <p class="section-subtitle">Have a project, opportunity, or question? Feel free to reach out directly.</p>
      </div>

      <div class="contact-container">
        <div class="contact-card main-contact-card">
          <div class="contact-header-content">
            <h3>Let's build something great together.</h3>
            <p>Always open to collaborating on open-source projects, discussing systems architecture, DevOps pipelines, or full-stack development.</p>
          </div>

          <div class="contact-actions-grid">
            {/* Direct Email Action Button */}
            <a href={`mailto:${aboutData.email}`} class="btn btn-primary btn-contact">
              <Mail style={{ width: 18, height: 18 }} />
              <span>Send Email</span>
            </a>
          </div>


        </div>
      </div>
    </section>
  );
}
