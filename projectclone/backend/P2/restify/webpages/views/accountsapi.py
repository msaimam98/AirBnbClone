from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework.generics import RetrieveAPIView, ListAPIView
# from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



    

from rest_framework.generics import RetrieveAPIView, CreateAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.views import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from webpages.serializers.serializer_user import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# signup 
class SignupAPIView(CreateAPIView):
    # takes only post request
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'user': serializer.data, 'message': 'User created successfully'})

from rest_framework.authtoken.models import Token

# login 
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    # automatically takes care of checking for blacklisted tokens
    # authentication_classes = [JWTAuthentication]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            # Create JWT token
            # token = TokenObtainPairSerializer().get_token(user)
            token = RefreshToken.for_user(user)
            # print('this is the token',token.refresh_token)
            print('this is the access token', token.access_token)
            return Response({"token": str(token.access_token)})
        else:
            return Response({'error': 'Invalid credentials'})
        
# logout 
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # print('these are the query params',request.META.get('HTTP_AUTHORIZATION')[7:])
            
            # refresh_token = request.META.get('HTTP_AUTHORIZATION')[7:]

            refresh_token = request.data['refresh']
            print('this is the refresh' ,refresh_token)
            
            token = RefreshToken(refresh_token)
            print('getting here line75')
            # blacklisting the token
            token.blacklist()
            print('getting here line78')
            return Response({"message": "Successfully logged out."})
        except Exception:
            return Response({"error": "Invalid refresh token."}, status=400)

# view profile
class UserProfileAPIView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
# edit profile 
class UserProfileEditAPIView(RetrieveAPIView, UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    


    

