from django.db.models import Sum, Count, Avg
from sales.models import Sale

def calculate_product_analytics(business, start_date=None, end_date=None):
    sales_qs = Sale.objects.filter(business=business)
    if start_date:
        sales_qs = sales_qs.filter(date__gte=start_date)
    if end_date:
        sales_qs = sales_qs.filter(date__lte=end_date)

    total_revenue = float(sales_qs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0.0)

    products = sales_qs.values('product_name').annotate(
        revenue=Sum('total_amount'),
        quantity=Sum('quantity'),
        orders=Count('id'),
        avg_price=Avg('unit_price')
    ).order_by('-revenue')

    top_products = [
        {
            'name': item['product_name'],
            'revenue': float(item['revenue']),
            'quantity': item['quantity'],
            'orders': item['orders'],
            'avg_price': round(float(item['avg_price'] or 0), 2),
            'share_percentage': round((float(item['revenue']) / total_revenue) * 100, 1) if total_revenue > 0 else 0.0
        }
        for item in products
    ]

    return {
        'total_products_sold': len(top_products),
        'top_products': top_products
    }
