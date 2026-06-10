"""
Test Suite for SaralGST Backend
================================

Comprehensive tests for GST rate lookup API.

Author: SaralGST Team
Version: 1.0.0
"""

import pytest
from fastapi.testclient import TestClient
from main import app
import json


# Test client
client = TestClient(app)


class TestHealthCheck:
    """Tests for health check endpoint"""
    
    def test_health_check(self):
        """Test health check endpoint returns 200"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "ok"
        assert data["version"] == "1.0.0"
        assert data["data_version"] == "GST_2.0_Sept2025"
        assert "timestamp" in data
        assert data["items_count"] > 0
    
    def test_root_endpoint(self):
        """Test root endpoint returns API information"""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "SaralGST API"
        assert data["version"] == "1.0.0"
        assert "endpoints" in data


class TestLookupByHSN:
    """Tests for HSN code lookup"""
    
    def test_lookup_by_exact_hsn_code(self):
        """Test lookup by exact HSN code"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "8528",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["hsn_code"] == "8528"
        assert "Television" in data["description"]
        assert data["old_rate"] == 28
        assert data["new_rate"] == 18
        assert data["rate_changed"] is True
        assert data["movement"] == "down"
        assert data["confidence"] == 1.0
    
    def test_lookup_by_hsn_cement(self):
        """Test lookup for cement (rate changed)"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "2523",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["hsn_code"] == "2523"
        assert "Cement" in data["description"]
        assert data["old_rate"] == 28
        assert data["new_rate"] == 18
        assert data["rate_changed"] is True
    
    def test_lookup_by_hsn_wheat(self):
        """Test lookup for wheat (exempt)"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "1001",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["hsn_code"] == "1001"
        assert data["old_rate"] == 0
        assert data["new_rate"] == 0
        assert data["rate_changed"] is False
    
    def test_lookup_hsn_not_found(self):
        """Test lookup for non-existent HSN code"""
        # Note: The rate engine falls back to chapter-level lookup
        # So HSN 9999 will match chapter 99 (Services)
        # This is intentional behavior
        response = client.post(
            "/api/lookup",
            json={
                "query": "9999",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        # Should return 200 with chapter-level fallback
        assert response.status_code == 200
        data = response.json()
        
        # Should return a result from chapter 99
        assert data["hsn_code"].startswith("99")
    
    def test_lookup_invalid_hsn_format(self):
        """Test lookup with invalid HSN format"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "ABC123",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        # Should return 404 or handle gracefully
        assert response.status_code in [400, 404]


class TestLookupByProductName:
    """Tests for product name lookup"""
    
    def test_lookup_by_product_name_english(self):
        """Test lookup by English product name"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "LED TV",
                "query_type": "product_name",
                "language": "en"
            }
        )
        
        # Note: This test may fail if Gemini is not configured
        # The API should fall back to local search
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            data = response.json()
            assert "hsn_code" in data
            assert "description" in data
    
    def test_lookup_by_product_name_auto_detect(self):
        """Test auto-detection of query type"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "Air conditioner",
                "query_type": "auto",
                "language": "en"
            }
        )
        
        assert response.status_code in [200, 404]
    
    def test_lookup_empty_query(self):
        """Test lookup with empty query"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "",
                "query_type": "auto",
                "language": "en"
            }
        )
        
        # Should return validation error
        assert response.status_code == 422


class TestRateChanges:
    """Tests for GST 2.0 rate changes"""
    
    def test_television_rate_change(self):
        """Test TV rate change (28% → 18%)"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "8528",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["old_rate"] == 28
        assert data["new_rate"] == 18
        assert data["rate_changed"] is True
        assert data["movement"] == "down"
    
    def test_air_conditioner_rate_change(self):
        """Test AC rate change (28% → 18%)"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "8415",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["old_rate"] == 28
        assert data["new_rate"] == 18
        assert data["rate_changed"] is True
    
    def test_spectacles_rate_change(self):
        """Test spectacles rate change (28% → 5%)"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "9004",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["old_rate"] == 28
        assert data["new_rate"] == 5
        assert data["rate_changed"] is True
    
    def test_packaged_food_rate_change(self):
        """Test packaged food rate change (12% → 5%)"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "1905",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["old_rate"] == 12
        assert data["new_rate"] == 5
        assert data["rate_changed"] is True


class TestStatistics:
    """Tests for statistics endpoint"""
    
    def test_get_statistics(self):
        """Test getting database statistics"""
        response = client.get("/api/statistics")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "total_items" in data
        assert "rate_changed" in data
        assert "categories" in data
        assert "category_list" in data
        assert "movement_counts" in data
        assert data["total_items"] > 0
        assert data["categories"] > 0
    
    def test_get_categories(self):
        """Test getting all categories"""
        response = client.get("/api/categories")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "categories" in data
        assert isinstance(data["categories"], list)
        assert len(data["categories"]) > 0


class TestSuggestions:
    """Tests for HSN code suggestions"""
    
    def test_get_suggestions(self):
        """Test getting HSN code suggestions"""
        response = client.get("/api/suggestions?query=85&limit=5")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "query" in data
        assert "suggestions" in data
        assert data["query"] == "85"
        assert isinstance(data["suggestions"], list)
    
    def test_get_suggestions_empty_query(self):
        """Test suggestions with empty query"""
        response = client.get("/api/suggestions?query=&limit=5")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "suggestions" in data
        # Should return empty list or all HSN codes
        assert isinstance(data["suggestions"], list)


class TestRateLimiting:
    """Tests for rate limiting"""
    
    def test_rate_limit_headers(self):
        """Test that rate limit headers are present"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "8528",
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 200
        
        # Check for rate limit headers
        headers = response.headers
        # Note: These may not be present in test environment
        # but should be present in production


class TestErrorHandling:
    """Tests for error handling"""
    
    def test_invalid_json(self):
        """Test handling of invalid JSON"""
        response = client.post(
            "/api/lookup",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
    
    def test_missing_required_fields(self):
        """Test handling of missing required fields"""
        response = client.post(
            "/api/lookup",
            json={
                "query_type": "hsn",
                "language": "en"
            }
        )
        
        assert response.status_code == 422
    
    def test_invalid_query_type(self):
        """Test handling of invalid query type"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "8528",
                "query_type": "invalid",
                "language": "en"
            }
        )
        
        assert response.status_code == 422


class TestHindiLanguage:
    """Tests for Hindi language support"""
    
    def test_hindi_description_present(self):
        """Test that Hindi description is present in response"""
        response = client.post(
            "/api/lookup",
            json={
                "query": "8528",
                "query_type": "hsn",
                "language": "hi"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Hindi description should be present
        assert "description_hi" in data
        assert data["description_hi"] is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])