import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CustomCalendar } from '../../components/CustomCalendar';
import { PhotoCard } from '../../components/PhotoCard';
import { photoDatabase } from '../../services/database';

export default function CalendarScreen() {
  const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, any>>({});
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      setMarks(photoDatabase.getMarkedDates());
      setPhotos(photoDatabase.getPhotosByDate(selected));
    };
    refresh();
  }, [selected]);

  const onDayPress = (day: any) => {
    setSelected(day.dateString);
  };

  const calendarMarks = useMemo(() => ({
    ...marks,
    [selected]: {
      ...(marks[selected] || {}),
      selected: true,
      selectedColor: '#007AFF'
    }
  }), [marks, selected]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarCard}>
        <CustomCalendar onDayPress={onDayPress} markedDates={calendarMarks} />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>
          {photos.length > 0 ? `Photos du ${selected}` : "Aucun souvenir ce jour"}
        </Text>

        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PhotoCard
              item={item}
              onPress={() => router.push({ pathname: '/photo_detail', params: { uri: item.uri, latitude: item.latitude, longitude: item.longitude, takenAt: item.takenAt } })}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>🏜️ Voyagez pour remplir cette date !</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  calendarCard: {
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 20,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  listContainer: { flex: 1, paddingHorizontal: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1C1C1E' },
  emptyBox: { marginTop: 40, alignItems: 'center' },
  emptyText: { color: '#8E8E93', fontSize: 16 }
});