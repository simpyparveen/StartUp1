from django.db import models
from industryo.unique_slug import unique_slugify
# from django.template.defaultfilters import slugify


class Segment(models.Model):
    name = models.CharField(max_length=255)
    workplace_type = models.CharField(max_length=1)   # whether LSI, SME or Team
    slug = models.SlugField(max_length=255)

    class Meta:
        db_table = 'Segment'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:                  # Newly created object, so set slug
            slug_str = self.name
            unique_slugify(self, slug_str)
            # self.slug = slugify(self.get_full_name()).__str__()
            super(Segment, self).save(*args, **kwargs)


class Workplace(models.Model):
    name = models.CharField(max_length=255)
    LargeScaleIndustry = 'A'
    SME = 'B'
    SAE_Team = 'C'
    Others = 'O'
    Workplace_Type = (
        (LargeScaleIndustry, 'Large Scale Industry'),
        (SME, 'Small & Medium Scale Enterprise'),
        (SAE_Team, 'College Teams'),
        (Others, 'Others')
    )
    workplace_type = models.CharField(max_length=1, choices=Workplace_Type)
    segments = models.ManyToManyField(Segment, through='SegmentTags')
    verified = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255)

    class Meta:
        db_table = 'Workplace'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:                  # Newly created object, so set slug
            slug_str = self.name
            unique_slugify(self, slug_str)
            # self.slug = slugify(self.get_full_name()).__str__()
            super(Workplace, self).save(*args, **kwargs)


class SegmentTags(models.Model):
    workplace = models.ForeignKey(Workplace)
    segment = models.ForeignKey(Segment)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'SegmentTags'








# Create your models here.
