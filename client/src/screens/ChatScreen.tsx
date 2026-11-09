import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Modal,
  Platform 
} from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { ChatRoom, ChatMessage } from "../types";

const STAGES = ["요청", "소유자 확인", "현장 방문", "조건 협의", "계약"];

export const ChatScreen: React.FC = () => {
  const { chats, setActiveTab } = useApp();
  
  // view: "LIST" | "ROOM"
  const [viewMode, setViewMode] = useState<"LIST" | "ROOM">("ROOM");
  const [activeRoom, setActiveRoom] = useState<ChatRoom>(chats[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(activeRoom.messages);
  const [inputText, setInputText] = useState("");

  // 현장 방문 일정 잡기 모달 상태
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026.11.13(금) 오후 2:00");
  const [officerInvited, setOfficerInvited] = useState(activeRoom.officerJoined);

  const availableDates = [
    "2026.11.13(금) 오후 2:00",
    "2026.11.14(토) 오전 11:00",
    "2026.11.16(월) 오후 3:30",
  ];

  const handleSelectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setMessages(room.messages);
    setOfficerInvited(room.officerJoined);
    setViewMode("ROOM");
  };

  const handleSendMessage = (customText?: string, attachment?: any) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "youth-me",
      senderName: "나 (청년 창업가)",
      senderRole: "YOUTH",
      text: textToSend,
      timestamp: "방금 전",
      attachmentType: attachment?.type,
      attachmentData: attachment?.data,
    };

    setMessages(prev => [...prev, newMsg]);
    if (!customText) setInputText("");

    // 소유자 자동 답장 시뮬레이션
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: "owner-auto",
        senderName: activeRoom.ownerName,
        senderRole: "OWNER",
        text: "네 청년 대표님, 보내주신 내용 잘 확인했습니다. 정성껏 준비해주셔서 믿음이 가네요! 현장에서 뵙고 자세한 이야기 나누겠습니다.",
        timestamp: "방금 전",
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  // 현장 방문 일정 확정
  const handleConfirmSchedule = () => {
    setIsScheduleModalVisible(false);
    handleSendMessage(
      `📅 [현장 방문 확정] 소유자님과 ${selectedDate}에 현장 방문 미팅 일정을 잡았습니다. 현장에서 뵙겠습니다!`
    );
  };

  // 청년창창센터 담당자 초대
  const handleInviteOfficer = () => {
    if (officerInvited) return;
    setOfficerInvited(true);
    const officerMsg: ChatMessage = {
      id: `msg-officer-${Date.now()}`,
      senderId: "officer-01",
      senderName: "이수진 매니저 (태백시 청년창창센터)",
      senderRole: "OFFICER",
      text: "🏛️ 안녕하세요! 태백시 청년창창센터 공간매칭 전담 매니저입니다. 청년 창업가와 소유자님의 안심 계약을 위해 현장 방문 시 시설 점검 및 시 보조금(최대 4,500만원) 지원 서류 검토를 동행 지원하겠습니다.",
      timestamp: "방금 전",
    };
    setMessages(prev => [...prev, officerMsg]);
  };

  // 1. 협의 목록 화면
  if (viewMode === "LIST") {
    return (
      <View style={styles.container}>
        <Header title="소유자 협의 목록" />
        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <View style={styles.listIntro}>
            <Text style={styles.listIntroTitle}>🤝 믿고 맡길 수 있는 연결</Text>
            <Text style={styles.listIntroDesc}>
              AI 검토 리포트와 청년 프로필로 소유자와 협의하고, 청년창창센터가 함께합니다.
            </Text>
          </View>

          {chats.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomCard}
              onPress={() => handleSelectRoom(room)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: room.spaceImage }} style={styles.roomCardThumb} />
              <View style={styles.roomCardContent}>
                <View style={styles.roomCardTop}>
                  <Text style={styles.roomCardOwner}>{room.ownerName}</Text>
                  <View style={styles.roomCardStatusPill}>
                    <Text style={styles.roomCardStatusText}>{room.status}</Text>
                  </View>
                </View>
                <Text style={styles.roomCardSpaceTitle} numberOfLines={1}>
                  {room.spaceTitle}
                </Text>
                <Text style={styles.roomCardLastMsg} numberOfLines={1}>
                  {room.lastMessage}
                </Text>
              </View>
              <Text style={styles.roomCardTime}>{room.lastMessageTime}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // 2. 협의 상세 = 채팅 화면
  return (
    <View style={styles.container}>
      <Header 
        title={`${activeRoom.ownerName.split(" ")[0]}님과의 협의`} 
        onBack={() => setViewMode("LIST")}
      />

      {/* 상단 진행 단계 바 (요청 → 소유자 확인 → 현장 방문 → 조건 협의 → 계약) */}
      <View style={styles.stepStatusBar}>
        <View style={styles.stepProgressRow}>
          {STAGES.map((stg, idx) => {
            const isPassed = idx < activeRoom.currentStepIndex;
            const isCurrent = idx === activeRoom.currentStepIndex;
            return (
              <React.Fragment key={stg}>
                <View style={styles.stageItem}>
                  <View style={[
                    styles.stageDot,
                    isPassed && styles.stageDotPassed,
                    isCurrent && styles.stageDotCurrent,
                  ]}>
                    <Text style={[
                      styles.stageDotText,
                      (isPassed || isCurrent) && styles.stageDotTextActive,
                    ]}>
                      {isPassed ? "✓" : idx + 1}
                    </Text>
                  </View>
                  <Text style={[
                    styles.stageText,
                    isCurrent && styles.stageTextCurrent,
                  ]}>
                    {stg}
                  </Text>
                </View>
                {idx < STAGES.length - 1 && (
                  <View style={[
                    styles.stageBarLine,
                    idx < activeRoom.currentStepIndex && styles.stageBarLinePassed,
                  ]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* 동행 배너 */}
        {officerInvited && (
          <View style={styles.officerBadgeBanner}>
            <Text style={styles.officerBadgeText}>
              🛡️ <Text style={{ fontWeight: "800" }}>태백시 청년창창센터</Text> 전담 매니저 동행 중
            </Text>
          </View>
        )}
      </View>

      {/* 대화 메시지 스크롤뷰 */}
      <ScrollView 
        style={styles.chatScroll} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isMe = msg.senderRole === "YOUTH";
          const isOfficer = msg.senderRole === "OFFICER";

          return (
            <View 
              key={msg.id} 
              style={[
                styles.messageWrap,
                isMe ? styles.messageWrapMe : styles.messageWrapOther,
                isOfficer && styles.messageWrapOfficer
              ]}
            >
              {!isMe && (
                <Text style={styles.senderLabel}>
                  {msg.senderName}
                </Text>
              )}

              <View style={[
                styles.speechBubble,
                isMe ? styles.speechBubbleMe : styles.speechBubbleOther,
                isOfficer && styles.speechBubbleOfficer
              ]}>
                <Text style={[styles.msgText, isMe && styles.msgTextMe]}>
                  {msg.text}
                </Text>

                {/* 첫 메시지 자동 첨부: AI 검토 리포트 카드 */}
                {msg.attachmentType === "REPORT" && (
                  <View style={styles.reportAttachmentCard}>
                    <Text style={styles.attachCardHeader}>📊 AI 창업 검토 리포트 첨부됨</Text>
                    <Text style={styles.attachItem}>• 종합 적합도: 88점 (우수)</Text>
                    <Text style={styles.attachItem}>• 진단 요약: 골조 양호, 배관/전기 승압 필요</Text>
                    <Text style={styles.attachItem}>• 예상 수리비: 약 1,450만원</Text>
                    <TouchableOpacity 
                      style={styles.viewReportBtn}
                      onPress={() => setActiveTab("AI_REVIEW")}
                    >
                      <Text style={styles.viewReportBtnText}>리포트 전체 보기 →</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* 첫 메시지 자동 첨부: 청년 창업 프로필 카드 */}
                {msg.attachmentType === "PROFILE" && (
                  <View style={styles.profileAttachmentCard}>
                    <Text style={styles.attachCardHeader}>🌱 청년 창업가 운영 약속 프로필</Text>
                    <Text style={styles.attachItem}>• 창업가: 박도현 (28세 / F&B 경력 4년)</Text>
                    <Text style={styles.attachItem}>• 창업 업종: 탄광 문화 수제맥주 브루펍</Text>
                    <Text style={styles.attachItem}>• 약속 조건: 최소 3년 이상 장기 운영 보장</Text>
                    <Text style={styles.attachItem}>• 관리 계획: 벽돌 외관 보존 및 시설 개보수</Text>
                  </View>
                )}
              </View>

              <Text style={styles.msgTime}>{msg.timestamp}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* 퀵 액션 버튼 바 (현장 방문 일정 잡기 / 담당자 초대) */}
      <View style={styles.actionToolBar}>
        <TouchableOpacity 
          style={styles.scheduleActionBtn}
          onPress={() => setIsScheduleModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.scheduleActionText}>📅 현장 방문 일정 잡기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.officerActionBtn, officerInvited && styles.officerActionBtnDisabled]}
          onPress={handleInviteOfficer}
          disabled={officerInvited}
          activeOpacity={0.8}
        >
          <Text style={styles.officerActionText}>
            {officerInvited ? "🏛️ 담당자 동행 참여 중" : "🏛️ 청년창창센터 담당자 초대"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 하단 메시지 입력창 */}
      <View style={styles.chatInputBar}>
        <TextInput
          style={styles.chatTextInput}
          placeholder="소유자님께 궁금한 점이나 의견을 남겨보세요..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSendMessage()}
        />
        <TouchableOpacity 
          style={styles.chatSendBtn}
          onPress={() => handleSendMessage()}
          activeOpacity={0.85}
        >
          <Text style={styles.chatSendBtnText}>전송</Text>
        </TouchableOpacity>
      </View>

      {/* 현장 방문 일정 잡기 모달 */}
      <Modal
        visible={isScheduleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.scheduleModalBox}>
            <Text style={styles.modalTitle}>📅 현장 방문 일정 선택</Text>
            <Text style={styles.modalSub}>소유자님과 함께 공간을 직접 살펴볼 일정을 선택하세요.</Text>

            <View style={styles.dateOptionList}>
              {availableDates.map((dateStr) => {
                const isSelected = selectedDate === dateStr;
                return (
                  <TouchableOpacity
                    key={dateStr}
                    style={[styles.dateOptionCard, isSelected && styles.dateOptionSelected]}
                    onPress={() => setSelectedDate(dateStr)}
                  >
                    <Text style={[styles.dateOptionText, isSelected && styles.dateOptionTextSelected]}>
                      {dateStr}
                    </Text>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalNoticeBox}>
              <Text style={styles.modalNoticeText}>
                💡 청년창창센터 담당자도 일정에 맞춰 현장에 함께 방문합니다.
              </Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setIsScheduleModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmBtn}
                onPress={handleConfirmSchedule}
              >
                <Text style={styles.modalConfirmText}>일정 확정 및 전송</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollBody: {
    flex: 1,
    padding: 16,
  },
  listIntro: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  listIntroTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  listIntroDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  roomCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  roomCardThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
  },
  roomCardContent: {
    flex: 1,
  },
  roomCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  roomCardOwner: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  roomCardStatusPill: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  roomCardStatusText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  roomCardSpaceTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  roomCardLastMsg: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  roomCardTime: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginLeft: 6,
  },
  stepStatusBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  stepProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageItem: {
    alignItems: "center",
  },
  stageDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stageDotPassed: {
    backgroundColor: COLORS.primarySoft,
  },
  stageDotCurrent: {
    backgroundColor: COLORS.primary,
  },
  stageDotText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  stageDotTextActive: {
    color: "#FFFFFF",
  },
  stageText: {
    fontSize: 9,
    color: COLORS.textTertiary,
    marginTop: 3,
  },
  stageTextCurrent: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  stageBarLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 3,
    marginBottom: 12,
  },
  stageBarLinePassed: {
    backgroundColor: COLORS.primary,
  },
  officerBadgeBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    alignItems: "center",
  },
  officerBadgeText: {
    fontSize: 11,
    color: "#1D4ED8",
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrap: {
    marginBottom: 14,
    maxWidth: "84%",
  },
  messageWrapMe: {
    alignSelf: "flex-end",
  },
  messageWrapOther: {
    alignSelf: "flex-start",
  },
  messageWrapOfficer: {
    alignSelf: "center",
    maxWidth: "94%",
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  speechBubble: {
    borderRadius: 14,
    padding: 12,
  },
  speechBubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  speechBubbleOther: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 2,
  },
  speechBubbleOfficer: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  msgText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
  },
  msgTextMe: {
    color: "#FFFFFF",
  },
  msgTime: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  reportAttachmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  profileAttachmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  attachCardHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  attachItem: {
    fontSize: 11,
    color: "#374151",
    lineHeight: 16,
  },
  viewReportBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  viewReportBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  actionToolBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 8,
  },
  scheduleActionBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6DCFF",
  },
  scheduleActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  officerActionBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  officerActionBtnDisabled: {
    opacity: 0.6,
  },
  officerActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  chatTextInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  chatSendBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 8,
  },
  chatSendBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scheduleModalBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  dateOptionList: {
    gap: 8,
    marginBottom: 14,
  },
  dateOptionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },
  dateOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  dateOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  dateOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  checkIcon: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  modalNoticeBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalNoticeText: {
    fontSize: 11,
    color: "#1E40AF",
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
