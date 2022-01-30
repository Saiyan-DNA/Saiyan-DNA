import math, random, datetime

from django.contrib.auth.models import User, Group
from django.core.mail import send_mail
from django.db.models import Q
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from django.utils import timezone
from django.views.generic import TemplateView
from rest_framework import permissions, viewsets, generics
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from django.conf import settings

from .models import Organization, Person, VerificationCode
from .permissions import ReadOnly
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, HomeSerializer
from .serializers import OrganizationSerializer, OrganizationReadSerializer


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
                "token": jwt_encode_handler(payload),
                "deviceFamily": self.request.user_agent.device.family,
                "isMobile": self.request.user_agent.is_mobile,
                "isTablet": self.request.user_agent.is_tablet
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
                "token": jwt_encode_handler(payload),
                "deviceFamily": self.request.user_agent.device.family,
                "isMobile": self.request.user_agent.is_mobile,
                "isTablet": self.request.user_agent.is_tablet
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

    def get(self, request, *args, **kwargs):
        return Response({
            "user": UserSerializer(self.request.user).data,
            "deviceFamily": self.request.user_agent.device.family,
            "isMobile": self.request.user_agent.is_mobile,
            "isTablet": self.request.user_agent.is_tablet
        })

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

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return OrganizationReadSerializer
        return OrganizationSerializer

    def get_queryset(self):
        org_type = self.request.query_params.get("type")

        org_list = Organization.objects.filter(Q(created_by=self.request.user) | Q(created_by=None))
        
        if (org_type):
            return org_list.filter(organization_type=org_type)

        return org_list


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
        first_name = user.get('first_name')
        user_name = user.get('username')
        html_message = render_to_string('email/usernamerequest.html', {'first_name': first_name, 'user_name': user_name})
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

class EmailVerificationAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def generate_code(self):
        string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        code = ""
        length = len(string)

        for i in range(6) :
            code += string[math.floor(random.random() * length)]
 
        return code

    def post(self, request, *args, **kwargs):
        email = request.data["email"]

        user = User.objects.get(email=email)

        subj = "HomeCentral Account Verification"
        verification_code = self.generate_code()
        create_date = timezone.now()
        expiry_time = create_date + datetime.timedelta(minutes=30)
        print(expiry_time)

        existing_codes = VerificationCode.objects.filter(user=user, status='A')

        for code in existing_codes:
            code.status = "R"
            code.save()

        VerificationCode.objects.create(user=user,code=verification_code, create_date=create_date, expires=expiry_time)

        html_message = render_to_string('email/accountverification.html', {'first_name': user.first_name, 'user_name': user.username, 'verification_code': verification_code})
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

class ActivateAccountAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_code = request.data["code"]

        try:
            if (request.user.profile and request.user.profile.status == "A"):
                return Response({"error": "Account is already activated."})

            # Get Active Codes for the user matching the code value provided
            if (request.user.profile and request.user.profile.status == "P"):
                issued_code = VerificationCode.objects.filter(user=request.user, code=user_code)

                if issued_code.__len__() >= 1:
                    for code in issued_code:
                        if (code.expires >= timezone.now() and code.status == "A"):
                            # Update user status to Active
                            profile = Person.objects.get(user_account=request.user)
                            profile.status = "A"
                            profile.save()

                            # Grant basic user permissions to the user
                            standard_group = Group.objects.get(name="Standard User")
                            standard_group.user_set.add(request.user)

                            # Mark verification code as Completed
                            code.status = "C"
                            code.save()

                            return Response({"success": "Account Successfully Activated"})
                        
                        if (code.expires < timezone.now() and code.status == "A"):
                            code.status = "X"
                            code.save()
                        
                        return Response ({"error": "Verification Code Has Expired."})
                        
                if issued_code.__len__() == 0:
                    return Response({"error": "Verification Code Not Found."})
        except Exception as e:
            print(e)

            return Response({
                "error": f"{type(e)}",
                "message": f"{e}"
            }) 
        
        return Response({
            "error": "Account Not Activated."
        })