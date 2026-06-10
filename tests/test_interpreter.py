"""
Test Suite for SaralGST Interpreter Service
===========================================

Comprehensive tests for the interpreter service that converts natural language
to HSN codes using Google Gemini Flash with fallback to local search.

Author: SaralGST Team
Version: 1.0.0
"""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from fastapi.testclient import TestClient
from main import app
import json


# Test client
client = TestClient(app)


class TestInterpreterService:
    """Tests for interpreter service"""
    
    def test_numeric_query_bypasses_gemini(self):
        """Test that numeric queries bypass Gemini and go directly to HSN lookup"""
        # When query is numeric, it should skip Gemini and go directly to rate engine
        response = client.post(
            "/api/lookup",
            json={
                "query": "8528",
                "query_type": "auto",
                "language": "en"
            }
        )
        
        # Should return 200 with successful lookup
        assert response.status_code == 200
        data = response.json()
        
        # Should have HSN code from direct lookup
        assert data["hsn_code"] == "8528"
        assert "Television" in data["description"]
        assert data["confidence"] == 1.0  # Exact match confidence
    
    def test_interpreter_with_gemini_api_key(self):
        """Test interpreter service when Gemini API key is available"""
        # This test ensures that when GEMINI_API_KEY is set, the interpreter
        # service is used instead of fallback
        with patch.dict('os.environ', {'GEMINI_API_KEY': 'test_key'}):
            # Mock the interpreter service
            with patch('services.interpreter.get_interpreter_service') as mock_get_interpreter:
                mock_interpreter = Mock()
                mock_interpreter.interpret_product = AsyncMock(return_value=("8415", 0.8))
                mock_get_interpreter.return_value = mock_interpreter
                
                response = client.post(
                    "/api/lookup",
                    json={
                        "query": "Air conditioner",
                        "query_type": "product_name",
                        "language": "en"
                    }
                )
                
                # Should return 200 with successful lookup
                assert response.status_code == 200
                data = response.json()
                
                # Should have HSN code from interpreter
                assert data["hsn_code"] == "8415"
                assert "Air conditioners" in data["description"]
    
    def test_interpreter_without_gemini_api_key(self):
        """Test interpreter service when Gemini API key is not available"""
        # This test ensures that when GEMINI_API_KEY is not set, the system
        # falls back to local search
        with patch.dict('os.environ', {}, clear=True):
            # Mock the rate engine to return a fallback result
            with patch('routers.lookup.get_rate_engine') as mock_get_rate_engine:
                mock_rate_engine = Mock()
                mock_rate_engine.lookup_by_hsn = Mock(return_value=None)
                mock_rate_engine.search_by_description = Mock(return_value=[])
                mock_get_rate_engine.return_value = mock_rate_engine
                
                response = client.post(
                    "/api/lookup",
                    json={
                        "query": "Unknown product",
                        "query_type": "product_name",
                        "language": "en"
                    }
                )
                
                # Should return 404 with not found error
                assert response.status_code == 404
                data = response.json()
                
                # Should have error response (error is nested in detail)
                assert "detail" in data
                assert "error" in data["detail"]
                assert data["detail"]["error"] == "product_not_found"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])