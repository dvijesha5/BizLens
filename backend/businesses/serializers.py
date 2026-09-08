from rest_framework import serializers
from .models import Business, BusinessMembership

class BusinessMembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_name = serializers.ReadOnlyField(source='user.full_name')

    class Meta:
        model = BusinessMembership
        fields = ('id', 'user', 'user_email', 'user_name', 'business', 'role', 'created_at')

class BusinessSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = ('id', 'name', 'industry', 'currency', 'role', 'created_at')

    def get_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = BusinessMembership.objects.filter(user=request.user, business=obj).first()
            if membership:
                return membership.role
        return None
