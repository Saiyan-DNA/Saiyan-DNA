from django.contrib import admin

from .models import Item, Category, UnitOfMeasure, UnitOfMeasureConversion, ItemUnitOfMeasure
from .models import Supplier, SupplierItem, SupplierLocation

admin.site.register(Item)
admin.site.register(Category)
admin.site.register(UnitOfMeasure)
admin.site.register(UnitOfMeasureConversion)
admin.site.register(ItemUnitOfMeasure)
admin.site.register(Supplier)
admin.site.register(SupplierItem)
admin.site.register(SupplierLocation)
