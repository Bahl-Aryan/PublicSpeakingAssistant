from django import forms
from django.contrib.auth.forms import UserCreationForm
class clip_upload_form(forms.Form):
    name = forms.CharField(max_length =50)
    audio =forms.FileField()
class extended_user_creation_form(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        fields=UserCreationForm.Meta.fields
