"""
Pydantic Models for API Requests and Responses
==============================================

Data models for SaralGST API endpoints.

Author: SaralGST Team
Version: 1.0.0
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============================================================================
# Request Models
# ============================================================================

class LookupRequest(BaseModel):
    """Request model for GST rate lookup"""
    
    query: str = Field(
        ...,
        description="Product name or HSN code",
        min_length=1,
        max_length=200
    )
    
    query_type: str = Field(
        default="auto",
        description="Query type: 'auto', 'hsn', or 'product_name'",
        pattern=r"^(auto|hsn|product_name)$"
    )
    
    language: str = Field(
        default="en",
        description="Response language: 'en' or 'hi'",
        pattern=r"^(en|hi)$"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "LED TV",
                "query_type": "auto",
                "language": "en"
            }
        }


class ValidateKeyRequest(BaseModel):
    """Request model for token validation"""
    
    token: str = Field(
        ...,
        description="HMAC token to validate",
        min_length=1
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "token": "your_hmac_token_here"
            }
        }


# ============================================================================
# Response Models
# ============================================================================

class LookupResponse(BaseModel):
    """Response model for GST rate lookup"""
    
    hsn_code: str = Field(..., description="HSN/SAC code")
    description: str = Field(..., description="English description")
    description_hi: Optional[str] = Field(None, description="Hindi description")
    category: str = Field(..., description="Product category")
    old_rate: float = Field(..., description="Rate before GST 2.0")
    new_rate: float = Field(..., description="Rate after GST 2.0")
    rate_changed: bool = Field(..., description="Did rate change?")
    movement: str = Field(..., description="Rate movement: 'up', 'down', 'unchanged', 'new_exempt'")
    notification_ref: str = Field(..., description="Official GST notification reference")
    notes: Optional[str] = Field(None, description="Additional notes")
    confidence: float = Field(..., description="AI match confidence (0.0-1.0)")
    interpreted_from: str = Field(..., description="What was interpreted from the query")
    warning: Optional[str] = Field(None, description="Optional warning message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "hsn_code": "8528",
                "description": "Television sets (LCD/LED above 32 inches)",
                "description_hi": "टेलीविजन (32 इंच से बड़े)",
                "category": "Consumer Electronics",
                "old_rate": 28.0,
                "new_rate": 18.0,
                "rate_changed": True,
                "movement": "down",
                "notification_ref": "Notification No. 8/2025-CT(Rate)",
                "notes": "Effective Sept 22, 2025",
                "confidence": 0.9,
                "interpreted_from": "LED TV",
                "warning": None
            }
        }


class ValidateKeyResponse(BaseModel):
    """Response model for token validation"""
    
    valid: bool = Field(..., description="Is token valid?")
    tier: str = Field(..., description="User tier: 'free', 'paid', or 'ca_firm'")
    expires_at: Optional[str] = Field(None, description="Token expiry timestamp (ISO 8601)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "valid": True,
                "tier": "paid",
                "expires_at": "2025-05-30T12:00:00"
            }
        }


# ============================================================================
# Error Response Models
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response model"""
    
    error: str = Field(..., description="Error code")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[str] = Field(None, description="Additional error details")
    upgrade_url: Optional[str] = Field(None, description="URL for upgrade (if applicable)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "rate_limit_exceeded",
                "message": "Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.",
                "details": "Free tier: 3 lookups per day per IP address.",
                "upgrade_url": "https://saralgst.in/upgrade"
            }
        }


# ============================================================================
# Health Response Models
# ============================================================================

class HealthResponse(BaseModel):
    """Health check response model"""
    
    status: str = Field(..., description="API status")
    version: str = Field(..., description="API version")
    data_version: str = Field(..., description="GST data version")
    timestamp: str = Field(..., description="Current timestamp (ISO 8601)")
    items_count: int = Field(..., description="Total GST items in database")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "ok",
                "version": "1.0.0",
                "data_version": "GST_2.0_Sept2025",
                "timestamp": "2025-04-30T12:00:00",
                "items_count": 54
            }
        }


# ============================================================================
# Statistics Response Models
# ============================================================================

class StatisticsResponse(BaseModel):
    """Statistics response model"""
    
    total_items: int = Field(..., description="Total GST items")
    rate_changed: int = Field(..., description="Items with rate changes")
    categories: int = Field(..., description="Number of categories")
    category_list: List[str] = Field(..., description="List of categories")
    movement_counts: dict = Field(..., description="Count by movement type")
    data_version: str = Field(..., description="GST data version")
    last_updated: str = Field(..., description="Last update date")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_items": 54,
                "rate_changed": 10,
                "categories": 9,
                "category_list": [
                    "Art & Culture",
                    "Automobiles",
                    "Construction Materials",
                    "Consumer Electronics",
                    "Food & Agriculture",
                    "Insurance",
                    "Pharmaceuticals",
                    "Services",
                    "Textiles"
                ],
                "movement_counts": {
                    "down": 10,
                    "unchanged": 44
                },
                "data_version": "GST_2.0_Sept2025",
                "last_updated": "2025-09-22"
            }
        }


# ============================================================================
# Suggestion Response Models
# ============================================================================

class SuggestionResponse(BaseModel):
    """HSN code suggestion response model"""
    
    query: str = Field(..., description="Original query")
    suggestions: List[str] = Field(..., description="List of HSN code suggestions")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "85",
                "suggestions": ["8528", "8517", "8516", "8539", "8415"]
            }
        }