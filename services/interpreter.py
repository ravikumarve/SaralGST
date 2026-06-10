"""
Interpreter Service
===================

Natural language to HSN code interpretation using Google Gemini Flash.
Provides intelligent product name to HSN code mapping with fallback to local search.

Author: SaralGST Team
Version: 1.0.0
"""

import logging
import re
import asyncio
from typing import Tuple, Optional
import google.generativeai as genai
from .rate_engine import RateEngine


class InterpreterService:
    """Natural language to HSN code interpreter"""
    
    def __init__(self, api_key: str, rate_engine: RateEngine):
        """
        Initialize interpreter service.
        
        Args:
            api_key: Google Gemini API key
            rate_engine: RateEngine instance for fallback
        """
        self.api_key = api_key
        self.rate_engine = rate_engine
        self.logger = logging.getLogger(__name__)
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Timeout for Gemini calls (seconds)
        self.timeout = 10
        
        self.logger.info("Interpreter service initialized")
    
    async def interpret_product(self, query: str) -> Tuple[str, float]:
        """
        Interpret product name to HSN code.
        
        Args:
            query: Product name or description (Hindi or English)
        
        Returns:
            Tuple of (hsn_code, confidence_score)
        """
        # Check if query is already a numeric HSN code
        if self._is_hsn_code(query):
            self.logger.info(f"Query is already HSN code: {query}")
            return query, 1.0
        
        try:
            # Call Gemini with timeout
            hsn_code = await asyncio.wait_for(
                self._call_gemini(query),
                timeout=self.timeout
            )
            
            # Validate HSN code
            if self._is_valid_hsn(hsn_code):
                self.logger.info(f"Gemini interpreted '{query}' as HSN: {hsn_code}")
                return hsn_code, 0.9
            else:
                self.logger.warning(f"Gemini returned invalid HSN: {hsn_code}")
                return await self._fallback_search(query)
        
        except asyncio.TimeoutError:
            self.logger.warning(f"Gemini timeout for query: {query}")
            return await self._fallback_search(query)
        
        except Exception as e:
            self.logger.error(f"Gemini error for query '{query}': {e}")
            return await self._fallback_search(query)
    
    async def _call_gemini(self, query: str) -> str:
        """
        Call Gemini API to get HSN code.
        
        Args:
            query: Product name or description
        
        Returns:
            HSN code as string
        """
        prompt = self._build_prompt(query)
        
        try:
            response = self.model.generate_content(prompt)
            result = response.text.strip()
            
            # Extract HSN code from response
            hsn_match = re.search(r'\d{2,8}', result)
            if hsn_match:
                return hsn_match.group()
            else:
                # If no number found, return UNKNOWN
                return "UNKNOWN"
        
        except Exception as e:
            self.logger.error(f"Gemini API call failed: {e}")
            raise
    
    def _build_prompt(self, query: str) -> str:
        """
        Build prompt for Gemini.
        
        Args:
            query: Product name or description
        
        Returns:
            Prompt string
        """
        return f"""You are a GST expert for India. A business owner has described their product or service in plain language.

Your task: Return ONLY the most likely HSN code (4 or 8 digits) for this product under India's GST system.

Rules:
- Return ONLY the HSN code as a plain number, nothing else
- If the description is a service, return the SAC code instead
- If multiple HSN codes could apply, return the most common one for small Indian businesses
- If you cannot determine the HSN code with reasonable confidence, return "UNKNOWN"
- Do not explain your reasoning. Just the code.

Product/Service description: {query}"""
    
    async def _fallback_search(self, query: str) -> Tuple[str, float]:
        """
        Fallback to local description search.
        
        Args:
            query: Product name or description
        
        Returns:
            Tuple of (hsn_code, confidence_score)
        """
        self.logger.info(f"Using fallback search for: {query}")
        
        # Search by description
        results = self.rate_engine.search_by_description(query, limit=1)
        
        if results:
            hsn_code = results[0].hsn
            confidence = 0.5  # Lower confidence for fallback
            self.logger.info(f"Fallback found HSN: {hsn_code} with confidence: {confidence}")
            return hsn_code, confidence
        else:
            self.logger.warning(f"Fallback search failed for: {query}")
            return "UNKNOWN", 0.0
    
    def _is_hsn_code(self, query: str) -> bool:
        """
        Check if query is already an HSN code.
        
        Args:
            query: Query string
        
        Returns:
            True if query is a valid HSN code
        """
        return query.isdigit() and 2 <= len(query) <= 8
    
    def _is_valid_hsn(self, hsn: str) -> bool:
        """
        Validate HSN code format.
        
        Args:
            hsn: HSN code to validate
        
        Returns:
            True if valid, False otherwise
        """
        if not hsn or hsn == "UNKNOWN":
            return False
        
        return hsn.isdigit() and 2 <= len(hsn) <= 8
    
    def get_statistics(self) -> dict:
        """
        Get interpreter service statistics.
        
        Returns:
            Dictionary with statistics
        """
        return {
            "model": "gemini-1.5-flash",
            "timeout": self.timeout,
            "fallback_enabled": True
        }


# Singleton instance for reuse
_interpreter_service_instance = None


def get_interpreter_service(api_key: str, rate_engine: RateEngine) -> InterpreterService:
    """
    Get or create the InterpreterService singleton instance.
    
    Args:
        api_key: Google Gemini API key
        rate_engine: RateEngine instance
    
    Returns:
        InterpreterService instance
    """
    global _interpreter_service_instance
    
    if _interpreter_service_instance is None:
        _interpreter_service_instance = InterpreterService(api_key, rate_engine)
    
    return _interpreter_service_instance