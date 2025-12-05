import { useEffect, useState } from "react";
import type { Location } from "../types";
import { Link } from "react-router-dom";

function placeholderFor(src?: string, seed?: string) {
  const ok = src && src.trim().length > 0;
  return ok ? src! : `https://picsum.photos/seed/${seed || "tour"}/600/400`;
}

const TourList = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="h-screen overflow-y-auto p-4 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Khám phá Việt Nam
      </h2>
      <div className="space-y-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={placeholderFor(location.image, `loc-${location.id}`)}
              alt={location.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{location.name}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {location.description}
              </p>
              <div className="space-y-2">
                {location.tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="flex justify-between items-center border-t pt-2"
                  >
                    <div>
                      <Link
                        to={`/tours/${tour.id}`}
                        className="font-medium text-gray-800 hover:underline"
                      >
                        {tour.name}
                      </Link>
                      <p className="text-xs text-gray-500">{tour.duration}</p>
                    </div>
                    <span className="text-blue-600 font-bold">
                      {tour.price.toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourList;
