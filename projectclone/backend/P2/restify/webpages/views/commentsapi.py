
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView

from webpages.models.reservation import Reservation 
from webpages.models.user import RestifyUser
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.http.response import HttpResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from ..models import Reservation, PropertyComment, GuestComment, RestifyUser
from ..serializers.serializers_comment import PropertyCommentSerializer, CreatePropertyCommentSerializer, CreateGuestCommentSerializer, GuestCommentSerializer
from datetime import datetime


## THIS IS THE PROPERTY COMMENT PART
class CreatePropertyCommentAPIView(CreateAPIView):
  serializer_class = CreatePropertyCommentSerializer
  permission_classes = [IsAuthenticated]
  pk_url_kwarg = 'reservation_id'
  
  def perform_create(self, serializer):
    reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
    # reservation = get_object_or_404(Reservation, id=reservation_id) # get reservation
    try:
      reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        raise ValidationError('404 NOT FOUND: Reservation not found')
      
    # check that the reservation has either been completed or terminated
    if reservation.status != 'CO' and reservation.status != 'TE':
      raise ValidationError('HTTP 401 UNAUTHORIZED: Reservation not complete/terminated')
    # get the host
    # print('i am here now ', reservation.property.property_owner.username, self.request.user)
    reservation_host = reservation.property.property_owner
    reservation_user = reservation.user
    if self.request.user != reservation_host and self.request.user != reservation_user:
      raise ValidationError('HTTP 403 FORBIDDEN: Not the host/user of the reservation')
    
    if reservation.property_comments.count() >= 3:
      raise ValidationError("Cannot add more than 3 property comments for this reservation.")
    # check if the user is adding the first comment
    if reservation.property_comments.all().count() == 0:
      if self.request.user == reservation_user:
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['author'] = self.request.user
        serializer.validated_data['reply'] = 'Original Property Comment'
        serializer.validated_data['host'] = reservation_host
        serializer.validated_data['user'] = reservation_user
        serializer.validated_data['posted_on'] = datetime.now()
        return super().perform_create(serializer)
      else:
        raise ValidationError("Host cannot add the first comment on property.")
    
    # check if the host is adding a follow up reply
    if reservation.property_comments.all().count() == 1:
      if self.request.user == reservation_host: # you have to be the host to say the reply
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['author'] = self.request.user
        serializer.validated_data['reply'] = 'Host Property Reply'
        serializer.validated_data['host'] = reservation_host
        serializer.validated_data['user'] = reservation_user
        serializer.validated_data['posted_on'] = datetime.now()
        return super().perform_create(serializer)
      else:
        raise ValidationError("User cannot talk about property without a host reply.")
        
    
    # check if user is adding follow up to host reply
    if reservation.property_comments.all().count() == 2:
      if self.request.user == reservation_user:
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['author'] = self.request.user
        serializer.validated_data['reply'] = 'User Property Reply'
        serializer.validated_data['host'] = reservation_host
        serializer.validated_data['user'] = reservation_user
        serializer.validated_data['posted_on'] = datetime.now()
        return super().perform_create(serializer)
      else:
        raise ValidationError('Host cannot add third comment on property')
    
    raise ValidationError('Cannot add more than 3 comments')



# gets property comments for a specific reservation, don't need pagination because max can only be 3, don't need to be authenticated
class GetAllReservationPropertyComments(ListAPIView):
  serializer_class = PropertyCommentSerializer

  def get_queryset(self):
    reservation_id = self.kwargs['reservation_id']
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        raise ValidationError('Reservation not found: Reservation')
    return PropertyComment.objects.filter(reservation=reservation)

  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)
  
class GetAllPropertyComments(ListAPIView):
    serializer_class = PropertyCommentSerializer
    # pagination_class = PageNumberPagination
    # default_page_size = 5
    
    def get_queryset(self):
        property_id = self.kwargs['property_id']
        return PropertyComment.objects.filter(reservation__property_id=property_id)
    
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


## THIS IS THE GUEST COMMENT PART

class CreateGuestCommentAPIView(CreateAPIView):
  serializer_class = CreateGuestCommentSerializer
  permission_classes = [IsAuthenticated]
  pk_url_kwarg = 'reservation_id'
  
  def perform_create(self, serializer):
    reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
    # reservation = get_object_or_404(Reservation, id=reservation_id) # get reservation
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        raise ValidationError('404 NOT FOUND: Reservation not found')
      
    # check that the reservation has been completed
    if reservation.status != 'CO':
      raise ValidationError('HTTP 401 UNAUTHORIZED: Reservation not completed')
    # get the host
    reservation_host = reservation.property.property_owner
    reservation_user = reservation.user
    
    if self.request.user != reservation_host and self.request.user != reservation_user:
      raise ValidationError('HTTP 403 FORBIDDEN: Not the host/user of the reservation')
    
    if reservation.reservation_guest_comments.count() >= 3:
      raise ValidationError("Cannot add more than 3 guest comments for this reservation.")
    # check if the user is adding the first comment
    if reservation.reservation_guest_comments.all().count() == 0:
      if self.request.user == reservation_host:
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['author'] = self.request.user
        serializer.validated_data['guest'] = reservation_user
        serializer.validated_data['reply'] = 'Original Guest Comment'
        return super().perform_create(serializer)
      else:
        raise ValidationError("Guest cannot add the first comment on guest.")
    
    # check if the host is adding a follow up reply
    if reservation.reservation_guest_comments.all().count() == 1:
      if self.request.user == reservation_user: # you have to be the host to say the reply
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['author'] = self.request.user
        serializer.validated_data['guest'] = reservation_user
        serializer.validated_data['reply'] = 'User Guest Reply'
        return super().perform_create(serializer)
      else:
        raise ValidationError("User cannot talk about themself without a host comment.")
        
    
    # check if user is adding follow up to host reply
    if reservation.reservation_guest_comments.all().count() == 2:
      if self.request.user == reservation_host:
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['author'] = self.request.user
        serializer.validated_data['guest'] = reservation_user
        serializer.validated_data['reply'] = 'Host Guest Reply'
        return super().perform_create(serializer)
      else:
        raise ValidationError('User cannot add third comment about guest.')
    
    raise ValidationError('Cannot add more than 3 comments')
  
  
  # gets guest comments for a specific reservation, don't need pagination because max can only be 3, don't need to be authenticated
  # TODO: check if user viewing is a host only
class GetAllReservationGuestComments(ListAPIView):
  serializer_class = GuestCommentSerializer

  def get_queryset(self):
    user_id = self.request.user.id
    try:
      user = RestifyUser.objects.get(id=user_id)
    except RestifyUser.DoesNotExist:
      raise ValidationError('You are not a person')
    
    # TODO: check if this part works because doesn't work on my database
    # if not user.host_or_not:
    #   raise ValidationError('This is only viewable by a host. You are not a host')
    
    reservation_id = self.kwargs['reservation_id']
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        raise ValidationError('Reservation not found: Reservation')
    return GuestComment.objects.filter(reservation=reservation)

  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)
  
# this gets all the comments for specific guest given the guest id
class GetAllGuestComments(ListAPIView):
    serializer_class = GuestCommentSerializer
    pagination_class = PageNumberPagination
    default_page_size = 5
      
    def get_queryset(self):
      user_id = self.request.user.id
      try:
        user = RestifyUser.objects.get(id=user_id)
      except RestifyUser.DoesNotExist:
        raise ValidationError('You are not a person')
    
      # TODO: check if this part works because doesn't work on my database
      # if not user.host_or_not:
      #   raise ValidationError('This is only viewable by a host. You are not a host')
      guest_id = self.kwargs['guest_id']
      guest = get_object_or_404(RestifyUser, id=guest_id)
      return GuestComment.objects.filter(guest=guest)
    
    # this gets the data with pagination 
    def get(self, request, *args, **kwargs):
      page_size = request.query_params.get('page_size', None)
      if page_size:
        self.pagination_class.page_size = int(page_size)
      else:
        self.pagination_class.page_size = self.default_page_size
      self.pagination_class.page_size_query_param = 'page_size'
      return self.list(request, *args, **kwargs)

    # this function will list just the data, not the whole object from pagination
    def list(self, request, *args, **kwargs):
      queryset = self.filter_queryset(self.get_queryset())
      page = self.paginate_queryset(queryset)
      serializer = self.get_serializer(page, many=True)
      return Response(serializer.data)