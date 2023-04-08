'''
Serializers for Front-End Interaction
'''

from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from .models import Item, Category, UnitOfMeasure

from core.models import Home
from core.serializers import HomeSerializer
from core.serializers import UserSerializer


class SubCategorySerializer(serializers.ModelSerializer):
    home = HomeSerializer(read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'description')

      
class CategorySerializer(serializers.ModelSerializer):
    home = HomeSerializer(read_only=True)
    parent_category = RecursiveField(allow_null=True)
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'parent_category', 'children', 'home')

class UnitOfMeasureSerializer(serializers.ModelSerializer):
    home = HomeSerializer(read_only=True)

    class Meta:
        model = UnitOfMeasure
        fields = ('id', 'name', 'description', 'home')


class ItemReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Item
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'
