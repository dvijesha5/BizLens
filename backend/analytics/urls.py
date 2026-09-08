from django.urls import path
from .views import (
    DashboardOverviewAnalyticsView,
    SalesAnalyticsView,
    ExpenseAnalyticsView,
    ProductAnalyticsView,
    CustomerAnalyticsView,
    RootCauseAnalyticsView
)

urlpatterns = [
    path('dashboard/', DashboardOverviewAnalyticsView.as_view(), name='analytics_dashboard'),
    path('sales/', SalesAnalyticsView.as_view(), name='analytics_sales'),
    path('expenses/', ExpenseAnalyticsView.as_view(), name='analytics_expenses'),
    path('products/', ProductAnalyticsView.as_view(), name='analytics_products'),
    path('customers/', CustomerAnalyticsView.as_view(), name='analytics_customers'),
    path('root-cause/', RootCauseAnalyticsView.as_view(), name='analytics_root_cause'),
]
