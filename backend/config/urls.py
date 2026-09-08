from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/businesses/', include('businesses.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/expenses/', include('expenses.urls')),
    path('api/products/', include('products.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/uploads/', include('uploads.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/insights/', include('insights.urls')),
]
