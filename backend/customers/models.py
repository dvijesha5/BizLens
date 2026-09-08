from django.db import models
from businesses.models import Business

class Customer(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='customers')
    customer_code = models.CharField(max_length=100)
    name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    region = models.CharField(max_length=100, default='General')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('business', 'customer_code')

    def __str__(self):
        return f"{self.customer_code} - {self.region}"
