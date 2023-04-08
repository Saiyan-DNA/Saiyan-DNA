from rest_framework import serializers

from .models import Recipe, RecipeCategory, RecipeIngredient, RecipeStep, RecipeTag

from core.models import Home
from core.serializers import HomeSerializer
from core.serializers import UserSerializer

from inventory.serializers import ItemSerializer, UnitOfMeasureSerializer


class RecipeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Recipe
        fields = '__all__'


class RecipeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeCategory
        fields = '__all__'


class RecipeIngredientSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = RecipeIngredient
        fields = '__all__'


class RecipeStepSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = RecipeStep
        fields = '__all__'


class RecipeTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeTag
        fields = '__all__'


class RecipeIngredientReadSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    unit = UnitOfMeasureSerializer(read_only=True)
    
    class Meta:
        model = RecipeIngredient
        fields = '__all__'


class RecipeReadSerializer(serializers.ModelSerializer):
    category = RecipeCategorySerializer(read_only=True)
    home = HomeSerializer(read_only=True)
    ingredients = RecipeIngredientReadSerializer(many=True, read_only=True)
    tags = RecipeTagSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(RecipeReadSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
    
    class Meta:
        model = Recipe
        fields = '__all__'


class RecipeCategoryReadSerializer(serializers.ModelSerializer):
    home = HomeSerializer(read_only=True)
    recipes = RecipeReadSerializer(many=True, read_only=True)
    
    class Meta:
        model = RecipeCategory
        fields = '__all__'