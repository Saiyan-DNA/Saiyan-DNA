from django.shortcuts import render
from django.contrib.auth.models import Permission

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Recipe, RecipeCategory

from .serializers import RecipeSerializer, RecipeReadSerializer
from .serializers import RecipeCategorySerializer, RecipeCategoryReadSerializer
from .serializers import RecipeIngredientSerializer, RecipeIngredientReadSerializer
from .serializers import RecipeStepSerializer


class RecipeAPI(viewsets.ModelViewSet):
  
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return RecipeReadSerializer
        return RecipeSerializer

    def get_queryset(self):
        recipes = None
        
        # Filter recipes by home (if specified)
        home_id = self.request.query_params.get('home', None)
        if home_id:
            recipes = Recipe.objects.filter(home=int(home_id))
        else:
            user_homes = self.request.user.homes.all().values()
            recipes = Recipe.objects.filter(home__in=(i["id"] for i in user_homes))

        # Filter recipes by category (if specified)
        category_id = self.request.query_params.get('category', None)
        if category_id:
            recipes = recipes.filter(category=int(category_id))

        # Filter recipes by ingredient (if specified)
        item_id = self.request.query_params.get('item', None)
        if item_id:
            ingredients = RecipeIngredient.objects.filter(item=int(item_id))
            recipes = recipes.filter(id__in=ingredients.values_list('recipe', flat=True))
            
        return recipes

    def perform_create(self, serializer):
        serializer.save()


class RecipeCategoryAPI(viewsets.ModelViewSet):
  
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return RecipeCategoryReadSerializer
        return RecipeCategorySerializer

    def get_queryset(self):
        home_id = self.request.query_params.get('home', None)

        categories = None
        
        if home_id:
            return RecipeCategory.objects.filter(home=int(home_id))
        
        user_homes = self.request.user.homes.all().values()
        return RecipeCategory.objects.filter(home__in=(i["id"] for i in user_homes))
            

    def perform_create(self, serializer):
        serializer.save()


class RecipeIngredientAPI(viewsets.ModelViewSet):  
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return RecipeIngredientReadSerializer
        return RecipeIngredientSerializer

    def get_queryset(self):
        
        # Return only ingredients belonging to the specified recipe (if provided)
        recipe_id = self.request.query_params.get('recipe', None)
        if recipe_id:
            return RecipeIngredient.objects.filter(recipe=int(recipe_id))
        
        # Return all recipe ingredients associated with the specified inventory item (if provided)
        item_id = self.request.query_params.get('item', None)
        if item_id:
            return RecipeIngredient.objects.filter(item=int(item_id))
        
        # If no parameters are provided, provide all recipe ingredients the user has access to.
        user_homes = self.request.user.homes.all().values()
        user_recipes = Recipe.objects.filter(home__in=(i["id"] for i in user_homes)).values()

        return RecipeIngredient.objects.filter(recipe__in=(i["id"] for i in user_recipes))
            

    def perform_create(self, serializer):
        serializer.save()


class RecipeListAPI(APIView):
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
        fields = ['id', 'name', 'description', 'cover_image', 'category', 'tags']

        try:
            home_id = request.query_params.get("home", None)
            user_homes = self.request.user.homes.all().values()
            mode = request.query_params.get("mode", "flat")
            category_id = request.query_params.get("category", None)
            recipes = None
            data = []

            if home_id:
                home_id = int(home_id)
                if home_id not in [i["id"] for i in user_homes]:
                    raise ValueError("User does not have access to the specified home")

                if mode == "flat":
                    recipes = Recipe.objects.filter(home__id=home_id).only(*fields)
            else:
                if mode == "flat":
                    recipes = Recipe.objects.filter(home__in=(i["id"] for i in user_homes)).only(*fields)
                    
            if category_id:
                recipes = recipes.filter(category__id=category_id)

            data = RecipeReadSerializer(recipes, many=True, fields=fields).data
            return Response(data)
        except ValueError as v:
            return Response({"Error": v.args[0]})