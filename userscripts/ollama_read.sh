#!/bin/bash
#
# Qutebrowser Userscript: Read with Ollama
# Usage: Select text and summarize/analyze with local LLM
# Bind: config.bind(',o', 'spawn --userscript ollama_read.sh')
#
# Features:
# - Sends selected text to local Ollama instance
# - Summarizes or answers questions about content
# - Shows result in notification or opens in editor

QUTE_URL="${QUTE_URL:-}"
QUTE_TITLE="${QUTE_TITLE:-}"
QUTE_FIFO="${QUTE_FIFO:-}"
QUTE_SELECTED_TEXT="${QUTE_SELECTED_TEXT:-}"

OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
MODEL="${OLLAMA_MODEL:-llama2}"

# Check if Ollama is running
if ! curl -s "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    echo "message-error 'Ollama not running at ${OLLAMA_HOST}'" >> "$QUTE_FIFO"
    exit 1
fi

# Use selected text or page content
if [[ -n "$QUTE_SELECTED_TEXT" ]]; then
    content="$QUTE_SELECTED_TEXT"
else
    # Fallback to page title
    content="Title: ${QUTE_TITLE}\nURL: ${QUTE_URL}"
fi

# Truncate if too long
max_length=4000
if [[ ${#content} -gt $max_length ]]; then
    content="${content:0:$max_length}..."
fi

# Create prompt
prompt="Summarize the following content concisely:\n\n${content}"

# Call Ollama
echo "message-info 'Querying Ollama...'" >> "$QUTE_FIFO"

response=$(curl -s "$OLLAMA_HOST/api/generate" \
    -H "Content-Type: application/json" \
    -d "{
        \"model\": \"${MODEL}\",
        \"prompt\": $(echo "$prompt" | jq -Rs .),
        \"stream\": false
    }" 2>/dev/null | jq -r '.response' 2>/dev/null)

if [[ -n "$response" && "$response" != "null" ]]; then
    # Show summary in notification
    summary=$(echo "$response" | head -c 200)
    echo "message-info 'Summary: ${summary}...'" >> "$QUTE_FIFO"
    
    # Also notify via desktop notification
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "Ollama Summary" "$summary" 2>/dev/null || true
    fi
else
    echo "message-error 'Failed to get response from Ollama'" >> "$QUTE_FIFO"
fi

exit 0
