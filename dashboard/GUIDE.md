# S1BGr0up Cyber Arsenal - Complete Guide
**Qutebrowser + Dashboard Configuration | Red Team Operator Setup**

---

## 🎯 QUICK START

**Access Dashboard:** `,h` or `home` command in qutebrowser  
**Dashboard URL:** `http://localhost:9999/dashboard/index.html`  
**Server Status:** Runs on port 9999

---

## 📋 DASHBOARD FEATURES

### 1. Search Global (Ctrl+K)
- Open search modal with **Ctrl+K**
- Filter links, commands, panels in real-time
- Click result to navigate
- Press **Escape** to close

### 2. Node Management
- Click **[+]** button to add custom nodes
- Enter URL and custom label
- Nodes persist in localStorage
- Click **[X]** on node to delete
- Drag & drop to reorganize (persistent)

### 3. Panel Collapse/Expand
- Each panel has **[-]** collapse button
- States saved per session
- Panels: Identity Hub, Neural Net, Intel Gathering, System Core, Malware Lab, Toolkit, TODO List, Threat Intel, Operator Banner

### 4. Terminal (Fullscreen Mode)
- Click **[⛶]** to enter fullscreen terminal
- **Esc** or X button to exit
- All commands work in fullscreen
- Output auto-scrolls
- Use **Ctrl+K** for global search while in terminal

### 5. Threat Intel Stream (Live)
- Real-time events from HackerNews and CVE databases
- Auto-updates every 8-16 seconds
- Mixing local events + actual security data
- Click events for more details

### 6. System Stats
- **CPU/RAM** usage bars (updates every 2 seconds)
- **Hardware info** (CPU model, GPU list)
- Requires local API server (`:9999/api/stats`)

### 7. Clock Displays
- **Header clock** (current timezone)
- **London time** (UTC equivalent)
- **Thailand time** (Asia/Bangkok)

### 8. Theme Sync
- **Dark/Light mode** auto-syncs with system preferences
- Manual override via localStorage
- Applies instantly across dashboard

---

## 💻 TERMINAL COMMANDS

Type in dashboard terminal (bottom of page):

### Core Commands
```
help              Show all available commands
clear             Clear terminal output
date              Show current date/time
whoami            Show current user
version           Show dashboard version
status            Show system status
banner            Show S1BGr0up banner
```

### Security Commands
```
threats           Fetch latest CVEs from NIST
intel             Scan HackerNews security stories
pwned             Check HaveIBeenPwned database (HIBP)
exploit-db        Fetch latest exploits from Exploit-DB
shodan            Show Shodan setup info (requires API key)
virustotal        Show VirusTotal setup info (requires API key)
```

### Command Features
- **Up/Down arrows** - Navigate command history
- **Tab** - Auto-complete commands
- **Real-time suggestions** - Dropdown appears while typing
- **Async execution** - Long-running commands show loading state

---

## ⌨️ QUTEBROWSER KEYBINDINGS

### Navigation
```
j                 Scroll down
k                 Scroll up
h                 Scroll left
l                 Scroll right
gg                Scroll to top
G                 Scroll to bottom
d                 Scroll page down (50%)
u                 Scroll page up (50%)
```

### Tab Management
```
t                 Open new tab
T                 Open new tab with current URL
x                 Close tab
X                 Undo close tab
J                 Previous tab
K                 Next tab
gt                Next tab
gT                Previous tab
g$                Go to last tab
g0                Go to first tab
gm                Move tab (prompt for position)
gM                Move tab to left
```

### URL & Search
```
o                 Open URL (command mode)
O                 Open URL (fill current URL)
go                Open URL in command mode
/                 Search forward
?                 Search backward
n                 Next search result
N                 Previous search result
```

### Hints (Link Clicking)
```
f                 Click link in current page
F                 Click link in new tab
;o                Open link
;t                Open link in new tab
;v                Play link in mpv
;p                Open link in zathura (PDF)
;d                Download link
;y                Copy link to clipboard
;Y                Copy link (primary selection)
```

### Clipboard & Zoom
```
yy                Copy current page URL
yY                Copy page title + URL
pp                Open clipboard URL
pP                Open clipboard URL in new tab
+                 Zoom in
-                 Zoom out
=                 Reset zoom
```

### Marks & Navigation
```
m                 Set mark at current position
'                 Jump to mark
`                 Jump to mark
H                 Go back (browser history)
L                 Go forward (browser history)
r                 Reload page
R                 Force reload (bypass cache)
```

### Settings Toggle
```
ts                Toggle JavaScript (enabled/disabled)
td                Toggle cookies (all/no-3rdparty/never)
ti                Toggle images
tp                Toggle plugins
```

### External Tools
```
,m                Play current URL in mpv
,d                Download video with yt-dlp
,p                Open URL in zathura (PDF)
,h                Open dashboard (home)
```

### System Shortcuts
```
Ctrl+t            Open new tab
Ctrl+w            Close tab
Ctrl+Tab          Next tab
Ctrl+Shift+Tab    Previous tab
Ctrl+Shift+t      Undo close tab
Ctrl+l            Clear messages
```

---

## 🔍 SEARCH ENGINES

Quick search shortcuts (type in address bar):

```
DEFAULT           DuckDuckGo
g <query>         GitHub search
gh <user/repo>    GitHub direct
gl <query>        GitLab search
so <query>        Stack Overflow
r <crate>         Crates.io
rust <query>      Rust docs
py <module>       Python docs
arch <package>    Arch Wiki
man <command>     Man pages
cve <term>        CVE database
exploit <term>    Exploit-DB
nvd <term>        NVD vulnerability DB
w <term>          Wikipedia
yt <query>        YouTube
aur <package>     AUR packages
perplexity <q>    Perplexity AI
kimi <query>      Kimi AI
```

### Usage Examples:
```
:open g my-project
:open py threading
:open cve CVE-2024
:open man grep
```

---

## 📝 COMMAND MODE SHORTCUTS

In command mode (after typing `:` or search `/`):

```
Ctrl+a            Go to line start
Ctrl+e            Go to line end
Ctrl+k            Kill line (delete to end)
Ctrl+u            Delete line
Ctrl+w            Delete word
Ctrl+y            Paste
Ctrl+f            Forward one character
Ctrl+b            Back one character
Alt+f             Forward one word
Alt+b             Back one word
Ctrl+n            Next command (history)
Ctrl+p            Previous command (history)
Up/Down           Command history
Tab               Next completion
Shift+Tab         Previous completion
```

---

## 🎨 CUSTOM ALIASES

Type these in command mode:

```
q                 Quit
qa                Quit & save session
w                 Save session
wq                Quit & save
x                 Quit & save
h                 Help
bd                Close tab
bD                Close other tabs
bn                Next tab
bp                Previous tab
bN                Previous tab
bf                Focus tab (+ number)
bm                Add bookmark
bma               Add bookmark
bmd               Delete bookmark
bml               List bookmarks
bms               Load bookmark
adblock-update    Update ad/host blocklists
mpv               Play URL in mpv
dl                Download with yt-dlp
home              Open dashboard
```

---

## 🔐 SECURITY & PRIVACY SETTINGS

### Toggleable (via keybinds)
- `ts` - JavaScript enable/disable
- `ti` - Images enable/disable
- `tp` - Plugins enable/disable
- `td` - Cookie policy (all / no-3rdparty / never)

### Enabled by Default
- HTTPS enforcement (blocks cert errors)
- AdBlock + EasyList + Fanboy lists
- DoH (DNS-over-HTTPS)
- DNS prefetch (speed)
- Canvas/WebGL protection
- Notifications enabled
- Autoplay enabled

### Cookies & Tracking
- All cookies accepted (compatibility)
- Smart tracking protection
- Fanboy's annoyance list blocks trackers
- Hosts blocklist from StevenBlack

---

## 💾 PERSISTENCE & DATA

### localStorage Keys (Dashboard)
```
s1barch_panels       Panel collapse states
s1barch_theme        Dark/light mode preference
s1barch_node_order   Custom node order (drag & drop)
s1barch_todos        TODO list items
```

### Session Management
- Auto-saves session every 15 seconds
- Lazy restore on startup
- `:w` to save session manually
- `:quit --save` to quit & save

### Downloads
- Location: `/home/il1v3y/Downloads`
- Auto-removes finished after 30s (optional)
- Opens with external dispatcher (unconfigured)

---

## 🚀 PERFORMANCE TIPS

1. **Lazy restore** enabled - faster startup
2. **Per-site process model** - better stability
3. **128MB cache** - optimized for modern sites
4. **Smooth scrolling** - better UX
5. **Autoplay** enabled - streaming sites work
6. **WebGL + Canvas** enabled - games/3D works

### System Requirements
- 4GB RAM minimum
- Modern GPU for WebGL
- Python 3.8+
- Linux (Arch recommended)

---

## 🔧 QUICK CONFIG TWEAKS

Edit `~/.config/qutebrowser/config.py`:

### Disable Dark Mode
```python
c.colors.webpage.darkmode.enabled = False
```

### Change Search Engine
```python
c.url.searchengines['DEFAULT'] = 'https://google.com/?q={}'
```

### Add Custom Keybind
```python
c.bindings.commands['normal']['<custom-key>'] = 'command'
```

### Change Home Page
```python
c.url.default_page = 'https://example.com'
```

### Toggle Notifications
```python
c.content.notifications.enabled = False
```

---

## 📂 FILE STRUCTURE

```
~/.config/qutebrowser/
├── config.py                 [Main config file]
├── dashboard/
│   ├── index.html           [Dashboard UI]
│   ├── js/
│   │   └── dashboard-init.js [All features]
│   ├── css/
│   │   ├── main.css         [Theme + vars]
│   │   └── components.css   [Components styling]
│   ├── assets/
│   │   └── operator.png     [Hero image]
│   └── server.py            [Local API server]
├── bookmarks/
├── cookies
├── sessions/
└── data/
```

---

## 🌐 LOCAL SERVICES

### Dashboard Server
```bash
# Auto-runs on startup via systemd or start-dashboard-server.sh
# Provides: /dashboard/index.html + /api/stats

Port: 9999
Status endpoint: http://localhost:9999/api/stats
Dashboard: http://localhost:9999/dashboard/index.html
```

### API Endpoints
```
GET /api/stats
  Returns: {"cpu": 15.2, "ram": 42.8, "hardware": {...}}
  Used by: System Stats widget

GET /dashboard/index.html
  Full dashboard page
```

---

## 🎮 GAMING & MEDIA

### Play Videos
```
,m                Play in mpv (external player)
yt <query>        Search YouTube
```

### Download Content
```
,d                Download with yt-dlp
dl <url>          Download video via alias
```

### PDF Viewing
```
;p                Open PDF in zathura
,p                Open URL as PDF in zathura
```

---

## ⚠️ TROUBLESHOOTING

### Dashboard Not Loading
```bash
# Check server
curl http://localhost:9999/api/stats

# Restart server
pkill -f "python.*server.py"
python /home/il1v3y/.config/qutebrowser/dashboard/server.py &
```

### Keybinds Not Working
- Ensure you're in **normal mode** (press `Escape`)
- Check `:bind` to see current bindings
- Restart qutebrowser

### localStorage Not Persisting
- Check browser console (F12)
- Clear cache: `:clear-data`
- Reset localStorage: Delete `s1barch_*` keys

### JS Disabled
- Toggle with `ts` keybind
- Check status: `status` in terminal

---

## 📊 STATS & METRICS

**Current Setup:**
- Config lines: 500+
- Keybinds: 80+
- Dashboard features: 8 major
- Terminal commands: 15+
- Search engines: 14
- Aliases: 20+

---

## 🎯 COMMON WORKFLOWS

### Research Workflow
```
1. Open new tab: t
2. Search: o cve <term>
3. Open links: f
4. Copy URL: yy
5. Next result: n
```

### Security Task
```
1. Open terminal in dashboard: ,h
2. Check threats: threats
3. Search intel: intel
4. Check HIBP: pwned
5. Search exploits: exploit-db
```

### Video Watching
```
1. Search: o yt <query>
2. Open result: f
3. Play in mpv: ,m
4. Download: ,d (in new tab)
```

### Bookmark Management
```
1. Add: bm
2. List: bml
3. Load: bms
4. Delete: bmd
```

---

## 🔗 EXTERNAL LINKS

- **Qutebrowser Docs:** `man qutebrowser`
- **Dashboard Repo:** Local only
- **Config Location:** `~/.config/qutebrowser/`
- **Logs:** `~/.local/share/qutebrowser/`

---

## 📝 VERSION INFO

- **Dashboard:** v2.0 (Phases 1-4 + all features)
- **Config:** S1BGr0up Cyber Arsenal Edition
- **Last Updated:** 2026-02-04
- **Status:** Production Ready ✓

---

**Last Command:** See terminal history with Up/Down arrows  
**Need Help?** Type `help` in dashboard terminal
