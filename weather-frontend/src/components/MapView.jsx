import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Helper: This component moves the map view
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // .flyTo handles the smooth zooming and movement
      map.flyTo(position, 12, {
        duration: 1.5 // seconds
      });
    }
  }, [position, map]);
  return null;
}

const MapView = ({ profiles, selectedId, onSelect }) => {
  // Find the coordinates of the station selected in the sidebar
  const activeStation = profiles.find(p => p.metadata?.sensorId === selectedId);
  
  const currentPos = activeStation 
    ? [activeStation.coordinates[1], activeStation.coordinates[0]] // [Lat, Lng]
    : null;

  return (
    <MapContainer center={[7.87, 80.77]} zoom={8} className="w-full h-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* This component "watches" for the sidebar click and zooms the map */}
      <RecenterMap position={currentPos} />

      {profiles.map((p) => {
        const lng = p.coordinates[0];
        const lat = p.coordinates[1];
        const sensorName = p.metadata?.sensorId || "Station";

        return (
          <Marker 
            key={p._id} 
            position={[lat, lng]} 
            eventHandlers={{
              click: () => onSelect(sensorName, { lat, lng })
            }}
          >
            <Popup>
               <div className="font-sans">
                 <strong className="text-blue-600">{sensorName}</strong><br/>
                 🌡️ Temp: {p.temperature}°C<br/>
                 💧 Humidity: {p.humidity}%
               </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;