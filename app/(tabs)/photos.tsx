<<<<<<< HEAD
<<<<<<< HEAD
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { photoDatabase } from '../../services/database';
import { Photo } from '../../services/photo';
=======
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { photoDatabase } from '../../services/database';
>>>>>>> b6f67136 (fix: synchronisation database et correction définitive des imports caméra/calendrier)

const { width } = Dimensions.get('window');
const SPACING = 2;
const ITEM_SIZE = (width - (SPACING * 4)) / 3;
<<<<<<< HEAD

export default function PhotosScreen() {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => { setAllPhotos(photoDatabase.getAllPhotos()); }, []);

  const filtered = useMemo(() => 
    allPhotos.filter(p => p.takenAt.includes(search)), 
  [allPhotos, search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
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
            activeOpacity={0.9}
            style={styles.gridItem}
            onPress={() => router.push({ pathname: '/photo-detail', params: { id: item.id } })}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <View style={styles.overlay}>
               <Text style={styles.dateLabel}>{item.takenAt.split('-').slice(1).join('/')}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.grid}
      />
=======
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
=======
>>>>>>> b6f67136 (fix: synchronisation database et correction définitive des imports caméra/calendrier)

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
<<<<<<< HEAD
      <Ionicons name="images" size={80} color="#007AFF" />
      <Text style={styles.title}>Photos</Text>
      <Text style={styles.subtitle}>Écran des photos</Text>
>>>>>>> 9b56997c (fix: install navigation, and create tabs with expo-router and drawer for profil)
=======
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
            onPress={() => router.push({ pathname: '/photo-detail', params: { id: item.id } })}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <View style={styles.overlay}>
               <Text style={styles.dateLabel}>{item.takenAt}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.grid}
      />
>>>>>>> b6f67136 (fix: synchronisation database et correction définitive des imports caméra/calendrier)
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#FFF' },
  searchBar: { padding: 15, paddingTop: 50, backgroundColor: '#FFF' },
  input: { height: 45, backgroundColor: '#E9E9EB', borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  grid: { paddingHorizontal: SPACING },
  gridItem: { width: ITEM_SIZE, height: ITEM_SIZE, margin: SPACING, borderRadius: 8, overflow: 'hidden' },
  image: { flex: 1 },
  overlay: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 4, borderRadius: 4 },
  dateLabel: { color: '#FFF', fontSize: 10, fontWeight: 'bold' }
});
=======
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
>>>>>>> 9b56997c (fix: install navigation, and create tabs with expo-router and drawer for profil)
=======
  container: { flex: 1, backgroundColor: '#FFF' },
  searchContainer: { paddingHorizontal: 15, paddingTop: 60, paddingBottom: 15, backgroundColor: '#FFF' },
  input: { height: 45, backgroundColor: '#F2F2F7', borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  grid: { paddingHorizontal: SPACING },
  gridItem: { width: ITEM_SIZE, height: ITEM_SIZE, margin: SPACING, borderRadius: 4, overflow: 'hidden' },
  image: { width: '100%', height: '100%', backgroundColor: '#EEE' },
  overlay: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 5, borderRadius: 4 },
  dateLabel: { color: '#FFF', fontSize: 9, fontWeight: 'bold' }
});
>>>>>>> b6f67136 (fix: synchronisation database et correction définitive des imports caméra/calendrier)
