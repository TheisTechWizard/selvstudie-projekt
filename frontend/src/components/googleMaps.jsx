import { useEffect, useRef } from "react";
import axios from "axios";

function MapComponent({ address }) {
  const mapRef = useRef(null);

  useEffect(() => {

    if (!document.getElementById("google-maps-loader")) {
        const script = document.createElement("script");
        script.src = "api/maps-loader.js";
        script.id = "google-maps-loader";
        document.head.appendChild(script);
      }
    
      window.initMap = () => {
        new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: 55.6761, lng: 12.5683 },
          zoom: 12,
        });
      };
        
    if (!address) return;

    axios.post("api/maps/geocode/", { address })
      .then(res => {
        const { lat, lng } = res.data;
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 14
        });
        new window.google.maps.Marker({ position: { lat, lng }, map });
      })
      .catch(console.error);
  }, [address]);

  return <div id="map" style={{ height: "400px", width: "100%" }} ref={mapRef}></div>;
}

export default MapComponent;
