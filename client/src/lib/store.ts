// MOYO Local Storage Store
// Academic Crimson Design System
// 프론트엔드 중심 MVP — localStorage 기반 데이터 관리

import { nanoid } from "nanoid";
import type { Group, Participant, Availability, TimeSlotResult } from "./types";

const KEYS = {
  GROUPS: "moyo:groups",
  PARTICIPANTS: "moyo:participants",
  AVAILABILITIES: "moyo:availabilities",
};

// ─── Group ────────────────────────────────────────────────────────────────────

export function getGroups(): Group[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.GROUPS) || "[]");
  } catch {
    return [];
  }
}

export function getGroupById(groupId: string): Group | null {
  return getGroups().find((g) => g.groupId === groupId) ?? null;
}

export function createGroup(data: Omit<Group, "groupId" | "createdAt">): Group {
  const group: Group = {
    groupId: nanoid(8).toUpperCase(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  const groups = getGroups();
  groups.push(group);
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
  return group;
}

// ─── Participant ──────────────────────────────────────────────────────────────

export function getParticipants(groupId: string): Participant[] {
  try {
    const all: Participant[] = JSON.parse(
      localStorage.getItem(KEYS.PARTICIPANTS) || "[]"
    );
    return all.filter((p) => p.groupId === groupId);
  } catch {
    return [];
  }
}

export function createParticipant(
  groupId: string,
  name: string
): Participant {
  const participant: Participant = {
    participantId: nanoid(8),
    groupId,
    name,
    joinedAt: new Date().toISOString(),
  };
  const all: Participant[] = JSON.parse(
    localStorage.getItem(KEYS.PARTICIPANTS) || "[]"
  );
  all.push(participant);
  localStorage.setItem(KEYS.PARTICIPANTS, JSON.stringify(all));
  return participant;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export function getAvailabilities(groupId: string): Availability[] {
  try {
    const all: Availability[] = JSON.parse(
      localStorage.getItem(KEYS.AVAILABILITIES) || "[]"
    );
    return all.filter((a) => a.groupId === groupId);
  } catch {
    return [];
  }
}

export function getAvailabilitiesByParticipant(
  groupId: string,
  participantId: string
): Availability[] {
  return getAvailabilities(groupId).filter(
    (a) => a.participantId === participantId
  );
}

export function saveAvailabilities(
  groupId: string,
  participantId: string,
  slots: Array<{ date: string; timeSlot: string }>
): void {
  const all: Availability[] = JSON.parse(
    localStorage.getItem(KEYS.AVAILABILITIES) || "[]"
  );
  // Remove existing entries for this participant in this group
  const filtered = all.filter(
    (a) => !(a.groupId === groupId && a.participantId === participantId)
  );
  // Add new entries
  const newEntries: Availability[] = slots.map(({ date, timeSlot }) => ({
    participantId,
    groupId,
    date,
    timeSlot,
  }));
  localStorage.setItem(
    KEYS.AVAILABILITIES,
    JSON.stringify([...filtered, ...newEntries])
  );
}

// ─── Result Calculation ───────────────────────────────────────────────────────

export function calculateResults(groupId: string): TimeSlotResult[] {
  const availabilities = getAvailabilities(groupId);
  const participants = getParticipants(groupId);

  // Count per (date, timeSlot)
  const countMap = new Map<string, Set<string>>();
  for (const a of availabilities) {
    const key = `${a.date}__${a.timeSlot}`;
    if (!countMap.has(key)) countMap.set(key, new Set());
    countMap.get(key)!.add(a.participantId);
  }

  if (countMap.size === 0) return [];

  // Build results
  const results: TimeSlotResult[] = [];
  for (const [key, participantSet] of Array.from(countMap.entries())) {
    const [date, timeSlot] = key.split("__");
    const participantNames = Array.from(participantSet).map(
      (pid) => participants.find((p) => p.participantId === pid)?.name ?? "알 수 없음"
    );
    results.push({
      date,
      timeSlot,
      count: participantSet.size,
      participants: participantNames,
      isRecommended: false,
    });
  }

  // Sort descending by count, then by date/time
  results.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.timeSlot.localeCompare(b.timeSlot);
  });

  // Mark recommended (max count)
  const maxCount = results[0]?.count ?? 0;
  for (const r of results) {
    if (r.count === maxCount) r.isRecommended = true;
  }

  return results;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

export function seedDemoData(): string {
  // Create a demo group
  const group = createGroup({
    groupName: "팀플 일정 조율",
    description: "경영학과 팀 프로젝트 미팅 시간 조율",
    startDate: "2025-06-15",
    endDate: "2025-06-21",
  });

  const names = ["김민준", "이서연", "박지호", "최유나"];
  const demoSlots: Record<string, string[]> = {
    "김민준": [
      "2025-06-15__14:00", "2025-06-15__15:00", "2025-06-16__10:00",
      "2025-06-17__13:00", "2025-06-18__14:00", "2025-06-18__15:00",
    ],
    "이서연": [
      "2025-06-15__14:00", "2025-06-15__15:00", "2025-06-15__16:00",
      "2025-06-17__13:00", "2025-06-18__14:00",
    ],
    "박지호": [
      "2025-06-15__14:00", "2025-06-16__10:00", "2025-06-16__11:00",
      "2025-06-18__14:00", "2025-06-18__15:00", "2025-06-19__09:00",
    ],
    "최유나": [
      "2025-06-15__14:00", "2025-06-15__15:00",
      "2025-06-17__13:00", "2025-06-17__14:00",
      "2025-06-18__14:00", "2025-06-18__15:00", "2025-06-18__16:00",
    ],
  };

  for (const name of names) {
    const participant = createParticipant(group.groupId, name);
    const slots = demoSlots[name].map((s) => {
      const [date, timeSlot] = s.split("__");
      return { date, timeSlot };
    });
    saveAvailabilities(group.groupId, participant.participantId, slots);
  }

  return group.groupId;
}
