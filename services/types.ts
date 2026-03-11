export interface Photo {
  id: number;
  uri: string;
  latitude: number;
  longitude: number;
  takenAt: string; 
}

export type LatLng = { latitude: number; longitude: number };

export type MarkerItem = {
  latlng: LatLng;
  title?: string;
  description?: string;
};

export type MapScreenProps = {
  markers?: MarkerItem[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
};