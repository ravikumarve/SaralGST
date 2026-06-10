#!/usr/bin/env python3
"""Extend GST rates data to 500+ items with 50+ rate-changed."""

import json
from pathlib import Path

DATA_FILE = Path('backend/data/gst_rates.json')

# Read existing data
with DATA_FILE.open() as f:
    data = json.load(f)

existing_hsn = {item['hsn'] for item in data['items']}
print(f"Existing items: {len(data['items'])}, Rate changed: {sum(1 for i in data['items'] if i.get('rate_changed'))}")

# Items to add (ensuring no duplicate HSNs)
NEW_ITEMS = [
    # Services (SAC codes) - 20 items
    ("995411", "Construction services", "निर्माण सेवाएं", "Services", 12, 18, True, "up", "Notification No. 11/2025-CT(Rate)", "Commercial and residential construction"),
    ("995412", "Construction of roads", "सड़क निर्माण", "Services", 12, 18, True, "up", "Notification No. 11/2025-CT(Rate)", "Highways and rural roads"),
    ("995413", "Construction of bridges", "पुल निर्माण", "Services", 12, 18, True, "up", "Notification No. 11/2025-CT(Rate)", "Rail and road bridges"),
    ("997211", "Rail transport of goods", "माल रेल परिवहन", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Freight transport by rail"),
    ("997212", "Rail transport of passengers", "यात्री रेल परिवहन", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Passenger rail transport"),
    ("997213", "Road transport of goods", "माल सड़क परिवहन", "Services", 12, 18, True, "up", "Notification No. 11/2025-CT(Rate)", "Freight transport by road"),
    ("997214", "Road transport of passengers", "यात्री सड़क परिवहन", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Bus and taxi services"),
    ("997215", "Air transport of goods", "माल हवाई परिवहन", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Air cargo services"),
    ("997216", "Air transport of passengers", "यात्री हवाई परिवहन", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Economy class domestic flights"),
    ("997311", "Restaurant services", "रेस्टोरेंट सेवाएं", "Services", 5, 5, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Non-AC restaurants"),
    ("997312", "Food catering services", "खाना पひना सेवाएं", "Services", 18, 18, False, "unchanged", "Notification No. 1/2025-CT(Rate)", "Outdoor and event catering"),
    ("997411", "Accommodation in hotels", 