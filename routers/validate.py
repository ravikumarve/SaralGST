"""
Validate Router
===============

API endpoint for token validation.
Validates HMAC tokens for paid tier authentication.

Token format: {hmac_hex}:{payment_id}:{tier}:{expires_at_iso}
Verification is fail-closed — invalid/missing/unsigned tokens are rejected.

Author: SaralGST Team
Version: 1.1.0
"""

from fastapi import APIRouter, HTTPException
import logging

from models.lookup import ValidateKeyRequest, ValidateKeyResponse
from services.tokens import generate_token, verify_token  # noqa: F401 (re-exported)

# Router
router = APIRouter()

# Logger
logger = logging.getLogger(__name__)


@router.post("/api/validate-key", response_model=ValidateKeyResponse)
async def validate_key(request: ValidateKeyRequest):
    """
    Validate HMAC token for paid tier.

    Verifies the HMAC signature against HMAC_SECRET and checks expiry.
    Returns tier information and expiry for valid tokens only.
    """
    token = request.token

    if not token:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "invalid_token",
                "message": "Token is required."
            }
        )

    is_valid, tier, expires_at = verify_token(token)

    if not is_valid:
        logger.info("Token validation failed: invalid signature, malformed, or expired")
        return ValidateKeyResponse(
            valid=False,
            tier="free",
            expires_at=None
        )

    return ValidateKeyResponse(
        valid=True,
        tier=tier,
        expires_at=expires_at
    )
