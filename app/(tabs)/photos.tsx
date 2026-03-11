import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions, FlatList, Image, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { photoDatabase } from '../../services/database';

const { width } = Dimensions.get('window');
const SPACING = 2;
const ITEM_SIZE = (width - (SPACING * 4)) / 3;
const PAGE_SIZE = 12;

export default function PhotosScreen() {
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [maxDistance, setMaxDistance] = useState<string>('');
  const [isAscending, setIsAscending] = useState(false);
  
  const [displayedPhotos, setDisplayedPhotos] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setAllPhotos(photoDatabase.getAllPhotos());
    }, [])
  );

  const filteredAndSortedPhotos = useMemo(() => {
    let result = allPhotos.filter(p => {
      const matchSearch = p.takenAt.includes(search) || 
                          (p.locationName?.toLowerCase().includes(search.toLowerCase()));
      const matchDistance = maxDistance ? (p.distance <= parseInt(maxDistance)) : true;
      return matchSearch && matchDistance;
    });

    return result.sort((a, b) => {
      const dateA = new Date(a.takenAt).getTime();
      const dateB = new Date(b.takenAt).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
  }, [allPhotos, search, maxDistance, isAscending]);

  useEffect(() => {
    setDisplayedPhotos(filteredAndSortedPhotos.slice(0, PAGE_SIZE));
  }, [filteredAndSortedPhotos]);

  const handleLoadMore = () => {
    if (displayedPhotos.length >= filteredAndSortedPhotos.length || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextIndex = displayedPhotos.length;
      const nextBatch = filteredAndSortedPhotos.slice(nextIndex, nextIndex + PAGE_SIZE);
      
      setDisplayedPhotos(prev => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 400);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Ma Galerie</Text>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => setIsAscending(!isAscending)}
          >
            <Text style={styles.sortText}>
              {isAscending ? "📅 Ancien ➔ Récent" : "📅 Récent ➔ Ancien"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TextInput
            placeholder="🔍 Rechercher..."
            style={[styles.input, { flex: 2 }]}
            onChangeText={setSearch}
            placeholderTextColor="#8E8E93"
          />
          <TextInput
            placeholder="📍 km"
            keyboardType="numeric"
            style={[styles.input, { flex: 1, marginLeft: 10 }]}
            onChangeText={setMaxDistance}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>

      <FlatList
        data={displayedPhotos}
        numColumns={3}
        keyExtractor={(item, index) => item.id.toString() + index} 
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 20 }} color="#007AFF" /> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.gridItem}
            onPress={() => router.push({ pathname: '/photo_detail', params: { uri: item.uri, latitude: item.latitude, longitude: item.longitude, takenAt: item.takenAt } })}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.dateLabel}>{item.takenAt}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 15, paddingTop: 50, paddingBottom: 15, backgroundColor: '#FFF', elevation: 3 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: '800', color: '#1C1C1E' },
  sortButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  sortText: { fontSize: 11, fontWeight: 'bold', color: '#FFF' },
  filterRow: { flexDirection: 'row' },
  input: { height: 40, backgroundColor: '#F2F2F7', borderRadius: 10, paddingHorizontal: 12 },
  grid: { paddingHorizontal: SPACING },
  gridItem: { width: ITEM_SIZE, height: ITEM_SIZE, margin: SPACING, borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', padding: 4 },
  dateLabel: { color: '#FFF', fontSize: 10, textAlign: 'center' }
});