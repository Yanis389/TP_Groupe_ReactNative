import { Photo } from "./photo";

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