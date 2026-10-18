"""
Rate Limiting
=============

Shared slowapi limiter for all routers. The same instance MUST be assigned
to app.state.limiter in main.py so the RateLimitExceeded handler can
inject headers.

Tiered limits:
- Free: RATE_LIMIT_FREE (default 3) lookups per day per IP
- Paid (valid X-Session-Token): RATE_LIMIT_PAID (default 1000) per day

slowapi invokes exempt_when() with NO arguments, so the session token is
stashed in a ContextVar by SessionTokenMiddleware before routing.

Author: SaralGST Team
Version: 1.1.0
"""

from contextvars import ContextVar

from slowapi import Limiter
from slowapi.util import get_remote_address

from services.tokens import verify_token


limiter = Limiter(key_func=get_remote_address, headers_enabled=True)

# Per-request session token, set by SessionTokenMiddleware
_session_token: ContextVar[str] = ContextVar("session_token", default="")


class SessionTokenMiddleware:
    """Pure ASGI middleware: expose X-Session-Token to exempt_when via ContextVar."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = {k.decode("latin-1"): v.decode("latin-1") for k, v in scope.get("headers") or []}
            _session_token.set(headers.get("x-session-token", ""))
        await self.app(scope, receive, send)


def is_paid_request() -> bool:
    """
    exempt_when helper (no args — slowapi calls it bare): True only when the
    request carries a cryptographically valid X-Session-Token.
    """
    token = _session_token.get()
    if not token:
        return False
    valid, _tier, _expires = verify_token(token)
    return valid
