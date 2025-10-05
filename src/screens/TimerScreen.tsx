import { useEffect, useMemo, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { scheduleLocalNotificationAt, cancelNotification } from '../lib/notifications';
import type { Timer } from '../types/timer';

export default function TimerScreen() {
  const route = useRoute<any>();
  const timerId: string | undefined = route.params?.timerId;
  const familyId = 'demo-family';
  const [timer, setTimer] = useState<Timer | null>(null);
  const [notifId, setNotifId] = useState<string | null>(null);

  useEffect(() => {
    if (!timerId) return;
    const ref = doc(db, 'families', familyId, 'timers', timerId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any;
      if (!data) return;
      const t: Timer = {
        id: snap.id,
        familyId,
        childName: data.childName,
        status: data.status,
        durationMs: data.durationMs,
        startTime: data.startTime?.toMillis?.() ?? data.startTime ?? null,
        endTime: data.endTime?.toMillis?.() ?? data.endTime ?? null,
        createdBy: data.createdBy ?? 'anon',
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      };
      setTimer(t);
    });
    return unsub;
  }, [timerId]);

  const remainingMs = useMemo(() => {
    if (!timer) return 0;
    if (timer.status !== 'running' || !timer.startTime) return 0;
    const elapsed = Date.now() - timer.startTime;
    return Math.max(0, timer.durationMs - elapsed);
  }, [timer]);

  const start = async () => {
    if (!timerId) return;
    const ref = doc(db, 'families', familyId, 'timers', timerId);
    const startAt = Date.now();
    await updateDoc(ref, {
      status: 'running',
      startTime: startAt,
      endTime: null,
    });
    const endAt = new Date(startAt + (timer?.durationMs ?? 0));
    const id = await scheduleLocalNotificationAt(endAt, `${timer?.childName} timer finished`);
    setNotifId(id);
  };

  const stop = async () => {
    if (!timerId) return;
    const ref = doc(db, 'families', familyId, 'timers', timerId);
    await updateDoc(ref, {
      status: 'complete',
      endTime: Date.now(),
    });
    if (notifId) {
      await cancelNotification(notifId);
      setNotifId(null);
    }
  };

  const pause = async () => {
    if (!timerId || !timer) return;
    const ref = doc(db, 'families', familyId, 'timers', timerId);
    // simple pause: mark paused and adjust duration to remaining
    const remaining = remainingMs;
    await updateDoc(ref, {
      status: 'paused',
      startTime: null,
      durationMs: remaining,
    });
    if (notifId) {
      await cancelNotification(notifId);
      setNotifId(null);
    }
  };

  const resume = async () => {
    if (!timerId || !timer) return;
    const ref = doc(db, 'families', familyId, 'timers', timerId);
    const startAt = Date.now();
    await updateDoc(ref, {
      status: 'running',
      startTime: startAt,
    });
    const endAt = new Date(startAt + timer.durationMs);
    const id = await scheduleLocalNotificationAt(endAt, `${timer.childName} timer finished`);
    setNotifId(id);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {timer ? (
        <View>
          <Text style={{ fontSize: 24, fontWeight: '600' }}>{timer.childName}</Text>
          <Text style={{ marginTop: 8 }}>Status: {timer.status}</Text>
          <Text style={{ marginTop: 8 }}>Remaining: {Math.ceil(remainingMs / 1000)}s</Text>
          <View style={{ marginTop: 16, gap: 8 }}>
            {timer.status !== 'running' && <Button title="Start" onPress={start} />}
            {timer.status === 'running' && <Button title="Pause" onPress={pause} />}
            {timer.status === 'paused' && <Button title="Resume" onPress={resume} />}
            <Button title="Stop" onPress={stop} />
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
}




