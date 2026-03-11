// Version web temporaire: pas de SQLite pour éviter l'erreur wasm.
const db = null;

export const setupDatabase = () => {
  return db;
};

export const photoDatabase = {
  addPhoto: (_uri: string, _lat: number, _lon: number, _date: string) => {
    return null;
  },
  getMarkedDates: () => {
    return {};
  },
  getPhotosByDate: (_date: string) => {
    return [];
  },
};
