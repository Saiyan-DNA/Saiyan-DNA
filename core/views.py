from django.contrib.auth.models import User
from django.views.generic import TemplateView
from rest_framework import permissions, viewsets, generics
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from .models import Organization
from .permissions import ReadOnly
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, HomeSerializer, OrganizationSerializer


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": jwt_encode_handler(payload)
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": jwt_encode_handler(payload)
        })

class UserAPI(generics.RetrieveAPIView):
    """
    Viewset providing access to the Users model.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    

class HomeAPI(viewsets.ModelViewSet):
    '''
    Viewset for User's Homes
    '''

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = HomeSerializer

    def get_queryset(self):
        return self.request.user.homes.all()

class IndexView(TemplateView):
    """
    Base index view.
    """

    template_name = "front_end/index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        return context


class OrganizationAPI(viewsets.ModelViewSet):
    '''
    Viewset for Organizations
    '''

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = OrganizationSerializer

    def get_queryset(self):
        org_type = self.request.query_params.get("type")
        
        if (org_type):
            return Organization.objects.filter(organization_type=org_type)

        return Organization.objects.all()