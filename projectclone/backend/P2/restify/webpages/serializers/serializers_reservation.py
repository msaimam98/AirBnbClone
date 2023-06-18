from rest_framework.serializers import ModelSerializer, CharField, PrimaryKeyRelatedField
from ..models.user import RestifyUser
from webpages.models.reservation import Reservation , PropertyRating, GuestRating
from django.db import models
from django.contrib.contenttypes.models import ContentType
from webpages.serializers.serializer_rangepriceoffer import RangePriceOfferSerializer
from django.shortcuts import get_object_or_404
from webpages.serializers.serializer_user import UserSerializer



class ReservationSerializerAdd(ModelSerializer):
    content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)

    class Meta:
        model = Reservation
        # datetime --> "date_joined": "2024-02-10T07:23:53.568Z"
        fields = ['content_type']

    def create(self, validated_data):
        # print(self.context['request'].user)
        return super().create(validated_data)
    
# class ReservationSerializer2(ModelSerializer):
#     content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)

#     class Meta:
#         model = Reservation
#         # datetime --> "date_joined": "2024-02-10T07:23:53.568Z"
#         fields = ['content_type']

#     def create(self, validated_data):
#         # print(self.context['request'].user)
#         return super().create(validated_data)


from .serializers_property import PropertySerializer
class ReservationSerializer(ModelSerializer): # onyl used for reading and not for any other reason
    property = PropertySerializer(read_only=True) # cannot be changed 
    # user = PrimaryKeyRelatedField(read_only=True)



    class Meta:
        model = Reservation
        exclude = ('user',)
        # fields = '__all__'

class ReservationReqSerializer(ModelSerializer): # this is for the reserve button on the reserve page
    property = PropertySerializer(read_only=True) # cannot be changed 
    user = PrimaryKeyRelatedField(read_only=True)



    class Meta:
        model = Reservation
        # exclude = ('user',)
        fields = '__all__'



class ReservationRequestSerializer(ModelSerializer): # onyl used for reading and not for any other reason
    # property = PropertySerializer(read_only=True) # cannot be changed 
    user = UserSerializer(read_only=True)
    class Meta:
        model = Reservation
        fields = '__all__'

class PropertyRatingSerializer(ModelSerializer):
    
    class Meta:
        model = PropertyRating
        exclude = ("property",)

        # property_owner does not have to be sent 

    def create(self, validated_data):
        # print(self.context['request'].user)
        return super().create(validated_data)    
    

class CreateGuestRatingSerializer(ModelSerializer):
    content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  
    class Meta:
        model = GuestRating
        fields = ['rating', 'reservation', 'host_rater', 'user', 'content_type']

    def perform_create(self, serializer):
        reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
        reservation = get_object_or_404(Reservation, id=reservation_id)
        return super().perform_create(serializer)
    

class GuestRatingSerializer(ModelSerializer):
  content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
  class Meta:
    model = GuestRating
    fields = ['rating', 'reservation', 'host_rater', 'user', 'content_type']
    
  def create(self, validated_data):
    return super().create(validated_data)