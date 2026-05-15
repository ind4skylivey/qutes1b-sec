#!/bin/bash
#
# Qutebrowser Userscript: Search across multiple engines
# Usage: Select text and press key to search
# Bind: config.bind(',s', 'spawn --userscript multi_search.sh')
#
# Features:
# - Takes selected text or prompts for input
# - Searches across multiple engines
# - Opens results in new tabs

QUTE_URL="${QUTE_URL:-}"
QUTE_TITLE="${QUTE_TITLE:-}"
QUTE_FIFO="${QUTE_FIFO:-}"
QUTE_SELECTED_TEXT="${QUTE_SELECTED_TEXT:-}"

# Use selected text or prompt
if [[ -n "$QUTE_SELECTED_TEXT" ]]; then
    query="$QUTE_SELECTED_TEXT"
else
    # Prompt for query using dmenu/rofi
    if command -v dmenu >/dev/null 2>&1; then
        query=$(echo "" | dmenu -p "Search:")
    elif command -v rofi >/dev/null 2>&1; then
        query=$(echo "" | rofi -dmenu -p "Search:")
    else
        echo "message-error 'No dmenu/rofi found for input'" >> "$QUTE_FIFO"
        exit 1
    fi
fi

# Exit if no query
[[ -z "$query" ]] && exit 0

# URL encode query
encoded_query=$(echo "$query" | sed 's/ /+/g; s/\&/%26/g; s/\?/%3F/g')

# Search engines
engines=(
    "https://duckduckgo.com/?q=${encoded_query}"
    "https://github.com/search?q=${encoded_query}"
    "https://www.google.com/search?q=${encoded_query}"
)

# Open searches in new tabs
for url in "${engines[@]}"; do
    echo "open -t ${url}" >> "$QUTE_FIFO"
done

echo "message-info 'Searching: ${query}'" >> "$QUTE_FIFO"

exit 0
