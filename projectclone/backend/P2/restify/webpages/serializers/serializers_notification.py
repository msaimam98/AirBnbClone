from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404


from ..models.user import RestifyUser
from webpages.models.reservation import Reservation 
from ..models.notification import Notification
from rest_framework import serializers


class CreateNotificationSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  
  class Meta:
    model = Notification
    fields = ['content_type', 'read', 'user_type', 'notification_message']
  
  def perform_create(self, serializer):
    reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
    reservation = get_object_or_404(Reservation, id=reservation_id)
    return super().perform_create(serializer)

class NotificationSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  username = serializers.StringRelatedField(source='user.username')
  
  class Meta:
    model = Notification
    fields = ['id', 'content_type', 'reservation', 'username', 'user_type', 'read', 'notification_message']
  
  def create(self, validated_data):
    return super().create(validated_data)