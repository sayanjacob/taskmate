import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const LocationMap = () => {
  const [pickedLocation, setPickedLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cords, setCords] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
            .then(response => response.json())
            .then(data => {
              let locationName;
              if (data.address && data.address.city) {
                locationName = data.address.city;
              } else if (data.address && data.address.town) {
                locationName = data.address.town;
              } else if (data.address && data.address.village) {
                locationName = data.address.village;
              } else {
                locationName = data.display_name;
              }
              setCords([latitude, longitude]);
              setPickedLocation({ latitude, longitude, name: locationName });
            })
            .catch(error => {
              console.error('Error getting city name:', error);
            });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleMapClick = (event) => {
    setSelectedLocation(event.latlng);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%' }}>
        {cords.length > 0 && (
          <MapContainer center={cords} zoom={13} scrollWheelZoom={false} onClick={handleMapClick}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickedLocation && (
              <Marker position={cords}>
                <Popup>{pickedLocation.name}</Popup>
              </Marker>
            )}
            {selectedLocation && (
              <Marker position={selectedLocation}>
                <Popup>Selected Location</Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
