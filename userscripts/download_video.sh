#!/bin/bash
#
# Qutebrowser Userscript: Download video with yt-dlp
# Usage: Bind to key in config.py
# Bind: config.bind(',d', 'spawn --userscript download_video.sh')
#
# Features:
# - Downloads to ~/downloads/videos/
# - Shows progress notification
# - Supports all yt-dlp features

QUTE_URL="${QUTE_URL:-}"
QUTE_FIFO="${QUTE_FIFO:-}"
QUTE_TITLE="${QUTE_TITLE:-}"

DOWNLOAD_DIR="${HOME}/downloads/videos"
mkdir -p "$DOWNLOAD_DIR"

# Check if URL is provided
if [[ -z "$QUTE_URL" ]]; then
    echo "message-error 'No URL provided'" >> "$QUTE_FIFO"
    exit 1
fi

# Sanitize title for filename
sanitize_filename() {
    echo "$1" | sed 's/[^a-zA-Z0-9._-]/_/g' | cut -c1-50
}

filename=$(sanitize_filename "$QUTE_TITLE")

# Download options
FORMAT="bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]/best"
OUTPUT_TEMPLATE="${DOWNLOAD_DIR}/%(title)s.%(ext)s"

echo "message-info 'Starting download...'" >> "$QUTE_FIFO"

# Download in background
(
    yt-dlp \
        --format "$FORMAT" \
        --output "$OUTPUT_TEMPLATE" \
        --no-playlist \
        --embed-subs \
        --embed-thumbnail \
        --add-metadata \
        "$QUTE_URL" >> "${DOWNLOAD_DIR}/download.log" 2>&1
    
    if [[ $? -eq 0 ]]; then
        echo "message-info 'Download complete!'" >> "$QUTE_FIFO"
        notify-send "Qutebrowser" "Video download complete" 2>/dev/null || true
    else
        echo "message-error 'Download failed!'" >> "$QUTE_FIFO"
        notify-send "Qutebrowser" "Video download failed" 2>/dev/null || true
    fi
) &

exit 0
