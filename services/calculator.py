"""
Calculator Service
==================

GST tax calculation service.
Computes CGST, SGST, IGST breakdown for a given base price and GST rate.

Author: SaralGST Team
Version: 1.0.0
"""

from pydantic import BaseModel


class CalculationRequest(BaseModel):
    """Request model for GST calculation"""
    base_price: float
    gst_rate: float


class CalculationResponse(BaseModel):
    """Response model for GST calculation"""
    base_price: float
    gst_rate: float
    cgst: float
    sgst: float
    igst: float
    total_amount: float


class CalculatorService:
    """GST tax calculation service"""

    def calculate_tax(self, base_price: float, gst_rate: float) -> CalculationResponse:
        """
        Calculate GST tax breakdown.

        Args:
            base_price: Base price of the product (before tax)
            gst_rate: Applicable GST rate in percentage

        Returns:
            CalculationResponse with CGST, SGST, IGST, and total amount
        """
        tax_amount = base_price * (gst_rate / 100)
        cgst = tax_amount / 2
        sgst = tax_amount / 2
        igst = tax_amount  # Full IGST for inter-state
        total_amount = base_price + tax_amount

        return CalculationResponse(
            base_price=base_price,
            gst_rate=gst_rate,
            cgst=round(cgst, 2),
            sgst=round(sgst, 2),
            igst=round(igst, 2),
            total_amount=round(total_amount, 2)
        )


# Singleton instance
calc_service = CalculatorService()
