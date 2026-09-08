from rest_framework import generics, permissions
from businesses.permissions import IsBusinessMember
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(business=self.request.business)

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(business=self.request.business)
