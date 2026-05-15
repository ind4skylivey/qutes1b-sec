#!/bin/bash
#
# Qutebrowser Userscript: Pass password from password-store
# Usage: ;p (hint mode on password field) to fill from pass
# Bind: config.bind(';p', 'hint inputs spawn --userscript pass_fill.sh')
#
# Features:
# - Integrates with password-store (pass)
# - Lists available passwords via dmenu/rofi
# - Types password into focused field

QUTE_FIFO="${QUTE_FIFO:-}"

# Check if pass is installed
if ! command -v pass >/dev/null 2>&1; then
    echo "message-error 'pass (password-store) not installed'" >> "$QUTE_FIFO"
    exit 1
fi

# Get list of passwords
passwords=$(pass ls --flat 2>/dev/null)

if [[ -z "$passwords" ]]; then
    echo "message-error 'No passwords found in store'" >> "$QUTE_FIFO"
    exit 1
fi

# Select password via dmenu/rofi
if command -v dmenu >/dev/null 2>&1; then
    selected=$(echo "$passwords" | dmenu -p "Password:")
elif command -v rofi >/dev/null 2>&1; then
    selected=$(echo "$passwords" | rofi -dmenu -p "Password:")
else
    echo "message-error 'No dmenu/rofi found'" >> "$QUTE_FIFO"
    exit 1
fi

# Exit if no selection
[[ -z "$selected" ]] && exit 0

# Get password from pass
password=$(pass show "$selected" 2>/dev/null | head -n 1)

if [[ -z "$password" ]]; then
    echo "message-error 'Failed to retrieve password'" >> "$QUTE_FIFO"
    exit 1
fi

# Type password into field
echo "insert-text ${password}" >> "$QUTE_FIFO"
echo "message-info 'Password filled'" >> "$QUTE_FIFO"

exit 0
