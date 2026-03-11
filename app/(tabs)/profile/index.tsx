import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { photoDatabase, setupDatabase, userDatabase } from '../../../services/database';

export default function ProfileScreen() {
  const [photoCount, setPhotoCount] = useState(0);
  const [photoDays, setPhotoDays] = useState<{ takenAt: string; count: number }[]>([]);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const calculateMaxDistanceKm = useCallback((photos: any[]) => {
    const geoPhotos = photos.filter(
      (photo) =>
        typeof photo.latitude === 'number' &&
        typeof photo.longitude === 'number' &&
        !Number.isNaN(photo.latitude) &&
        !Number.isNaN(photo.longitude)
    );

    if (geoPhotos.length < 2) return null;

    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    let max = 0;

    for (let i = 0; i < geoPhotos.length - 1; i += 1) {
      const a = geoPhotos[i];
      for (let j = i + 1; j < geoPhotos.length; j += 1) {
        const b = geoPhotos[j];
        const dLat = toRad(b.latitude - a.latitude);
        const dLon = toRad(b.longitude - a.longitude);
        const lat1 = toRad(a.latitude);
        const lat2 = toRad(b.latitude);

        const sinLat = Math.sin(dLat / 2);
        const sinLon = Math.sin(dLon / 2);
        const h =
          sinLat * sinLat +
          Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
        const distance = 2 * earthRadiusKm * Math.asin(Math.min(1, Math.sqrt(h)));

        if (distance > max) max = distance;
      }
    }

    return max;
  }, []);

  const loadStats = useCallback(() => {
    try {
      setupDatabase();
      const counts = photoDatabase.getPhotoCountsByDate();
      const photos = photoDatabase.getAllPhotos();
      const user = userDatabase.getUser();
      setPhotoDays(counts);
      setPhotoCount(photos.length);
      setMaxDistanceKm(calculateMaxDistanceKm(photos));
      setUserId(user?.id ?? null);
      setUsername(user?.username ?? '');
      setEmail(user?.email ?? '');
    } catch (error) {
      console.log('Erreur chargement stats:', error);
    }
  }, [calculateMaxDistanceKm]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const maxDistanceLabel = useMemo(() => {
    if (maxDistanceKm === null) return 'Aucune donn\u00E9e';
    if (maxDistanceKm === 0) return '0 km';
    return `${maxDistanceKm.toFixed(2)} km`;
  }, [maxDistanceKm]);

  const mostActiveDayLabel = useMemo(() => {
    if (photoDays.length === 0) return 'Aucune donn\u00E9e';
    const maxItem = photoDays.reduce(
      (acc, current) => (current.count > acc.count ? current : acc),
      photoDays[0]
    );
    return `${maxItem.takenAt} (${maxItem.count})`;
  }, [photoDays]);

  const handleSaveProfile = useCallback(() => {
    if (!userId) return;
    userDatabase.updateUser(userId, username.trim(), email.trim());
    setIsEditing(false);
  }, [userId, username, email]);

  const handleCancelEdit = useCallback(() => {
    const user = userDatabase.getUser();
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
    setIsEditing(false);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Ionicons name="person-circle" size={100} color="#007AFF" />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Mon Profil</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
          disabled={isEditing}
        >
          <Ionicons name="pencil" size={18} color={isEditing ? '#999' : '#007AFF'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Informations du profil utilisateur</Text>

      {!isEditing ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Nom d'utilisateur</Text>
            <Text style={styles.infoValue}>{username || '-'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{email || '-'}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Nom d'utilisateur</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Nom d'utilisateur"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques photos</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Nombre total de photos</Text>
          <Text style={styles.statValue}>{photoCount}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Jour le plus actif</Text>
          <Text style={styles.statValue}>{mostActiveDayLabel}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Plus grande distance entre 2 photos</Text>
          <Text style={styles.statValue}>{maxDistanceLabel}</Text>
        </View>

        <Text style={styles.sectionSubtitle}>Photos par jour</Text>
        {photoDays.length === 0 ? (
          <Text style={styles.empty}>Aucune photo enregistr\u00E9e.</Text>
        ) : (
          photoDays.map((item) => (
            <View key={item.takenAt} style={styles.dayRow}>
              <Text style={styles.dayLabel}>{item.takenAt}</Text>
              <Text style={styles.dayCount}>{item.count}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#eef5ff',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  formActions: {
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#e5e5ea',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statBlock: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#444',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e4',
  },
  dayLabel: {
    fontSize: 13,
    color: '#333',
  },
  dayCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  empty: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
});
