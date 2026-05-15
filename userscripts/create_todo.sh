#!/bin/bash
#
# Qutebrowser Userscript: Create TODO from page
# Usage: Bind to key to create TODO entry from current page
# Bind: config.bind(',t', 'spawn --userscript create_todo.sh')
#
# Features:
# - Appends TODO entry to ~/notes/todo.md
# - Includes title, URL, and timestamp
# - Opens in editor if configured

QUTE_URL="${QUTE_URL:-}"
QUTE_TITLE="${QUTE_TITLE:-}"
QUTE_FIFO="${QUTE_FIFO:-}"

TODO_FILE="${HOME}/notes/todo.md"

# Create notes directory if needed
mkdir -p "$(dirname "$TODO_FILE")"

# Check if URL is provided
if [[ -z "$QUTE_URL" ]]; then
    echo "message-error 'No URL provided'" >> "$QUTE_FIFO"
    exit 1
fi

# Create TODO entry
timestamp=$(date '+%Y-%m-%d %H:%M')
cat >> "$TODO_FILE" << EOF

## [ ] ${QUTE_TITLE}
- **URL:** ${QUTE_URL}
- **Added:** ${timestamp}
- **Notes:** 

EOF

echo "message-info 'TODO added to ${TODO_FILE}'" >> "$QUTE_FIFO"

# Optional: Open in editor
# ${EDITOR:-nvim} "$TODO_FILE"

exit 0
