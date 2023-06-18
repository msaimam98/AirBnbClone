from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from rest_framework import serializers
from ..models.user import RestifyUser
from ..models.user_history import UserHistory
from webpages.models.property import Property 
from django.contrib.auth import get_user_model

from ..models.reservation import Reservation
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404




class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = get_user_model()
        fields = [ 'id','username', 'email', 'first_name', 'last_name', 'phone_number', 'host_or_not', 'avatar', 'password']

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

# class CreateUserHistorySerializer(ModelSerializer):
#     # user = Pri
#     # property = PropertySerializer(read_only=True) # cannot be changed 
#     # comment_for_this_user = PrimaryKeyRelatedField(queryset= UserHistory.objects.all() ,required=False)
#     # comment_for_this_reservation = PrimaryKeyRelatedField(queryset= UserHistory.objects.all() ,required=False)

#     content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)

#     class Meta:
#         model = UserHistory
#         fields = ['rating', 'text_content', 'content_type']

#     def perform_create(self, serializer):
#         reservation_id = self.kwargs['reservation_id'] # get reservation_id from url
#         reservation = get_object_or_404(Reservation, id=reservation_id)
#         return super().perform_create(serializer)


#     # class Meta:
#     #     model = UserHistory
#     #     # exclude = ('comment_for_this_user', )
#     #     fields = "__all__"
    
class UserHistorySerializer(ModelSerializer):
    content_type = PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
    host = serializers.CharField(source='host.username', read_only=True)
    class Meta:
        model = UserHistory
        # fields = ['rating', 'reservation', 'host', 'user', 'content_type', 'posted_on', 'text_content']
        fields = "__all__"
    
    def create(self, validated_data):
        return super().create(validated_data)


