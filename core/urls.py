from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterAPI, LoginAPI, UserAPI, HomeAPI, OrganizationAPI, IndexView
from .views import EmailUsernameAPI, EmailVerificationAPI, ActivateAccountAPI

#core_router = routers.DefaultRouter(trailing_slash=False)
core_router = routers.DefaultRouter(trailing_slash=True)
core_router.register('home', HomeAPI, 'home')
core_router.register('organization', OrganizationAPI, 'organization')

urlpatterns = [
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/logout', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/core/', include(core_router.urls), name="home"),
    path('api/core/email_username', EmailUsernameAPI.as_view()),
    path('api/core/email_verification', EmailVerificationAPI.as_view()),
    path('api/core/activate_account', ActivateAccountAPI.as_view()),
    path('api/auth/token_refresh', TokenRefreshView.as_view()),
    path('', IndexView.as_view(), name="index"),    
    # path(r'api/auth/api-token-auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),),    
    #url(r"^$", IndexView.as_view(), name="base-index"),
    #url(r"^(?P<path>.*)/$", IndexView.as_view(), name='index'),
]