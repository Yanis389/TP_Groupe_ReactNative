import Map from '@/components/MapComponent';
import { StyleSheet, View } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});