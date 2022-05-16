from django.urls import path, include
from .viewsactivity import UserViewSet, LogoutViewSet

urlpatterns = [
    path('user', UserViewSet.as_view()),
    path('logout', LogoutViewSet.as_view()),
    path('crypto/', include('crypto.urls')),
    path('fiat/', include('fiat.urls')),
]