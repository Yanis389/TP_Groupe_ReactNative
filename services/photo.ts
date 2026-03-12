export interface Photo {
  id: number;
  name?: string;
  description?: string;
  uri: string;
  latitude: number;
  longitude: number;
  takenAt: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapScreenProps {
  markers?: Photo[];
  initialRegion?: MapRegion;
}
