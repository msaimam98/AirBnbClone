from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class RestifyUser(AbstractUser):
    host_or_not = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='images/', height_field=None, width_field=None, max_length=100, null=True, blank=True) # null=True means this attribute can be null in db # blank=True means it can be blank in the form
    phone_number = models.CharField(max_length=20) # see how to take extensions into account 
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField()
    # username = None
    # password fields already being inherited from AbstractUser
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        return self.username + " || User ID: " + str(self.pk)


# class UserHistory(models.Model):
#     comment_for_this_user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
#     content = models.CharField(max_length=255)

#     def __str__(self) -> str:
#         return "User History for User ID: " + str(self.comment_for_this_user.id) + " with History ID: " + str(self.pk)
#     class Meta:
#         verbose_name_plural = 'User History Comments'


