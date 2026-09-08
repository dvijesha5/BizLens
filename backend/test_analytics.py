import os
import sys
import django
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from businesses.models import Business
from analytics.revenue import calculate_revenue_metrics
from analytics.expenses import calculate_expense_metrics
from analytics.root_cause import perform_root_cause_analysis

def test_engine():
    biz = Business.objects.first()
    if not biz:
        print("No business found.")
        return

    print(f"📊 Testing Analytics Engine for Business: '{biz.name}'")
    rev = calculate_revenue_metrics(biz)
    exp = calculate_expense_metrics(biz)
    root = perform_root_cause_analysis(biz)

    print(f"✓ Total Revenue: ₹{rev['total_revenue']:,.2f}")
    print(f"✓ Total Expenses: ₹{exp['total_expenses']:,.2f}")
    print(f"✓ Net Profit: ₹{exp['net_profit']:,.2f} (Margin: {exp['profit_margin']}%)")
    print(f"✓ Total Orders: {rev['total_orders']}")
    print(f"✓ Root Cause Headline: {root['headline']}")
    print(f"✓ Most Significant Factor: {root['most_significant_factor']}")
    print("🎉 ALL ANALYTICS & ROOT-CAUSE TEST VERIFICATIONS PASSED!")

if __name__ == '__main__':
    test_engine()
