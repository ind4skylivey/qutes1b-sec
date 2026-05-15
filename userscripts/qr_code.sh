#!/bin/bash
#
# Qutebrowser Userscript: QR Code generator for current URL
# Usage: Bind to key to generate QR code of current page
# Bind: config.bind(',q', 'spawn --userscript qr_code.sh')
#
# Features:
# - Generates QR code for current URL
# - Displays using feh or terminal
# - Useful for mobile sharing

QUTE_URL="${QUTE_URL:-}"
QUTE_FIFO="${QUTE_FIFO:-}"

# Check if qrencode is installed
if ! command -v qrencode >/dev/null 2>&1; then
    echo "message-error 'qrencode not installed (install qrencode package)'" >> "$QUTE_FIFO"
    exit 1
fi

# Check if URL is provided
if [[ -z "$QUTE_URL" ]]; then
    echo "message-error 'No URL provided'" >> "$QUTE_FIFO"
    exit 1
fi

# Generate QR code to temp file
qr_file="/tmp/qute_qr_$$.png"
qrencode -s 10 -o "$qr_file" "$QUTE_URL"

# Display QR code
if command -v feh >/dev/null 2>&1; then
    feh "$qr_file" &
    echo "message-info 'QR code displayed'" >> "$QUTE_FIFO"
elif command -v kitty >/dev/null 2>&1 && kitty +kitten icat --help >/dev/null 2>&1; then
    # Terminal display with kitty
    kitty +kitten icat "$qr_file"
    echo "message-info 'QR code displayed in terminal'" >> "$QUTE_FIFO"
else
    # ASCII QR in terminal
    qrencode -t ANSIUTF8 "$QUTE_URL"
    echo "message-info 'QR code displayed as ASCII'" >> "$QUTE_FIFO"
fi

# Cleanup
rm -f "$qr_file"

exit 0
