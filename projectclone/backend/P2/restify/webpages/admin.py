from django.contrib import admin
from webpages.models.comment import PropertyComment, GuestComment
from webpages.models.notification import Notification
from webpages.models.property import Property, RangePriceHostOffer, PropertyImage
from webpages.models.reservation import Reservation , PropertyRating
from webpages.models.user import RestifyUser
from webpages.models.user_history import UserHistory

# Register your models here.

admin.site.register(PropertyComment) 
admin.site.register(GuestComment)
admin.site.register(Notification)
admin.site.register(Property)
admin.site.register(Reservation)
admin.site.register(RestifyUser)
admin.site.register(RangePriceHostOffer)
admin.site.register(PropertyImage)
admin.site.register(UserHistory)

admin.site.register(PropertyRating)