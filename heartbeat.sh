#!/bin/bash
# DeepSeek Launch — Single Heartbeat Trigger
# Uses --autopilot flag which triggers heartbeat automatically on pi startup

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/heartbeat.log"

echo "=== Heartbeat $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG_FILE"

cd "$SCRIPT_DIR"

# Run pi in print mode with --autopilot flag
# This triggers the session_start autopilot handler which:
# 1. Dispatches pending employee tasks
# 2. Wakes CEO to review and decide
# 3. Commits to git if wave closed
# 4. Shuts down gracefully
pi -p \
  --autopilot \
  --no-skills \
  --no-context-files \
  "AUTOPILOT heartbeat cycle" \
  >> "$LOG_FILE" 2>&1

EXIT_CODE=$?
echo "Exit code: $EXIT_CODE" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
