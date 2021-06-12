from django.contrib.auth.models import User
from django.views.generic import TemplateView
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail
from django.utils.html import strip_tags
from rest_framework import permissions, viewsets, generics
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from django.conf import settings

from .models import Organization
from .permissions import ReadOnly
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, HomeSerializer, OrganizationSerializer


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if (serializer.is_valid(raise_exception=False)):
            if (User.objects.filter(email=serializer.data.get("email")).exists()):
                return Response({"errors": {"email": ["A user with that e-mail address already exists."]}})
            
            user = serializer.create()
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(user)
            
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": jwt_encode_handler(payload)
            })

        return Response({
            "errors": serializer.errors
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if (serializer.is_valid(raise_exception=False)):

            user = serializer.validated_data

            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(user)

            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": jwt_encode_handler(payload)
            })
        
        if (not User.objects.filter(username=request.data["username"]).exists()):
            return Response({
                "field": "username",
                "message": "Invalid Username!"
            })

        return Response({
            "field": "password",
            "message": "Invalid Password!"
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


class EmailUsernameAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data["email"]

        user = User.objects.filter(email=email)

        if (user.__len__() > 1):
            print("More than one user with this e-mail address.")
            return Response({
                "error": "More than one user has this e-mail address."
            })

        if (user.__len__() < 1):
            print("E-Mail address not found.")
            return Response({
                "error": "E-Mail address not found."
            })

        subj = "HomeCentral Username Requested"
        user = user.values()[0]
        firstName = user.get('first_name')
        userName = user.get('username')
        html_message = render_to_string('email/usernamerequest.html', {'first_name': firstName, 'user_name': userName})
        plain_message = strip_tags(html_message)

        try:
            send_mail(subject=subj, message=plain_message, html_message=html_message, from_email=settings.EMAIL_HOST_USER, recipient_list=[email,], fail_silently=False)
        except Exception as e:
            print(e)

            return Response({
                "error": f"{type(e)}",
                "message": f"{e}"
            }) 
        
        return Response({
            "success": f"E-mail successfully sent to {email}."
        })