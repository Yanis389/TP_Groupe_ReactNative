import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Sécurité pour éviter l'erreur .wasm sur Chrome
const db = Platform.OS !== 'web' ? SQLite.openDatabaseSync('travel_journal.db') : null;

export const setupDatabase = () => {
  if (db) {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        takenAt TEXT NOT NULL
      );
    `);
  }
};

export const photoDatabase = {
  addPhoto: (uri: string, lat: number, lon: number, date: string) => {
    return db?.runSync(
      'INSERT INTO photos (uri, latitude, longitude, takenAt) VALUES (?, ?, ?, ?)',
      [uri, lat, lon, date]
    );
  },
  getMarkedDates: () => {
    if (!db) return {};
    const rows = db.getAllSync<{ takenAt: string }>('SELECT DISTINCT takenAt FROM photos');
    const marks: any = {};
    rows.forEach(row => {
      marks[row.takenAt] = { marked: true, dotColor: 'red' };
    });
    return marks;
  },
  getPhotosByDate: (date: string) => {
    if (!db) return [];
    return db.getAllSync<any>('SELECT * FROM photos WHERE takenAt = ?', [date]);
  },
  getAllPhotos: () => {
    if (!db) return [];
    return db.getAllSync<any>('SELECT * FROM photos ORDER BY id DESC');
  }
};