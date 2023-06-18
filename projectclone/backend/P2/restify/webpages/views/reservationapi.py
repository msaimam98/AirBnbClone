from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework.generics import RetrieveAPIView, ListAPIView, UpdateAPIView
# from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from webpages.models.comment import PropertyComment
from django.contrib.contenttypes.models import ContentType
from rest_framework import status
from django.db.models import Q
from functools import reduce
from django.db.models import Count


    
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.views import Response
from rest_framework_simplejwt.authentication import api_settings, JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse


from ..models.reservation import Reservation
from ..models.property import Property, RangePriceHostOffer
from ..models.user_history import UserHistory
from webpages.serializers.serializer_user import UserSerializer, UserHistorySerializer
from webpages.serializers.serializers_reservation import ReservationSerializer, ReservationSerializerAdd, ReservationRequestSerializer, ReservationReqSerializer
from webpages.serializers.serializers_property import PropertySerializer
from ..models.user import RestifyUser

# add a reservation - note: there has to be a property to tie it to 
class CreateReservationAPIView(CreateAPIView):
    # takes only post request
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):

        # get property_id from url
        property_id = self.kwargs['property_id']
        # get property instance with property_id
        property = get_object_or_404(Property, id=property_id)

        # take all the available dates out of the property we at hand 
        all_available_dates = RangePriceHostOffer.objects.filter(property=property)

        # get all the queryparams
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        # start_date = argss['start_date']
        # end_date = argss['end_date']
        # number_of_guests = self.request.query_params.get('number_of_guests')

        # first check if the start_date and end_date are even within any of the Property's available dates
        # here we are finding the possible available date objects 
        # this should be only 1 
        valid_available_date = all_available_dates.filter(start_date__lte=start_date, end_date__gte=start_date)
        print('this should only be one', valid_available_date, 'this should only be one')

        # check if there is even an available date 
        if valid_available_date: 
            valid_available_date = valid_available_date.filter(start_date__lte=end_date, end_date__gte=end_date)
 

        # start_date_for_availDate = valid_available_date[0].start_date
        # end_date_for_availDate = valid_available_date[0].end_date

        # # check if this available date has a reservation attached to it, if not, attach this to the reservation
        # booked_already = Reservation.objects.filter(date_this_reservation_is_booked_for__start_date=start_date_for_availDate,
        # date_this_reservation_is_booked_for__end_date=end_date_for_availDate)
        try:
            booked_already = Reservation.objects.filter(available_date=valid_available_date[0])
        except:
            return HttpResponse(status=405)

    
        # check if the valid available date that we can book for is already booked by someone else 
        if booked_already:
            return HttpResponse(status=405)
        else:

            # set the property field of serializer to the retrieved property instance
            serializer.validated_data['property'] = property

            # print(valid_available_date)

            serializer.validated_data['available_date'] = valid_available_date[0]
            
            serializer.validated_data['available_date'].booked_for = True # nobody can now book this time till 
            serializer.validated_data['available_date'].save()
            
            print(serializer.validated_data['available_date'].booked_for, 'this is the value')
            print(valid_available_date[0].booked_for, 'this is the best')


            # set the user field of serializer to the current user
            serializer.validated_data['user'] = self.request.user
            serializer.validated_data['user'].save()

            serializer.save() 



        

        return super().perform_create(serializer) 

    



# list all of the current users existing approved reservations - approved tab done
class ListAllReservationsAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]

    # we are returning a collection of Property objects therefore we need a property serializer
    serializer_class = ReservationSerializer
    pagination_class = PageNumberPagination
    # page_size = 10
    default_page_size = 5

    def get_queryset(self):

        # takes out all the reservations that are approved 
        reservations = Reservation.objects.filter(user=self.request.user, status='AP')

        return reservations

        # prop_ids = []
        # for reservation in reservations:
        #     prop_ids.append(reservation.property.pk)
        
        # print(prop_ids, 'these are all the PROPERTY ids bruh yo what ')

        # # create a list of Q objects to filter the properties by their IDs
        # # q_list = [Q(id=id) for id in prop_ids]
        
        # # use the reduce function to combine the Q objects with OR logic
        # # q = reduce(lambda a, b: a | b, q_list)

        # # print(Property.objects.filter(q), 'bro hold up ')

        # # returns all the properties that have an approved reservation on them 
        # return Property.objects.filter(id__in=prop_ids)
        # # prop_hey = Property.objects.filter(id=1)
        # # print(prop_hey.annotate(num_reservations=Count('reservation_property')), 'yo what')
        # # print(properties.annotate(num_reservations=Count('reservation_property')), 'yo what')
        # # return properties.annotate(num_reservations=Count('reservation_property'))


# user: requested, host: cancellations 
class RequestToTerminateReservationAPIView(UpdateAPIView): # user:request to cancel ~ host: terminate tab done 
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "CR" # then goes to CA
        serializer.save()







class ListAllRequestedReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5

    # need to get all properties with status=
    def get_queryset(self):

        # takes out all the reservations that are requested for approval 
        reservations = Reservation.objects.filter(user=self.request.user, status='AR')
        # reservations2 = Reservation.objects.filter(user=self.request.user, status='CR')

        # reservations = reservations.union(reservations2)

        return reservations
        # prop_ids = []
        # for reservation in reservations:
        #     prop_ids.append(reservation.property.pk)
        
        # # returns all the properties that have an approved reservation on them 
        # return Property.objects.filter(id__in=prop_ids).distinct()






# only have access to this view from the user's request tab 
# user: terminated tab, host: terminated tab 
class TerminateReservationAPIView(UpdateAPIView): # terminated tab done 
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "TE"
        reservation.available_date.booked_for = False
        reservation.available_date.save()
        reservation.available_date = None
        serializer.save()

class CancelReservationAPIView(UpdateAPIView): # terminated tab done 
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "CA"
        reservation.available_date.booked_for = False
        reservation.available_date.save()
        reservation.available_date = None
        serializer.save()







# all user cancellations 

class ListAllCancelledReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5
    

    # need to get all properties with status=
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(user=self.request.user, status="CA")
        return reservations
    
    
# user: terminated tab, host: terminated tab 
class ReasonForCancellingAPIView(UpdateAPIView): # terminated tab done 
    
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pk_url_kwarg = 'reservation_id'

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        # hard coding the reason for cancelling at the moment, will use react to import modal message here
        reservation.reason_for_cancelling = 'I really did not want to but something came up'
        serializer.save()

    def update(self, request, *args, **kwargs):
        # update your shit 
        response = super().update(request, *args, **kwargs)
        # need a url here that will trigger a notification to the property_owner that the user who cancelled has left a reason for cancelling
        reservation = Reservation.objects.get(pk=self.kwargs['reservation_id'])

        # REPLACE THE 'url to trigger view' WITH THE VIEW TO TRIGGER NOTIF URL
        response['url_to_redirect_to'] = ['url to trigger view', reservation.reason_for_cancelling]
        return response
    
















# added a cronjob to make the status of each reservation to "CO" as soon as the time passes

# get all reservations that are completed 
class ListAllCompletedReservationsAPIView(ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5

    # need to get all properties with status="CO"
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(user=self.request.user, status='CO')
        prop_ids = []
        for reservation in reservations:
            prop_ids.append(reservation.property.pk)
        
        # returns all the properties that have an approved reservation on them 
        return Property.objects.filter(id__in=prop_ids)
    
class ListAllCompletedReservations2APIView(ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    # need to get all properties with status="CO"
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(user=self.request.user, status='CO')
        prop_ids = []
        for reservation in reservations:
            prop_ids.append(reservation.property.pk)
        
        # returns all the properties that have an approved reservation on them 
        return Property.objects.filter(id__in=prop_ids)

    

    
# for the "leave review for host" button when the reservation is completed or terminated
class ReviewForHostAPIView(UpdateAPIView):  
    
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pk_url_kwarg = 'reservation_id'

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        # hard coding the reason for cancelling at the moment, will use react to import modal message here
        comment = PropertyComment()
        print(serializer.validated_data, 'yooooo')
        comment.content = "This host was wonderful! 10/10 would come again!"
        reservation.content_type = ContentType.objects.get_for_model(comment)
        serializer.save()

    def update(self, request, *args, **kwargs):
        # update your shit 
        response = super().update(request, *args, **kwargs)
        # need a url here that will trigger a notification to the property_owner that the user who cancelled has left a reason for cancelling
        reservation = Reservation.objects.get(pk=self.kwargs['reservation_id'])

        # REPLACE THE 'url to trigger view' WITH THE VIEW TO TRIGGER NOTIF URL
        url = "reservations/" + str(self.kwargs['reservation_id']) + "/property-comments/add/"
        response['url_to_redirect_to'] = [url, reservation.content_type]
        return response
    


# list all terminated reservations --> host: terminated, user: terminated 
class ListAllTerminatedReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5

    # need to get all properties with status="CO"
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(user=self.request.user, status='TE')
        return reservations
    
class ListAllTerminatedReservations2APIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    # need to get all properties with status="CO"
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(user=self.request.user, status='TE')
        return reservations
    
# HOST VIEWS
# -------------------------------------------------------------------------------------------------------------------




# REQUEST TAB
class HostListAllRequestedReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5

    def get_queryset(self):
        # get all reservations that have status="AR"
        reservations = Reservation.objects.filter(status="AR", property__property_owner=self.request.user).order_by('-id')
        return reservations
    

class GetAllRequestedReservations(ListAPIView):
    serializer_class = ReservationRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # get all reservations that have status="AR"
        # reservations = Reservation.objects.filter(status="AR", property__property_owner=self.request.user).order_by('-id')
        reservation = Reservation.objects.filter(id=self.kwargs['reservation_id'])
        return reservation


class ApproveReservationAPIView(UpdateAPIView): # attach to green approve button
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "AP" # change to this from 'AR'
        serializer.save()

class DenyReservationAPIView(UpdateAPIView): # attach to red deny button
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "DE" # change to this from 'AR' to denied(DE)
        reservation.available_date.booked_for = False
        reservation.available_date.save()
        reservation.available_date = None
        serializer.save()



# APPROVED TAB (terminate functionality and all approved)

class HostListAllOfApprovedReservationsAPIView(ListAPIView):

    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5

    def get_queryset(self):
        # get all reservations that have status="AR"
        reservations = Reservation.objects.filter(status="AP",  property__property_owner=self.request.user)
        return reservations
        # prop_ids = []
        # # get all the property_ids that correspond to these reservations
        # for reservation in reservations:
        #     prop_ids.append(reservation.property.pk)

        # # then get properties which have these ids AND for which the loggedin user is the property_owner
        # properties_i_own = Property.objects.filter(id__in=prop_ids, property_owner=self.request.user)


        # return properties_i_own

# already implemented above 
# class TerminateReservationAPIView(UpdateAPIView): 
    
#     serializer_class = ReservationSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
#         return reservation
    
#     def perform_update(self, serializer):
#         reservation = serializer.save()
#         reservation.status = "TE"
#         serializer.save()
    






# CANCELLATION TAB


class HostListAllCancelledReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5
    

    # need to get all properties with status=
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(status='CR', property__property_owner=self.request.user)
        return reservations
        # prop_ids = []
        # for reservation in reservations:
        #     prop_ids.append(reservation.property.pk)
        
        # # returns all the properties that have an approved reservation on them 
        # return Property.objects.filter(id__in=prop_ids, property_owner=self.request.user)
    
class HostApproveCancellationRequestAPIView(UpdateAPIView): # attach to green approve button on cancellation host page
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "CA" # change to this from 'CR'
        reservation.available_date.booked_for = False
        reservation.available_date.save()
        # RangePriceHostOffer.objects.filter()
        reservation.available_date = None
        serializer.save()

class HostDenyCancellationRequestAPIView(UpdateAPIView): # attach to red deny button on cancellation host page
    
    serializer_class = ReservationReqSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        reservation.status = "AP" # change to this from 'CR'
        serializer.save()



# HOST COMPLETED PAGE 

class HostListAllCompletedReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5

    # need to get all properties with status="CO"
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(status='CO',  property__property_owner=self.request.user)
        return reservations

class CreateReviewForGuestAPIView(CreateAPIView):  
    
    serializer_class = UserHistorySerializer
    permission_classes = [IsAuthenticated]
    pk_url_kwarg = 'reservation_id'

    # def get_object(self):
    #     reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
    #     return reservation

    def perform_create(self, serializer):
        # reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        reservation_id = self.kwargs['reservation_id']
        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            raise ValidationError('404 NOT FOUND: Reservation not found')
        
        reservation_host = reservation.property.property_owner
        reservation_user = reservation.user

        if self.request.user != reservation_host:
            raise ValidationError('HTTP 403 FORBIDDEN: Not the host reservation')
        
        all_reso = UserHistory.objects.filter(reservation=self.kwargs['reservation_id'])
        if all_reso:
            raise ValidationError('Comment for this guest in the reservation already exists')
        if reservation.status != 'CO':
            raise ValidationError('HTTP 401 UNAUTHORIZED: Reservation not complete')
        
        serializer.validated_data['user'] = reservation_user
        serializer.validated_data['host'] = reservation_host
        serializer.validated_data['reservation'] = reservation

        # serializer.validated_data['comment_for_this_reservation'] = reservation
        # serializer.validated_data['comment_for_this_user'] = user1

        return super().perform_create(serializer)

class GetUserHistoryAPIView(ListAPIView):
    serializer_class = UserHistorySerializer
    permission_classes = [IsAuthenticated]
    pk_url_kwarg = 'user_id'

    def get_queryset(self):
        try:
            user = RestifyUser.objects.get(id=self.kwargs['user_id'])
        except RestifyUser.DoesNotExist:
            raise ValidationError('This is not a person')
        # histories = get_object_or_404(UserHistory, pk=self.kwargs['user_id'])
        histories = UserHistory.objects.filter(user=self.kwargs['user_id'])
        return histories
    
    # def perform_update(self, serializer):
    #     reservation = serializer.save()
    #     # hard coding the reason for cancelling at the moment, will use react to import modal message here
    #     comment = PropertyComment()
    #     comment.content = "This user was wonderful! 10/10 would come again!"
    #     reservation.content_type = ContentType.objects.get_for_model(comment)
    #     serializer.save()

    # def update(self, request, *args, **kwargs):
    #     # update your shit 
    #     response = super().update(request, *args, **kwargs)
    #     # need a url here that will trigger a notification to the property_owner that the user who cancelled has left a reason for cancelling
    #     reservation = Reservation.objects.get(pk=self.kwargs['reservation_id'])

    #     # REPLACE THE 'url to trigger view' WITH THE VIEW TO TRIGGER NOTIF URL
    #     response['url_to_redirect_to'] = ['url to trigger view', reservation.content_type]
    #     return response
        # this review for guest goes into history button on hosts requests tab 

class GetHostWrittenReviews(ListAPIView):
    serializer_class = UserHistorySerializer
    permission_classes = [IsAuthenticated]
    pk_url_kwarg = 'user_id'

    def get_queryset(self):
        try:
            user = RestifyUser.objects.get(id=self.request.user.id)
        except RestifyUser.DoesNotExist:
            raise ValidationError('This is not a person')
        
        # histories = get_object_or_404(UserHistory, pk=self.kwargs['user_id'])
        histories = UserHistory.objects.filter(host=user)
        return histories
    

# HOST TERMINATIONS 

class HostListAllTerminatedReservationsAPIView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    default_page_size = 5
    
    # need to get all properties with status="CO"
    def get_queryset(self):

        # takes out all the reservations that are cancelled
        reservations = Reservation.objects.filter(status='TE',  property__property_owner=self.request.user)
        return reservations
        # prop_ids = []
        # for reservation in reservations:
        #     prop_ids.append(reservation.property.pk)
        
        # # returns all the properties that have an approved reservation on them 
        # return Property.objects.filter(id__in=prop_ids, property_owner=self.request.user)
    

class ReasonForTerminatingAPIView(UpdateAPIView):  
    
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pk_url_kwarg = 'reservation_id'

    def get_object(self):
        reservation = get_object_or_404(Reservation, pk=self.kwargs['reservation_id'])
        return reservation
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        # hard coding the reason for cancelling at the moment, will use react to import modal message here
        comment = PropertyComment()
        comment.content = "This user seemed very sus to me"
        reservation.content_type = ContentType.objects.get_for_model(comment)
        serializer.save()

    def update(self, request, *args, **kwargs):
        # update your shit 
        response = super().update(request, *args, **kwargs)
        # need a url here that will trigger a notification to the property_owner that the user who cancelled has left a reason for cancelling
        reservation = Reservation.objects.get(pk=self.kwargs['reservation_id'])

        # REPLACE THE 'url to trigger view' WITH THE VIEW TO TRIGGER NOTIF URL
        response['url_to_redirect_to'] = ['url to trigger view', reservation.content_type]
        return response
        # from here I need to send the reason for terminating as a notification 
    
    

    

    













    





    

          














