import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CustomCalendar } from '../../components/CustomCalendar';
import { PhotoCard } from '../../components/PhotoCard';
import { photoDatabase } from '../../services/database';

export default function CalendarScreen() {
  const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, any>>({});
  const router = useRouter();

  useEffect(() => {
    // Synchronisation avec la DB 
    setMarks(photoDatabase.getMarkedDates());
    setPhotos(photoDatabase.getPhotosByDate(selected));
  }, [selected]);

  const calendarMarks = useMemo(() => ({
    ...marks,
    [selected]: {
      ...(marks[selected] || {}),
      selected: true,
      selectedColor: '#007AFF',
      disableTouchEvent: false
    }
  }), [marks, selected]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Explorateur Temporel</Text>
      </View>

      <View style={styles.calendarCard}>
        <CustomCalendar 
           onDayPress={(day) => setSelected(day.dateString)} 
           markedDates={calendarMarks} 
        />
      </View>

      <View style={styles.listContainer}>
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>
             {photos.length > 0 ? `📸 ${photos.length} souvenirs` : "Aucun souvenir"}
           </Text>
           <Text style={styles.dateSubtitle}>{selected}</Text>
        </View>

        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PhotoCard
              item={item}
              onPress={() => router.push({ pathname: '/photo_detail', params: { uri: item.uri, latitude: item.latitude, longitude: item.longitude, takenAt: item.takenAt } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🏜️</Text>
              <Text style={styles.emptyText}>Rien à afficher pour cette date.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  calendarCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: -10,
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  listContainer: { flex: 1, marginTop: 20, paddingHorizontal: 15 },
  sectionHeader: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  dateSubtitle: { fontSize: 14, color: '#8E8E93' },
  emptyBox: { flex: 1, marginTop: 50, alignItems: 'center' },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#8E8E93', fontSize: 16 }
});