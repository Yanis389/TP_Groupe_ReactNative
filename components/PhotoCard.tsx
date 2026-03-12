import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  item: any;
  onPress: (photo: any) => void;
  onEdit?: (photo: any) => void;
  onDelete?: (photo: any) => void;
}

export const PhotoCard = ({ item, onPress, onEdit, onDelete }: Props) => {
  const lat = Number(item.latitude) || 0;
  const lon = Number(item.longitude) || 0;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.mainContent} onPress={() => onPress(item)}>
        <Image source={{ uri: item.uri }} style={styles.img} />
        <View style={styles.info}>
          <Text style={styles.cardText}>Photo #{item.id}</Text>
          <Text style={styles.dateText}>{item.takenAt}</Text>
          <Text style={styles.geoText}>📍 {lat.toFixed(2)}, {lon.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionButton}>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(item)} style={styles.actionButton}>
            <Ionicons name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', marginBottom: 8, borderRadius: 10, alignItems: 'center' },
  mainContent: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  img: { width: 60, height: 60, borderRadius: 5 },
  info: { marginLeft: 12, flex: 1, justifyContent: 'center' },
  cardText: { fontWeight: 'bold' },
  dateText: { color: '#666', fontSize: 12 },
  geoText: { color: '#007AFF', fontSize: 11, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { padding: 8 }
});