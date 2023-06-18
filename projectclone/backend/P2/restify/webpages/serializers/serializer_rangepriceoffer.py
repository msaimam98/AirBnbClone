from rest_framework.serializers import ModelSerializer, MultipleChoiceField
from ..models.user import RestifyUser
from webpages.models.property import RangePriceHostOffer
from rest_framework.serializers import PrimaryKeyRelatedField




from .serializers_property import PropertySerializer
class RangePriceOfferSerializer(ModelSerializer): # onyl used for reading and not for any other reason
    # property = PropertySerializer(read_only=True) # cannot be changed 
    property = PrimaryKeyRelatedField(read_only=True)


    class Meta:
        model = RangePriceHostOffer
        # exclude = ('user',)
        fields = '__all__' 