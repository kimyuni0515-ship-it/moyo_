// MOYO JoinGroup Page
// Academic Crimson Design System
// 그룹 참여 화면: 그룹 코드 입력

import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Hash, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { getGroupById } from "@/lib/store";
import { toast } from "sonner";

export default function JoinGroup() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Pre-fill code from URL query param
  useEffect(() => {
    const params = new URLSearchParams(search);
    const urlCode = params.get("code");
    if (urlCode) setCode(urlCode.toUpperCase());
  }, [search]);

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("그룹 코드를 입력해주세요");
      return;
    }
    const group = getGroupById(trimmed);
    if (!group) {
      setError("존재하지 않는 그룹 코드입니다");
      toast.error("그룹을 찾을 수 없습니다", {
        description: "코드를 다시 확인해주세요",
      });
      return;
    }
    navigate(`/group/${trimmed}/schedule`);
  };

  const handleInput = (value: string) => {
    setCode(value.toUpperCase());
    if (error) setError("");
  };

  return (
    <Layout title="그룹 참여" showBack>
      <div className="px-5 py-8 moyo-page-enter">
        {/* Header */}
        <div className="mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "oklch(0.95 0.04 18)" }}
          >
            <Hash size={22} style={{ color: "oklch(0.48 0.22 18)" }} />
          </div>
          <h2 className="text-[20px] font-bold text-foreground">그룹 참여하기</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            그룹장에게 받은 코드를 입력하세요
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-foreground mb-2">
            그룹 코드
          </label>
          <input
            type="text"
            placeholder="예: AB12CD34"
            value={code}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            maxLength={8}
            className={`w-full h-14 px-5 rounded-xl border text-center font-mono text-[24px] font-bold tracking-[0.2em] outline-none transition-all duration-150 bg-background
              ${error
                ? "border-destructive bg-destructive/5"
                : "border-border focus:border-[oklch(0.48_0.22_18)]"
              }`}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
          />
          {error && (
            <p className="text-[12px] text-destructive mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleJoin}
          className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 btn-press shadow-md"
          style={{ backgroundColor: "oklch(0.48 0.22 18)" }}
        >
          참여하기
          <ArrowRight size={18} />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[12px] text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Create Group */}
        <button
          onClick={() => navigate("/create")}
          className="w-full h-12 rounded-xl border border-border text-[14px] font-medium text-foreground hover:bg-secondary transition-colors btn-press"
        >
          새 그룹 만들기
        </button>

        {/* Help Text */}
        <p className="text-[12px] text-muted-foreground text-center mt-6 leading-relaxed">
          그룹장이 공유한 링크를 클릭하거나<br />
          8자리 코드를 직접 입력하세요
        </p>
      </div>
    </Layout>
  );
}
