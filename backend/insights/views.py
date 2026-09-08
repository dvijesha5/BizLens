from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from businesses.permissions import IsBusinessMember
from analytics.revenue import calculate_revenue_metrics
from analytics.expenses import calculate_expense_metrics
from analytics.products import calculate_product_analytics
from analytics.customers import calculate_customer_analytics
from analytics.root_cause import perform_root_cause_analysis

class AskBusinessInsightView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]

    def post(self, request):
        query = request.data.get('query', '').strip().lower()
        if not query:
            return Response({'error': 'Query string is required.'}, status=status.HTTP_400_BAD_REQUEST)

        rev_data = calculate_revenue_metrics(request.business)
        exp_data = calculate_expense_metrics(request.business)
        prod_data = calculate_product_analytics(request.business)
        cust_data = calculate_customer_analytics(request.business)
        root_cause = perform_root_cause_analysis(request.business)

        top_prod = prod_data['top_products'][0] if prod_data['top_products'] else None
        at_risk_custs = cust_data['customer_segments'].get('At Risk', [])
        churned_custs = cust_data['customer_segments'].get('Churned', [])

        # Rule-based natural language query router
        if 'fall' in query or 'drop' in query or 'decline' in query or 'why' in query:
            if root_cause.get('has_data'):
                answer = (
                    f"{root_cause['headline']} {root_cause['most_significant_factor']} "
                    + " ".join(root_cause['key_takeaways'])
                )
            else:
                answer = "Insufficient historical transaction data to compute period-over-period variance."

        elif 'product' in query or 'profit' in query or 'best' in query or 'top' in query:
            if top_prod:
                answer = f"The top performing product is {top_prod['name']} generating ₹{top_prod['revenue']:,.2f} in total revenue, representing {top_prod['share_percentage']}% of all sales."
            else:
                answer = "No product sales data recorded yet."

        elif 'customer' in query or 'risk' in query or 'churn' in query:
            total_at_risk = len(at_risk_custs) + len(churned_custs)
            answer = f"There are {total_at_risk} customers currently classified as At Risk or Churned. Retaining these accounts could preserve key recurring revenue."

        elif 'focus' in query or 'recommend' in query or 'next' in query:
            if top_prod:
                answer = f"Based on your verified analytics: 1. Maintain adequate stock for your top seller ({top_prod['name']}). 2. Re-engage the {len(at_risk_custs)} At-Risk customer accounts before they fully churn."
            else:
                answer = "Upload recent sales and expense CSV datasets to receive data-backed operational recommendations."

        else:
            answer = (
                f"For {request.business.name}: Total Revenue is ₹{rev_data['total_revenue']:,.2f}, "
                f"Total Expenses are ₹{exp_data['total_expenses']:,.2f}, and Net Profit is ₹{exp_data['net_profit']:,.2f} "
                f"(Margin: {exp_data['profit_margin']}%)."
            )

        return Response({
            'query': request.data.get('query'),
            'answer': answer,
            'verified_metrics': {
                'total_revenue': rev_data['total_revenue'],
                'net_profit': exp_data['net_profit'],
                'top_product': top_prod['name'] if top_prod else None,
            }
        })
