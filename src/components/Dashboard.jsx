import React from 'react';
import { Package, Star, Users, Code2, GitCommit, PieChart, GitFork } from 'lucide-react';
import { useTelemetry } from '../hooks/useTelemetry';

export function Dashboard() {
  const { profile, repos, compiledAt, loading, error } = useTelemetry('Vaishnav0299');

  const totalStars = repos.reduce((acc, cr) => acc + (cr.stargazers_count || 0), 0);
  const formattedDate = compiledAt ? new Date(compiledAt * 1000).toLocaleString() : 'Syncing...';

  return (
    <section id="dashboard" class="dashboard-section">
      <div class="dashboard-container">
        <div class="section-header">
          <h2 class="section-title">Live GitHub Telemetry</h2>
          <p class="section-subtitle">Real-time repository statistics synced via GitHub REST API & automated cache pipelines.</p>
        </div>

        {/* Metric Grid */}
        <div class="metrics-grid">
          <div class="metric-card" id="metric-repos">
            <div class="card-glow"></div>
            <div class="metric-header">
              <span class="metric-label">Public Repositories</span>
            </div>
            <div class="metric-value">{loading ? '--' : profile?.public_repos || repos.length}</div>
            <div class="metric-footer">Open source codebases</div>
          </div>

          <div class="metric-card" id="metric-stars">
            <div class="card-glow"></div>
            <div class="metric-header">
              <span class="metric-label">Total Stars</span>
            </div>
            <div class="metric-value">{loading ? '--' : totalStars}</div>
            <div class="metric-footer">Community bookmarks</div>
          </div>

          <div class="metric-card" id="metric-followers">
            <div class="card-glow"></div>
            <div class="metric-header">
              <span class="metric-label">Followers</span>
            </div>
            <div class="metric-value">{loading ? '--' : profile?.followers || 0}</div>
            <div class="metric-footer">GitHub connections</div>
          </div>

          <div class="metric-card" id="metric-gists">
            <div class="card-glow"></div>
            <div class="metric-header">
              <span class="metric-label">Public Gists</span>
            </div>
            <div class="metric-value">{loading ? '--' : profile?.public_gists || 0}</div>
            <div class="metric-footer">Snippets & utilities</div>
          </div>
        </div>

        {/* Telemetry Visualizations */}
        <div class="telemetry-visualizations">
          <div class="visualization-card">
            <h3>Commit Contribution Activity</h3>
            <div class="viz-img-wrapper">
              <img src="https://github-readme-activity-graph.vercel.app/graph?username=Vaishnav0299&bg_color=00000000&color=a855f7&line=3b82f6&point=a855f7&area=true&hide_border=true&hide_title=true" alt="Commit Activity Graph" />
            </div>
          </div>
          <div class="visualization-card">
            <h3>Top Languages & Tech Stack</h3>
            <div class="viz-img-wrapper">
              <img src="https://github-stats-extended.vercel.app/api/top-langs/?username=Vaishnav0299&layout=compact&theme=transparent&hide_border=true&title_color=a855f7&text_color=a1a1aa&icon_color=3b82f6&hide_title=true" alt="Most Used Languages" />
            </div>
          </div>
        </div>

        {/* Repository Grid Header */}
        <div class="repo-explorer-header">
          <h3>Pinned & Recent Repositories</h3>
          <span class="sync-timestamp" id="sync-time">Sync: {formattedDate}</span>
        </div>

        <div class="repo-grid" id="repo-showcase-container">
          {loading ? (
            <>
              <div class="skeleton-card"></div>
              <div class="skeleton-card"></div>
            </>
          ) : repos.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textCenter: 'center', color: 'var(--text-muted)' }}>No public repositories found.</p>
          ) : (
            repos.slice(0, 6).map(repo => (
              <div key={repo.id} class="repo-card">
                <div>
                  <a href={repo.html_url} target="_blank" rel="noreferrer" class="repo-name">{repo.name}</a>
                  <p class="repo-description">{repo.description || "Open source repository developed by Vaishnav Gaware."}</p>
                </div>
                <div class="repo-meta-footer">
                  <div class="repo-lang">
                    <span class="lang-dot"></span>
                    <span>{repo.language || "Code"}</span>
                  </div>
                  <div class="repo-stats-aside">
                    <span><Star style={{ width: 12, height: 12 }} /> {repo.stargazers_count}</span>
                    <span><GitFork style={{ width: 12, height: 12 }} /> {repo.forks_count}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
