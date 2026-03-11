import { photoDatabase, setupDatabase } from '@/services/database';
import { MapScreenProps } from '@/services/map';
import useCurrentLocation from '@/utils/location';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function Map({ markers = [], initialRegion }: MapScreenProps) {
  const fallbackRegion = useMemo(
    () => ({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
    []
  );
  const [region, setRegion] = useState(initialRegion ?? fallbackRegion);
  const [photoMarkers, setPhotoMarkers] = useState(markers);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const { location, refresh, loading } = useCurrentLocation();

  useFocusEffect(
    useCallback(() => {
      setupDatabase();
      const stored = photoDatabase.getAllPhotos();
      if (stored.length === 0) {
        setPhotoMarkers(markers);
        return;
      }
      const merged = [...markers, ...stored].reduce((acc, item) => {
        if (!acc.some(existing => existing.id === item.id)) acc.push(item);
        return acc;
      }, [] as typeof markers);
      setPhotoMarkers(merged);
    }, [markers])
  );

  const recenterToLocation = async () => {
    const current = await refresh();
    const coords = current?.coords ?? location?.coords;
    if (!coords) return;

    const nextRegion = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };

    mapRef.current?.animateToRegion(nextRegion, 500);
    setRegion(nextRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        {photoMarkers.map((marker) => (
          <Marker
            key={`${marker.id}`}
            coordinate={{
              latitude: Number(marker.latitude),
              longitude: Number(marker.longitude),
            }}
            onPress={() =>
              router.push({ pathname: '/photo-detail', params: { id: marker.id } })
            }
          />
        ))}
      </MapView>
      <Pressable
        style={[styles.recenterButton, loading && styles.recenterButtonDisabled]}
        onPress={recenterToLocation}
        disabled={loading}
      >
        <Text style={styles.recenterButtonText}>
          {loading ? 'Localisation…' : 'Recentrer'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#0b5cff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    elevation: 2,
  },
  recenterButtonDisabled: {
    opacity: 0.6,
  },
  recenterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
