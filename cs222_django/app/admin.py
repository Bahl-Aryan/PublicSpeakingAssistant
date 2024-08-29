from django.contrib import admin
from .models import Profile, Clip
from django.contrib.auth.models import Group
admin.site.unregister(Group)
admin.site.register(Profile)
admin.site.register(Clip)
# Register your models here.
