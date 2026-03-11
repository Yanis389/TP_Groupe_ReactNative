import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

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
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `);

    const existingUser = db.getAllSync<{ id: number }>('SELECT id FROM users LIMIT 1');
    if (existingUser.length === 0) {
      db.runSync('INSERT INTO users (username, email) VALUES (?, ?)', [
        'Utilisateur',
        'user@example.com',
      ]);
    }
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
  getPhotoCountsByDate: () => {
    if (!db) return [];
    return db.getAllSync<{ takenAt: string; count: number }>(
      'SELECT takenAt, COUNT(*) as count FROM photos GROUP BY takenAt ORDER BY takenAt DESC'
    );
  },
  getAllPhotos: () => {
    if (!db) return [];
    return db.getAllSync<any>('SELECT * FROM photos');
  },
};

export const userDatabase = {
  getUser: () => {
    if (!db) return null;
    const rows = db.getAllSync<any>('SELECT * FROM users LIMIT 1');
    return rows[0] ?? null;
  },
  updateUser: (id: number, username: string, email: string) => {
    return db?.runSync('UPDATE users SET username = ?, email = ? WHERE id = ?', [
      username,
      email,
      id,
    ]);
  },

};
