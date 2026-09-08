from rest_framework import generics, permissions
from businesses.permissions import IsBusinessMember
from .models import Sale
from .serializers import SaleSerializer

class SaleListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = SaleSerializer

    def get_queryset(self):
        queryset = Sale.objects.filter(business=self.request.business)
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        region = self.request.query_params.get('region')
        product = self.request.query_params.get('product')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if region:
            queryset = queryset.filter(region__iexact=region)
        if product:
            queryset = queryset.filter(product_name__icontains=product)

        return queryset

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = SaleSerializer

    def get_queryset(self):
        return Sale.objects.filter(business=self.request.business)
