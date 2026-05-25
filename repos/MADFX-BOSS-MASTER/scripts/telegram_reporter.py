import json
import os
import requests
from datetime import datetime

# Configuration
REPORT_FILE = os.path.expanduser("~/repos/MADFX-BOSS-MASTER/logs/hourly-reports.json")
# These should ideally be in a .env file, but for now, we'll define them as placeholders
# The user or a separate process should populate these.
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "YOUR_CHAT_ID_HERE")

def format_message(entry):
    """
    Formats the JSON entry into a high-visibility Telegram message.
    """
    details = entry.get("details", {})
    done = details.get("done", [])
    in_progress = details.get("in_progress", [])
    blocked = details.get("blocked", [])
    next_p = details.get("next_priority", "N/A")
    
    timestamp = entry.get("timestamp", datetime.utcnow().isoformat())
    hour = entry.get("hour", "Unknown")

    # Status line from the JSON
    status_line = entry.get("status", "No status provided")

    msg = (
        f"🚀 *MADFX-BOSS Hourly Report* 🚀\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"⏰ *Hour:* {hour} | {timestamp}\n"
        f"📊 *Status:* `{status_line}`\n\n"
        f"✅ *DONE:*\n" + ("\n".join([f"• {item}" for item in done]) if done else "• None") + "\n\n"
        f"⏳ *IN PROGRESS:*\n" + ("\n".join([f"• {item}" for item in in_progress]) if in_progress else "• None") + "\n\n"
        f"🛑 *BLOCKED:*\n" + ("\n".join([f"• {item}" for item in blocked]) if blocked else "• None") + "\n\n"
        f"🎯 *NEXT PRIORITY:*\n`{next_p}`\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"TGRR Status: 🟢 Operational"
    )
    return msg

def send_telegram_notification(message):
    """
    Sends the message to the Telegram channel via Bot API.
    """
    if TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN_HERE" or TELEGRAM_CHAT_ID == "YOUR_CHAT_ID_HERE":
        print("⚠️ Telegram credentials not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send Telegram notification: {e}")
        return False

def main():
    if not os.path.exists(REPORT_FILE):
        print(f"❌ Report file not found: {REPORT_FILE}")
        return

    try:
        with open(REPORT_FILE, 'r') as f:
            reports = json.load(f)
            if not reports:
                print("⚠️ No reports found in JSON file.")
                return
            
            # Fetch the last entry
            last_entry = reports[-1]
            
            # Format and send
            message = format_message(last_entry)
            if send_telegram_notification(message):
                print("✅ Successfully sent hourly report to Telegram.")
            else:
                print("❌ Failed to send report.")
                
    except json.JSONDecodeError:
        print(f"❌ Failed to decode JSON from {REPORT_FILE}")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
