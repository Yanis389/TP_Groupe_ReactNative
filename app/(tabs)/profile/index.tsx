import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={100} color="#007AFF" />
      <Text style={styles.title}>Mon Profil</Text>
      <Text style={styles.subtitle}>Informations du profil utilisateur</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Nom d'utilisateur</Text>
        <Text style={styles.infoValue}>Utilisateur</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>user@example.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
