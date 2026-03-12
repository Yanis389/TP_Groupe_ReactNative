import { photoDatabase, setupDatabase } from '@/services/database';
import { MapScreenProps } from '@/services/map';
import useCurrentLocation from '@/utils/location';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [mapReady, setMapReady] = useState(false);
  const hasFitRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setupDatabase();
      hasFitRef.current = false;
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

  const fitToMarkers = useCallback(
    (items: typeof markers) => {
      const coords = items
        .map(item => ({
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        }))
        .filter(c => Number.isFinite(c.latitude) && Number.isFinite(c.longitude));

      if (coords.length === 0) return false;
      if (coords.length === 1) {
        const only = coords[0];
        mapRef.current?.animateToRegion(
          {
            latitude: only.latitude,
            longitude: only.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          },
          500
        );
        return true;
      }
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
        animated: true,
      });
      return true;
    },
    [region.latitudeDelta, region.longitudeDelta]
  );

  useEffect(() => {
    if (!mapReady) return;
    if (hasFitRef.current) return;
    if (photoMarkers.length === 0) return;

    const id = setTimeout(() => {
      const didFit = fitToMarkers(photoMarkers);
      if (didFit) hasFitRef.current = true;
    }, 0);

    return () => clearTimeout(id);
  }, [fitToMarkers, mapReady, photoMarkers]);

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
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        onMapReady={() => setMapReady(true)}
      >
        {photoMarkers.map((marker) => (
          <Marker
            key={`${marker.id}`}
            coordinate={{
              latitude: Number(marker.latitude),
              longitude: Number(marker.longitude),
            }}
            onPress={() =>
              router.push({ pathname: '/photo_detail', params: { id: marker.id } })
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
          {loading ? 'Localisation' : 'Recentrer'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
