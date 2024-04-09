import React, { useState, useEffect } from 'react';

const LocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Fetch location name using OpenStreetMap Nominatim API
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.display_name) {
                setLocationName(data.display_name);
              }
            })
            .catch((error) => {
              console.error('Error fetching location name:', error);
            });
        },
        (error) => {
          // Handle errors
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported');
    }
  }, []);

  return (
    <div>
      
      {/* <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p> */}
      <p>{locationName}</p>
    </div>
  );
};

export default LocationComponent;
