import { ReviewReport } from "../types";

export const REVIEW_REPORTS_DATA: ReviewReport[] = [
  {
    id: "report-01",
    spaceId: "space-01",
    spaceTitle: "철암 탄광역사거리 앞 붉은 벽돌 레트로 상가",
    businessNameCandidate: "탄광 아카이브 & 로컬 브루펍 '검은돌'",
    createdAt: "2026.11.08",
    overallScore: 88,
    riskLevel: "SAFE",
    overallVerdict: "적합 판정: 철암역 도보 3분 역세권 및 탄광역사촌 관광객 유입 우수. 외벽 보존 상태 양호하나 배관 일부 교체 권장.",
    diagnosis: {
      agingStatus: "준공 38년차, 기본 H빔 및 조적벽체 양호, 누수 흔적 없음",
      repairScope: "화장실 배관 교체, 주방 방수 턱 공사, 전기 5kW -> 10kW 승압",
      estimatedRepairCost: "1,450만원 (지원사업 활용 시 자부담 약 290만원)",
      hiddenCosts: [
        { item: "전기 용량 증설", risk: "MEDIUM", description: "주방 전력 소모 감안 시 5kW 승압 한전 불입금 약 120만원 발생" },
        { item: "하수 배관 역류 방지", risk: "LOW", description: "기존 관로 구배 양호, 트랩 교체 약 35만원" },
        { item: "용도변경 인허가", risk: "LOW", description: "제2종 근린생활시설(일반음식점) 기등록으로 변경 비용 0원" }
      ]
    },
    feasibility: {
      monthlyFootTraffic: "일평균 640명 (주말 1,820명)",
      touristTraffic: "협곡열차(V-train) 주말 관광객 중심",
      competitorCount: 1,
      estimatedMonthlyRevenue: "1,850만원",
      initialInvestment: "4,200만원",
      breakEvenMonths: 7,
      warningMessage: "동절기(12~2월) 야간 도보 관광객 감소 대비 낮 시간 브런치 및 온라인 굿즈 판매 병행 권장"
    },
    recommendations: [
      {
        title: "탄광 갱도 수제맥주 브루어리 & 바",
        taebaekResource: "철암 탄광 역사 & 광부의 땀방울 스토리텔링",
        matchScore: 94,
        reason: "철암역 내방객의 78%가 독특한 로컬 F&B 경험을 희망함"
      },
      {
        title: "석탄재 업사이클링 오브제 & 로컬 편집숍",
        taebaekResource: "폐광 폐자재 및 광산 유물 아카이빙",
        matchScore: 87,
        reason: "주변 기념품점 부재로 독점적 관광 굿즈 수요 흡수 가능"
      },
      {
        title: "레트로 흑백 필름 사진관 & 카페",
        taebaekResource: "80년대 보존 철암 탄광촌 골목 풍경",
        matchScore: 82,
        reason: "청년층 레트로 감성 여행 필수 코스로 포토스팟 화제성 높음"
      }
    ],
    remodelPreview: {
      beforeImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      concept: "노출 붉은 벽돌과 블랙 스틸 프레임을 살린 인더스트리얼 로컬 펍"
    }
  },
  {
    id: "report-02",
    spaceId: "space-03",
    spaceTitle: "장성 탄광마을 옛 광부사택 적벽돌 공간",
    businessNameCandidate: "사택 도예 & 목공 문화공방 '화롯가'",
    createdAt: "2026.11.02",
    overallScore: 71,
    riskLevel: "CAUTION",
    overallVerdict: "조건부 적합: 2년 무상임대 혜택은 탁월하나, 지붕 방수 및 단열재 전면 시공 필수. 지자체 공간개선 지원금 선확보 필요.",
    diagnosis: {
      agingStatus: "준공 45년차, 지붕 처마 부식 및 화장실 노후",
      repairScope: "지붕 칼라강판 덧씌우기, 창호 이중창 교체, 보일러 배관 신설",
      estimatedRepairCost: "2,800만원 (폐광지역 보조금 신청 권장)",
      hiddenCosts: [
        { item: "지붕 방수 및 단열", risk: "HIGH", description: "겨울철 영하 15도 대비 외풍 차단 단열재 필수 (약 1,100만원)" },
        { item: "상하수도 동파 방지", risk: "MEDIUM", description: "열선 시공 및 노출 배관 보온재 처리 (약 150만원)" },
        { item: "건축물 용도 확인", risk: "LOW", description: "주택에서 1종근생(공방) 용도변경 신고 필요 (설계사무소 대행 약 80만원)" }
      ]
    },
    feasibility: {
      monthlyFootTraffic: "일평균 280명",
      touristTraffic: "장성 중앙시장 방문객 및 주말 체험 예약객",
      competitorCount: 0,
      estimatedMonthlyRevenue: "920만원",
      initialInvestment: "3,500만원 (임대료 0원 효과)",
      breakEvenMonths: 11,
      warningMessage: "워크숍/원데이클래스 사전 예약제와 단체 출장 강의 매출 구조 구축 필수"
    },
    recommendations: [
      {
        title: "태백 백토 활용 도예 & 테라피 공방",
        taebaekResource: "태백산맥 도자기 점토 및 고원 허브",
        matchScore: 89,
        reason: "경쟁 업체가 전무하며 힐링 체험 수요 흡수 최적"
      },
      {
        title: "폐목재 업사이클링 목공 스튜디오",
        taebaekResource: "탄광 동발목 및 폐가옥 고목재 리사이클",
        matchScore: 84,
        reason: "소음 방해 없는 단독 필지로 톱/대패 작업 자유로움"
      },
      {
        title: "마을 주민과 함께하는 은빛 그림책 갤러리",
        taebaekResource: "장성 어르신 생애사 구술 기록",
        matchScore: 78,
        reason: "지역 상생 및 문화도시 태백 거점 공간으로 지원금 획득 용이"
      }
    ],
    remodelPreview: {
      beforeImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      concept: "아늑한 웜톤 우드 인테리어와 햇살이 쏟아지는 통창 도예 작업실"
    }
  },
  {
    id: "report-03",
    spaceId: "space-02",
    spaceTitle: "황지연못 도심 안쪽 햇살 드는 단독주택",
    businessNameCandidate: "고원 정원 프라이빗 다이닝 & 티룸",
    createdAt: "2026.10.28",
    overallScore: 92,
    riskLevel: "SAFE",
    overallVerdict: "매우 우수: 도심 인프라 및 황지연못 도보권. 수리 비용 적고 즉시 개업 가능.",
    diagnosis: {
      agingStatus: "준공 20년차, 최근 샷시 리모델링 완료, 상태 A급",
      repairScope: "조명 및 내부 페인트, 싱크대 상판 교체 수준",
      estimatedRepairCost: "450만원",
      hiddenCosts: [
        { item: "간판 및 외부 조명", risk: "LOW", description: "골목 진입 유도용 돌출 간판 (약 80만원)" },
        { item: "화장실 인테리어 소품", risk: "LOW", description: "수전 및 거울 교체 (약 40만원)" }
      ]
    },
    feasibility: {
      monthlyFootTraffic: "일평균 1,450명",
      touristTraffic: "황지연못 축제 및 도심 비즈니스 출장객",
      competitorCount: 3,
      estimatedMonthlyRevenue: "2,200만원",
      initialInvestment: "2,600만원",
      breakEvenMonths: 5
    },
    recommendations: [
      {
        title: "태백산 약초 & 고원 티하우스",
        taebaekResource: "오미자, 겨우살이, 곰취를 블렌딩한 프리미엄 티",
        matchScore: 95,
        reason: "도심 힐링 공간을 찾는 2040 여성 및 여행객 타깃 적합"
      },
      {
        title: "로컬 스테이 & 프라이빗 파티룸",
        taebaekResource: "고원 도시의 별빛 밤하늘과 마당 바비큐",
        matchScore: 90,
        reason: "황지 도심 내 마당 딸린 독채 숙소 희소성 높음"
      },
      {
        title: "태백 한우 타파스 & 내추럴 와인 바",
        taebaekResource: "태백 한우 부속육과 특산 식자재 페어링",
        matchScore: 85,
        reason: "황지자유시장 인근 야간 F&B 킬러 콘텐츠 부재"
      }
    ],
    remodelPreview: {
      beforeImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      concept: "따뜻한 베이지 미장과 야외 자갈 마당 정원이 어우러진 감성 티하우스"
    }
  }
];
