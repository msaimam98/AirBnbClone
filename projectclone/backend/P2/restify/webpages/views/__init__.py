# from .storesapi import stores_list, StoresManage, StoresCreate, \
#     StoreGetSet, StoresOwned 

from .accountsapi import SignupAPIView, LogoutAPIView, UserProfileAPIView,  UserProfileEditAPIView
from .propertiesapi import ListAllPropertiesAPIView, CreatePropertiesAPIView, DeletePropertiesAPIView, EditPropertiesAPIView, DetailPropertiesAPIView
from .reservationapi import CreateReservationAPIView, ListAllReservationsAPIView, RequestToTerminateReservationAPIView, ListAllRequestedReservationsAPIView, TerminateReservationAPIView, ListAllCancelledReservationsAPIView, ReasonForCancellingAPIView, CancelReservationAPIView
from .commentsapi import  CreatePropertyCommentAPIView, GetAllPropertyComments


    