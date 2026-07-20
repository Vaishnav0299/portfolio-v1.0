import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const initialLogs = [
  { text: "> Welcome to Vaishnav Gaware's Interactive CLI (v2.4).", isAccent: true },
  { text: "> Type 'help' to see available commands or click a chip above.", isAccent: false }
];

export function Terminal() {
  const [logs, setLogs] = useState(initialLogs);
  const [inputVal, setInputVal] = useState('');
  const terminalBodyRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  const commandRegistry = {
    help: [
      "Available Commands:",
      "  <span class='cmd-highlight'>skills</span>    - List core technical stack & frameworks",
      "  <span class='cmd-highlight'>projects</span>  - Display featured production repositories",
      "  <span class='cmd-highlight'>contact</span>   - Show email and social profiles",
      "  <span class='cmd-highlight'>bio</span>       - Brief developer summary",
      "  <span class='cmd-highlight'>github</span>    - Open GitHub profile",
      "  <span class='cmd-highlight'>linkedin</span>  - Open LinkedIn profile",
      "  <span class='cmd-highlight'>date</span>      - Print current UTC time",
      "  <span class='cmd-highlight'>clear</span>     - Clear terminal logs"
    ],
    skills: [
      "⚡ Technical Expertise Stack:",
      "  • Frontend : React, Next.js, TypeScript, Tailwind CSS, HTML5/CSS3",
      "  • Backend  : Node.js, Express, Hono, Python, FastAPI, REST/GraphQL",
      "  • DB & Cloud: PostgreSQL, MongoDB, ChromaDB, Redis, Docker, AWS",
      "  • AI & ML  : LangChain, Ollama, TensorFlow, Scikit-Learn, Pandas"
    ],
    projects: [
      "🚀 Featured Public Repositories:",
      "  1. Productivity-Pro [Full-Stack Workspace App]",
      "  2. My Study Assistant [AI Study Platform]",
      "  3. Deskify [Web Utility]",
      "  4. Form-Builder [Drag & Drop Form Engine]",
      "  5. Mentor Backend [REST API Service]"
    ],
    contact: [
      "📫 Contact Channels:",
      "  • Email    : vaishnavgaware1@gmail.com",
      "  • GitHub   : https://github.com/Vaishnav0299",
      "  • LinkedIn : https://linkedin.com/in/vaishnav-gaware-107799315/",
      "  • Portfolio: https://Vaishnav0299.github.io/Vaishnav0299/"
    ],
    bio: [
      "👨‍💻 Developer Bio:",
      "  Vaishnav Gaware is an AI & Data Science Undergraduate ('27)",
      "  building full-stack web applications and data science tools."
    ],
    github: () => {
      window.open('https://github.com/Vaishnav0299', '_blank');
      return ['Opening GitHub profile in new tab...'];
    },
    linkedin: () => {
      window.open('https://www.linkedin.com/in/vaishnav-gaware-107799315/', '_blank');
      return ['Opening LinkedIn profile in new tab...'];
    },
    date: [
      `Current Time: ${new Date().toUTCString()}`
    ],
    whoami: [
      "vaishnav@dev-os (Guest User)"
    ]
  };

  const handleRunCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      setLogs([{ text: "> Terminal session cleared. Type 'help' for commands.", isAccent: true }]);
      return;
    }

    const newLogLines = [
      { text: `vaishnav@dev-os:~$ ${rawCmd}`, isPrompt: true }
    ];

    if (commandRegistry[cmd]) {
      const res = typeof commandRegistry[cmd] === 'function'
        ? commandRegistry[cmd]()
        : commandRegistry[cmd];
      res.forEach(line => newLogLines.push({ text: line, isOutput: true }));
    } else {
      newLogLines.push({
        text: `<span style="color: #ef4444;">zsh: command not found: ${cmd}</span>. Type <span class='cmd-highlight'>'help'</span> for available commands.`,
        isOutput: true
      });
    }

    setLogs(prev => [...prev, ...newLogLines]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <section id="system-terminal" class="terminal-section">
      <div class="section-header">
        <h2 class="section-title">Interactive Developer Terminal</h2>
        <p class="section-subtitle">Type commands below or click quick shortcuts to interact with the environment.</p>
      </div>
      
      <div class="terminal-mock">
        <div class="terminal-titlebar">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="terminal-title-text">vaishnav@dev-os:~</span>
          <div class="terminal-actions">
            <button class="term-btn" onClick={() => setLogs([{ text: "> Terminal cleared.", isAccent: true }])} title="Clear Terminal">
              <Trash2 style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Quick Action Chips */}
        <div class="terminal-quick-chips">
          <span class="chip-label">Quick Commands:</span>
          {['help', 'skills', 'projects', 'contact', 'clear'].map(chip => (
            <button key={chip} class="term-chip" onClick={() => handleRunCommand(chip)}>
              {chip}
            </button>
          ))}
        </div>

        <div class="terminal-body" ref={terminalBodyRef} id="interactive-terminal-logs">
          {logs.map((log, idx) => (
            <div
              key={idx}
              class={`log-line ${log.isAccent ? 'text-accent' : ''}`}
              dangerouslySetInnerHTML={{ __html: log.text }}
            />
          ))}
        </div>

        <div class="terminal-input-row">
          <span class="term-prompt">vaishnav@dev-os:~$</span>
          <input
            type="text"
            id="terminal-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. help, skills, projects, contact)..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </section>
  );
}
