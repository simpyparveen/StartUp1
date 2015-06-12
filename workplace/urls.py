from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',

    # url(r'^accounts/', include('allauth.urls')),
    # url(r'^$', 'home.views.home', name='home'),

    #url(r'^set_segment/$', 'workplace.views.set_segment', name='set_segment'),
    # url(r'^set_materials/$', 'workplaceprofile.views.set_materials', name='set_materials'),
    # url(r'^set_operations/$', 'workplaceprofile.views.set_operations', name='set_operations'),
    # url(r'^set_assets/$', 'workplaceprofile.views.set_assets', name='set_assets'),

    url(r'^set_about/$', 'workplace.views.set_about', name='set_about'),
    url(r'^set_tags/$', 'workplace.views.set_tags', name='set_tags'),
    url(r'^set_capabilities/$', 'workplace.views.set_capabilities', name='set_capabilities'),
    url(r'^set_product_details/$', 'workplace.views.set_product_details', name='set_product_details'),
    url(r'^(?P<slug>[^/]+)/$', 'workplace.views.workplace_profile', name='workplace_profile'),

)
