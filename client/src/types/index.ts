export type UserRole = "YOUTH" | "OWNER";

export type SpaceType = 
  | "VACANT_HOUSE"      // 빈집
  | "VACANT_STORE"      // 빈 상가
  | "WAREHOUSE_FACTORY" // 창고·공장
  | "CLOSED_SCHOOL"     // 폐교·공공시설
  | "ALL";              // 전체

export type SpaceCondition = 
  | "READY"        // 바로 사용 가능
  | "MINOR_REPAIR" // 일부 수리 필요
  | "MAJOR_REPAIR";// 대규모 수리 필요

export type ConditionGrade = "A" | "B" | "C";

export type RiskLevel = "SAFE" | "CAUTION" | "DANGER"; // 초록 / 노랑 / 빨강

export interface Space {
  id: string;
  title: string;
  type: SpaceType;
  typeLabel: string;
  neighborhood: string; // 황지동, 장성동, 철암동 등
  address: string;
  areaM2: number;
  areaPyeong: number;
  rentType: "MONTHLY" | "JEONSE" | "FREE_NEGOTIATION";
  rentTypeLabel: string;
  deposit: number; // 단위: 만원
  monthlyRent: number; // 단위: 만원 (무상이면 0)
  condition: SpaceCondition;
  conditionLabel: string;
  conditionGrade: ConditionGrade;
  images: string[];
  tags: string[];
  canAiReview: boolean;
  canOwnerDiscuss: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyAmenities: {
    name: string;
    distance: string;
  }[];
  ownerName: string;
  ownerPhoneMasked: string;
  description: string;
  recommendedUses: string[];
  estimatedRepairCost?: string;
}

export interface StartupStory {
  id: string;
  founderName: string;
  founderAge: string;
  businessName: string;
  businessType: string;
  location: string;
  image: string;
  quote: string;
  spaceChallenge: string; // "공간 구할 때 어려웠던 점"
  storyQna: {
    question: string;
    answer: string;
  }[];
}

export interface SupportProgram {
  id: string;
  title: string;
  organizingBody: string;
  dDay: number; // 남은 일수
  deadline: string;
  grantAmount: string; // 예: "최대 5,000만원"
  targetAge: string;
  targetConditions: string;
  category: string;
  badgeColor?: string;
  description: string;
}

export interface ReviewReport {
  id: string;
  spaceId: string;
  spaceTitle: string;
  businessNameCandidate: string;
  createdAt: string;
  overallScore: number;
  riskLevel: RiskLevel;
  overallVerdict: string;
  diagnosis: {
    agingStatus: string;
    repairScope: string;
    estimatedRepairCost: string;
    hiddenCosts: {
      item: string;
      risk: "LOW" | "MEDIUM" | "HIGH";
      description: string;
    }[];
  };
  feasibility: {
    monthlyFootTraffic: string;
    touristTraffic: string;
    competitorCount: number;
    estimatedMonthlyRevenue: string;
    initialInvestment: string;
    breakEvenMonths: number;
    warningMessage?: string;
  };
  recommendations: {
    title: string;
    taebaekResource: string; // 탄광 역사, 고원 자연, 특산물 등
    matchScore: number;
    reason: string;
  }[];
  remodelPreview: {
    beforeImage: string;
    afterImage: string;
    concept: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "YOUTH" | "OWNER" | "OFFICER"; // 청년 / 소유자 / 청년창창센터 담당자
  text: string;
  timestamp: string;
  attachmentType?: "REPORT" | "PROFILE" | "VISIT_SCHEDULE";
  attachmentData?: any;
}

export interface ChatRoom {
  id: string;
  spaceId: string;
  spaceTitle: string;
  ownerName: string;
  youthName: string;
  spaceImage: string;
  lastMessage: string;
  lastMessageTime: string;
  status: "요청" | "소유자 확인" | "현장 방문" | "조건 협의" | "계약";
  currentStepIndex: number;
  officerJoined: boolean;
  messages: ChatMessage[];
}

export type MainTab = "HOME" | "EXPLORE" | "AI_REVIEW" | "CHAT" | "MY_STARTUP";
export type OwnerTab = "HOME" | "MY_SPACE" | "REQUESTS" | "MY_PAGE";
