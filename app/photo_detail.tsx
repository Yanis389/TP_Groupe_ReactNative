import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PhotoDetailScreen() {
    const { uri, latitude, longitude, takenAt } = useLocalSearchParams();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: uri as string }}
                style={styles.image}
                resizeMode="contain"
            />

            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>

            {(latitude || longitude || takenAt) && (
                <View style={styles.locationContainer}>
                    {takenAt && <Text style={styles.locationText}>{"Date: " + takenAt}</Text>}
                    {latitude && longitude && <Text style={styles.locationText}>{"Localisation: " + parseFloat(latitude as string).toFixed(2) + ", " + parseFloat(longitude as string).toFixed(2)}</Text>}
                </View>
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
});
