import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="calendar" size={80} color="#007AFF" />
      <Text style={styles.title}>Calendrier</Text>
      <Text style={styles.subtitle}>Écran du calendrier</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
