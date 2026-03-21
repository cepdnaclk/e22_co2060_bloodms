from django.db import models

from .location import Country, District

__all__ = ['Hospital']


class Hospital(models.Model):
    hosName = models.CharField(max_length=30)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(
        District,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    # Store coordinates as separate fields instead of PointField
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    osm_place_id = models.BigIntegerField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.hosName

    class Meta:
        verbose_name_plural = "Hospitals"
