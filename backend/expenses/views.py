from rest_framework import generics, permissions
from businesses.permissions import IsBusinessMember
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.filter(business=self.request.business)
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        category = self.request.query_params.get('category')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if category:
            queryset = queryset.filter(category__iexact=category)

        return queryset

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(business=self.request.business)
