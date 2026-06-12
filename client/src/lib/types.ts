// MOYO Data Types
// Academic Crimson Design System

export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;   // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface Participant {
  participantId: string;
  groupId: string;
  name: string;
  joinedAt: string;
}

export interface Availability {
  participantId: string;
  groupId: string;
  date: string;      // YYYY-MM-DD
  timeSlot: string;  // "09:00", "10:00", ... "21:00"
}

export interface TimeSlotResult {
  date: string;
  timeSlot: string;
  count: number;
  participants: string[];
  isRecommended: boolean;
}

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
] as const;

export type TimeSlot = typeof TIME_SLOTS[number];
