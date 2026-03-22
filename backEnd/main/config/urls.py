from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.v1.urls')),
]

urlpatterns += static('static/', document_root='static')
urlpatterns += static('media/', document_root='media')
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': 'media'}),
]
