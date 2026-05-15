# Dashboard Complete Features Manual

## 📊 WIDGET: System Stats
**Location:** Top right of header

### Displays
- **CPU:** Real-time usage percentage + progress bar
- **RAM:** Real-time usage percentage + progress bar
- **Hardware:** CPU model, GPU list

### Updates
- Every 2 seconds from local API
- API endpoint: `http://localhost:9999/api/stats`
- Shows actual hardware info on startup

### Colors
- Bar gradient: Green → Cyan
- Warning colors: Pink/Red on high usage (>70%)

---

## ⏰ CLOCKS: Time Display
**Location:** Top widget area (3 clocks)

### Header Clock
- Current system timezone
- Displayed in header

### London Clock
- UTC equivalent time
- `Europe/London` timezone

### Thailand Clock
- Asia/Bangkok timezone
- Red-colored widget

### Update Rate
- Every 1 second
- Format: `HH:MM:SS`

---

## 🔍 SEARCH MODAL
**Hotkey:** `Ctrl+K`

### Features
1. **Real-time filtering**
   - Type to search all content
   - Results update as you type
   - Max 10 results shown

2. **Searchable Content**
   - Link names (identity hub, neural net, etc.)
   - Panel titles
   - Node labels
   - Command names

3. **Navigation**
   - Click result to navigate
   - Results close on click
   - `Escape` to close without action

### Example Searches
```
"github"        → Finds "github_central" link
"exploit"       → Finds "exploit_database" link
"id"            → Finds "identity_link_hub" panel
"hacker"        → Finds "HackerNews" nodes
```

---

## ➕ NODE MANAGEMENT
**Button:** `[+]` next to "VISUAL_NODES"

### Add Node
1. Click `[+]` button
2. Modal appears with:
   - URL input field
   - Label input field
   - SAVE button
   - CANCEL button

3. Enter data:
   - URL: Full URL (https://...)
   - Label: Display name (max ~15 chars for UI)

4. Click SAVE:
   - Node created with custom SVG icon
   - Added to visual grid
   - Order saved automatically

### Delete Node
1. Hover over any node (new or existing)
2. `[X]` button appears in top-right of node
3. Click `[X]` to delete
4. Node removed + localStorage updated

### Persistence
- All nodes saved in `s1barch_node_order`
- Survives page reload
- Drag & drop reorders automatically

### Node Styling
- Icon: Plus symbol for new nodes
- Hover: Shows cyan border
- Delete button: Red `[X]`

---

## 🎯 DRAG & DROP NODES
**Feature:** Reorganize visual nodes

### How To Use
1. **Grab node:** Click and hold on any node
2. **Drag:** Move to new position (visual feedback)
3. **Drop:** Release mouse
4. **Persist:** Order saved automatically

### Visual Feedback
- **During drag:** Cyan glow + scale 1.05
- **Ghost node:** 0.4 opacity when dragging
- **After drop:** Node settles in new position

### Compatibility
- Works on all browsers with SortableJS
- Mobile: Long-press to drag
- Persistent across sessions

---

## 🎨 PANEL COLLAPSE/EXPAND
**Button:** `[-]` in each panel header

### Panels (10 total)
1. **IDENTITY_LINK_HUB** - GitHub, portfolio, Steam
2. **NEURAL_NET** - AI tools (Ollama, Perplexity, Kimi)
3. **INTEL_GATHERING** - Security tools (Shodan, Exploit-DB, CVE)
4. **GAMER_GRIMOIRE** - Gaming guides
5. **SYSTEM_CORE** - Email, Wiki
6. **MALWARE_LAB** - Analysis tools
7. **TOOLKIT** - CyberChef, JWT
8. **TODO_LIST** - Tasks
9. **THREAT_INTEL** - Live stream
10. **OPERATOR_BANNER** - Hero image

### Usage
- Click `[-]` to collapse (becomes `[+]`)
- Click `[+]` to expand
- State persisted in `s1barch_panels` localStorage

### State Persistence
- Collapsed/expanded state stored per session
- Remembers on page reload
- Each panel independent

---

## 💻 TERMINAL (Normal Mode)
**Location:** Bottom of dashboard

### Available Commands
```
help              Show all commands
clear             Clear output
date              Show datetime
whoami            Current user
version           Dashboard version
status            System status
banner            S1BGr0up banner
threats           Latest CVEs
intel             HackerNews security
pwned             HIBP breach check
exploit-db        Latest exploits
shodan            Shodan API info
virustotal        VirusTotal API info
```

### Features
1. **Command History**
   - `Up/Down` arrows navigate history
   - Saved across session
   - Auto-completes on arrow navigation

2. **Autocomplete**
   - Type command start + `Tab`
   - Dropdown shows suggestions
   - Real-time as you type

3. **Suggestions**
   - Dropdown appears while typing
   - Max 10 suggestions
   - Click or Tab to select

4. **Command Modes**
   - Sync commands (help, clear, whoami)
   - Async commands (threats, intel, pwned, exploit-db)
   - Error handling for all

### Output Features
- Syntax coloring by message type
- Auto-scroll to latest output
- Max output height: 200px (scrollable)
- Clear button to reset

---

## 🖥️ TERMINAL FULLSCREEN
**Button:** `[⛶]` in terminal header

### Enter Fullscreen
1. Click `[⛶]` button
2. Modal opens fullscreen
3. Terminal output copied
4. Input field focused

### Use Fullscreen
- Type commands normally
- Press `Enter` to execute
- Output appended to history
- Auto-scrolls on new content
- Uses same command system as normal terminal

### Exit Fullscreen
1. Click `✕` button (top-right)
2. Press `Escape` key
3. Modal closes
4. Returns to normal terminal

### Advantages
- More space for output
- Better for long commands
- Dedicated focus
- Syntax color preserved

---

## 📡 THREAT INTEL STREAM
**Location:** `THREAT_INTEL [GLOBAL_STREAM]` panel

### Real-Time Data
- **Sources:**
  - HackerNews API (security stories)
  - NVD/NIST CVE database
  - Local mock events

- **Update Rate:** Every 8-16 seconds
- **Max Events:** 15 visible (older removed)

### Event Types
```
[CRITICAL]  Red text - High severity CVEs
[ALERT]     Amber text - Medium severity
[SYSTEM]    Cyan text - Local system events
[INFO]      Gray text - News/updates
```

### Features
- Hover events for details
- New events appear at top
- Auto-fetch from APIs
- Fallback to local data

### API Integrations
1. **HackerNews**
   - Filters for security keywords
   - Top stories feed
   - Non-blocking fetch

2. **NVD CVE**
   - Latest vulnerability data
   - Published CVEs
   - Non-blocking fetch

3. **Local Events**
   - Fallback if APIs fail
   - Always present
   - Mix with real data

---

## 🎬 THEME SYNC (Dark/Light)
**Feature:** Auto-sync with system preferences

### How It Works
1. **On Load:** Detects `prefers-color-scheme`
2. **Auto Apply:** Sets dark or light theme
3. **Monitor:** Listens for system preference changes
4. **Update:** Applies theme instantly

### Storage
- Saved in `s1barch_theme` localStorage
- `dark` or `light` value
- Can be manually overridden

### CSS Variables
- Light theme: Light backgrounds, dark text
- Dark theme: Dark backgrounds, light text
- All panels responsive to theme

### Toggle
- System preference changes theme automatically
- Manual change via localStorage dev tools
- No button needed (uses OS setting)

---

## ✅ TODO LIST
**Location:** `TODO_LIST [MISSIONS]` panel

### Add TODO
1. Type in input field (red border)
2. Click `[ADD]` button or press `Enter`
3. TODO appended to list

### Features
- **Display:** `[!] <task>`
- **Remove:** Click `[REMOVE]` button
- **Hover:** Remove button appears on hover
- **Persistence:** Saved in `s1barch_todos` localStorage

### Data Format
```javascript
localStorage.getItem('s1barch_todos')
// Returns: ["task1", "task2", "task3"]
```

### Styling
- Red border (alert color)
- Input with placeholder "NEW_OBJ..."
- Dark background
- List items with remove buttons

---

## 🔐 SECURITY COMMANDS EXPLAINED

### `threats` Command
```
Fetches latest CVEs from NIST NVD API
Shows: CVE ID + Description (first 50 chars)
Format: [CVE-YYYY-XXXXX] - Description...
Updates: Latest 3 CVEs
```

### `intel` Command
```
Scans HackerNews for security stories
Filters for: security, exploit, vulnerability, breach
Shows: 3 most recent matching stories
Title truncated to 55 chars
Updates: Real-time HN feed
```

### `pwned` Command
```
Checks HaveIBeenPwned database
Uses: Default email (test@example.com)
Returns: "Not pwned" or "Breached"
API: https://haveibeenpwned.com/api/v3/
Rate limit: May block requests
```

### `exploit-db` Command
```
Fetches from Exploit-DB API
Shows: Latest 3 exploits
API: https://www.exploit-db.com/api/
Includes: Title, description
Updates: Real-time

### `shodan` Command
```
Shows setup instructions
Requires: SHODAN API key
Source: https://shodan.io
Status: Requires manual setup
```

### `virustotal` Command
```
Shows setup instructions
Requires: VirusTotal API key
Source: https://www.virustotal.com
Status: Requires manual setup
```

---

## 🎯 FEATURED PROJECT
**Section:** Top of dashboard (purple border)

### Display
- Project icon (shield)
- Project name: "int3rceptor"
- Description (2-3 lines)
- Tech stack tags
- GitHub link

### Project Details
```
Name: int3rceptor
Desc: Next-gen HTTP/HTTPS intercepting proxy
Tech: Rust, Vue.js, network library
Repo: https://github.com/S1b-Team/int3rceptor
Status: Stable Release
```

### Styling
- Purple border/accent
- Hover effects on tags
- External link icon
- Responsive layout

---

## 🌐 QUICK TOOLS BAR
**Location:** Below terminal

### Available Tools
```
nmap, rustscan, gobuster, sqlmap, hydra
msfconsole, burp, wireshark
```

### Function
- Placeholders for tool integration
- Click to spawn tool (if configured)
- Visual reference of common tools

---

## 📊 RESPONSIVE DESIGN

### Breakpoints
- **Mobile** (<768px): Stacked layout
- **Tablet** (768-1024px): 2 columns
- **Desktop** (>1024px): 3 columns

### Widget Behavior
- **Mobile:** Full width, single column
- **Tablet:** Node grid = 5 columns
- **Desktop:** Node grid = 10 columns (default)

### Touch Support
- Drag & drop works on touch (long-press)
- Modals touch-friendly
- Full functionality on mobile

---

## 🔄 PERSISTENCE SUMMARY

### localStorage Keys
```javascript
s1barch_panels          // Panel collapse states
s1barch_theme           // dark/light preference
s1barch_node_order      // Node order + custom nodes
s1barch_todos           // TODO list items
```

### What Persists
✓ Panel collapse/expand states
✓ Custom nodes (added with [+])
✓ Node order (from drag & drop)
✓ TODO items
✓ Theme preference (dark/light)
✓ Terminal command history (session)

### What Doesn't Persist
✗ Terminal output (cleared on reload)
✗ Command history (session-based)
✗ Threat intel stream (live data)

---

## ⚡ PERFORMANCE NOTES

- **Update rates:**
  - System stats: 2s
  - Clocks: 1s
  - Threat intel: 8-16s
  - localStorage: On-change

- **Limits:**
  - Max threat events: 15
  - Max search results: 10
  - Max todo items: Unlimited
  - Max custom nodes: Unlimited

- **Optimizations:**
  - Debounced search
  - Async API calls
  - Non-blocking updates
  - CSS GPU acceleration

---

## 🐛 DEBUGGING TIPS

### Check localStorage
```javascript
// In browser console (F12)
localStorage.getItem('s1barch_panels')
localStorage.getItem('s1barch_node_order')
localStorage.clear()  // Reset all
```

### Check API Status
```bash
curl http://localhost:9999/api/stats
```

### Check Console
- F12 → Console tab
- Look for errors in red
- Check initDashboard() logs

### Reset Everything
```javascript
// Clear all dashboard data
localStorage.clear()
location.reload()
```

---

## 📞 COMMON ISSUES

| Issue | Solution |
|-------|----------|
| Nodes won't delete | Refresh page, check F12 console |
| Theme not changing | Clear `s1barch_theme` key |
| Terminal slow | Too many events - clear todos |
| APIs not responding | Check internet, restart server |
| Search not filtering | Ensure Ctrl+K opens modal |
| Panels won't collapse | Check F12 for JS errors |

---

**Last Updated:** Dashboard v2.0 Complete  
**Status:** All features tested ✓
