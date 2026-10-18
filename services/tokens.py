"""
Token Service
=============

HMAC token generation and verification for paid tier authentication.

Token format: {hmac_hex}:{payment_id}:{tier}:{expires_at_iso}
The HMAC is computed over "{payment_id}:{tier}:{expires_at_iso}" using
HMAC_SECRET (SHA-256). Verification is fail-closed: a missing or invalid
token NEVER grants paid access.

Author: SaralGST Team
Version: 1.1.0
"""

import hmac
import hashlib
import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

logger = logging.getLogger(__name__)


def _get_secret() -> str:
    """Get HMAC secret from environment. Empty string if not set."""
    return os.getenv("HMAC_SECRET", "")


def generate_token(payment_id: str, tier: str, expires_in_days: int = 30) -> str:
    """
    Generate HMAC token for paid tier.

    Args:
        payment_id: Razorpay payment ID
        tier: User tier (paid, ca_firm)
        expires_in_days: Token expiry in days

    Returns:
        Token string in format "{hmac_hex}:{payment_id}:{tier}:{expires_at_iso}"
    """
    hmac_secret = _get_secret()
    if not hmac_secret:
        raise ValueError("HMAC_SECRET not set - cannot generate tokens securely")

    expires_at = datetime.now(timezone.utc) + timedelta(days=expires_in_days)
    payload = f"{payment_id}:{tier}:{expires_at.isoformat()}"

    token_hmac = hmac.new(
        hmac_secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return f"{token_hmac}:{payload}"


def verify_token(token: str) -> tuple[bool, str, Optional[str]]:
    """
    Verify HMAC token (fail-closed).

    Args:
        token: Token string "{hmac_hex}:{payment_id}:{tier}:{expires_at_iso}"

    Returns:
        Tuple of (is_valid, tier, expires_at). tier is "free" when invalid.
    """
    if not _get_secret():
        # Fail closed: no secret configured means no token can be trusted.
        logger.warning("HMAC_SECRET not set - rejecting all tokens (fail-closed)")
        return False, "free", None

    if not token or not isinstance(token, str):
        return False, "free", None

    try:
        parts = token.split(":")
        if len(parts) < 4:
            return False, "free", None

        received_hmac = parts[0]
        payment_id = parts[1]
        tier = parts[2]
        expires_at = ":".join(parts[3:])  # ISO timestamps contain no ':', but be safe

        payload = f"{payment_id}:{tier}:{expires_at}"
        expected_hmac = hmac.new(
            _get_secret().encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(received_hmac, expected_hmac):
            return False, "free", None

        # Expiry check (tz-aware; fromisoformat handles the 'Z' suffix on 3.11+)
        expiry_date = datetime.fromisoformat(expires_at)
        if expiry_date.tzinfo is None:
            expiry_date = expiry_date.replace(tzinfo=timezone.utc)
        if expiry_date < datetime.now(timezone.utc):
            return False, "free", None

        return True, tier, expires_at

    except (ValueError, IndexError) as e:
        logger.debug(f"Token verification failed: {e}")
        return False, "free", None
