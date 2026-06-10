"""
Test Fixtures
=============

Sample data and fixtures for testing SaralGST backend.

Author: SaralGST Team
Version: 1.0.0
"""

import pytest
from typing import Dict, List


# Sample HSN codes for testing
SAMPLE_HSN_CODES = {
    "television": "8528",
    "air_conditioner": "8415",
    "cement": "2523",
    "wheat": "1001",
    "rice": "1006",
    "spectacles": "9004",
    "packaged_food": "1905",
    "homoeopathy": "3003",
    "toys": "9503",
    "paintings": "9701",
    "insurance": "3001",
    "laptops": "8471",
    "mobile_phones": "8517",
    "iron_steel": "7208",
    "stone_marble": "6801",
    "bricks_tiles": "6901",
    "paint": "3208",
    "steel_structures": "7308",
    "allopathic": "3004",
    "vaccines": "3002",
    "textiles": "6110",
    "t_shirts": "6109",
    "trousers": "6203",
    "motorcycles": "8711",
    "cars": "8703",
    "consulting": "9983",
    "legal": "9984",
    "telecom": "9963",
    "education": "9987",
    "furniture": "9401",
    "sports": "9506",
    "video_games": "9504",
    "refrigerators": "8419",
    "washing_machines": "8450",
    "electric_irons": "8516",
    "bulbs": "8539",
    "screws": "7318",
    "aluminum_structures": "7610",
    "plastic_materials": "3925",
    "wooden_doors": "4418",
    "bed_linen": "6302",
    "curtains": "5804",
    "carpets": "5705",
    "sports_clothing": "6112",
    "workwear": "6210",
    "perfumes": "3303",
    "beauty": "3304",
    "lighters": "9613",
    "toothbrush": "9603",
    "plastic_bags": "3923",
    "paper_bags": "4819",
    "kitchen_utensils": "7323",
    "aluminum_utensils": "7615"
}


# Sample product names for testing
SAMPLE_PRODUCT_NAMES = [
    "LED TV",
    "Air conditioner",
    "Cement",
    "Wheat",
    "Rice",
    "Spectacles",
    "Biscuits",
    "Homoeopathy medicines",
    "Toys",
    "Paintings",
    "Life insurance",
    "Laptop",
    "Mobile phone",
    "Iron and steel",
    "Marble",
    "Bricks",
    "Paint",
    "Steel structures",
    "Allopathic medicines",
    "Vaccines",
    "Textiles",
    "T-shirt",
    "Jeans",
    "Motorcycle",
    "Car",
    "Consulting services",
    "Legal services",
    "Mobile services",
    "Educational services",
    "Furniture",
    "Sports equipment",
    "Video games",
    "Refrigerator",
    "Washing machine",
    "Electric iron",
    "LED bulbs",
    "Screws",
    "Aluminum doors",
    "PVC pipes",
    "Wooden doors",
    "Bed sheets",
    "Curtains",
    "Carpets",
    "Sports clothing",
    "Uniforms",
    "Perfumes",
    "Makeup",
    "Lighters",
    "Toothpaste",
    "Plastic bags",
    "Paper bags",
    "Kitchen utensils",
    "Aluminum utensils"
]


# Sample rate changes (GST 2.0)
RATE_CHANGED_ITEMS = [
    {
        "hsn": "8528",
        "description": "Television sets (LCD/LED above 32 inches)",
        "old_rate": 28,
        "new_rate": 18,
        "movement": "down"
    },
    {
        "hsn": "8415",
        "description": "Air conditioners",
        "old_rate": 28,
        "new_rate": 18,
        "movement": "down"
    },
    {
        "hsn": "8422",
        "description": "Dishwashing machines",
        "old_rate": 28,
        "new_rate": 18,
        "movement": "down"
    },
    {
        "hsn": "2523",
        "description": "Cement",
        "old_rate": 28,
        "new_rate": 18,
        "movement": "down"
    },
    {
        "hsn": "9004",
        "description": "Spectacles and corrective goggles",
        "old_rate": 28,
        "new_rate": 5,
        "movement": "down"
    },
    {
        "hsn": "1905",
        "description": "Packaged food items",
        "old_rate": 12,
        "new_rate": 5,
        "movement": "down"
    },
    {
        "hsn": "3003",
        "description": "Homoeopathy medicines",
        "old_rate": 12,
        "new_rate": 5,
        "movement": "down"
    },
    {
        "hsn": "9503",
        "description": "Wooden and metal toys",
        "old_rate": 12,
        "new_rate": 5,
        "movement": "down"
    },
    {
        "hsn": "9701",
        "description": "Paintings and sculptures",
        "old_rate": 12,
        "new_rate": 5,
        "movement": "down"
    },
    {
        "hsn": "3001",
        "description": "Life and health insurance premiums",
        "old_rate": 18,
        "new_rate": 5,
        "movement": "down"
    }
]


# Sample categories
SAMPLE_CATEGORIES = [
    "Art & Culture",
    "Automobiles",
    "Construction Materials",
    "Consumer Electronics",
    "Food & Agriculture",
    "Insurance",
    "Pharmaceuticals",
    "Services",
    "Textiles"
]


# Sample API requests
SAMPLE_REQUESTS = {
    "hsn_lookup": {
        "query": "8528",
        "query_type": "hsn",
        "language": "en"
    },
    "product_lookup": {
        "query": "LED TV",
        "query_type": "product_name",
        "language": "en"
    },
    "auto_lookup": {
        "query": "Air conditioner",
        "query_type": "auto",
        "language": "en"
    },
    "hindi_lookup": {
        "query": "सीमेंट",
        "query_type": "auto",
        "language": "hi"
    }
}


# Sample API responses
SAMPLE_RESPONSES = {
    "success_lookup": {
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
        "confidence": 1.0,
        "interpreted_from": "HSN code: 8528",
        "warning": None
    },
    "not_found": {
        "error": "hsn_not_found",
        "message": "Yeh HSN code abhi hamare database mein nahi hai.",
        "interpreted_hsn": "9999"
    },
    "rate_limit_exceeded": {
        "error": "rate_limit_exceeded",
        "message": "Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.",
        "details": "Free tier: 3 lookups per day per IP address.",
        "upgrade_url": "https://saralgst.in/upgrade"
    }
}


@pytest.fixture
def sample_hsn_codes():
    """Fixture providing sample HSN codes"""
    return SAMPLE_HSN_CODES


@pytest.fixture
def sample_product_names():
    """Fixture providing sample product names"""
    return SAMPLE_PRODUCT_NAMES


@pytest.fixture
def rate_changed_items():
    """Fixture providing rate changed items"""
    return RATE_CHANGED_ITEMS


@pytest.fixture
def sample_categories():
    """Fixture providing sample categories"""
    return SAMPLE_CATEGORIES


@pytest.fixture
def sample_requests():
    """Fixture providing sample API requests"""
    return SAMPLE_REQUESTS


@pytest.fixture
def sample_responses():
    """Fixture providing sample API responses"""
    return SAMPLE_RESPONSES


@pytest.fixture
def hsn_lookup_request():
    """Fixture providing HSN lookup request"""
    return SAMPLE_REQUESTS["hsn_lookup"]


@pytest.fixture
def product_lookup_request():
    """Fixture providing product lookup request"""
    return SAMPLE_REQUESTS["product_lookup"]


@pytest.fixture
def auto_lookup_request():
    """Fixture providing auto lookup request"""
    return SAMPLE_REQUESTS["auto_lookup"]


@pytest.fixture
def success_lookup_response():
    """Fixture providing successful lookup response"""
    return SAMPLE_RESPONSES["success_lookup"]


@pytest.fixture
def not_found_response():
    """Fixture providing not found response"""
    return SAMPLE_RESPONSES["not_found"]


@pytest.fixture
def rate_limit_exceeded_response():
    """Fixture providing rate limit exceeded response"""
    return SAMPLE_RESPONSES["rate_limit_exceeded"]