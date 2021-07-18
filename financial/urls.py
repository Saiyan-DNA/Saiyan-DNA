from django.urls import path, include
from rest_framework import routers

from .views import AccountListView, AssetListView, TransactionListView, TransferAPIView
from .views import FinancialCategoryListView, FinancialCategoryHierarchyView, FinancialInstitutionListView


router = routers.DefaultRouter()
router.register('account', AccountListView, 'account')
router.register('category', FinancialCategoryListView, 'category')
router.register('financial_institution', FinancialInstitutionListView, 'financial_institution')
router.register('asset', AssetListView, 'asset')
router.register('transaction', TransactionListView, 'transaction')

urlpatterns = [
    path("", include(router.urls)),
    path("categorytree", FinancialCategoryHierarchyView.as_view()),
    path("transfer/", TransferAPIView.as_view()),
]
