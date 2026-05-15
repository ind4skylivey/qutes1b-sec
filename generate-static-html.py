#!/usr/bin/env python3
"""
Generate static HTML for qutebrowser dashboard
Inlines all template includes
"""

import os
import re

# Read all section files
section_files = [
    'components/sections/featured-project.html',
    'components/sections/payload-dev.html',
    'components/sections/neural-net.html',
    'components/sections/intel-gathering.html',
    'components/sections/ctf-panel.html',
    'components/sections/system-core.html',
    'components/sections/malware-lab.html',
    'components/sections/toolkit.html',
    'components/sections/oscp-resources.html',
    'components/sections/todo-list.html',
    'components/sections/network-viz.html',
]

# Read section files content
sections = {}
for file in section_files:
    path = f'./dashboard/{file}'
    if os.path.exists(path):
        with open(path, 'r') as f:
            sections[file] = f.read()

# Read layout files
header = open('./dashboard/components/layout/header.html', 'r').read()
widgets_bar = open('./dashboard/components/layout/widgets-bar.html', 'r').read()
footer = open('./dashboard/components/layout/footer.html', 'r').read()
terminal = open('./dashboard/components/interactive/terminal.html', 'r').read()

# Build main grid with sections inline
main_grid = f'''<!-- Main Grid Layout -->
<main class="main-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sections['components/sections/featured-project.html']}
    <div class="panel-card">{sections['components/sections/payload-dev.html']}</div>
    <div class="panel-card">{sections['components/sections/neural-net.html']}</div>
    <div class="panel-card">{sections['components/sections/intel-gathering.html']}</div>
    <div class="panel-card">{sections['components/sections/ctf-panel.html']}</div>
    <div class="panel-card">{sections['components/sections/system-core.html']}</div>
    <div class="panel-card">{sections['components/sections/malware-lab.html']}</div>
    <div class="panel-card">{sections['components/sections/toolkit.html']}</div>
    <div class="panel-card">{sections['components/sections/todo-list.html']}</div>
    <div class="panel-card">{sections['components/sections/network-viz.html']}</div>
  </div>

  <!-- Interactive Terminal (Full Width) -->
  <div class="terminal-section mt-8">
    {terminal}
  </div>
</main>'''

# Read main HTML template
with open('./dashboard/index.html', 'r') as f:
    html_content = f.read()

# Replace includes with actual content
html_content = html_content.replace("{% include 'components/layout/header.html' %}", header)
html_content = html_content.replace("{% include 'components/layout/widgets-bar.html' %}", widgets_bar)
html_content = html_content.replace("{% include 'components/layout/main-grid.html' %}", main_grid)
html_content = html_content.replace("{% include 'components/interactive/terminal.html' %}", terminal)
html_content = html_content.replace("{% include 'components/layout/footer.html' %}", footer)

# Write static HTML
with open('./dashboard/index-static.html', 'w') as f:
    f.write(html_content)

print("✅ Static HTML generated: dashboard/index-static.html")
print(f"✅ Included {len(section_files)} section files")
print("✅ Ready to serve!")
