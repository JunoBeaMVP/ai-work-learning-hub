/**
 * 필드 노트 라이브러리: 공공·농업 업무 담당자를 위한 절제된 에디토리얼 지식 아카이브.
 * 따뜻한 종이색, 재배 녹색, 열린 서가형 인덱스를 유지하고 모든 동작을 즉시 실행 가능하게 설계한다.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookOpen,
  Check,
  Clipboard,
  ExternalLink,
  FileDown,
  Leaf,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Resource = {
  id: number;
  title: string;
  summary: string;
  category: string;
  links: { label: string; href: string }[];
  tag?: string;
};

type Prompt = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  prompt: string;
};

const categories = ["전체", "문서·요약", "리서치·검색", "에이전트", "프롬프트·자동화", "기초 참고"];

const resources: Resource[] = [
  { id: 1, title: "GSG HWP", summary: "한글 문서를 다루는 오픈소스 도구 저장소입니다.", category: "문서·요약", tag: "GitHub", links: [{ label: "저장소 열기", href: "https://github.com/innae1121-bit/gsghwp" }] },
  { id: 2, title: "Lilys AI", summary: "영상·문서 내용을 빠르게 요약하고 핵심을 파악합니다.", category: "문서·요약", tag: "요약", links: [{ label: "Lilys AI 열기", href: "https://lilys.ai/home" }] },
  { id: 3, title: "Liner AI", summary: "학술 자료와 웹 정보를 검색·정리할 수 있는 리서치 도구입니다.", category: "리서치·검색", tag: "학술검색", links: [{ label: "Liner 열기", href: "https://app.liner.com" }] },
  { id: 4, title: "Manus", summary: "범용 자율형 AI 에이전트로 조사, 문서화, 제작 업무를 연결합니다.", category: "에이전트", tag: "AI 에이전트", links: [{ label: "Manus 열기", href: "https://manus.im" }] },
  { id: 5, title: "Genspark", summary: "리서치와 산출물 제작을 하나로 연결하는 올인원 에이전트 AI입니다.", category: "에이전트", tag: "AI 에이전트", links: [{ label: "Genspark 열기", href: "https://www.genspark.ai" }] },
  { id: 6, title: "Gemini Notebook", summary: "자료를 근거로 대화하며 지식을 정리하는 AI 기반 리서치 파트너입니다.", category: "리서치·검색", tag: "지식관리", links: [{ label: "Notebook 열기", href: "https://notebook.google.com" }] },
  { id: 7, title: "정부자료 자연어 검색", summary: "정부 자료를 자연어 질의로 탐색하는 검색 서비스입니다.", category: "리서치·검색", tag: "공공데이터", links: [{ label: "검색 서비스 열기", href: "https://korea-onegov.vercel.app" }] },
  { id: 8, title: "농업기술특허 검색", summary: "농업기술 특허 관련 정보를 탐색할 수 있는 서비스입니다.", category: "리서치·검색", tag: "농업기술", links: [{ label: "ATIPSUM 열기", href: "https://atipsum.lovable.app/?_swreset=1786890701948" }] },
  { id: 9, title: "모두의 공공 AX 사례", summary: "공공 분야의 AI 전환 사례를 살펴볼 수 있는 공개 자료입니다.", category: "기초 참고", tag: "사례", links: [{ label: "사례 보기", href: "https://hollobit.github.io/PAX" }] },
  { id: 10, title: "온디바이스 AI", summary: "인터넷 연결 없이도 활용 가능한 Google AI Edge Gallery 앱입니다.", category: "에이전트", tag: "모바일", links: [{ label: "Android", href: "https://play.google.com/store/apps/details?id=com.google.ai.edge.gallery&hl=ko" }, { label: "iOS", href: "https://apps.apple.com/us/app/google-ai-edge-gallery/id6749645337" }] },
  { id: 11, title: "마크다운 사용법", summary: "문서·프롬프트를 더 읽기 좋게 작성하는 마크다운 문법 참고 자료입니다.", category: "기초 참고", tag: "가이드", links: [{ label: "가이드 읽기", href: "http://taewan.kim/post/markdown" }] },
  { id: 12, title: "Harness 100", summary: "하네스 프롬프트 사례를 모아둔 공개 저장소입니다.", category: "프롬프트·자동화", tag: "프롬프트", links: [{ label: "저장소 열기", href: "https://github.com/revfactory/harness-100" }] },
  { id: 13, title: "Harness 리서치 참고", summary: "하네스 100 리서치 스킬의 답변 예시를 참고할 수 있습니다.", category: "프롬프트·자동화", tag: "예시", links: [{ label: "답변 참고", href: "https://chatgpt.com/share/6a83f212-d714-83ee-be52-ba6e72b2a688" }] },
  { id: 14, title: "DalGak", summary: "업무 목적에 맞는 프롬프트를 구성할 때 활용하는 프롬프트 생성 서비스입니다.", category: "프롬프트·자동화", tag: "프롬프트", links: [{ label: "DalGak 열기", href: "https://dalgak.com" }] },
  { id: 15, title: "법령 검색 MCP", summary: "법령 관련 질의에 활용할 수 있는 MCP 연결 정보입니다.", category: "프롬프트·자동화", tag: "MCP", links: [{ label: "MCP 주소 열기", href: "https://mcp.gomdori.app/law" }] },
  { id: 16, title: "국가통계 MCP", summary: "국가통계 관련 질의에 활용할 수 있는 MCP 연결 정보입니다.", category: "프롬프트·자동화", tag: "MCP", links: [{ label: "MCP 주소 열기", href: "https://mcp.gomdori.app/stats" }] },
  { id: 17, title: "이미지패턴 프롬프트 컬렉션", summary: "이미지 생성 프롬프트의 구조와 표현을 벤치마킹할 수 있는 모음입니다.", category: "프롬프트·자동화", tag: "벤치마킹", links: [{ label: "컬렉션 열기", href: "https://shorturl.ly/EtkUc" }] },
  { id: 18, title: "Prompts3", summary: "다양한 용도의 프롬프트 사례를 탐색하는 참고 서비스입니다.", category: "프롬프트·자동화", tag: "벤치마킹", links: [{ label: "Prompts3 열기", href: "https://prompts3.com" }] },
];

const downloadFiles = [
  { id: "01", title: "공고서", description: "저탄소 농산물 인증 컨설턴트 교육 프로그램 개발 및 양성교육 지원", format: "PDF", href: "/manus-storage/low-carbon-consultant-notice_36838328.pdf" },
  { id: "02", title: "제안요청서", description: "저탄소 농산물 인증 컨설턴트 교육 프로그램 개발 및 양성교육 지원", format: "PDF", href: "/manus-storage/low-carbon-consultant-rfp_e22bf2c9.pdf" },
  { id: "03", title: "보도자료", description: "우리 농산물, 더 넓은 시장으로 — 저탄소 인증 농가 판로 개척 지원", format: "PDF", href: "/manus-storage/low-carbon-market-press-release_359634d4.pdf" },
  { id: "04", title: "일일 환경·농업기술 뉴스 요약", description: "최근 24시간 농업기술·스마트팜·에너지 뉴스를 요약하는 Skill 파일", format: "MD", href: "/manus-storage/daily-agritech-news-skill_9b8f5581.md" },
  { id: "05", title: "44 Market Research 자료", description: "시장 조사 관련 실습 자료 압축 파일", format: "ZIP", href: "/manus-storage/market-research-materials_b4a8afb3.zip" },
];

const prompts: Prompt[] = [
  {
    id: "rfp",
    title: "RFP 초안 검증",
    eyebrow: "하네스 프롬프트 사례",
    description: "과업 범위·요구사항·산출물·일정·제출요건의 누락과 수치 불일치를 점검합니다.",
    prompt: `[역할]\n당신은 RFP(제안요청서) 초안 검증관입니다.\nRFP의 \"과업 범위·요구사항·산출물·일정·제출요건\"이 빠짐없이 있고, 원문/공고 조건과 숫자·날짜가 일치하는지 점검하십시오.\n\n[입력]\n- 문서 메타데이터:\n  - 문서ID: [문서ID]\n  - 공고/요청 맥락: [공고명], [공고일], [마감일], [담당부서]\n  - 문서등급: [문서등급]\n  - 대상독자: [대상독자]\n- 근거(선택): 공고문/원문 RFP/양식/연구개발비 기준 발췌\n<<<CONTEXT>>>\n[관련 기준 텍스트]\n<<<END>>>\n- 검증대상 RFP 초안:\n<<<RFP_DRAFT>>>\n[검증대상 텍스트]\n<<<END>>>\n\n[검증 규칙(우선)]\n1) REQ-RFP-001~008: 목적/범위/요구사항/산출물/일정/제출서류/평가기준/예산 항목\n2) NUM: 일정 날짜, 예산, 기간, 산출물 개수의 불일치\n3) SENS: 확정 불가 사항의 확정 표현(보장/확정/단정), 대외비 표현\n4) FMT: 요구사항은 \"필수/선택\"으로 구조화, 산출물은 \"이름/형식/납기\" 필드 고정\n\n[출력 형식]\n- Markdown 리포트\n- 추가: \"RFP 체크리스트\" 섹션을 포함하여, 항목별 PASS/FAIL/UNKNOWN을 표로 출력\n\n[제약]\n- 컨텍스트에 없는 정보를 새로 만들지 마십시오.`,
  },
  {
    id: "press",
    title: "공공기관 보도자료 작성",
    eyebrow: "단계형 작성 프롬프트",
    description: "PREP+Style 구조에 따라 필요한 정보를 단계적으로 수집한 뒤 보도자료 초안을 작성합니다.",
    prompt: `# Role: 전문 PR 카피라이터 및 보도자료 작성 봇\n당신은 공공기관 및 기업의 언론 홍보를 담당하는 10년 차 전문 PR 카피라이터입니다. 당신의 목표는 사용자와 상호작용하며 가장 효과적이고 논리적인 보도자료를 작성하는 것입니다.\n\n지금부터 '보도자료 구조화 가이드(PREP+Style)'에 따라 사용자에게 필요한 정보를 단계별로 요청하여 수집하고, 모든 정보가 취합되면 최종 보도자료를 작성해 주세요.\n\n## [진행 규칙]\n1. 한 번에 모든 질문을 쏟아내지 말고, Step 1부터 Step 6까지 순차적으로 하나씩 질문해 주세요.\n2. 사용자가 이전 단계의 답변을 완료하면, 내용을 요약해 주고 다음 단계의 질문을 제시하세요.\n3. 사용자가 답변을 어려워하면 \"예를 들어, [예시]와 같이 답변해주시면 됩니다.\"라며 예시를 제공하여 도움을 주세요.\n4. 모든 단계(Step 1~6)의 답변이 완료되면, 수집된 정보를 바탕으로 즉시 완성된 보도자료 초안을 작성해 주세요.\n\n## [질문 단계별 가이드]\n### Step 1. Point (핵심 내용 파악)\n- 질문: 작성하실 보도자료의 가장 핵심적인 메시지나 독자(국민/고객)가 반드시 알아야 할 주요 정보는 무엇인가요?\n### Step 2. Reason (이유 및 배경 파악)\n- 질문: 이 발표가 왜 중요하며, 어떤 사회적·경제적 배경 또는 기존 문제점에서 시작되었나요?\n### Step 3. Evidence (증거 및 사실 수집)\n- 질문: 핵심 내용을 뒷받침할 객관적인 데이터, 통계 자료, 소요 예산, 기대 효과 수치 등 구체적인 팩트가 있다면 알려주세요.\n### Step 4. Structure (글의 구조 설계)\n- 질문: 기본 추천 구조(발표 배경 → 주요 내용 → 기대 효과 → 향후 일정 및 문의처)로 진행할까요, 아니면 특별한 단락 구성이 있으신가요?\n### Step 5. Style (문체 및 스타일 지정)\n- 질문: 어떤 톤앤매너로 작성할까요? 특별히 피해야 할 전문 용어가 있는지도 알려주세요.\n### Step 6. Additional (추가 요청사항)\n- 질문: 기관장·담당자의 인용구, 표로 정리할 핵심 요건, 기사 하단 요약문 등 추가 요청사항이 있나요?\n\n## [최종 결과물 출력]\n1. [보도일시]: (기본값: 즉시 보도)\n2. [제목]: (메인 타이틀과 서브 타이틀 구성)\n3. [본문]: (수집된 구조와 스타일에 맞춰 작성)\n4. [인용구]: (자연스럽게 본문에 삽입)\n5. [붙임/핵심요약]: (필요시 하단에 요약표 또는 Q&A 배치)\n\n이제 첫 번째 인사와 함께 Step 1. Point에 대한 질문을 시작하며 사용자를 안내해 주세요.`,
  },
  {
    id: "news",
    title: "일일 환경 뉴스 요약 Skill",
    eyebrow: "Skill.md 생성 예시",
    description: "농업기술·스마트팜·에너지 관련 최신 뉴스를 수집하고 표로 정리하도록 지시합니다.",
    prompt: `일일 환경 뉴스 요약\n\n매일 최신 농업기술 관련 뉴스 5건을 수집하고, 각 기사의 핵심 내용을 3문장으로 요약하여 마크다운 표 형태로 정리하기\n\n1단계: 뉴스 수집\n- 검색 도구를 사용하여 오늘 날짜 기준 24시간 이내에 발행된 농업기술, 스마트팜 또는 에너지 관련 한국어 뉴스 기사를 n개 찾는다.\n- 각 기사의 제목, 출처(언론사), URL, 발행 시간을 기록한다.\n\n2단계: 핵심 내용 추출\n- 이 기사가 다루는 핵심 사건 또는 발표 내용 (1문장)\n- 그것이 왜 중요한지 또는 어떤 영향을 미치는지 (1문장)\n- 독자가 알아야 할 추가 맥락 (1문장)\n\n3단계: 결과물 정리\n- 추출한 내용을 마크다운 표로 정리한다.`,
  },
  {
    id: "settings",
    title: "맞춤형 응답 설정",
    eyebrow: "기본 지침 템플릿",
    description: "정확성, 과업 완수, 명료성, 간결성을 우선하는 응답 원칙입니다.",
    prompt: `다음 지침을 모든 응답에 기본 적용한다. 상위 지침과 충돌하면 상위 지침을 따른다. 정확성, 과업 완수, 명료성, 간결성 순으로 우선한다.\n\n1. 사실과 판단\n검증 가능한 사실과 해석·권고가 섞여 구분이 중요하면 각각 표시한다. 불확실한 내용은 추측하지 말고 모르는 부분, 이유, 확신도 또는 확인 방법을 밝힌다. 구조화할 때 중복을 통합하고 누락을 점검한다. 추상적 설명에는 도움이 되는 구체적 예시를 1개 이상 든다.\n\n2. 해석과 질문\n모호하지만 합리적으로 진행 가능하면 첫 문장에 가정을 짧게 밝히고 답한다. 해석에 따라 결과가 크게 달라지거나 되돌리기 어렵다면 실행 전 핵심 질문만 한 번에 묻는다. 이미 받은 정보는 다시 묻지 않는다.\n\n3. 검색과 출처\n최신 정보, 내부 지식만으로 검증하기 어려운 정보, 의료·법률·재무 등 고위험 정보, 사용자가 검증을 요청한 정보는 가능한 도구로 확인한다. 공식 발표, 원문, 공시, 법령, 원논문 등 1차 자료를 우선하고 핵심 주장 가까이에 직접 링크를 붙인다.\n\n4. 답변 형식\n한국어 합니다체로 쓴다. 첫 1~2문장에 결론을 제시한 뒤 근거와 세부 내용을 설명한다. 병렬 항목 3개 이상일 때 불릿을, 비교 축 2개 이상일 때만 표를 사용한다.\n\n5. 작업 방식\n분석·요약·설명·브레인스토밍은 대화 안에서 제공한다. 복잡한 작업은 계획, 실행, 검증, 요약 순으로 진행하고 단순 작업에는 계획을 생략한다.\n\n6. 반론 점검\n중요한 분석·의사결정·논쟁적 주제에는 결론에 영향을 주는 반론·누락·한계를 최대 3개 제시한다.`,
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-record group grid gap-4 border-b border-[#d5ded2] py-6 transition duration-200 hover:border-[#1f5a45] sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
      <div className="flex items-center gap-3 sm:block">
        <span className="font-serif text-4xl font-black leading-none tracking-[-0.07em] text-[#1f5a45]/75 transition group-hover:text-[#1f5a45] sm:text-5xl">{String(resource.id).padStart(2, "0")}</span>
        <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#758379] sm:block"><span className="inline-block size-1.5 rounded-full bg-[#6d9b78]" />{resource.category}</span>
      </div>
      <div>
        <div className="flex items-center gap-2"><span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#6d8372]">{resource.tag}</span><span className="h-px w-6 bg-[#b7c8b7]" /></div>
        <h3 className="mt-1 font-serif text-2xl font-bold tracking-[-0.045em] text-[#1f2922]">{resource.title}</h3>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#68746a]">{resource.summary}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {resource.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 border-b border-[#8fa794] pb-1 text-xs font-bold text-[#285f49] transition hover:border-[#1f5a45] hover:text-[#163e2d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c98b3c]">
            {link.label}<ArrowUpRight size={14} strokeWidth={2.25} />
          </a>
        ))}
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [openPrompt, setOpenPrompt] = useState("rfp");
  const [copied, setCopied] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredResources = useMemo(() => {
    const search = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const inCategory = activeCategory === "전체" || resource.category === activeCategory;
      const inSearch = !search || `${resource.title} ${resource.summary} ${resource.category} ${resource.tag}`.toLowerCase().includes(search);
      return inCategory && inSearch;
    });
  }, [activeCategory, query]);

  const copyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(prompt.id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f6f0] text-[#263128]">
      <header className="sticky top-0 z-40 border-b border-[#dfe3dc]/90 bg-[#f7f6f0]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-5 lg:px-9">
          <a href="#top" className="flex items-center gap-3" aria-label="AI 업무활용 학습자료 처음으로">
            <span className="flex size-12 items-center justify-center border border-[#b5cab9] bg-[#e7f0e8] shadow-sm"><img src="/manus-storage/ai-fieldnotes-mark_b81fb047.png" alt="" className="size-9 object-contain" /></span>
            <span className="leading-tight"><strong className="block font-serif text-[17px] tracking-[-0.04em] text-[#1f3127]">AI 업무활용</strong><span className="block text-[10px] font-bold tracking-[0.16em] text-[#6b776d]">LEARNING LIBRARY</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#556258] lg:flex">
            <a className="hover:text-[#1f5a45]" href="#tools">참고 도구</a>
            <a className="hover:text-[#1f5a45]" href="#prompts">실무 프롬프트</a>
            <a className="hover:text-[#1f5a45]" href="#download">첨부 자료</a>
          </nav>
          <a href="#download" className="hidden items-center gap-2 rounded-xl bg-[#1f5a45] px-4 py-2.5 text-sm font-bold text-white shadow-[0_7px_16px_rgba(31,90,69,0.18)] transition hover:bg-[#164633] active:scale-[.97] sm:flex"><FileDown size={16} /> 자료 내려받기</a>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="flex size-10 items-center justify-center rounded-xl border border-[#dce1d9] bg-white text-[#1f5a45] lg:hidden" aria-label="메뉴 열기">{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {mobileMenu && <nav className="border-t border-[#dfe3dc] bg-[#f7f6f0] px-5 py-4 lg:hidden"><div className="flex flex-col gap-3 text-sm font-bold text-[#526056]"><a onClick={() => setMobileMenu(false)} href="#tools">참고 도구</a><a onClick={() => setMobileMenu(false)} href="#prompts">실무 프롬프트</a><a onClick={() => setMobileMenu(false)} href="#download">첨부 자료</a></div></nav>}
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden border-b border-[#dce1d9] bg-[#e9eee6]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,246,240,1)_0%,rgba(247,246,240,.96)_37%,rgba(247,246,240,.38)_65%,rgba(247,246,240,.12)_100%)]" />
          <img src="/manus-storage/ai-fieldnotes-hero_f23f85c8.jpg" alt="농업 연구 노트와 잎사귀로 구성된 학습자료 배경" className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
          <div className="relative mx-auto grid min-h-[560px] max-w-[1500px] items-end px-5 pb-14 pt-16 lg:grid-cols-[280px_minmax(0,720px)_1fr] lg:px-9 lg:pb-20">
            <div className="hidden self-stretch border-r border-[#ced8cd] pt-5 lg:block"><div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-[#54745f]"><img src="/manus-storage/ai-fieldnotes-mark_b81fb047.png" alt="" className="size-5 object-contain" /> KOFATI LEARNING NOTE</div><span className="mt-10 block font-serif text-7xl font-black tracking-[-0.09em] text-[#1f5a45]/25">01</span></div>
            <div className="max-w-2xl pl-0 lg:pl-12">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b8c9bb] bg-[#f9faf6]/85 px-3 py-1.5 text-xs font-bold text-[#2c694f]"><Sparkles size={14} /> 한국농업기술진흥원 · 강의 참고자료</p>
              <h1 className="font-serif text-5xl font-black leading-[1.08] tracking-[-0.065em] text-[#173827] sm:text-6xl lg:text-7xl">업무에 바로 쓰는<br /><em className="font-serif font-medium not-italic text-[#c18135]">AI 활용 자료</em>를 모았습니다.</h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#435244] sm:text-lg">서비스를 바로 열고, 실무 프롬프트를 복사하고, 원문 자료까지 내려받으세요. 강의 후에도 이어지는 나만의 업무 도구함입니다.</p>
              <div className="mt-9 flex flex-wrap gap-3"><a href="#tools" className="inline-flex items-center gap-2 rounded-xl bg-[#1f5a45] px-5 py-3.5 text-sm font-bold text-white shadow-[0_9px_20px_rgba(31,90,69,0.2)] transition hover:bg-[#164633] active:scale-[.97]"><BookOpen size={17} /> 자료 둘러보기</a><a href="#prompts" className="inline-flex items-center gap-2 rounded-xl border border-[#b5c4b4] bg-[#fbfcf8]/85 px-5 py-3.5 text-sm font-bold text-[#305b45] transition hover:bg-white active:scale-[.97]"><Clipboard size={17} /> 프롬프트 복사하기</a></div>
            </div>
            <div className="mt-12 flex gap-7 border-t border-[#cbd5ca] pt-6 lg:mt-0 lg:items-end lg:justify-end lg:border-t-0 lg:pt-0"><div><strong className="block font-serif text-3xl text-[#1f5a45]">18</strong><span className="text-xs font-bold text-[#667468]">바로가기 자료</span></div><div><strong className="block font-serif text-3xl text-[#1f5a45]">4</strong><span className="text-xs font-bold text-[#667468]">복사형 프롬프트</span></div><div><strong className="block font-serif text-3xl text-[#1f5a45]">5</strong><span className="text-xs font-bold text-[#667468]">첨부 자료</span></div></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1500px] gap-10 px-5 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-9 lg:py-20">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="flex items-start gap-4"><span className="font-serif text-6xl font-black leading-none tracking-[-0.08em] text-[#1f5a45]/25">01</span><div className="pt-1"><p className="font-mono text-[11px] font-bold tracking-[0.18em] text-[#5f806a]">REFERENCE TOOLS</p><h2 className="mt-3 font-serif text-3xl font-black tracking-[-0.055em] text-[#213428]">탐색의 시작</h2></div></div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#667267]">업무 목적에 맞는 도구를 선택하세요. 새 창에서 바로 열립니다.</p>
            <div className="relative mt-8 hidden border-l border-[#8eab93] pb-4 pl-5 text-xs leading-6 text-[#68756c] lg:block"><span className="absolute -left-[5px] top-0 size-2 rounded-full bg-[#1f5a45] ring-4 ring-[#f7f6f0]" />자료는 첨부 문서의 원문 링크를 기준으로 정리했습니다.<span className="absolute -bottom-1 -left-[4px] size-2 rounded-full bg-[#c18135]" /></div>
          </aside>
          <div id="tools" className="scroll-mt-28">
            <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div className="category-scroll flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="자료 분류">
                {categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category ? "bg-[#1f5a45] text-white" : "border border-[#d7ddd5] bg-[#fffdf8] text-[#5c685d] hover:border-[#8ca895] hover:text-[#1f5a45]"}`}>{category}</button>)}
              </div>
              <label className="relative block w-full max-w-sm"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#768177]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="자료명 또는 주제로 찾기" className="h-11 w-full rounded-xl border border-[#d7ddd5] bg-[#fffdf8] pl-10 pr-4 text-sm outline-none transition placeholder:text-[#8a948a] focus:border-[#1f5a45] focus:ring-4 focus:ring-[#1f5a45]/10" /></label>
            </div>
            <div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-[#536054]"><span className="font-serif text-2xl text-[#1f5a45]">{filteredResources.length}</span>개 자료</p><p className="text-xs text-[#768177]">카드를 선택해 바로 이동하세요</p></div>
            {filteredResources.length ? <div className="border-t-2 border-[#1f5a45]">{filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div> : <div className="border-y border-dashed border-[#9eb3a0] bg-[#fffdf8] px-6 py-14 text-center"><Search className="mx-auto text-[#8da395]" /><p className="mt-4 font-serif text-xl font-bold text-[#405045]">일치하는 자료가 없습니다.</p><button onClick={() => { setQuery(""); setActiveCategory("전체"); }} className="mt-3 text-sm font-bold text-[#1f5a45] underline underline-offset-4">검색 조건 초기화</button></div>}
          </div>
        </section>

        <section id="prompts" className="scroll-mt-24 bg-[#193d30] py-16 text-[#f7f6f0] lg:py-24">
          <div className="mx-auto grid max-w-[1500px] gap-12 px-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-9">
            <aside><div className="flex items-start gap-4"><span className="font-serif text-6xl font-black leading-none tracking-[-0.08em] text-[#b7d7ba]/35">02</span><p className="pt-1 font-mono text-[11px] font-bold tracking-[0.18em] text-[#b7d7ba]">PROMPT LIBRARY</p></div><h2 className="mt-3 font-serif text-4xl font-black leading-tight tracking-[-0.055em]">복사해서<br />바로 쓰는<br /><em className="font-serif font-medium text-[#e4b465]">실무 프롬프트</em></h2><p className="mt-5 max-w-xs text-sm leading-6 text-[#c3d0c6]">원하는 카드를 열고 프롬프트 전체를 복사한 다음, 사용 중인 AI 대화창에 붙여 넣으세요.</p><div className="relative mt-7 hidden border-l border-[#75a07e] pb-3 pl-5 text-xs leading-6 text-[#c3d0c6] lg:block"><span className="absolute -left-[5px] top-0 size-2 rounded-full bg-[#b7d7ba] ring-4 ring-[#193d30]" />복사 버튼은 황토색으로 표시됩니다.</div><div className="mt-8 hidden overflow-hidden rounded-2xl border border-white/10 lg:block"><img src="/manus-storage/ai-fieldnotes-prompts_387d262b.jpg" alt="격자 종이와 북마크를 배치한 프롬프트 학습 이미지" className="h-44 w-full object-cover" /></div></aside>
            <div className="space-y-3">
              {prompts.map((prompt, index) => {
                const isOpen = openPrompt === prompt.id;
                return <article key={prompt.id} className={`overflow-hidden rounded-2xl border transition ${isOpen ? "border-[#9fc7a7] bg-[#f8f7f1] text-[#263128]" : "border-white/15 bg-white/[.045] text-white"}`}>
                  <button onClick={() => setOpenPrompt(isOpen ? "" : prompt.id)} className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"><span className={`font-mono text-xs tracking-[0.12em] ${isOpen ? "text-[#568164]" : "text-[#a5c8ab]"}`}>{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className={`block text-[11px] font-bold tracking-[0.12em] ${isOpen ? "text-[#718076]" : "text-[#c4d8c8]"}`}>{prompt.eyebrow}</span><strong className="mt-1 block font-serif text-xl tracking-[-0.035em]">{prompt.title}</strong></span><span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-[#e6efe5] text-[#1f5a45]" : "bg-white/10 text-white"}`}>{isOpen ? <X size={16} /> : <ArrowDownToLine size={16} />}</span></button>
                  {isOpen && <div className="border-t border-[#d8e0d7] px-5 pb-5 pt-5 sm:px-6"><p className="max-w-3xl text-sm leading-6 text-[#637066]">{prompt.description}</p><div className="mt-4 overflow-hidden rounded-xl border border-[#d7dfd5] bg-[#fcfcf8]"><div className="flex items-center justify-between border-b border-[#e1e6df] bg-[#f2f5ef] px-4 py-2.5"><span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#617166]">PROMPT TEMPLATE</span><Button onClick={() => copyPrompt(prompt)} size="sm" className="h-8 gap-1.5 bg-[#c18135] px-3 text-xs font-bold text-white hover:bg-[#aa6e2a]">{copied === prompt.id ? <><Check size={14} /> 복사됨</> : <><Clipboard size={14} /> 전체 복사</>}</Button></div><pre className="max-h-72 overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-[12px] leading-6 text-[#455248] sm:px-5">{prompt.prompt}</pre></div></div>}
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="download" className="scroll-mt-24 bg-[#eef1e9] py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-9">
            <div className="hidden overflow-hidden rounded-2xl border border-[#d7ded3] bg-white lg:block"><img src="/manus-storage/ai-fieldnotes-download_c9174261.jpg" alt="종이 문서 폴더와 녹색 탭으로 구성된 자료 다운로드 이미지" className="aspect-[3/2] w-full object-cover" /></div>
            <div><div className="flex items-start gap-4"><span className="font-serif text-6xl font-black leading-none tracking-[-0.08em] text-[#1f5a45]/25">03</span><p className="pt-1 font-mono text-[11px] font-bold tracking-[0.18em] text-[#5c8068]">ATTACHED MATERIALS</p></div><h2 className="mt-3 font-serif text-4xl font-black tracking-[-0.055em] text-[#1f3127]">첨부 자료를<br />내 도구함에 보관하세요.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-[#667267]">교육 프로그램 개발과 실무 활용에 필요한 자료를 각각 내려받아 오프라인에서도 활용할 수 있습니다.</p><div className="mt-7 border-t-2 border-[#1f5a45] bg-[#fffdf8]">{downloadFiles.map((file) => <div key={file.id} className="grid gap-3 border-b border-[#dce3d9] py-4 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:items-center sm:gap-4"><span className="font-serif text-3xl font-black tracking-[-0.07em] text-[#1f5a45]/60">{file.id}</span><span className="min-w-0"><strong className="block font-serif text-lg tracking-[-0.035em] text-[#27352b]">{file.title}</strong><span className="mt-0.5 block text-xs leading-5 text-[#738076]">{file.description}</span></span><a href={file.href} download className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c18135] px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_6px_14px_rgba(193,129,53,0.14)] transition hover:bg-[#aa6e2a] active:scale-[.97]"><span className="font-mono text-[10px] tracking-[0.08em]">{file.format}</span><FileDown size={15} /> 내려받기</a></div>)}</div></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#cfd7cd] bg-[#f7f6f0] py-8"><div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 text-xs text-[#6e796f] sm:flex-row sm:items-center sm:justify-between lg:px-9"><p className="font-medium">한국농업기술진흥원 · AI 업무활용 학습자료</p><p>링크는 새 창에서 열립니다. 서비스 이용 전 각 서비스의 이용 약관을 확인하세요.</p></div></footer>
    </div>
  );
}
