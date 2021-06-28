'''
Serializers for models in the Financial Module
'''

from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from core.serializers import HomeSerializer, OrganizationSerializer
from .models import Account, Asset, FinancialCategory, TransactionLog


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__' 

class AccountReadSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)    

    class Meta:
        model = Account
        fields = '__all__' 


class AssetSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Asset
        fields = '__all__'

class FinancialCategorySerializer(serializers.ModelSerializer):    
    class Meta:
        model = FinancialCategory
        fields = '__all__' 

class FinancialCategoryReadSerializer(serializers.ModelSerializer):
    parent_category = RecursiveField(allow_null=True) 
    home = HomeSerializer(read_only=True)
    path_name = serializers.ReadOnlyField()

    class Meta:
        model = FinancialCategory
        fields = '__all__' 

class TransactionSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(input_formats=['%Y-%m-%dT%H:%M:%S.%fZ'])
    
    class Meta:
        model = TransactionLog
        fields = '__all__' 

class TransactionReadSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(format="%m/%d/%Y")
    financial_category = FinancialCategoryReadSerializer(read_only=True)    
    organization = OrganizationSerializer(read_only=True)
    
    class Meta:
        model = TransactionLog
        fields = '__all__' 
