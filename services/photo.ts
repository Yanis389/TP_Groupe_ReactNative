export interface Photo {
  id: number;
  name?: string;
  description?: string;
  uri: string;
  latitude: number;
  longitude: number;
  takenAt: string;
}