"""
Rate Engine Service
===================

HSN code lookup and rate resolution service.
Handles HSN codes of varying length (2, 4, 6, 8 digits) with fallback to chapter-level lookup.

Author: SaralGST Team
Version: 1.0.0
"""

import json
import logging
from pathlib import Path
from typing import Optional, List, Dict
from dataclasses import dataclass


@dataclass
class RateResult:
    """Result of a rate lookup"""
    hsn: str
    description: str
    description_hi: str
    category: str
    old_rate: float
    new_rate: float
    rate_changed: bool
    movement: str
    notification_ref: str
    notes: str
    confidence: float
    match_type: str  # "exact" | "chapter" | "none"


class RateEngine:
    """GST rate lookup engine"""
    
    def __init__(self, data_path: str):
        """
        Initialize rate engine with GST rates data.
        
        Args:
            data_path: Path to gst_rates.json file
        """
        self.data_path = Path(data_path)
        self.logger = logging.getLogger(__name__)
        
        # Load and cache rates data
        self._load_data()
        
        # Build lookup dictionaries
        self._build_lookups()
    
    def _load_data(self):
        """Load GST rates from JSON file"""
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            
            self.items = self.data.get('items', [])
            self.logger.info(f"Loaded {len(self.items)} GST rate items")
        except Exception as e:
            self.logger.error(f"Failed to load rates data: {e}")
            raise
    
    def _build_lookups(self):
        """Build lookup dictionaries for fast access"""
        # Exact HSN lookup
        self.hsn_lookup = {item['hsn']: item for item in self.items}
        
        # Chapter-level lookup (2-digit prefix)
        self.chapter_lookup = {}
        for item in self.items:
            hsn = item['hsn']
            if len(hsn) >= 2:
                chapter = hsn[:2]
                if chapter not in self.chapter_lookup:
                    self.chapter_lookup[chapter] = []
                self.chapter_lookup[chapter].append(item)
        
        # Description lookup (for fallback)
        self.description_lookup = {}
        for item in self.items:
            desc = item['description'].lower()
            desc_hi = item['description_hi']
            self.description_lookup[desc] = item
            self.description_lookup[desc_hi] = item
        
        self.logger.info(f"Built lookups: {len(self.hsn_lookup)} HSN codes, {len(self.chapter_lookup)} chapters")
    
    def lookup_by_hsn(self, hsn: str) -> Optional[RateResult]:
        """
        Look up GST rate by HSN code.
        
        Args:
            hsn: HSN code (2-8 digits)
        
        Returns:
            RateResult if found, None otherwise
        """
        if not hsn or not hsn.isdigit():
            self.logger.warning(f"Invalid HSN code: {hsn}")
            return None
        
        hsn = hsn.strip()
        
        # Try exact match first
        if hsn in self.hsn_lookup:
            item = self.hsn_lookup[hsn]
            return self._create_result(item, confidence=1.0, match_type="exact")
        
        # Try chapter-level lookup (2-digit prefix)
        if len(hsn) >= 2:
            chapter = hsn[:2]
            if chapter in self.chapter_lookup:
                # Find the most specific match
                items = self.chapter_lookup[chapter]
                # Sort by HSN length (longer = more specific)
                items.sort(key=lambda x: len(x['hsn']), reverse=True)
                
                # Return the first (most specific) match
                item = items[0]
                return self._create_result(item, confidence=0.7, match_type="chapter")
        
        # Not found
        self.logger.info(f"HSN code not found: {hsn}")
        return None
    
    def search_by_description(self, query: str, limit: int = 3) -> List[RateResult]:
        """
        Search for GST rates by description.
        
        Args:
            query: Search query (English or Hindi)
            limit: Maximum number of results to return
        
        Returns:
            List of RateResult objects
        """
        if not query:
            return []
        
        query = query.lower().strip()
        results = []
        
        # Search in English descriptions
        for item in self.items:
            desc = item['description'].lower()
            desc_hi = item['description_hi']
            
            # Check if query is in description
            if query in desc or query in desc_hi:
                # Calculate confidence based on match quality
                confidence = 1.0 if query == desc else 0.6
                results.append(self._create_result(item, confidence=confidence, match_type="description"))
        
        # Sort by confidence and description length (shorter = more specific)
        results.sort(key=lambda x: (-x.confidence, len(x.description)))
        
        return results[:limit]
    
    def get_all_categories(self) -> List[str]:
        """Get all unique categories"""
        categories = set(item['category'] for item in self.items)
        return sorted(list(categories))
    
    def get_items_by_category(self, category: str) -> List[RateResult]:
        """Get all items in a category"""
        items = [item for item in self.items if item['category'] == category]
        return [self._create_result(item, confidence=1.0, match_type="exact") for item in items]
    
    def get_rate_changed_items(self) -> List[RateResult]:
        """Get all items with rate changes"""
        items = [item for item in self.items if item.get('rate_changed', False)]
        return [self._create_result(item, confidence=1.0, match_type="exact") for item in items]
    
    def get_statistics(self) -> Dict:
        """Get statistics about the rate database"""
        total_items = len(self.items)
        rate_changed = sum(1 for item in self.items if item.get('rate_changed', False))
        categories = self.get_all_categories()
        
        # Count by movement
        movement_counts = {}
        for item in self.items:
            movement = item.get('movement', 'unchanged')
            movement_counts[movement] = movement_counts.get(movement, 0) + 1
        
        return {
            'total_items': total_items,
            'rate_changed': rate_changed,
            'categories': len(categories),
            'category_list': categories,
            'movement_counts': movement_counts,
            'data_version': self.data.get('version', 'unknown'),
            'last_updated': self.data.get('last_updated', 'unknown')
        }
    
    def _create_result(self, item: Dict, confidence: float, match_type: str) -> RateResult:
        """Create a RateResult from an item dictionary"""
        return RateResult(
            hsn=item['hsn'],
            description=item['description'],
            description_hi=item['description_hi'],
            category=item['category'],
            old_rate=item['old_rate'],
            new_rate=item['new_rate'],
            rate_changed=item['rate_changed'],
            movement=item['movement'],
            notification_ref=item['notification_ref'],
            notes=item['notes'],
            confidence=confidence,
            match_type=match_type
        )
    
    def validate_hsn_format(self, hsn: str) -> bool:
        """
        Validate HSN code format.
        
        Args:
            hsn: HSN code to validate
        
        Returns:
            True if valid, False otherwise
        """
        if not hsn or not hsn.isdigit():
            return False
        
        # HSN codes are 2-8 digits
        return 2 <= len(hsn) <= 8
    
    def get_hsn_suggestions(self, partial_hsn: str, limit: int = 5) -> List[str]:
        """
        Get HSN code suggestions for autocomplete.
        
        Args:
            partial_hsn: Partial HSN code
            limit: Maximum number of suggestions
        
        Returns:
            List of HSN codes
        """
        if not partial_hsn or not partial_hsn.isdigit():
            return []
        
        partial_hsn = partial_hsn.strip()
        suggestions = []
        
        # Find HSN codes that start with the partial
        for hsn in self.hsn_lookup.keys():
            if hsn.startswith(partial_hsn):
                suggestions.append(hsn)
        
        # Sort by length (shorter first for autocomplete)
        suggestions.sort(key=len)
        
        return suggestions[:limit]


# Singleton instance for reuse
_rate_engine_instance = None


def get_rate_engine(data_path: str = None) -> RateEngine:
    """
    Get or create the RateEngine singleton instance.
    
    Args:
        data_path: Path to gst_rates.json file (only needed on first call)
    
    Returns:
        RateEngine instance
    """
    global _rate_engine_instance
    
    if _rate_engine_instance is None:
        if data_path is None:
            raise ValueError("data_path required on first call")
        _rate_engine_instance = RateEngine(data_path)
    
    return _rate_engine_instance