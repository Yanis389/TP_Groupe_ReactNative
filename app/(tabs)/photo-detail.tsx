import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { photoDatabase } from '../../services/database';

export default function PhotoDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [photo, setPhoto] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      const all = photoDatabase.getAllPhotos();
      const found = all.find(p => p.id.toString() === id);
      if (found) setPhoto(found);
    }
  }, [id]);

  if (!photo) return <View style={styles.center}><Text>Chargement...</Text></View>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={40} color="#FFF" />
      </TouchableOpacity>
      
      <Image source={{ uri: photo.uri }} style={styles.fullImage} resizeMode="contain" />
      
      <SafeAreaView style={styles.infoBox}>
        <Text style={styles.title}>Souvenir du {photo.takenAt}</Text>
        <View style={styles.row}>
           <Text style={styles.coords}>📍 Lat: {Number(photo.latitude).toFixed(4)}</Text>
           <Text style={styles.coords}>📍 Lon: {Number(photo.longitude).toFixed(4)}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  fullImage: { flex: 1 },
  infoBox: { backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  coords: { fontSize: 14, color: '#666' }
});