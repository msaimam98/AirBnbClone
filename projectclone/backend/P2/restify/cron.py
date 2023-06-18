from datetime import datetime
from webpages.models.reservation import Reservation

now = datetime.now()
completed_reservations = Reservation.objects.filter(end_time__lte=now)

for reservation in completed_reservations:
    if reservation.status == 'AP':
        reservation.status = 'CO'
        reservation.available_date.booked_for = False
        reservation.available_date = None
        reservation.save()
    else: # when status=="AR" - when the host just didnt approve it 
        reservation.status = 'DE'
        reservation.available_date.booked_for = False
        reservation.available_date = None
        reservation.save()
