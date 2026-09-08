from django.db.models import Sum, Count, Max
from sales.models import Sale
from datetime import date, timedelta

def calculate_customer_analytics(business, start_date=None, end_date=None):
    sales_qs = Sale.objects.filter(business=business)
    if start_date:
        sales_qs = sales_qs.filter(date__gte=start_date)
    if end_date:
        sales_qs = sales_qs.filter(date__lte=end_date)

    latest_date = sales_qs.aggregate(Max('date'))['date__max'] or date.today()

    customer_stats = sales_qs.values('customer_code', 'region').annotate(
        total_spend=Sum('total_amount'),
        order_count=Count('id'),
        last_purchase=Max('date')
    ).order_by('-total_spend')

    total_customers = len(customer_stats)
    total_spend_all = float(sales_qs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0.0)
    avg_customer_spend = round(total_spend_all / total_customers, 2) if total_customers > 0 else 0.0

    # RFM Segmentation (Recency, Frequency, Monetary)
    segmented = {
        'VIP': [],
        'High Value': [],
        'Regular': [],
        'At Risk': [],
        'Churned': []
    }

    for cust in customer_stats:
        spend = float(cust['total_spend'])
        orders = cust['order_count']
        days_since = (latest_date - cust['last_purchase']).days if cust['last_purchase'] else 999

        code = cust['customer_code']
        cust_data = {
            'customer_code': code,
            'region': cust['region'],
            'total_spend': spend,
            'order_count': orders,
            'last_purchase': cust['last_purchase'].strftime('%Y-%m-%d') if cust['last_purchase'] else 'N/A',
            'days_since': days_since
        }

        if spend >= 100000 and orders >= 3 and days_since <= 60:
            tier = 'VIP'
        elif spend >= 50000 and days_since <= 90:
            tier = 'High Value'
        elif days_since <= 90:
            tier = 'Regular'
        elif days_since <= 180:
            tier = 'At Risk'
        else:
            tier = 'Churned'

        cust_data['tier'] = tier
        segmented[tier].append(cust_data)

    retention_count = len(segmented['VIP']) + len(segmented['High Value']) + len(segmented['Regular'])
    retention_rate = round((retention_count / total_customers) * 100, 1) if total_customers > 0 else 0.0

    return {
        'total_customers': total_customers,
        'average_customer_spend': avg_customer_spend,
        'retention_rate': retention_rate,
        'segmentation_summary': {tier: len(custs) for tier, custs in segmented.items()},
        'customer_segments': segmented,
    }
