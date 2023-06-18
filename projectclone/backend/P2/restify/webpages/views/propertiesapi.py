



from rest_framework.exceptions import ValidationError
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.http import HttpResponseNotAllowed
from rest_framework.generics import RetrieveAPIView, ListAPIView, UpdateAPIView, CreateAPIView, DestroyAPIView
# from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Case, When, Value, IntegerField
import json
from django.http import HttpResponse
from itertools import chain
from django.core.exceptions import PermissionDenied
   

from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.views import Response
from rest_framework_simplejwt.authentication import api_settings, JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from ..models.reservation import Reservation, PropertyRating, GuestRating
from ..models.property import *
from django.shortcuts import get_object_or_404




from webpages.serializers.serializer_user import UserSerializer
from webpages.serializers.serializers_reservation import ReservationSerializer, PropertyRatingSerializer, CreateGuestRatingSerializer, GuestRatingSerializer
from webpages.serializers.serializers_property import PropertySerializer, PropertyImageSerializer, PropertyTimeRangePriceHostOfferSerializer
from webpages.serializers.serializer_rangepriceoffer import RangePriceOfferSerializer

#HOST VIEW


# only triggered on host dashboard /allListings
class ListAllPropertiesAPIView(ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):

        properties = Property.objects.filter(property_owner=self.request.user)

        return properties
    

class CreatePropertiesAPIView(CreateAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):

        # set the property_owner field of serializer to the current user
        serializer.validated_data['property_owner'] = self.request.user
        # print(self.request.GET, 'leo maaaaaaaan')

        # call the super perform_create method to save the reservation instance
        super().perform_create(serializer)

class CreateAvailableDateAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyTimeRangePriceHostOfferSerializer


    
    def perform_create(self, serializer):
        p = get_object_or_404(Property, id=self.kwargs['pk'])
        if p.property_owner != self.request.user:
            raise PermissionDenied()

        # set the property_owner field of serializer to the current user
        serializer.validated_data['property'] = get_object_or_404(Property, id=self.kwargs['pk'])

        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']

        overlap1 = RangePriceHostOffer.objects.filter(property=self.kwargs['pk'],start_date__lte=start_date, end_date__gte=end_date)
        overlap2 = RangePriceHostOffer.objects.filter(property=self.kwargs['pk'],start_date__gte=start_date, start_date__lte=end_date)
        overlap3 = RangePriceHostOffer.objects.filter(property=self.kwargs['pk'],end_date__gte=start_date, end_date__lte=end_date)
        overlap4 = RangePriceHostOffer.objects.filter(property=self.kwargs['pk'],start_date__gte=start_date, end_date__lte=end_date)

        # overlap3 = RangePriceHostOffer.objects.filter(start_date__gte=end_date, end_date__lte=end_date,
        #                                    start_date__gte=start_date, end_date__lte=start_date) # causing an error 

        # call the super perform_create method to save the reservation instance
        if overlap1: 
            raise ValidationError('This time range overlaps with an existing range')
        if overlap2:
            raise ValidationError('This time range overlaps with an existing range')
        if overlap3:
            raise ValidationError('This time range overlaps with an existing range')
        if overlap4:
            raise ValidationError('This time range overlaps with an existing range')
        else: 
            return super().perform_create(serializer)
    
    
# class ImagePropertiesAPIView(CreateAPIView):
#     serializer_class = PropertyImageSerializer

# class AvailableDatePropertiesAPIView(CreateAPIView):
#     serializer_class = PropertyAvailableDateSerializer

# class PricePropertiesAPIView(CreateAPIView):
#     serializer_class = PropertyAskingPriceSerializer
    
class DeletePropertiesAPIView(DestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        p = get_object_or_404(Property, id=self.kwargs['pk'])
        if p.property_owner != self.request.user:
            raise PermissionDenied()
        return get_object_or_404(Property, id=self.kwargs['pk'])

    
class EditPropertiesAPIView(RetrieveAPIView, UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        p = get_object_or_404(Property, id=self.kwargs['pk'])
        if p.property_owner != self.request.user:
            raise PermissionDenied()
        return get_object_or_404(Property, id=self.kwargs['pk'])
    
class DetailPropertiesAPIView(RetrieveAPIView, UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]
    # image = get_object_or_404(Property, id=self.kwargs['pk']).PropertyImage_set.all()
    # available = get_object_or_404(Property, id=self.kwargs['pk']).AvailableDate_set.all()
    # price = get_object_or_404(Property, id=self.kwargs['pk']).AskingPrice_set.all()
    def get_object(self):
        return get_object_or_404(Property, id=self.kwargs['pk'])
    

class OrderPropertyView(ListAPIView):
    queryset = Property.objects.all()

    serializer_class = PropertySerializer
    pagination_class = PageNumberPagination
    page_size = 10
    
    filter_backends = [OrderingFilter]
    ordering_fields = ["baths"]

    def get_queryset(self):


        properties = json.loads(self.request.body)

        # get the ids of all the properties 
        props_ids = []
        for i in range(len(properties)):
            props_ids.append(properties[i]['property'])

        # get all the relevant properties through which I need to filter using the query params
        relevant_properties = Property.objects.filter(id__in=props_ids).distinct()


        return relevant_properties 
    

class OrderPropertyPriceView(ListAPIView):
    queryset = Property.objects.all()

    serializer_class = PropertySerializer
    pagination_class = PageNumberPagination
    page_size = 10
    


    def get_queryset(self):
        

        properties = json.loads(self.request.body)
        price = self.request.query_params.get('ordering')
        


        # get the ids of all the properties 
        available_ids = []
        for i in range(len(properties)):
            available_ids.append(properties[i]['id'])

        # get all the relevant properties through which I need to filter using the query params
     
        available_date= RangePriceHostOffer.objects.filter(id__in=available_ids).distinct().order_by('price_per_night')
        if price:
            if price == "-price_per_night":
                available_date= RangePriceHostOffer.objects.filter(id__in=available_ids).distinct().order_by('-price_per_night')
        p_id = []
        for a in available_date:
            p_id.append(a.property.id)

        q = Property.objects.filter(id__in=p_id)


        q = q.order_by(Case(*[When(id=p_id[i], then=Value(i)) for i in range(len(p_id))],
            output_field=IntegerField()
        ))

        return q



class SearchPropertyView(ListAPIView):
    queryset = Property.objects.all()
    serializer_class = RangePriceOfferSerializer
    # filter_backends = [SearchFilter]
    # search_fields = ['=address', "number_of_guest"]

    permission_classes = [AllowAny]
    

    def get_queryset(self):
        # data = self.request.data
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        location = self.request.query_params.get('location')
        number_of_guest = self.request.query_params.get('number_of_guest')
        print(start_date)

        # searching thru a foreignkey
        queryset = Property.objects.filter(property_for_available_date__start_date__lte=start_date,
                                           property_for_available_date__end_date__gte=end_date,
                                           address__icontains=location,
                                           number_of_guest__gte=number_of_guest)
        
        # props_id = []
        # for property in queryset.distinct():
        #     props_id.append(property.pk)
        # print(props_id, 'these are the props id ')
        
        query_set2 = RangePriceHostOffer.objects.filter(property__in=queryset, start_date__lte=start_date, end_date__gte=end_date)
        # print(query_set2, 'this is the queryset of rangepricehostoffer')
        # query_set3 = query_set2.filter(start_date__gte=start_date, end_date__lte=end_date)
        
        return query_set2.distinct()

class FilterPropertyView(ListAPIView):
    queryset = Property.objects.all()
    serializer_class = RangePriceOfferSerializer

    # filter_backends = [SearchFilter]
    # search_fields = ['=address', "number_of_guest"]
    permission_classes = [AllowAny]

    def get_queryset(self):
        # data = self.request.data

        # get all query parameters
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        address = self.request.query_params.get('address')
        number_of_guest = self.request.query_params.get('number_of_guest')
        properties = Property.objects.filter(property_for_available_date__start_date__lte=start_date,
                                           property_for_available_date__end_date__gte=end_date,
                                           address__icontains=address,
                                           number_of_guest__gte=number_of_guest)
        properties = RangePriceHostOffer.objects.filter(property__in=properties, start_date__lte=start_date, end_date__gte=end_date)
        price_per_night = self.request.query_params.get('price_per_night')
        number_of_rooms = self.request.query_params.get('number_of_rooms')
        number_of_bed = self.request.query_params.get('number_of_bed')
        baths = self.request.query_params.get('baths')
        essentials = self.request.query_params.get('essentials')
        features = self.request.query_params.get('features')
        safety_features = self.request.query_params.get('safety_features')
        location = self.request.query_params.get('location')

        from django.core import serializers
        properties = serializers.serialize('json', properties)
        properties = json.loads(properties)
        print(type(properties))
        # get the ids of all the properties 
        props_ids = []
        if price_per_night:
            for i in range(len(properties)):
                if properties[i]['fields']['price_per_night'] <= int(price_per_night):
                    props_ids.append(properties[i]['fields']['property'])

        else:
            for i in range(len(properties)):
                props_ids.append(properties[i]['fields']['property'])
        
        print(props_ids)
  
 

        # get all the relevant properties through which I need to filter using the query params
      
        relevant_properties = Property.objects.filter(id__in=props_ids).distinct()

        # do the filtering 
        if number_of_rooms:
            relevant_properties = relevant_properties.filter(number_of_rooms__gte=number_of_rooms)
        if number_of_bed:
            relevant_properties = relevant_properties.filter(number_of_bed__gte=number_of_bed)
        if baths:
            relevant_properties = relevant_properties.filter(baths__gte=baths)
        if essentials:
            for e in essentials.split(","):
                relevant_properties = relevant_properties.filter(essentials__contains=e)
        if features:
            for e in features.split(","):
                relevant_properties = relevant_properties.filter(features__contains=e)
        if safety_features:
            for e in safety_features.split(","):
                relevant_properties = relevant_properties.filter(safety_features__contains=e)
        
        if location:
            for e in location.split(","):
                relevant_properties = relevant_properties.filter(location__contains=e)


        

        # print(query_set2, 'this is the queryset of rangepricehostoffer')
        # query_set3 = query_set2.filter(start_date__gte=start_date, end_date__lte=end_date)
        
        query_set2 = RangePriceHostOffer.objects.filter(property__in=relevant_properties, start_date__lte=start_date, end_date__gte=end_date)
        # print(query_set2, 'this is the queryset of rangepricehostoffer')
        # query_set3 = query_set2.filter(start_date__gte=start_date, end_date__lte=end_date)
        
        return query_set2.distinct()




class DeleteAvailableDateAPIView(DestroyAPIView):
    serializer_class = PropertyTimeRangePriceHostOfferSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        ava = get_object_or_404(RangePriceHostOffer, id=self.kwargs['pk'])
        p = get_object_or_404(Property, id=ava.property.id)
        if p.property_owner != self.request.user:
            raise PermissionDenied()


        return get_object_or_404(RangePriceHostOffer, id=self.kwargs['pk'])

class EditAvailableDateAPIView(RetrieveAPIView, UpdateAPIView):
    serializer_class = PropertyTimeRangePriceHostOfferSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        ava = get_object_or_404(RangePriceHostOffer, id=self.kwargs['pk'])
        p = get_object_or_404(Property, id=ava.property.id)
        if p.property_owner != self.request.user:
            raise PermissionDenied()

        return get_object_or_404(RangePriceHostOffer, id=self.kwargs['pk'])
    

class AddPictureAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyImageSerializer
    
    def perform_create(self, serializer):
     
        p = get_object_or_404(Property, id=self.kwargs['pk'])
        if p.property_owner != self.request.user:
            raise PermissionDenied()

        

        # set the property_owner field of serializer to the current user
        serializer.validated_data['property'] = get_object_or_404(Property, id=self.kwargs['pk'])

        # call the super perform_create method to save the reservation instance
        super().perform_create(serializer)

class DeletePictureAPIView(DestroyAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        ava = get_object_or_404(PropertyImage, id=self.kwargs['pk'])
        p = get_object_or_404(Property, id=ava.property.id)
        if p.property_owner != self.request.user:
            raise PermissionDenied()
        return get_object_or_404(PropertyImage, id=self.kwargs['pk'])
    


class DetailImageAPIView(RetrieveAPIView, UpdateAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [AllowAny]


    def get_object(self):
        return get_object_or_404(PropertyImage, id=self.kwargs['pk'])
    


    
class DetailRangePriceHostOfferAPIView(RetrieveAPIView, UpdateAPIView):
    serializer_class = PropertyTimeRangePriceHostOfferSerializer


    def get_object(self):
        return get_object_or_404(RangePriceHostOffer, id=self.kwargs['pk'])
    

class ListAllAvailableDatesAPIView(ListAPIView):
    serializer_class = PropertyTimeRangePriceHostOfferSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):


        return RangePriceHostOffer.objects.filter(property=self.kwargs['pk'])
    
class ListAllImageAPIView(ListAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        return PropertyImage.objects.filter(property=self.kwargs['pk'])
    



class AddRatingAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyRatingSerializer
    
    def perform_create(self, serializer):
        reservation_id = self.kwargs['res']
        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            raise ValidationError('404 NOT FOUND: Reservation not found')
        
        if reservation.status != 'CO' and reservation.status != 'TE':
            raise ValidationError('HTTP 401 UNAUTHORIZED: Reservation not complete/terminated')

        if reservation.user != self.request.user:
            raise ValidationError('HTTP 403 FORBIDDEN: Not the user of the reservation')
        
        # set the property_owner field of serializer to the current user
        serializer.validated_data['property'] = get_object_or_404(Property, id=self.kwargs['pk'])
        serializer.validated_data['reservation'] = get_object_or_404(Reservation, id=self.kwargs['res'])
        serializer.validated_data['user'] = self.request.user
        # call the super perform_create method to save the reservation instance
        super().perform_create(serializer)
class ListRatingAPIView(ListAPIView):
    serializer_class = PropertyRatingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        return PropertyRating.objects.filter(property=self.kwargs['pk'])
    
class ListRatingByResAPIView(ListAPIView):
    serializer_class = PropertyRatingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        return PropertyRating.objects.filter(reservation=self.kwargs['res'])
    


class AddGuestRatingAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateGuestRatingSerializer
    
    def perform_create(self, serializer):
        reservation_id = self.kwargs['reservation_id']
        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            raise ValidationError('404 NOT FOUND: Reservation not found')
        
        if reservation.status != 'CO':
            raise ValidationError('HTTP 401 UNAUTHORIZED: Reservation not complete')

        reservation_host = reservation.property.property_owner
        reservation_user = reservation.user

        if reservation_host != self.request.user:
            raise ValidationError('HTTP 403 FORBIDDEN: Not the host of the reservation')
        
        serializer.validated_data['reservation'] = reservation
        serializer.validated_data['host_rater'] = self.request.user
        serializer.validated_data['user'] = reservation_user

        super().perform_create(serializer)

class GetAllGuestRatings(ListAPIView):
    serializer_class = GuestRatingSerializer
    pagination_class = PageNumberPagination
    default_page_size = 5

    def get_queryset(self):
        user_id = self.request.user.id
        try:
            user = RestifyUser.objects.get(id=user_id)
        except RestifyUser.DoesNotExist:
            raise ValidationError('You are not a person')
    
        guest_id = self.kwargs['guest_id']
        guest = get_object_or_404(RestifyUser, id=guest_id)
        return GuestRating.objects.filter(user=guest)
    
    # this gets the data with pagination 
    def get(self, request, *args, **kwargs):
        page_size = request.query_params.get('page_size', None)
        if page_size:
            self.pagination_class.page_size = int(page_size)
        else:
            self.pagination_class.page_size = self.default_page_size
        self.pagination_class.page_size_query_param = 'page_size'
        return self.list(request, *args, **kwargs)

    # this function will list just the data, not the whole object from pagination
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data)