from datetime import datetime

from django.db import models

# Create your models here.
class user(models.Model):
    uid = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)

class car(models.Model):

    uid = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)

    imageurl = models.CharField(max_length=300)
    brand= models.CharField(max_length=200)
    model = models.CharField(max_length=200)
    year = models.IntegerField(max_length=200)
    kilo = models.IntegerField(max_length=200)
    price = models.IntegerField(max_length=200)

    time = models.DateTimeField(default=datetime.now)