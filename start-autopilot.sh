#!/bin/bash
# DeepSeek Launch — Autopilot Loop
# Run this in a tmux/screen session to keep the startup running 24/7

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/autopilot.log"
INTERVAL_SECONDS=1800  # 30 minutes

echo "╔══════════════════════════════════════╗"
echo "║  DeepSeek Launch — Autopilot Mode   ║"
echo "║  CEO wakes every 30 minutes         ║"
echo "║  Log: autopilot.log                 ║"
echo "╚══════════════════════════════════════╝"
echo ""

cd "$SCRIPT_DIR"

CYCLE=0

while true; do
  CYCLE=$((CYCLE + 1))
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Cycle #$CYCLE — $TIMESTAMP"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Run heartbeat
  bash "$SCRIPT_DIR/heartbeat.sh"

  echo ""
  echo "Sleeping ${INTERVAL_SECONDS}s until next heartbeat..."
  echo ""

  sleep $INTERVAL_SECONDS
done
