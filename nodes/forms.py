from django import forms
from nodes.models import Images


class UploadImageForm(forms.ModelForm):
    image = forms.ImageField(required=True)
    caption = forms.CharField(max_length=255, required=False)

    class Meta:
        model = Images
        exclude = ['slug', 'user', 'image_thumbnail', 'time']
        fields = ['image', 'caption']


class SetLogoForm(forms.ModelForm):
    image = forms.ImageField(required=True)
    caption = forms.CharField(max_length=255, required=False)

    class Meta:
        model = Images
        exclude = ['slug', 'user', 'image_thumbnail', 'time']
        fields = ['image', 'caption']


class SetProfileImageForm(forms.ModelForm):
    image = forms.ImageField(required=True)
    caption = forms.CharField(max_length=255, required=False)

    class Meta:
        model = Images
        exclude = ['slug', 'user', 'image_thumbnail', 'time']
        fields = ['image', 'caption']


