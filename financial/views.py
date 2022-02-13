'''
Views for the Accounting Application
'''
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db.models import Q

from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.views import APIView

from core.models import Organization
from core.serializers import OrganizationSerializer
from .serializers import AccountSerializer, AccountReadSerializer, AssetSerializer
from .serializers import AccountStatementSerializer, AccountStatementReadSerializer
from .serializers import CreditReportSerializer, CreditReportReadSerializer
from .serializers import FinancialCategorySerializer, FinancialCategoryReadSerializer
from .serializers import TransactionReadSerializer, TransactionSerializer, TransferSerializer
from .models import Account, AccountStatement, FinancialCategory
from .models import TransactionLog, TransferDetail


def clear_cache_item(key):
    '''
    Clear a cache item
    '''
    try:
        cache.delete(key)
    except KeyError:
        print(f"Cannot delete '{key}'. It does not exist in the cache.")


class AccountListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Accounts
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return AccountReadSerializer
        return AccountSerializer

    def get_queryset(self):
        cache_key = f"accounts_{self.request.user.id}"

        if (self.request.method in ['GET']):
            accounts = cache.get(cache_key)

            if (not accounts):
                accounts = self.request.user.accounts.all()
                cache.set(cache_key, accounts)
        else:
            accounts = self.request.user.accounts.all()
            clear_cache_item(cache_key)

        return accounts

    def create(self, request, *args, **kwargs):
        result = super(AccountListView, self).create(request, *args, **kwargs)

        if result.status_code == 201:
            queryset = self.get_queryset()
            new_account = queryset.get(id=result.data['id'])

            return Response(data=AccountReadSerializer(new_account).data)
        return result

    def update(self, request, *args, **kwargs):
        result = super(AccountListView, self).update(request, *args, **kwargs)      

        if result.status_code == 200:
            self.request.method = 'GET'

            return super(AccountListView, self).retrieve(request, *args, **kwargs)
        return result

    def destroy(self, request, *args, **kwargs):
        clear_cache_item(f"accounts_{self.request.user.id}")
        response = super(AccountListView, self).destroy(request, *args, **kwargs)

        return response


class AccountStatementView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Accounts
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return AccountStatementReadSerializer
        return AccountStatementSerializer

    def get_queryset(self):
        cache_key = f"stmts_{self.request.user.id}"

        clear_cache_item(cache_key)
        stmts = []

        if (self.request.method in ['GET']):
            
            account_id = self.request.query_params.get('account')
            organization_id = self.request.query_params.get('org')
            stmt_id = self.request.query_params.get('id')
            is_paid = self.request.query_params.get('is_paid', -1)

            if (stmt_id):
                stmts = AccountStatement.objects.filter(id=stmt_id)
            elif (account_id):
                cache_key = f"stmts_{self.request.user.id}_a{account_id}"
                stmts = cache.get(cache_key)

                if (not stmts):
                    stmts = AccountStatement.objects.filter(account__id=account_id)
                    cache.set(cache_key, stmts)
            elif (organization_id):
                cache_key = f"stmts_{self.request.user.id}_o{organization_id}"
                stmts = cache.get(cache_key)

                if (not stmts):
                    accounts = self.request.user.accounts.filter(organization__id=organization_id)
                    stmts = AccountStatement.objects.filter(account__in=accounts.values_list('id', flat=True))
                    cache.set(cache_key, stmts)
            else: 
                stmts = cache.get(cache_key)

                if (not stmts):
                    accounts = self.request.user.accounts.all()
                    stmts = AccountStatement.objects.filter(account__in=accounts.values_list('id', flat=True))
                    cache.set(cache_key, stmts)

            if (is_paid != -1):
                stmts = stmts.filter(is_paid=is_paid)

        else:
            accounts = self.request.user.accounts.all()
            stmts = AccountStatement.objects.filter(account__in=accounts.values_list('id', flat=True))

            clear_cache_item(cache_key)

        return stmts

    def create(self, request, *args, **kwargs):
        result = super(AccountStatementView, self).create(request, *args, **kwargs)

        if result.status_code == 201:
            queryset = self.get_queryset()
            new_statement = queryset.get(id=result.data['id'])

            return Response(data=AccountStatementReadSerializer(new_statement).data)
        return result

    def update(self, request, *args, **kwargs):
        result = super(AccountStatementView, self).update(request, *args, **kwargs)      

        if result.status_code == 200:
            self.request.method = 'GET'

            return super(AccountStatementView, self).retrieve(request, *args, **kwargs)
        return result

    def destroy(self, request, *args, **kwargs):
        clear_cache_item(f"stmts_{self.request.user.id}")
        response = super(AccountStatementView, self).destroy(request, *args, **kwargs)

        return response


class AssetListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Assets
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    serializer_class = AssetSerializer

    def get_queryset(self):

        if (self.request.method in ['GET']):
            cache_key = f"assets_{self.request.user.id}"

            assets = cache.get(cache_key)

            if (not assets):
                assets = self.request.user.assets.all()
                cache.set(cache_key, assets)

        else:
            assets = self.request.user.assets.all()
            clear_cache_item(f"assets_{self.request.user.id}")
                
        return assets


class CreditReportView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Assets
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return CreditReportReadSerializer
        return CreditReportSerializer

    def get_queryset(self):

        agency_id = self.request.query_params.get('agency')

        if (self.request.method in ['GET']):
            cache_key = f"credit_reports_{self.request.user.id}"

            reports = cache.get(cache_key)

            if (not reports):
                reports = self.request.user.credit_reports.all()
                cache.set(cache_key, reports)

        else:
            reports = CreditReport.objects.all()
            clear_cache_item(f"credit_reports_{self.request.user.id}")
                
        return reports


class FinancialCategoryListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Financial Categories
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return FinancialCategoryReadSerializer
        return FinancialCategorySerializer

    def get_queryset(self):
        try:
            home_id = self.request.query_params.get("home")
            user_homes = self.request.user.homes.all().values()

            if home_id and int(home_id) in (i["id"] for i in user_homes) or self.request.user.is_superuser:
                cache_key = f"financial_categories_{self.request.user.id}"

                categories = cache.get(cache_key)

                if (not categories):
                    categories = FinancialCategory.objects.filter(Q(home=home_id) | Q(home=None))
                    cache.set(cache_key, categories)

                return categories

        except ValueError:
            return Response({"Error": "Home Parameter Must be a Number"})

        cache_key = "financial_categories_generic"
        categories = cache.get(cache_key)


        if (not categories):
            categories = FinancialCategory.objects.filter(home_id=None)
            cache.set(cache_key, categories)

        return categories

    def update(self, request, *args, **kwargs):
        result = super(FinancialCategoryListView, self).update(request, *args, **kwargs)
        
        '''
        If update is successful, perform a 'GET' to return serialized related field (Parent Category).
        Without this, only Financial Institution ID is returned, which breaks REACT Component functionality.
        '''
        if result.status_code == 200:
            self.request.method = 'GET'
            return super(FinancialCategoryListView, self).retrieve(request, *args, **kwargs)
        return result


class FinancialCategoryHierarchyView(APIView):
    """
    Viewset providing access the Item Category Hierarchy.
    """

    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request):
        """
        Get method for the Category List View
        """
        

        '''
        Determine whether the "home" id specifier was provided
        And that the authenticated user has access to that home
        '''
        home_id = None
        hierarchy = []

        try:
            home_id = request.query_params.get("home")
            user_homes = self.request.user.homes.all().values()
            cache_key = "financial_category_tree_"

            if home_id and int(home_id) in (i["id"] for i in user_homes) or self.request.user.is_superuser:
                cache_key += str(self.request.user.id)

                cached_hierarchy = cache.get(cache_key)
                if (cached_hierarchy):
                    hierarchy = cached_hierarchy
                else:
                    hierarchy = FinancialCategory.objects.get_hierarchy(home_id)
                    cache.set(cache_key, hierarchy)
            else:
                cache_key += "generic"

                cached_hierarchy = cache.get(cache_key)

                if (cached_hierarchy):
                    hierarchy = cached_hierarchy
                else:
                    hierarchy = FinancialCategory.objects.get_hierarchy(home_id=None)
                    cache.set(cache_key, hierarchy)
                
            return Response(hierarchy)
        except ValueError:
            return Response({"Error": "Home Parameter Must be a Number"})


class TransactionListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Transactions
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    serializer_class = TransactionSerializer

    '''
    TO-DO: Query Parameters for Account and date range. Filter returned transactions accordingly.
    '''

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return TransactionReadSerializer
        return TransactionSerializer

    def get_queryset(self):
        account_id = self.request.query_params.get('acct_id')
        filtered_set = []

        if (self.request.method in ['GET'] and account_id):
            cache_key = f"transactions_{account_id}"

            start_date = self.request.query_params.get('startDate')
            end_date = self.request.query_params.get('endDate')

            transactions = cache.get(cache_key)

            if (transactions):
                filtered_set = transactions
            else:
                filtered_set = TransactionLog.objects.filter(owner=self.request.user, account=account_id)
                cache.set(cache_key, filtered_set)
        else:
            filtered_set = TransactionLog.objects.filter(owner=self.request.user)
                 
        return filtered_set

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            clear_cache_item(f"transactions_{instance.account.id}")
        except:
            print("Error")

        return super(TransactionListView, self).destroy(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        try:
            clear_cache_item(f"transactions_{request.data['account']}")
        except:
            print("Error creating new transaction.")

        return super(TransactionListView, self).create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        try:
            clear_cache_item(f"transactions_{request.data['account']}")
        except:
            print("Error updating transaction.")
        
        return super(TransactionListView, self).update(request, *args, **kwargs)

class TransferAPIView(APIView):
    '''
    ListCreate API View for Transactions
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    def post(self, request):
        base_transaction = request.data["transaction"]

        # Stage Data for the transfer transactions (in/out)
        transfer_out_transaction = base_transaction.copy()
        transfer_in_transaction = base_transaction.copy()

        transfer_out_transaction["account"] = request.data["transfer_detail"]["transfer_from"]
        transfer_in_transaction["account"] = request.data["transfer_detail"]["transfer_to"]

        # Stage Data for the Transfer Detail Record (links transfer in/out transaction IDs)
        transfer_detail = {"owner": request.user.id, "transfer_debit_transaction": None, "transfer_credit_transaction": None}
        
        try:
            # Validate and Save the Transfer Out (debit) Transaction
            serializer = TransactionSerializer(data=transfer_out_transaction)
            if serializer.is_valid():
                result = serializer.save()
                transfer_detail["transfer_debit_transaction"] = result.id

                clear_cache_item(f"transactions_{transfer_out_transaction['account']}")

            # Validate and Save the Transfer In (credit) Transaction
            serializer = TransactionSerializer(data=transfer_in_transaction)
            if serializer.is_valid():
                result = serializer.save()
                transfer_detail["transfer_credit_transaction"] = result.id

                clear_cache_item(f"transactions_{transfer_in_transaction['account']}")

            # Validat and Save the Transfer Detail Record (links transfer in/out transaction IDs)
            serializer = TransferSerializer(data=transfer_detail)
            if serializer.is_valid():
                result = serializer.save()
        except ValueError:
            print("Error Creating Transfer.")
            return Response({"error": "Error Creating Transfer."})

        return Response({"success": "Transfer Transaction Successfully Created"})

    def put(self, request):
        base_transaction = request.data["transaction"]
        transaction_id = base_transaction["id"]

        # Stage Data for the transfer transactions (in/out)
        transfer_out_transaction = base_transaction.copy()
        transfer_in_transaction = base_transaction.copy()

        transfer_out_transaction["account"] = request.data["transfer_detail"]["transfer_from"]
        transfer_in_transaction["account"] = request.data["transfer_detail"]["transfer_to"]

        
        transfer_detail = TransferDetail.objects.filter(Q(transfer_credit_transaction=transaction_id) | Q(transfer_debit_transaction=transaction_id))

        if (transfer_detail.__len__() != 1):
            return Response({"error": "Error locating existing transfer"})

        # Assign the Transaction ID values from the existing transfer records to the updated details.
        transfer_out_transaction["id"] = transfer_detail.values()[0]["transfer_debit_transaction_id"]
        transfer_in_transaction["id"] = transfer_detail.values()[0]["transfer_credit_transaction_id"]

        try:
            # Validate and Update the Transfer Out (debit) Transaction
            serializer = TransactionSerializer(data=transfer_out_transaction)
            if serializer.is_valid():
                result = serializer.update(TransactionLog.objects.get(id=transfer_out_transaction["id"]), serializer.validated_data)
                clear_cache_item(f"transactions_{transfer_out_transaction['account']}")
            else:
                return Response({"error": "Error Updating Transfer."})

            # Validate and Update the Transfer In (credit) Transaction
            serializer = TransactionSerializer(data=transfer_in_transaction)
            if serializer.is_valid():
                result = serializer.update(TransactionLog.objects.get(id=transfer_in_transaction["id"]), serializer.validated_data)
                clear_cache_item(f"transactions_{transfer_in_transaction['account']}")
            else:
                return Response({"error": "Error Updating Transfer."})
        except ValueError:
            return Response({"error": "Error Updating Transfer."})

        return Response({"success": "Transfer Transaction Successfully Updated"})

    def delete(self, request):
        transaction_id = self.request.query_params.get('transaction_id')

        if (transaction_id):
            try:
                transfer_detail = TransferDetail.objects.filter(Q(transfer_credit_transaction_id=transaction_id) | Q(transfer_debit_transaction_id=transaction_id))

                if (transfer_detail.__len__() == 1):

                    transaction_set = []

                    # Obtain both transactions (debit & credit) associated with the transfer
                    for t in transfer_detail.values():
                        transaction_set.append(t["transfer_debit_transaction_id"])
                        transaction_set.append(t["transfer_credit_transaction_id"])
                        
                    transactions = TransactionLog.objects.filter(id__in=transaction_set)

                    # Delete Cached Transaction Lists for the affected accounts.
                    for t in transactions:
                        clear_cache_item(f"transactions_{t.account.id}")

                    # Delete the transfer detail reference record and transaction log records associated with the transfer
                    transfer_detail.delete()
                    transactions.delete()                    

                    return Response({"success": "Transfer Transactions Deleted."})

                return Response({"error": "Could Not Locate Transfer Transaction."})
            except ValueError:
                print("Error Deleting Transfer.")
                return Response({"error": "Error Deleting Transfer."})

        return Response({"error": "No Transaction ID Provided."})

class FinancialInstitutionListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Accounts
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = OrganizationSerializer

    def get_queryset(self):
        
        if (self.request.method in ['GET']):
            cache_key = "financial_institutions"

            financial_institutions = cache.get(cache_key)

            if (not financial_institutions):
                financial_institutions = Organization.objects.filter(organization_type="FIN")
                cache.set(cache_key, financial_institutions)

        return financial_institutions

    def perform_create(self, serializer):
        serializer.save(organization_type="FIN")
