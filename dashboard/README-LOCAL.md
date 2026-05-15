# S1BGr0up Cyber Arsenal - Local Documentation
**Start here for your qutebrowser + dashboard configuration**

---

## 📖 Documentation Files

### 1. **GUIDE.md** (Main Reference)
Complete guide covering everything:
- Dashboard features (detailed)
- All qutebrowser keybinds
- Search engines
- Command mode shortcuts
- Security settings
- Troubleshooting

**👉 Start here for full understanding**

### 2. **CHEATSHEET.md** (Quick Reference)
One-page reference card:
- Must-know shortcuts
- Common workflows
- Terminal commands
- Dashboard quick tips
- Print-friendly format

**👉 Keep at your desk for quick lookup**

### 3. **DASHBOARD-FEATURES.md** (Dashboard Deep Dive)
Detailed dashboard documentation:
- Every widget explained
- All terminal commands
- Theme system
- Persistence mechanisms
- API integrations
- Debugging tips

**👉 Read for dashboard-specific questions**

---

## 🚀 QUICK START (5 min)

### 1. Open Dashboard
```
In qutebrowser: ,h
Or navigate to: http://localhost:9999/dashboard/index.html
```

### 2. First Actions
- `Ctrl+K` - Try search
- `[+]` button - Add a custom node
- `[⛶]` - Try fullscreen terminal
- Type `help` - See all commands

### 3. Essential Keybinds
```
,h              Go to dashboard
ts              Toggle JavaScript
Ctrl+K          Search (in dashboard)
t               New tab
x               Close tab
f               Click link
```

### 4. Terminal Commands
```
help            List all commands
threats         Latest CVEs
intel           Security news
pwned           Breach check
```

---

## 📍 Where Everything Is

### Configuration
```
~/.config/qutebrowser/config.py
├── Keybinds (80+)
├── Search engines (14)
├── Colors/Theme
└── Aliases (20+)
```

### Dashboard
```
~/.config/qutebrowser/dashboard/
├── index.html           (UI)
├── js/dashboard-init.js (Features)
├── css/main.css         (Theme)
├── css/components.css   (Styling)
├── server.py            (API server)
└── assets/              (Images)
```

### Local Storage (Browser)
```javascript
s1barch_panels       // Panel states
s1barch_theme        // Dark/light mode
s1barch_node_order   // Node positions
s1barch_todos        // TODO items
```

---

## 🎯 Common Workflows

### Workflow 1: Security Research
```
1. ,h              → Open dashboard
2. Ctrl+K          → Search
3. Type "exploit"  → Find exploit database
4. Type "threats"  → Check latest CVEs
5. Type "intel"    → Read HackerNews security
```

### Workflow 2: Bookmarking
```
1. t               → New tab
2. Search (/)      → Find page
3. f               → Open link
4. yy              → Copy URL
5. bm              → Bookmark
```

### Workflow 3: Adding Custom Nodes
```
1. ,h              → Dashboard
2. Click [+]       → Add node modal
3. Enter URL + name → Create node
4. Drag to reorder → Customize
```

### Workflow 4: Terminal Commands
```
1. ,h              → Dashboard
2. Type "help"     → See all commands
3. Type "threats"  → Get CVEs
4. [⛶]            → Fullscreen mode
```

---

## ⚡ Power Features

### Search (Ctrl+K)
- Search all links, panels, commands
- Real-time filtering
- Max 10 results
- Click to navigate

### Node Management
- Add nodes with `[+]` button
- Delete with `[X]` button
- Drag to reorder
- All persists automatically

### Terminal
- 15+ commands available
- History with Up/Down arrows
- Autocomplete with Tab
- Fullscreen with `[⛶]`

### APIs
- HackerNews (real-time security news)
- NVD CVE database
- HaveIBeenPwned (breach check)
- Exploit-DB (latest exploits)

### Theme
- Auto-syncs with system (dark/light)
- Applies instantly
- Survives reload
- CSS variable-based

---

## 🔧 Customization Quick Tips

### Add Keybind
Edit `config.py`:
```python
c.bindings.commands['normal']['<your-key>'] = 'command'
```

### Change Home Page
```python
c.url.default_page = 'https://example.com'
```

### Add Search Engine
```python
c.url.searchengines['alias'] = 'https://search.com/?q={}'
```

### Toggle Dark Mode
In browser:
```javascript
// Temporarily (this session)
document.documentElement.classList.add('light-theme')

// Permanently (in qutebrowser):
:config-set colors.webpage.darkmode.enabled false
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Dashboard won't load | Check: `curl http://localhost:9999/api/stats` |
| Keybinds don't work | Press Escape, ensure normal mode |
| Search not working | Try Ctrl+K again, check F12 console |
| Theme not changing | Clear `s1barch_theme` in localStorage |
| Nodes won't delete | Refresh page, F12 console for errors |
| Terminal slow | Close other tabs, reload |
| APIs not responding | Check internet connection |

---

## 📚 Learning Path

### Day 1: Basics
1. Read CHEATSHEET.md
2. Learn 5 key keybinds (j,k,f,t,x)
3. Try dashboard search (Ctrl+K)
4. Add one custom node

### Day 2: Intermediate
1. Read GUIDE.md (first 3 sections)
2. Learn search engines (`:open g <query>`)
3. Try terminal commands
4. Customize a keybind

### Day 3: Advanced
1. Read DASHBOARD-FEATURES.md
2. Learn all terminal commands
3. Explore API integrations
4. Master theme system

### Mastery: Continuous
1. Use cheatsheet daily
2. Reference GUIDE.md as needed
3. Customize for your workflow
4. Create aliases for common tasks

---

## 🔗 Quick Links (In-Dashboard)

### Search Shortcuts (type in address bar)
```
:open g <repo>       → GitHub search
:open r <crate>      → Rust crates
:open py <module>    → Python docs
:open cve <term>     → CVE search
:open arch <pkg>     → Arch Wiki
```

### Terminal Commands
```
help                 → All commands
threats              → CVEs
intel                → Security news
status               → System info
pwned                → Breach check
```

### Hotkeys
```
,h                   → Home (dashboard)
,m                   → Play in mpv
,d                   → Download
,p                   → Open PDF
```

---

## 📊 Current Setup Summary

| Aspect | Count |
|--------|-------|
| Keybinds | 80+ |
| Search engines | 14 |
| Aliases | 20+ |
| Dashboard widgets | 8 |
| Terminal commands | 15+ |
| Panel types | 10 |
| API integrations | 4 |

---

## 💡 Pro Tips

1. **Speed up searches:** Add search engines in config
2. **Custom hotkeys:** Map `,<letter>` for common tasks
3. **Terminal boost:** Use `threats` command daily for CVE updates
4. **Node organization:** Drag nodes by category (tools, social, security)
5. **Theme toggle:** Sync with system → instant dark/light switch
6. **Session save:** `:w` to save, `:qa` to quit & save
7. **Bookmark quick:** `bm` to add, `bms` to load
8. **Search everywhere:** Ctrl+K works in terminal fullscreen too

---

## 🎮 Your Setup Highlights

✅ **80+ vim-style keybinds** - Fast navigation  
✅ **Custom dashboard** - All tools in one place  
✅ **Theme sync** - Dark/light mode automatic  
✅ **Node management** - Add/customize bookmarks  
✅ **Terminal integration** - Run security commands  
✅ **Real-time threat intel** - CVE + HackerNews feed  
✅ **4 API integrations** - Shodan, VirusTotal, HIBP, Exploit-DB  
✅ **Full persistence** - Everything saved locally  

---

## 📞 Support

**For detailed info:**
1. Check GUIDE.md (comprehensive reference)
2. Check CHEATSHEET.md (quick lookup)
3. Check DASHBOARD-FEATURES.md (widget details)

**For bugs:**
1. F12 → Console for errors
2. Check localhost:9999/api/stats
3. Clear localStorage if needed

---

## 🔐 Security Notes

- All data stored locally (no cloud)
- localStorage only (no cookies leak)
- HTTPS enforced
- JS toggle-able with `ts`
- No telemetry
- Open source (config visible)

---

## 🎯 Next Steps

1. **Now:** Read CHEATSHEET.md (5 min)
2. **Today:** Try 3 new keybinds
3. **This week:** Master terminal commands
4. **This month:** Fully customize config

---

**Version:** 2.0 Complete (All features + testing done)  
**Last Updated:** 2026-02-04  
**Status:** Production Ready ✓

---

**Happy hacking!** 🚀

Bookmark CHEATSHEET.md for quick reference.  
Keep GUIDE.md nearby for deep dives.  
Use DASHBOARD-FEATURES.md for troubleshooting.
