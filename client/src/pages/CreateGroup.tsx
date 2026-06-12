// MOYO CreateGroup Page
// Academic Crimson Design System
// 그룹 생성 화면: 이름, 설명, 날짜 범위 입력

import { useState } from "react";
import { useLocation } from "wouter";
import { Calendar, Copy, Check, Users, Share2 } from "lucide-react";
import Layout from "@/components/Layout";
import { createGroup } from "@/lib/store";
import { toast } from "sonner";

type Step = "form" | "created";

export default function CreateGroup() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("form");
  const [createdGroupId, setCreatedGroupId] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    groupName: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.groupName.trim()) newErrors.groupName = "그룹 이름을 입력해주세요";
    if (!form.startDate) newErrors.startDate = "시작일을 선택해주세요";
    if (!form.endDate) newErrors.endDate = "종료일을 선택해주세요";
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErrors.endDate = "종료일은 시작일 이후여야 합니다";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const group = createGroup({
      groupName: form.groupName.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
    });
    setCreatedGroupId(group.groupId);
    setStep("created");
  };

  const handleCopy = async () => {
    const link = `${window.location.origin}/join?code=${createdGroupId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("링크가 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(createdGroupId);
      toast.success("그룹 코드가 복사되었습니다!");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  if (step === "created") {
    return (
      <Layout title="그룹 생성 완료" showBack onBack={() => navigate("/")}>
        <div className="px-5 py-8 moyo-page-enter">
          {/* Success Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md"
              style={{ backgroundColor: "oklch(0.48 0.22 18)" }}
            >
              <Check size={28} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-[20px] font-bold text-foreground">그룹이 생성되었습니다!</h2>
            <p className="text-[13px] text-muted-foreground mt-1">
              아래 코드나 링크를 공유하세요
            </p>
          </div>

          {/* Group Code */}
          <div className="bg-secondary rounded-2xl p-5 mb-4 border border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              그룹 코드
            </p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[28px] font-bold tracking-[0.15em] text-foreground">
                {createdGroupId}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-lg hover:bg-border transition-colors"
              >
                <Copy size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Share Link */}
          <button
            onClick={handleCopy}
            className="w-full h-12 rounded-xl border border-border flex items-center justify-center gap-2 text-[14px] font-medium text-foreground hover:bg-secondary transition-colors mb-6 btn-press"
          >
            {copied ? (
              <>
                <Check size={16} style={{ color: "oklch(0.48 0.22 18)" }} />
                <span style={{ color: "oklch(0.48 0.22 18)" }}>링크 복사됨!</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                참여 링크 복사
              </>
            )}
          </button>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/group/${createdGroupId}/schedule`)}
              className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 btn-press"
              style={{ backgroundColor: "oklch(0.48 0.22 18)" }}
            >
              <Calendar size={18} />
              내 일정 입력하기
            </button>

            <button
              onClick={() => navigate(`/group/${createdGroupId}/results`)}
              className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-foreground flex items-center justify-center gap-2 border border-border hover:bg-secondary transition-colors btn-press"
            >
              <Users size={18} />
              결과 보기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="그룹 만들기" showBack>
      <div className="px-5 py-6 moyo-page-enter">
        <div className="mb-6">
          <h2 className="text-[20px] font-bold text-foreground">새 그룹 만들기</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            일정을 조율할 그룹을 만들어보세요
          </p>
        </div>

        <div className="space-y-5">
          {/* Group Name */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              그룹 이름 <span style={{ color: "oklch(0.48 0.22 18)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="예: 경영학과 팀플 조"
              value={form.groupName}
              onChange={(e) => {
                setForm((f) => ({ ...f, groupName: e.target.value }));
                if (errors.groupName) setErrors((e) => ({ ...e, groupName: undefined }));
              }}
              className={`w-full h-12 px-4 rounded-xl border text-[14px] outline-none transition-colors bg-background
                ${errors.groupName
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-[oklch(0.48_0.22_18)]"
                }`}
              style={!errors.groupName ? { "--tw-ring-color": "oklch(0.48 0.22 18)" } as React.CSSProperties : {}}
            />
            {errors.groupName && (
              <p className="text-[12px] text-destructive mt-1">{errors.groupName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              설명 <span className="text-muted-foreground font-normal">(선택)</span>
            </label>
            <textarea
              placeholder="예: 6월 중 팀 미팅 시간 조율"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border text-[14px] outline-none transition-colors bg-background resize-none focus:border-[oklch(0.48_0.22_18)]"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              일정 후보 기간 <span style={{ color: "oklch(0.48 0.22 18)" }}>*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">시작일</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, startDate: e.target.value }));
                    if (errors.startDate) setErrors((e) => ({ ...e, startDate: undefined }));
                  }}
                  className={`w-full h-12 px-3 rounded-xl border text-[13px] outline-none transition-colors bg-background
                    ${errors.startDate ? "border-destructive" : "border-border focus:border-[oklch(0.48_0.22_18)]"}`}
                />
                {errors.startDate && (
                  <p className="text-[11px] text-destructive mt-1">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">종료일</label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, endDate: e.target.value }));
                    if (errors.endDate) setErrors((e) => ({ ...e, endDate: undefined }));
                  }}
                  className={`w-full h-12 px-3 rounded-xl border text-[13px] outline-none transition-colors bg-background
                    ${errors.endDate ? "border-destructive" : "border-border focus:border-[oklch(0.48_0.22_18)]"}`}
                />
                {errors.endDate && (
                  <p className="text-[11px] text-destructive mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            onClick={handleCreate}
            className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 btn-press shadow-md"
            style={{ backgroundColor: "oklch(0.48 0.22 18)" }}
          >
            <Calendar size={18} />
            그룹 생성하기
          </button>
        </div>
      </div>
    </Layout>
  );
}
