"""
Pytest conftest
===============

Sets environment BEFORE test modules import the app, so:
- Rate limits are raised (tests make ~20 lookup calls; prod limit is 3/day)
- A deterministic HMAC_SECRET exists for token tests
- GEMINI_API_KEY stays unset so tests exercise the fallback path

load_dotenv() in config.py does not override pre-set env vars,
so these values always win inside the test run.
"""

import os

os.environ.setdefault("RATE_LIMIT_FREE", "100000")
os.environ.setdefault("RATE_LIMIT_PAID", "100000")
os.environ.setdefault("HMAC_SECRET", "pytest_only_secret_not_for_production")
