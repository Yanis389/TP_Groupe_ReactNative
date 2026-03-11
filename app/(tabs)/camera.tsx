import { photoDatabase, setupDatabase } from '@/services/database';
import { Photo } from '@/services/types';
import useCurrentLocation from '@/utils/location';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { location, errorMsg, loading } = useCurrentLocation();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<Photo | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    setupDatabase();
    (async () => {
      await requestPermission();
    })();
  }, []);

  const pickImageFromFiles = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const photo: Photo = {
        id: Date.now(),
        uri: result.assets[0].uri,
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        takenAt: new Date().toISOString(),
      };
      setCapturedPhoto(photo);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const result = await cameraRef.takePictureAsync();
      const photo: Photo = {
        id: Date.now(),
        uri: result.uri,
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        takenAt: new Date().toISOString(),
      };
      setCapturedPhoto(photo);
      setShowCamera(false);
    }
  };

  const openCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web', 'Sur web, utilisez le sélecteur de fichiers');
      return;
    }

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la caméra');
        return;
      }
    }
    setShowCamera(true);
  };

  const savePhotoToDatabase = () => {
    if (!capturedPhoto) return;

    if (Platform.OS === 'web') {
      Alert.alert('Web', 'La sauvegarde SQLite n\'est pas disponible sur web pour le moment');
      return;
    }

    try {
      const dateOnly = capturedPhoto.takenAt.split('T')[0];
      photoDatabase.addPhoto(
        capturedPhoto.uri,
        capturedPhoto.latitude,
        capturedPhoto.longitude,
        dateOnly
      );
      Alert.alert('Succès', 'Photo sauvegardée');
      setCapturedPhoto(null);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la photo: ' + error);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Ionicons name="folder-open" size={80} color="#007AFF" />
        <Text style={styles.title}>Sélectionner un fichier</Text>
        <Text style={styles.subtitle}>Sur web, choisissez une photo ou vidéo</Text>

        <TouchableOpacity style={styles.button} onPress={pickImageFromFiles}>
          <Ionicons name="images" size={24} color="#fff" />
          <Text style={styles.buttonText}>Choisir un fichier</Text>
        </TouchableOpacity>

        {capturedPhoto && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />
            <Text style={styles.locationText}>
              Lat: {capturedPhoto.latitude.toFixed(6)}, Long: {capturedPhoto.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={setCameraRef} facing="back">
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCamera(false)}>
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Ionicons name="camera" size={80} color="#007AFF" />
        <Text style={styles.title}>Caméra</Text>
        <Text style={styles.subtitle}>Prenez des photos ou vidéos</Text>

        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.buttonText}>Ouvrir la caméra</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={pickImageFromFiles}>
          <Ionicons name="images" size={24} color="#007AFF" />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Choisir depuis la galerie</Text>
        </TouchableOpacity>

        {loading && (
          <Text style={styles.locationStatus}>Récupération de la localisation...</Text>
        )}
        {errorMsg && (
          <Text style={styles.locationError}>{errorMsg}</Text>
        )}

        {capturedPhoto && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />
            <Text style={styles.locationText}>
              Lat: {capturedPhoto.latitude.toFixed(6)}, Long: {capturedPhoto.longitude.toFixed(6)}
            </Text>
            <Text style={styles.dateText}>
              {new Date(capturedPhoto.takenAt).toLocaleString('fr-FR')}
            </Text>
            <TouchableOpacity style={styles.saveButton} onPress={savePhotoToDatabase}>
              <Ionicons name="save" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Sauvegarder dans SQLite</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
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
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  locationText: {
    marginTop: 10,
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  dateText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  locationStatus: {
    marginTop: 20,
    fontSize: 14,
    color: '#007AFF',
  },
  locationError: {
    marginTop: 20,
    fontSize: 14,
    color: '#FF3B30',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
