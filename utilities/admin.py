from django.contrib import admin

from .models import ImportType, ImportTemplate, ImportTask

# Register your models here.
admin.site.register(ImportType)
admin.site.register(ImportTemplate)
admin.site.register(ImportTask)