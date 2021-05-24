"""
Serializers for models within the 'Base' module.
"""

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Home, Organization

class HomeSerializer(serializers.ModelSerializer):
    """
    Serializer for User Homes
    """
    
    class Meta:
        model = Home
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    """
    Serializer for User Homes
    """
    
    class Meta:
        model = Organization
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for Django's Auth User Model's API
    """
    homes = HomeSerializer(many=True, required=False)

    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'homes']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'], first_name=validated_data['first_name'], last_name=validated_data['last_name'])

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)

        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


