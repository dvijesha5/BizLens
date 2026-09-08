from django.db.models import Sum, Count, Max
from django.db.models.functions import TruncMonth
from sales.models import Sale
from datetime import datetime

def perform_root_cause_analysis(business):
    sales_qs = Sale.objects.filter(business=business)
    if not sales_qs.exists():
        return {
            'has_data': False,
            'message': 'No sales transaction data available to perform root-cause analysis.'
        }

    # Group sales by month
    monthly = sales_qs.annotate(month=TruncMonth('date')).values('month').annotate(
        revenue=Sum('total_amount')
    ).order_by('-month')

    if len(monthly) < 2:
        return {
            'has_data': False,
            'message': 'At least 2 distinct months of data are required for period-over-period variance analysis.'
        }

    curr_month_date = monthly[0]['month']
    prev_month_date = monthly[1]['month']

    curr_revenue = float(monthly[0]['revenue'])
    prev_revenue = float(monthly[1]['revenue'])

    revenue_diff = curr_revenue - prev_revenue
    revenue_pct_change = round(((revenue_diff) / prev_revenue) * 100, 1) if prev_revenue > 0 else 0.0

    curr_month_str = curr_month_date.strftime('%B %Y')
    prev_month_str = prev_month_date.strftime('%B %Y')

    # Query product performance across both months
    curr_products = {
        p['product_name']: float(p['revenue'])
        for p in sales_qs.filter(date__year=curr_month_date.year, date__month=curr_month_date.month)
        .values('product_name').annotate(revenue=Sum('total_amount'))
    }
    prev_products = {
        p['product_name']: float(p['revenue'])
        for p in sales_qs.filter(date__year=prev_month_date.year, date__month=prev_month_date.month)
        .values('product_name').annotate(revenue=Sum('total_amount'))
    }

    all_products = set(curr_products.keys()).union(set(prev_products.keys()))
    product_deltas = []
    for prod in all_products:
        c_rev = curr_products.get(prod, 0.0)
        p_rev = prev_products.get(prod, 0.0)
        diff = c_rev - p_rev
        pct = round(((diff) / p_rev) * 100, 1) if p_rev > 0 else (100.0 if c_rev > 0 else 0.0)
        product_deltas.append({
            'product': prod,
            'current_revenue': c_rev,
            'previous_revenue': p_rev,
            'delta': diff,
            'pct_change': pct
        })

    product_deltas.sort(key=lambda x: x['delta'])

    # Query regional performance across both months
    curr_regions = {
        r['region']: float(r['revenue'])
        for r in sales_qs.filter(date__year=curr_month_date.year, date__month=curr_month_date.month)
        .values('region').annotate(revenue=Sum('total_amount'))
    }
    prev_regions = {
        r['region']: float(r['revenue'])
        for r in sales_qs.filter(date__year=prev_month_date.year, date__month=prev_month_date.month)
        .values('region').annotate(revenue=Sum('total_amount'))
    }

    all_regions = set(curr_regions.keys()).union(set(prev_regions.keys()))
    region_deltas = []
    for reg in all_regions:
        c_rev = curr_regions.get(reg, 0.0)
        p_rev = prev_regions.get(reg, 0.0)
        diff = c_rev - p_rev
        pct = round(((diff) / p_rev) * 100, 1) if p_rev > 0 else (100.0 if c_rev > 0 else 0.0)
        region_deltas.append({
            'region': reg,
            'current_revenue': c_rev,
            'previous_revenue': p_rev,
            'delta': diff,
            'pct_change': pct
        })

    region_deltas.sort(key=lambda x: x['delta'])

    # Major findings
    top_declining_product = product_deltas[0] if product_deltas else None
    top_declining_region = region_deltas[0] if region_deltas else None

    is_decline = revenue_diff < 0
    headline = (
        f"Revenue decreased by {abs(revenue_pct_change)}% in {curr_month_str} compared with {prev_month_str}."
        if is_decline else
        f"Revenue increased by {revenue_pct_change}% in {curr_month_str} compared with {prev_month_str}."
    )

    key_takeaways = []
    if top_declining_product and top_declining_product['delta'] < 0:
        key_takeaways.append(
            f"Sales of {top_declining_product['product']} dropped by {abs(top_declining_product['pct_change'])}% "
            f"(a net decline of ₹{abs(top_declining_product['delta']):,.0f})."
        )
    if top_declining_region and top_declining_region['delta'] < 0:
        key_takeaways.append(
            f"The {top_declining_region['region']} region experienced a {abs(top_declining_region['pct_change'])}% decline in sales revenue."
        )

    most_significant_factor = (
        f"{top_declining_product['product']} contributed approximately ₹{abs(top_declining_product['delta']):,.0f} less revenue than in {prev_month_str}."
        if top_declining_product and top_declining_product['delta'] < 0 else "Overall order volume shifted across regional channels."
    )

    return {
        'has_data': True,
        'current_period': curr_month_str,
        'previous_period': prev_month_str,
        'current_revenue': curr_revenue,
        'previous_revenue': prev_revenue,
        'revenue_change_amount': revenue_diff,
        'revenue_change_percentage': revenue_pct_change,
        'headline': headline,
        'key_takeaways': key_takeaways,
        'most_significant_factor': most_significant_factor,
        'product_breakdown': product_deltas,
        'regional_breakdown': region_deltas,
    }
