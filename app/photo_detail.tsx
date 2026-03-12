import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EditPhotoModal } from '../components/EditPhotoModal';
import { photoDatabase, setupDatabase } from '../services/database';

export default function PhotoDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [photo, setPhoto] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        setupDatabase();
        const photoId = Number(id);
        const loadedPhoto = photoDatabase.getPhotoById(photoId);
        setPhoto(loadedPhoto);
    }, [id]);

    return (
        <View style={styles.container}>
            {photo?.uri ? (
                <Image
                    source={{ uri: photo.uri as string }}
                    style={styles.image}
                    resizeMode="contain"
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Photo introuvable</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>

            {(photo?.latitude || photo?.longitude || photo?.takenAt || photo?.name || photo?.description) && (
                <View style={styles.locationContainer}>
                    {photo?.takenAt && <Text style={styles.locationText}>{"Date: " + photo.takenAt}</Text>}
                    {photo?.latitude != null && photo?.longitude != null && (
                        <Text style={styles.locationText}>
                            {"Localisation: " + Number(photo.latitude).toFixed(2) + ", " + Number(photo.longitude).toFixed(2)}
                        </Text>
                    )}
                    {photo?.name ? <Text style={styles.locationText}>{"Nom: " + photo.name}</Text> : null}
                    {photo?.description ? <Text style={styles.locationText}>{"Description: " + photo.description}</Text> : null}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.editBtn]}
                            onPress={() => {
                                setShowEditModal(true);
                            }}
                        >
                            <Ionicons name="pencil" size={16} color="#007AFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.deleteBtn]}
                            onPress={() => {
                                Alert.alert(
                                    'Supprimer',
                                    'Voulez-vous vraiment supprimer cette photo ?',
                                    [
                                        { text: 'Annuler', style: 'cancel' },
                                        {
                                            text: 'Supprimer',
                                            style: 'destructive',
                                            onPress: () => {
                                                if (photo?.id) {
                                                    photoDatabase.deletePhoto(photo.id);
                                                    Alert.alert('Succès', 'Photo supprimée');
                                                    router.back();
                                                }
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Ionicons name="trash" size={16} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {photo && (
                <EditPhotoModal
                    visible={showEditModal}
                    photo={photo}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => {
                        const photoId = Number(id);
                        const updatedPhoto = photoDatabase.getPhotoById(photoId);
                        setPhoto(updatedPhoto);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    editBtn: {
        backgroundColor: '#E3F2FD',
    },
    deleteBtn: {
        backgroundColor: '#FFEBEE',
    },
    editText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#007AFF',
    },
    deleteText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF3B30',
    },
});
