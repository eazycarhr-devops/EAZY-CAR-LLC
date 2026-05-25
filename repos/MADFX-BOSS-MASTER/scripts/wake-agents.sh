#!/bin/bash
# MADFX Agent Waker — runs on boot, keeps agents alive
echo "🔥 MADFX BOSS Agent System Starting..."
cd /Users/madfxbossllc/repos/MADFX-BOSS-MASTER

# Check git for new tasks
git pull origin main 2>/dev/null

# Read kanban backlog
TASKS=$(cat KANBAN.json | python3 -c "
import json,sys
k=json.load(sys.stdin)
backlog=k.get('backlog',[])
if backlog: print(backlog[0]['title'])
else: print('NONE')
")

echo "📋 Next task: $TASKS"
echo "⏰ $(date): Agents awake, picking up from last checkpoint" >> logs/agent.log

# Keep alive ping every 30 min
while true; do
  sleep 1800
  echo "💓 $(date): Agent heartbeat" >> logs/agent.log
done
