from django.urls import path, include

from rest_framework import routers

from .views import RecipeAPI, RecipeCategoryAPI, RecipeIngredientAPI, RecipeListAPI


router = routers.DefaultRouter()
router.register("recipe", RecipeAPI, 'recipe')
router.register("recipe_category", RecipeCategoryAPI, 'recipe_category')
router.register("recipe_ingredient", RecipeIngredientAPI, "recipe_ingredient")

urlpatterns = [
    path("", include(router.urls)),
    path("recipe_list", RecipeListAPI.as_view()),
]
