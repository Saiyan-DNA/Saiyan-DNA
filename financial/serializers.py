'''
Serializers for models in the Financial Module
'''

from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from core.serializers import HomeSerializer, OrganizationSerializer
from .models import Account, Asset, FinancialCategory, TransactionLog, TransferDetail


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

class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferDetail
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(input_formats=['%Y-%m-%dT%H:%M:%S.%fZ'])
    
    class Meta:
        model = TransactionLog
        fields = '__all__'

class TransactionLinkSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(format="%m/%d/%Y")
    organization = OrganizationSerializer(read_only=True)
    account = AccountReadSerializer(read_only=True)

    class Meta:
        model = TransactionLog
        fields = ['id', 'transaction_date', 'organization', 'account']

class TransferReadSerializer(serializers.ModelSerializer):
    transfer_credit_transaction = TransactionLinkSerializer(read_only=True)
    transfer_debit_transaction = TransactionLinkSerializer(read_only=True)

    class Meta:
        model = TransferDetail
        fields = '__all__'

class TransactionReadSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(format="%m/%d/%Y")
    financial_category = FinancialCategoryReadSerializer(read_only=True)    
    organization = OrganizationSerializer(read_only=True)
    transfer_detail_debit = TransferReadSerializer(read_only=True, allow_null=True)
    transfer_detail_credit = TransferReadSerializer(read_only=True, allow_null=True)
    
    class Meta:
        model = TransactionLog
        fields = '__all__' 