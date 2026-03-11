import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: '#007AFF',
          headerShown: true,
        }}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Profil',
            title: 'Profil',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: 'Déconnexion',
            title: 'Déconnexion',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-out" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
