from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'business', 'name', 'category', 'cost_price', 'selling_price', 'created_at')
        read_only_fields = ('id', 'created_at')
