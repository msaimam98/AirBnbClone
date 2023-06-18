from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.views import APIView
from webpages.models.user import RestifyUser 
from webpages.models.reservation import Reservation
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.http.response import HttpResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.http import JsonResponse

from ..models import Notification, Reservation
from ..serializers.serializers_notification import CreateNotificationSerializer, NotificationSerializer


# call this function when a new reservation is made
class CreateNotificationAPIView(CreateAPIView):
  serializer_class = CreateNotificationSerializer
  
  def perform_create(self, serializer):
    user_id = self.kwargs['user_id']
    reservation_id = self.kwargs['reservation_id']
    try:
      user = RestifyUser.objects.get(id=user_id)
    except RestifyUser.DoesNotExist:
      raise ValidationError('404 NOT FOUND: User not found')
    
    try:
      reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
      raise ValidationError('404 NOT FOUND: Reservation not found')
    
    # TODO: check for duplicates
    print('here ', reservation.status)
    reservation_host = reservation.property.property_owner
    reservation_user = reservation.user

    serializer.validated_data['user'] = user
    serializer.validated_data['reservation'] = reservation
    if user == reservation_host:
      serializer.validated_data['user_type'] = 'host'
      if reservation.status == 'AR':
        # if Notification.objects.get(reservation=reservation, user=user, notification_message='New reservation'):
        if Notification.objects.filter(reservation=reservation, user=user, notification_message='New reservation').exists():
          raise ValidationError('Notification already exists')
        serializer.validated_data['notification_message'] = 'New reservation'
        return super().perform_create(serializer)
      if reservation.status == 'CR':
        # if Notification.objects.get(reservation=reservation, user=user, notification_message='Cancellation request'):
        if Notification.objects.filter(reservation=reservation, user=user, notification_message='Cancellation request').exists():
          raise ValidationError('Notification already exists')
        serializer.validated_data['notification_message'] = 'Cancellation request'
        return super().perform_create(serializer)
      raise ValidationError('No notification needed')
    
    if user == reservation_user:
      serializer.validated_data['user_type'] = 'guest'
      if reservation.status == 'AP':
        # if Notification.objects.get(reservation=reservation, user=user, notification_message='Approved reservation'):
        #   raise ValidationError('Notification already exists')
        if Notification.objects.filter(reservation=reservation, user=user, notification_message='Approved reservation').exists():
          raise ValidationError('Notification already exists.')
        serializer.validated_data['notification_message'] = 'Approved reservation'
        return super().perform_create(serializer)
      if reservation.status == 'CR':
        # if Notification.objects.get(reservation=reservation, user=user, notification_message='Cancellation request'):
        if Notification.objects.filter(reservation=reservation, user=user, notification_message='Cancellation request').exists():
          raise ValidationError('Notification already exists')
        serializer.validated_data['notification_message'] = 'Cancellation request'
        return super().perform_create(serializer)
      raise ValidationError('No notification needed')
    
    raise ValidationError('User is not a user/host for this reservation')
        
class CreateHostCommentNotificationAPIView(CreateAPIView):
  serializer_class = CreateNotificationSerializer
  
  def perform_create(self, serializer):
    reservation_id = self.kwargs['reservation_id']
    # try:
    #   user = RestifyUser.objects.get(id=self.request.user.id)
    # except RestifyUser.DoesNotExist:
    #   raise ValidationError('404 NOT FOUND: You are not a person')
    
    try:
      reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
      raise ValidationError('404 NOT FOUND: Reservation not found')
    
    reservation_host = reservation.property.property_owner

    serializer.validated_data['user'] = reservation_host
    serializer.validated_data['reservation'] = reservation

    if Notification.objects.filter(reservation=reservation, user=reservation_host, notification_message='New Property Comment').exists():
      raise ValidationError('Notification already exists.')
    
    if reservation.status != 'CO' and reservation.status != 'TE':
      raise ValidationError('Cannot add comment if it didnt finish')

    serializer.validated_data['user_type'] = 'host'
    serializer.validated_data['notification_message'] = 'New Property Comment'
    return super().perform_create(serializer)
    

# gets all notifications for a given user regardless of read status
class GetAllUserNotifications(ListAPIView):
  serializer_class = NotificationSerializer
  # pagination_class = PageNumberPagination
  # default_page_size = 5
  
  def get_queryset(self):
    user_id = self.request.user.id
    try:
      user = RestifyUser.objects.get(id=user_id)
    except RestifyUser.DoesNotExist:
      raise ValidationError('404 NOT FOUND: Resify User not found')
    
    # return super().get_queryset()
    return Notification.objects.filter(user=user)
  
  # this gets the data with pagination 
  # def get(self, request, *args, **kwargs):
  #   page_size = request.query_params.get('page_size', None)
  #   if page_size:
  #     self.pagination_class.page_size = int(page_size)
  #   else:
  #     self.pagination_class.page_size = self.default_page_size
  #   self.pagination_class.page_size_query_param = 'page_size'
  #   return self.list(request, *args, **kwargs)

  # # this function will list just the data, not the whole object from pagination
  # def list(self, request, *args, **kwargs):
  #   queryset = self.filter_queryset(self.get_queryset())
  #   page = self.paginate_queryset(queryset)
  #   serializer = self.get_serializer(page, many=True)
  #   return Response(serializer.data)
  

# this will view a specific notification, ie. user clicks on a specific notification to view message
class ViewUserNotification(UpdateAPIView):
  serializer_class = NotificationSerializer
  permission_classes = [IsAuthenticated]  
  
  def get_object(self):
    notification = get_object_or_404(Notification, pk=self.kwargs['notification_id'])
    if self.request.user.id != notification.user.id:
      raise ValidationError('You cannot view notifications that do not belong to you!')
    return notification
  
  def perform_update(self, serializer):
    notification = serializer.save()
    notification.read = True
    serializer.save()
    # return super().perform_update(serializer)
  
# TODO: clear ALL notifications at once

class ClearUserNotification(DestroyAPIView):
  serializer_class = NotificationSerializer
  permission_classes = [IsAuthenticated]  
  
  def get_queryset(self):
    notification_id = self.kwargs['notification_id']
    try:
      notification = Notification.objects.get(id=notification_id)
    except Notification.DoesNotExist:
      raise ValidationError('404 NOT FOUND: Notification not found')
        # return super().get_queryset()
    return notification
  
  def destroy(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    if self.request.user.id != queryset.user.id:
      raise ValidationError('You cannot clear notifications that do not belong to you!')
    queryset.delete()
    return JsonResponse({'message': 'Deleted'}, status=200)
    # return super().destroy(request, *args, **kwargs)


# gets all notifications for a given user only unread messages tho
class GetAllNewNotifications(ListAPIView):
  serializer_class = NotificationSerializer
  # pagination_class = PageNumberPagination
  # default_page_size = 5
  
  def get_queryset(self):
    user_id = self.request.user.id
    try:
      user = RestifyUser.objects.get(id=user_id)
    except RestifyUser.DoesNotExist:
      raise ValidationError('404 NOT FOUND: Resify User not found')
    
    # return super().get_queryset()
    return Notification.objects.filter(user=user, read=False)
  
  # this gets the data with pagination 
  # def get(self, request, *args, **kwargs):
  #   page_size = request.query_params.get('page_size', None)
  #   if page_size:
  #     self.pagination_class.page_size = int(page_size)
  #   else:
  #     self.pagination_class.page_size = self.default_page_size
  #   self.pagination_class.page_size_query_param = 'page_size'
  #   return self.list(request, *args, **kwargs)

  # # this function will list just the data, not the whole object from pagination
  # def list(self, request, *args, **kwargs):
  #   queryset = self.filter_queryset(self.get_queryset())
  #   page = self.paginate_queryset(queryset)
  #   serializer = self.get_serializer(page, many=True)
  #   return Response(serializer.data)
  
# gets all notifications for a given position for the user
class GetPositionNotifications(ListAPIView):
  serializer_class = NotificationSerializer
  # pagination_class = PageNumberPagination
  # default_page_size = 5
  
  def get_queryset(self):
    user_id = self.request.user.id
    try:
      user = RestifyUser.objects.get(id=user_id)
    except RestifyUser.DoesNotExist:
      raise ValidationError('404 NOT FOUND: Resify User not found')
    position = self.kwargs['position'].lower()
    if position != 'host' and position != 'guest':
      raise ValidationError('Invalid position entered')
    # return super().get_queryset()
    return Notification.objects.filter(user=user, read=False, user_type=position)
  
  # # this gets the data with pagination 
  # def get(self, request, *args, **kwargs):
  #   page_size = request.query_params.get('page_size', None)
  #   if page_size:
  #     self.pagination_class.page_size = int(page_size)
  #   else:
  #     self.pagination_class.page_size = self.default_page_size
  #   self.pagination_class.page_size_query_param = 'page_size'
  #   return self.list(request, *args, **kwargs)

  # # this function will list just the data, not the whole object from pagination
  # def list(self, request, *args, **kwargs):
  #   queryset = self.filter_queryset(self.get_queryset())
  #   page = self.paginate_queryset(queryset)
  #   serializer = self.get_serializer(page, many=True)
  #   return Response(serializer.data)