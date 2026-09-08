from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from businesses.permissions import IsBusinessMember
from .revenue import calculate_revenue_metrics
from .expenses import calculate_expense_metrics
from .products import calculate_product_analytics
from .customers import calculate_customer_analytics
from .root_cause import perform_root_cause_analysis

class DashboardOverviewAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        rev_data = calculate_revenue_metrics(request.business, start_date, end_date)
        exp_data = calculate_expense_metrics(request.business, start_date, end_date)
        prod_data = calculate_product_analytics(request.business, start_date, end_date)
        cust_data = calculate_customer_analytics(request.business, start_date, end_date)
        root_cause = perform_root_cause_analysis(request.business)

        return Response({
            'kpis': {
                'revenue': rev_data['total_revenue'],
                'revenue_growth': rev_data['growth_percentage'],
                'expenses': exp_data['total_expenses'],
                'expense_growth': exp_data['expense_growth_percentage'],
                'profit': exp_data['net_profit'],
                'profit_margin': exp_data['profit_margin'],
                'orders': rev_data['total_orders'],
                'customers': cust_data['total_customers'],
            },
            'revenue_trend': rev_data['monthly_trend'],
            'expense_trend': exp_data['monthly_trend'],
            'expense_categories': exp_data['category_breakdown'],
            'top_products': prod_data['top_products'][:5],
            'regional_sales': rev_data['regional_breakdown'],
            'root_cause': root_cause,
        })

class SalesAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        return Response(calculate_revenue_metrics(request.business, start_date, end_date))

class ExpenseAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        return Response(calculate_expense_metrics(request.business, start_date, end_date))

class ProductAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        return Response(calculate_product_analytics(request.business, start_date, end_date))

class CustomerAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        return Response(calculate_customer_analytics(request.business, start_date, end_date))

class RootCauseAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def get(self, request):
        return Response(perform_root_cause_analysis(request.business))
