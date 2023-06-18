from django.db import models
from multiselectfield import MultiSelectField
from multiselectfield.validators import MaxValueMultiFieldValidator
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


from .user import RestifyUser



# For Property

class Property(models.Model):

    property_owner = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='property_owner')
    address = models.TextField() # just the city 
    number_of_guest = models.PositiveIntegerField()
    number_of_bed = models.PositiveIntegerField()
    number_of_rooms = models.PositiveIntegerField()
    baths = models.PositiveIntegerField()
    description = models.TextField()
    # amenities = models.CharField(max_length=500)
    # num_reservations = models.PositiveIntegerField(default=0)
    
    # AMENTIIES 

    # MaxValueMultiFieldValidator tells django how many choices there can be therefore checks till that number atleast - the number of choices is by default limited to 1
    # How to know which ones have been selected? my_model_instance.essentials gives us 'wifi,tv,kitchen' if Wifi, TV, Kitchen are selected 

    # # get the model 
    # my_model_instance = MyModel.objects.get(pk=pk)

    # # Split the comma-separated string into a list
    # selected_options = my_model_instance.essentials.split(',')

    # # Do something with the selected options list
    # for option in selected_options:
    CHOICES_ESSENTIALS = (
        ('wifi', 'Wifi'),
        ('tv', 'TV'),
        ('kitchen', 'Kitchen'),
        ('workspace', 'Workspace'),
        ('air_conditioning', 'Air Conditioning'),
        ('heating', 'Heating'),
        ('washer', 'Washer'),
        ('dryer', 'Dryer'),

    )
    essentials = MultiSelectField(blank=True, null=True,choices=CHOICES_ESSENTIALS, validators=[MaxValueMultiFieldValidator(8)])
    CHOICES_FEATURES = (
        ('pool', 'Pool'),
        ('hot_tub', 'Hot Tub'),
        ('patio', 'Patio'),
        ('grill', 'Grill'),
        ('gym', 'Gym'),
        ('piano', 'Piano'),
        ('fire_pit', 'Fire Pit'),
        ('outdoor_shower', 'Outdoor Shower'),


    )
    features = MultiSelectField(blank=True, null=True,choices=CHOICES_FEATURES, validators=[MaxValueMultiFieldValidator(8)])
    CHOICES_LOCATION = (
        ('lake_access','Lake Access'),
        ('beach_access', 'Beach Access'),
        ('skiin_skiout', 'Ski-in/Ski-out'),

    )
    location = MultiSelectField(blank=True, null=True, choices=CHOICES_LOCATION, validators=[MaxValueMultiFieldValidator(8)])
    CHOICES_SAFETY = (
        ('smoke_detector', 'Smoke Detector'),
        ('first_aid_kit', 'First Aid Kit'),
        ('fire_extinguisher', 'Fire Extinguisher'),

    )

    safety_features = MultiSelectField(blank=True, null=True,choices=CHOICES_SAFETY, validators=[MaxValueMultiFieldValidator(8)])
    def __str__(self) -> str:
        return self.address + " " + str(self.pk)
    class Meta:
        verbose_name_plural = 'properties'





class PropertyImage(models.Model):
    name = models.CharField(max_length=255)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='product_attribute_for_propimage')
    image = models.ImageField(upload_to='images/')

    def __str__(self) -> str:
        return "Property Image ID: " + str(self.pk) + " for Property ID: " + str(self.property.pk)
    class Meta:
        verbose_name_plural = 'Property Images'



# class AvailableDate(models.Model):
#     property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_for_available_date')
#     start_date = models.DateTimeField()
#     end_date = models.DateTimeField()

# class AskingPrice(models.Model):
#     start_date = models.DateTimeField(auto_now=True)
#     end_date = models.DateTimeField(auto_now=True)
#     price = models.PositiveBigIntegerField()
#     property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_for_asking_price')

class RangePriceHostOffer(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_for_available_date')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    price_per_night = models.PositiveBigIntegerField()
    booked_for = models.BooleanField(default=False)

    def __str__(self) -> str:
        return "Price/night: $" + str(self.price_per_night) + " with Property ID: " + str(self.property.pk) + " || ID: " + str(self.pk)
    
    # def update_booked_for(self, value):
    #     self.booked_for = value
    #     self.save(update_fields=['booked_for'])
    class Meta:
        verbose_name_plural = 'Available Ranges + Prices'



