import re

from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'first_name', 'last_name')

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'full_name')
        read_only_fields = ('id',)

    def _generate_unique_username(self, preferred=''):
        candidate = preferred or 'bizlensuser'
        candidate = re.sub(r'[^A-Za-z0-9._-]+', '', candidate).strip()[:150]
        if not candidate:
            candidate = 'bizlensuser'

        base = candidate
        counter = 1
        while User.objects.filter(username__iexact=base).exists():
            base = f'{candidate}{counter}'
            counter += 1
        return base

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip()
        preferred = (attrs.get('username') or '').strip()
        if not preferred:
            preferred = (email.split('@')[0] if email else 'bizlensuser')
        attrs['username'] = self._generate_unique_username(preferred)
        return attrs

    def create(self, validated_data):
        full_name = validated_data.pop('full_name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=full_name
        )
        return user
