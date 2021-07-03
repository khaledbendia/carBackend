from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from main.models import user, car


@csrf_exempt
def createUser(request):
    uid = request.POST['uid']
    username = request.POST['username']
    email = request.POST['email']
    phone = request.POST['phone']

    user.objects.create(uid=uid,username=username,email=email,phone=phone)

    return HttpResponse(uid+" "+username+" "+email+" "+phone)

@csrf_exempt
def getUser(request):
    uid = request.POST['uid']
    available = user.objects.get(uid=uid)
    #data = serializers.serialize('json', available)
    return JsonResponse({'uid':available.uid,'username':available.username,'email':available.email,'phone':available.phone})

@csrf_exempt
def getUsers(request):
    available = user.objects.all()
    data = serializers.serialize('json', available)
    return HttpResponse(data, 'json')

@csrf_exempt
def createCar(request):
    uid = request.POST['uid']
    userObj= user.objects.get(uid=uid)
    phone = userObj.phone

    imageurl = request.POST['imageurl']
    brand = request.POST['brand']
    model = request.POST['model']
    year = request.POST['year']
    kilo = request.POST['kilo']
    price = request.POST['price']


    car.objects.create(uid=uid,phone=phone,imageurl=imageurl,brand=brand,model=model,year=year,kilo=kilo,price=price)

    return HttpResponse(uid)


@csrf_exempt
def getCars(request):
    available = car.objects.all().order_by("-time")
    data = serializers.serialize('json', (available))
    return HttpResponse(data,'json')
@csrf_exempt
def deleteCars(request):
    available = car.objects.filter()
    available.delete()
    return HttpResponse("")
@csrf_exempt
def getCarsFilter(request):

    filterBrand = request.POST['filterBrand']
    filterModel = request.POST['filterModel']

    filterYearDe = request.POST['filterYearDe']
    filterYearA = request.POST['filterYearA']

    filterPriceDe = request.POST['filterPriceDe']
    filterPriceA = request.POST['filterPriceA']

    filterKiloDe = request.POST['filterKiloDe']
    filterKiloA = request.POST['filterKiloA']

    filter ={}
    if(filterBrand != "Tout") :
        filter["brand"] = filterBrand
    if (filterModel != "Tout"):
        filter["model"] = filterModel

    if (filterYearDe != "de"):
        filter["year__gte"] = filterYearDe
    if (filterYearA != "à"):
        filter["year__lte"] = filterYearA

    if (filterPriceDe != "de"):
        filter["price__gte"] = filterPriceDe
    if (filterPriceA != "à"):
        filter["price__lte"] = filterPriceA

    if (filterKiloDe != "de"):
        filter["kilo__gte"] = filterKiloDe
    if (filterKiloA != "à"):
        filter["kilo__lte"] = filterKiloA



    available = car.objects.filter(**filter).order_by("-time")
    data = serializers.serialize('json', list(available))
    return HttpResponse(data, 'json')

