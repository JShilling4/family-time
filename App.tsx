import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { configureNotificationHandling, requestNotificationPermissions } from './src/lib/notifications';

export default function App() {
  useEffect(() => {
    configureNotificationHandling();
    requestNotificationPermissions();
  }, []);

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

