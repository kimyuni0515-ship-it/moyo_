// MOYO Results Page
// Academic Crimson Design System
// 결과 화면: 공통 시간 계산, 추천 시간, 막대 그래프 시각화

import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import {
  Star, Users, Calendar, Share2, Plus, RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";
import Layout from "@/components/Layout";
import {
  getGroupById,
  getParticipants,
  calculateResults,
} from "@/lib/store";
import type { TimeSlotResult } from "@/lib/types";
import { toast } from "sonner";

const CRIMSON = "oklch(0.48 0.22 18)";
const CRIMSON_LIGHT = "oklch(0.95 0.04 18)";

function formatDateFull(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

function StarRating({ count, max }: { count: number; max: number }) {
  const stars = Math.ceil((count / max) * 4);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={12}
          fill={i <= stars ? CRIMSON : "transparent"}
          style={{ color: i <= stars ? CRIMSON : "oklch(0.85 0.003 0)" }}
        />
      ))}
    </div>
  );
}

function ResultBar({
  result,
  maxCount,
  totalParticipants,
  index,
}: {
  result: TimeSlotResult;
  maxCount: number;
  totalParticipants: number;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const percentage = maxCount > 0 ? (result.count / maxCount) * 100 : 0;
  const coveragePercent = totalParticipants > 0
    ? Math.round((result.count / totalParticipants) * 100)
    : 0;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden
        ${result.isRecommended ? "border-[oklch(0.85_0.08_18)]" : "border-border"}`}
      style={{
        backgroundColor: result.isRecommended ? CRIMSON_LIGHT : "white",
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Top Row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            {result.isRecommended && (
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-1.5"
                style={{ backgroundColor: CRIMSON }}
              >
                <Star size={9} fill="white" />
                추천
              </div>
            )}
            <div className="text-[14px] font-semibold text-foreground">
              {formatDateFull(result.date)}
            </div>
            <div className="text-[13px] text-muted-foreground mt-0.5">
              {result.timeSlot} ~ {String(parseInt(result.timeSlot) + 1).padStart(2, "0")}:00
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[18px] font-bold" style={{ color: CRIMSON }}>
                {result.count}명
              </div>
              <div className="text-[10px] text-muted-foreground">
                {coveragePercent}% 참여
              </div>
            </div>
            {expanded ? (
              <ChevronUp size={16} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={16} className="text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Bar */}
        <div className="h-2.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: CRIMSON,
              opacity: result.isRecommended ? 1 : 0.5 + (percentage / 200),
            }}
          />
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-between mt-2">
          <StarRating count={result.count} max={maxCount} />
          <span className="text-[11px] text-muted-foreground">
            {result.participants.slice(0, 3).join(", ")}
            {result.participants.length > 3 && ` 외 ${result.participants.length - 3}명`}
          </span>
        </div>
      </div>

      {/* Expanded: Participant List */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50 pt-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            참여 가능한 사람
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.participants.map((name) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded-full text-[12px] font-medium text-white"
                style={{ backgroundColor: CRIMSON }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Results() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const [, navigate] = useLocation();

  const group = getGroupById(groupId);
  const participants = getParticipants(groupId);
  const [results, setResults] = useState<TimeSlotResult[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const r = calculateResults(groupId);
    setResults(r);
  }, [groupId]);

  const refresh = () => {
    const r = calculateResults(groupId);
    setResults(r);
    toast.success("결과를 새로고침했습니다");
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/join?code=${groupId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `MOYO — ${group?.groupName}`,
          text: "일정을 입력해주세요!",
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        toast.success("참여 링크가 복사되었습니다!");
      }
    } catch {
      // User cancelled share
    }
  };

  if (!group) {
    return (
      <Layout title="결과" showBack>
        <div className="flex flex-col items-center justify-center h-64 px-5">
          <p className="text-[15px] text-muted-foreground text-center">
            그룹을 찾을 수 없습니다.
          </p>
        </div>
      </Layout>
    );
  }

  const maxCount = results[0]?.count ?? 0;
  const recommendedResults = results.filter((r) => r.isRecommended);
  const otherResults = results.filter((r) => !r.isRecommended);
  const displayedOthers = showAll ? otherResults : otherResults.slice(0, 5);

  return (
    <Layout
      title={group.groupName}
      showBack
      onBack={() => navigate("/")}
      headerRight={
        <button
          onClick={refresh}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <RefreshCw size={16} className="text-muted-foreground" />
        </button>
      }
    >
      <div className="moyo-page-enter pb-32">
        {/* Group Info Bar */}
        <div className="px-4 py-3 bg-secondary border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: CRIMSON_LIGHT }}
              >
                <Users size={13} style={{ color: CRIMSON }} />
              </div>
              <div>
                <span className="text-[13px] font-semibold text-foreground">
                  {participants.length}명 참여
                </span>
                <span className="text-[12px] text-muted-foreground ml-2">
                  코드: <span className="font-mono font-semibold">{groupId}</span>
                </span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-background transition-colors"
            >
              <Share2 size={12} />
              공유
            </button>
          </div>
        </div>

        <div className="px-4 py-5 space-y-6">
          {/* No Data State */}
          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: CRIMSON_LIGHT }}
              >
                <Calendar size={28} style={{ color: CRIMSON }} />
              </div>
              <h3 className="text-[16px] font-semibold text-foreground mb-2">
                아직 입력된 일정이 없어요
              </h3>
              <p className="text-[13px] text-muted-foreground mb-6">
                참여자들이 가능한 시간을 입력하면<br />
                공통 시간을 자동으로 찾아드립니다
              </p>
              <button
                onClick={() => navigate(`/group/${groupId}/schedule`)}
                className="flex items-center gap-2 px-5 h-11 rounded-xl text-[14px] font-semibold text-white btn-press"
                style={{ backgroundColor: CRIMSON }}
              >
                <Plus size={16} />
                내 일정 입력하기
              </button>
            </div>
          )}

          {/* Recommended Section */}
          {recommendedResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: CRIMSON }}
                >
                  <Star size={11} fill="white" className="text-white" />
                </div>
                <h2 className="text-[14px] font-bold text-foreground">추천 시간</h2>
                <span className="text-[12px] text-muted-foreground">
                  — {maxCount}명 가능
                </span>
              </div>
              <div className="space-y-3">
                {recommendedResults.map((result, i) => (
                  <ResultBar
                    key={`${result.date}__${result.timeSlot}`}
                    result={result}
                    maxCount={maxCount}
                    totalParticipants={participants.length}
                    index={i}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Results Section */}
          {otherResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-secondary border border-border flex items-center justify-center">
                  <Calendar size={11} className="text-muted-foreground" />
                </div>
                <h2 className="text-[14px] font-bold text-foreground">전체 결과</h2>
              </div>
              <div className="space-y-2">
                {displayedOthers.map((result, i) => (
                  <ResultBar
                    key={`${result.date}__${result.timeSlot}`}
                    result={result}
                    maxCount={maxCount}
                    totalParticipants={participants.length}
                    index={recommendedResults.length + i}
                  />
                ))}
              </div>
              {otherResults.length > 5 && (
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="w-full mt-3 h-10 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {showAll
                    ? "접기"
                    : `${otherResults.length - 5}개 더 보기`}
                </button>
              )}
            </div>
          )}

          {/* Participant List */}
          {participants.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-secondary border border-border flex items-center justify-center">
                  <Users size={11} className="text-muted-foreground" />
                </div>
                <h2 className="text-[14px] font-bold text-foreground">참여자</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {participants.map((p) => (
                  <div
                    key={p.participantId}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: CRIMSON }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-[13px] font-medium text-foreground">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={() => navigate(`/group/${groupId}/schedule`)}
            className="flex-1 h-[52px] rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 btn-press shadow-md"
            style={{ backgroundColor: CRIMSON }}
          >
            <Plus size={16} />
            내 일정 추가
          </button>
          <button
            onClick={handleShare}
            className="h-[52px] px-5 rounded-xl font-semibold text-[14px] text-foreground flex items-center justify-center gap-2 border border-border hover:bg-secondary transition-colors btn-press"
          >
            <Share2 size={16} />
            공유
          </button>
        </div>
      </div>
    </Layout>
  );
}
