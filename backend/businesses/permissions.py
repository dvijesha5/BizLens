from rest_framework import permissions
from .models import BusinessMembership

class IsBusinessMember(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        business_id = request.headers.get('X-Business-ID') or request.query_params.get('business_id')
        if not business_id:
            # Fallback to first membership
            membership = BusinessMembership.objects.filter(user=request.user).first()
            if membership:
                request.business = membership.business
                request.business_role = membership.role
                return True
            return False
        
        try:
            membership = BusinessMembership.objects.get(user=request.user, business_id=business_id)
            request.business = membership.business
            request.business_role = membership.role
            return True
        except BusinessMembership.DoesNotExist:
            return False
