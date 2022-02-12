'''
Serializers for models in the Financial Module
'''

from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from core.serializers import HomeSerializer, OrganizationSerializer
from .models import Account, AccountStatement, Asset, FinancialCategory, TransactionLog, TransferDetail


# Accounts
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__' 

class AccountReadSerializer(serializers.ModelSerializer):
    class TypeField(serializers.ChoiceField):

        def to_representation(self, obj):
            if obj == '' and self.allow_blank:
                return obj
                
            choice = [x for x in self._choices.items() if x[0] == obj]
            return {'value': obj, 'label': choice[0][1]}

        def to_internal_value(self, data):
            # To support inserts with the value
            if data == '' and self.allow_blank:
                return ''

            for key, val in self._choices.items():
                if val == data:
                    return key
            self.fail('invalid_choice', input=data)

    organization = OrganizationSerializer(read_only=True)
    account_type = TypeField(choices=Account.AccountType.choices, read_only=True) 

    class Meta:
        model = Account
        fields = '__all__'


# Assets
class AssetSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Asset
        fields = '__all__'


# Financial Categories
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


# Transactions
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


class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferDetail
        fields = '__all__'


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

# AccountStatements
class AccountStatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountStatement
        fields = '__all__'


class AccountStatementReadSerializer(serializers.ModelSerializer):
    account = AccountReadSerializer(read_only=True)
    due_date = serializers.DateField(format='%m/%d/%Y')
    issue_date = serializers.DateField(format='%m/%d/%Y')
    period_start = serializers.DateField(format='%m/%d/%Y')
    period_end = serializers.DateField(format='%m/%d/%Y')
    previous_balance = serializers.DecimalField(max_digits=20, decimal_places=2)
    account_debits = serializers.DecimalField(max_digits=20, decimal_places=2)
    account_credits = serializers.DecimalField(max_digits=20, decimal_places=2)
    current_balance = serializers.DecimalField(max_digits=20, decimal_places=2)
    minimum_due = serializers.DecimalField(max_digits=20, decimal_places=2)
    payment_transaction = TransactionReadSerializer(read_only=True, allow_null=True)

    class Meta:
        model = AccountStatement
        fields = '__all__'