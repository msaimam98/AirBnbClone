from rest_framework.serializers import ModelSerializer, MultipleChoiceField
from ..models.user import RestifyUser
from webpages.models.property import Property, PropertyImage, RangePriceHostOffer
# from .serializers_reservation import ReservationSerializer
from webpages.serializers.serializer_user import UserSerializer


class PropertySerializer(ModelSerializer):

    essentials = MultipleChoiceField(choices=Property.CHOICES_ESSENTIALS)
    features = MultipleChoiceField(choices=Property.CHOICES_FEATURES)
    safety_features = MultipleChoiceField(choices=Property.CHOICES_SAFETY)
    location = MultipleChoiceField(choices=Property.CHOICES_LOCATION)
    property_owner = UserSerializer(read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'property_owner' ,'address', 'number_of_guest', 'number_of_bed', 'number_of_bed', 'number_of_rooms', 'baths', 'description', 'essentials', 'features', 'location', 'safety_features']
        # property_owner does not have to be sent 

    def create(self, validated_data):
        # print(self.context['request'].user)
        return super().create(validated_data)
    

    
class PropertyImageSerializer(ModelSerializer):
    
    class Meta:
        model = PropertyImage
        exclude = ("property", )
        # property_owner does not have to be sent 

    def create(self, validated_data):
        # print(self.context['request'].user)
        return super().create(validated_data)
    
class PropertyTimeRangePriceHostOfferSerializer(ModelSerializer):
    
    class Meta:
        model = RangePriceHostOffer
        exclude = ("property", )

        # property_owner does not have to be sent 

    def create(self, validated_data):
        # print(self.context['request'].user)
        return super().create(validated_data)
    



