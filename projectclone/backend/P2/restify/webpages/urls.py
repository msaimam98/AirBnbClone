


from django.contrib import admin
from django.urls import path, include
from .views import accountsapi
from rest_framework_simplejwt.views import TokenObtainPairView
from .views.accountsapi import LoginAPIView, UserProfileEditAPIView, UserProfileAPIView, SignupAPIView, LogoutAPIView
from .views.reservationapi import ListAllReservationsAPIView, CreateReservationAPIView, RequestToTerminateReservationAPIView, TerminateReservationAPIView, ListAllRequestedReservationsAPIView, ListAllCancelledReservationsAPIView, ReasonForCancellingAPIView, ListAllCompletedReservationsAPIView, ReviewForHostAPIView, ListAllTerminatedReservationsAPIView, HostListAllRequestedReservationsAPIView, CancelReservationAPIView, GetAllRequestedReservations, ListAllTerminatedReservations2APIView, ListAllCompletedReservations2APIView
from .views.reservationapi import ApproveReservationAPIView, HostListAllOfApprovedReservationsAPIView, HostListAllCancelledReservationsAPIView, HostDenyCancellationRequestAPIView, HostApproveCancellationRequestAPIView, HostListAllCompletedReservationsAPIView, CreateReviewForGuestAPIView, HostListAllTerminatedReservationsAPIView, ReasonForTerminatingAPIView, DenyReservationAPIView, GetUserHistoryAPIView, GetHostWrittenReviews
from .views.propertiesapi import ListAllPropertiesAPIView, DetailPropertiesAPIView, EditPropertiesAPIView, DeletePropertiesAPIView, CreatePropertiesAPIView, ListRatingAPIView, AddRatingAPIView, ListRatingByResAPIView, GetAllGuestRatings, AddGuestRatingAPIView
from .views.commentsapi import GetAllReservationPropertyComments, CreatePropertyCommentAPIView, GetAllPropertyComments, CreateGuestCommentAPIView, GetAllReservationGuestComments, GetAllGuestComments
from .views.notificationsapi import CreateNotificationAPIView, GetAllUserNotifications, ViewUserNotification, ClearUserNotification, GetAllNewNotifications, GetPositionNotifications, CreateHostCommentNotificationAPIView
from .views.propertiesapi import *
from .views.commentsapi import GetAllPropertyComments, CreatePropertyCommentAPIView

# format of spacing 
# getter
# take care of all buttons 

app_name = 'webpages'
urlpatterns = [
    # LEOS CODE 
    path('property/<int:pk>/detail/', DetailPropertiesAPIView.as_view(), name='property_detail'), # works11
 
    path('property/<int:pk>/edit/', EditPropertiesAPIView.as_view(), name='property_edit'), # works11
    path('property/<int:pk>/delete/', DeletePropertiesAPIView.as_view(), name='property_delete'), # works11


    path('property/search/', SearchPropertyView.as_view(), name='property_search'), # works11
    path('property/filter/', FilterPropertyView.as_view(), name='property_filter'), # works11
    path('property/order/', OrderPropertyView.as_view(), name='property_order'), # works11
    path('property/price_order/', OrderPropertyPriceView.as_view(), name='property_price_order'), # works11
    path('<int:pk>/create_timerange_price/', CreateAvailableDateAPIView.as_view(), name='create_timerange_price'), # works11 --> pk is property_id

    path('available_date/<int:pk>/edit/', EditAvailableDateAPIView.as_view(), name='property_edit'), # works11 --> pk is rangepricehostoffer.pk
    path('available_date/<int:pk>/delete/', DeleteAvailableDateAPIView.as_view(), name='property_delete'), # works11 --> pk is rangepricehostoffer.pk
    path('picture/<int:pk>/add/', AddPictureAPIView.as_view(), name='add_picture'), # works11 --> pk is property_id

    path('picture/<int:pk>/delete/', DeletePictureAPIView.as_view(), name='delete_picture'), # works11 --> pk is propertyImage pk
    path('picture/<int:pk>/detail/', DetailImageAPIView.as_view(), name='view_picture'), # works11 --> pk is PropertyImage pk
    path('available_date/<int:pk>/detail/', DetailRangePriceHostOfferAPIView.as_view(), name='property_image'), # works11
    path('available_date/<int:pk>/list/', ListAllAvailableDatesAPIView.as_view(), name='list_avaiable'), # works11 --> pk is property_id
    path('picture/<int:pk>/list/', ListAllImageAPIView.as_view(), name='list_images'), # works11 --> pk is property_id

    path('rating/<int:pk>/list/', ListRatingAPIView.as_view(), name='list_rating'), # works11 --> pk is property_id
    path('rating/<int:pk>/<int:res>/add/', AddRatingAPIView.as_view(), name='add_rating'), # works11 --> pk is property_id
    
    path('rating/<int:res>/list_by_reservation/', ListRatingByResAPIView.as_view(), name='list_rating_by_res'), # works11 --> pk is property_id
    # MUSTAFAS CODE 
    path('admin/', admin.site.urls), #works11
    path('properties/all/', ListAllPropertiesAPIView.as_view(), name='list_all_properties_host'), # works11
    path('property/add/', CreatePropertiesAPIView.as_view(), name="add_property"), # works11

    path('login/', LoginAPIView.as_view(), name='login'), # works11
    path('signup/', SignupAPIView.as_view(), name='signup'), # works11
    path('logout/', LogoutAPIView.as_view(), name='logout'), # will try at the end 
    path('profile/view/', UserProfileAPIView.as_view(), name='view_profile'), # works11
    path('profile/edit/', UserProfileEditAPIView.as_view(), name='edit_profile'), # works11

    path('<int:property_id>/reservations/add/', CreateReservationAPIView.as_view(), name='create_reservation'), # works11

    path('reservations/approved/', ListAllReservationsAPIView.as_view(), name='approved_by_host_reservations'), # works11
    path('<int:reservation_id>/terminate_request/', RequestToTerminateReservationAPIView.as_view(), name='request_to_terminate_reservation'), # works11 - changing status to CR

    path('reservations/requested/', ListAllRequestedReservationsAPIView.as_view(), name='requested_reservations'), # works11 --> gives all reservations with associated property attached
    path('<int:reservation_id>/terminate/', CancelReservationAPIView.as_view(), name='terminate_reservation'), # works11 --> terminates right away and frees available date - can only directly terminate if the reservation has not been approved yet

    path('reservations/cancellations/', ListAllCancelledReservationsAPIView.as_view() ,name='cancellations'), # works11 --> after host approves cancellation request
    # path('<int:reservation_id>/reason_for_cancelling/', ReasonForCancellingAPIView.as_view(), name='reason_for_cancelling'),

    path('reservations/completed/', ListAllCompletedReservationsAPIView.as_view(), name='completed_reservations'), # make some of them completed and test it 
    path('reservations/completed2/', ListAllCompletedReservations2APIView.as_view(), name='completed_reservations2'), # make some of them completed and test it 

    path('<int:reservation_id>/review_for_host/', CreatePropertyCommentAPIView.as_view(), name='review_for_host'), #for both: review for host button on completed page and terminated page 

    path('reservations/terminated/', ListAllTerminatedReservationsAPIView.as_view(), name='terminated_reservations'), # works11 --> all the reservations that were terminated by the host (can be done at anytime)
    path('reservations/terminated2/', ListAllTerminatedReservations2APIView.as_view(), name='terminated_reservations2'), # works11 --> all the reservations that were terminated by the host (can be done at anytime)

    #host - these are only available if there is a host dashboard on the front end 
    path('listings/all/', ListAllPropertiesAPIView.as_view(), name='all_listings'), # works11 - returns the current host's listings - not reservation based

    path('listings/requested/', HostListAllRequestedReservationsAPIView.as_view(), name='requested_reservations'), # works11 --> gives me  hosts all reservation requests  
    path('<int:reservation_id>/approve/', ApproveReservationAPIView.as_view(), name='host_approved'), # works11 # approve button host request page
    path('<int:reservation_id>/deny/', DenyReservationAPIView.as_view(), name='host_denied'), # works11 --> deny button host request page
    path('<int:user_id>/history/', GetUserHistoryAPIView.as_view(), name='add_history'), # works11 --> gives all the history of the user in the host dashboard
    path('history/host/author/', GetHostWrittenReviews.as_view(), name='host_written_history'),

    path('listings/approved/', HostListAllOfApprovedReservationsAPIView.as_view(), name='approved_by_host_listings'), # works11 --> all of the reservations he approved and are not active and waiting to be completed
    path('<int:reservation_id>/termination_by_host/', TerminateReservationAPIView.as_view(), name='termination_by_host'), # works11 - terminates right away


    path('listings/cancellations/', HostListAllCancelledReservationsAPIView.as_view() ,name='all_cancellation_requests'), # works11 --> all cancellations requests this host has recieved for his approved reservations
    path('<int:reservation_id>/approve_cancellation/', HostApproveCancellationRequestAPIView.as_view(), name='host_approved_cancellation'), # works11 --> approve button host cancellation page
    path('<int:reservation_id>/deny_cancellation/', HostDenyCancellationRequestAPIView.as_view(), name='host_denied_cancellation'), # works11 --> deny button host cancellation page



    path('listings/completed/', HostListAllCompletedReservationsAPIView.as_view(), name='completed_listings'), # works11 --> get all completed listings that this host owns 
    path('<int:reservation_id>/review_for_guest/', CreateReviewForGuestAPIView.as_view(), name='review_for_guest_by_host'), # works11 -> #for both: review for host button on completed page and terminated page


    path('listings/terminated/', HostListAllTerminatedReservationsAPIView.as_view(), name='all_listings_terminated_by_host'), # works11 --> get all completed listings that this host owns 
    # path('<int:reservation_id>/reason_for_terminating/', ReasonForTerminatingAPIView.as_view(), name='reason_for_cancelling'),



    # BETHANY's PART
    
    # this adds property comments for a specific reservation_id that has been terminated/completed
    path('reservations/<int:reservation_id>/property-comments/add/', CreatePropertyCommentAPIView.as_view(), name='create_property_comment'),
    
    # this gets all comments on the property for a specific reservation_id, max 3 comments will be returned
    path('reservations/<int:reservation_id>/property-comments/view/', GetAllReservationPropertyComments.as_view(), name='view_reservation_property_comments'),
    
    # this gets all comments for a specific property 
    # reservations/property/<int:property_id>/property-comments/view/?page_size=5&page=2
    path('reservations/property/<int:property_id>/property-comments/view/', GetAllPropertyComments.as_view(), name='view_all_property_comments'),

    # this creates a comment on the guest for a reservation_id
    path('reservations/<int:reservation_id>/guest-comments/add/', CreateGuestCommentAPIView.as_view(), name='create_guest_comment'),
    
    # this gets all comments on the guest for a specific reservation_id, max 3 comments will be returned
    path('reservations/<int:reservation_id>/guest-comments/view/', GetAllReservationGuestComments.as_view(), name='view_reservation_property_comments'),

    # this gets all comments for a specific guest 
    # reservations/guest/<int:guest_id>/guest-comments/view/?page_size=5&page=2
    path('reservations/guest/<int:guest_id>/guest-comments/view/', GetAllGuestComments.as_view(), name='view_all_property_comments'),
    
    # NOTIFICATION STUFF
    
    # this will create a notification for a user given the reservation_id and user_id
    path('notifications/<int:reservation_id>/<int:user_id>/create/', CreateNotificationAPIView.as_view(), name='create_user_notification'),

    # this will create a notification for a user given the reservation_id when a comment is made on their property
    path('notifications/<int:reservation_id>/new-comment/create/', CreateHostCommentNotificationAPIView.as_view(), name='create_user_notification'),
    
    # this will list all the user's notifications - pagination
    path('notifications/list/', GetAllUserNotifications.as_view(), name='list_all_user_notifications'),
    
    # this views a specific notification_id for a given user, will make read=True PUT request
    path('notifications/<int:notification_id>/view/', ViewUserNotification.as_view(), name='view_user_notification'),
    
    # this will clear a specific notification given the notification_id
    path('notifications/<int:notification_id>/clear/', ClearUserNotification.as_view(), name='clear_user_notification'),
    
    # this gets all the user's unread notifications
    path('notifications/new/view/', GetAllNewNotifications.as_view(), name='list_unread_notifications'),
    
    # this gets all the user's specific position related notifications
    path('notifications/<str:position>/view/', GetPositionNotifications.as_view(), name='list_position_notifications'),


    path('rating/guest/<int:guest_id>/list/', GetAllGuestRatings.as_view(), name='list_guest_ratings'),

    path('rating/guest/<int:reservation_id>/add/', AddGuestRatingAPIView.as_view(), name='add_guest_rating'), 

    # same as listings/requested/ except also returns the user
    path('reservations/requested/<int:reservation_id>/', GetAllRequestedReservations.as_view(), name='requested_reservations_with_user'),
]