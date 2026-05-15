#!/bin/bash
#
# Qutebrowser Userscript: Copy link as Markdown
# Usage: ;m (hint mode) to copy link as markdown
# Bind: config.bind(';m', 'hint links spawn --userscript copy_markdown.sh')
#
# Features:
# - Copies selected link as [title](url) markdown format
# - Works with both Wayland (wl-copy) and X11 (xclip)
# - Falls back to primary selection

QUTE_URL="${QUTE_URL:-}"
QUTE_TITLE="${QUTE_TITLE:-}"
QUTE_FIFO="${QUTE_FIFO:-}"

# Check if URL is provided
if [[ -z "$QUTE_URL" ]]; then
    echo "message-error 'No URL provided'" >> "$QUTE_FIFO"
    exit 1
fi

# Escape special characters in title for markdown
title_escaped=$(echo "$QUTE_TITLE" | sed 's/\[/\\[/g; s/\]/\\]/g')

# Create markdown link
markdown_link="[${title_escaped}](${QUTE_URL})"

# Copy to clipboard
if command -v wl-copy >/dev/null 2>&1; then
    # Wayland
    echo -n "$markdown_link" | wl-copy
    echo "message-info 'Copied as markdown (Wayland)'" >> "$QUTE_FIFO"
elif command -v xclip >/dev/null 2>&1; then
    # X11
    echo -n "$markdown_link" | xclip -selection clipboard
    echo "message-info 'Copied as markdown (X11)'" >> "$QUTE_FIFO"
else
    echo "message-error 'No clipboard utility found (wl-copy or xclip)'" >> "$QUTE_FIFO"
    exit 1
fi

exit 0
