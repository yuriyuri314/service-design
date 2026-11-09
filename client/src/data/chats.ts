import { ChatRoom } from "../types";

export const CHATS_DATA: ChatRoom[] = [
  {
    id: "chat-01",
    spaceId: "space-01",
    spaceTitle: "철암 탄광역사거리 앞 붉은 벽돌 레트로 상가",
    ownerName: "김철수 (소유자)",
    youthName: "박도현 (청년 창업가)",
    spaceImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    lastMessage: "안녕하세요! 이번 주 금요일 오후 2시에 현장에서 뵙겠습니다.",
    lastMessageTime: "오후 3:45",
    status: "현장 방문",
    currentStepIndex: 2, // 0: 요청, 1: 소유자 확인, 2: 현장 방문, 3: 조건 협의, 4: 계약
    officerJoined: true,
    messages: [
      {
        id: "msg-01",
        senderId: "system",
        senderName: "시스템",
        senderRole: "OFFICER",
        text: "협의 요청이 시작되었습니다. 청년 창업자의 AI 검토 리포트와 프로필이 첨부되었습니다.",
        timestamp: "2026.11.08 10:00",
        attachmentType: "REPORT",
        attachmentData: {
          reportId: "report-01",
          score: 88,
          verdict: "적합 판정: 철암역 인근 로컬 브루펍 창업",
          estimatedRepairCost: "약 1,450만원"
        }
      },
      {
        id: "msg-02",
        senderId: "youth-01",
        senderName: "박도현 (청년)",
        senderRole: "YOUTH",
        text: "안녕하세요 사장님! 철암의 옛 탄광 이야기를 담은 로컬 수제맥주 브루펍 창업을 준비 중인 청년 박도현입니다. 올려주신 공간이 저희 콘셉트와 완벽히 맞아 협의를 요청드렸습니다. 첨부된 AI 검토 리포트에서 시설 보수 계획과 예상 매출을 확인해 보실 수 있습니다.",
        timestamp: "2026.11.08 10:05",
        attachmentType: "PROFILE",
        attachmentData: {
          businessType: "로컬 F&B / 수제맥주 펍",
          operationPeriod: "최소 3년 이상 약속",
          remodelPlan: "붉은 벽돌 보존 및 배관/전기 리모델링"
        }
      },
      {
        id: "msg-03",
        senderId: "owner-01",
        senderName: "김철수 (소유자)",
        senderRole: "OWNER",
        text: "보내준 리포트를 꼼꼼히 읽어봤습니다. 5년 동안 비어있어 마음이 쓰였는데, 건물을 아끼면서 동네에 활기를 불어넣겠다는 계획이 참 마음에 듭니다. 배관 수리는 나도 일부 부담해줄 용의가 있어요.",
        timestamp: "2026.11.08 14:20"
      },
      {
        id: "msg-04",
        senderId: "system",
        senderName: "청년창창센터",
        senderRole: "OFFICER",
        text: "📢 [동행 협의] 태백시 청년창창센터 이수진 전담 매니저가 채팅방에 입장했습니다. 현장 방문 시 시설 진단과 시 보조금 매칭을 함께 지원합니다.",
        timestamp: "2026.11.08 15:00"
      },
      {
        id: "msg-05",
        senderId: "officer-01",
        senderName: "이수진 (청년창창센터)",
        senderRole: "OFFICER",
        text: "안녕하세요 소유자님, 청년 대표님! 태백시 청년창업 전담 매니저입니다. 이번 주 현장 방문 시 저도 동행하여 건축물 점검과 태백시 공간개선 지원금(최대 4,500만원) 서류 준비를 돕겠습니다.",
        timestamp: "2026.11.08 15:05"
      },
      {
        id: "msg-06",
        senderId: "owner-01",
        senderName: "김철수 (소유자)",
        senderRole: "OWNER",
        text: "시청 센터에서 함께 나와준다면 훨씬 안심이 되네요. 이번 주 금요일 오후 2시에 건물 앞에서 만납시다.",
        timestamp: "2026.11.08 15:40"
      },
      {
        id: "msg-07",
        senderId: "youth-01",
        senderName: "박도현 (청년)",
        senderRole: "YOUTH",
        text: "네 감사합니다! 이번 주 금요일 오후 2시에 현장에서 뵙겠습니다.",
        timestamp: "2026.11.08 15:45"
      }
    ]
  },
  {
    id: "chat-02",
    spaceId: "space-03",
    spaceTitle: "장성 탄광마을 옛 광부사택 적벽돌 공간",
    ownerName: "박동진 (소유자)",
    youthName: "이지원 (청년 창업가)",
    spaceImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    lastMessage: "지붕 수리 지원사업 신청 서류 검토 중입니다.",
    lastMessageTime: "어제",
    status: "조건 협의",
    currentStepIndex: 3,
    officerJoined: true,
    messages: [
      {
        id: "msg-11",
        senderId: "system",
        senderName: "시스템",
        senderRole: "OFFICER",
        text: "현장 방문이 완료되었으며 현재 '조건 협의(임대료 및 무상 기간)' 단계입니다.",
        timestamp: "2026.11.05 11:00"
      },
      {
        id: "msg-12",
        senderId: "youth-02",
        senderName: "이지원 (청년)",
        senderRole: "YOUTH",
        text: "어르신, 지난번 사택 현장에서 따뜻하게 맞아주셔서 감사합니다. 도예 공방으로 쓸 계획서와 지붕 방수 견적서를 청년창창센터와 함께 뽑았습니다.",
        timestamp: "2026.11.06 13:20"
      },
      {
        id: "msg-13",
        senderId: "owner-02",
        senderName: "박동진 (소유자)",
        senderRole: "OWNER",
        text: "2년 무상으로 쓰고, 그 뒤에도 착한 임대료로 약속할 테니 예쁘게 고쳐서 오래오래 장사해 줘요.",
        timestamp: "2026.11.06 14:00"
      }
    ]
  }
];
