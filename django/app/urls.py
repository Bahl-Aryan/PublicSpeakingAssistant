from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('', views.dashboard, name='dashboard'),
    path('logout/', views.logout_view, name="logout"),
    path('grade_clip/', views.grade_clip, name='grade_clip'), 
    path('register/fail/', views.register_fail, name='register_fail'),
    path('upload/', views.upload_clip, name='upload'),
    path('upload/clip/', views.upload_clip, name='upload_clip'),
    path('delete_clip/', views.delete_clip, name='delete'),
] +  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

