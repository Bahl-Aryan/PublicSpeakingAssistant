from rest_framework import serializers
from .models import Clip, Profile
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class ClipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clip
        fields = ['clip_id','name', 'audio', 'date_added', 'assertiveness', 'enthusiasm','clairity','engagement', 'rated']

    def create(self, validated_data):
        profile = self.context['request'].user.profile
        clip = Clip.objects.create(profile=profile, **validated_data)
        return clip


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        validate_password(data['password'])
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)
        user = User.objects.create_user(
            username=validated_data['username'],
        )
        password=validated_data['password'],
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    clips = ClipSerializer(many = True, read_only = True)

    class Meta:
        model = Profile
        fields = ['user', 'uuid', 'clips']
