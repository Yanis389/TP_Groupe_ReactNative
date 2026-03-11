import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomCalendar } from '../../components/CustomCalendar';
import { photoDatabase } from '../../services/database';

export default function CalendarScreen() {
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  const loadData = useCallback(() => {
    try {
      const marks = photoDatabase.getMarkedDates();
      setMarkedDates(marks);
      if (selectedDate) {
        const photos = photoDatabase.getPhotosByDate(selectedDate);
        setSelectedPhotos(photos);
      }
    } catch (e) {
      console.error("Erreur chargement SQLite:", e);
    }
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const injectTestData = () => {
    const today = new Date().toISOString().split('T')[0];
    photoDatabase.addPhoto("https://picsum.photos/200", 43.7, 7.2, today);
    Alert.alert("Succès", "Photo de test ajoutée dans SQLite !");
    loadData();
  };

  return (
    <View style={styles.container}>
      <CustomCalendar 
        markedDates={markedDates} 
        onDayPress={(day: any) => {
          setSelectedDate(day.dateString);
          const photos = photoDatabase.getPhotosByDate(day.dateString);
          setSelectedPhotos(photos);
        }} 
      />
      
      <TouchableOpacity style={styles.testBtn} onPress={injectTestData}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>SIMULER UNE PHOTO (TEST)</Text>
      </TouchableOpacity>

      <View style={styles.listContainer}>
        <Text style={styles.title}>
          {selectedDate ? `Photos du ${selectedDate}` : "Sélectionnez une date"}
        </Text>
        <FlatList
          data={selectedPhotos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => console.log(item)}
            >
              <Image source={{ uri: item.uri }} style={styles.img} />
              <View>
                <Text style={styles.cardText}>Photo #{item.id}</Text>
                <Text style={styles.geoText}>Lat: {item.latitude.toFixed(2)} | Lon: {item.longitude.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucune photo pour ce jour.</Text>}
        />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  testBtn: { backgroundColor: '#00adf5', padding: 12, margin: 15, borderRadius: 8, alignItems: 'center' },
  listContainer: { flex: 1, paddingHorizontal: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 8 },
  img: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
  cardText: { fontWeight: 'bold', fontSize: 14 },
  geoText: { fontSize: 12, color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' }
});

