from django.contrib import admin

from .models import Category, Item, ItemUnitOfMeasure
from .models import Supplier, SupplierItem, SupplierLocation
from .models import UnitOfMeasure, UnitOfMeasureConversion


admin.site.register(Category)
admin.site.register(Item)
admin.site.register(ItemUnitOfMeasure)
admin.site.register(Supplier)
admin.site.register(SupplierItem)
admin.site.register(SupplierLocation)
admin.site.register(UnitOfMeasure)
admin.site.register(UnitOfMeasureConversion)
