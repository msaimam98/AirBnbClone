from django.db import models
from .user import RestifyUser

# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from .property import Property 
from .reservation import Reservation


class CommentBaseClass(models.Model):
    posted_on = models.DateTimeField(auto_now=True)
    text_content = models.TextField()
    content_object = ('content_type', 'object_id')
    reply = models.TextField(null=True, blank=True)
    class Meta:
        abstract = True

class PropertyComment(CommentBaseClass):
    author = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='property_comment_author')
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='property_comments')
    host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='host_reservation_property', null=True)
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='user_reservation_property', null=True)



class GuestComment(CommentBaseClass):
    author = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='guest_comment_author')
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='reservation_guest_comments')
    guest = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='guest_comments', null=True, blank=True)
    host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='host_reservation_guest', null=True)
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='user_reservation_guest', null=True)


















# For Comment: there are two types: for property: which has 3 phases. the other type is just 1 single comment
# # Create a Comment Example
# sc = SingleComment.objects.create(user=request.user, content='This is a comment')
# c = Comment.objects.create(content_type=ContentType.objects.get_for_model(SingleComment),
#                            object_id=sc.id)
# then we can access c.content_object.user even though user is not in Comment
# class Comment(models.Model):
    
#     posted_on = models.DateTimeField(auto_now=True)
#     content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='comment_content')
#     object_id = models.PositiveIntegerField()  # need to set SingleComment id to this object_id
#     content_object = ('content_type', 'object_id')


# class PropertyComment(models.Model):
#     property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_for_propertycomment')
#     content = models.TextField(null=True, blank=True)
#     content = models.TextField(null=True, blank=True)
#     content = models.TextField(null=True, blank=True)


# class SingleComment(models.Model):
#     user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='restify_user_single_comment')
#     content = models.TextField()


# class TargetComment(models.Model):
#     user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='restify_user_target_comment')
#     target_user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='target_user')
#     content = models.TextField()





