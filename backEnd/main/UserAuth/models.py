from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

__all__=['User','Profile'] #run User class only

class User(AbstractUser):
    username=models.CharField(max_length=10)
    email=models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    fullName=models.CharField(max_length=20)
    bio=models.CharField(max_length=300)
    image=models.ImageField(default='default.jpg',upload_to="user_images")
    verified=models.BooleanField(default=False)

    def __str__(self):
        return self.fullName

    #create user profile
def createUserProfile(sender,instance,created,**kwargs):
    if created:
          Profile.objects.create(user=instance)

        #save user
def saveUser(sender,instance,**kwargs):
    instance.profile.save()

post_save.connect(createUserProfile,sender=User)
post_save.connect(saveUser,sender=User)