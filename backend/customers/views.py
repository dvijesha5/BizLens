from rest_framework import generics, permissions
from businesses.permissions import IsBusinessMember
from .models import Customer
from .serializers import CustomerSerializer

class CustomerListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = CustomerSerializer

    def get_queryset(self):
        return Customer.objects.filter(business=self.request.business)

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)

class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessMember]
    serializer_class = CustomerSerializer

    def get_queryset(self):
        return Customer.objects.filter(business=self.request.business)
