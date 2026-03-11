import { MapScreenProps } from '@/services/types';
import useCurrentLocation from '@/utils/location';
import React, { useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';


<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> a00c20c8 (Ajout bouton recentrer pour recenter la map sur la localisation actuelle)
=======

>>>>>>> 886bc5f8 (Modification pour utiliser modèle photo commun)
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
  const mapRef = useRef<MapView>(null);
  const { location, refresh, loading } = useCurrentLocation();

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> a00c20c8 (Ajout bouton recentrer pour recenter la map sur la localisation actuelle)
=======

>>>>>>> 886bc5f8 (Modification pour utiliser modèle photo commun)
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
<<<<<<< HEAD
<<<<<<< HEAD
        {markers.map((marker) => (
          <Marker
            key={`${marker.id}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
=======
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.latlng.latitude}-${marker.latlng.longitude}-${index}`}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
>>>>>>> a00c20c8 (Ajout bouton recentrer pour recenter la map sur la localisation actuelle)
=======
        {markers.map((marker) => (
          <Marker
            key={`${marker.id}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
>>>>>>> 886bc5f8 (Modification pour utiliser modèle photo commun)
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
<<<<<<< HEAD
});
=======
});
>>>>>>> a00c20c8 (Ajout bouton recentrer pour recenter la map sur la localisation actuelle)
