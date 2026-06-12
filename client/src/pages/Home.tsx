// MOYO Home Page
// Academic Crimson Design System
// 홈 화면: 로고, 소개 문구, 그룹 생성/참여 버튼

import { useLocation } from "wouter";
import { Users, Calendar, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { seedDemoData, getGroups } from "@/lib/store";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663756416099/nSTZVgifKA65ByzXi9ZwNh/moyo-logo-gL7fDwGW9iZ3MYX2NzeQAs.webp";
const HERO_BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663756416099/nSTZVgifKA65ByzXi9ZwNh/moyo-hero-bg-BpnDoymiu2XqRQcBLRzsyv.webp";

export default function Home() {
  const [, navigate] = useLocation();
  const [demoGroupId, setDemoGroupId] = useState<string | null>(null);

  useEffect(() => {
    // Check if demo data already exists
    const groups = getGroups();
    if (groups.length > 0) {
      setDemoGroupId(groups[0].groupId);
    }
  }, []);

  const handleSeedDemo = () => {
    const groupId = seedDemoData();
    setDemoGroupId(groupId);
    toast.success("데모 데이터가 생성되었습니다!", {
      description: "4명의 참여자 일정이 입력된 그룹을 확인해보세요.",
    });
    navigate(`/group/${groupId}/results`);
  };

  return (
    <div className="min-h-screen flex flex-col moyo-page-enter bg-background">
      {/* Hero Section */}
      <div
        className="relative flex-1 flex flex-col"
        style={{
          backgroundImage: `url(${HERO_BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Top Nav */}
        <header className="px-5 pt-12 pb-4 flex items-center justify-center max-w-lg mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="MOYO 로고"
              className="w-10 h-10 rounded-xl shadow-sm"
            />
            <div>
              <div className="text-xl font-bold tracking-tight text-foreground">MOYO</div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">모여</div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-lg mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-[11px] font-semibold mb-6 border" style={{ color: 'oklch(0.48 0.22 18)', borderColor: 'oklch(0.85 0.08 18)' }}>
            <Sparkles size={11} />
            고려대학교 일정 조율 서비스
          </div>

          {/* Headline */}
          <h1 className="text-[28px] font-bold leading-tight text-foreground mb-3 tracking-tight">
            여럿이 모일 때<br />
            <span style={{ color: "oklch(0.48 0.22 18)" }}>가장 빠른</span> 일정 조율
          </h1>

          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xs">
            가능한 시간만 체크하면<br />
            공통 시간을 자동으로 찾아드립니다.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-8 mb-10">
            {["팀플", "스터디", "동아리", "친구 모임"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/80 border border-border text-[12px] font-medium text-muted-foreground shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={() => navigate("/create")}
              className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 shadow-md btn-press transition-all duration-150"
              style={{ backgroundColor: "oklch(0.48 0.22 18)" }}
            >
              <Calendar size={18} />
              그룹 만들기
              <ChevronRight size={16} className="ml-auto" />
            </button>

            <button
              onClick={() => navigate("/join")}
              className="w-full h-[52px] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 bg-white border border-border text-foreground shadow-sm btn-press transition-all duration-150 hover:bg-secondary"
            >
              <Users size={18} />
              그룹 참여하기
              <ChevronRight size={16} className="ml-auto text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="px-6 pb-8 max-w-lg mx-auto w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-border p-5 shadow-sm">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              이렇게 사용해요
            </p>
            <div className="space-y-3">
              {[
                { step: "1", text: "그룹을 만들고 코드를 공유해요" },
                { step: "2", text: "각자 가능한 시간을 선택해요" },
                { step: "3", text: "공통 시간을 자동으로 확인해요" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.48 0.22 18)" }}
                  >
                    {step}
                  </div>
                  <span className="text-[13px] text-foreground">{text}</span>
                </div>
              ))}
            </div>

            {/* Demo Button */}
            <button
              onClick={handleSeedDemo}
              className="mt-4 w-full h-9 rounded-lg text-[12px] font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
            >
              ✨ 데모 결과 미리보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
