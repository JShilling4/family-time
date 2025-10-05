import { useEffect, useMemo, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Timer } from '../types/timer';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [childName, setChildName] = useState('');
  const [minutes, setMinutes] = useState('20');
  const [timers, setTimers] = useState<Timer[]>([]);
  const familyId = 'demo-family';

  useEffect(() => {
    const timersRef = collection(db, 'families', familyId, 'timers');
    const q = query(timersRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: Timer[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          familyId,
          childName: data.childName,
          status: data.status,
          durationMs: data.durationMs,
          startTime: data.startTime?.toMillis?.() ?? data.startTime ?? null,
          endTime: data.endTime?.toMillis?.() ?? data.endTime ?? null,
          createdBy: data.createdBy ?? 'anon',
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        } as Timer;
      });
      setTimers(list);
    });
    return unsub;
  }, []);

  const createTimer = async () => {
    const durationMs = Math.max(1, Number(minutes)) * 60 * 1000;
    const timersRef = collection(db, 'families', familyId, 'timers');
    await addDoc(timersRef, {
      childName: childName || 'Child',
      status: 'idle',
      durationMs,
      startTime: null,
      endTime: null,
      createdBy: 'anon',
      createdAt: serverTimestamp(),
    });
    setChildName('');
    setMinutes('20');
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Timers</Text>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <TextInput
          placeholder="Child name"
          value={childName}
          onChangeText={setChildName}
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Minutes"
          value={minutes}
          keyboardType="number-pad"
          onChangeText={setMinutes}
          style={{ width: 90, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }}
        />
        <Button title="Create" onPress={createTimer} />
      </View>

      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.childName}</Text>
            <Text style={{ color: '#555' }}>{item.status} • {(item.durationMs / 60000).toFixed(0)}m</Text>
            <View style={{ marginTop: 6 }}>
              <Button title="Open" onPress={() => navigation.navigate('Timer', { timerId: item.id })} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}



