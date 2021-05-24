from django.contrib import admin

from .models import Menu, Home, HomeAccess, Organization, Person

admin.site.register(Menu)
admin.site.register(Home)
admin.site.register(HomeAccess)
admin.site.register(Organization)
admin.site.register(Person)
