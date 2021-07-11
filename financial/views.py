'''
Views for the Accounting Application
'''
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.views import APIView

from core.models import Organization
from core.serializers import OrganizationSerializer
from .serializers import AccountSerializer, AccountReadSerializer, AssetSerializer
from .serializers import FinancialCategorySerializer, FinancialCategoryReadSerializer
from .serializers import TransactionReadSerializer, TransactionSerializer
from .models import TransactionLog, Account, FinancialCategory


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
        return self.request.user.accounts.all()

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


class AssetListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Assets
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    serializer_class = AssetSerializer

    def get_queryset(self):
        return self.request.user.assets.all()


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
                return FinancialCategory.objects.filter(Q(home=home_id) | Q(home=None))

        except ValueError:
            return Response({"Error": "Home Parameter Must be a Number"})

        return FinancialCategory.objects.filter(home_id=None)

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

            if home_id and int(home_id) in (i["id"] for i in user_homes) or self.request.user.is_superuser:
                hierarchy = FinancialCategory.objects.get_hierarchy(home_id)
            else:
                hierarchy = FinancialCategory.objects.get_hierarchy(home_id=None)

                
            return Response(hierarchy)
        except ValueError:
            return Response({"Error": "Home Parameter Must be a Number"})


class TransactionListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Assets
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
        queryset = TransactionLog.objects.all()

        account_id = self.request.query_params.get('acct_id')
        filtered_set = []

        if (account_id):
            start_date = self.request.query_params.get('startDate')
            end_date = self.request.query_params.get('endDate')
            filtered_set = queryset.filter(owner=self.request.user, account=account_id)
        else:
            filtered_set = queryset.filter(owner=self.request.user) 
            
        return filtered_set




class FinancialInstitutionListView(viewsets.ModelViewSet):
    '''
    ListCreate API View for Accounts
    '''

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = OrganizationSerializer

    def get_queryset(self):
        return Organization.objects.filter(organization_type="FIN")

    def perform_create(self, serializer):
        serializer.save(organization_type="FIN")
