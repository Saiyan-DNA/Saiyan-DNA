from django.urls import path, include

from rest_framework import routers

from .views import CategoryViewSet, CategoryListView, ItemViewSet


router = routers.DefaultRouter()
router.register("category", CategoryViewSet, 'category')
router.register("item", ItemViewSet, 'item')
# router.register("categories", CategoryListView, 'categories')

urlpatterns = [
    path("", include(router.urls)),
    path("categories", CategoryListView.as_view()),
    # path("api/items/", ItemListView.as_view())
]
