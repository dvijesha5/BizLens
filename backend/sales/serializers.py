from rest_framework import serializers
from .models import Sale

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ('id', 'business', 'date', 'product_name', 'customer_code', 'region', 'quantity', 'unit_price', 'total_amount', 'created_at')
        read_only_fields = ('id', 'created_at')
