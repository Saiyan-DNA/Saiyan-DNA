from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt

from .views import manage_keys, import_file, ImportView

urlpatterns = [
    path("redis/", manage_keys, name="redis"),
    path("import/", csrf_exempt(ImportView.as_view()), name="import_file")
]