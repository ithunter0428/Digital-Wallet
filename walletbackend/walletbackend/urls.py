from django.contrib import admin
from django.urls import path, include
from wallet.viewsactivity import RegisterUserAPIView, CustomObtainAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register', RegisterUserAPIView.as_view()),
    path('auth/', CustomObtainAuthToken.as_view()),
    path('wallet/', include('wallet.urls')),
]
