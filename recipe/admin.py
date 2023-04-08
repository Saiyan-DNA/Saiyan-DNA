from django.contrib import admin

from .models import Recipe, RecipeCategory, RecipeIngredient, RecipeStep, RecipeTag

admin.site.register(Recipe)
admin.site.register(RecipeCategory)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeStep)
admin.site.register(RecipeTag)
