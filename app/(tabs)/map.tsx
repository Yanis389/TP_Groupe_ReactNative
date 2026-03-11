import Map from '@/components/MapComponent';
import { View } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Map />
      {/* <Ionicons name="map" size={80} color="#007AFF" />
      <Text style={styles.title}>Carte</Text>
      <Text style={styles.subtitle}>Écran de la carte</Text> */}
    </View>
  );
}

