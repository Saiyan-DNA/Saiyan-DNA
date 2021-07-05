"""
Serializers for models within the 'Base' module.
"""

from django.contrib.auth.models import User, Group, Permission
from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Home, Organization, Person

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, required=False)
    
    class Meta:
        model = Group
        fields = '__all__'

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
    groups = GroupSerializer(many=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'homes', 'groups']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self):
        user = User.objects.create_user(self.validated_data['username'], self.validated_data['email'], self.validated_data['password'], first_name=self.validated_data['first_name'], last_name=self.validated_data['last_name'])
        home = None
        person = None

        if (user):
            home = Home.objects.create(name="My Home", owner=user)

        if (home):
            person = Person.objects.create(home=home, first_name=user.first_name, last_name=user.last_name, user_account=user)

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)        

        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


