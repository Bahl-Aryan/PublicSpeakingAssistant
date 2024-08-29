from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse 
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response 
from rest_framework import status 
from .forms import clip_upload_form, extended_user_creation_form 
from .models import Profile, Clip 
from .serializer import ClipSerializer, UserRegistrationSerializer 
from django.contrib.auth import login, logout, authenticate
import keras 
import json 
import numpy
import librosa

ass_model = keras.models.load_model("../saved_models/assertiveness.keras")
cla_model = keras.models.load_model("../saved_models/clairity.keras")
eng_model = keras.models.load_model("../saved_models/engagement.keras")
ent_model = keras.models.load_model("../saved_models/enthusiasim.keras")

@csrf_exempt
@api_view(['POST']) 
def logout_view(request): 
    logout(request) 
    return Response({"message": "Logged out successfully"}, status=200)

@api_view(['POST']) 
def register(request): 
    serializer = UserRegistrationSerializer(data=request.data) 
    if serializer.is_valid(): 
        serializer.save() 
        return(Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED))
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    # This could return some data relevant to the dashboard
    user_clips = Clip.objects.filter(profile=request.user.profile)
    serializer = ClipSerializer(user_clips, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def register_fail(request):
    # Instead of rendering a failure page, return an error message
    return Response({"message": "Registration failed."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upload(request):
    # Providing an endpoint to get upload details or instructions
    return Response({"message": "Upload a clip via POST."})

def preprocess_data(file_path):
  audio, sr = librosa.load(file_path, sr=16000) #16000 is recommended sample rate for
  mfccs_scaled = numpy.mean(librosa.feature.mfcc(y=audio, sr = 16000, n_mfcc=1000).T, axis=0)
  return mfccs_scaled

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_clip(request):
    data = json.loads(request.body.decode('utf-8'))
    clip_id = data.get('id')

    try:
        user_clips = Clip.objects.filter(profile=request.user.profile)
        clip = user_clips.get(clip_id=clip_id)
        if clip.audio:
            clip.audio.delete(save=False)
        clip.delete()
        return Response({"message": "Clip deleted successfully"})
    except ObjectDoesNotExist:
        return Response({"error": "Clip not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def grade_clip(request):
    data=json.loads(request.body.decode('utf-8'))
    id=data.get('id')
    
    user_clips = Clip.objects.filter(profile=request.user.profile)
    clip = user_clips.get(clip_id=id)

    clip_data = preprocess_data(clip.audio.path)
    clip_data = numpy.asarray([clip_data])


    clip.assertiveness = ass_model.predict(clip_data)[0][0]
    #print(clip.assertiveness)
    clip.enthusiasm = ent_model.predict(clip_data)[0][0]
    #print(clip.enthusiasm)
    clip.clairity = cla_model.predict(clip_data)[0][0]
    #print(clip.clairity)
    clip.engagement = eng_model.predict(clip_data)[0][0]
    #print(clip.engagement) 
    clip.rated =True
    print(clip.audio.url)
    clip.save()
    return Response({"message": "grading clip"})

    #return dashboard(request)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_clip(request):
    serializer = ClipSerializer(data = request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Clip uploaded successfully."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Additional URLs for JWT tokens setup should also be included in urls.py


