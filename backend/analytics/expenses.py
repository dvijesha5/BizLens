from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from expenses.models import Expense
from sales.models import Sale

def calculate_expense_metrics(business, start_date=None, end_date=None):
    exp_qs = Expense.objects.filter(business=business)
    sales_qs = Sale.objects.filter(business=business)

    if start_date:
        exp_qs = exp_qs.filter(date__gte=start_date)
        sales_qs = sales_qs.filter(date__gte=start_date)
    if end_date:
        exp_qs = exp_qs.filter(date__lte=end_date)
        sales_qs = sales_qs.filter(date__lte=end_date)

    total_expenses = float(exp_qs.aggregate(Sum('amount'))['amount__sum'] or 0.0)
    total_revenue = float(sales_qs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0.0)
    net_profit = total_revenue - total_expenses
    profit_margin = round((net_profit / total_revenue) * 100, 1) if total_revenue > 0 else 0.0

    # Expense Categories
    categories = exp_qs.values('category').annotate(amount=Sum('amount')).order_by('-amount')
    category_breakdown = [
        {
            'category': item['category'],
            'amount': float(item['amount']),
            'percentage': round((float(item['amount']) / total_expenses) * 100, 1) if total_expenses > 0 else 0.0
        }
        for item in categories
    ]

    # Monthly Expenses Trend
    monthly = exp_qs.annotate(month=TruncMonth('date')).values('month').annotate(amount=Sum('amount')).order_by('month')
    monthly_trend = [
        {
            'month': item['month'].strftime('%b %Y') if item['month'] else 'N/A',
            'amount': float(item['amount'])
        }
        for item in monthly
    ]

    expense_growth_pct = 0.0
    if len(monthly_trend) >= 2:
        curr_exp = monthly_trend[-1]['amount']
        prev_exp = monthly_trend[-2]['amount']
        if prev_exp > 0:
            expense_growth_pct = round(((curr_exp - prev_exp) / prev_exp) * 100, 1)

    return {
        'total_expenses': round(total_expenses, 2),
        'net_profit': round(net_profit, 2),
        'profit_margin': profit_margin,
        'expense_growth_percentage': expense_growth_pct,
        'category_breakdown': category_breakdown,
        'monthly_trend': monthly_trend,
    }
