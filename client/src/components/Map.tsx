import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Location } from "../types";
import { Link } from "react-router-dom";

// Fix lỗi icon mặc định của Leaflet trong React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

function placeholderFor(src?: string, seed?: string) {
  const ok = src && src.trim().length > 0;
  return ok ? src! : `https://picsum.photos/seed/${seed || "loc"}/600/400`;
}

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Lỗi tải địa điểm:", err));
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[16.0471, 108.2068]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div className="min-w-[200px]">
                <img
                  src={placeholderFor(location.image, `loc-${location.id}`)}
                  alt={location.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-lg">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {location.description}
                </p>
                <div className="border-t pt-2">
                  <p className="font-semibold text-sm mb-1">Tour nổi bật:</p>
                  <ul className="text-sm list-disc pl-4">
                    {location.tours.slice(0, 2).map((tour) => (
                      <li
                        key={tour.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>
                          {tour.name} -{" "}
                          <span className="text-blue-600 font-bold">
                            {tour.price.toLocaleString()}đ
                          </span>
                        </span>
                        <Link
                          to={`/tours/${tour.id}`}
                          className="text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Xem
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
