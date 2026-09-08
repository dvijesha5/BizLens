from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Business, BusinessMembership
from .serializers import BusinessSerializer, BusinessMembershipSerializer

class BusinessListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        memberships = BusinessMembership.objects.filter(user=request.user)
        businesses = [m.business for m in memberships]
        serializer = BusinessSerializer(businesses, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = BusinessSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            business = serializer.save()
            BusinessMembership.objects.create(user=request.user, business=business, role='OWNER')
            return Response(BusinessSerializer(business, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BusinessDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BusinessSerializer

    def get_queryset(self):
        memberships = BusinessMembership.objects.filter(user=self.request.user)
        return Business.objects.filter(id__in=[m.business_id for m in memberships])
