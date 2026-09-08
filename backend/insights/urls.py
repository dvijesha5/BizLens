from django.urls import path
from .views import AskBusinessInsightView

urlpatterns = [
    path('ask/', AskBusinessInsightView.as_view(), name='ask_business_insight'),
]
