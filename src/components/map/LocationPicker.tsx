import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin, LocateFixed, Check } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect, onClose, initialLat = 23.0225, initialLng = 72.5714 }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [address, setAddress] = useState("Fetching address...");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    reverseGeocode(position[0], position[1]);
  }, [position]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
      const data = await resp.json();
      setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  };

  const handleDetect = () => {
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setDetecting(false);
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-secondary" />
          <div>
            <h2 className="font-heading text-lg font-bold">Pin Location</h2>
            <p className="text-sm text-muted-foreground truncate max-w-md">{address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDetect} disabled={detecting} className="h-12">
            <LocateFixed className="w-5 h-5 mr-2" /> {detecting ? "Detecting..." : "My Location"}
          </Button>
          <Button onClick={() => onLocationSelect(position[0], position[1], address)} className="h-12 bg-success hover:bg-success/90">
            <Check className="w-5 h-5 mr-2" /> Confirm
          </Button>
          <Button variant="ghost" onClick={onClose} className="h-12">✕</Button>
        </div>
      </div>
      <div className="flex-1">
        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <ClickHandler onLocationChange={(lat, lng) => setPosition([lat, lng])} />
        </MapContainer>
      </div>
    </div>
  );
}
