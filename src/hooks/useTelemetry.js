import { useState, useEffect } from 'react';

const IGNORED_REPOS = ['Vaishnav0299'];

const isCourseOrFork = (repo) => {
  if (repo.fork) return true;
  const lower = repo.name.toLowerCase();
  return lower.startsWith('skills-') || lower.includes('copilot-') || lower.includes('introduction-to-github') || IGNORED_REPOS.includes(repo.name);
};

export function useTelemetry(username = 'Vaishnav0299') {
  const [data, setData] = useState({ profile: null, repos: [], compiledAt: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        // First try local telemetry cache
        const res = await fetch('data/telemetry.json');
        if (res.ok) {
          const json = await res.json();
          if (json && json.profile && json.repos) {
            const publicRepos = json.repos.filter(r => !r.private && !isCourseOrFork(r));
            setData({
              profile: json.profile,
              repos: publicRepos,
              compiledAt: json.compiledAt,
            });
            setLoading(false);
            return;
          }
        }
        throw new Error('Local cache unavailable');
      } catch (err) {
        // Fallback to live API
        try {
          const [profRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=30`),
          ]);
          if (!profRes.ok || !reposRes.ok) throw new Error('GitHub API Error');
          const profile = await profRes.json();
          const rawRepos = await reposRes.json();
          const publicRepos = Array.isArray(rawRepos)
            ? rawRepos.filter(r => !r.private && !isCourseOrFork(r))
            : [];
          
          setData({
            profile,
            repos: publicRepos,
            compiledAt: Math.floor(Date.now() / 1000),
          });
        } catch (apiErr) {
          setError(apiErr.message);
        } finally {
          setLoading(false);
        }
      }
    }

    loadTelemetry();
  }, [username]);

  return { ...data, loading, error };
}
