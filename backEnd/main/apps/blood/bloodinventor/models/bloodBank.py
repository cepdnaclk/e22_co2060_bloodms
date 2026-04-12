from django.db import models
from .....core.locations.location import District,Country

__all__=['BloodBank']

class BloodBank(models.Model):
    bloodBankName=models.CharField(max_length=20)
    postTalCode=models.CharField()
    district=models.ForeignKey(District,on_delete=models.CASCADE,related_name='districts')
    country=models.ForeignKey(Country,on_delete=models.CASCADE,related_name='country')
    registrationId=models.IntegerField(max_length=20)
