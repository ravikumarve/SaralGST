#!/usr/bin/env python3
"""
GST Rates Validation Script
============================

Validates gst_rates.json for:
- Required fields presence
- HSN code format (2-8 digits)
- Valid GST rates (0, 5, 12, 18, 28)
- No duplicate HSN codes
- Prints summary report

Usage: python scripts/validate_rates.py
"""

import json
import sys
from pathlib import Path
from typing import List, Dict, Set


class RatesValidator:
    """Validates GST rates JSON file"""
    
    # Valid GST rates
    VALID_RATES = {0, 5, 12, 18, 28}
    
    # Required fields
    REQUIRED_FIELDS = {
        'hsn', 'description', 'description_hi', 'category',
        'old_rate', 'new_rate', 'rate_changed', 'movement',
        'notification_ref', 'notes'
    }
    
    # Valid movement values
    VALID_MOVEMENTS = {'up', 'down', 'unchanged', 'new_exempt'}
    
    def __init__(self, data_path: str):
        """Initialize validator"""
        self.data_path = Path(data_path)
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.hsn_codes: Set[str] = set()
        
    def validate(self) -> bool:
        """Run all validations"""
        print(f"🔍 Validating: {self.data_path}")
        print("=" * 60)
        
        # Load JSON
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"❌ Failed to load JSON: {e}")
            return False
        
        # Validate structure
        if 'version' not in data:
            self.errors.append("Missing 'version' field")
        if 'last_updated' not in data:
            self.errors.append("Missing 'last_updated' field")
        if 'items' not in data:
            self.errors.append("Missing 'items' field")
            return False
        
        items = data['items']
        print(f"📊 Total items: {len(items)}")
        
        # Validate each item
        for idx, item in enumerate(items, 1):
            self._validate_item(item, idx)
        
        # Print results
        self._print_results(data)
        
        return len(self.errors) == 0
    
    def _validate_item(self, item: Dict, idx: int):
        """Validate a single item"""
        # Check required fields
        missing_fields = self.REQUIRED_FIELDS - set(item.keys())
        if missing_fields:
            self.errors.append(f"Item {idx}: Missing fields: {missing_fields}")
        
        # Validate HSN code
        hsn = item.get('hsn', '')
        if not hsn:
            self.errors.append(f"Item {idx}: Empty HSN code")
        elif not hsn.isdigit():
            self.errors.append(f"Item {idx}: HSN code must be numeric: {hsn}")
        elif len(hsn) < 2 or len(hsn) > 8:
            self.errors.append(f"Item {idx}: HSN code must be 2-8 digits: {hsn}")
        else:
            # Check for duplicates
            if hsn in self.hsn_codes:
                self.errors.append(f"Item {idx}: Duplicate HSN code: {hsn}")
            self.hsn_codes.add(hsn)
        
        # Validate rates
        old_rate = item.get('old_rate')
        new_rate = item.get('new_rate')
        
        if old_rate not in self.VALID_RATES:
            self.errors.append(f"Item {idx}: Invalid old_rate: {old_rate}")
        
        if new_rate not in self.VALID_RATES:
            self.errors.append(f"Item {idx}: Invalid new_rate: {new_rate}")
        
        # Validate rate_changed consistency
        rate_changed = item.get('rate_changed')
        if rate_changed and old_rate == new_rate:
            self.warnings.append(f"Item {idx}: rate_changed=True but rates are same")
        if not rate_changed and old_rate != new_rate:
            self.errors.append(f"Item {idx}: rate_changed=False but rates differ")
        
        # Validate movement
        movement = item.get('movement')
        if movement not in self.VALID_MOVEMENTS:
            self.errors.append(f"Item {idx}: Invalid movement: {movement}")
        
        # Validate movement consistency
        if movement == 'up' and new_rate <= old_rate:
            self.errors.append(f"Item {idx}: movement='up' but new_rate <= old_rate")
        if movement == 'down' and new_rate >= old_rate:
            self.errors.append(f"Item {idx}: movement='down' but new_rate >= old_rate")
        if movement == 'unchanged' and old_rate != new_rate:
            self.errors.append(f"Item {idx}: movement='unchanged' but rates differ")
    
    def _print_results(self, data: Dict):
        """Print validation results"""
        print("\n" + "=" * 60)
        
        # Print errors
        if self.errors:
            print(f"❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  - {error}")
        else:
            print("✅ No errors found")
        
        # Print warnings
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  - {warning}")
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 SUMMARY:")
        print(f"  Version: {data.get('version', 'N/A')}")
        print(f"  Last Updated: {data.get('last_updated', 'N/A')}")
        print(f"  Total Items: {len(data['items'])}")
        print(f"  Unique HSN Codes: {len(self.hsn_codes)}")
        
        # Count by category
        categories = {}
        rate_changed_count = 0
        for item in data['items']:
            cat = item.get('category', 'Unknown')
            categories[cat] = categories.get(cat, 0) + 1
            if item.get('rate_changed'):
                rate_changed_count += 1
        
        print(f"  Items with Rate Changes: {rate_changed_count}")
        print(f"  Categories: {len(categories)}")
        
        print("\n📦 Items by Category:")
        for cat, count in sorted(categories.items()):
            print(f"  - {cat}: {count}")
        
        print("\n" + "=" * 60)
        
        if len(self.errors) == 0:
            print("✅ VALIDATION PASSED")
        else:
            print("❌ VALIDATION FAILED")
        
        print("=" * 60)


def main():
    """Main entry point"""
    # Default path
    data_path = Path(__file__).parent.parent / "data" / "gst_rates.json"
    
    # Allow custom path
    if len(sys.argv) > 1:
        data_path = Path(sys.argv[1])
    
    if not data_path.exists():
        print(f"❌ File not found: {data_path}")
        sys.exit(1)
    
    # Run validation
    validator = RatesValidator(data_path)
    success = validator.validate()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
