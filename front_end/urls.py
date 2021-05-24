from django.urls import path
from django.conf.urls import url
from . import views


urlpatterns = [
    path('', views.index ),
    url(r"^$", views.index, name="base-index"),
    url(r"^(?P<path>.*)/$", views.index, name='index'),
]