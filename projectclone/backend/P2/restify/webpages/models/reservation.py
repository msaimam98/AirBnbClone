from django.db import models
from .user import RestifyUser
# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# from .comment import PropertyComment
from .property import *


# For Reservations
# using content type also

class Reservation(models.Model):
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='restify_user_for_reservation') # user that booked this 
    # property_owner = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='property_owner_of_reservation')
    posted_on = models.DateTimeField(auto_now=True)
    # content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='reservation_content', null=True, blank=True)
    object_id = models.PositiveIntegerField(default=1)  # need to set SingleComment id to this object_id
    # content_object = ('content_type', 'object_id')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reservation_property')
    num_of_guests = models.PositiveBigIntegerField(default=1)
    # reason_for_cancelling = models.CharField(max_length=400)
    available_date = models.ForeignKey(RangePriceHostOffer, on_delete=models.CASCADE, related_name="date_booked_for", null=True, blank=True)


    APPROVED = 'AP' # after host approves, make this as status - host: approved, user: approved 
    APPROVAL_REQUEST = 'AR' # for user - after user makes reservation request make this as status - host: request, user: requested 
    TERMINATED = 'TE' # after host terminates, make this as status - host: terminated, user: terminated - when the host terminates a reservation 
    DENIED = 'DE' # after host denies, make this as status - host: denied, user: denied - move from user: requests to nowhere, remove from host: requests
    CANCELLED = 'CA' # after host approves cancellation, make this as status - host: cancelled, user: cancellations - move from host: approved to host: cancellations
    # if the previous status was user: requests, make this status right away 
    CANCELLATION_REQUEST = 'CR' # for host - after user makes a cancellation request, use this as status - host: cancellations, user: 
    COMPLETED = 'CO' # after the time for the reservation expires, make this the status - when the view that changes the status here is triggered, also move the listing from approved to completed (should be in approved for both) host: completed, user: completed 

    STATUS_CHOICES = [
        (APPROVAL_REQUEST, 'Approval Request'),
        (TERMINATED, 'Terminated'),
        (APPROVED, 'Approved'),
        (DENIED, 'Denied'),
        (CANCELLED, 'Cancelled'),
        (CANCELLATION_REQUEST, 'Cancellation Request'),
        (COMPLETED, 'Completed'),

    ]
    status = models.CharField(
        default=APPROVAL_REQUEST, 
        choices=STATUS_CHOICES,
        max_length=2,
    )
    def __str__(self) -> str:
        return self.property.address + ' reservation || ID: ' + str(self.id)
    # comment = models.OneToOneField(Comment, on_delete=models.CASCADE)

# class Pending(models.Model):
#     approve_status = models.BooleanField(default=False)

# class Denied(models.Model):
#     content = models.TextField(null=True, blank=True)

# class Expired(models.Model):
#     content = models.TextField(null=True, blank=True)

# class Approved(models.Model):
#     content = models.TextField(null=True, blank=True)
    
# class Canceled(models.Model):
#     content = models.TextField(null=True, blank=True)

# class Terminated(models.Model):
#     content = models.TextField(null=True, blank=True)
#     comment = models.OneToOneField(Comment, on_delete=models.CASCADE)

# class Completed(models.Model):
#     content = models.TextField(null=True, blank=True)
#     comment = models.OneToOneField(Comment, on_delete=models.CASCADE)

class PropertyRating(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_rating')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)], default=None)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='reservation_rating', null=True)
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='property_user_rating', null=True)

class GuestRating(models.Model):
    rating = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)], default=None)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='reservation_guest_rating', null=True)
    host_rater = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='host_guest_rating', null=True)
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='user_guest_rating', null=True)