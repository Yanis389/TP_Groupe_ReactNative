import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { isDevice } from 'expo-device';


import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';

// Hook exporte pour reutiliser la localisation ailleurs dans l'app
export default function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    if (Platform.OS === 'android' && !isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
      );
      setLoading(false);
      return null;
    }

    const { status } = await requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      return null;
    }

    const current = await getCurrentPositionAsync({});
    setLocation(current);
    setLoading(false);
    return current;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { location, errorMsg, loading, refresh };
}

