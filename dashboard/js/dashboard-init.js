/**
 * Dashboard Initialization Script
 * Simple, direct initialization without modules
 */

// ===== SECURITY: HTML ESCAPING =====
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== LOGGER =====
const logger = {
  debug: (...args) => console.debug('[Dashboard]', ...args),
  info: (...args) => console.info('[Dashboard]', ...args),
  warn: (...args) => console.warn('[Dashboard]', ...args),
  error: (...args) => console.error('[Dashboard]', ...args)
};

// ===== FETCH WITH TIMEOUT =====
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error(`Request timed out after ${timeout}ms`);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ===== CLOCKS =====
function initClocks() {
  function updateClocks() {
    const now = new Date();

    // Header clock
    const headerClock = document.getElementById("clock");
    if (headerClock) {
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      headerClock.textContent = `${h}:${m}:${s}`;
    }

    // London clock
    const londonClock = document.getElementById("london-clock");
    if (londonClock) {
      const londonTime = now.toLocaleTimeString("en-US", {
        timeZone: "Europe/London",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      londonClock.textContent = londonTime;
    }

    // Thailand clock
    const thailandClock = document.getElementById("thailand-clock");
    if (thailandClock) {
      const thailandTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      thailandClock.textContent = thailandTime;
    }
  }

  // Update immediately and then every second
  updateClocks();
  setInterval(updateClocks, 1000);
}

// ===== SYSTEM STATS =====
function initSystemStats() {
  async function updateStats() {
    try {
      const response = await fetch('http://127.0.0.1:9999/api/stats');
      const data = await response.json();
      
      const cpuUsage = data.cpu;
      const ramUsage = data.ram;
      const hardware = data.hardware;

      const cpuBar = document.getElementById("cpu-bar");
      const cpuValue = document.getElementById("cpu-value");
      const ramBar = document.getElementById("ram-bar");
      const ramValue = document.getElementById("ram-value");
      const hardwareInfo = document.getElementById("hardware-info");

      if (cpuBar && cpuValue) {
        cpuBar.style.width = cpuUsage + "%";
        cpuValue.textContent = cpuUsage + "%";
      }

      if (ramBar && ramValue) {
        ramBar.style.width = ramUsage + "%";
        ramValue.textContent = ramUsage + "%";
      }

      if (hardwareInfo && hardware) {
        const cpuText = escapeHTML(hardware.cpu || 'Unknown');
        const gpuText = escapeHTML((hardware.gpu || []).join(' | ') || 'Unknown');
        hardwareInfo.innerHTML = `
          <div class="text-xs text-[var(--color-text-muted)] space-y-1">
            <div><span class="text-[var(--color-cyan)]">CPU:</span> ${cpuText}</div>
            <div><span class="text-[var(--color-cyan)]">GPU:</span> ${gpuText}</div>
          </div>
        `;
      }
    } catch (error) {
      logger.error('Error fetching system stats:', error);
    }
  }

  // Update immediately and then every 2 seconds
  updateStats();
  setInterval(updateStats, 2000);
}

// ===== DRAG & DROP NODES =====
function initDragDropNodes() {
  if (typeof Sortable === 'undefined') {
    console.warn('SortableJS not loaded');
    return;
  }

  const nodeGrid = document.querySelector('.node-grid');
  if (!nodeGrid) return;

  // Restore previous order
  restoreNodeOrder();

  try {
    Sortable.create(nodeGrid, {
      animation: 200,
      ghostClass: 'dragging-ghost',
      dragClass: 'dragging-active',
      handle: '.visual-node',
      forceFallback: false,
      onEnd: (evt) => {
        saveNodeOrder();
      }
    });
    
    console.log('✓ Drag & Drop initialized on node-grid');
  } catch (error) {
    console.error('Drag & Drop init error:', error);
  }
}

function saveNodeOrder() {
  const nodeGrid = document.querySelector('.node-grid');
  if (!nodeGrid) return;
  
  const order = Array.from(nodeGrid.querySelectorAll('.visual-node')).map((node, index) => ({
    label: node.querySelector('.node-label')?.textContent || '',
    href: node.getAttribute('href') || '',
    index: index
  }));
  
  localStorage.setItem('s1barch_node_order', JSON.stringify(order));
  console.log('✓ Node order saved:', order.length + ' nodes');
}

function restoreNodeOrder() {
  const nodeGrid = document.querySelector('.node-grid');
  if (!nodeGrid) return;
  
  const savedOrder = JSON.parse(localStorage.getItem('s1barch_node_order') || '[]');
  if (savedOrder.length === 0) return;
  
  const nodeMap = new Map();
  nodeGrid.querySelectorAll('.visual-node').forEach(node => {
    const href = node.getAttribute('href');
    nodeMap.set(href, node);
  });
  
  savedOrder.forEach(item => {
    const node = nodeMap.get(item.href);
    if (node) {
      nodeGrid.appendChild(node);
    }
  });
  
  console.log('✓ Node order restored');
}

// ===== TERMINAL =====
function initTerminal() {
  const terminalInput = document.getElementById("terminal-input");
  const terminalOutput = document.getElementById("terminal-output");
  const clearButton = document.querySelector(".terminal-clear");

  if (!terminalInput || !terminalOutput) return;

  // Command history
  const commandHistory = [];
  let historyIndex = -1;

  // Command suggestions
  const commandSuggestions = [
    'help', 'clear', 'date', 'whoami', 'version', 'status', 'banner',
    'threats', 'intel', 'nmap', 'gobuster', 'sqlmap', 'burpsuite', 'msfconsole', 'hydra'
  ];

  // Suggestion element
  const suggestionBox = document.createElement('div');
  suggestionBox.className = 'absolute top-full left-0 mt-1 bg-black/80 border border-[var(--color-cyan)]/30 rounded text-xs font-mono text-[var(--color-cyan)] max-h-24 overflow-y-auto z-50 hidden';
  terminalInput.parentElement.style.position = 'relative';
  terminalInput.parentElement.appendChild(suggestionBox);

  // Available commands
  const commands = {
    help: () => {
      return `
<div class="text-[var(--color-text-accent)]">Available Commands:</div>
<div class="ml-4 space-y-1 text-[10px]">
    <div><span class="text-[var(--color-text-accent)]">help</span> - Show this help message</div>
    <div><span class="text-[var(--color-text-accent)]">clear</span> - Clear terminal output</div>
    <div><span class="text-[var(--color-text-accent)]">date</span> - Show current date and time</div>
    <div><span class="text-[var(--color-text-accent)]">whoami</span> - Display current user</div>
    <div><span class="text-[var(--color-text-accent)]">version</span> - Show dashboard version</div>
    <div><span class="text-[var(--color-text-accent)]">status</span> - Show system status</div>
    <div><span class="text-[var(--color-text-accent)]">banner</span> - Show S1BGr0up banner</div>
    <div><span class="text-[var(--color-text-accent)]">threats</span> - Fetch latest security threats</div>
    <div><span class="text-[var(--color-text-accent)]">intel</span> - Display HackerNews security feed</div>
</div>`;
    },
    threats: async () => {
      addOutput('<div class="text-[var(--color-red)] animate-pulse">Fetching threat intel...</div>');
      try {
        const cveUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0?pageSize=3';
        const response = await fetch(cveUrl);
        const data = await response.json();
        
        if (data.vulnerabilities?.length > 0) {
          let output = '<div class="text-[var(--color-red)] font-bold mb-1">Latest CVEs:</div>';
          data.vulnerabilities.slice(0, 3).forEach((v, i) => {
            const cve = v.cve;
            output += `<div class="ml-2 text-[10px] text-[var(--color-text-muted)]">[${i+1}] ${cve.id}</div>`;
          });
          return output;
        }
      } catch (e) {
        return '<div class="text-[var(--color-red)]">Unable to fetch threats</div>';
      }
    },
    intel: async () => {
      addOutput('<div class="text-[var(--color-cyan)] animate-pulse">Scanning HackerNews...</div>');
      try {
        const topUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
        const idsResponse = await fetch(topUrl);
        const ids = await idsResponse.json();
        
        let output = '<div class="text-[var(--color-cyan)] font-bold mb-1">Top Security Stories:</div>';
        let count = 0;
        
        for (let id of ids.slice(0, 5)) {
          const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
          const storyResponse = await fetch(storyUrl);
          const story = await storyResponse.json();
          
          if (story.title && ['security', 'exploit', 'vulnerability', 'breach'].some(w => story.title.toLowerCase().includes(w))) {
            output += `<div class="ml-2 text-[10px] text-[var(--color-text-muted)]">${story.title.substring(0, 55)}...</div>`;
            count++;
            if (count >= 3) break;
          }
        }
        
        return count > 0 ? output : '<div class="text-[var(--color-text-muted)]">No security stories found</div>';
      } catch (e) {
        return '<div class="text-[var(--color-red)]">Unable to fetch intel</div>';
      }
    },
    clear: () => {
      terminalOutput.innerHTML = "";
      return "";
    },
    date: () => {
      const now = new Date();
      return `<div class="text-[var(--color-text-primary)]">${now.toString()}</div>`;
    },
    whoami: () => {
      return `<div class="text-[var(--color-text-accent)]">root@S1BGr0up</div>`;
    },
    version: () => {
      return `<div class="text-[var(--color-text-accent)]">S1BGr0up Dashboard v2.0.0</div>`;
    },
    status: () => {
      return `
<div class="text-[var(--color-text-accent)]">System Status:</div>
<div class="ml-4 space-y-1">
    <div><span class="text-[var(--color-neon-green)]">✓</span> VPN: ACTIVE</div>
    <div><span class="text-[var(--color-neon-green)]">✓</span> Firewall: ENABLED</div>
    <div><span class="text-[var(--color-neon-green)]">✓</span> Location: CLASSIFIED</div>
    <div><span class="text-[var(--color-neon-green)]">✓</span> Status: OPERATIONAL</div>
</div>`;
    },
    banner: () => {
      return `
<div class="text-[var(--color-cyan)] font-black text-xl mb-1 tracking-tighter uppercase italic">il1v3y<span class="text-[var(--color-magenta)]">.</span>Cyber_Arsenal</div>
<div class="text-[var(--color-text-muted)] text-sm font-mono uppercase tracking-widest">// Identity Verified: Operator_il1v3y</div>`;
    },
  };

  // Add output line
  function addOutput(content, isCommand = false) {
    const line = document.createElement("div");
    line.className = "mb-2";

    if (isCommand) {
      line.innerHTML = `<span class="text-[var(--color-neon-green)]">root@S1BGr0up:~#</span> <span class="text-[var(--color-text-primary)]">${escapeHTML(content)}</span>`;
    } else {
      line.innerHTML = content;
    }

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Execute command
  async function executeCommand(cmd) {
    const trimmedCmd = cmd.trim().toLowerCase();

    // Add command to output
    addOutput(cmd, true);

    // Add to history
    if (trimmedCmd) {
      commandHistory.push(trimmedCmd);
      historyIndex = commandHistory.length;
    }

    // Execute command
    const cmd_func = commands[trimmedCmd] || (window.terminalCommands && window.terminalCommands[trimmedCmd]);
    if (cmd_func) {
      const result = cmd_func();
      if (result instanceof Promise) {
        const output = await result;
        if (output) addOutput(output);
      } else if (result) {
        addOutput(result);
      }
    } else if (trimmedCmd) {
      addOutput(
        `<div class="text-red-400">Command not found: ${escapeHTML(trimmedCmd)}. Type 'help' for available commands.</div>`,
      );
    }

    // Clear input
    terminalInput.value = "";
  }

  // Show suggestions
  function showSuggestions(input) {
    const filtered = commandSuggestions.filter(cmd =>
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );

    if (filtered.length > 0 && input.length > 0) {
      suggestionBox.innerHTML = filtered
        .map(cmd => `<div class="p-1 hover:bg-[var(--color-cyan)]/20 cursor-pointer" data-cmd="${escapeHTML(cmd)}">${escapeHTML(cmd)}</div>`)
        .join('');
      suggestionBox.classList.remove('hidden');

      suggestionBox.querySelectorAll('div[data-cmd]').forEach(div => {
        div.addEventListener('click', async () => {
          const cmd = div.getAttribute('data-cmd');
          terminalInput.value = cmd;
          suggestionBox.classList.add('hidden');
          terminalInput.focus();
        });
        div.addEventListener('mouseenter', () => {
          div.style.backgroundColor = 'rgba(0, 229, 255, 0.2)';
        });
        div.addEventListener('mouseleave', () => {
          div.style.backgroundColor = 'transparent';
        });
      });
    } else {
      suggestionBox.classList.add('hidden');
    }
  }

  // Handle enter key
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      suggestionBox.classList.add('hidden');
      executeCommand(terminalInput.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
        showSuggestions(terminalInput.value);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
        showSuggestions(terminalInput.value);
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = "";
        suggestionBox.classList.add('hidden');
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const filtered = commandSuggestions.filter(cmd =>
        cmd.toLowerCase().startsWith(terminalInput.value.toLowerCase())
      );
      if (filtered.length > 0) {
        terminalInput.value = filtered[0];
        showSuggestions(filtered[0]);
      }
    }
  });

  // Show suggestions on input
  terminalInput.addEventListener("input", (e) => {
    showSuggestions(e.target.value);
  });

  // Handle clear button
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      terminalOutput.innerHTML = "";
    });
  }

  // Welcome message
  addOutput(commands.banner());
  addOutput(
    `<div class="text-[var(--color-text-muted)] mt-2">Type 'help' for available commands</div>`,
  );
}

// ===== THREAT INTEL STREAM =====
function initIntelStream() {
  const stream = document.getElementById("intel-stream");
  if (!stream) return;

  const localEvents = [
    { type: "CRITICAL", msg: "Unauthorized RDP attempt blocked from 185.222.x.x" },
    { type: "ALERT", msg: "Lateral movement detected in segment DB-PROD" },
    { type: "SYSTEM", msg: "Nightly vulnerability scan completed: 0 critical" },
    { type: "CRITICAL", msg: "Credential stuffing attack mitigated [S1B_IDENTITY]" },
    { type: "ALERT", msg: "Malware sandbox: Trojan.Agent.AES detected" },
    { type: "INFO", msg: "S1BARCH VPN Tunnel optimized via Tokyo-Node" },
    { type: "SYSTEM", msg: "Kernel update pending for Lab-02 instance" },
  ];

  function addEvent(eventData) {
    const time = new Date().toLocaleTimeString([], {
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    const entry = document.createElement("div");
    const colorClass = eventData.type === "CRITICAL" ? "text-[var(--color-red)]"
      : eventData.type === "ALERT" ? "text-amber-500"
      : eventData.type === "SYSTEM" ? "text-[var(--color-cyan)]"
      : "text-[var(--color-text-muted)]";

    entry.innerHTML = `<span class="opacity-40">[${time}]</span> <span class="${colorClass} font-bold">[${escapeHTML(eventData.type)}]</span> ${escapeHTML(eventData.msg)}`;
    entry.className = "mb-1 border-l-2 border-transparent hover:border-[var(--color-cyan)] pl-2 transition-all cursor-pointer";

    stream.prepend(entry);
    if (stream.children.length > 15) stream.removeChild(stream.lastChild);
  }

  // Fetch HackerNews top stories
  async function fetchHackerNews() {
    try {
      const topUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
      const idsResponse = await fetch(topUrl);
      const ids = await idsResponse.json();

      for (let id of ids.slice(0, 2)) {
        const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        const storyResponse = await fetch(storyUrl);
        const story = await storyResponse.json();

        if (story.title && story.title.toLowerCase().includes(
          ['security', 'vulnerability', 'breach', 'exploit', 'malware', 'cve', 'zero-day', 'attack'].join('|'))) {
          addEvent({
            type: 'INFO',
            msg: `HN_ALERT: ${story.title.substring(0, 60)}...`
          });
        }
      }
    } catch (error) {
      console.debug('HackerNews fetch error');
    }
  }

  // Fetch recent CVEs
  async function fetchCVEs() {
    try {
      const cveUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0?pageSize=5';
      const response = await fetch(cveUrl);
      const data = await response.json();

      if (data.vulnerabilities && data.vulnerabilities.length > 0) {
        const vuln = data.vulnerabilities[0].cve;
        addEvent({
          type: 'CRITICAL',
          msg: `CVE_PUBLISHED: ${vuln.id} - ${vuln.descriptions[0]?.value.substring(0, 50)}...`
        });
      }
    } catch (error) {
      console.debug('CVE fetch error');
    }
  }

  // Initial local events
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      addEvent(localEvents[Math.floor(Math.random() * localEvents.length)]);
    }, i * 300);
  }

  // Fetch from APIs
  setTimeout(() => {
    fetchHackerNews();
    fetchCVEs();
  }, 2000);

  // Regular updates: mix of local events and API data
  setInterval(() => {
    if (Math.random() > 0.5) {
      addEvent(localEvents[Math.floor(Math.random() * localEvents.length)]);
    } else if (Math.random() > 0.5) {
      fetchHackerNews();
    } else {
      fetchCVEs();
    }
  }, 8000 + Math.random() * 8000);
}

// ===== MATRIX BACKGROUND =====
function initMatrix() {
  const canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
  const fontSize = 14;
  const columns = Math.floor(width / fontSize);
  const drops = [];

  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -height;
  }

  function draw() {
    ctx.fillStyle = "rgba(5, 5, 8, 0.1)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#00e5ff"; // Match cyan theme
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  setInterval(draw, 50);
}

// ===== TODO LIST =====
function initTodo() {
  const todoInput = document.getElementById("todo-input");
  const todoAddBtn = document.getElementById("todo-add");
  const todoList = document.getElementById("todo-list");

  if (!todoList || !todoInput || !todoAddBtn) return;

  // Load from localStorage
  let todos = JSON.parse(localStorage.getItem("s1barch_todos") || "[]");

  function saveTodos() {
    localStorage.setItem("s1barch_todos", JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = "";
    todos.forEach((todo, index) => {
      const item = document.createElement("div");
      item.className =
        "flex items-center justify-between p-2 bg-black/30 border border-white/5 group";
      item.innerHTML = `
        <span class="text-xs font-mono text-[var(--color-text-primary)]">[!] ${todo}</span>
        <button class="text-[var(--color-red)] opacity-0 group-hover:opacity-100 transition-opacity text-[10px]" data-index="${index}">[REMOVE]</button>
      `;

      const removeBtn = item.querySelector("button");
      removeBtn.onclick = () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      };

      todoList.appendChild(item);
    });
  }

  function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
      todos.push(text);
      saveTodos();
      renderTodos();
      todoInput.value = "";
    }
  }

  todoAddBtn.onclick = addTodo;
  todoInput.onkeydown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  renderTodos();
}

// ===== PANEL PERSISTENCE =====
function initPanelPersistence() {
  const panels = document.querySelectorAll('.panel-card');
  let panelStates = JSON.parse(localStorage.getItem('s1barch_panels') || '{}');

  panels.forEach((panel) => {
    const panelId = panel.getAttribute('data-panel-id');
    if (!panelId) return;

    const content = panel.querySelector('.panel-content, .p-4, .p-6');
    if (!content) return;

    // Create collapse button
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'collapse-btn text-[10px] px-2 py-0.5 border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black transition-colors font-mono ml-auto';
    collapseBtn.innerHTML = '[-]';

    const header = panel.querySelector('.card-header');
    if (header) {
      header.appendChild(collapseBtn);
    }

    // Restore state
    if (panelStates[panelId] === 'collapsed') {
      content.style.display = 'none';
      collapseBtn.innerHTML = '[+]';
    }

    // Toggle on click
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? '' : 'none';
      collapseBtn.innerHTML = isHidden ? '[-]' : '[+]';

      panelStates[panelId] = isHidden ? 'expanded' : 'collapsed';
      localStorage.setItem('s1barch_panels', JSON.stringify(panelStates));
    });
  });
}

// ===== THEME SYNC =====
function initThemeSync() {
  const storedTheme = localStorage.getItem('s1barch_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(t) {
    if (t === 'light') {
      document.documentElement.style.colorScheme = 'light';
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.style.colorScheme = 'dark';
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('s1barch_theme', t);
  }

  applyTheme(theme);

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('s1barch_theme_override')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ===== SEARCH GLOBAL =====
function initSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let selectedIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.toggle('hidden');
      if (!searchModal.classList.contains('hidden')) {
        searchInput.focus();
        selectedIndex = 0;
      }
    }
    if (e.key === 'Escape') searchModal.classList.add('hidden');
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    searchResults.innerHTML = '';
    selectedIndex = 0;

    if (!query) return;

    const results = [];
    
    document.querySelectorAll('.link-text').forEach(el => {
      if (el.textContent.toLowerCase().includes(query)) {
        const link = el.closest('.link-anchor');
        results.push({ type: 'link', text: el.textContent, element: link });
      }
    });

    document.querySelectorAll('.node-label').forEach(el => {
      if (el.textContent.toLowerCase().includes(query)) {
        const node = el.closest('.visual-node');
        results.push({ type: 'node', text: el.textContent, element: node });
      }
    });

    results.slice(0, 10).forEach((r, i) => {
      const div = document.createElement('div');
      div.className = i === 0 ? 'p-2 bg-[var(--color-cyan)]/20 border-b border-[var(--color-cyan)]/30 cursor-pointer text-[var(--color-text-primary)] text-xs font-mono' : 'p-2 border-b border-[var(--color-cyan)]/30 cursor-pointer text-[var(--color-text-muted)] text-xs font-mono hover:bg-[var(--color-cyan)]/10';
      div.textContent = `[${r.type}] ${r.text}`;
      div.onclick = () => {
        r.element.click();
        searchModal.classList.add('hidden');
      };
      searchResults.appendChild(div);
    });
  });
}

// ===== NODE MANAGEMENT =====
function initNodeManagement() {
  const addBtn = document.getElementById('add-node-btn');
  const nodeModal = document.getElementById('node-modal');
  const nodeUrl = document.getElementById('node-url');
  const nodeLabel = document.getElementById('node-label');
  const nodeSave = document.getElementById('node-save');
  const nodeCancel = document.getElementById('node-cancel');
  const nodeGrid = document.querySelector('.node-grid');

  addBtn.onclick = () => nodeModal.classList.remove('hidden');
  nodeCancel.onclick = () => nodeModal.classList.add('hidden');

  nodeSave.onclick = () => {
    const url = nodeUrl.value.trim();
    const label = nodeLabel.value.trim();
    if (!url || !label) return;

    const node = document.createElement('a');
    node.href = url;
    node.className = 'visual-node';
    node.innerHTML = `
      <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span class="node-label">${label}</span>
      <button class="node-delete text-[8px] text-[var(--color-red)] opacity-0 hover:opacity-100" onclick="event.preventDefault();this.closest('.visual-node').remove();saveNodeOrder()">[X]</button>
    `;
    nodeGrid.appendChild(node);
    saveNodeOrder();
    nodeModal.classList.add('hidden');
    nodeUrl.value = nodeLabel.value = '';
  };
}

// ===== TERMINAL FULLSCREEN =====
function initTerminalFullscreen() {
  const fsBtn = document.getElementById('terminal-fullscreen');
  const fsModal = document.getElementById('terminal-fullscreen-modal');
  const exitBtn = document.getElementById('terminal-exit-fullscreen');
  const fsOutput = document.getElementById('terminal-fullscreen-output');
  const fsInput = document.getElementById('terminal-fullscreen-input');

  fsBtn.onclick = () => {
    fsModal.classList.remove('hidden');
    fsOutput.innerHTML = document.getElementById('terminal-output').innerHTML;
    fsInput.focus();
  };

  exitBtn.onclick = () => fsModal.classList.add('hidden');

  fsInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
      const cmd = fsInput.value;
      const line = document.createElement('div');
      line.innerHTML = `<span class="text-[var(--color-neon-green)]">$</span> ${cmd}`;
      fsOutput.appendChild(line);
      fsOutput.scrollTop = fsOutput.scrollHeight;
      fsInput.value = '';
    }
  };
}

// ===== ADDITIONAL APIs =====
function addApiCommands() {
  const commands = {
    shodan: async () => {
      return '<div class="text-[var(--color-text-muted)]">Shodan: Requires API key. Visit shodan.io for setup.</div>';
    },
    virustotal: async () => {
      return '<div class="text-[var(--color-text-muted)]">VirusTotal: Requires API key. Visit virustotal.com for setup.</div>';
    },
    pwned: async () => {
      addOutput('<div class="text-amber-400 animate-pulse">Checking HaveIBeenPwned...</div>');
      try {
        const email = 'example@test.com';
        const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
          headers: { 'User-Agent': 'Dashboard' }
        });
        return `<div class="text-[var(--color-text-muted)]">HIBP API: ${res.status === 404 ? 'Not pwned' : 'Breached'}</div>`;
      } catch (e) {
        return '<div class="text-[var(--color-red)]">HIBP Error: Rate limited or offline</div>';
      }
    },
    'exploit-db': async () => {
      addOutput('<div class="text-[var(--color-cyan)] animate-pulse">Fetching Exploit-DB...</div>');
      try {
        const res = await fetch('https://www.exploit-db.com/api/search?type=webapps&limit=5');
        const data = await res.json();
        let output = '<div class="text-[var(--color-cyan)] font-bold mb-1">Recent Exploits:</div>';
        data.results?.slice(0, 3).forEach((e, i) => {
          output += `<div class="text-[10px] text-[var(--color-text-muted)]">[${i+1}] ${e.title || e.description}</div>`;
        });
        return output;
      } catch (e) {
        return '<div class="text-[var(--color-red)]">Exploit-DB Error</div>';
      }
    }
  };

  Object.assign(window.terminalCommands = window.terminalCommands || {}, commands);
}

// ===== INITIALIZE ALL =====
function initDashboard() {
  console.log("Initializing S1BARCH.CYBER_OPS...");

  initThemeSync();
  initPanelPersistence();
  initDragDropNodes();
  initSearch();
  initNodeManagement();
  initTerminalFullscreen();
  addApiCommands();
  initMatrix();
  initClocks();
  initSystemStats();
  initTerminal();
  initIntelStream();
  initTodo();

  console.log("Dashboard initialized successfully!");
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}
