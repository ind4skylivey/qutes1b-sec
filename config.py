# vim: ft=python
"""
Qutebrowser Configuration - FLAWLESS EXPERIENCE MODE
Red Team Operator Setup | S1BGr0up
Target: Arch Linux + dwm + Full Modern Web Experience

Zen Browser replacement with vim controls + privacy + power
"""

import os

# Load autoconfig
config.load_autoconfig(False)

# =============================================================================
# SECTION 1: MODERN WEB EXPERIENCE (JavaScript & Media Enabled)
# =============================================================================

# Enable JavaScript for full web experience
c.content.javascript.enabled = True

# Enable WebGL for 3D graphics, games, modern web apps
c.content.webgl = True

# Enable canvas reading (required for many modern sites)
c.content.canvas_reading = True

# Enable media capture (video calls, streaming)
c.content.media.audio_capture = True
c.content.media.video_capture = True
c.content.media.audio_video_capture = True

# Enable autoplay (YouTube, streaming sites)
c.content.autoplay = True

# Enable notifications (optional - set to False if annoying)
c.content.notifications.enabled = True
c.content.notifications.show_origin = True

# Enable desktop capture (screen sharing)
c.content.desktop_capture = True

# Enable geolocation (optional)
c.content.geolocation = True

# Enable plugins (PDF viewer, etc)
c.content.plugins = True

# Enable PDF.js for in-browser PDF viewing
c.content.pdfjs = True

# =============================================================================
# SECTION 2: SECURITY & PRIVACY (Balanced)
# =============================================================================

# HTTPS enforcement
c.content.tls.certificate_errors = 'block'

# Cookie settings - accept all for compatibility
c.content.cookies.accept = 'all'
c.content.cookies.store = True

# Smart tracking protection
c.content.blocking.enabled = True
c.content.blocking.method = 'both'
c.content.blocking.adblock.lists = [
    'https://easylist.to/easylist/easylist.txt',
    'https://easylist.to/easylist/easyprivacy.txt',
    'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
]

# Hosts blocking
c.content.blocking.hosts.lists = [
    'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
]

# User agent - modern Chrome
c.content.headers.user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

# DNS prefetch for speed
c.content.dns_prefetch = True

# =============================================================================
# SECTION 3: PERFORMANCE & SPEED
# =============================================================================

# Process model
c.qt.chromium.process_model = 'process-per-site-instance'

# Cache settings
c.content.cache.size = 134217728  # 128MB

# Enable smooth scrolling
c.scrolling.smooth = True

# Session management
c.session.lazy_restore = True
c.auto_save.interval = 15000
c.auto_save.session = True

# =============================================================================
# SECTION 4: SEARCH ENGINES
# =============================================================================

# Dashboard as homepage - using HTTP server to avoid file:// restrictions
c.url.default_page = 'http://localhost:9999/dashboard/index.html'
c.url.start_pages = ['http://localhost:9999/dashboard/index.html']

c.url.searchengines = {
    'DEFAULT': 'https://duckduckgo.com/?q={}',
    'g': 'https://github.com/search?q={}',
    'gh': 'https://github.com/{}',
    'gl': 'https://gitlab.com/search?search={}',
    'so': 'https://stackoverflow.com/search?q={}',
    'r': 'https://doc.rust-lang.org/std/?search={}',
    'rust': 'https://doc.rust-lang.org/std/?search={}',
    'crates': 'https://crates.io/search?q={}',
    'py': 'https://docs.python.org/3/search.html?q={}',
    'arch': 'https://wiki.archlinux.org/index.php?search={}',
    'man': 'https://man.archlinux.org/search?q={}',
    'cve': 'https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword={}',
    'exploit': 'https://www.exploit-db.com/search?q={}',
    'nvd': 'https://nvd.nist.gov/vuln/search/results?form_type=Basic&results_type=overview&search_type=all&query={}',
    'w': 'https://en.wikipedia.org/wiki/Special:Search?search={}',
    'yt': 'https://www.youtube.com/results?search_query={}',
    'aw': 'https://wiki.archlinux.org/index.php?search={}',
    'aur': 'https://aur.archlinux.org/packages/?K={}',
    'perplexity': 'https://www.perplexity.ai/search?q={}',
    'kimi': 'https://kimi.moonshot.cn/?q={}',
}

# =============================================================================
# SECTION 5: KEYBINDINGS (Vim-Style + Modern)
# =============================================================================

c.bindings.commands['normal'] = {
    # Navigation
    'j': 'scroll-px 0 40',
    'k': 'scroll-px 0 -40',
    'h': 'scroll-px -40 0',
    'l': 'scroll-px 40 0',
    'gg': 'scroll-to-perc 0',
    'G': 'scroll-to-perc 100',
    'd': 'scroll-page 0 0.5',
    'u': 'scroll-page 0 -0.5',

    # Tab management
    't': 'open -t',
    'T': 'open -t {url}',
    'x': 'tab-close',
    'X': 'undo',
    'J': 'tab-prev',
    'K': 'tab-next',
    'gT': 'tab-prev',
    'gt': 'tab-next',
    'g$': 'tab-focus -1',
    'g0': 'tab-focus 1',
    'gm': 'tab-move',
    'gM': 'tab-move -1',

    # URL operations
    'o': 'cmd-set-text -s :open',
    'O': 'cmd-set-text :open {url}',
    'go': 'cmd-set-text :open {url}',

    # Search
    '/': 'cmd-set-text /',
    '?': 'cmd-set-text ?',
    'n': 'search-next',
    'N': 'search-prev',

    # Hints
    'f': 'hint all current',
    'F': 'hint all tab',
    ';o': 'hint links fill :open {hint-url}',
    ';t': 'hint links fill :open -t {hint-url}',
    ';v': 'hint links spawn mpv {hint-url}',
    ';p': 'hint links spawn zathura {hint-url}',
    ';d': 'hint links download',
    ';y': 'hint links yank',
    ';Y': 'hint links yank-primary',

    # Clipboard
    'yy': 'yank',
    'yY': 'yank -s',
    'pp': 'open -- {clipboard}',
    'pP': 'open -t -- {clipboard}',

    # Zoom
    '+': 'zoom-in',
    '-': 'zoom-out',
    '=': 'zoom',

    # Marks
    'm': 'set-mark',
    "'": 'jump-mark',
    '`': 'jump-mark',

    # Misc
    'r': 'reload',
    'R': 'reload -f',
    'H': 'back',
    'L': 'forward',
    '<Ctrl-Shift-t>': 'undo',
    '<Ctrl-t>': 'open -t',
    '<Ctrl-w>': 'tab-close',
    '<Ctrl-Tab>': 'tab-next',
    '<Ctrl-Shift-Tab>': 'tab-prev',
    '<Ctrl-l>': 'clear-messages',

    # Quick settings toggle
    'ts': 'config-cycle content.javascript.enabled',
    'td': 'config-cycle content.cookies.accept all no-3rdparty never',
    'ti': 'config-cycle images',
    'tp': 'config-cycle content.plugins',
    'tf': 'config-cycle fonts.web.family.standard',

    # External commands
    ',m': 'spawn mpv {url}',
    ',d': 'spawn yt-dlp {url}',
    ',p': 'spawn zathura {url}',
    ',h': 'open http://localhost:9999/dashboard/index.html',
}

# Command mode bindings
c.bindings.commands['command'] = {
    '<Ctrl-a>': 'rl-beginning-of-line',
    '<Ctrl-e>': 'rl-end-of-line',
    '<Ctrl-k>': 'rl-kill-line',
    '<Ctrl-u>': 'rl-unix-line-discard',
    '<Ctrl-w>': 'rl-unix-word-rubout',
    '<Ctrl-y>': 'rl-yank',
    '<Ctrl-f>': 'rl-forward-char',
    '<Ctrl-b>': 'rl-backward-char',
    '<Alt-f>': 'rl-forward-word',
    '<Alt-b>': 'rl-backward-word',
    '<Ctrl-n>': 'command-history-next',
    '<Ctrl-p>': 'command-history-prev',
    '<Up>': 'command-history-prev',
    '<Down>': 'command-history-next',
    '<Tab>': 'completion-item-focus next',
    '<Shift-Tab>': 'completion-item-focus prev',
}

# Insert mode
c.bindings.commands['insert'] = {
    '<Ctrl-e>': 'open-editor',
    '<Escape>': 'mode-leave',
    '<Ctrl-a>': 'fake-key <Home>',
    '<Ctrl-e>': 'fake-key <End>',
}

# Hint mode
c.bindings.commands['hint'] = {
    '<Escape>': 'mode-leave',
    '<Return>': 'hint-follow',
    '<Ctrl-c>': 'mode-leave',
}

# =============================================================================
# SECTION 6: APPEARANCE (Cyberpunk Dark)
# =============================================================================

# Base colors
c.colors.webpage.bg = '#0a0a0f'
c.colors.webpage.darkmode.enabled = True

# Status bar (Premium Glass)
c.colors.statusbar.normal.bg = 'rgba(10, 10, 15, 0.7)'
c.colors.statusbar.normal.fg = '#00ffff'
c.colors.statusbar.insert.bg = 'rgba(0, 255, 65, 0.15)'
c.colors.statusbar.insert.fg = '#00ff41'
c.colors.statusbar.command.bg = 'rgba(10, 10, 15, 0.85)'
c.colors.statusbar.command.fg = '#00ffff'
c.colors.statusbar.caret.bg = 'rgba(255, 0, 60, 0.3)'
c.colors.statusbar.caret.fg = '#ffffff'
c.colors.statusbar.progress.bg = 'rgba(255, 0, 60, 0.8)'
c.colors.statusbar.url.fg = '#ff00ff'
c.colors.statusbar.url.success.http.fg = '#00ff88'
c.colors.statusbar.url.success.https.fg = '#00ffff'
c.colors.statusbar.url.error.fg = '#ff3366'

# Tabs (Premium Glass + thinner indicator)
c.colors.tabs.bar.bg = 'rgba(10, 10, 15, 0.5)'
c.colors.tabs.even.bg = 'rgba(0, 0, 0, 0)'
c.colors.tabs.even.fg = '#6b7280'
c.colors.tabs.odd.bg = 'rgba(0, 0, 0, 0)'
c.colors.tabs.odd.fg = '#6b7280'
c.colors.tabs.selected.even.bg = 'rgba(255, 0, 60, 0.25)'
c.colors.tabs.selected.even.fg = '#ffffff'
c.colors.tabs.selected.odd.bg = 'rgba(255, 0, 60, 0.25)'
c.colors.tabs.selected.odd.fg = '#ffffff'
c.colors.tabs.indicator.start = '#ff003c'
c.colors.tabs.indicator.stop = '#00ffff'
c.colors.tabs.indicator.error = '#ff6600'
c.colors.tabs.indicator.system = 'rgb'
c.tabs.indicator.width = 2

# Hints (Premium floating)
c.colors.hints.bg = 'rgba(255, 0, 60, 0.9)'
c.colors.hints.fg = '#ffffff'
c.colors.hints.match.fg = '#00ffff'

# Completion menu (Premium Glass - Fixed opacity for visibility)
c.colors.completion.category.bg = '#0a0a0f'
c.colors.completion.category.fg = '#ff003c'
c.colors.completion.even.bg = '#14141e'
c.colors.completion.odd.bg = '#0f0f19'
c.colors.completion.fg = '#e5e7eb'
c.colors.completion.match.fg = '#ff003c'
c.colors.completion.item.selected.bg = '#ff003c'
c.colors.completion.item.selected.fg = '#ffffff'

# Messages (Premium)
c.colors.messages.error.bg = 'rgba(255, 0, 60, 0.9)'
c.colors.messages.error.fg = '#ffffff'
c.colors.messages.warning.bg = 'rgba(255, 102, 0, 0.9)'
c.colors.messages.warning.fg = '#ffffff'
c.colors.messages.info.bg = 'rgba(0, 255, 255, 0.9)'
c.colors.messages.info.fg = '#0a0a0f'

# Fonts (STRING values, not lists)
c.fonts.default_family = 'JetBrains Mono'
c.fonts.default_size = '11pt'
c.fonts.web.family.standard = 'JetBrains Mono'
c.fonts.web.family.fixed = 'JetBrains Mono'
c.fonts.web.family.serif = 'JetBrains Mono'
c.fonts.web.family.sans_serif = 'JetBrains Mono'
c.fonts.hints = '12px JetBrains Mono'

# UI settings (Premium)
c.tabs.show = 'multiple'
c.tabs.position = 'top'
c.tabs.favicons.scale = 0.9
c.tabs.min_width = 100
c.tabs.max_width = 250
c.tabs.title.format = '{audio}{index}: {current_title}'
c.tabs.title.format_pinned = '{audio}{current_title}'
c.statusbar.show = 'in-mode'
c.statusbar.position = 'bottom'

# Scrolling (Premium overlay)
c.scrolling.bar = 'overlay'

# =============================================================================
# SECTION 7: DOWNLOADS & EXTERNAL HANDLERS
# =============================================================================

# Download settings
c.downloads.location.directory = '/home/il1v3y/Downloads'
c.downloads.location.prompt = False
c.downloads.location.remember = True
c.downloads.location.suggestion = 'both'
c.downloads.open_dispatcher = None
c.downloads.position = 'bottom'
c.downloads.remove_finished = 30000

# External file handlers
c.fileselect.handler = 'external'
c.fileselect.single_file.command = ['st', '-e', 'ranger', '--choosefile', '{}']
c.fileselect.multiple_files.command = ['st', '-e', 'ranger', '--choosefiles', '{}']

# =============================================================================
# SECTION 8: EDITOR & TOOLS
# =============================================================================

# Editor for text fields
c.editor.command = ['st', '-e', 'nvim', '{file}']
c.editor.encoding = 'utf-8'

# =============================================================================
# SECTION 9: ALIASES
# =============================================================================

c.aliases = {
    'q': 'quit',
    'qa': 'quit --save',
    'w': 'session-save',
    'wq': 'quit --save',
    'x': 'quit --save',
    'h': 'help',
    'bd': 'tab-close',
    'bD': 'tab-close --opposite',
    'bn': 'tab-next',
    'bp': 'tab-prev',
    'bN': 'tab-prev',
    'bf': 'tab-focus',
    'bm': 'bookmark-add',
    'bma': 'bookmark-add',
    'bmd': 'bookmark-del',
    'bml': 'bookmark-list',
    'bms': 'bookmark-load',
    'adblock-update': 'adblock-update',
    'mpv': 'spawn mpv {url}',
    'dl': 'spawn yt-dlp {url}',
    'home': 'open http://localhost:9999/dashboard/index.html',
}

# =============================================================================
# SECTION 10: NOTIFICATIONS
# =============================================================================

c.confirm_quit = ['downloads']
c.downloads.remove_finished = 30000
c.messages.timeout = 5000

# =============================================================================
# WELCOME MESSAGE
# =============================================================================
print("S1BGr0up Cyber Arsenal Loaded - OSCP Certified Red Team Operator")
print("Dashboard: ,h | JS Toggle: ts | Home: ,h")
