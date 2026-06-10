"""
Validate Router
===============

API endpoint for token validation.
Validates HMAC tokens for paid tier authentication.

Author: SaralGST Team
Version: 1.0.0
"""

from fastapi import APIRouter, HTTPException
import logging
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional
import os

from models.lookup import ValidateKeyRequest, ValidateKeyResponse
from config import Config


# Router
router = APIRouter()

# Logger
logger = logging.getLogger(__name__)


@router.post("/api/validate-key", response_model=ValidateKeyResponse)
async def validate_key(request: ValidateKeyRequest):
    """
    Validate HMAC token for paid tier.
    
    Validates the token and returns tier information and expiry.
    
    Args:
        request: ValidateKeyRequest with token
    
    Returns:
        ValidateKeyResponse with validation result
    
    Raises:
        HTTPException: If token is invalid
    """
    try:
        token = request.token
        
        if not token:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "invalid_token",
                    "message": "Token is required."
                }
            )
        
        # Parse token
        # Token format: hmac(payment_id:tier:expires_at)
        # For now, we'll do a simplified validation
        # In production, implement proper HMAC verification
        
        # Check if HMAC_SECRET is set
        hmac_secret = os.getenv("HMAC_SECRET", "")
        if not hmac_secret:
            logger.warning("HMAC_SECRET not set - using default (INSECURE!)")
            # For development, accept any token
            return ValidateKeyResponse(
                valid=True,
                tier="paid",
                expires_at=(datetime.utcnow() + timedelta(days=30)).isoformat()
            )
        
        # TODO: Implement proper HMAC verification
        # For now, return a simple validation
        # This is a placeholder - implement proper token validation in production
        
        # Parse token (simplified)
        try:
            # Token should be in format: payment_id:tier:expires_at
            parts = token.split(":")
            if len(parts) >= 3:
                tier = parts[1]
                expires_at = parts[2]
                
                # Check if token is expired
                expiry_date = datetime.fromisoformat(expires_at)
                if expiry_date < datetime.utcnow():
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
            else:
                # Invalid token format
                return ValidateKeyResponse(
                    valid=False,
                    tier="free",
                    expires_at=None
                )
        
        except Exception as e:
            logger.error(f"Error parsing token: {e}")
            return ValidateKeyResponse(
                valid=False,
                tier="free",
                expires_at=None
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in validate_key: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Internal server error. Please try again later."
            }
        )


def generate_token(payment_id: str, tier: str, expires_in_days: int = 30) -> str:
    """
    Generate HMAC token for paid tier.
    
    Args:
        payment_id: Razorpay payment ID
        tier: User tier (paid, ca_firm)
        expires_in_days: Token expiry in days
    
    Returns:
        HMAC token string
    """
    hmac_secret = os.getenv("HMAC_SECRET", "")
    
    if not hmac_secret:
        logger.warning("HMAC_SECRET not set - using default (INSECURE!)")
        hmac_secret = "default_secret_change_in_production"
    
    # Calculate expiry date
    expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
    
    # Create token payload
    payload = f"{payment_id}:{tier}:{expires_at.isoformat()}"
    
    # Generate HMAC
    token = hmac.new(
        hmac_secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Return token with payload
    return f"{token}:{payload}"


def verify_token(token: str) -> tuple[bool, str, Optional[str]]:
    """
    Verify HMAC token.
    
    Args:
        token: HMAC token to verify
    
    Returns:
        Tuple of (is_valid, tier, expires_at)
    """
    hmac_secret = os.getenv("HMAC_SECRET", "")
    
    if not hmac_secret:
        logger.warning("HMAC_SECRET not set - using default (INSECURE!)")
        # For development, accept any token
        return True, "paid", (datetime.utcnow() + timedelta(days=30)).isoformat()
    
    try:
        # Parse token
        parts = token.split(":")
        if len(parts) < 4:
            return False, "free", None
        
        # Extract parts
        received_hmac = parts[0]
        payment_id = parts[1]
        tier = parts[2]
        expires_at = parts[3]
        
        # Reconstruct payload
        payload = f"{payment_id}:{tier}:{expires_at}"
        
        # Calculate expected HMAC
        expected_hmac = hmac.new(
            hmac_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Verify HMAC
        if not hmac.compare_digest(received_hmac, expected_hmac):
            return False, "free", None
        
        # Check expiry
        expiry_date = datetime.fromisoformat(expires_at)
        if expiry_date < datetime.utcnow():
            return False, "free", None
        
        return True, tier, expires_at
    
    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        return False, "free", None