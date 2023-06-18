

from django.db import models
from webpages.models.user import RestifyUser
from webpages.models.reservation import Reservation
from django.core.validators import MaxValueValidator, MinValueValidator





class UserHistory(models.Model):
    # comment_for_this_user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
    # comment_for_this_reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    content_object = ('content_type', 'object_id')
    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='user_user_history', null=True)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='reservation_user_history', null=True)
    host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='host_user_history', null=True)
    # content = models.CharField(max_length=255)
    posted_on = models.DateTimeField(auto_now=True)
    text_content = models.TextField(default=None)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=True)

    def __str__(self) -> str:
        return "User History for User ID: " + str(self.user.id) + " with History ID: " + str(self.pk)
    class Meta:
        verbose_name_plural = 'User History Comments'