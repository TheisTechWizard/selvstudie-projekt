import googlemaps
from django.conf import settings

gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

def geocode_address(address):
    return gmaps.geocode(address)

def get_coordinates_for_place(place_id):
    return gmaps.place(place_id=place_id)
