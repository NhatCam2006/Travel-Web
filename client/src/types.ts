export interface Tour {
  id: number;
  name: string;
  price: number;
  duration: string;
}

export interface Location {
  id: number;
  name: string;
  description: string | null;
  region: "NORTH" | "CENTRAL" | "SOUTH";
  latitude: number;
  longitude: number;
  image: string;
  tours: Tour[];
}
