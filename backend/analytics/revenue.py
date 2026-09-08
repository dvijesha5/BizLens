from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
from sales.models import Sale
from datetime import datetime, timedelta

def calculate_revenue_metrics(business, start_date=None, end_date=None):
    sales_qs = Sale.objects.filter(business=business)
    if start_date:
        sales_qs = sales_qs.filter(date__gte=start_date)
    if end_date:
        sales_qs = sales_qs.filter(date__lte=end_date)

    total_revenue = float(sales_qs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0.0)
    total_orders = sales_qs.count()
    aov = float(sales_qs.aggregate(Avg('total_amount'))['total_amount__avg'] or 0.0)

    # Monthly Trend
    monthly = sales_qs.annotate(month=TruncMonth('date')).values('month').annotate(
        revenue=Sum('total_amount'),
        orders=Count('id')
    ).order_by('month')

    monthly_trend = [
        {
            'month': item['month'].strftime('%b %Y') if item['month'] else 'N/A',
            'revenue': float(item['revenue']),
            'orders': item['orders']
        }
        for item in monthly
    ]

    # Calculate Period-Over-Period Revenue Growth %
    growth_pct = 0.0
    if len(monthly_trend) >= 2:
        current_rev = monthly_trend[-1]['revenue']
        prev_rev = monthly_trend[-2]['revenue']
        if prev_rev > 0:
            growth_pct = round(((current_rev - prev_rev) / prev_rev) * 100, 1)

    # Regional Breakdown
    regional = sales_qs.values('region').annotate(revenue=Sum('total_amount')).order_by('-revenue')
    regional_breakdown = [
        {'region': item['region'], 'revenue': float(item['revenue'])}
        for item in regional
    ]

    return {
        'total_revenue': round(total_revenue, 2),
        'total_orders': total_orders,
        'average_order_value': round(aov, 2),
        'growth_percentage': growth_pct,
        'monthly_trend': monthly_trend,
        'regional_breakdown': regional_breakdown,
    }
