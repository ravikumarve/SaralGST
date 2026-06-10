"""
Lookup Router
==============

API endpoint for GST rate lookup.
Handles plain language search and HSN code lookup with rate limiting.

Author: SaralGST Team
Version: 1.0.0
"""

from fastapi import APIRouter, HTTPException, Request, Header, Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
from typing import Optional
import os
import json

from models.lookup import (
    LookupRequest,
    LookupResponse,
    ErrorResponse
)
from services.rate_engine import get_rate_engine, RateEngine
from services.interpreter import get_interpreter_service, InterpreterService
from config import Config


# Configure rate limiting
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# Logger
logger = logging.getLogger(__name__)


@router.post("/api/lookup", response_model=LookupResponse)
async def lookup(
    request: Request,
    lookup_request: LookupRequest,
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token")
):
    """
    GST rate lookup endpoint.
    
    Accepts plain language product names or HSN codes and returns GST rate information.
    
    Rate Limiting:
    - Free tier: 3 lookups per day per IP
    - Paid tier: 1,000 lookups per day per token
    
    Args:
        request: HTTP request for rate limiting
        lookup_request: Lookup request with query, query_type, and language
        x_session_token: Optional session token for paid tier
    
    Returns:
        LookupResponse with GST rate information
    
    Raises:
        HTTPException: If lookup fails or rate limit exceeded
    """
    try:
        # Get services
        from config import Config
        rate_engine = get_rate_engine(str(Config.RATES_FILE))
        
        # Check if user has valid token (paid tier)
        is_paid = False
        if x_session_token:
            # TODO: Validate token
            # For now, just check if token exists
            is_paid = True
        
        # Determine query type
        query = lookup_request.query.strip()
        query_type = lookup_request.query_type
        
        # Auto-detect query type if "auto"
        if query_type == "auto":
            if query.isdigit() and 2 <= len(query) <= 8:
                query_type = "hsn"
            else:
                query_type = "product_name"
        
        # Perform lookup
        if query_type == "hsn":
            # Direct HSN lookup
            result = rate_engine.lookup_by_hsn(query)
            
            if result is None:
                raise HTTPException(
                    status_code=404,
                    detail={
                        "error": "hsn_not_found",
                        "message": f"Yeh HSN code abhi hamare database mein nahi hai. Hum roz naye items add karte hain.",
                        "interpreted_hsn": query
                    }
                )
            
            # Build response
            response = LookupResponse(
                hsn_code=result.hsn,
                description=result.description,
                description_hi=result.description_hi,
                category=result.category,
                old_rate=result.old_rate,
                new_rate=result.new_rate,
                rate_changed=result.rate_changed,
                movement=result.movement,
                notification_ref=result.notification_ref,
                notes=result.notes,
                confidence=result.confidence,
                interpreted_from=f"HSN code: {query}",
                warning=None
            )
        
        else:
            # Product name lookup - use interpreter
            try:
                # Get interpreter service
                api_key = os.getenv("GEMINI_API_KEY")
                if api_key:
                    interpreter = get_interpreter_service(api_key, rate_engine)
                    hsn_code, confidence = await interpreter.interpret_product(query)
                else:
                    # No API key - use fallback
                    logger.warning("GEMINI_API_KEY not set, using fallback search")
                    results = rate_engine.search_by_description(query, limit=1)
                    if results:
                        hsn_code = results[0].hsn
                        confidence = 0.5
                    else:
                        hsn_code = "UNKNOWN"
                        confidence = 0.0
                
                # Check if HSN was found
                if hsn_code == "UNKNOWN":
                    raise HTTPException(
                        status_code=404,
                        detail={
                            "error": "product_not_found",
                            "message": f"Yeh product abhi hamare database mein nahi hai. Hum roz naye items add karte hain.",
                            "interpreted_from": query
                        }
                    )
                
                # Look up rate by HSN
                result = rate_engine.lookup_by_hsn(hsn_code)
                
                if result is None:
                    raise HTTPException(
                        status_code=404,
                        detail={
                            "error": "hsn_not_found",
                            "message": f"HSN code {hsn_code} abhi hamare database mein nahi hai.",
                            "interpreted_hsn": hsn_code,
                            "interpreted_from": query
                        }
                    )
                
                # Build response
                response = LookupResponse(
                    hsn_code=result.hsn,
                    description=result.description,
                    description_hi=result.description_hi,
                    category=result.category,
                    old_rate=result.old_rate,
                    new_rate=result.new_rate,
                    rate_changed=result.rate_changed,
                    movement=result.movement,
                    notification_ref=result.notification_ref,
                    notes=result.notes,
                    confidence=confidence,
                    interpreted_from=query,
                    warning=None if confidence > 0.7 else "Low confidence - please verify HSN code"
                )
            
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Error during product lookup: {e}")
                raise HTTPException(
                    status_code=500,
                    detail={
                        "error": "internal_error",
                        "message": "Internal server error. Please try again later."
                    }
                )
        
        # Build response
        response_data = response.model_dump()
        
        # Return as JSON response with headers
        return Response(
            content=json.dumps(response_data),
            media_type="application/json",
            headers={
                "X-RateLimit-Limit": str(Config.RATE_LIMIT_FREE),
                "X-RateLimit-Remaining": "2",
                "X-RateLimit-Reset": "1735689600",
                "X-Lookups-Remaining": "2"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in lookup: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Internal server error. Please try again later."
            }
        )


@router.get("/api/statistics")
async def get_statistics():
    """
    Get database statistics.
    
    Returns:
        Statistics about the GST rate database
    """
    try:
        rate_engine = get_rate_engine()
        stats = rate_engine.get_statistics()
        return stats
    
    except Exception as e:
        logger.error(f"Error getting statistics: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Failed to retrieve statistics."
            }
        )


@router.get("/api/categories")
async def get_categories():
    """
    Get all categories.
    
    Returns:
        List of all product categories
    """
    try:
        rate_engine = get_rate_engine()
        categories = rate_engine.get_all_categories()
        return {"categories": categories}
    
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Failed to retrieve categories."
            }
        )


@router.get("/api/suggestions")
async def get_suggestions(query: str = "", limit: int = 5):
    """
    Get HSN code suggestions for autocomplete.
    
    Args:
        query: Partial HSN code
        limit: Maximum number of suggestions
    
    Returns:
        List of HSN code suggestions
    """
    try:
        rate_engine = get_rate_engine()
        suggestions = rate_engine.get_hsn_suggestions(query, limit)
        return {"query": query, "suggestions": suggestions}
    
    except Exception as e:
        logger.error(f"Error getting suggestions: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Failed to retrieve suggestions."
            }
        )