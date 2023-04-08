"""
Views for the Inventory module.
"""

import json

from django.contrib.auth.models import Permission
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Home
from .models import Category, Item

from .serializers import CategorySerializer, ItemReadSerializer, ItemSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Viewset providing access to the Category model.
    """

    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated, )
    ordering = ("category", "name")

    def get_queryset(self):
        user_homes = self.request.user.homes.all().values()

        home_id = int(self.request.query_params["home"])
        if (home_id in (i["id"] for i in user_homes)):
            return Category.objects.filter(home=home_id)

        return Category.objects.filter(home__in=(i["id"] for i in user_homes))


    def perform_create(self, serializer):
        serializer.save()


class CategoryListView(APIView):
    """
    Viewset providing access the Item Category Hierarchy.
    """

    permission_classes = (permissions.IsAuthenticated, )
    # serializer_class = CategorySerializer

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
            home_id = int(request.query_params["home"])
            user_homes = self.request.user.homes.all().values()

            if home_id in (i["id"] for i in user_homes) or self.request.user.is_superuser:
                hierarchy = Category.objects.get_hierarchy(home_id)
                
            return Response(hierarchy)
        except ValueError:
            return Response({"Error": "Home Parameter Must be a Number"})
        
        
class ItemViewSet(viewsets.ModelViewSet):
    """
    Viewset providing access to the Item model.
    """

    queryset = Item.objects.order_by("category").order_by("name")    
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return ItemReadSerializer
        return ItemSerializer

    def get_queryset(self):
        user_homes = self.request.user.homes.all().values()
        return Item.objects.filter(home__in=(i["id"] for i in user_homes))

    def perform_create(self, serializer):
        serializer.save()
