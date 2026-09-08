from django.urls import path
from .views import BusinessListCreateView, BusinessDetailView

urlpatterns = [
    path('', BusinessListCreateView.as_view(), name='business_list_create'),
    path('<int:pk>/', BusinessDetailView.as_view(), name='business_detail'),
]
