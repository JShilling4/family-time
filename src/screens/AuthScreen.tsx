import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const anonLogin = async () => {
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to sign in');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={{ width: '100%' }}>
          <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 16 }}>
            Welcome to Family Time
          </Text>
          {!!error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</Text>}
          <Button title="Continue Anonymously" onPress={anonLogin} />
        </View>
      )}
    </SafeAreaView>
  );
}




