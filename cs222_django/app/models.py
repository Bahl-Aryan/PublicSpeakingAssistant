from django.db import models
import uuid
from django.contrib.auth.models import User
from django.db.models.signals import post_save
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    def __str__(self):
        return self.user.username
class Clip(models.Model):
    profile = models.ForeignKey(Profile, related_name='clips', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    clip_id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4,editable=False)
    audio = models.FileField()
    rated =models.BooleanField(default=False)
    date_added = models.DateTimeField(auto_now_add=True)
    assertiveness = models.IntegerField(default=0)
    enthusiasm = models.IntegerField(default=0)
    clairity = models.IntegerField(default=0)
    engagement = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.name} (Profile: {self.profile.user.username})"

#creates a profile when a user is added move this to signals once more signals are needed 
def create_profile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user = instance)
        user_profile.save()
post_save.connect(create_profile, sender =User)     
