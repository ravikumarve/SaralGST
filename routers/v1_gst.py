"""
V1 GST API Router
=================

Modern API endpoints under /api/v1/gst/ prefix.
Provides lookup, explain, and calculate endpoints.

Author: SaralGST Team
Version: 1.0.0
"""

from fastapi import APIRouter, HTTPException, Query
import logging
from typing import Optional, List

from models.lookup import LookupResponse, ErrorResponse
from services.rate_engine import get_rate_engine, RateEngine
from services.calculator import calc_service, CalculationRequest, CalculationResponse
from config import Config

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/lookup", response_model=LookupResponse)
async def lookup_gst_rate(
    query: str = Query(..., description="Product name or HSN code"),
    query_type: str = Query("auto", description="Query type: auto, hsn, or product_name"),
    language: str = Query("en", description="Response language: en or hi")
):
    """
    GST rate lookup endpoint (GET version for frontend compatibility).

    Accepts product names or HSN codes and returns GST rate information.
    """
    try:
        rate_engine = get_rate_engine(str(Config.RATES_FILE))

        # Auto-detect query type
        actual_type = query_type
        if query_type == "auto":
            if query.strip().isdigit() and 2 <= len(query.strip()) <= 8:
                actual_type = "hsn"
            else:
                actual_type = "product_name"

        query = query.strip()

        if actual_type == "hsn":
            # Direct HSN lookup
            result = rate_engine.lookup_by_hsn(query)

            if result is None:
                raise HTTPException(
                    status_code=404,
                    detail={
                        "error": "hsn_not_found",
                        "message": "Yeh HSN code abhi hamare database mein nahi hai. Hum roz naye items add karte hain.",
                        "interpreted_hsn": query
                    }
                )

            return LookupResponse(
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
            # Product name lookup - use description search (no Gemini for GET endpoint)
            results = rate_engine.search_by_description(query, limit=1)

            if not results:
                raise HTTPException(
                    status_code=404,
                    detail={
                        "error": "product_not_found",
                        "message": "Yeh product abhi hamare database mein nahi hai. Hum roz naye items add karte hain.",
                        "interpreted_from": query
                    }
                )

            result = results[0]
            return LookupResponse(
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
                interpreted_from=query,
                warning=None if result.confidence > 0.7 else "Low confidence - please verify HSN code"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in V1 lookup: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Internal server error. Please try again later."
            }
        )


@router.get("/explain")
async def explain_gst_rate(
    item_name: str = Query(..., description="Product name to explain")
):
    """
    Explain why a GST rate applies to a given item.

    Returns a human-readable explanation of the GST rate category and rationale.
    """
    try:
        rate_engine = get_rate_engine(str(Config.RATES_FILE))

        # Search for the item
        results = rate_engine.search_by_description(item_name, limit=1)

        if not results:
            raise HTTPException(
                status_code=404,
                detail=f"No GST data found for item: {item_name}"
            )

        result = results[0]

        # Build explanation based on category and rate change
        category_explanations = {
            "Food & Agriculture": "Food and agricultural items are kept at lower rates to ensure affordability for daily essentials.",
            "Consumer Electronics": "Consumer electronics have seen significant rate reductions in GST 2.0.",
            "Construction Materials": "Construction materials are critical for infrastructure. GST 2.0 reduced rates to lower housing costs.",
            "Pharmaceuticals & Health": "Healthcare items and medicines are kept at the lowest possible rates to ensure affordable medical care.",
            "Textiles & Lifestyle": "Textiles and lifestyle products support massive MSME employment. Lower rates help small manufacturers.",
            "Insurance & Services": "Insurance premiums saw a major cut in GST 2.0 to make coverage accessible to more Indians.",
            "Automobiles": "Automobile rates were restructured in GST 2.0. Public transport vehicles got the biggest cuts.",
        }

        justification = category_explanations.get(
            result.category,
            f"This item is categorized under '{result.category}', applying the standard regulatory rate."
        )

        if result.rate_changed:
            change_context = f"The GST rate changed from {result.old_rate}% to {result.new_rate}% (movement: {result.movement}) under GST 2.0 reforms. "
        else:
            change_context = f"The GST rate remains unchanged at {result.new_rate}%. "

        explanation = (
            f"The applicable GST rate for '{result.description}' (HSN: {result.hsn}) is {result.new_rate}%. "
            f"{change_context}"
            f"{justification}"
        )

        return {
            "item": result.description,
            "rate": result.new_rate,
            "category": result.category,
            "explanation": explanation
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in V1 explain: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Internal server error. Please try again later."
            }
        )


@router.post("/calculate", response_model=CalculationResponse)
async def calculate_gst(request: CalculationRequest):
    """
    Calculate GST tax breakdown.

    Accepts base price and GST rate, returns CGST, SGST, IGST, and total amount.
    """
    try:
        if request.base_price < 0:
            raise HTTPException(
                status_code=400,
                detail="Base price cannot be negative"
            )
        if request.gst_rate < 0 or request.gst_rate > 100:
            raise HTTPException(
                status_code=400,
                detail="GST rate must be between 0 and 100"
            )

        return calc_service.calculate_tax(request.base_price, request.gst_rate)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in V1 calculate: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Calculation error. Please try again."
            }
        )
