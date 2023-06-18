
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404


from ..models.user import RestifyUser
from webpages.models.reservation import Reservation 
from ..models.comment import PropertyComment, GuestComment
from rest_framework import serializers
from .serializer_user import UserSerializer


class CreatePropertyCommentSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  
  class Meta:
    model = PropertyComment
    fields = ['text_content', 'content_type']

  def perform_create(self, serializer):
    reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
    reservation = get_object_or_404(Reservation, id=reservation_id)
    return super().perform_create(serializer)
  
    
class PropertyCommentSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  author = serializers.StringRelatedField(source='author.username')
  class Meta:
    model = PropertyComment
    fields = ['content_type', 'reservation', 'author', 'reply', 'text_content', 'host', 'user', 'posted_on']
    
  def create(self, validated_data):
    return super().create(validated_data)
  
  
class CreateGuestCommentSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  
  class Meta:
    model = GuestComment
    fields = ['text_content', 'content_type']

  def perform_create(self, serializer):
    reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
    reservation = get_object_or_404(Reservation, id=reservation_id)
    return super().perform_create(serializer)
  

class GuestCommentSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  author = serializers.StringRelatedField(source='author.username')
  class Meta:
    model = GuestComment
    fields = ['content_type', 'reservation', 'author', 'guest', 'reply', 'text_content']
    
  def create(self, validated_data):
    return super().create(validated_data)