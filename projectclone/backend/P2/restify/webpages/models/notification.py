from django.db import models
from .user import RestifyUser

# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from .comment import PropertyComment
from .reservation import Reservation


# For notification

class Notification(models.Model):
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='restify_user_notification')
    # content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='user_content')
    # object_id = models.PositiveIntegerField()  # need to set SingleComment id to this object_id
    user_type = models.TextField(null=True, blank=True) # is this a host POV or guest POV type of notif?
    content_object = ('content_type', 'object_id')
    read = models.BooleanField(default=False)
    notification_message = models.TextField(null=True, blank=True)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, null=True)

# be notified when someone rates my property
class RateNotification(models.Model):
    content = models.OneToOneField(PropertyComment, on_delete=models.CASCADE)

# be notified when someone replies my comment
class CommentNotification(models.Model):
    content = models.OneToOneField(PropertyComment, on_delete=models.CASCADE)

# be notified when my reservation status change as user 
class RenterRequestNotification(models.Model):
    content = models.OneToOneField(PropertyComment, on_delete=models.CASCADE)

# be notified when my property get requested for reservation as owner
class OwnerRequestNotification(models.Model):
    content = models.OneToOneField(PropertyComment, on_delete=models.CASCADE)

# remind me when the date of my approved reservations are about to come up
class ReminderNotification(models.Model):
    content = models.OneToOneField(PropertyComment, on_delete=models.CASCADE)


