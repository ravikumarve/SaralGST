"""
Configuration Module
====================

Application configuration for SaralGST backend.

Author: SaralGST Team
Version: 1.0.0
"""

import os
from pathlib import Path


class Config:
    """Application configuration"""
    
    # Data paths
    BASE_DIR = Path(__file__).parent
    DATA_DIR = BASE_DIR / "data"
    RATES_FILE = DATA_DIR / "gst_rates.json"
    
    # API configuration
    API_VERSION = "1.0.0"
    DATA_VERSION = "GST_2.0_Sept2025"
    
    # Rate limiting
    RATE_LIMIT_FREE = int(os.getenv("RATE_LIMIT_FREE", "3"))
    RATE_LIMIT_PAID = int(os.getenv("RATE_LIMIT_PAID", "1000"))
    
    # CORS
    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,https://saralgst.in"
    ).split(",")
    
    # Security
    HMAC_SECRET = os.getenv("HMAC_SECRET", "")
    
    @classmethod
    def validate(cls):
        """Validate configuration"""
        if not cls.HMAC_SECRET:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning("HMAC_SECRET not set - using default (INSECURE!)")
        if not cls.RATES_FILE.exists():
            raise FileNotFoundError(f"Rates file not found: {cls.RATES_FILE}")
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Configuration validated - Data version: {cls.DATA_VERSION}")