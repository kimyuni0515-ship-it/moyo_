// MOYO Schedule Page
// Academic Crimson Design System
// 일정 입력 화면: 이름 입력 → 날짜별 시간 선택 캘린더

import { useState, useCallback, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { ChevronLeft, ChevronRight, Check, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { getGroupById, createParticipant, saveAvailabilities } from "@/lib/store";
import { TIME_SLOTS } from "@/lib/types";
import { toast } from "sonner";

const CRIMSON = "oklch(0.48 0.22 18)";
const CRIMSON_LIGHT = "oklch(0.95 0.04 18)";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
    full: `${d.getMonth() + 1}월 ${d.getDate()}일`,
  };
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  while (cur <= endDate) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

type Step = "name" | "schedule";

export default function Schedule() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const [, navigate] = useLocation();

  const group = getGroupById(groupId);

  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  // Selected slots: Set of "date__timeSlot"
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  // Calendar navigation
  const dates = group ? getDatesInRange(group.startDate, group.endDate) : [];
  const [dateOffset, setDateOffset] = useState(0);
  const DATES_PER_PAGE = 5;
  const visibleDates = dates.slice(dateOffset, dateOffset + DATES_PER_PAGE);

  // Drag selection
  const isDragging = useRef(false);
  const dragAction = useRef<"add" | "remove">("add");

  const toggleSlot = useCallback((date: string, timeSlot: string) => {
    const key = `${date}__${timeSlot}`;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleMouseDown = (date: string, timeSlot: string) => {
    const key = `${date}__${timeSlot}`;
    isDragging.current = true;
    dragAction.current = selectedSlots.has(key) ? "remove" : "add";
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (dragAction.current === "add") next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const handleMouseEnter = (date: string, timeSlot: string) => {
    if (!isDragging.current) return;
    const key = `${date}__${timeSlot}`;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (dragAction.current === "add") next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      setNameError("이름을 입력해주세요");
      return;
    }
    setStep("schedule");
  };

  const handleSave = () => {
    if (!group) return;
    if (selectedSlots.size === 0) {
      toast.error("최소 1개 이상의 시간을 선택해주세요");
      return;
    }

    const participant = createParticipant(groupId, name.trim());
    const slots = Array.from(selectedSlots).map((key) => {
      const [date, timeSlot] = key.split("__");
      return { date, timeSlot };
    });
    saveAvailabilities(groupId, participant.participantId, slots);

    toast.success("일정이 저장되었습니다!", {
      description: `${selectedSlots.size}개의 시간대가 등록되었습니다.`,
    });
    navigate(`/group/${groupId}/results`);
  };

  if (!group) {
    return (
      <Layout title="일정 입력" showBack>
        <div className="flex flex-col items-center justify-center h-64 px-5">
          <p className="text-[15px] text-muted-foreground text-center">
            그룹을 찾을 수 없습니다.<br />코드를 다시 확인해주세요.
          </p>
          <button
            onClick={() => navigate("/join")}
            className="mt-4 px-6 h-10 rounded-xl text-[14px] font-medium text-white btn-press"
            style={{ backgroundColor: CRIMSON }}
          >
            그룹 참여하기
          </button>
        </div>
      </Layout>
    );
  }

  // Step 1: Name Input
  if (step === "name") {
    return (
      <Layout title={group.groupName} showBack>
        <div className="px-5 py-8 moyo-page-enter">
          {/* Group Info */}
          <div className="bg-secondary rounded-2xl p-4 mb-8 border border-border">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: CRIMSON_LIGHT }}
              >
                <Users size={16} style={{ color: CRIMSON }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">{group.groupName}</p>
                {group.description && (
                  <p className="text-[12px] text-muted-foreground mt-0.5">{group.description}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatDate(group.startDate).full} ~ {formatDate(group.endDate).full}
                </p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-foreground mb-2">
              이름을 입력해주세요
            </label>
            <input
              type="text"
              placeholder="예: 김민준"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              className={`w-full h-12 px-4 rounded-xl border text-[14px] outline-none transition-colors bg-background
                ${nameError ? "border-destructive" : "border-border focus:border-[oklch(0.48_0.22_18)]"}`}
              autoFocus
            />
            {nameError && (
              <p className="text-[12px] text-destructive mt-1">{nameError}</p>
            )}
          </div>

          <p className="text-[12px] text-muted-foreground mb-8">
            이름은 다른 참여자들에게 공개됩니다
          </p>

          <button
            onClick={handleNameSubmit}
            className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 btn-press shadow-md"
            style={{ backgroundColor: CRIMSON }}
          >
            다음 — 시간 선택
          </button>
        </div>
      </Layout>
    );
  }

  // Step 2: Time Selection
  return (
    <Layout
      title={group.groupName}
      showBack
      onBack={() => setStep("name")}
      headerRight={
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-[13px] font-semibold px-3 py-1.5 rounded-lg text-white btn-press"
          style={{ backgroundColor: CRIMSON }}
        >
          <Check size={14} />
          저장
        </button>
      }
    >
      <div
        className="moyo-page-enter"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Selected count banner */}
        <div className="px-4 h-[44px] flex items-center justify-between border-b border-border bg-background sticky top-14 z-40">
            <span className="text-[13px] text-muted-foreground">
              <span className="font-semibold" style={{ color: CRIMSON }}>
                {selectedSlots.size}개
              </span>
              {" "}선택됨
            </span>
            {selectedSlots.size > 0 && (
              <button
                onClick={() => setSelectedSlots(new Set())}
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                전체 해제
              </button>
            )}
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${DATES_PER_PAGE * 72 + 56}px` }}>
            {/* Date Header */}
            <div className="flex sticky top-[calc(3.5rem+44px)] z-30 bg-background border-b border-border">
              {/* Navigation */}
              <div className="w-14 flex-shrink-0 flex flex-col items-center justify-end pb-2">
                <div className="flex gap-0.5">
                  <button
                    onClick={() => setDateOffset(Math.max(0, dateOffset - DATES_PER_PAGE))}
                    disabled={dateOffset === 0}
                    className="w-5 h-5 rounded flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => setDateOffset(Math.min(dates.length - DATES_PER_PAGE, dateOffset + DATES_PER_PAGE))}
                    disabled={dateOffset + DATES_PER_PAGE >= dates.length}
                    className="w-5 h-5 rounded flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {visibleDates.map((date) => {
                const { month, day, weekday, isWeekend } = formatDate(date);
                return (
                  <div
                    key={date}
                    className="flex-1 text-center py-2.5 px-1"
                    style={{ minWidth: "72px" }}
                  >
                    <div
                      className="text-[10px] font-medium mb-1"
                      style={{ color: isWeekend ? CRIMSON : "oklch(0.55 0.008 0)" }}
                    >
                      {weekday}
                    </div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {month}/{day}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="pb-32">
              {TIME_SLOTS.map((timeSlot) => (
                <div key={timeSlot} className="flex border-b border-border/50">
                  {/* Time Label */}
                  <div className="w-14 flex-shrink-0 flex items-center justify-center py-1.5">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {timeSlot}
                    </span>
                  </div>

                  {/* Slot Cells */}
                  {visibleDates.map((date) => {
                    const key = `${date}__${timeSlot}`;
                    const isSelected = selectedSlots.has(key);
                    return (
                      <div
                        key={date}
                        className="flex-1 p-1"
                        style={{ minWidth: "72px" }}
                      >
                        <div
                          className={`h-10 rounded-lg border transition-all duration-100 flex items-center justify-center select-none cursor-pointer
                            ${isSelected
                              ? "border-transparent"
                              : "border-border hover:border-[oklch(0.85_0.08_18)] hover:bg-[oklch(0.97_0.02_18)]"
                            }`}
                          style={isSelected ? {
                            backgroundColor: CRIMSON,
                            borderColor: CRIMSON,
                          } : {}}
                          onMouseDown={() => handleMouseDown(date, timeSlot)}
                          onMouseEnter={() => handleMouseEnter(date, timeSlot)}
                          onTouchStart={() => toggleSlot(date, timeSlot)}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-5 py-4">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleSave}
              disabled={selectedSlots.size === 0}
              className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 btn-press shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: CRIMSON }}
            >
              <Check size={18} />
              {selectedSlots.size > 0
                ? `${selectedSlots.size}개 시간 저장하기`
                : "시간을 선택해주세요"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
