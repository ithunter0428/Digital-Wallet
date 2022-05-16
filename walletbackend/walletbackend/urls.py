from django.contrib import admin
from django.urls import path, include
from wallet.views import RegisterUserAPIView, CustomObtainAuthToken, LogoutViewSet

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/register', RegisterUserAPIView.as_view(), name='register'),
    path('auth/login', CustomObtainAuthToken.as_view(), name='login'),
    path('auth/logout', LogoutViewSet.as_view(), name='logout'),
    path('wallet/', include('wallet.urls')),
]
