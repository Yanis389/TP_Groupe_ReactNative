import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { photoDatabase } from '../../services/database';

const { width } = Dimensions.get('window');
const SPACING = 2;
const ITEM_SIZE = (width - (SPACING * 4)) / 3;

export default function PhotosScreen() {
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setAllPhotos(photoDatabase.getAllPhotos());
    }, [])
  );

  const filtered = useMemo(() =>
    allPhotos.filter(p => p.takenAt.includes(search)),
    [allPhotos, search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Rechercher une date (AAAA-MM-DD)"
          style={styles.input}
          onChangeText={setSearch}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <FlatList
        data={filtered}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.gridItem}
            onPress={() => {
              router.push({ pathname: '/photo_detail', params: { uri: item.uri } });
            }}
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
  container: { flex: 1, backgroundColor: '#FFF' },
  searchContainer: { paddingHorizontal: 15, paddingTop: 60, paddingBottom: 15, backgroundColor: '#FFF' },
  input: { height: 45, backgroundColor: '#F2F2F7', borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  grid: { paddingHorizontal: SPACING },
  gridItem: { width: ITEM_SIZE, height: ITEM_SIZE, margin: SPACING, borderRadius: 4, overflow: 'hidden' },
  image: { width: '100%', height: '100%', backgroundColor: '#EEE' },
  overlay: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 5, borderRadius: 4 },
  dateLabel: { color: '#FFF', fontSize: 9, fontWeight: 'bold' }
});