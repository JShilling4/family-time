export type TimerStatus = 'idle' | 'running' | 'paused' | 'complete';

export interface Timer {
  id: string;
  familyId: string;
  childName: string;
  status: TimerStatus;
  durationMs: number;
  startTime: number | null; // milliseconds since epoch (from serverTimestamp)
  endTime: number | null;   // milliseconds since epoch
  createdBy: string;
  createdAt: number;        // milliseconds since epoch
}




