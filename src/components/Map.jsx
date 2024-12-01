import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const { isLoading: isLoadingPosition, positio: geolocationPosition, getPosition } = useGeolocation();
  const navigateTo = useNavigate();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng, setMapPosition]
  );

  useEffect(function () {
    if(geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <Button type='position' onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use Your position"}
      </Button>
      <MapContainer className={styles.map} center={mapPosition} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => {
          return (
            <Marker key={city.id} position={city.position}>
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeView position={mapPosition} />
        <DetectClick navigateTo={navigateTo} />
      </MapContainer>
    </div>
  );
}

function ChangeView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick({ navigateTo, cityName }) {
  const map = useMapEvents({
    click: (e) => {
      console.log("e: ", e);
      navigateTo(`form?city=${cityName}&lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

export default Map;
