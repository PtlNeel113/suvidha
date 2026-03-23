import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    onLocationSelect: (location: string, latlng: { lat: number, lng: number }) => void;
    className?: string;
}

export function LocationPicker({ onLocationSelect, className }: LocationPickerProps) {
    const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [locationName, setLocationName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Map click handler
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                // Simulate reverse geocoding
                setLocationName(`Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`);
            },
        });
        return position ? <Marker position={position} /> : null;
    }

    const handleUseCurrentLocation = () => {
        setIsLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setPosition(latlng);
                    const mockAddress = "Current Location (Detected)";
                    setLocationName(mockAddress);
                    onLocationSelect(mockAddress, latlng);
                    setIsLoading(false);
                },
                (err) => {
                    console.error(err);
                    setIsLoading(false);
                    alert("Could not detect location. Please enable GPS.");
                }
            );
        } else {
            setIsLoading(false);
            alert("Geolocation not supported");
        }
    };

    const handleConfirm = () => {
        if (position) {
            onLocationSelect(locationName, position);
            setIsOpen(false);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <Button variant="outline" type="button" onClick={handleUseCurrentLocation} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2 text-primary" />}
                {isLoading ? "Detecting..." : "Auto-Detect"}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                        📍 Select on Map
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <div className="space-y-4">
                        <h3 className="font-heading font-bold text-lg">Pin Your Location</h3>
                        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border">
                            <MapContainer
                                center={[23.0225, 72.5714]} // Default: Ahmedabad
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                        {position && (
                            <div className="bg-muted p-2 rounded text-sm text-center">
                                Selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                            </div>
                        )}
                        <Button onClick={handleConfirm} className="w-full bg-secondary" disabled={!position}>
                            Confirm Location
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
