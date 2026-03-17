

from django.db import models

__all__=['Country', 'District']


class Country (models.Model):
    countryName=models.CharField(max_length=20,null=False)

    def __str__(self):
        return self.countryName

class District (models.Model):
    districtName=models.CharField(max_length=20)
    country=models.ForeignKey(Country,on_delete=models.CASCADE,related_name='district')

    class Meta:
        unique_together= 'districtName','country'

    def __str__(self):
        return self.districtName,self.country