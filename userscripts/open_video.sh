#!/bin/bash
#
# Qutebrowser Userscript: Open video in mpv with quality selection
# Usage: ;v (hint mode) or bind to key in config.py
# Bind: config.bind(';v', 'hint links spawn --userscript open_video.sh')
#
# Features:
# - Auto-detects YouTube and other video sites
# - Uses yt-dlp for quality selection
# - Supports playlists
# - Falls back to direct mpv for non-YouTube URLs

QUTE_URL="${QUTE_URL:-}"
QUTE_FIFO="${QUTE_FIFO:-}"

# Quality options (can be customized)
QUALITY="bestvideo[height<=1080]+bestaudio/best[height<=1080]"

# Check if URL is provided
if [[ -z "$QUTE_URL" ]]; then
    echo "message-error 'No URL provided'" >> "$QUTE_FIFO"
    exit 1
fi

# Function to check if URL is a video site
is_video_site() {
    local url="$1"
    [[ "$url" =~ (youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|twitch\.tv|bilibili\.com) ]]
}

# Function to extract video title
get_video_title() {
    local url="$1"
    yt-dlp --get-title "$url" 2>/dev/null || echo "Unknown"
}

# Main logic
if is_video_site "$QUTE_URL"; then
    # Video site - use yt-dlp with mpv
    title=$(get_video_title "$QUTE_URL")
    echo "message-info 'Opening video: $title'" >> "$QUTE_FIFO"
    
    # Open in mpv with yt-dlp
    mpv --ytdl-format="$QUALITY" \
        --force-window=immediate \
        --really-quiet \
        "$QUTE_URL" &
else
    # Direct video file or stream
    echo "message-info 'Opening media in mpv...'" >> "$QUTE_FIFO"
    mpv --really-quiet "$QUTE_URL" &
fi

# Send notification if available
if command -v notify-send >/dev/null 2>&1; then
    notify-send "Qutebrowser" "Opening video in mpv" 2>/dev/null || true
fi

exit 0
